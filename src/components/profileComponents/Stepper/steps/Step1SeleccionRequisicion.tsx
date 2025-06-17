import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { puestos } from "@/lib/puestos"
import { useAuth } from "@/app/context/AuthContext"
const motivos = ["Sustitución", "Nueva Posición", "Aumento Plantilla"]
const tiposIncapacidad = ["Enfermedad General", "Accidente de trabajo", "Accidente en trayecto"]

export default function Step1SeleccionRequisicion({
  data,
  updateData,
}: {
  data: any
  updateData: (val: any) => void
}) {
  const [fecha, setFecha] = useState<Date | undefined>(data.fecha_solicitud || new Date())
  const { user } = useAuth()


  useEffect(() => {
    updateData({ fecha_solicitud: fecha })
  }, [fecha])

  useEffect(() => {
    updateData({ num_empleado: user?.num_empleado })
  }, [user?.num_empleado])


  return (
    <div className="space-y-6">
      <div>
        <Label>Número de empleado</Label>
        <Input
          value={user?.num_empleado || ""}
          disabled
          placeholder="Ej. 1234"
        />
      </div>

      <div>
        <Label>Fecha de Solicitud</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !fecha && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fecha ? format(fecha, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={fecha} onSelect={setFecha} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Motivo del puesto vacante</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {motivos.map((motivo) => (
            <Button
              key={motivo}
              variant={data.motivo === motivo ? "default" : "outline"}
              className="w-full"
              onClick={() =>
                updateData({
                  motivo,
                  tipo_sustitucion: "",
                  tipo_incapacidad: "",
                  tiempo_incapacidad: "",
                })
              }
            >
              {motivo}
            </Button>
          ))}
        </div>
      </div>

      {(data.motivo === "Sustitución" || data.motivo === "Aumento Plantilla") && (
        <>
          {/* Si motivo es Sustitución, mostrar selección del tipo */}
          {data.motivo === "Sustitución" && (
            <div className="space-y-2">
              <Label>Tipo de Sustitución</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant={data.tipo_sustitucion === "puesto" ? "default" : "outline"}
                  className="w-full"
                  onClick={() =>
                    updateData({
                      tipo_sustitucion: "puesto",
                      tipo_incapacidad: "",
                      tiempo_incapacidad: "",
                    })
                  }
                >
                  Por Puesto
                </Button>
                <Button
                  variant={data.tipo_sustitucion === "incapacidad" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => updateData({ tipo_sustitucion: "incapacidad" })}
                >
                  Por Incapacidad
                </Button>
              </div>
            </div>
          )}

          {/* Si tipo de sustitución es incapacidad, pedir tipo y tiempo */}
          {data.tipo_sustitucion === "incapacidad" && (
            <div className="space-y-4 pt-2">
              <div>
                <Label>Tipo de Incapacidad</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  {tiposIncapacidad.map((tipo) => (
                    <Button
                      key={tipo}
                      variant={data.tipo_incapacidad === tipo ? "default" : "outline"}
                      className="w-full"
                      onClick={() => updateData({ tipo_incapacidad: tipo })}
                    >
                      {tipo}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Tiempo estimado de Incapacidad</Label>
                <Input
                  value={data.tiempo_incapacidad || ""}
                  onChange={(e) => updateData({ tiempo_incapacidad: e.target.value })}
                  placeholder="Ej. 30 días"
                />
              </div>
            </div>
          )}

          <div>
            <Label>Puesto requerido</Label>
            <select
              value={data.puesto || ""}
              onChange={(e) => updateData({ puesto: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecciona un puesto</option>
              {puestos.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Justificación</Label>
            <Textarea
              value={data.justificacion || ""}
              onChange={(e) => updateData({ justificacion: e.target.value })}
              placeholder="Describe por qué se solicita este puesto"
            />
          </div>
        </>
      )}
    </div>
  )
}
