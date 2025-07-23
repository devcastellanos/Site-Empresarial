"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/context/AuthContext";
import { User } from "@/lib/interfaces";
import {
  crearMovimiento,
  obtenerMisMovimientos,
} from "@/services/movementsService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { opcionesPorIncidencia } from "@/lib/movimientos";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import Image from "next/image";

function RegisterCheckInCheckOut() {
  const { user } = useAuth();
  const currentUser = user as unknown as User;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filtrarPorFecha, setFiltrarPorFecha] = useState(false);
  const [registros, setRegistros] = useState<{ date: string; type: "Entrada" | "Salida"; time: string }[]>([]);
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empleado, setEmpleado] = useState<User | null>(null);
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [movimientosSolicitados, setMovimientosSolicitados] = useState<any[]>([]);
  const [opcionesMovimiento, setOpcionesMovimiento] = useState<string[]>([]);
  const [subordinados, setSubordinados] = useState<User[]>([]);
  const [asistenciasPorEmpleado, setAsistenciasPorEmpleado] = useState<Record<string, any[]>>({});
  type Incident = {
    numeroEmpleado: number;
    fecha: Date;
    tipoMovimiento: string;
    horaEntradaReal?: string;
    horaSalidaReal?: string;
  };
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [comments, setComments] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
    const [hasError, setHasError] = useState(false);

  const diasMap: Record<string, string> = {
    "Dom": "Domingo",
    "Lun": "Lunes",
    "Mar": "Martes",
    "Mi?": "Miércoles",
    "Jue": "Jueves",
    "Vie": "Viernes",
    "Sáb": "Sábado",
    "Sab": "Sábado",
  };

  const fetchMovimientos = useCallback(async () => {
  if (!user || !user.num_empleado) return;
  const movimientos = await obtenerMisMovimientos(user.num_empleado);
  setMovimientosSolicitados(movimientos);
}, [user]);

const fetchAsistencias = useCallback(async () => {
  if (!currentUser || !currentUser.Personal) return;

  const todosLosEmpleados = [currentUser, ...subordinados];

  try {
    const resultados = await Promise.all(
      todosLosEmpleados.map(async (emp) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/asistencia?codigo=${emp.Personal}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return { Personal: emp.Personal, data: json.data || [] };
      })
    );

    const asistenciasMap: Record<string, any[]> = {};
    resultados.forEach(({ Personal, data }) => {
      asistenciasMap[Personal.toString()] = data;
    });

    setAsistenciasPorEmpleado(asistenciasMap);

    // Asistencia individual del usuario actual
    setAsistencias(asistenciasMap[currentUser.Personal.toString()] || []);
  } catch (error) {
    console.error("Error al obtener asistencias de subordinados:", error);
  } finally {
    setLoading(false);
  }
}, [currentUser, subordinados]);


useEffect(() => {
  if (subordinados.length) {
    fetchAsistencias();
  }
}, [subordinados, fetchAsistencias]);


