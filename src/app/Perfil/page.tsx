"use client"

import { useEffect, useState } from "react"
import RegisterCheckInCheckOut from "@/components/profileComponents/checkInOut"
import Vacations from "@/components/profileComponents/vacations"
import Courses from "@/components/profileComponents/courses"
import Movements from "@/components/profileComponents/movements"
import PatronCard from "@/components/profileComponents/patronCard"
import RequisitonsPage from "@/components/profileComponents/requisitionsPage"
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

export type PerfilVista =
  | "perfil"
  | "vacaciones"
  | "cursos"
  | "movimientos"
  | "requisiciones"
  | "patron"

const LOCAL_STORAGE_KEY = "vista_perfil_activa"

export default function Campaign() {
  const [vista, setVista] = useState<PerfilVista>("perfil")

  const { user } = useAuth();
  // Leer vista desde localStorage al cargar
  useEffect(() => {
    const storedVista = localStorage.getItem(LOCAL_STORAGE_KEY) as PerfilVista | null
    if (storedVista) {
      setVista(storedVista)
    }
  }, [])

  // Guardar vista en localStorage cada que cambie
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, vista)
  }, [vista])

  const breadcrumbMap: Record<PerfilVista, string> = {
    perfil: "Mi Perfil",
    vacaciones: "Vacaciones",
    cursos: "Cursos",
    movimientos: "Movimientos",
    requisiciones: "requisiciones",
    patron: "Modo Patrón",
  }

  const renderVista = () => {
    if (vista === "requisiciones" && (user?.rol !== "admin" && user?.rol !== "reclutamiento")) {
      return <div className="text-red-500 font-semibold">Acceso denegado: necesitas permisos de administrador.</div>
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
      case "perfil":
      default:
        return <RegisterCheckInCheckOut />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar setVista={(vista: string) => setVista(vista as PerfilVista)} vistaActual={vista}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
           <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                  Perfil
                  </BreadcrumbLink>
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
    </SidebarProvider>
  )
}
