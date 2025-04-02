"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function RegisterCheckInCheckOut() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filtrarPorFecha, setFiltrarPorFecha] = useState(false);

  const user = {
    nombre: "JUAN FRANCISCO",
    apellido: "CASTELLANOS CABANILLAS",
    puesto: "Ing Desarrollo Jr",
    departamento: "Sistemas",
    estatus: "ALTA",
    ingreso: "15/01/2021",
  };

  const registros = [
    { date: "2025-03-25", type: "Entrada", time: "08:01 AM" },
    { date: "2025-03-25", type: "Salida", time: "05:12 PM" },
    { date: "2025-03-24", type: "Entrada", time: "07:15 AM" },
    { date: "2025-03-24", type: "Salida", time: "05:10 PM" },
    { date: "2025-03-23", type: "Entrada", time: "08:00 AM" },
    { date: "2025-03-23", type: "Salida", time: "05:00 PM" },

    { date: "2025-03-22", type: "Salida", time: "05:11 PM" },
    { date: "2025-03-21", type: "Entrada", time: "08:03 AM" },
    { date: "2025-03-21", type: "Salida", time: "05:09 PM" },
  ];

  const esRetardo = (time: string) => {
    const [hora, minuto, meridiano] =
      time.match(/(\d+):(\d+)\s(AM|PM)/i)?.slice(1) || [];
    let horas = parseInt(hora);
    const minutos = parseInt(minuto);
    if (meridiano === "PM" && horas < 12) horas += 12;
    return horas > 7 || (horas === 7 && minutos > 40);
  };

  const registrosFiltrados = registros.filter((r) => {
    if (filtrarPorFecha && startDate && endDate) {
      return r.date >= startDate && r.date <= endDate;
    }
    return true;
  });

  const entradas = registrosFiltrados.filter((r) => r.type === "Entrada");
  const salidas = registrosFiltrados.filter((r) => r.type === "Salida");

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    const entrada = registrosFiltrados.find(
      (r) => r.date === fecha && r.type === "Entrada"
    );
    const salida = registrosFiltrados.find(
      (r) => r.date === fecha && r.type === "Salida"
    );
    const retardo = entrada?.time ? esRetardo(entrada.time) : false;
    const incompleta = !entrada || !salida;
    return { fecha, entrada, salida, retardo, incompleta };
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <Card className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-3xl">⏱️</span>
          <h1 className="text-4xl font-bold tracking-tight text-black drop-shadow-sm">
            Registro Entrada/Salida
          </h1>
        </div>
      </Card>

      {/* Info empleado */}
      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
        <CardHeader>
          <CardTitle>Información del Empleado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-black">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-black">{user.puesto}</p>
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
            <InfoBox color="green" label="Asistencias" value="18" />
            <InfoBox color="red" label="Inasistencias" value="2" />
            <InfoBox color="yellow" label="Retardos" value="3" />
            <InfoBox color="blue" label="Puntualidad" value="90%" />
          </div>
        </CardContent>
      </Card>

      {/* Registros */}
      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <CardTitle className="text-lg text-center sm:text-left w-full sm:w-auto">
            Registros de Asistencia
          </CardTitle>
          <span className="text-xl font-mono text-gray-600">
            {currentTime.toLocaleTimeString()}
          </span>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Selector de fechas */}
          {/* Filtro por fechas opcional */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-black">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={filtrarPorFecha}
                onChange={(e) => setFiltrarPorFecha(e.target.checked)}
              />
              Auditar por rango de fechas
            </label>

            {filtrarPorFecha && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm text-black mb-1"
                  >
                    Fecha inicial
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm text-black mb-1"
                  >
                    Fecha final
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <Separator />

          {/* Entradas y Salidas */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Entrada</th>
                  <th className="py-2 px-4">Salida</th>
                </tr>
              </thead>
              <tbody>
                {registrosPorFecha.map((r, index) => (
                  <tr
                    key={index}
                    className={`
            ${
              r.retardo
                ? "bg-red-100"
                : r.incompleta
                ? "bg-yellow-100"
                : "bg-white"
            }
            border-b border-gray-200 text-black
          `}
                  >
                    <td className="py-2 px-4 font-medium">{r.fecha}</td>
                    <td className="py-2 px-4">
                      {r.entrada?.time || (
                        <span className="italic text-red-500">
                          No registrado
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {r.salida?.time || (
                        <span className="italic text-red-500">
                          No registrado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
