"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import axios from "axios"

// Separamos la lógica en un componente envuelto en <Suspense>
function ConfirmarCuentaContent() {
  const params = useSearchParams()
  const token = params.get("token")
  const [estado, setEstado] = useState<"verificando" | "confirmando" | "exito" | "error">("verificando")

  useEffect(() => {
    const verificarYConfirmar = async () => {
      try {
        // Paso 1: Verificar token sin consumirlo
        console.log("Verificando token:", token)
        const verif = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verificar-token?token=${token}`)
        if (!verif.data.success) return setEstado("error")

        // Delay visual
        setEstado("confirmando")
        await new Promise((res) => setTimeout(res, 1500))

        // Paso 2: Confirmar cuenta
        const confirm = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/confirmar-cuenta`, { token })
        confirm.data.success ? setEstado("exito") : setEstado("error")
      } catch {
        setEstado("error")
      }
    }

    if (token) {
      verificarYConfirmar()
    } else {
      setEstado("error")
    }
  }, [token])

  if (estado === "verificando" || estado === "confirmando") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">
          {estado === "verificando" ? "Verificando token..." : "Activando cuenta..."}
        </p>
      </div>
    )
  }

  if (estado === "exito") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-10 rounded-lg shadow text-center max-w-md">
          <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Cuenta activada</h2>
          <p className="text-gray-600">Ya puedes iniciar sesión.</p>
          <a
            href="/Login"
            className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ir al Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-10 rounded-lg shadow text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Token inválido o expirado</h2>
        <p className="text-gray-600">Verifica tu correo o vuelve a intentarlo.</p>
        <a
          href="/Login"
          className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Ir al registro
        </a>
      </div>
    </div>
  )
}

// Componente principal que usa <Suspense>
export default function ConfirmarCuentaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ConfirmarCuentaContent />
    </Suspense>
  )
}
