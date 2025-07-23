"use client"
import { FormularioEtapas } from "@/components/FormularioEtapas";
import { NavbarRH } from "@/components";

export default function Campaign() {
  return (
    <>
      <NavbarRH />
      <div className="pt-24">
        <FormularioEtapas />
      </div>
    </>
  );
}