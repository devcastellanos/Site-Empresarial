import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const equiposDisponibles = [
  "Equipo de cómputo de escritorio",
  "Portátil",
  "iPad",
  "Celular",
  "Teléfono fijo",
  "Viajara",
  "Equipo de transporte",
  "Cuenta de correo",
  "Cuenta de Intelisis",
  "No aplica",
]

const turnos = ["Matutino", "Vespertino", "Mixto", "Nocturno"]

export default function Step4DatosGenerales({
  data,
  updateData,
}: {
  data: any
  updateData: (val: any) => void
}) {
  const [equipo, setEquipo] = useState<string[]>(data?.datos_generales?.equipo || [])

  useEffect(() => {
    if (JSON.stringify(data.datos_generales?.equipo || []) !== JSON.stringify(equipo)) {
      updateData({
        datos_generales: {
          ...data.datos_generales,
          equipo,
        },
      })
    }
  }, [equipo])

  const handleEquipoToggle = (item: string, checked: boolean) => {
    if (checked) {
      setEquipo(prev => [...prev, item])
    } else {
      setEquipo(prev => prev.filter(i => i !== item))
    }
  }

  const updateField = (field: string, value: string) => {
    updateData({
      datos_generales: {
        ...data.datos_generales,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Observaciones</Label>
        <Textarea
          value={data.datos_generales?.observaciones || ""}
          onChange={(e) => updateField("observaciones", e.target.value)}
          placeholder="Comentarios adicionales"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Género</Label>
          <Select
            value={data.datos_generales?.genero || ""}
            onValueChange={(val) => updateField("genero", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hombre">Hombre</SelectItem>
              <SelectItem value="Mujer">Mujer</SelectItem>
              <SelectItem value="Indistinto">Indistinto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Rango de Edad</Label>
          <Input
            value={data.datos_generales?.edad || ""}
            onChange={(e) => updateField("edad", e.target.value)}
            placeholder="Ej. 25-35"
          />
        </div>
        <div>
          <Label>Escolaridad</Label>
          <Input
            value={data.datos_generales?.escolaridad || ""}
            onChange={(e) => updateField("escolaridad", e.target.value)}
            placeholder="Ej. Licenciatura en Administración"
          />
        </div>
        <div>
          <Label>Idiomas</Label>
          <Input
            value={data.datos_generales?.idiomas || ""}
            onChange={(e) => updateField("idiomas", e.target.value)}
            placeholder="Ej. Español, Inglés"
          />
        </div>
        <div>
          <Label>Experiencia mínima requerida</Label>
          <Input
            value={data.datos_generales?.experiencia || ""}
            onChange={(e) => updateField("experiencia", e.target.value)}
            placeholder="Ej. 2 años en puesto similar"
          />
        </div>
        <div>
          <Label>Conocimientos generales</Label>
          <Input
            value={data.datos_generales?.conocimientos || ""}
            onChange={(e) => updateField("conocimientos", e.target.value)}
            placeholder="Ej. Paquetería Office, SAP"
          />
        </div>
        <div>
          <Label>Competencias del puesto</Label>
          <Input
            value={data.datos_generales?.competencias || ""}
            onChange={(e) => updateField("competencias", e.target.value)}
            placeholder="Ej. Liderazgo, trabajo en equipo"
          />
        </div>
        <div>
          <Label>Habilidades específicas</Label>
          <Input
            value={data.datos_generales?.habilidades || ""}
            onChange={(e) => updateField("habilidades", e.target.value)}
            placeholder="Ej. Resolución de problemas"
          />
        </div>
        <div>
          <Label>Turno</Label>
          <Select
            value={data.datos_generales?.turno || ""}
            onValueChange={(val) => updateField("turno", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un turno" />
            </SelectTrigger>
            <SelectContent>
              {turnos.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Horario</Label>
          <Input
            value={data.datos_generales?.horario || ""}
            onChange={(e) => updateField("horario", e.target.value)}
            placeholder="Ej. 08:00 - 17:00"
          />
        </div>
        <div>
          <Label>Día de descanso</Label>
          <Input
            value={data.datos_generales?.descanso || ""}
            onChange={(e) => updateField("descanso", e.target.value)}
            placeholder="Ej. Domingo"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Equipo necesario para su desempeño</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {equiposDisponibles.map((item) => (
            <div key={item} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={equipo.includes(item)}
                    onChange={(e) => handleEquipoToggle(item, e.target.checked)}
                    className="h-4 w-4"
                />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Evaluación de conocimientos</Label>
        <Textarea
          value={data.datos_generales?.evaluacion || ""}
          onChange={(e) => updateField("evaluacion", e.target.value)}
          placeholder="¿Cómo se evaluarán los conocimientos necesarios?"
        />
      </div>
    </div>
  )
}
