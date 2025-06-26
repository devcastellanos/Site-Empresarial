"use client";
import { NavbarRH, FooterRH } from "@/components";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import OrgChart from "@/components/OrgChart";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ARTICLES = [
  {
    img: "/image/crehana.png",
    title: "Crehana",
    desc: "Crehana es una plataforma de educación online que ofrece cursos de diseño, marketing, fotografía, programación y más.",
    link: "https://www.crehana.com/entrar/",
  },
  {
    img: "/image/cap.png",
    title: "Plan de Capacitación",
    desc: "Da clic para conocer el Plan anual de capacitación actualizada.",
    link: "https://gpotarahumara-my.sharepoint.com/:x:/g/personal/mariana_perez_grupotarahumara_com_mx/EQ3-FxxGPsVNh60Zw3dmeZ8Bi2HSd6ymFhP-aqy1ogQRIA?e=0EDtU2",
  },
  {
    img: "/image/Asistencia.png",
    title: "Asistencia",
    desc: "Da clic aquí para descargar la lista de asistencia de la capacitación de Tarahumara.",
    link: "https://gpotarahumara-my.sharepoint.com/...",
  },
  {
    img: "/image/convenio.png",
    title: "Convenios Educativos",
    desc: "Da clic aquí para conocer los convenios educativos que tenemos.",
    link: "/Convenios?tipo=educativo",
  },
  {
    img: "/image/solicitud.png",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
    link: "https://gpotarahumara-my.sharepoint.com/...",
  },
];

export default function IntranetHomePage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const orgChartRef = useRef<HTMLElement | null>(null);
  const { user } = useAuth();

  return (
    <>
      <NavbarRH />
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        style={{ opacity: 1 }}
      >
        <source src="/image/background.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </motion.video>

      <motion.header
        ref={ref}
        className="relative w-full min-h-screen flex flex-col items-center justify-start text-center pt-32 overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-full md:px-16" />
        <div className="relative z-10 w-full max-w-6xl px-6 text-white mt-24">
          <h1 className="text-[48px] lg:text-[64px] font-extrabold leading-tight">
            Universidad Tarahumara
          </h1>
          <p className="mt-2 text-lg lg:text-2xl text-gray-200">
            Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional.
          </p>

          <div className="mt-6 flex justify-center">
            <Image
              src="/image/utara.png"
              alt="Logo"
              width={256}
              height={256}
              className="w-32 h-auto"
            />
          </div>

          {/* TARJETAS / ARTICLES */}
          <div className="mt-14 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-2">
            {ARTICLES.map((article, idx) => (
              <div key={idx} className="group perspective">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full min-h-[260px] h-full transform-style-preserve-3d transition-transform duration-300"
                >
                  {/* Frente */}
                  <div className="absolute inset-0 backface-hidden bg-gray-800 rounded-2xl overflow-hidden shadow-lg shadow-black/30 flex flex-col">
                    <Image
                      src={article.img}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex-grow flex items-center justify-center">
                      <h3 className="text-white text-lg font-semibold text-center break-words leading-tight">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Reverso */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 rounded-2xl p-4 text-white shadow-lg shadow-black/30 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 break-words">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-300 break-words">
                        {article.desc}
                      </p>
                    </div>
                    {article.link && (
                      <div className="mt-4">
                        <a
                          href={article.link}
                          target="_blank"
                          className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                        >
                          Ver más
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </motion.header>
      {/* ORG CHART SECTION */}
      <motion.section
        ref={orgChartRef}
        className="w-full bg-gray-900 bg-opacity-95 text-center py-10 px-4 md:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <FooterRH />
        </motion.div>
      </motion.section>

      {/* BOTÓN FLOTANTE ANIMADO */}
      <button
        onClick={() =>
          orgChartRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        className="fixed bottom-6 right-6 z-50 bg-[#9A3324] hover:bg-[#7c291d] text-white rounded-full px-5 py-3 text-sm shadow-xl animate-bounce transition-all"
        aria-label="Ir al organigrama"
      >
        Conoce el equipo de Capacitación
      </button>
    </>
  );
}
