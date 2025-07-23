"use client"
import { MatrizAsignacionCursos } from "@/components/matrizPlan";

import { NavbarRH } from "@/components";

export default function Campaign() {
  return (
    <>
      <NavbarRH />
      <div className="pt-24">
        <MatrizAsignacionCursos />
      </div>
    </>
  );
}