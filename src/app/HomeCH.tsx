"use client";
import { NavbarRH, FooterRH } from "@/components";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import OrgChart from "@/components/OrgChart";

const ARTICLES = [
  {
    img: "/image/crehana.png",
    title: "Crehana",
    desc: "Crehana es una plataforma de educación online que ofrece cursos de diseño, marketing, fotografía, programación y más.",
    link: "https://www.crehana.com/entrar/",
  },
  // {
  //   img: "/image/cap.png",
  //   title: "Plan de Capacitación",
  //   desc: "Da clic para conocer el Plan anual de capacitación actualizada.",
  //   link: "",
  // },
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
    link: "/Convenios?tipo=no educativo",
  },
  {
    img: "/image/solicitud.png",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
    link: "https://gpotarahumara-my.sharepoint.com/...",
  },
];

export default function CapacitacionPage() {
  const ref = useRef(null);
  const orgChartRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll();
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <NavbarRH />
      <motion.header
        ref={ref}
        className="relative w-full min-h-screen flex flex-col items-center justify-start text-center overflow-hidden "
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[#9A3324] bg-opacity-50" />
        <div className="relative z-10 w-full max-w-6xl px-6 text-white mt-48">
          <h1 className="text-[48px] lg:text-[64px] font-extrabold leading-tight">
            Capital Humano
          </h1>
          <p className="mt-2 text-lg lg:text-2xl text-gray-200">
            El área de Capital Humano gestiona el talento de la organización,
            promoviendo el desarrollo profesional, el bienestar laboral y la
            alineación estratégica entre colaboradores y empresa.
          </p>
          <div className="mt-12 flex justify-center">
            <Image
              src="/image/Logo-Outline.png"
              alt="Logo"
              width={256}
              height={256}
              className="w-64 h-auto"
            />
          </div>

          {/* ARTICLES */}
          <div className="mt-36 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {ARTICLES.map((article, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-[#9A3324] rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={article.img}
                  alt={article.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {article.title}
                  </h3>
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      hoveredIndex === idx ? "max-h-48" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <p className="text-gray-300 text-sm">{article.desc}</p>
                    {article.link && (
                      <div className="mt-6">
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* ORG CHART SECTION */}
      <motion.section
        ref={orgChartRef}
        className="w-full bg-[#9A3324] text-center py-10 px-4 md:px-16"
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
          <OrgChart />
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
        Conoce el equipo de Capital Humano
      </button>
    </>
  );
}
