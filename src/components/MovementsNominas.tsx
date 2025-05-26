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
    cargarMovimientos,
} from "@/services/movementsService";
import { useAuth } from "@/app/context/AuthContext";
import { nivelAprobacionPorMovimiento, movements } from "@/lib/movimientos";
import { renderDatosJsonPorTipo } from "@/utils/renderDatosJsonPorTipo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

function Movements() {
    const [employeeNumber, setEmployeeNumber] = useState("");
    const [incidentDate, setIncidentDate] = useState<Date>();
    const [movementType, setMovementType] = useState("");
    const [comments, setComments] = useState("");
    const [nivel_aprobacion, setNivelAprobacion] = useState(1); // Cambia el valor inicial a 1 o al que necesites

    const { user } = useAuth();
    const [movementsData, setMovementsData] = useState<{
        todos: any[];
    }>({
        todos: [],
    });


    const [requestStatus, setRequestStatus] = useState<
        "idle" | "submitting" | "success" | "error"
    >("idle");

    useEffect(() => {
        if (!user) return;

        setEmployeeNumber(user.num_empleado?.toString() || "");

        const fetchMovimientos = async () => {
            try {
                const data = await cargarMovimientos();
                console.log("✅ Movimientos cargados:", data);
                setMovementsData((prev) => ({
                    ...prev,
                    todos: data, // crea una nueva propiedad 'todos'
                }));
            } catch (error) {
                console.error("❌ Error al cargar movimientos:", error);
            }
        };

        fetchMovimientos();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto p-6   lg:grid grid-cols-4 gap-6">
            <Card className="col-span-4 mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
                <div className="flex items-center gap-4">
                    <Info className="w-8 h-8 text-blue-600" />
                    <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm">
                        Movimientos de Personal
                    </h1>
                </div>
                <Table className="mt-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo de Movimiento</TableHead>
                            <TableHead>Fecha de Incidencia</TableHead>
                            <TableHead>Empleado</TableHead>
                            <TableHead>Nivel de Aprobación</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>

                    </TableHeader>
                    <TableBody>
                        {movementsData.todos?.map((mov) => (
                            <TableRow key={mov.idMovimiento}>
                                <TableCell>{mov.tipo_movimiento}</TableCell>
                                <TableCell>{format(new Date(mov.fecha_incidencia), "yyyy-MM-dd")}</TableCell>
                                <TableCell>{mov.num_empleado}</TableCell>
                                <TableCell>{mov.nivel_aprobacion}</TableCell>
                                <TableCell>{mov.estatus_movimiento}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </Card>

        </div>
    );
}

export default Movements;
