"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Productos", href: "/productos" },
    { label: "Exportaciones", href: "/exportaciones" },
    { label: "Huertas", href: "/huertas" },
    { label: "Alitara", href: "https://www.alitara.mx", external: true },
    { label: "Sucursales", href: "/sucursales" },
    { label: "Trabajo social / Noticias", href: "/noticias" },
    { label: "Capital humano", href: "/capital-humano" },
  ];

  return (
    <header className="bg-[#818181] bg-opacity-30 backdrop-blur-md border-0 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/image/Logo-Outline.png" alt="Logo" width={180} height={60} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : "_self"}
              className="text-white hover:text-[#9A3324] transition font-medium"
            >
              {label}
            </Link>
          ))}

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <Button
                onClick={logout}
                color="blue-gray"
                className="mb-0"
                {...({} as any)}
              >
                Cerrar Sesión
              </Button>
            ) : (
              <a href="/Login">
                <Button variant="text" {...({} as any)}>
                  Iniciar Sesión
                </Button>
              </a>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(({ label, href, external }) => (
                <Link
                  key={label}
                  href={href}
                  target={external ? "_blank" : "_self"}
                  className="text-gray-700 hover:text-lime-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {isAuthenticated ? (
                <Button variant="outline" onClick={() => { logout(); setMenuOpen(false); }}>
                  Cerrar sesión
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setMenuOpen(false)}>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
