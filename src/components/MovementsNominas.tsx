"use client";

import { useEffect, useState } from "react";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { Info, CalendarIcon } from "lucide-react";
import * as XLSX from "xlsx";

import { useAuth } from "@/app/context/AuthContext";
import { cargarMovimientos } from "@/services/movementsService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function Movements() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState<any | null>(null);
  const [movementsData, setMovementsData] = useState<{ todos: any[] }>({ todos: [] });
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>();
  const [fechaFin, setFechaFin] = useState<Date | undefined>();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setEmployeeNumber(user.num_empleado?.toString() || "");

    const fetchMovimientos = async () => {
      try {
        const data = await cargarMovimientos();
        setMovementsData({ todos: data });
      } catch (error) {
        console.error("❌ Error al cargar movimientos:", error);
      }
    };

    fetchMovimientos();
  }, [user]);

  const movimientosFiltrados = movementsData.todos.filter((mov) => {
    const fechaIncidencia = new Date(mov.fecha_incidencia);
    if (fechaInicio && isBefore(fechaIncidencia, fechaInicio) && !isEqual(fechaIncidencia, fechaInicio)) {
      return false;
    }
    if (fechaFin && isAfter(fechaIncidencia, fechaFin) && !isEqual(fechaIncidencia, fechaFin)) {
      return false;
    }
    return true;
  });

  const exportarAExcel = () => {
    const data = movimientosFiltrados.map((mov) => {
      const datosExtras = Object.entries(mov.datos_json || {}).reduce((acc, [key, value]) => {
        if (value !== "") acc[key] = value;
        return acc;
      }, {} as Record<string, any>);

      return {
        idMovimiento: mov.idMovimiento,
        tipo_movimiento: mov.tipo_movimiento,
        fecha_incidencia: mov.fecha_incidencia,
        num_empleado: mov.num_empleado,
        nivel_aprobacion: mov.nivel_aprobacion,
        estatus_movimiento: mov.estatus_movimiento,
        fecha_solicitud: mov.fecha_solicitud,
        historial_aprobaciones: mov.historial_aprobaciones,
        ...datosExtras,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");
    XLSX.writeFile(workbook, "movimientos_personal.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:grid grid-cols-4 gap-6">
      <Card className="col-span-4 mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Info className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm">
              Movimientos de Personal
            </h1>
          </div>
          <Button onClick={exportarAExcel}>Exportar a Excel</Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaInicio ? format(fechaInicio, "dd/MM/yyyy") : "Fecha inicio"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={fechaInicio} onSelect={setFechaInicio} initialFocus />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaFin ? format(fechaFin, "dd/MM/yyyy") : "Fecha fin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={fechaFin} onSelect={setFechaFin} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <Table>
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
            {movimientosFiltrados.map((mov) => (
              <TableRow
                key={mov.idMovimiento}
                onClick={() => setSelectedMovimiento(mov)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{mov.tipo_movimiento}</TableCell>
                <TableCell>{format(new Date(mov.fecha_incidencia), "yyyy-MM-dd")}</TableCell>
                <TableCell>{mov.num_empleado}</TableCell>
                <TableCell>{mov.nivel_aprobacion}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      mov.estatus_movimiento === "aprobado"
                        ? "default"
                        : mov.estatus_movimiento === "pendiente"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {mov.estatus_movimiento}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedMovimiento} onOpenChange={() => setSelectedMovimiento(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Movimiento</DialogTitle>
          </DialogHeader>
          {selectedMovimiento && (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto text-sm">
              <p><strong>ID Movimiento:</strong> {selectedMovimiento.idMovimiento}</p>
              <p><strong>Tipo:</strong> {selectedMovimiento.tipo_movimiento}</p>
              <p><strong>Empleado:</strong> {selectedMovimiento.num_empleado}</p>
              <p><strong>Fecha Incidencia:</strong> {format(new Date(selectedMovimiento.fecha_incidencia), "yyyy-MM-dd")}</p>
              <p><strong>Fecha Solicitud:</strong> {format(new Date(selectedMovimiento.fecha_solicitud), "yyyy-MM-dd HH:mm")}</p>
              <p><strong>Estatus:</strong> {selectedMovimiento.estatus_movimiento}</p>
              <p><strong>Historial:</strong> {selectedMovimiento.historial_aprobaciones}</p>

              <p className="pt-2 font-bold">Datos Específicos:</p>
              {Object.entries(selectedMovimiento.datos_json || {}).map(([key, value]) => {
                if (value === "") return null;
                return (
                  <p key={key}>
                    <strong>{key}:</strong>{" "}
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Movements;
