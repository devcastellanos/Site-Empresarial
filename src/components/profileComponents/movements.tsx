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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

// Importar componente dinámico
import { RestChangeFields } from "@/components/profileComponents/movementsComponents/restChangeFields";
import { ScheduleChangeFields } from "@/components/profileComponents/movementsComponents/scheduleChangeFields";
import { CommissionRestDayFields } from "@/components/profileComponents/movementsComponents/commissionRestDayFields";
import { EarlyLeaveFields } from "@/components/profileComponents/movementsComponents/earlyLeaveFields";
import { ExtendedAssignmentFields } from "@/components/profileComponents/movementsComponents/extendedAssignmentFields";
import { ExternalAssignmentFields } from "@/components/profileComponents/movementsComponents/externalAssignmentFields";
import { LactationScheduleFields } from "@/components/profileComponents/movementsComponents/lactationScheduleFields";
import { IMSSAbsenceFields } from "@/components/profileComponents/movementsComponents/IMSSAbsenceFields";
import { JustifiedDelayFields } from "@/components/profileComponents/movementsComponents/justifiedDelayFields";
import { LateArrivePermissionFields } from "@/components/profileComponents/movementsComponents/lateArrivalPermissionFields";
import { SpecialPermissionFields } from "@/components/profileComponents/movementsComponents/specialPermissionFields";
import { MissingEntryFields } from "@/components/profileComponents/movementsComponents/missingEntryFields";
import { MissingExitFields } from "@/components/profileComponents/movementsComponents/missingExitFields";
import { OvertimeFields } from "@/components/profileComponents/movementsComponents/overtimeFields";
import { PaidLeaveFields } from "@/components/profileComponents/movementsComponents/paidLeaveFields";
import { TrainingFields } from "@/components/profileComponents/movementsComponents/trainingFields";
import { UnpaidLeaveFields } from "@/components/profileComponents/movementsComponents/unpaidLeaveFields";
import { WorkedRestDayFields } from "@/components/profileComponents/movementsComponents/workedRestDayFields";
import { WorkMeetingFields } from "@/components/profileComponents/movementsComponents/workMeetingFields";
import { WorkTripFields } from "@/components/profileComponents/movementsComponents/workTripFields";
import { delay } from "framer-motion";
import {
  crearMovimiento,
  responderAprobacion,
  obtenerMovimientosPendientes,
  obtenerAprobaciones,
  obtenerMisMovimientos,
} from "@/services/movementsService";
import { useAuth } from "@/app/context/AuthContext";

