import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { puestos } from "@/lib/puestos"
import { useAuth } from "@/app/context/AuthContext"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

const motivos = ["Sustitución", "Nueva Posición", "Aumento Plantilla"]
const tiposIncapacidad = ["Enfermedad General", "Accidente de trabajo", "Accidente en trayecto"]

export default function Step1SeleccionRequisicion({
  data,
  updateData,
}: {
  data: any
  updateData: (val: any) => void
}) {
  const [fecha, setFecha] = useState<Date>(() => {
    if (data.fecha_solicitud instanceof Date) return data.fecha_solicitud
    if (typeof data.fecha_solicitud === 'string') return new Date(data.fecha_solicitud)
    return new Date()
  })

  const [puestoInput, setPuestoInput] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (!data.fecha_solicitud && user?.num_empleado) {
      updateData({
        fecha_solicitud: fecha,
        num_empleado: user.num_empleado,
      })
    }
  }, [])

  const handleSelectFecha = (newFecha: Date | undefined) => {
    if (!newFecha) return
    setFecha(newFecha)
    updateData({ fecha_solicitud: newFecha })
  }

  const handleSelectPuesto = (value: string) => {
    updateData({ puesto: value })
    setPuestoInput("")
  }

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
            <Calendar
              mode="single"
              selected={fecha}
              onSelect={handleSelectFecha}
              initialFocus
            />
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {data.puesto || "Selecciona o escribe un puesto"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full max-h-64 overflow-auto p-0 shadow-md border rounded-md"
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={false} // 👈 desactiva el reposicionamiento automático
              >
                <Command>
                  <CommandInput
                    placeholder="Buscar o escribir puesto"
                    value={puestoInput}
                    onValueChange={setPuestoInput}
                  />
                  <CommandEmpty>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No encontrado. Presiona Enter para usar: <strong>{puestoInput}</strong>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {puestos.map((p) => (
                      <CommandItem
                        key={p}
                        onSelect={() => handleSelectPuesto(p)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", p === data.puesto ? "opacity-100" : "opacity-0")}
                        />
                        {p}
                      </CommandItem>
                    ))}
                    {puestoInput && !puestos.includes(puestoInput) && (
                      <CommandItem onSelect={() => handleSelectPuesto(puestoInput)}>
                        <Check className="mr-2 h-4 w-4 opacity-100" />
                        {puestoInput} <span className="ml-1 text-xs text-muted-foreground">(nuevo)</span>
                      </CommandItem>
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>

            </Popover>
          </div>

          {data.puesto && !puestos.includes(data.puesto) && (
            <div className="mt-3">
              <Label>Especificar otro puesto</Label>
              <Input
                placeholder="Ingresa el nombre del puesto"
                value={data.puesto}
                onChange={(e) => updateData({ puesto: e.target.value })}
              />
            </div>
          )}

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
