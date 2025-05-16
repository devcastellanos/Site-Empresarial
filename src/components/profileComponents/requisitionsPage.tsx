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

type MovimientoPersonal = {
  idMovimiento: number
  num_empleado: number
  tipo_movimiento: string
  fecha_incidencia: string
  datos_json: any
  comentarios: string
  estatus: 'pendiente' | 'aprobado' | 'rechazado'
  fecha_solicitud: string
  rechazado_por: number | null
  nota_rechazo: string | null
  nivel_aprobacion: number
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
      console.log('🚀 Movimientos obtenidos:', data)
      setMovimientos(data)
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
      movimiento.comentarios.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || movimiento.estatus === filterStatus
    const matchesType = filterType === 'all' || movimiento.tipo_movimiento === filterType
    const matchesDate = !dateFilter || 
      new Date(movimiento.fecha_solicitud).toDateString() === dateFilter.toDateString()
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }
  
  return (
    <div className="container mx-auto px-6 py-10">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">📋 Movimientos de Personal</h1>
      <p className="text-sm text-muted-foreground">Gestiona y visualiza solicitudes de cambio o sustitución</p>
    </div>
    <div className="flex gap-3">
      <Button variant="ghost" onClick={handleRefresh} disabled={loading}>
        <RefreshCwIcon className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </Button>
      <Button onClick={() => setShowForm(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Nueva Requisición
      </Button>
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
            <TableHead>Empleado</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovimientos.map((mov, i) => (
            <TableRow key={mov.idMovimiento} className="hover:bg-muted/40">
              <TableCell>{i + 1}</TableCell>
              <TableCell>{mov.num_empleado}</TableCell>
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
            {selectedMovimiento.tipo_movimiento} – Empleado #{selectedMovimiento.num_empleado}
          </DialogDescription>
        </DialogHeader>

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