function Movements() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [incidentDate, setIncidentDate] = useState<Date>();
  const [movementType, setMovementType] = useState("");
  const [comments, setComments] = useState("");
  const [nivel_aprobacion, setNivelAprobacion] = useState(1); // Cambia el valor inicial a 1 o al que necesites

  // Campos comunes
  const [assignedRestDay, setAssignedRestDay] = useState("");
  const [requestedRestDay, setRequestedRestDay] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [homeOfficeDays, setHomeOfficeDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [resumeDate, setResumeDate] = useState("");
  const [tripLocation, setTripLocation] = useState("");

  const [specialType, setSpecialType] = useState(""); // Define specialType state
  const [entryTime, setEntryTime] = useState(""); // Define entryTime state
  const [delayTime, setDelayTime] = useState(""); // Define delayTime state
  const [earlyTime, setEarlyTime] = useState(""); // Define earlyTime state
  const [hours, setHours] = useState(""); // Define hours state
  const [exitTime, setExitTime] = useState(""); // Define exitTime state
  const [approvalNotes, setApprovalNotes] = useState("");
  const { user } = useAuth();

  const [movementsData, setMovementsData] = useState<{
    pendientes: any[];
    aprobaciones: any[];
    propios: any[];
  }>({
    pendientes: [],
    aprobaciones: [],
    propios: [],
  });



  const [requestStatus, setRequestStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

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
    "Viaje de Trabajo",
  ];

  const nivelAprobacionPorMovimiento: Record<string, number> = {
    "Cambio de descanso": 1,
    "Cambio de horario": 1,
    "Comisión fuera de Oficina": 3,
    "Comisión Prolongada fuera de Oficina": 2,
    "Curso/Capacitación": 2,
    "Descanso laborado": 1,
    "Descanso por comisión laboral": 1,
    "Falta justificada IMSS": 1,
    "Horario de Lactancia": 1,
    "Junta de trabajo": 1,
    "Permisos Especiales": 2,
    "Permiso con goce de sueldo": 1,
    "Permiso para llegar tarde": 1,
    "Permiso sin goce de sueldo": 1,
    "Retardo justificado": 1,
    "Salida anticipada": 1,
    "Sin registro entrada": 1,
    "Sin registro salida": 1,
    "Tiempo extra": 1,
    "Viaje de Trabajo": 2,
  };

  const canSubmit =
    employeeNumber.trim() !== "" && incidentDate && movementType !== "";

  useEffect(() => {
    if (!user || user.num_empleado === undefined) return;
    user.num_empleado = 1847;

    async function cargarMovimientos() {
      try {
        const pendientes = user ? await obtenerMovimientosPendientes(user.num_empleado) : [];
        const aprobaciones = user ? await obtenerAprobaciones(user.num_empleado) : [];
        const movimientosPropios = user ? await obtenerMisMovimientos(user.num_empleado) : [];
        console.log("Movimientos aprobaciones:", pendientes);
        setMovementsData({
          pendientes,
          aprobaciones,
          propios: movimientosPropios,
        });
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      }
    }

    cargarMovimientos();
  }, [user]);


  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setRequestStatus("submitting");

      // 1. Crear el movimiento
      const movimientoPayload = {
        num_empleado: employeeNumber,
        tipo_movimiento: movementType,
        nivel_aprobacion: nivel_aprobacion,
        fecha_incidencia: incidentDate
          ? incidentDate.toISOString().slice(0, 10)
          : "",
        datos_json: {
          assignedRestDay,
          requestedRestDay,
          newSchedule,
          homeOfficeDays,
          startDate,
          endDate,
          resumeDate,
          tripLocation,
          specialType,
          entryTime,
          delayTime,
          earlyTime,
          exitTime,
          hours,
        },
        comentarios: comments,
      };

      const movimientoResult = await crearMovimiento(movimientoPayload);

      if (!movimientoResult.success) {
        alert("Error creando movimiento");
        setRequestStatus("error");
        return;
      }

      setRequestStatus("success");
      alert("✅ Solicitud enviada correctamente");

      // Opcional: limpiar formulario
      setEmployeeNumber("");
      setIncidentDate(undefined);
      setMovementType("");
      setComments("");
      setAssignedRestDay("");
      setRequestedRestDay("");
      setNewSchedule("");
      setHomeOfficeDays("");
      setStartDate("");
      setEndDate("");
      setResumeDate("");
      setTripLocation("");
      setSpecialType("");
      setEntryTime("");
      setDelayTime("");
      setEarlyTime("");
      setHours("");
      setExitTime("");
    } catch (error) {
      console.error("❌ Error en submit:", error);
      setRequestStatus("error");
      alert("Error enviando la solicitud");
    }
  };
  function renderDatosJsonPorTipo(tipo: string, datos: any) {
    switch (tipo) {
      case "Cambio de descanso":
        return (
          <>
            <p><strong>Día asignado:</strong> {datos.assignedRestDay}</p>
            <p><strong>Día solicitado:</strong> {datos.requestedRestDay}</p>
          </>
        );

      case "Cambio de horario":
        return (
          <>
            <p><strong>Nuevo horario solicitado:</strong> {datos.newSchedule}</p>
          </>
        );

      case "Comisión fuera de Oficina":
        return (
          <>
          </>
        );
      case "Comisión Prolongada fuera de Oficina":
        return (
          <>
            <p><strong>Dias de home office:</strong> {datos.homeOfficeDays}</p>
            <p><strong>Fecha de inicio:</strong> {datos.startDate}</p>
            <p><strong>Fecha de fin:</strong> {datos.endDate}</p>
            <p><strong>Fecha de reincorporación:</strong> {datos.resumeDate}</p>
          </>
        );
      case "Descanso laborado":
        return (
          <>
            <p><strong>Día asignado como descanso:</strong> {datos.assignedRestDay}</p>
            <p><strong>Día laborado como descanso:</strong> {datos.requestedRestDay}</p>
          </>
        );
      case "Viaje de Trabajo":
        return (
          <>
            <p><strong>Ubicación del viaje:</strong> {datos.tripLocation}</p>
            <p><strong>Inicio:</strong> {datos.startDate}</p>
            <p><strong>Fin:</strong> {datos.endDate}</p>
            <p><strong>Reincorporación:</strong> {datos.resumeDate}</p>
          </>
        );

      case "Permisos Especiales":
        let diasDescanso = 0;

        switch (datos.specialType?.toLowerCase()) {
          case "matrimonio":
            diasDescanso = 5;
            break;
          case "muerte":
            diasDescanso = 2;
            break;
          case "paternidad":
            diasDescanso = 5;
            break;
          default:
            diasDescanso = 0;
        }

        return (
          <>
            <p><strong>Tipo de permiso especial:</strong> {datos.specialType}</p>
            <p><strong>Días de descanso asignados:</strong> {diasDescanso}</p>
          </>
        );
      case "Permiso con goce de sueldo":
        return (
          <>
          </>
        );
      case "Permiso sin goce de sueldo":
        return (
          <>
            <p><strong>Día solicitado sin goce de sueldo:</strong> {datos.requestedRestDay}</p>
            <p><strong>Día con goce de sueldo asignado:</strong> {datos.assignedRestDay}</p>
          </>
        );

      case "Permiso para llegar tarde":
        return (
          <>
            <p><strong>Hora de entrada:</strong> {datos.entryTime}</p>
          </>
        );
      case "Retardo justificado":
        return <p><strong>Hora de llegada:</strong> {datos.delayTime}</p>;

      case "Salida anticipada":
        return <p><strong>Hora de salida anticipada:</strong> {datos.earlyTime}</p>;

      case "Sin registro entrada":
        return
      case "Sin registro salida":
        return
      case "Horario de Lactancia":
        return (
          <>
            <p><strong>Nuevo horario solicitado:</strong> {datos.newSchedule}</p>
            <p><strong>Inicio:</strong> {datos.startDate}</p>
            <p><strong>Fin:</strong> {datos.endDate}</p>
            <p><strong>Reincorporación:</strong> {datos.resumeDate}</p>
          </>
        );

      case "Curso/Capacitación":
        return (
          <>
            <p><strong>Dias de curso:</strong> {datos.trainingDays}</p>
            <p><strong>Inicio:</strong> {datos.startDate}</p>
            <p><strong>Fin:</strong> {datos.endDate}</p>
            <p><strong>Reincorporación:</strong> {datos.resumeDate}</p>
          </>
        )
      case "Junta de trabajo":
        return (
          <>
            <p><strong>Dia de reunión asignado:</strong> {datos.assignedRestDay}</p>
            <p><strong>Dia de reunión solicitado:</strong> {datos.requestedRestDay}</p>
          </>
        );

      case "Falta justificada IMSS":
      case "Tiempo extra":
        return (
          <>
            <p><strong>Horas extra:</strong> {datos.hours}</p>
            <p><strong>Hora de entrada:</strong> {datos.entryTime}</p>
            <p><strong>Hora de salida:</strong> {datos.exitTime}</p>
          </>
        );

      default:
        return <p className="text-gray-400 italic">Sin datos específicos</p>;
    }
  }

  useEffect(() => {
    if (movementType) {
      const nivel = nivelAprobacionPorMovimiento[movementType] || 1;
      setNivelAprobacion(nivel);
      console.log(`📌 Nivel de aprobación para "${movementType}":`, nivel);
    }
  }, [movementType]);

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

      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl">
            Movimientos que debes aprobar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
  {movementsData.pendientes.length === 0 ? (
    <p className="text-gray-500">No tienes movimientos por aprobar</p>
  ) : (
    movementsData.pendientes.map((mov, index) => {
      const tipo = mov.tipo_movimiento;
      const resaltado =
        tipo === "Nueva Posición"
          ? "border-red-600 bg-red-50 shadow-md"
          : "border-gray-200";

      // Historial formateado
      const aprobadoresPrevios =
        mov.historial_aprobaciones?.split(",").map((a: string) => {
          const [orden, estatus, aprobador] = a.trim().split(" ");
          return `👤 Aprobador #${aprobador} (orden ${orden})`;
        }) || [];

      const pendientesPrevios =
        mov.pendientes_previos?.split(",").map((a: string) => {
          const [orden, estatus, aprobador] = a.trim().split(" ");
          return `👤 Aprobador pendiente #${aprobador} (orden ${orden})`;
        }) || [];

      return (
        <Card
          key={`${mov.idMovimiento}-${index}`}
          className={`rounded-xl border-2 ${resaltado} p-4 space-y-3`}
        >
          <div className="flex justify-between items-center">
            <p className={`text-md font-semibold text-gray-800`}>
              {tipo === "Nueva Posición" ? "🚨 " : "📄 "}
              {tipo}
            </p>
            <p className="text-sm text-gray-500">
              {mov.fecha_incidencia
                ? format(new Date(mov.fecha_incidencia), "PPP", { locale: es })
                : "Fecha no disponible"}
            </p>
          </div>

          <p className="text-sm text-gray-700">
            <strong>Solicitado por:</strong> 👤 Empleado #{mov.num_empleado}
          </p>

          {mov.comentarios && (
            <p className="text-sm text-muted-foreground italic">
              “{mov.comentarios}”
            </p>
          )}

          {aprobadoresPrevios.length > 0 && (
            <div className="text-sm text-green-600">
              <p className="font-medium">✅ Ya aprobado por:</p>
              <ul className="list-disc list-inside ml-4">
                {aprobadoresPrevios.map((ap: string, i: number) => (
                  <li key={i}>{ap}</li>
                ))}
              </ul>
            </div>
          )}
          {aprobadoresPrevios.length === 0 && (
            <p className="text-sm text-red-600">
              ❌ No ha sido aprobado por nadie
            </p>
          )}
          {pendientesPrevios.length > 0 && (
            <div className="text-sm text-red-600">
              <p className="font-medium">⏳ Pendiente de:</p>
              <ul className="list-disc list-inside ml-4">
                {pendientesPrevios.map((ap: string, i: number) => (
                  <li key={i}>{ap}</li>
                ))}
              </ul>
            </div>
          )}

          <textarea
            placeholder="Observaciones del supervisor"
            className="w-full mt-2 p-2 border rounded-md text-sm"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
          />

          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              className="border-green-500 text-green-700"
              onClick={async () => {
                try {
                  await responderAprobacion(
                    mov.idMovimiento,
                    "aprobado",
                    approvalNotes
                  );
                  if (user) {
                    const pendientesActualizados = await obtenerMovimientosPendientes(user.num_empleado);
                    setMovementsData((prev) => ({
                      ...prev,
                      pendientes: pendientesActualizados,
                    }));
                  }
                  alert(`✅ Aprobado correctamente`);
                } catch (error) {
                  console.error(error);
                  alert("❌ Error al aprobar");
                }
              }}
            >
              Aprobar
            </Button>

            <Button
              variant="outline"
              className="border-red-500 text-red-700"
              onClick={async () => {
                try {
                  await responderAprobacion(
                    mov.idMovimiento,
                    "rechazado",
                    approvalNotes
                  );
                  if (user) {
                    const pendientesActualizados = await obtenerMovimientosPendientes(user.num_empleado);
                    setMovementsData((prev) => ({
                      ...prev,
                      pendientes: pendientesActualizados,
                    }));
                  }
                  alert(`❌ Rechazado correctamente`);
                } catch (error) {
                  console.error(error);
                  alert("❌ Error al rechazar");
                }
              }}
            >
              Rechazar
            </Button>
          </div>
        </Card>
      );
    })
  )}
</CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl">Mis movimientos recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {["pendiente", "aprobado", "rechazado"].map((status) => (
            <div key={status}>
              <h2 className="text-lg font-semibold capitalize mb-2 text-gray-700">
                {status === "pendiente" && "📥 Pendientes"}
                {status === "aprobado" && "✅ Aprobados"}
                {status === "rechazado" && "❌ Rechazados"}
              </h2>

              <div className="grid gap-4">
                {movementsData.propios.length === 0 ? (
                  <p className="text-gray-500">No has solicitado movimientos</p>
                ) : (
                  movementsData.propios
                    .filter((mov) => mov.estatus_movimiento === status)
                    .map((mov) => (
                      <Card key={mov.idMovimiento} className="bg-white/90 border rounded-xl shadow-sm p-4 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-800">📄 {mov.tipo_movimiento}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(mov.fecha_solicitud), "PPP", { locale: es })}
                          </p>
                        </div>

                        <p className="text-sm text-tinto-500 italic">
                          {mov.estatus === "pendiente" &&
                            `En espera de aprobación de: ${mov.supervisorId}`}
                          {mov.estatus === "aprobado" &&
                            `Aprobado por: ${mov.supervisorId}`}
                          {mov.estatus === "rechazado" &&
                            `Rechazado por: ${mov.supervisorId}`}
                        </p>

                        <div className="mt-2 space-y-1 text-sm text-gray-700">
                          {renderDatosJsonPorTipo(mov.tipo_movimiento, mov.datos_json)}
                        </div>
                        <div>
                          <p className="text-sm"> Comentarios: {mov.comentarios}</p>
                        </div>
                      </Card>
                    ))
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4">
        <CardHeader>
          <CardTitle>Solicitud de Autorización</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Número de empleado *</Label>
              <Input
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
                    {incidentDate
                      ? format(incidentDate, "PPP", { locale: es })
                      : "Selecciona una fecha"}
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

          {/* Campos Condicionales */}
          {movementType === "Cambio de descanso" && (
            <RestChangeFields
              assignedDay={assignedRestDay}
              onAssignedDayChange={setAssignedRestDay}
              requestedDay={requestedRestDay}
              onRequestedDayChange={setRequestedRestDay}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Cambio de horario" && (
            <ScheduleChangeFields
              newSchedule={newSchedule}
              onNewScheduleChange={setNewSchedule}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Comisión fuera de Oficina" && (
            <ExternalAssignmentFields
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Comisión Prolongada fuera de Oficina" && (
            <ExtendedAssignmentFields
              homeOfficeDays={homeOfficeDays}
              onHomeOfficeDaysChange={setHomeOfficeDays}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              resumeDate={resumeDate}
              onResumeDateChange={setResumeDate}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Curso/Capacitación" && (
            <TrainingFields
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              resumeDate={resumeDate}
              onResumeDateChange={setResumeDate}
              trainingDays={homeOfficeDays}
              onTrainingDaysChange={setHomeOfficeDays}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Descanso laborado" && (
            <WorkedRestDayFields
              assignedDay={assignedRestDay}
              onAssignedDayChange={setAssignedRestDay}
              requestedDay={requestedRestDay}
              onRequestedDayChange={setRequestedRestDay}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Descanso por comisión laboral" && (
            <CommissionRestDayFields
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Falta justificada IMSS" && (
            <IMSSAbsenceFields
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Horario de Lactancia" && (
            <LactationScheduleFields
              newSchedule={newSchedule}
              onNewScheduleChange={setNewSchedule}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              resumeDate={resumeDate}
              onResumeDateChange={setResumeDate}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Junta de trabajo" && (
            <WorkMeetingFields
              assignedDay={assignedRestDay}
              onAssignedDayChange={setAssignedRestDay}
              requestedDay={requestedRestDay}
              onRequestedDayChange={setRequestedRestDay}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Permisos Especiales" && (
            <SpecialPermissionFields
              specialType={specialType}
              onSpecialTypeChange={setSpecialType}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Permiso con goce de sueldo" && (
            <PaidLeaveFields
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Permiso para llegar tarde" && (
            <LateArrivePermissionFields
              entryTime={entryTime}
              onEntryTimeChange={setEntryTime}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Permiso sin goce de sueldo" && (
            <UnpaidLeaveFields
              assignedDay={assignedRestDay}
              onAssignedDayChange={setAssignedRestDay}
              requestedDay={requestedRestDay}
              onRequestedDayChange={setRequestedRestDay}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Retardo justificado" && (
            <JustifiedDelayFields
              delayTime={delayTime}
              onDelayTimeChange={setDelayTime}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Salida anticipada" && (
            <EarlyLeaveFields
              earlyTime={earlyTime}
              onEarlyTimeChange={setEarlyTime}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Sin registro entrada" && (
            <MissingEntryFields
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Sin registro salida" && (
            <MissingExitFields
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Tiempo extra" && (
            <OvertimeFields
              hours={hours}
              onHoursChange={setHours}
              entryTime={entryTime}
              onEntryTimeChange={setEntryTime}
              exitTime={exitTime}
              onExitTimeChange={setExitTime}
              comments={comments}
              onCommentsChange={setComments}
            />
          )}
          {movementType === "Viaje de Trabajo" && (
            <WorkTripFields
              tripLocation={tripLocation}
              onTripLocationChange={setTripLocation}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              resumeDate={resumeDate}
              onResumeDateChange={setResumeDate}
              comments={comments}
              onCommentsChange={setComments}
            />
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

export default Movements;
