"use client";

import { useState } from "react";
import InfoProfile from "./infoProfile";
import RegisterCheckInCheckOut from "./checkInOut";
import Vacations from "./vacations";
import Courses from "./courses";
import Movements from "./movements";

function ProfilePage() {
  const [view, setView] = useState("info");

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <aside
        className="fixed left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 
        bg-white/10 backdrop-blur-xl shadow-lg border-r border-white/10 rounded-r-3xl"
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 space-y-6">
          <ul className="space-y-2 text-sm font-medium">
            <SidebarItem label="Información" icon="ℹ️" active={view === "info"} onClick={() => setView("info")} />
            <SidebarItem label="Registro Entrada/Salida" icon="📅" active={view === "checkin"} onClick={() => setView("checkin")} />
            <SidebarItem label="Vacaciones" icon="🌴" active={view === "vacations"} onClick={() => setView("vacations")} />
            <SidebarItem label="Mis Cursos" icon="📘" active={view === "courses"} onClick={() => setView("courses")} />
            <SidebarItem label="Movimientos" icon="🔁" active={view === "movements"} onClick={() => setView("movements")} />
          </ul>
        </div>
      </aside>

      {/* Contenido principal sin fondo */}
      <main className="sm:ml-64 w-full p-6">
        <div className="backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 transition-all">
          {view === "info" && <InfoProfile />}
          {view === "checkin" && <RegisterCheckInCheckOut />}
          {view === "vacations" && <Vacations />}
          {view === "courses" && <Courses />}
          {view === "movements" && <Movements />}
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;

// Sidebar item mejorado
const SidebarItem = ({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${
            active
              ? "bg-white/30 text-white font-semibold shadow-lg ring-1 ring-white/40"
              : "text-white/80 hover:bg-white/20 hover:text-white"
          }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-base">{label}</span>
      </a>
    </li>
  );
};
