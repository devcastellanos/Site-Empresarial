"use client"

import { useEffect, useState, useRef } from "react"
import RegisterCheckInCheckOut from "@/components/profileComponents/checkInOut"
import Vacations from "@/components/profileComponents/vacations"
import Courses from "@/components/profileComponents/courses"
import Movements from "@/components/profileComponents/movements"
import PatronCard from "@/components/profileComponents/patronCard"
import RequisitonsPage from "@/components/profileComponents/requisitionsPage"
import MonitorSubordinates from "@/components/profileComponents/monitorSubordinates"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useAuth } from "@/app/context/AuthContext"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"
import Image from "next/image"

export type PerfilVista =
  | "perfil"
  | "vacaciones"
  | "cursos"
  | "movimientos"
  | "requisiciones"
  | "patron"
  | "monitorearequipo"

const LOCAL_STORAGE_KEY = "vista_perfil_activa"

export default function Campaign() {
  const [vista, setVista] = useState<PerfilVista>("perfil")
  const [showIntro, setShowIntro] = useState(false)
  const [openHelpDialog, setOpenHelpDialog] = useState(false)
  const bounceRef = useRef<HTMLButtonElement>(null)

  const { user } = useAuth()

  // ✅ Detectar el hash inicial
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    const vistaInicial = hash || "perfil"
    setVista(vistaInicial as PerfilVista)
    localStorage.setItem(LOCAL_STORAGE_KEY, vistaInicial)
  }, [])

  // ✅ Detectar cambios futuros en el hash
  useEffect(() => {
    const onHashChange = () => {
      const nuevaVista = window.location.hash.replace("#", "") || "perfil"
      setVista(nuevaVista as PerfilVista)
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    const intro = introDialogs[vista]
    if (!intro) return

    const yaMostrado = sessionStorage.getItem(intro.storageKey)
    if (!yaMostrado) {
      setShowIntro(true)
      sessionStorage.setItem(intro.storageKey, "true")
    } else {
      setShowIntro(false) // Oculta si ya se mostró
    }
  }, [vista])


  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, vista)
  }, [vista])

  useEffect(() => {
    const interval = setInterval(() => {
      if (bounceRef.current) {
        bounceRef.current.classList.add("animate-bounce")
        setTimeout(() => {
          bounceRef.current?.classList.remove("animate-bounce")
        }, 1000)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const breadcrumbMap: Record<PerfilVista, string> = {
    perfil: "Asistencia",
    vacaciones: "Vacaciones",
    cursos: "Cursos",
    movimientos: "Movimientos",
    requisiciones: "requisiciones",
    patron: "Modo Patrón",
    monitorearequipo: "Monitorear Equipo",
  }

  const introDialogs: Partial<Record<PerfilVista, { title: string; content: React.ReactNode; storageKey: string }>> = {
    perfil: {
      title: "👋 Bienvenido a tu vista de asistencia",
      storageKey: "intro_checkin_shown",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Desde aquí puedes:</p>
          <ul className="list-disc pl-4">
            <li>Ver tu asistencia diaria (entradas y salidas).</li>
            <li>Justificar faltas o retardos con un solo clic.</li>
            <li>Consultar tu historial de asistencia.</li>
            <li>Revisar tu porcentaje de puntualidad.</li>
          </ul>
          <p className="text-xs text-gray-400">Este mensaje solo se mostrará una vez por sesión.</p>
        </div>
      ),
    },
    vacaciones: {
      title: "🌴 ¡Consulta tus vacaciones!",
      storageKey: "intro_vacaciones_shown",
      content: (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Aquí puedes:</p>
          <ul className="list-disc pl-4">
            <li>Revisar cuántos días tienes disponibles.</li>
            <li>Seleccionar tus días de vacaciones fácilmente.</li>
            <li>Enviar tu solicitud para aprobación.</li>
          </ul>
        </div>
      ),
    },
    cursos: {
      title: "📚 Bienvenido a tus cursos",
      storageKey: "intro_cursos_shown",
      content: (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Desde aquí puedes:</p>
          <ul className="list-disc pl-4">
            <li>Ver los cursos disponibles.</li>
            <li>Consultar tus avances.</li>
            <li>Entrar a tus clases y actividades.</li>
          </ul>
        </div>
      ),
    },
    movimientos: {
      title: "📝 Solicita tus movimientos",
      storageKey: "intro_movimientos_shown",
      content: (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>En esta sección puedes:</p>
          <ul className="list-disc pl-4">
            <li>Solicitar cambios de turno, retardos justificados, etc.</li>
            <li>Dar seguimiento al estatus de tus solicitudes.</li>
          </ul>
        </div>
      ),
    },
    requisiciones: {
      title: "📋 Panel de Requisiciones",
      storageKey: "intro_requisiciones_shown",
      content: (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Desde aquí puedes:</p>
          <ul className="list-disc pl-4">
            <li>Consultar y aprobar requisiciones de personal.</li>
            <li>Revisar su estatus y observaciones.</li>
          </ul>
        </div>
      ),
    },
    patron: {
      title: "🎩 Modo Patrón Activado",
      storageKey: "intro_patron_shown",
      content: (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Esta vista te permite:</p>
          <ul className="list-disc pl-4">
            <li>Ver información consolidada del equipo.</li>
            <li>Acceder a datos avanzados.</li>
          </ul>
        </div>
      ),
    },
    monitorearequipo: {
      title: "🧑‍💼 Monitoreo de Subordinados",
      storageKey: "intro_monitor_shown",
      content: (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Aquí puedes:</p>
          <ul className="list-disc pl-4">
            <li>Revisar asistencias y vacaciones del equipo.</li>
            <li>Tomar decisiones basadas en reportes en tiempo real.</li>
          </ul>
        </div>
      ),
    },
  }


  const renderVista = () => {
    if (
      vista === "requisiciones" &&
      user?.rol !== "admin" &&
      user?.rol !== "atraccionT"
    ) {
      return (
        <div className="text-red-500 font-semibold">
          Acceso denegado: necesitas permisos de administrador.
        </div>
      )
    }

    switch (vista) {
      case "vacaciones":
        return <Vacations />
      case "cursos":
        return <Courses />
      case "movimientos":
        return <Movements />
      case "requisiciones":
        return <RequisitonsPage />
      case "patron":
        return <PatronCard />
      case "monitorearequipo":
        return <MonitorSubordinates />
      case "perfil":
      default:
        return <RegisterCheckInCheckOut />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        setVista={(vista: string) => {
          window.location.hash = `#${vista}`
          setVista(vista as PerfilVista)
        }}
        vistaActual={vista}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Perfil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbMap[vista]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {renderVista()}
        </div>
      </SidebarInset>

      {introDialogs[vista] && (
        <Dialog open={showIntro} onOpenChange={setShowIntro}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{introDialogs[vista]?.title}</DialogTitle>
            </DialogHeader>
            {introDialogs[vista]?.content}
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={openHelpDialog} onOpenChange={setOpenHelpDialog}>
        <DialogTrigger asChild>
          <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2 group cursor-pointer">
            <span className="text-lg bg-white text-[#9A3324] px-1 py-2 rounded-md shadow-md opacity-90 group-hover:opacity-100 transition">
              ¿Necesitas ayuda?
            </span>
            <button
              ref={bounceRef}
              onClick={() => setOpenHelpDialog(true)}
              className="bg-[#9A3324] hover:bg-[#7f2a1c] text-white p-4 rounded-full shadow-xl transition-all duration-300"
              aria-label="Ayuda"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>Aviso importante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Esta página se encuentra en constante mejora. Si experimentas problemas relacionados con su funcionamiento, por favor contacta al área de desarrollo para recibir asistencia.
            </p>
            <div className="w-full bg-white/90 border rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-2">¿Problemas con tu asistencia?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Para cualquier duda o aclaración, comunícate con los siguientes contactos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {/* Francisco Castellanos */}
                <div className="border rounded-md p-3 bg-gray-50 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                      <Image width={48} height={48} src={`http://api-img.172.16.15.30.sslip.io/uploads/2294.jpg`} alt="Foto de Francisco Castellanos" className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h2 className="font-medium leading-none">Francisco Castellanos</h2>
                      <h4 className="font-thin leading-none">Ing. Desarrollo y Aplicaciones</h4>
                      <p className="text-muted-foreground text-xs">📞 331 363 6028</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://wa.me/5213313636028?text=Hola%2C%20tengo%20una%20duda%20sobre%20movimientos%20de%20personal" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">WhatsApp</a>
                    <a href="tel:3313636028" className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Llamar</a>
                    <a href="mailto:juan.castellanos@grupotarahumara.com.mx" className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Correo</a>
                  </div>
                </div>
                {/* Mauricio Monterde */}
                <div className="border rounded-md p-3 bg-gray-50 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                      <Image width={48} height={48} src={`http://api-img.172.16.15.30.sslip.io/uploads/2525.jpg`} alt="Foto de Mauricio Monterde" className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-medium leading-none">Mauricio Monterde</h4>
                      <h4 className="font-thin leading-none">Analista de Nominas</h4>
                      <p className="text-muted-foreground text-xs">📞 333 662 8849</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://wa.me/5213336628849?text=Hola%2C%20necesito%20aclarar%20un%20registro%20de%20asistencia" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">WhatsApp</a>
                    <a href="tel:3336628849" className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Llamar</a>
                    <a href="mailto:mauricio.monterde@grupotarahumara.com.mx" className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Correo</a>
                  </div>
                </div>
                {/* Néstor Bañuelos */}
                <div className="border rounded-md p-3 bg-gray-50 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                      <Image width={48} height={48} src={`http://api-img.172.16.15.30.sslip.io/uploads/2324.jpg`} alt="Foto de Néstor Bañuelos" className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-medium leading-none">Néstor Bañuelos</h4>
                      <h4 className="font-thin leading-none">Coordinador de Entrenamiento Operativo</h4>
                      <p className="text-muted-foreground text-xs">📞 333 442 8913</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://wa.me/5213334428913?text=Hola%2C%20tengo%20una%20duda%20sobre%20el%20sistema" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">WhatsApp</a>
                    <a href="tel:3334428913" className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Llamar</a>
                    <a href="mailto:nestor.banuelos@grupotarahumara.com.mx" className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Correo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
