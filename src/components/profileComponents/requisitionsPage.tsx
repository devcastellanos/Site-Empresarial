import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { CalendarIcon, FilterIcon, SearchIcon, RefreshCwIcon, PlusIcon, XIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'
import { Switch } from '@radix-ui/react-switch'
import { crearMovimiento } from "@/services/movementsService"
import StepperContainer from './Stepper/StepperContainer'
import { useAuth } from '../../app/context/AuthContext'
import * as XLSX from 'xlsx';
import { startOfDay, endOfDay } from 'date-fns'


type MovimientoPersonal = {
  idMovimiento: number
  num_empleado: number
  nombre: string
  tipo_movimiento: string
  fecha_incidencia: string
  datos_json: any
  comentarios: string
  estatus: 'pendiente' | 'aprobado' | 'rechazado'
  fecha_solicitud: string
  rechazado_por: number | null
  nota: string | null
  nivel_aprobacion: number
  historial_aprobaciones?: {
    orden: number
    id_aprobador: number
    nombre_aprobador?: string
    estatus: string
    nota?: string
    fecha_aprobacion?: string
  }[]
}

function RequisitionsPage() {
  const [movimientos, setMovimientos] = useState<MovimientoPersonal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoPersonal | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth();
  const [filterByNombre, setFilterByNombre] = useState('');
const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
  from: undefined,
  to: undefined,
});

  // Simulación de fetch de datos
  useEffect(() => {
    if (!user?.num_empleado) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movimientos/requisiciones/${user.num_empleado}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const { data } = await response.json()
        let filteredData = data;

        // 🎯 Filtrado según el rol
        if (user.rol !== "Reclutamiento" && user.rol !== "admin") {
          filteredData = data.filter((mov: MovimientoPersonal) => mov.estatus === "aprobado");
        }
        console.log('🚀 Movimientos obtenidos:', data)
        setMovimientos(filteredData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [user])


const filteredMovimientos = movimientos.filter(movimiento => {
  const matchesSearch =
    movimiento.num_empleado.toString().includes(searchTerm.toLowerCase()) ||
    movimiento.tipo_movimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimiento.comentarios?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesNombre = !filterByNombre || movimiento.nombre?.toLowerCase().includes(filterByNombre.toLowerCase());
  const matchesStatus = filterStatus === 'all' || movimiento.estatus === filterStatus;
  const matchesType = filterType === 'all' || movimiento.tipo_movimiento === filterType;

  const fechaSolicitud = new Date(movimiento.fecha_incidencia);
const matchesDateRange =
  (!dateRange.from && !dateRange.to) ||
  (dateRange.from && dateRange.to && 
    fechaSolicitud >= startOfDay(dateRange.from) && 
    fechaSolicitud <= endOfDay(dateRange.to)) ||
  (dateRange.from && !dateRange.to && 
    fechaSolicitud >= startOfDay(dateRange.from)) ||
  (!dateRange.from && dateRange.to && 
    fechaSolicitud <= endOfDay(dateRange.to));

  return matchesSearch && matchesNombre && matchesStatus && matchesType && matchesDateRange;
});

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
    window.location.reload()
  }

  const exportToExcel = () => {
    const exportData = filteredMovimientos.map((mov) => ({
      ID: mov.idMovimiento,
      Empleado: mov.num_empleado,
      Tipo: mov.tipo_movimiento,
      'Fecha Incidencia': format(new Date(mov.fecha_incidencia), 'dd/MM/yyyy'),
      Estatus: mov.estatus.toUpperCase(),
      Comentarios: mov.comentarios || '',
      'Fecha Solicitud': format(new Date(mov.fecha_solicitud), 'dd/MM/yyyy'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requisiciones');

    XLSX.writeFile(workbook, 'reporte_requisiciones.xlsx');
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Requisiciones de Personal</h1>
          <p className="text-sm text-muted-foreground">Gestiona y visualiza solicitudes de cambio o sustitución</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleRefresh} disabled={loading}>
            <RefreshCwIcon className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>

          <Button variant="outline" onClick={exportToExcel}>
            Descargar Reporte
          </Button>

            <Button onClick={() => setShowForm(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Requisición
            </Button>
          
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">

  <div>
    <Label>Solicitante</Label>
    <Input
      placeholder="Nombre del solicitante"
      value={filterByNombre}
      onChange={(e) => setFilterByNombre(e.target.value)}
    />
  </div>

  <div>
    <Label>Estatus</Label>
    <Select value={filterStatus} onValueChange={setFilterStatus}>
      <SelectTrigger>
        <SelectValue placeholder="Estatus" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="pendiente">Pendiente</SelectItem>
        <SelectItem value="aprobado">Aprobado</SelectItem>
        <SelectItem value="rechazado">Rechazado</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div>
    <Label>Tipo</Label>
    <Select value={filterType} onValueChange={setFilterType}>
      <SelectTrigger>
        <SelectValue placeholder="Tipo de Movimiento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="Sustitución">Sustitución</SelectItem>
        <SelectItem value="Aumento Plantilla">Aumento Plantilla</SelectItem>
        <SelectItem value="Nueva Posición">Nueva Posición</SelectItem>
        {/* Agrega más tipos si es necesario */}
      </SelectContent>
    </Select>
  </div>

  <div>
    <Label>Fecha de Solicitud</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from
            ? dateRange.to
              ? `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`
              : format(dateRange.from, 'dd MMM yyyy')
            : 'Seleccionar rango'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          initialFocus
          mode="range"
          selected={dateRange}
          onSelect={(range) => setDateRange(range ?? { from: undefined, to: undefined })}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  </div>
</div>


      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Listado de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Número Empleado</TableHead>
                <TableHead>Nombre Solicitante</TableHead>
                <TableHead>Tipo Requisición</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimientos.map((mov, i) => (
                <TableRow key={mov.idMovimiento} className="hover:bg-muted/40">
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{mov.num_empleado}</TableCell>
                  <TableCell>{mov.nombre}</TableCell>
                  <TableCell>
                    {mov.tipo_movimiento === 'Sustitución'
                      ? `${mov.tipo_movimiento} (${mov.datos_json?.tipo_sustitucion})`
                      : mov.tipo_movimiento}
                  </TableCell>
                  <TableCell>
                    {format(new Date(mov.fecha_incidencia), 'dd MMM yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        mov.estatus === 'aprobado'
                          ? 'border-green-500 text-green-700'
                          : mov.estatus === 'rechazado'
                            ? 'border-red-500 text-red-700'
                            : 'border-yellow-500 text-yellow-700'
                      }
                    >
                      {mov.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="secondary" onClick={() => setSelectedMovimiento(mov)}>
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <div className="mt-8">
          <StepperContainer />
        </div>
      )}

      {selectedMovimiento && (
        <Dialog open={true} onOpenChange={() => setSelectedMovimiento(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>📝 Detalles del Movimiento</DialogTitle>
              <DialogDescription>
                {selectedMovimiento.tipo_movimiento} – Empleado {selectedMovimiento.nombre}
              </DialogDescription>
            </DialogHeader>

<Card className="bg-muted/30 p-4">
  <div className="flex items-center justify-between mb-4">
    <div>
      <strong>Historial de Aprobaciones</strong>
    </div>
    <div className="text-sm text-muted-foreground">
      Nivel de Aprobación: {selectedMovimiento.nivel_aprobacion}
    </div>
  </div>

  {(selectedMovimiento.historial_aprobaciones && selectedMovimiento.historial_aprobaciones.length > 0) ? (
    <div className="overflow-auto">
      <table className="w-full text-sm border border-muted rounded-md overflow-hidden">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-3 py-2 border-b">Orden</th>
            <th className="text-left px-3 py-2 border-b">Aprobador</th>
            <th className="text-left px-3 py-2 border-b">Estatus</th>
            <th className="text-left px-3 py-2 border-b">Nota</th>
            <th className="text-left px-3 py-2 border-b">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {selectedMovimiento.historial_aprobaciones.map((aprob: any, i: number) => (
            <tr key={i} className="even:bg-muted/20">
              <td className="px-3 py-2">{aprob.orden}</td>
              <td className="px-3 py-2">{aprob.nombre_aprobador || `Empleado #${aprob.id_aprobador}`}</td>
              <td className="px-3 py-2 capitalize">{aprob.estatus}</td>
              <td className="px-3 py-2">{aprob.nota || '—'}</td>
              <td className="px-3 py-2">
                {aprob.fecha_aprobacion
                  ? format(new Date(aprob.fecha_aprobacion), 'dd MMM yyyy HH:mm', { locale: es })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground italic">Sin historial de aprobaciones.</p>
  )}

  {selectedMovimiento.nota && (
    <div className="mt-2">
      <strong>Nota:</strong> {selectedMovimiento.nota}
    </div>
  )}

  {selectedMovimiento.rechazado_por && (
    <div className="text-red-600 mt-1">
      Rechazado por Empleado #{selectedMovimiento.rechazado_por}
    </div>
  )}
</Card>


            <Card className="bg-muted/30 p-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><strong>Fecha solicitud:</strong><br />{format(new Date(selectedMovimiento.datos_json?.fecha_solicitud), 'dd MMM yyyy', { locale: es })}</div>
                <div><strong>Puesto:</strong><br />{selectedMovimiento.datos_json?.puesto || selectedMovimiento.datos_json?.nombre_posicion || '—'}</div>
                <div><strong>Motivo:</strong><br />{selectedMovimiento.datos_json?.motivo}</div>
                <div><strong>Justificación:</strong><br />{selectedMovimiento.datos_json?.justificacion || '—'}</div>
                <div><strong>Sustitución:</strong><br />{selectedMovimiento.datos_json?.tipo_sustitucion || '—'}</div>
                <div><strong>Incapacidad:</strong><br />{selectedMovimiento.datos_json?.tipo_incapacidad || '—'}</div>
                <div><strong>Duración:</strong><br />{selectedMovimiento.datos_json?.tiempo_incapacidad || '—'}</div>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">📌 Datos Generales</h4>
                <ul className="text-sm list-disc list-inside grid grid-cols-2 gap-2">
                  {Object.entries(selectedMovimiento.datos_json?.datos_generales || {}).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}</li>
                  ))}
                </ul>
              </div>

              {selectedMovimiento.datos_json?.relaciones_internas?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">🤝 Relaciones Internas</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedMovimiento.datos_json.relaciones_internas.map((rel: any, i: number) => (
                      <li key={i}>{rel.area} – {rel.descripcion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMovimiento.datos_json?.relaciones_externas?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">🌐 Relaciones Externas</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedMovimiento.datos_json.relaciones_externas.map((rel: any, i: number) => (
                      <li key={i}>{rel.area} – {rel.descripcion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMovimiento.datos_json?.riesgos?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">⚠️ Riesgos</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedMovimiento.datos_json.riesgos.map((r: any, i: number) => (
                      <li key={i}>{r.riesgo} – {r.accion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <DialogFooter className="mt-6">
              <Button variant="secondary" onClick={() => setSelectedMovimiento(null)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>


  )
}

export default RequisitionsPage