"use client"

import * as React from "react"
import {
  UserCircle,
  CalendarCheck,
  Palmtree,
  GraduationCap,
  Repeat,
  FileText,
  Stamp,
  Users,
  Home,
  NotebookText,
  FileSpreadsheet,
  UserCog,
  Presentation,
  CircleDollarSign,
  Briefcase,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useAuth } from "@/app/context/AuthContext"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  setVista: (vista: string) => void
  vistaActual?: string
}

export function AppSidebar({
  setVista,
  vistaActual,
  ...props
}: AppSidebarProps) {
  const { user } = useAuth()

  // Mostrar loading mientras no hay usuario
  if (!user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher
            teams={[
              { name: "Grupo Tarahumara", logo: Users, plan: "Home" },
              { name: "Capital Humano", logo: Briefcase, plan: "CH" },
              { name: "Capacitación Tarahumara", logo: GraduationCap, plan: "Capacitación" },
            ]}
          />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={[]} setVista={setVista} />
        </SidebarContent>
        <SidebarFooter>
          <div className="text-sm text-muted-foreground px-4 py-2">
            Cargando usuario...
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  const sidebarData = {
    teams: [
      { name: "Grupo Tarahumara", logo: Users, plan: "Home" },
      { name: "Capital Humano", logo: Briefcase, plan: "CH" },
      { name: "Capacitación Tarahumara", logo: GraduationCap, plan: "Capacitación" },
    ],
    navMain: [
      {
        title: "Perfil",
        url: "/Perfil",
        icon: UserCircle, // 👈 CAMBIADO
        expanded: true,
        items: [
          { title: "Asistencia", url: "/Perfil#perfil", icon: CalendarCheck },
          { title: "Vacaciones", url: "/Perfil#vacaciones", icon: Palmtree },
          { title: "Cursos", url: "/Perfil#cursos", icon: GraduationCap },
          { title: "Movimientos", url: "/Perfil#movimientos", icon: Repeat },
          ...(user.rol === "admin" || user.rol === "Reclutamiento"
            ? [{ title: "Requisiciones", url: "/Perfil#requisiciones", icon: FileText }]
            : []),
          { title: "Carta Patronal", url: "/Perfil#patron", icon: Stamp },
          ...(user.rol === "admin" || user.rol === "Capacitacion"
            ? [{ title: "Monitorear Equipo", url: "/Perfil#monitorearequipo", icon: Users }]
            : []),
          
        ],
      },
    ],
    projects: [
      { name: "Home", url: "/", icon: Home },
      { name: "Kardex", url: "/kardex", icon: NotebookText },
      ...(user.rol === "admin" || user.rol === "Capacitacion"
        ? [{ name: "Cargar Archivos Excel", url: "/cargaMasiva", icon: FileSpreadsheet }]
        : []),
      { name: "Usuarios", url: "/Usuarios", icon: UserCog },
      { name: "Cursos", url: "/Cursos", icon: Presentation },
      ...(user.rol === "admin" || user.rol === "Nominas"
        ? [{ name: "Movimientos Nominas", url: "/Movimientos", icon: CircleDollarSign }]
        : []),
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} setVista={setVista} />
        <NavProjects projects={sidebarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.user,
            email: user.email,
            avatar: `/fotos/${user.num_empleado}.jpg`,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
