"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import RegisterCheckInCheckOut from "./checkInOut"
import Vacations from "./vacations"
import Courses from "./courses"
import Movements from "./movements"
import PatronCard from "./patronCard"
import RequisitonsPage from "./requisitionsPage"
import { useAuth } from "@/app/context/AuthContext"
import { collapse } from "@material-tailwind/react"

export default function ProfilePage() {
  const [view, setView] = useState("checkin")
  // TODO: Replace this mock user with actual user data from context, props, or API
  const { user } = useAuth()

  return (
    <SidebarProvider>
      <AppSidebar setVista={setView}  />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-semibold text-muted-foreground">
            {view.toUpperCase()}
          </span>
        </header>
        <div className="flex-1 p-4">
          {view === "checkin" && <RegisterCheckInCheckOut />}
          {view === "vacations" && <Vacations />}
          {view === "courses" && <Courses />}
          {view === "movements" && <Movements />}
          {view === "patronales" && <PatronCard />}
          {view === "requisiciones" ? (
            user?.rol === "admin" || user?.rol === "Reclutamiento" || user?.rol === "Gerente" || user?.rol === "Jefe" || user?.rol === "Director" || user?.rol === "Direccion" ? (
              <div className="text-red-500 font-semibold">
                Acceso denegado: necesitas permisos de administrador.
              </div>
            ) : (
              <RequisitonsPage />
            )
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
