"use client";
import { Navbar, Footer } from "@/components";
import { motion, useScroll, useTransform } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRef, createElement } from "react";
import Image from "next/image";

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
    link: "",
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
    link: "/Convenios",
  },
  {
    img: "/image/solicitud.png",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
    link: 'https://gpotarahumara-my.sharepoint.com/...',
  },
];

export default function Campaign() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <>
      <Navbar />
      <motion.video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        style={{ opacity: videoOpacity }}
      >
        <source src="/image/background.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </motion.video>

      <motion.header
        ref={ref}
        className="relative w-full h-screen flex flex-col items-center justify-start text-center pt-32 overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        <div className="relative z-10 w-full max-w-4xl px-8 text-white">
          <h1 className="text-[64px] lg:text-[80px] font-extrabold leading-tight mt-40">
            Capacitación Tarahumara
          </h1>
          <p className="mt-2 text-xl lg:text-2xl text-gray-200">
            Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional.
          </p>
          <div className="mt-6 flex justify-center">
            <img src="/image/logo.png" alt="Logo" className="w-64 h-auto" />
          </div>
        </div>
      </motion.header>

      <motion.section
        className="w-full min-h-screen bg-gray-900 bg-opacity-95 text-center py-10 px-4 md:px-16"
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
          <h2 className="text-[40px] lg:text-[56px] font-bold leading-tight text-white">
            Herramientas y Plataformas
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          {ARTICLES.map((article, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl transition-all duration-300 group"
            >
              <Image
                src={article.img}
                alt={article.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white text-xl font-semibold mb-2">{article.title}</h3>
                <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
                  <p className="text-gray-300 text-sm">{article.desc}</p>
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      Ver más
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16">
          <Footer />
        </div>
      </motion.section>
    </>
  );
}
