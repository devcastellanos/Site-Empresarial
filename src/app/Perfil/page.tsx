"use client"

import { useEffect, useState } from "react"
import Page from "@/components/profileComponents/ProfileBar"
import RegisterCheckInCheckOut from "@/components/profileComponents/checkInOut"
import Vacations from "@/components/profileComponents/vacations"
import Courses from "@/components/profileComponents/courses"
import Movements from "@/components/profileComponents/movements"
import PatronCard from "@/components/profileComponents/patronCard"
import RequisitonsPage from "@/components/profileComponents/requisitionsPage"
import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type PerfilVista =
  | "perfil"
  | "vacaciones"
  | "cursos"
  | "movimientos"
  | "solicitudes"
  | "patron"

const LOCAL_STORAGE_KEY = "vista_perfil_activa"

export default function Campaign() {
  const [vista, setVista] = useState<PerfilVista>("perfil")

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
    solicitudes: "Solicitudes",
    patron: "Modo Patrón",
  }

  const renderVista = () => {
    switch (vista) {
      case "vacaciones":
        return <Vacations />
      case "cursos":
        return <Courses />
      case "movimientos":
        return <Movements />
      case "solicitudes":
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
      <AppSidebar setVista={setVista} vistaActual={vista} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Perfil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbMap[vista]}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {renderVista()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
