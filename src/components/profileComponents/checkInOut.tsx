"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/context/AuthContext";
import { User } from "@/lib/interfaces";

function RegisterCheckInCheckOut() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filtrarPorFecha, setFiltrarPorFecha] = useState(false);
  const [registros, setRegistros] = useState<{ date: string; type: "Entrada" | "Salida"; time: string }[]>([]);
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empleado, setEmpleado] = useState<User | null>(null);

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

  useEffect(() => {
    const fetchAsistencias = async () => {
      if (!user || !user.num_empleado) return;
      try {
        const res = await fetch(`http://api-checadas.192.168.29.40.sslip.io/asistencia?codigo=${user.num_empleado}`);
        const data = await res.json();
        setAsistencias(data);
      } catch (error) {
        console.error("Error al obtener datos de asistencia:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAsistencias();
  
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (!user) return;
      try {
        const response = await fetch("http://api-site-intelisis.192.168.29.40.sslip.io/api/users/all");
        const data = await response.json();
        const employeeData = data.find((u: any) => Number(u.Personal) === Number(user.num_empleado));
        setEmpleado(employeeData);
      } catch (err) {
        console.error("Error al cargar datos del empleado:", err);
      }
    };

    fetchEmpleado();
  }, [user]);

  const esRetardo = (time: string) => {
    const [hora, minuto, meridiano] = time.match(/(\d+):(\d+)\s(AM|PM)/i)?.slice(1) || [];
    let horas = parseInt(hora);
    const minutos = parseInt(minuto);
    if (meridiano === "PM" && horas < 12) horas += 12;
    return horas > 7 || (horas === 7 && minutos > 40);
  };

  const getRangoDeFechas = (start: string, end: string) => {
    const fechas = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      fechas.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return fechas;
  };

  const registrosFiltrados = registros.filter((r) => {
    if (filtrarPorFecha && startDate && endDate) {
      return r.date >= startDate && r.date <= endDate;
    }
    return true;
  });

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

  const fechasParaMostrar =
    filtrarPorFecha && startDate && endDate
      ? getRangoDeFechas(startDate, endDate)
      : Array.from(new Set(registrosFiltrados.map((r) => r.date)))
          .sort()
          .reverse();

  const registrosPorFecha = fechasParaMostrar.map((fecha) => {
    const entrada = registrosFiltrados.find((r) => r.date === fecha && r.type === "Entrada");
    const salida = registrosFiltrados.find((r) => r.date === fecha && r.type === "Salida");
    const retardo = entrada?.time ? esRetardo(entrada.time) : false;
    const incompleta = !entrada || !salida;
    return { fecha, entrada, salida, retardo, incompleta };
  });

  const asistenciasTotales = asistencias.filter((a) => a.NOMBRE_INCIDENCIA === null && a.CVEINC !== "SD").length;
  const retardosTotales = asistencias.filter((a) => a.NOMBRE_INCIDENCIA === "Retardo E1" && a.CVEINC !== "SD").length;
  const inasistenciasTotales = asistencias.filter(
    (a) => a.NOMBRE_INCIDENCIA !== null && a.NOMBRE_INCIDENCIA !== "Retardo E1" && a.CVEINC !== "SD"
  ).length;

  const totalDías = asistenciasTotales + retardosTotales + inasistenciasTotales;
  const puntualidadPorcentaje = totalDías > 0 ? Math.round((asistenciasTotales / totalDías) * 100) : 0;

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando registros de asistencia...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="relative rounded-3xl shadow-lg border border-muted bg-white/80 backdrop-blur-md mb-6">
  {/* Badge de estatus */}
  <div className="absolute top-4 right-4">
    <Badge
      variant="outline"
      className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
        empleado?.Estatus === "ALTA"
          ? "text-green-600 border-green-600"
          : "text-red-600 border-red-600"
      }`}
    >
      {empleado?.Estatus}
    </Badge>
  </div>

  <CardHeader className="text-center space-y-3">
    <Avatar className="w-32 h-36 mx-auto shadow-md border">
      <AvatarImage src={`/api/employees/${empleado?.Personal}`} alt="Avatar" />
      <AvatarFallback>
        {empleado?.Nombre}
        {empleado?.ApellidoPaterno[0]}
      </AvatarFallback>
    </Avatar>

    <div>
      <CardTitle className="text-2xl font-semibold tracking-tight">
        {empleado?.Nombre} {empleado?.ApellidoPaterno} {empleado?.ApellidoMaterno}
      </CardTitle>
      <p className="text-muted-foreground text-sm">#{empleado?.Personal}</p>
    </div>
  </CardHeader>

  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-4">
    <InfoItem label="Puesto" value={empleado?.Puesto || ""} />
    <InfoItem label="Departamento" value={empleado?.Departamento || ""} />
    <InfoItem label="Tipo de Pago" value={empleado?.PeriodoTipo || "No especificado"} />
  </CardContent>
</Card>


      {/* Info empleado */}
      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
        <CardHeader>
          <CardTitle>Información del Empleado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-black">
              {empleado?.Nombre} {empleado?.ApellidoPaterno}
            </p>
            <p className="text-black">{empleado?.Puesto}</p>
          </div>

          <Separator className="my-4 h-1 bg-gray-200 rounded-full" />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className=" font-semibold text-xs text-black">Turno</p>
              <p className=" text-black">7:30 am - 4:30 pm</p>
            </div>
          </div>

          <Separator className="my-4 h-1 bg-gray-200 rounded-full" />

          <p className="text-sm text-black">Resumen de asistencia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <InfoBox color="green" label="Asistencias" value={asistenciasTotales.toString()} />
            <InfoBox color="red" label="Inasistencias" value={inasistenciasTotales.toString()} />
            <InfoBox color="yellow" label="Retardos" value={retardosTotales.toString()} />
            <InfoBox color="blue" label="Puntualidad" value={`${puntualidadPorcentaje}%`} />
          </div>
        </CardContent>
      </Card>

      {/* Tabla completa de asistencias */}
      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <CardTitle className="text-lg text-center sm:text-left w-full sm:w-auto">
            Registros de Asistencia
          </CardTitle>
          <span className="text-xl font-mono text-gray-600">
            {currentTime.toLocaleTimeString()}
          </span>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Día</th>
                <th className="py-2 px-4">Entrada Prog.</th>
                <th className="py-2 px-4">Salida Prog.</th>
                <th className="py-2 px-4">Tipo Asistencia</th>
                <th className="py-2 px-4">Incidencia</th>
              </tr>
            </thead>
            <tbody>
              {asistencias
                .filter((item) => item.CVEINC !== "SD")
                .map((item, i) => {
                  let bgColor = "bg-green-50"; // asistencia normal

                  if (item.NOMBRE_INCIDENCIA === "Retardo E1") {
                    bgColor = "bg-yellow-50";
                  } else if (item.NOMBRE_INCIDENCIA && item.NOMBRE_INCIDENCIA !== "Retardo E1") {
                    bgColor = "bg-red-50";
                  }

                  if (item.INC === "FINJ") {
                    bgColor = "bg-purple-50"; // home office sábado
                  }

                  if (item.CVEINC === "DF") {
                    bgColor = "bg-blue-50"; // día festivo
                  }

                  const fechaStr = item.FECHA.split("T")[0];
                  const diaSemana = diasMap[item.DIA_SEM] || item.DIA_SEM;
                  
                  return (
                    <tr key={i} className={`${bgColor} border-b text-black`}>
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
                      <td className="py-2 px-4">{item.NOMBRE_INCIDENCIA || "—"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-base font-medium">{value}</span>
  </div>
);
const InfoBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="bg-muted p-4 rounded-xl shadow-sm h-24 flex flex-col items-center justify-center w-full">
    <p className={`text-2xl font-bold text-${color}-500`}>{value}</p>
    <p className="text-sm text-gray-500 text-center">{label}</p>
  </div>
);

export default RegisterCheckInCheckOut;
