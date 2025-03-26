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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  format,
  addDays,
  differenceInDays,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

function Vacations() {
  // Estados principales
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [incidentDate, setIncidentDate] = useState<Date | undefined>();
  const [movementType, setMovementType] = useState("");
  const [authorizer, setAuthorizer] = useState("");
  const [comments, setComments] = useState("");
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // Datos simulados del empleado
  const [employeeData, setEmployeeData] = useState({
    hireDate: new Date(2021, 0, 15),
    eligible: true,
    totalDays: 12,
    takenDays: 5,
    remainingDays: 7,
    nextVacationIncrement: new Date(2024, 0, 15),
  });

  // Tipos de movimiento
  const movements = [
    "Cambio de descanso",
    "Cambio de horario",
    "Comisión fuera de Oficina",
    "Comisión Prolongada fuera de Oficina",
    "Curso/Capacitación",
    "Descanso laborado",
    "Descanso por comisión laboral",
    "Falta justificada IMSS",
    "Horario de Lactancia",
    "Junta de trabajo",
    "Permisos Especiales",
    "Permiso con goce de sueldo",
    "Permiso para llegar tarde",
    "Permiso sin goce de sueldo",
    "Retardo justificado",
    "Salida anticipada",
    "Sin registro entrada",
    "Sin registro salida",
    "Tiempo extra",
    "Vacaciones",
    "Viaje de Trabajo",
  ];

  // Clausulas legales
  const legalClauses = [
    "Derecho a 6 días de vacaciones después del primer año de servicio.",
    "Aumento de 2 días por cada año subsecuente hasta llegar a 12 días.",
    "A partir del 5º año, el periodo de vacaciones aumentará en 2 días por cada 5 años de servicio.",
    "Las vacaciones deberán disfrutarse dentro de los 6 meses siguientes al cumplimiento del año de servicio.",
    "El patrón podrá dividir el periodo vacacional a petición del trabajador.",
  ];

  // Calcular días hasta próximo incremento
  const today = new Date();
  const daysUntilNextIncrement = differenceInDays(
    employeeData.nextVacationIncrement,
    today
  );
  const progressValue = ((365 - daysUntilNextIncrement) / 365) * 100;

  // Manejar selección de fechas
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (dates) {
      setSelectedDates(dates);
    }
  };

  // Validar si se puede enviar la solicitud
  const canSubmit =
    employeeNumber.trim() !== "" &&
    incidentDate &&
    movementType === "Vacaciones" &&
    selectedDates.length > 0 &&
    selectedDates.length <= employeeData.remainingDays &&
    authorizer.trim() !== "";

  // Manejar envío de solicitud
  const handleSubmit = () => {
    if (!canSubmit) return;

    setRequestStatus("submitting");

    // Simular envío a API
    setTimeout(() => {
      setRequestStatus("success");
      // Aquí iría la lógica para actualizar los días tomados, etc.
    }, 1500);
  };

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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Info className="w-6 h-6" />
        <span>Vacaciones</span>
      </h1>

      {/* Información del empleado y cláusulas legales */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Vacaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <strong>Fecha de ingreso:</strong>{" "}
              {format(employeeData.hireDate, "PPP", { locale: es })}
              <div>
                <strong>Estado:</strong>{" "}
                {employeeData.eligible ? (
                  <Badge variant="default">Apto para vacaciones</Badge>
                ) : (
                  <Badge variant="destructive">No apto para vacaciones</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Días disponibles:</strong> {employeeData.remainingDays}{" "}
                de {employeeData.totalDays}
              </p>
              <p>
                <strong>Próximo incremento:</strong>{" "}
                {format(employeeData.nextVacationIncrement, "PPP", {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoBox
              label="Apto para vacaciones"
              value={employeeData.eligible ? "Sí" : "No"}
              icon={employeeData.eligible ? "✅" : "❌"}
            />
            <InfoBox
              label="Días disponibles"
              value={`${employeeData.remainingDays} días`}
            />
            <InfoBox
              label="Faltan para incremento"
              value={`${daysUntilNextIncrement} días`}
            />
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

      {/* Selección de fechas de vacaciones */}
      <Card>
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
                className="rounded-md border w-full"
                locale={es}
                disabled={(date) =>
                  isBefore(date, today) ||
                  selectedDates.length >= employeeData.remainingDays
                }
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <Label>Días seleccionados: {selectedDates.length}</Label>
                {selectedDates.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedDates.map((date, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {format(date, "dd MMM", { locale: es })}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Rango seleccionado:</Label>
                {selectedDates.length > 0 ? (
                  <p>
                    {format(selectedDates[0], "PPP", { locale: es })} -{" "}
                    {format(selectedDates[selectedDates.length - 1], "PPP", {
                      locale: es,
                    })}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay días seleccionados
                  </p>
                )}
              </div>

              <div className="pt-2 border-t">
                <Label>Días restantes después de esta solicitud:</Label>
                <p className="text-lg font-semibold">
                  {employeeData.remainingDays - selectedDates.length} días
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solicitud de autorización */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitud de Autorización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="employee">Número de empleado *</Label>
              <Input
                id="employee"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Fecha de incidencia *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {incidentDate ? (
                      format(incidentDate, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={incidentDate}
                    onSelect={setIncidentDate}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Tipo de movimiento *</Label>
              <Select value={movementType} onValueChange={setMovementType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un movimiento" />
                </SelectTrigger>
                <SelectContent>
                  {movements.map((mov, i) => (
                    <SelectItem key={i} value={mov}>
                      {mov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campos condicionales para vacaciones */}
          {movementType === "Vacaciones" && (
            <div className="space-y-4">
              <div>
                <Label>Persona que autoriza *</Label>
                <Input
                  value={authorizer}
                  onChange={(e) => setAuthorizer(e.target.value)}
                  placeholder="Nombre del supervisor/autorizador"
                  required
                />
              </div>

              <div>
                <Label>Comentarios adicionales</Label>
                <Textarea
                  rows={3}
                  placeholder="Motivo o detalles adicionales..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>
                  Estás solicitando {selectedDates.length} días de vacaciones
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || requestStatus === "submitting"}
          >
            {requestStatus === "submitting"
              ? "Enviando..."
              : "Enviar solicitud"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Vacations;
