"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Video de fondo con Motion */}
        <motion.video
          autoPlay
          loop
          muted
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5 }}
        >
          <source src="/image/background.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </motion.video>

        {/* Contenido de la página con un fondo semitransparente para mejorar legibilidad */}
        <div className="relative z-10 min-h-screen bg-black bg-opacity-50 flex justify-center items-center">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Layout;
