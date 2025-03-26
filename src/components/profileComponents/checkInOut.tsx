"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function RegisterCheckInCheckOut() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = {
    nombre: "JUAN FRANCISCO",
    apellido: "CASTELLANOS CABANILLAS",
    puesto: "Ing Desarrollo Jr",
    departamento: "Sistemas",
    estatus: "ALTA",
    ingreso: "15/01/2021",
  };

  const registros = [
    { date: "25/03/2025", type: "Entrada", time: "08:01 AM" },
    { date: "25/03/2025", type: "Salida", time: "05:12 PM" },
    { date: "24/03/2025", type: "Entrada", time: "08:04 AM" },
    { date: "24/03/2025", type: "Salida", time: "05:10 PM" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* LADO IZQUIERDO */}
      <Card className="md:col-span-1 shadow-md">
        <CardHeader>
          <CardTitle>Información del Empleado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium">{user.nombre} {user.apellido}</p>
            <p className="text-muted-foreground">{user.puesto}</p>
          </div>

          <Separator className="my-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

          <div className="grid grid-cols-2 gap-2">

            <div>
              <p className="text-xs text-muted-foreground">Turno</p>
              <p className="font-semibold">7:30 am - 4:30 pm</p>
            </div>
          </div>

          <Separator className="my-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

          <p className="text-sm text-muted-foreground">Resumen de asistencia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <InfoBox color="green" label="Asistencias" value="18" />
            <InfoBox color="red" label="Inasistencias" value="2" />
            <InfoBox color="yellow" label="Retardos" value="3" />
            <InfoBox color="blue" label="Puntualidad" value="90%" />
          </div>
        </CardContent>
      </Card>

      {/* LADO DERECHO */}
      <Card className="md:col-span-2 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <CardTitle className="text-lg text-center sm:text-left w-full sm:w-auto">
                Registros de Asistencia
            </CardTitle>
            <span className="text-xl font-mono">{currentTime.toLocaleTimeString()}</span>
            </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="max-h-64 overflow-y-auto space-y-2">
            {registros.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay registros aún.</p>
            )}
            {registros.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between text-sm p-2 border rounded-lg"
              >
                <span>{entry.date}</span>
                <span className="font-semibold">{entry.type}</span>
                <span className="text-muted-foreground">{entry.time}</span>
              </div>
            ))}
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
      <p className="text-sm text-muted-foreground text-center">{label}</p>
    </div>
  );

export default RegisterCheckInCheckOut;
