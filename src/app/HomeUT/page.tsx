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
    img: "/image/Asistencia.png",
    title: "Asistencia",
    desc: "Da clic aquí para descargar la lista de asistencia de la capacitación de Tarahumara.",
    link: "https://gpotarahumara-my.sharepoint.com/:x:/g/personal/mariana_perez_grupotarahumara_com_mx/EQNL9xbkUwJKsVB23tLXhPkBOSHORZ0Tja9WZRw3Z16Y3A?e=uUvEBF",
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
    link: "https://gpotarahumara-my.sharepoint.com/:x:/g/personal/mariana_perez_grupotarahumara_com_mx/EXIe6iBPgnNGpMuo63FeZ1gB5zSkRgqDv5QcI0gXQZHNew?e=sKabdc",
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
        <motion.header
          ref={ref}
          className="relative w-full min-h-screen flex flex-col items-center justify-start text-center mt-52 overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(to bottom, white, rgb(154, 51, 36))",
          }}
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full" />
          <div className="relative z-10 w-full max-w-6xl text-black">
            <h1 className="text-[48px] lg:text-[64px] font-extrabold leading-tight">
              Universidad Tarahumara
            </h1>
            <p className="text-lg lg:text-2xl text-gray-800">
              Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional.
            </p>
            <div className="flex justify-center my-4">
              <Image
                src="/image/utara.png"
                alt="Logo"
                width={256}
                height={256}
                className="w-32 h-auto"
              />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ARTICLES.map((article, idx) => {
                const isExternal = article.link.startsWith("http");
                const Wrapper = isExternal ? "a" : Link;

                return (
                  <Wrapper
                    key={idx}
                    href={article.link}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group perspective no-underline"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative w-full min-h-[260px] h-full transform-style-preserve-3d transition-transform duration-300 cursor-pointer"
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
                        <div className="mt-4">
                          <span className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition">
                            Ver más
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Wrapper>
                );
              })}

            </div>
          </div>
        </motion.header>
      {/* ORG CHART SECTION */}
      <motion.section
        ref={orgChartRef}
        className="w-full text-center"
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
          <motion.section
            ref={orgChartRef}
            className="w-full text-center"
            style={{
              backgroundImage: 'linear-gradient(to bottom, white, rgb(154, 51, 36))',
            }}
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
        </motion.div>
      </motion.section>

      {/* BOTÓN FLOTANTE */}
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
