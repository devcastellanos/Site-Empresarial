import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Step1SeleccionRequisicion from "./steps/Step1SeleccionRequisicion"
import Step2NuevaPosicion from "./steps/Step2NuevaPosicion"
import Step3RelacionesYRiesgos from "./steps/Step3RelacionesYRiesgos"
import Step4DatosGenerales from "./steps/Step4DatosGenerales"
import { crearMovimiento } from "@/services/movementsService"
import { CheckCircle2, Circle } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"

type FormData = {
  num_empleado: string
  fecha_solicitud: Date
  motivo: "Sustitución" | "Nueva Posición" | "Aumento Plantilla"
  tipo_sustitucion?: "puesto" | "incapacidad"
  tipo_incapacidad?: string
  tiempo_incapacidad?: string
  puesto?: string
  justificacion?: string
  nombre_posicion?: string
  departamento?: string
  objetivo?: string
  decisiones?: string
  funciones?: string
  relaciones_internas?: { area: string; descripcion: string }[]
  relaciones_externas?: { area: string; descripcion: string }[]
  riesgos?: { riesgo: string; accion: string }[]
  puestos_ascendentes?: string[]
  puestos_laterales?: string[]
  datos_generales?: {
    observaciones: string
    genero: string
    edad: string
    escolaridad: string
    idiomas: string
    experiencia: string
    conocimientos: string
    competencias: string
    habilidades: string
    turno: string
    horario: string
    descanso: string
    equipo: string[]
    evaluacion: string
  }
}

export default function StepperContainer() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<FormData>>({})
  const { user } = useAuth()

  const totalSteps = data.motivo === "Nueva Posición" ? 4 : 3

  const updateData = (newData: Partial<FormData>) => {
    const updated = { ...data, ...newData }
    setData(updated)
    console.log("📦 Datos actuales (datos_json):", updated)
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        num_empleado: parseInt(data.num_empleado || "0"),
        tipo_movimiento: data.motivo,
        nivel_aprobacion: 2,
        fecha_incidencia: data.fecha_solicitud?.toISOString().split("T")[0],
        datos_json: { ...data },
        comentarios: data?.datos_generales?.observaciones || "",
      }

      console.log("🚀 Enviando al backend:", payload)
      await crearMovimiento(payload)
      alert("✅ Movimiento registrado correctamente")
      setStep(1)
      setData({})
    } catch (error) {
      console.error("Error al crear movimiento:", error)
      alert("❌ Hubo un error al registrar la solicitud")
    }
  }

  const renderStepComponent = () => {
    if (step === 1) return <Step1SeleccionRequisicion data={data} updateData={updateData} />
    if (step === 2 && data.motivo === "Nueva Posición")
      return <Step2NuevaPosicion data={data} updateData={updateData} />
    if (step === 3 && data.motivo === "Nueva Posición")
      return <Step3RelacionesYRiesgos data={data} updateData={updateData} />
    if ((step === 2 && data.motivo !== "Nueva Posición") ||
        (step === 4 && data.motivo === "Nueva Posición"))
      return <Step4DatosGenerales data={data} updateData={updateData} />
    return null
  }

  const stepTitles =
    data.motivo === "Nueva Posición"
      ? ["Requisición", "Nueva Posición", "Relaciones y Riesgos", "Datos Generales"]
      : ["Requisición", "Datos Generales"]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6 mt-6">
      {/* Stepper visual */}
      <div className="flex justify-between items-center mb-4">
        {stepTitles.map((title, index) => {
          const currentIndex = index + 1
          const isActive = step === currentIndex
          const isDone = step > currentIndex

          return (
            <div key={title} className="flex-1 flex items-center">
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 className="text-green-600 w-6 h-6" />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      isActive ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {currentIndex}
                  </div>
                )}
                <span className={`text-sm ${isActive ? "font-semibold" : "text-gray-500"}`}>
                  {title}
                </span>
              </div>
              {index < stepTitles.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Paso actual */}
      <div>{renderStepComponent()}</div>

      {/* Navegación */}
      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} disabled={step === 1} variant="secondary">
          Anterior
        </Button>
        {step < totalSteps ? (
          <Button onClick={handleNext}>Siguiente</Button>
        ) : (
          <Button onClick={handleSubmit}>Enviar</Button>
        )}
      </div>
    </div>
  )
}
