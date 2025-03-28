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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

function Movements() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [incidentDate, setIncidentDate] = useState<Date | undefined>();
  const [movementType, setMovementType] = useState("");
  const [authorizer, setAuthorizer] = useState("");
  const [comments, setComments] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [requestStatus, setRequestStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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

  const canSubmit =
    employeeNumber.trim() !== "" &&
    incidentDate &&
    movementType !== "" &&
    (movementType !== "Vacaciones" || (selectedDates.length > 0 && authorizer.trim() !== ""));

  const handleSubmit = () => {
    if (!canSubmit) return;
    setRequestStatus("submitting");
    setTimeout(() => {
      setRequestStatus("success");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center gap-4">
          <Info className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm">
            Movimientos de Personal
          </h1>
        </div>
      </Card>

      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
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
                className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
              />
            </div>

            <div>
              <Label>Fecha de incidencia *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {incidentDate ? format(incidentDate, "PPP", { locale: es }) : "Selecciona una fecha"}
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
                <SelectTrigger className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm">
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

          {/* Campos adicionales si es Vacaciones */}
          {movementType === "Vacaciones" && (
            <div className="space-y-4">
              <div>
                <Label>Días a solicitar</Label>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
                  locale={es}
                />
              </div>

              <div>
                <Label>Persona que autoriza *</Label>
                <Input
                  value={authorizer}
                  onChange={(e) => setAuthorizer(e.target.value)}
                  placeholder="Nombre del supervisor/autorizador"
                  required
                  className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
                />
              </div>

              <div>
                <Label>Comentarios adicionales</Label>
                <Textarea
                  rows={3}
                  placeholder="Motivo o detalles adicionales..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Estás solicitando {selectedDates.length} días de vacaciones</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || requestStatus === "submitting"}
          >
            {requestStatus === "submitting" ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Movements;
