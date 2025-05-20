"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  Briefcase,
  GraduationCap,
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
  collapsed: boolean
}

export function AppSidebar({
  setVista,
  vistaActual,
  collapsed,
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

  // Sidebar completo cuando hay usuario
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
        icon: Settings2,
        items: [
          { title: "Mi Perfil", url: "/Perfil#perfil" },
          { title: "Vacaciones", url: "/Perfil#vacaciones" },
          { title: "Cursos", url: "/Perfil#cursos" },
          { title: "Movimientos", url: "/Perfil#movimientos" },
          ...(user.rol === "admin"
            ? [{ title: "Requisiciones", url: "/Perfil#requisiciones" }]
            : []),
          { title: "Carta Patronal", url: "/Perfil#patron" },
        ],
      },
    ],
    projects: [
      { name: "Home", url: "/", icon: SquareTerminal },
      { name: "Kardex", url: "/kardex", icon: BookOpen },
      { name: "Cargar Archivos Excel", url: "/cargaMasiva", icon: Frame },
      { name: "Usuarios", url: "/Usuarios", icon: Map },
      { name: "Cursos", url: "/Cursos", icon: PieChart },
      { name: "Noti-Tarahumara", url: "/Blog", icon: Bot },
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
