"use client"

import * as React from "react"
import {
  SquareTerminal,
  Calendar,
  BookOpen,
  Shuffle,
  FileText,
  Archive,
} from "lucide-react"

import { useAuth } from "@/app/context/AuthContext"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  setVista: (vista: string) => void
  vistaActual?: string
  collapsed: boolean
}

const teams = [
  {
    name: "Grupo Tarahumara",
    logo: "/image/tara.png",
    plan: "Home",
  },
  {
    name: "Capital Humano",
    logo: "/image/ch.png",
    plan: "CH",
  },
  {
    name: "Capacitación Tarahumara",
    logo: "/image/Universidad.png",
    plan: "Capacitación",
  },
]

const items = [
  { name: "Mi Perfil", vista: "perfil", icon: SquareTerminal },
  { name: "Vacaciones", vista: "vacaciones", icon: Calendar },
  { name: "Cursos", vista: "cursos", icon: BookOpen },
  { name: "Movimientos", vista: "movimientos", icon: Shuffle },
  { name: "Solicitudes", vista: "solicitudes", icon: FileText },
  { name: "Carta Patronal", vista: "patron", icon: Archive },
]

export function AppSidebar({
  setVista,
  vistaActual,
  collapsed,
  ...props
}: AppSidebarProps) {
  const { user } = useAuth()
  const [empleado, setEmpleado] = React.useState<any | null>(null)

  React.useEffect(() => {
    const fetchEmpleado = async () => {
      if (!user?.num_empleado) return
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_INTELISIS}/api/users/all`)
        const data = await res.json()
        const empleadoMatch = data.find(
          (e: any) => Number(e.Personal) === Number(user.num_empleado)
        )
        setEmpleado(empleadoMatch)
      } catch (error) {
        console.error("Error al obtener datos del empleado:", error)
      }
    }

    fetchEmpleado()
  }, [user])

  const userData = empleado
    ? {
        name: `${empleado.Nombre ?? ""}`.trim(),
        email: user?.email || "sin-correo@empresa.com",
        avatar: `/api/employees/${empleado.Personal || "default"}`,
      }
    : {
        name: "Cargando...",
        email: "cargando@example.com",
        avatar: "/avatars/default.jpg",
      }

  return (
    <Sidebar collapsible="icon" {...props} className={collapsed ? "collapsed-class" : ""}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <div className="grid gap-1 p-2">
          {items.map((item) => {
            const isActive = vistaActual === item.vista
            return (
              <button
                key={item.name}
                onClick={() => setVista(item.vista)} // se ejecuta SIEMPRE
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </button>
            )
          })}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
