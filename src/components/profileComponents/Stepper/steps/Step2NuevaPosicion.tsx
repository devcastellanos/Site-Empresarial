import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Step2NuevaPosicion({
  data,
  updateData,
}: {
  data: any
  updateData: (val: any) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Nombre de la Nueva Posición</Label>
        <Input
          value={data.nombre_posicion || ""}
          onChange={(e) => updateData({ nombre_posicion: e.target.value })}
          placeholder="Ej. Coordinador de Talento"
        />
      </div>

      <div>
        <Label>Departamento</Label>
        <Input
          value={data.departamento || ""}
          onChange={(e) => updateData({ departamento: e.target.value })}
          placeholder="Ej. Capital Humano"
        />
      </div>

      <div>
        <Label>Objetivo General del Puesto</Label>
        <Textarea
          value={data.objetivo || ""}
          onChange={(e) => updateData({ objetivo: e.target.value })}
          placeholder="Define brevemente el objetivo del puesto"
        />
      </div>

      <div>
        <Label>Toma de Decisiones y Límites de Autorización</Label>
        <Textarea
          value={data.decisiones || ""}
          onChange={(e) => updateData({ decisiones: e.target.value })}
          placeholder="¿Qué tipo de decisiones puede tomar? ¿Cuál es su límite?"
        />
      </div>

      <div>
        <Label>Funciones / Responsabilidades y Periodicidad</Label>
        <Textarea
          value={data.funciones || ""}
          onChange={(e) => updateData({ funciones: e.target.value })}
          placeholder="¿Qué hace? ¿Para qué lo hace? ¿Cuál es el resultado esperado?"
        />
      </div>
    </div>
  )
}
