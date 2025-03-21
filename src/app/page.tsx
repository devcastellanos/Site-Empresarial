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
    img: "/image/Plan.webp",
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
    img: "/image/Convenios.png",
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

        <div className="mt-12 max-w-4xl mx-auto text-left">
          <Accordion type="single" collapsible className="w-full">
            {ARTICLES.map((article, idx) => (
              <AccordionItem value={`item-${idx}`} key={idx}>
                <AccordionTrigger className="text-white text-xl font-semibold">
                  {article.title}
                </AccordionTrigger>
                <AccordionContent className="bg-gray-800 text-white rounded-b-lg px-4 py-6">
                  <Image
                    src={article.img}
                    alt={article.title}
                    className="w-full h-[600px] object-contain mb-4 rounded-lg"
                    width={500}
                    height={1000}
                  />

                  <p className="mb-4">{article.desc}</p>
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      Ver más
                    </a>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16">
          <Footer />
        </div>
      </motion.section>
    </>
  );
}
