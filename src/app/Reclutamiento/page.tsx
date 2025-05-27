import React from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useAuth } from "@/app/context/AuthContext";
import Reclutamiento from "@/components/reclutamiento";

export default function Campaign() {

  return (
    <div>
      <AppSidebar setVista={() => {}} vistaActual="reclutamiento" />
      <Reclutamiento />
    </div>
  );
}