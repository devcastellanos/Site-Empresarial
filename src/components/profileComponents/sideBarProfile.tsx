"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
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

export default function ProfilePage() {
  const [view, setView] = useState("checkin")

  return (
    <SidebarProvider>
      <AppSidebar onSelectView={setView} activeView={view} />
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
          {view === "requisiciones" && <RequisitonsPage />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