useEffect(() => {
  const fetchSubordinados = async () => {
    if (!currentUser?.Personal) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/monitoreo-subordinados?num_empleado=${currentUser.Personal}`);
      const json = await res.json();
      setSubordinados(json.data || []);
    } catch (error) {
      console.error("Error al obtener subordinados:", error);
    }
  };

  fetchSubordinados();
}, [currentUser?.Personal]);

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/all`);
        const data = await response.json();
        const employeeData = data.find((u: any) => Number(u.Personal) === Number(user.num_empleado));
        setEmpleado(employeeData);
      } catch (err) {
        console.error("Error al cargar datos del empleado:", err);
      }
    };

    fetchEmpleado();
  }, [user]);

  const registrosFiltrados = registros.filter((r) => {
    if (filtrarPorFecha && startDate && endDate) {
      return r.date >= startDate && r.date <= endDate;
    }
    return true;
  });

  useEffect(() => {

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [user]);

  const fechasConChecadasIncompletas = new Set<string>();
  const fechasAgrupadas = registrosFiltrados.reduce((acc, reg) => {
    if (!acc[reg.date]) acc[reg.date] = [];
    acc[reg.date].push(reg.type);
    return acc;
  }, {} as Record<string, string[]>);

  Object.entries(fechasAgrupadas).forEach(([fecha, tipos]) => {
    if (!(tipos.includes("Entrada") && tipos.includes("Salida"))) {
      fechasConChecadasIncompletas.add(fecha);
    }
  });

  const movimientosAprobados = movimientosSolicitados.filter(
    (m) => m.estatus_movimiento === "aprobado"
  );

  const fechasJustificadas = new Set(
    movimientosAprobados.map((m) => new Date(m.fecha_incidencia).toISOString().split("T")[0])
  );
  const movimientosPorFecha = Object.fromEntries(
    movimientosAprobados.map((m) => [new Date(m.fecha_incidencia).toISOString().split("T")[0], m.tipo_movimiento])
  );


  let asistenciasTotales = 0;
  let retardosTotales = 0;
  let inasistenciasTotales = 0;

  asistencias.forEach((a) => {
    const fecha = a.FECHA.split("T")[0];
    const incidencia = a.NOMBRE_INCIDENCIA;
    const clave = a.CVEINC;

    const movimientoJustificado = fechasJustificadas.has(fecha);
    const tipoMovimiento = movimientosPorFecha[fecha];

    if (clave === "SD") {
      return; // día sin deber asistencia
    }

    if (incidencia === null) {
      // Asistencia normal
      asistenciasTotales++;
    } else if (incidencia === "Retardo E1") {
      if (movimientoJustificado && tipoMovimiento === "Retardo justificado") {
        asistenciasTotales++; // contar como asistencia normal
      } else {
        retardosTotales++;
      }
    } else {
      // Otras incidencias
      if (movimientoJustificado && tipoMovimiento === "Falta justificada") {
        asistenciasTotales++; // contar como asistencia normal
      } else {
        inasistenciasTotales++;
      }
    }
  });


  const totalDías = asistenciasTotales + retardosTotales + inasistenciasTotales;
  const puntualidadPorcentaje = totalDías > 0
    ? Math.round((asistenciasTotales / totalDías) * 100)
    : 0;

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando registros de asistencia...</div>;
  }

  const handleQuickRequestOpciones = (item: any) => {
    const opciones = opcionesPorIncidencia[item.NOMBRE_INCIDENCIA] || [];

    setSelectedIncident({
      numeroEmpleado: user?.num_empleado ?? 0,
      fecha: new Date(item.FECHA),
      tipoMovimiento: opciones[0] || "",
      horaEntradaReal: item.ENTRADA_REAL,
      horaSalidaReal: item.SALIDA_REAL,
    });

    setOpcionesMovimiento(opciones);
    setQuickModalOpen(true);
  };


  const handleQuickSubmit = async () => {
    if (!selectedIncident) return;

    try {
      setRequestStatus("submitting");

      const payload = {
        num_empleado: selectedIncident.numeroEmpleado,
        tipo_movimiento: selectedIncident.tipoMovimiento,
        nivel_aprobacion: 1,
        fecha_incidencia: selectedIncident.fecha.toISOString().slice(0, 10),
        datos_json: {
          entryTime: selectedIncident.horaEntradaReal || "",
          earlyTime:
            selectedIncident.tipoMovimiento === "Salida anticipada"
              ? selectedIncident.horaSalidaReal
              : "",
          delayTime:
            selectedIncident.tipoMovimiento === "Retardo justificado"
              ? selectedIncident.horaEntradaReal
              : "",
          exitTime: "",
        },
        comentarios: comments || "",
      };

      const result = await crearMovimiento(payload);

      if (!result.success) {
        alert("Error creando movimiento rápido");
        setRequestStatus("error");
        return;
      }

      setRequestStatus("success");
      alert("✅ Solicitud rápida enviada");
      setQuickModalOpen(false);
      setComments("");
    } catch (error) {
      console.error("❌ Error en envío rápido:", error);
      setRequestStatus("error");
      alert("Error enviando solicitud rápida");
    }
  };
  const getEstiloFilaPorEstatus = (estatus: string | null) => {
    switch (estatus) {
      case "𝙎𝙊𝙇𝙄𝘾𝙄𝙏𝘼𝘿𝙊":
        return "bg-yellow-100 border-l-4 border-yellow-500 animate-pulse";
      case "𝘼𝙋𝙍𝙊𝘽𝘼𝘿𝙊":
        return "bg-green-100 border-l-4 border-green-600 shadow-md ring-2 ring-green-400";
      case "𝙍𝙀𝘾𝙃𝘼𝙕𝘼𝘿𝙊":
        return "bg-red-100 border-l-4 border-red-500";
      case "𝙋𝙀𝙉𝘿𝙄𝙀𝙉𝙏𝙀":
        return "bg-blue-100 border-l-4 border-blue-400";
      default:
        return "";
    }
  };


  const getEstatusMovimiento = (fecha: string) => {
    const match = movimientosSolicitados.find((mov) => {
      const fechaIncidencia = new Date(mov.fecha_incidencia);
      return fechaIncidencia.toISOString().split("T")[0] === fecha;
    });

    if (!match) return null;

    switch (match.estatus_movimiento) {
      case "pendiente":
        return { icono: "𝙎𝙊𝙇𝙄𝘾𝙄𝙏𝘼𝘿𝙊", tipo: match.tipo_movimiento };
      case "aprobado":
        return { icono: "𝘼𝙋𝙍𝙊𝘽𝘼𝘿𝙊", tipo: match.tipo_movimiento };
      case "rechazado":
        return { icono: "𝙍𝙀𝘾𝙃𝘼𝙕𝘼𝘿𝙊", tipo: match.tipo_movimiento };
      default:
        return { icono: "𝙋𝙀𝙉𝘿𝙄𝙀𝙉𝙏𝙀", tipo: match.tipo_movimiento };
    }
  };



  return (
    <div className="max-w-fit mx-auto p-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Columna izquierda - Foto y Resumen */}


        {/* Columna derecha - Tabla de Asistencia */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-2 h-fit lg:col-span-2">
          <div className="text-xl font-mono text-gray-600 justify-end flex">
            {currentTime.toLocaleTimeString()}
          </div>

          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <CardTitle className="text-lg text-center sm:text-left w-full sm:w-auto">
              Registros de Asistencia
            </CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100 text-black sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-4">Fecha</th>
                    <th className="py-2 px-4">Día</th>
                    <th className="py-2 px-4">Entrada Prog.</th>
                    <th className="py-2 px-4">Salida Prog.</th>
                    <th className="py-2 px-4">Tipo Asistencia</th>
                    <th className="py-2 px-4">Incidencia</th>
                    <th className="py-2 px-4">Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias
                    .filter((item) => item.CVEINC !== "SD")
                    .filter((item) => {
                      if (!dateRange?.from || !dateRange?.to) return true;
                      const fecha = new Date(item.FECHA);
                      return fecha >= dateRange.from && fecha <= addDays(dateRange.to, 1);
                    })
                    .sort((a, b) => new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime())
                    .map((item, i) => {
                      const fechaStr = item.FECHA.split("T")[0];
                      const diaSemana = diasMap[item.DIA_SEM] || item.DIA_SEM;
                      const tipoMovimiento = item.NOMBRE_INCIDENCIA;
                      const resultadoMovimiento = getEstatusMovimiento(fechaStr);
                      const estatus = resultadoMovimiento?.icono || null;
                      const tipoMovimientoDetectado = resultadoMovimiento?.tipo || tipoMovimiento;

                      let bgColor = "";
                      if (estatus) {
                        bgColor = "bg-white";
                      } else {
                        if (item.NOMBRE_INCIDENCIA === null && item.CVEINC !== "SD") {
                          bgColor = "bg-green-50";
                        } else if (item.NOMBRE_INCIDENCIA === "Retardo E1") {
                          bgColor = "bg-yellow-50";
                        } else {
                          bgColor = "bg-red-50";
                        }
                      }

                      const claseFila = `${bgColor} ${getEstiloFilaPorEstatus(estatus)} border-b text-black`;

                      return (
                        <tr key={i} className={claseFila}>
                          <td className="py-2 px-4">{fechaStr}</td>
                          <td className="py-2 px-4">{diaSemana}</td>
                          <td className="py-2 px-4">
                            {item.ENTRADA_PROGRAMADA && item.ENTRADA_PROGRAMADA !== "00:00"
                              ? item.ENTRADA_PROGRAMADA
                              : "—"}
                          </td>
                          <td className="py-2 px-4">
                            {item.SALIDA_PROGRAMADA && item.SALIDA_PROGRAMADA !== "00:00"
                              ? item.SALIDA_PROGRAMADA
                              : "—"}
                          </td>
                          <td className="py-2 px-4">{item.TIPO_ASISTENCIA || "—"}</td>
                          <td className="py-2 px-4 italic text-sm">
                            {estatus
                              ? `Movimiento "${tipoMovimientoDetectado}"`
                              : item.NOMBRE_INCIDENCIA || "—"}
                          </td>
                          <td className="py-2 px-4">{estatus || "—"}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>


  );

}

export default RegisterCheckInCheckOut;
