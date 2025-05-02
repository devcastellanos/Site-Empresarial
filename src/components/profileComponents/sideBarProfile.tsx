"use client";

import { useState } from "react";
import InfoProfile from "./infoProfile";
import RegisterCheckInCheckOut from "./checkInOut";
import Vacations from "./vacations";
import Courses from "./courses";
import Movements from "./movements";
import PatronCard from "./patronCard";
import AprovementsPage from "./AprovementsPage";

function ProfilePage() {
  const [view, setView] = useState("checkin");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleItemClick = (selectedView: string) => {
    setView(selectedView);
    setSidebarOpen(false); // Cerrar el sidebar en móvil al seleccionar
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      {/* Botón de menú móvil */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white/20 text-white backdrop-blur-lg rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 transition-transform bg-white/10 backdrop-blur-xl shadow-lg border-r border-white/10 rounded-r-3xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 space-y-6 p-6">
          <ul className="space-y-2 text-sm font-medium">
            <SidebarItem label="Incidencias" icon="📅" active={view === "checkin"} onClick={() => setView("checkin")} />
            <SidebarItem label="Vacaciones" icon="🌴" active={view === "vacations"} onClick={() => setView("vacations")} />
            <SidebarItem label="Mis Cursos" icon="📘" active={view === "courses"} onClick={() => setView("courses")} />
            <SidebarItem label="Movimientos" icon="🔁" active={view === "movements"} onClick={() => setView("movements")} />
            <SidebarItem label="Carta Patronal" icon="📝" active={view === "patronales"} onClick={() => setView("patronales")} />
            <SidebarItem label="Aprobaciones" icon="✅" active={view === "aprobaciones"} onClick={() => setView("aprobaciones")} />
          </ul>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="sm:ml-64 w-full p-6">
        <div className="backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 transition-all">
          {view === "checkin" && <RegisterCheckInCheckOut />}
          {view === "vacations" && <Vacations />}
          {view === "courses" && <Courses />}
          {view === "movements" && <Movements />}
          {view === "patronales" && <PatronCard />}
          {view === "aprobaciones" && <AprovementsPage />}
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;

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
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${
            active
              ? "bg-white/30 text-white font-semibold shadow-lg ring-1 ring-white/40"
              : "text-white/80 hover:bg-white/20 hover:text-white"
          }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-base">{label}</span>
      </button>
    </li>
  );
};
