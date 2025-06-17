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
import { nivelAprobacionPorMovimiento, movements } from "@/lib/movimientos";
import { renderDatosJsonPorTipo } from "@/utils/renderDatosJsonPorTipo";
import Swal from "sweetalert2";

function Movements() {
  const { user } = useAuth();
  const [employeeNumber, setEmployeeNumber] = useState(user?.num_empleado?.toString() || "");
  const [incidentDate, setIncidentDate] = useState<Date>();
  const [movementType, setMovementType] = useState("");
  const [comments, setComments] = useState("");

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
  const [approvalNotes, setApprovalNotes] = useState<{ [id: number]: string }>({});
const [loadingActions, setLoadingActions] = useState<{ [id: number]: boolean }>({});


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


  const canSubmit =
    employeeNumber.trim() !== "" && incidentDate && movementType !== "";

  useEffect(() => {
    if (user?.num_empleado) {
      setEmployeeNumber(user.num_empleado.toString());
    }

    async function cargarMovimientos() {
      if (!user || !user.num_empleado) return;
      try {
        const pendientes = await obtenerMovimientosPendientes(user.num_empleado);
        const aprobaciones = await obtenerAprobaciones(user.num_empleado);
        const movimientosPropios = await obtenerMisMovimientos(user.num_empleado);

        setMovementsData({
          pendientes,
          aprobaciones,
          propios: movimientosPropios,
        });
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      }
    }

    if (user?.num_empleado) cargarMovimientos();
  }, [user]);


  function obtenerEstadoAprobaciones(historialDetallado: any[]) {
    if (!Array.isArray(historialDetallado)) return [];

    return historialDetallado.sort((a, b) => Number(a.orden) - Number(b.orden));
  }

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setRequestStatus("submitting");

      // 1. Crear el movimiento
      const movimientoPayload = {
        num_empleado: employeeNumber,
        tipo_movimiento: movementType,
        nivel_aprobacion: nivelAprobacionPorMovimiento[movementType] || 1,
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
        setRequestStatus("error");

        if (movimientoResult.limite) {
          // Mostramos SweetAlert
          Swal.fire({
            icon: 'warning',
            title: 'Límite alcanzado',
            html: `
    <p style="font-size: 15px; line-height: 1.5; color: #333;">
      Has alcanzado el limite de retardos justificados este mes
    </p>
    <p style="margin-top: 10px; font-size: 14px; color: #555;">
      Si requieres apoyo adicional, por favor contacta a Recursos Humanos.
    </p>
  `,
            confirmButtonColor: '#9A3324',
            confirmButtonText: 'Entendido',
            customClass: {
              popup: 'rounded-xl shadow-lg',
              title: 'text-lg font-semibold',
              confirmButton: 'px-4 py-2 text-white',
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el movimiento. Por favor, intenta de nuevo más tarde.',
            confirmButtonColor: '#9A3324',
            confirmButtonText: 'Entendido',
            customClass: {
              popup: 'rounded-xl shadow-lg',
              title: 'text-lg font-semibold',
              confirmButton: 'px-4 py-2 text-white',
            }
          });
        }
        return;
      }


      setRequestStatus("success");
      Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: 'Tu solicitud ha sido enviada correctamente.',
        confirmButtonColor: '#9A3324',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-lg',
          title: 'text-lg font-semibold',
          confirmButton: 'px-4 py-2 text-white',
        }
      });
      // Opcional: limpiar formulario
      setEmployeeNumber(user?.num_empleado?.toString() || "");
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar tu solicitud. Por favor, intenta de nuevo más tarde.',
        confirmButtonColor: '#9A3324',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-lg',
          title: 'text-lg font-semibold',
          confirmButton: 'px-4 py-2 text-white',
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6   lg:grid grid-cols-4 gap-6">
      <Card className="col-span-4 mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center gap-4">
          <Info className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm">
            Movimientos de Personal
          </h1>
        </div>
      </Card>

      <Card className={`${user?.rol !== "admin" ? "col-span-4" : "col-span-2"
        } space-y-4 bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-4 max-h-[650px]`}>
        <CardHeader>
          <CardTitle>Solicitud de Autorización</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Número de empleado *</Label>
              <Input
                value={employeeNumber}
                required
                disabled
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
          {movementType === "extraoridinario" && (
            <div className="space-y-4">
              <Label>Comentarios</Label>
              <Input
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Escribe tus comentarios aquí"
                className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
              />
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
      {
        user?.rol === "admin" && (
          <Card className="col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-3 max-h-[650px]">
            <CardHeader>
              <CardTitle className="text-xl">
                Movimientos que debes aprobar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto pr-2 max-h-[520px]">
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
                  const aprobadoresPrevios = mov.historial_aprobaciones_detallado?.map((a: any) => {
                    return `✅ ${a.nombre} (Nivel ${a.orden})`;
                  }) || [];

                  const pendientesPrevios = mov.pendientes_previos_detallado?.map((a: any) => {
                    return `⏳ Pendiente: ${a.nombre} (Nivel ${a.orden})`;
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
                        <strong>Solicitado por:</strong> 👤 Empleado #{mov.num_empleado} {mov.nombre_solicitante}
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
                        value={approvalNotes[mov.idMovimiento]}
                        onChange={(e) =>
                          setApprovalNotes((prev) => ({
                            ...prev,
                            [mov.idMovimiento]: e.target.value,
                          }))
                        }
                      />

                      <div className="flex gap-2 justify-end mt-2">
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-700"
                          disabled={loadingActions[mov.idMovimiento]}
                          onClick={async () => {
                            try {
                              setLoadingActions(prev => ({ ...prev, [mov.idMovimiento]: true }));
                              await responderAprobacion(
                                mov.idAprobacion,
                                "aprobado",
                                approvalNotes[mov.idMovimiento]
                              );
                              if (user) {
                                const pendientesActualizados = await obtenerMovimientosPendientes(user.num_empleado);
                                setMovementsData((prev) => ({
                                  ...prev,
                                  pendientes: pendientesActualizados,
                                }));
                              }
                              Swal.fire({
                                icon: 'success',
                                title: 'Aprobación exitosa',
                                text: 'El movimiento ha sido aprobado correctamente.',
                                confirmButtonColor: '#9A3324',
                                confirmButtonText: 'Entendido',
                                customClass: {
                                  popup: 'rounded-xl shadow-lg',
                                  title: 'text-lg font-semibold',
                                  confirmButton: 'px-4 py-2 text-white',
                                }
                              });
                            } catch (error) {
                              console.error(error);
                              Swal.fire({
                                icon: 'error',
                                title: 'Error al aprobar',
                                text: 'Ocurrió un error al aprobar el movimiento. Por favor, intenta de nuevo más tarde.',
                                confirmButtonColor: '#9A3324',
                                confirmButtonText: 'Entendido',
                                customClass: {
                                  popup: 'rounded-xl shadow-lg',
                                  title: 'text-lg font-semibold',
                                  confirmButton: 'px-4 py-2 text-white',
                                }
                              });

                            } finally {
                              setLoadingActions(prev => ({ ...prev, [mov.idMovimiento]: false }));
                            }
                          }}
                        >
                          {loadingActions[mov.idMovimiento] ? "Aprobando..." : "Aprobar"}
                        </Button>

                        <Button
                          variant="outline"
                          className="border-red-500 text-red-700"
                          disabled={loadingActions[mov.idMovimiento]}
                          onClick={async () => {
                            try {
                              setLoadingActions(prev => ({ ...prev, [mov.idMovimiento]: true }));
                              await responderAprobacion(
                                mov.idAprobacion,
                                "rechazado",
                                approvalNotes[mov.idMovimiento]
                              );
                              if (user) {
                                const pendientesActualizados = await obtenerMovimientosPendientes(user.num_empleado);
                                setMovementsData((prev) => ({
                                  ...prev,
                                  pendientes: pendientesActualizados,
                                }));
                              }
                              Swal.fire({
                                icon: 'error',
                                title: 'Movimiento rechazado',
                                text: 'El movimiento ha sido rechazado correctamente.',
                                confirmButtonColor: '#9A3324',
                                confirmButtonText: 'Entendido',
                                customClass: {
                                  popup: 'rounded-xl shadow-lg',
                                  title: 'text-lg font-semibold',
                                  confirmButton: 'px-4 py-2 text-white',
                                }
                              });
                            } catch (error) {
                              console.error(error);
                             
                              Swal.fire({
                                icon: 'error',
                                title: 'Error al rechazar',
                                text: 'Ocurrió un error al rechazar el movimiento. Por favor, intenta de nuevo más tarde.',
                                confirmButtonColor: '#9A3324',
                                confirmButtonText: 'Entendido',
                                customClass: {
                                  popup: 'rounded-xl shadow-lg',
                                  title: 'text-lg font-semibold',
                                  confirmButton: 'px-4 py-2 text-white',
                                }
                              });

                            } finally {
                              setLoadingActions(prev => ({ ...prev, [mov.idMovimiento]: false }));
                            }
                          }}
                        >
                          {loadingActions[mov.idMovimiento] ? "Rechazando..." : "Rechazar"}
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        )
      }

      <Card className="col-span-4 space-y-4 bg-white/80 backdrop-blur-md rounded-2xl border shadow-md p-6">
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

                          <div className="mt-2">
                            <p className="font-medium text-gray-800">Ruta de aprobación:</p>
                            <ul className="list-disc list-inside text-sm ml-2">
                              {obtenerEstadoAprobaciones(mov.historial_aprobaciones_detallado).map((ap, i) => (
                                <p key={i}>
                                  Nivel {ap.orden}: {ap.nombre} - {ap.estatus}
                                </p>
                              ))}
                            </ul>
                          </div>
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

    </div>
  );
}

export default Movements;
