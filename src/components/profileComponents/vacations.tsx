"use client";

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { differenceInDays, isBefore, parse, format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../../app/context/AuthContext";
import { User } from "@/lib/interfaces";

function Vacations() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [comments, setComments] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const tipoMovimiento = "vacaciones";
  const nivel_aprobacion = 1;
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
        const data = await res.json();
        const usuarios = data.map((u: any) => ({ ...u, Personal: Number(u.Personal) }));
        const emp = usuarios.find((u: User) => u.Personal === user?.num_empleado);
        setEmpleado(emp || null);
      } catch (e) {
        console.error("Error al obtener usuarios:", e);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const parsedHireDate = useMemo(() => {
    if (!empleado?.FechaAlta) return null;
    const parsed = parse(empleado.FechaAlta, "dd/MM/yyyy", new Date());
    return isNaN(parsed.getTime()) ? null : parsed;
  }, [empleado]);

  const calculateYearsOfService = (hireDate: Date) => {
    const today = new Date();
    let years = today.getFullYear() - hireDate.getFullYear();
    const anniversary = new Date(today.getFullYear(), hireDate.getMonth(), hireDate.getDate());
    if (today < anniversary) years--;
    return years;
  };

  const getNextVacationIncrementDate = (hireDate: Date) => {
    const years = calculateYearsOfService(hireDate) + 1;
    const next = new Date(hireDate);
    next.setFullYear(hireDate.getFullYear() + years);
    return next;
  };

  const totalDays = (empleado?.vacaciones_acumuladas ?? 0) + (empleado?.vacaciones_ley ?? 0);
  const remainingDays = parsedHireDate ? Math.max(totalDays - selectedDates.length, 0) : 0;
  const nextIncrement = parsedHireDate ? getNextVacationIncrementDate(parsedHireDate) : null;
  const daysUntilNextIncrement = nextIncrement ? differenceInDays(nextIncrement, new Date()) : 0;
  const progressValue = totalDays > 0 ? (selectedDates.length / totalDays) * 100 : 0;
  const totalSolicitados = selectedDates.length;
  let usadasAcumuladas = 0;
  let usadasLey = 0;

  if (empleado) {
    const acumuladas = empleado.vacaciones_acumuladas ?? 0;
    const ley = empleado.vacaciones_ley ?? 0;

    if (totalSolicitados <= acumuladas) {
      usadasAcumuladas = totalSolicitados;
      usadasLey = 0;
    } else {
      usadasAcumuladas = acumuladas;
      usadasLey = totalSolicitados - acumuladas;
    }
  }

  const vacacionesAcumuladasRestantes = Math.max((empleado?.vacaciones_acumuladas ?? 0) - usadasAcumuladas, 0);
  const vacacionesLeyRestantes = Math.max((empleado?.vacaciones_ley ?? 0) - usadasLey, 0);

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (dates) setSelectedDates(dates);
  };

  const [resumenVacaciones, setResumenVacaciones] = useState<{
    total_primavacacional_vigente: number;
    total_dias_vacaciones: number;
    saldo_vigente: number;
  } | null>(null);

  useEffect(() => {
    const fetchResumen = async () => {
      if (!user?.num_empleado) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NOM_API_URL}/api/vacaciones/resumen/${user.num_empleado}`);
        const data = await res.json();
        setResumenVacaciones(data);
      } catch (e) {
        console.error("Error al obtener resumen de vacaciones:", e);
      }
    };

    fetchResumen();
  }, [user]);



  const handleSubmit = async () => {
    if (!user || !parsedHireDate || !nextIncrement) return;
    setRequestStatus("submitting");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vacaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_empleado: user.num_empleado,
          fechas: selectedDates.map(d => d.toISOString().split("T")[0]),
          comentarios: comments,
          tipo_movimiento: tipoMovimiento,
          nivel_aprobacion,
          datos_json: {
            fechas: selectedDates.map(d => d.toISOString().split("T")[0]),
            fecha_inicio: selectedDates[0].toISOString().split("T")[0],
            fecha_fin: selectedDates[selectedDates.length - 1].toISOString().split("T")[0],
            total_dias: totalSolicitados,
            vacaciones_acumuladas_restantes: vacacionesAcumuladasRestantes,
            vacaciones_ley_restantes: vacacionesLeyRestantes,
            fecha_ingreso: parsedHireDate.toISOString().split("T")[0],
            proximo_incremento: nextIncrement.toISOString().split("T")[0],
            empleado_apto: totalDays > 0,
            comentarios: comments
          }
        })
      });
      if (res.ok) {
        setRequestStatus("success");
        setSelectedDates([]);
        setComments("");
      } else setRequestStatus("error");
    } catch (e) {
      console.error("Error enviando solicitud:", e);
      setRequestStatus("error");
    }
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

  const legalClauses = [
    "Derecho a 12 días de vacaciones después del primer año de servicio.",
    "Aumento de 2 días por cada año subsecuente hasta llegar a 20 días.",
    "A partir del 5º año, el periodo de vacaciones aumentará en 2 días por cada 5 años de servicio.",
    "Las vacaciones deberán disfrutarse dentro de los 6 meses siguientes al cumplimiento del año de servicio.",
    "El patrón podrá dividir el periodo vacacional a petición del trabajador.",
    "Las vacaciones deberán ser solicitadas con al menos 15 días de anticipación.",
  ];

  return (
    <>
    <div className="max-w-fit mx-auto p-6 space-y-6">
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
                <div>
                  <strong className="block">Fecha de ingreso:</strong>
                  <span>
                    {parsedHireDate && !isNaN(parsedHireDate.getTime())
                      ? format(parsedHireDate, "PPP", { locale: es })
                      : "Fecha no válida"}
                  </span>
                </div>

                <div>
                  {/* <strong>Tipo de movimiento:</strong> {tipoMovimiento} */}
                  <div>
                    <strong>Estado:</strong>{" "}
                    {totalDays > 0 ? (
                      <Badge variant="default">Apto para vacaciones</Badge>
                    ) : (
                      <Badge variant="destructive">No apto para vacaciones</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Días acumulados:</strong> {resumenVacaciones?.total_primavacacional_vigente ?? "-"} <br />
                  <strong>Días solicitados:</strong> {resumenVacaciones?.total_dias_vacaciones ?? "-"} <br />
                  <strong>Días disponibles:</strong> {resumenVacaciones?.saldo_vigente ?? "-"}
                </p>
                <div>
                  <strong className="block">Próximo incremento:</strong>
                  <span>
                    {nextIncrement
                      ? format(nextIncrement, "PPP", { locale: es })
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoBox label="Apto para vacaciones" value={totalDays > 0 ? "Sí" : "No"} icon={totalDays > 0 ? "✅" : "❌"} />
              <InfoBox
                label="Días disponibles"
                value={
                  resumenVacaciones
                    ? `${resumenVacaciones.saldo_vigente} días`
                    : "Cargando..."
                }
              />
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
                {(() => {
                  const today = new Date(); return (
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={handleDateSelect}
                      className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
                      locale={es}
                      disabled={(date) =>
                        isBefore(date, today) ||
                        (!selectedDates.some((d) => d.getTime() === date.getTime()) &&
                          selectedDates.length >= totalDays)
                      }
                    />
                  );
                })()}
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
                    {resumenVacaciones?.saldo_vigente ?? "-"} días
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
  </>
  );
}

export default Vacations;
