"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { differenceInDays, isBefore } from "date-fns";
import { es, fr } from "date-fns/locale";
import { useAuth } from "../../app/context/AuthContext";
import axios from "axios";
import { User } from "@/lib/interfaces";
import { parse, format } from "date-fns";

function Vacations() {
  // Estados principales
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [incidentDate, setIncidentDate] = useState<Date | undefined>();
  const [movementType, setMovementType] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState<number | undefined>(); // sigue igual
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const tipoMovimiento = "vacaciones"; // define el tipo de movimiento
  const nivel_aprobacion = 1; // define cuántos aprobadores requiere este tipo
  const [comments, setComments] = useState<string>("");
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);


     const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_INTELISIS}/api/users/all`
        );
        const data = await response.json();
        const mappedUsers = data.map((user: any) => ({
          ...user,
          Personal: Number(user.Personal),
        }));
        setUsers(mappedUsers);
        // Buscar usuario directamente después de obtener los datos
        if(user){
          user.num_empleado = 2294;
        }
        const dataUser = mappedUsers.find((u: User) => u.Personal === user?.num_empleado);
        setEmpleado(dataUser || null);
  
        if (dataUser) {
          console.log("Usuario encontrado:", dataUser);
        } else {
          console.log("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

  useEffect(() => {
    console.log("User:", user);
    if (user) {
      setEmployeeNumber(user.num_empleado);
    }
    fetchUsers();

  }, [user]);
  // Datos del empleado
  const rawHireDate = empleado?.FechaAlta;
  const parsedHireDate = rawHireDate
    ? parse(rawHireDate, "dd/MM/yyyy", new Date())
    : new Date();
  
  const employeeData = {
    totalDays: 12,
    hireDate: parsedHireDate,
    eligible: true,
    remainingDays: 7,
    nextVacationIncrement: new Date(
      new Date().getFullYear() + 1,
      0,
      1
    ),
  };


  // Clausulas legales
  const legalClauses = [
    "Derecho a 6 días de vacaciones después del primer año de servicio.",
    "Aumento de 2 días por cada año subsecuente hasta llegar a 12 días.",
    "A partir del 5º año, el periodo de vacaciones aumentará en 2 días por cada 5 años de servicio.",
    "Las vacaciones deberán disfrutarse dentro de los 6 meses siguientes al cumplimiento del año de servicio.",
    "El patrón podrá dividir el periodo vacacional a petición del trabajador.",
  ];

  // Calcular días hasta próximo incremento desde hoy hasta el primer dia del proximo año
  const nextVacationIncrement = new Date(
    new Date().getFullYear() + 1,
    0,
    1
  );
  const today = new Date();

  const daysUntilNextIncrement = differenceInDays(
    nextVacationIncrement,
    today
  );

 

  // Manejar selección de fechas
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (dates) {
      setSelectedDates(dates);
    }
  };


  // Manejar envío de solicitud
  const handleSubmit = async () => {
    console.log("Enviando solicitud...");

    setRequestStatus("submitting");
    if (!user) {
      console.warn("No hay perfil del usuario");
      return;
    }
    const numEmpleado = user.num_empleado;
    console.log("Perfil del empleado:", user);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vacaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_empleado: numEmpleado,
          fechas: selectedDates.map((d) => d.toISOString().split("T")[0]),
          comentarios: comments,
          tipo_movimiento: tipoMovimiento,
          nivel_aprobacion: nivel_aprobacion,
          datos_json: {
            fechas: selectedDates.map((d) => d.toISOString().split("T")[0]),
            fecha_inicio: selectedDates[0].toISOString().split("T")[0],
            fecha_fin: selectedDates[selectedDates.length - 1]
              .toISOString()
              .split("T")[0],
            total_dias: selectedDates.length,
            dias_restantes_post_solicitud:
              employeeData.remainingDays - selectedDates.length,
            fecha_ingreso: employeeData.hireDate.toISOString().split("T")[0],
            proximo_incremento: employeeData.nextVacationIncrement
              .toISOString()
              .split("T")[0],
            empleado_apto: employeeData.eligible,
            comentarios: comments,
          },
        }),
      });

      if (response.ok) {
        setRequestStatus("success");
        setSelectedDates([]);
        setComments("");
      } else {
        setRequestStatus("error");
      }
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      setRequestStatus("error");
    }
  };

  // Calcular el progreso de días usados respecto al total de días disponibles
  const progressValue =
    employeeData.totalDays > 0
      ? ((employeeData.totalDays - employeeData.remainingDays) / employeeData.totalDays) * 100
      : 0;

  // Componente InfoBox mejorado
  const InfoBox = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }) => (
    <div className="bg-muted p-4 rounded-xl shadow-sm h-24 flex flex-col items-center justify-center w-full border">
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <p className="text-xl font-bold">{value}</p>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-1">{label}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
  <Card className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
    <div className="flex items-center gap-4">
      <Info className="w-8 h-8 text-blue-600" />
      <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm">
        Vacaciones
      </h1>
    </div>
  </Card>

  {/* Grid principal con dos columnas */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Columna izquierda - Información de vacaciones */}
    <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
      <CardHeader>
        <CardTitle>Información de Vacaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <strong>Fecha de ingreso:</strong>{" "}
            {employeeData.hireDate && !isNaN(new Date(employeeData.hireDate).getTime()) ?
            format(employeeData.hireDate, "PPP", { locale: es })
            : "Fecha no válida" 
            }

            <div>
              <strong>Tipo de movimiento:</strong> {tipoMovimiento}
              <div>
                <strong>Estado:</strong>{" "}
                {employeeData.eligible ? (
                  <Badge variant="default">Apto para vacaciones</Badge>
                ) : (
                  <Badge variant="destructive">No apto para vacaciones</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Días disponibles:</strong> {employeeData.remainingDays} de {employeeData.totalDays}
            </p>
            <p>
              <strong>Próximo incremento:</strong>{" "}
              {format(employeeData.nextVacationIncrement, "PPP", { locale: es })}
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoBox label="Apto para vacaciones" value={employeeData.eligible ? "Sí" : "No"} icon={employeeData.eligible ? "✅" : "❌"} />
          <InfoBox label="Días disponibles" value={`${employeeData.remainingDays} días`} />
          <InfoBox label="Faltan para incremento" value={`${daysUntilNextIncrement} días`} />
        </div>

        <div className="mt-4">
          <Label>Progreso anual:</Label>
          <Progress value={progressValue} className="h-2 mt-2" />
        </div>

        <Separator className="my-4" />

        <div>
          <Label className="font-semibold">Cláusulas legales:</Label>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
            {legalClauses.map((clause, index) => (
              <li key={index}>{clause}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>

    {/* Columna derecha - Selección de fechas */}
    <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
      <CardHeader>
        <CardTitle>Selección de días de vacaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={handleDateSelect}
              className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
              locale={es}
              disabled={(date) =>
                isBefore(date, today) ||
                (!selectedDates.some((d) => d.getTime() === date.getTime()) &&
                  selectedDates.length >= employeeData.remainingDays)
              }
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Label>Días seleccionados: {selectedDates.length}</Label>
              {selectedDates.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedDates.map((date, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-white/95 shadow-md backdrop-blur-sm"
                    >
                      {format(date, "dd MMM", { locale: es })}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Rango seleccionado:</Label>
              {selectedDates.length > 0 ? (
                <p className="text-center w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm">
                  {format(selectedDates[0], "PPP", { locale: es })} -{" "}
                  {format(selectedDates[selectedDates.length - 1], "PPP", { locale: es })}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay días seleccionados
                </p>
              )}
            </div>

            <div className="pt-2 border-t">
              <Label className="text-center">
                Días restantes después de esta solicitud:
              </Label>
              <p className="text-lg font-semibold text-center">
                {employeeData.remainingDays - selectedDates.length} días
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          disabled={selectedDates.length === 0}
          className="px-6 py-2 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-md backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Enviar solicitud
        </Button>
      </CardFooter>
    </Card>
  </div>
</div>

  );
}

export default Vacations;
