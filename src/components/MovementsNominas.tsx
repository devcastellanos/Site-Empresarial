"use client";

import { useEffect, useState } from "react";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { Info, CalendarIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { Combobox as UICombobox, Transition } from "@headlessui/react";
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
import { Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function Movements() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState<any | null>(null);
  const [movementsData, setMovementsData] = useState<{ todos: any[] }>({ todos: [] });
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>();
  const [fechaFin, setFechaFin] = useState<Date | undefined>();
  const { user } = useAuth();
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<Date[]>([]);
  const [vacacionesOriginales, setVacacionesOriginales] = useState({ acumuladas: 0, ley: 0 });
  const [acumuladasRestantes, setAcumuladasRestantes] = useState(0);
  const [leyRestantes, setLeyRestantes] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [estatusFiltro, setEstatusFiltro] = useState("");


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
    if (selectedMovimiento?.tipo_movimiento === "Vacaciones") {
      const fechas = selectedMovimiento.datos_json?.fechas || [];
      const fechasReales = fechas.map((f: string) => {
        const [y, m, d] = f.split("-").map(Number);
        return new Date(y, m - 1, d);
      });
      const acumuladas = parseInt(selectedMovimiento.datos_json?.vacaciones_acumuladas_restantes) || 0;
      const ley = parseInt(selectedMovimiento.datos_json?.vacaciones_ley_restantes) || 0;
      setFechasSeleccionadas(fechasReales);
      setVacacionesOriginales({ acumuladas, ley });
      setAcumuladasRestantes(acumuladas);
      setLeyRestantes(ley);
    }

    fetchMovimientos();
  }, [user, selectedMovimiento]);

  const guardarCambios = async () => {
    if (!selectedMovimiento) return;

    const datos = selectedMovimiento.datos_json || {};
    const totalSolicitado = parseInt(datos.total_dias);
    const fechas = Array.isArray(datos.fechas) ? datos.fechas : [];
    const ley = parseInt(datos.vacaciones_ley_restantes) || 0;
    const acumuladas = parseInt(datos.vacaciones_acumuladas_restantes) || 0;
    const disponibles = ley + acumuladas;

    // Validaciones
    if (isNaN(totalSolicitado) || totalSolicitado <= 0) {
      alert("❌ Debes indicar un número válido de días");
      return;
    }

    if (totalSolicitado > disponibles) {
      alert("❌ No puedes tomar más días de los que tienes disponibles");
      return;
    }

    if (fechas.length < totalSolicitado) {
      alert("❌ Debes seleccionar al menos tantas fechas como días solicitados");
      return;
    }

    // Validar fechas dentro de rango
    const fechaInicio = new Date(datos.fecha_inicio);
    const fechaFin = new Date(datos.fecha_fin);
    if (fechaInicio > fechaFin) {
      alert("❌ La fecha de inicio no puede ser mayor que la fecha de fin");
      return;
    }

    const fechasFueraDeRango = fechas.filter((f: string) => {
      const fecha = new Date(f);
      return fecha < fechaInicio || fecha > fechaFin;
    });

    if (fechasFueraDeRango.length > 0) {
      alert("❌ Hay fechas fuera del rango entre inicio y fin");
      return;
    }

    // Validar fechas duplicadas
    const fechasSet = new Set(fechas);
    if (fechasSet.size !== fechas.length) {
      alert("⚠️ Hay fechas repetidas en el listado");
      return;
    }

    // Enviar al backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movimientos/${selectedMovimiento.idMovimiento}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datos_json: selectedMovimiento.datos_json,
          comentarios: selectedMovimiento.comentarios || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`❌ Error: ${data.message}`);
        return;
      }

      alert("✅ Movimiento actualizado correctamente");
      setSelectedMovimiento(null);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Ocurrió un error al guardar");
    }
  };

  const movimientosFiltrados = movementsData.todos.filter((mov) => {
    const tiposExcluidos = ["Sustitución", "Nueva Posición", "Aumento Plantilla"];
    if (tiposExcluidos.includes(mov.tipo_movimiento)) return false;

    const fechaIncidencia = new Date(mov.fecha_incidencia);

    const coincideFechaInicio = !fechaInicio || isEqual(fechaIncidencia, fechaInicio) || isAfter(fechaIncidencia, fechaInicio);
    const coincideFechaFin = !fechaFin || isEqual(fechaIncidencia, fechaFin) || isBefore(fechaIncidencia, fechaFin);

    const coincideBusqueda = busqueda === "" ||
      mov.num_empleado?.toString().includes(busqueda) ||
      mov.nombre?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = tipoFiltro === "" || mov.tipo_movimiento === tipoFiltro;
    const coincideEstatus = estatusFiltro === "" || mov.estatus_movimiento === estatusFiltro;

    return coincideFechaInicio && coincideFechaFin && coincideBusqueda && coincideTipo && coincideEstatus;
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

  const tiposExcluidos = ["Sustitución", "Nueva Posición", "Aumento Plantilla"];

const tiposDisponibles = [...new Set(
  movementsData.todos
    .map(m => m.tipo_movimiento)
    .filter(tipo => !tiposExcluidos.includes(tipo))
)];

const [query, setQuery] = useState("");

const tiposFiltrados =
  query === ""
    ? tiposDisponibles
    : tiposDisponibles.filter((tipo) =>
        tipo.toLowerCase().includes(query.toLowerCase())
      );

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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por número o nombre"
          className="border p-2 rounded-md w-full"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="w-full">
          <UICombobox value={tipoFiltro} onChange={(value: string) => setTipoFiltro(value)}>
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left border p-2">
                <UICombobox.Input
                  className="w-full border-none focus:ring-0"
                  displayValue={(tipo: string) => tipo}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar tipo de movimiento"
                />
                <UICombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </UICombobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <UICombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm z-10">
                  <UICombobox.Option
                    key="all"
                    value=""
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 px-4 ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    
                  </UICombobox.Option>
                  {tiposFiltrados.map((tipo) => (
                    <UICombobox.Option
                      key={tipo}
                      value={tipo}
                      className={({ active }) =>
                        `cursor-default select-none relative py-2 px-4 ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`${selected ? "font-semibold" : "font-normal"}`}>
                            {tipo}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-white">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </UICombobox.Option>
                  ))}
                </UICombobox.Options>
              </Transition>
            </div>
          </UICombobox>
        </div>

        <select
          className="border p-2 rounded-md w-full"
          value={estatusFiltro}
          onChange={(e) => setEstatusFiltro(e.target.value)}
        >
          <option value="">Todos los estatus</option>
          <option value="aprobado">Aprobado</option>
          <option value="pendiente">Pendiente</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span>{movimientosFiltrados.length} movimientos encontrados</span>
        <Button variant="ghost" onClick={() => {
          setFechaInicio(undefined);
          setFechaFin(undefined);
          setBusqueda("");
          setTipoFiltro("");
          setEstatusFiltro("");
        }}>
          Limpiar filtros
        </Button>
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
              <TableHead>Nombre Empleado</TableHead>
              <TableHead>Número Empleado</TableHead>
              {/* <TableHead>Nivel de Aprobación</TableHead> */}
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
                <TableCell>{mov.nombre}</TableCell>
                <TableCell>{mov.num_empleado}</TableCell>
                {/* <TableCell>{mov.nivel_aprobacion}</TableCell> */}
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
              <p>
                <strong>Fecha Incidencia:</strong>{" "}
                {selectedMovimiento.fecha_incidencia?.slice(0, 10)}
              </p>
              <p>
                <strong>Fecha Solicitud:</strong>{" "}
                {selectedMovimiento.fecha_solicitud
                  ?.replace("T", " ")
                  .slice(0, 16)}
              </p>
              <p><strong>Estatus:</strong> {selectedMovimiento.estatus_movimiento}</p>
              <p><strong>Historial:</strong> {selectedMovimiento.historial_aprobaciones}</p>

              <p className="pt-2 font-bold">Datos Específicos:</p>
              {selectedMovimiento?.tipo_movimiento === "Vacaciones" ? (
                Object.entries(selectedMovimiento.datos_json || {}).map(([key, value]) => {
                  const isEditable = [
                    "total_dias",
                    "fecha_inicio",
                    "fecha_fin",
                    "fechas",
                    "comentarios"
                  ].includes(key);

                  return (
                    <div key={key} className="space-y-1">
                      <label className="block font-medium capitalize">{key}:</label>
                      {key === "fechas" ? (
                        <>
                          <Calendar
                            mode="multiple"
                            selected={fechasSeleccionadas}
                            onSelect={(dates: Date[] | undefined) => {
                              const nuevasFechas = dates || [];
                              const ordenadas = [...nuevasFechas].sort((a, b) => a.getTime() - b.getTime());
                              const fechaFormateada = (d: Date) => format(d, "yyyy-MM-dd");

                              const anteriores = new Set(fechasSeleccionadas.map(fechaFormateada));
                              const nuevas = new Set(ordenadas.map(fechaFormateada));

                              const agregadas = [...nuevas].filter((f) => !anteriores.has(f));
                              const eliminadas = [...anteriores].filter((f) => !nuevas.has(f));

                              console.log("➡️ Fechas seleccionadas antes:", [...anteriores]);
                              console.log("➡️ Fechas seleccionadas ahora :", [...nuevas]);
                              console.log("🟢 Agregadas:", agregadas);
                              console.log("🔴 Eliminadas:", eliminadas);

                              let nuevasAcumuladas = acumuladasRestantes;
                              let nuevasLey = leyRestantes;

                              if (agregadas.length > 0) {
                                for (let i = 0; i < agregadas.length; i++) {
                                  if (nuevasAcumuladas > 0) nuevasAcumuladas--;
                                  else if (nuevasLey > 0) nuevasLey--;
                                  else {
                                    alert("❌ No tienes días suficientes para agregar más fechas.");
                                    return;
                                  }
                                }
                              }

                              if (eliminadas.length > 0) {
                                for (let i = 0; i < eliminadas.length; i++) {
                                  const totalSeleccionadas = nuevasFechas.length;

                                  // Asume que ley se usa al final, así que devolvemos a ley primero si fue usada
                                  if (totalSeleccionadas < vacacionesOriginales.acumuladas) {
                                    nuevasAcumuladas++;
                                  } else {
                                    nuevasLey++;
                                  }
                                }
                              }

                              const usadas = ordenadas.length;
                              const usadasAcumuladas = vacacionesOriginales.acumuladas - nuevasAcumuladas;
                              const usadasLey = vacacionesOriginales.ley - nuevasLey;

                              console.log("📊 Total días usados:", usadas);
                              console.log("💼 Usadas acumuladas:", usadasAcumuladas);
                              console.log("📘 Usadas ley:", usadasLey);
                              console.log("🧮 Nuevas acumuladas restantes:", nuevasAcumuladas);
                              console.log("📗 Nuevas ley restantes:", nuevasLey);

                              setAcumuladasRestantes(nuevasAcumuladas);
                              setLeyRestantes(nuevasLey);
                              setFechasSeleccionadas(ordenadas);
                              setSelectedMovimiento((prev: any) => ({
                                ...prev,
                                datos_json: {
                                  ...prev.datos_json,
                                  fechas: ordenadas.map(fechaFormateada),
                                  total_dias: usadas,
                                  fecha_inicio: ordenadas[0] ? fechaFormateada(ordenadas[0]) : "",
                                  fecha_fin: ordenadas[usadas - 1] ? fechaFormateada(ordenadas[usadas - 1]) : "",
                                  vacaciones_acumuladas_restantes: nuevasAcumuladas,
                                  vacaciones_ley_restantes: nuevasLey,
                                },
                              }));
                            }}


                            className="border rounded-md"
                            initialFocus
                          />
                          {Array.isArray(value) && value.length > 0 && (
                            <div className="text-xs text-gray-600 mt-2">
                              Fechas seleccionadas: {value.join(", ")}
                            </div>
                          )}
                        </>
                      ) : isEditable ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded-md"
                          value={String(value || "")}
                          onChange={(e) =>
                            setSelectedMovimiento((prev: any) => ({
                              ...prev,
                              datos_json: {
                                ...prev.datos_json,
                                [key]: e.target.value,
                              },
                            }))
                          }
                        />
                      ) : (
                        <p>{String(value)}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No hay datos específicos para este tipo de movimiento.</p>
              )}

            </div>
          )}

          {selectedMovimiento?.tipo_movimiento === "Vacaciones" && (
            <div className="pt-4 flex justify-end">
              <Button onClick={guardarCambios}>Guardar cambios</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Movements;
