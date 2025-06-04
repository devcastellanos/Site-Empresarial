// components
import { NavbarRH, FooterRH, BlogPostCard } from "@/components";
import { Suspense } from "react";

// sections

import Convenio from "@/components/agreementsComponents/convenio";



export default function Campaign() {
  return (
    <>
      <NavbarRH />

      <Suspense fallback={<div className="text-center mt-10">Cargando convenios...</div>}>
        <Convenio />
      </Suspense>
    </>
  );
}
