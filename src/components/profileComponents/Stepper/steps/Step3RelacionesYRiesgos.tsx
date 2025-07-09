import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

type CampoDoble = { area: string; descripcion: string }
type CampoSimple = string
type CampoRiesgo = { riesgo: string; accion: string }

export default function Step3RelacionesYRiesgos({
  data,
  updateData,
}: {
  data: any
  updateData: (val: any) => void
}) {
  // Estados locales para manejar la cantidad de entradas
  const [internas, setInternas] = useState<number>(data.relaciones_internas?.length || 0)
  const [externas, setExternas] = useState<number>(data.relaciones_externas?.length || 0)
  const [riesgos, setRiesgos] = useState<number>(data.riesgos?.length || 0)
  const [ascendentes, setAscendentes] = useState<number>(data.puestos_ascendentes?.length || 0)
  const [laterales, setLaterales] = useState<number>(data.puestos_laterales?.length || 0)

  // Inicializar campos en blanco si no existen
useEffect(() => {
  updateData({
    relaciones_internas: Array.from({ length: internas }, (_, i) => data.relaciones_internas?.[i] || { area: "", descripcion: "" }),
    relaciones_externas: Array.from({ length: externas }, (_, i) => data.relaciones_externas?.[i] || { area: "", descripcion: "" }),
    riesgos: Array.from({ length: riesgos }, (_, i) => data.riesgos?.[i] || { riesgo: "", accion: "" }),
    puestos_ascendentes: Array.from({ length: ascendentes }, (_, i) => data.puestos_ascendentes?.[i] || ""),
    puestos_laterales: Array.from({ length: laterales }, (_, i) => data.puestos_laterales?.[i] || ""),
  });
}, [
  internas,
  externas,
  riesgos,
  ascendentes,
  laterales,
  updateData,
  data.relaciones_internas,
  data.relaciones_externas,
  data.riesgos,
  data.puestos_ascendentes,
  data.puestos_laterales
]);


  // Renderizador de campos dobles
  const renderCamposDobles = (
    label: string,
    count: number,
    array: CampoDoble[],
    key: string
  ) => (
    <div className="space-y-2">
      <Label>{label} ({count})</Label>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Área"
            value={array?.[i]?.area || ""}
            onChange={(e) => {
              const updated = [...array]
              updated[i].area = e.target.value
              updateData({ [key]: updated })
            }}
          />
          <Input
            placeholder="Descripción"
            value={array?.[i]?.descripcion || ""}
            onChange={(e) => {
              const updated = [...array]
              updated[i].descripcion = e.target.value
              updateData({ [key]: updated })
            }}
          />
        </div>
      ))}
    </div>
  )

  // Renderizador de campos simples
  const renderCamposSimples = (
    label: string,
    count: number,
    array: CampoSimple[],
    key: string
  ) => (
    <div className="space-y-2">
      <Label>{label} ({count})</Label>
      {Array.from({ length: count }).map((_, i) => (
        <Input
          key={i}
          placeholder="Puesto"
          value={array?.[i] || ""}
          onChange={(e) => {
            const updated = [...array]
            updated[i] = e.target.value
            updateData({ [key]: updated })
          }}
        />
      ))}
    </div>
  )

  // Renderizador de campos de riesgo
  const renderRiesgos = (
    count: number,
    array: CampoRiesgo[]
  ) => (
    <div className="space-y-2">
      <Label>Riesgos ({count})</Label>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Riesgo"
            value={array?.[i]?.riesgo || ""}
            onChange={(e) => {
              const updated = [...array]
              updated[i].riesgo = e.target.value
              updateData({ riesgos: updated })
            }}
          />
          <Input
            placeholder="Acción preventiva"
            value={array?.[i]?.accion || ""}
            onChange={(e) => {
              const updated = [...array]
              updated[i].accion = e.target.value
              updateData({ riesgos: updated })
            }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Entradas numéricas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Número de Relaciones Internas (máx. 10)</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={internas}
            onChange={(e) => setInternas(Math.min(10, Math.max(0, parseInt(e.target.value))))}
          />
        </div>
        <div>
          <Label>Número de Relaciones Externas (máx. 10)</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={externas}
            onChange={(e) => setExternas(Math.min(10, Math.max(0, parseInt(e.target.value))))}
          />
        </div>
        <div>
          <Label>Número de Riesgos (máx. 10)</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={riesgos}
            onChange={(e) => setRiesgos(Math.min(10, Math.max(0, parseInt(e.target.value))))}
          />
        </div>
        <div>
          <Label>Número de Puestos Ascendentes</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={ascendentes}
            onChange={(e) => setAscendentes(Math.min(10, Math.max(0, parseInt(e.target.value))))}
          />
        </div>
        <div>
          <Label>Número de Puestos Laterales</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={laterales}
            onChange={(e) => setLaterales(Math.min(10, Math.max(0, parseInt(e.target.value))))}
          />
        </div>
      </div>

      {/* Campos generados dinámicamente */}
      {renderCamposDobles("Relaciones Internas", internas, data.relaciones_internas || [], "relaciones_internas")}
      {renderCamposDobles("Relaciones Externas", externas, data.relaciones_externas || [], "relaciones_externas")}
      {renderRiesgos(riesgos, data.riesgos || [])}
      {renderCamposSimples("Puestos Ascendentes", ascendentes, data.puestos_ascendentes || [], "puestos_ascendentes")}
      {renderCamposSimples("Puestos Laterales", laterales, data.puestos_laterales || [], "puestos_laterales")}
    </div>
  )
}
