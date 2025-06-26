"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { motion } from "framer-motion";
import Footer from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative w-full min-h-screen overflow-hidden">

        {/* Contenido de la página con un fondo semitransparente para mejorar legibilidad */}
        <div className="relative z-10 min-h-screen ">
          {children}
          <Footer />
        </div>

      </div>
    </ThemeProvider>
  );
}

export default Layout;
