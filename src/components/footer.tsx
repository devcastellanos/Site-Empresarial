"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { MailIcon } from "lucide-react";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <>
      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/3324598019"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all"
      >
        <FaWhatsapp size={28} />
      </a>

      {/* Footer Content */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Logo & QR */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Grupo Tarahumara</h3>
            <Image src="/image/qr.png" alt="QR Code" width={200} height={200} />
          </div>

          {/* Contactos */}
          <div className="space-y-2 w-80">
            <h4 className="text-md font-semibold mb-2">Contacto</h4>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <MailIcon className="w-4 h-4" /> <a href="mailto:contacto@grupotarahumara.com.mx">contacto@grupotarahumara.com.mx</a>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <MailIcon className="w-4 h-4" /> <a href="mailto:reclutamiento@grupotarahumara.com.mx">reclutamiento@grupotarahumara.com.mx</a>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <MailIcon className="w-4 h-4" /> <a href="mailto:etica@tarahumaralinealide.com">etica@tarahumaralinealide.com</a>
            </p>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-2">
            <h4 className="text-md font-semibold mb-2">Síguenos</h4>
            <div className="flex gap-4 text-white">
              <Link href="https://www.facebook.com/Grupo.Tarahumara/" target="_blank"><FaFacebookF size={20} /></Link>
              <Link href="https://www.instagram.com/grupo_tarahumara/" target="_blank"><FaInstagram size={20} /></Link>
              <Link href="https://www.linkedin.com/company/grupo-tarahumara/" target="_blank"><FaLinkedinIn size={20} /></Link>
            </div>
          </div>

          {/* Legal / Modals */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold mb-2">Legal</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-sm text-gray-300 underline hover:text-white">
                  Términos y condiciones
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Términos y Condiciones</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>Aquí irían los términos y condiciones detallados...</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-sm text-gray-300 underline hover:text-white">
                  Políticas de privacidad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Políticas de Privacidad</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>Aquí irían las políticas de privacidad de datos, cookies, etc.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-10">
          Grupo Tarahumara ©{currentYear}. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}

export default Footer;