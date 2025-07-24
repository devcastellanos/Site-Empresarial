"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Asistencia = {
  INC: string;
  FECHA: string;
  DIA_SEM: string;
  ENTRADA_PROGRAMADA: string;
  SALIDA_PROGRAMADA: string;
  TIPO_ASISTENCIA: string;
  NOMBRE_INCIDENCIA: string | null;
};

type Movimiento = {
  idMovimiento: number;
  tipo_movimiento: string;
  fecha_incidencia: string;
  fecha_solicitud: string | null;
  estatus_movimiento: string;
  comentarios?: string;
};

type Empleado = {
  Personal: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Departamento: string;
  Puesto: string;
  asistencia?: Asistencia[];
};

export default function MonitorSubordinates() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [openResumen, setOpenResumen] = useState(false);
  const { user } = useAuth();
  const [movimientosPorEmpleado, setMovimientosPorEmpleado] = useState<Record<string, Movimiento[]>>({});
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);
  const tiposExcluidos = ["Sustitución", "Nueva Posición", "Aumento Plantilla"];

  const [modalAbierto, setModalAbierto] = useState(false);

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaAyerStr = ayer.toISOString().split("T")[0];


  // Fetch empleados y sus asistencias
  useEffect(() => {
    if (!user?.num_empleado) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/monitoreo-subordinados?num_empleado=${user.num_empleado}`)
      .then((res) => {
        const data = res.data?.data ?? [];
        setEmpleados(data);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [user?.num_empleado]);

  // Fetch movimientos por empleado
  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const resultados = await Promise.all(
          empleados.map(async (emp) => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movimientos/mios/${emp.Personal}`);
            return { Personal: emp.Personal, data: res.data?.data ?? [] };
          })
        );

        const map: Record<string, Movimiento[]> = {};
        resultados.forEach(({ Personal, data }) => {
          map[Personal] = data;
        });

        setMovimientosPorEmpleado(map);
      } catch (error) {
        console.error("Error cargando movimientos:", error);
      }
    };

    if (empleados.length) {
      fetchMovimientos();
    }
  }, [empleados]);

  const resumenGlobal = useMemo(() => {
    const resumen = {
      empleados: empleados.length,
      dias: 0,
      faltas: 0,
      retardos: 0,
      noCheco: 0,
      sincronizar: 0,
    };

    empleados.forEach((emp) => {
      emp.asistencia?.forEach((a) => {
        const fecha = a.FECHA.split("T")[0];

        if (
          a.TIPO_ASISTENCIA.toLowerCase().includes("descanso") ||
          a.TIPO_ASISTENCIA.toLowerCase().includes("séptimo")
        )
          return;

        resumen.dias++;

        if (a.TIPO_ASISTENCIA.toLowerCase().includes("falta")) {
          resumen.faltas++;
        } else if (a.INC === "RET" || a.NOMBRE_INCIDENCIA?.toLowerCase().includes("retardo")) {
          resumen.retardos++;
        } else if (
          a.TIPO_ASISTENCIA.toLowerCase().includes("no chec") ||
          a.NOMBRE_INCIDENCIA?.toLowerCase().includes("no chec")
        ) {
          if (fecha === fechaAyerStr) {
            resumen.sincronizar++;
          } else {
            resumen.noCheco++;
          }
        }
      });
    });

    return resumen;
  }, [empleados]);

  const dataChart = [
    { name: "Faltas", value: resumenGlobal.faltas },
    { name: "Retardos", value: resumenGlobal.retardos },
    { name: "No checó salida", value: resumenGlobal.noCheco },
    {
      name: "Asistencias",
      value: resumenGlobal.dias - resumenGlobal.faltas - resumenGlobal.retardos - resumenGlobal.noCheco,
    },
  ];

  const COLORS = ["#EF4444", "#FBBF24", "#3B82F6", "#10B981"];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!empleados.length) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        No se encontraron subordinados con registros de asistencia.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <Button onClick={() => setOpenResumen(true)}>📊 Ver resumen general</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {empleados.map((emp) => (
          <Card key={emp.Personal} className="shadow-md">
            <CardHeader className="bg-[#9A3324] text-white rounded-t-xl">
              <CardTitle className="text-lg">
                {emp.Nombre} {emp.ApellidoPaterno} {emp.ApellidoMaterno}
              </CardTitle>
              <CardDescription className="text-white/80">
                {emp.Puesto} • {emp.Departamento}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-2 max-h-[400px] overflow-y-auto">
                <table className="w-full text-xs text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-800 sticky top-0 z-10">
                    <tr>
                        <th className="p-2">Fecha</th>
                        <th className="p-2">Entrada</th>
                        <th className="p-2">Salida</th>
                        <th className="p-2">Asistencia</th>
                    </tr>
                    </thead>
                    <tbody>
                    {emp.asistencia
                        ?.filter((a) => !a.TIPO_ASISTENCIA.toLowerCase().includes("descanso"))
                        .sort((a, b) => new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime())
                        .slice(0, 10)
                        .map((a) => {
                        const fecha = a.FECHA.split("T")[0];
                        const fechaFormateada = fecha.split("-").reverse().join("/");

                        const mov = movimientosPorEmpleado[emp.Personal]?.find((m) =>
                            m.fecha_incidencia.startsWith(fecha) && m.estatus_movimiento === "aprobado"
                        );

                        let badgeColor = "border-green-600 text-green-600";
                        let badgeText = a.TIPO_ASISTENCIA;

                        const mostrarBotonMovimiento = !!mov;

                        if (mov) {
                            badgeText = "Movimiento aprobado";
                            badgeColor = "border-green-700 text-green-700";
                        } else if (a.TIPO_ASISTENCIA.toLowerCase().includes("falta")) {
                            badgeColor = "border-red-500 text-red-500";
                            badgeText = "Falta";
                        } else if (a.NOMBRE_INCIDENCIA?.toLowerCase().includes("retardo") || a.INC === "RET") {
                            badgeColor = "border-yellow-500 text-yellow-500";
                            badgeText = "Retardo";
                        } else if (
                          a.TIPO_ASISTENCIA.toLowerCase().includes("no chec") ||
                          a.NOMBRE_INCIDENCIA?.toLowerCase().includes("no chec")
                        ) {
                          badgeColor = "border-blue-500 text-blue-500";
                          badgeText = a.FECHA.startsWith(fechaAyerStr) ? "Falta sincronizar" : "No checó";
                        }

                        return (
                            <tr key={fecha} className="border-t">
                            <td className="p-2 font-medium">{fechaFormateada}</td>
                            <td className="p-2">{a.ENTRADA_PROGRAMADA || "—"}</td>
                            <td className="p-2">{a.SALIDA_PROGRAMADA || "—"}</td>
                            <td className="p-2">
                                {mostrarBotonMovimiento ? (
                                <Button
                                    variant="outline"
                                    className={badgeColor + " text-xs px-2 py-1 h-auto"}
                                    onClick={() => {
                                    setMovimientoSeleccionado(mov);
                                    setModalAbierto(true);
                                    }}
                                >
                                    Movimiento aprobado
                                </Button>
                                ) : (
                                <Badge variant="outline" className={badgeColor}>
                                    {badgeText}
                                </Badge>
                                )}
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>

                {/* Modal */}
                <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                    <DialogContent
                        className="max-w-md bg-white shadow-xl rounded-xl border border-gray-200"
                        style={{
                        backgroundColor: "white",
                        backdropFilter: "blur(6px)",
                        }}
                    >
                        <DialogHeader>
                        <DialogTitle className="text-xl text-[#9A3324]">
                            📋 Detalle del Movimiento
                        </DialogTitle>
                        </DialogHeader>

                        {movimientoSeleccionado ? (
                        <div className="text-sm space-y-4 text-gray-700 mt-2">
                            <div className="space-y-1">
                            <p>
                                <strong>Tipo:</strong> {movimientoSeleccionado.tipo_movimiento}
                            </p>
                            <p>
                                <strong>Fecha de incidencia:</strong>{" "}
                                {movimientoSeleccionado.fecha_incidencia.split("T")[0].split("-").reverse().join("/")}
                            </p>
                            <p>
                                <strong>Fecha de solicitud:</strong>{" "}
                                {movimientoSeleccionado.fecha_solicitud?.split("T")[0].split("-").reverse().join("/")}
                            </p>
                            </div>

                            <div className="space-y-1">
                            <p>
                                <strong>Estatus:</strong>{" "}
                                <span
                                className={`font-semibold ${
                                    movimientoSeleccionado.estatus_movimiento === "aprobado"
                                    ? "text-green-600"
                                    : movimientoSeleccionado.estatus_movimiento === "pendiente"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                                >
                                {movimientoSeleccionado.estatus_movimiento}
                                </span>
                            </p>

                            {movimientoSeleccionado.comentarios && (
                                <p className="italic text-gray-600">
                                “{movimientoSeleccionado.comentarios}”
                                </p>
                            )}
                            </div>
                        </div>
                        ) : (
                        <p className="text-muted-foreground">No hay datos disponibles.</p>
                        )}
                    </DialogContent>
                    </Dialog>

                </CardContent>


          </Card>
        ))}
      </div>

      <Dialog open={openResumen} onOpenChange={setOpenResumen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resumen general de asistencia</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-2 mt-2">
            <p>
              <strong>Empleados:</strong> {resumenGlobal.empleados}
            </p>
            <p>
              <strong>Días registrados:</strong> {resumenGlobal.dias}
            </p>
            <p>
              <strong>Faltas:</strong> {resumenGlobal.faltas}
            </p>
            <p>
              <strong>Retardos:</strong> {resumenGlobal.retardos}
            </p>
            <p>
              <strong>No checó salida:</strong> {resumenGlobal.noCheco}
            </p>
          </div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={5}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {dataChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
