"use client";
import { NavbarRH, FooterRH } from "@/components";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Posts from "@/components/blogComponents/postsPage";

const ARTICLES = [
  {
    img: "/image/osticket.png",
    title: "Osticket",
    desc: "Plataforma para generar y dar seguimiento a tickets de soporte técnico y otros servicios.",
    link: "https://soporte.grupotarahumara.com.mx/",
  },
  {
    img: "/image/convenio.jpg",
    title: "Convenios",
    desc: "Explora los convenios con educativos y empresariales con descuentos y beneficios para colaboradores.",
    link: "/Convenios",
  },
  {
    img: "/image/UT.png",
    title: "Universidad Tarahumara",
    desc: "Accede a los programas de formación y desarrollo profesional internos de la organización.",
    link: "/HomeUT",
  },
  {
    img: "/image/fotos.jpg",
    title: "Fotos",
    desc: "Mira las galerías de eventos, actividades y momentos importantes de Grupo Tarahumara.",
    link: "https://gpotarahumara.sharepoint.com/:u:/r/sites/Intranet_Tarahumara_/SitePages/GALERIA-DE-FOTOS-EVENTOS-TARAHUMARA.aspx?csf=1&web=1&share=EZL7_tW-NehCkexJiK2j-jIBDJ8VuW--BSErAK8hGhefUA&e=tchd4L",
  },
  {
    img: "/image/sharepoint.jpg",
    title: "Sitios de SharePoint",
    desc: "Accede a los sitios SharePoint de cada área, organizados por departamento o función.",
    link: "https://gpotarahumara.sharepoint.com/:u:/s/Intranet_Tarahumara_/EXG3EdX-9JFDhPff0nhO_h0BcKbAE_zZ1B372dPJYPScXQ?e=f9YAZR",
  },
];

export default function IntranetHomePage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const orgPostsRef = useRef<HTMLElement | null>(null);

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

        <div className="relative z-10 w-full max-w-6xl px-6 text-white mt-20">
          <h1 className="text-[48px] lg:text-[64px] font-extrabold leading-tight">
            Grupo Tarahumara
          </h1>
          <p className="mt-2 text-lg lg:text-2xl text-gray-200">
            En Grupo Tarahumara valoramos el esfuerzo colectivo y la dedicación
            diaria que construye nuestro éxito. Esta intranet es tu espacio para
            conectar, colaborar y crecer juntos.
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

          {/* TARJETAS / ARTICLES */}
          <div className="mt-28 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-2">
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

      <motion.section
        ref={orgPostsRef}
        className="w-full bg-opacity-95 text-center py-8 px-4 md:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
        <Posts />
        </motion.div>
      </motion.section>
      
      {/* BOTÓN FLOTANTE ANIMADO */}
      <button
        onClick={() =>
          orgPostsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        className="fixed bottom-6 right-6 z-50 bg-[#9A3324] hover:bg-[#7c291d] text-white rounded-full px-5 py-3 text-sm shadow-xl animate-bounce transition-all"
        aria-label="Ir al organigrama"
      >
        Entérate de las últimas noticias de Grupo Tarahumara
      </button>

    </>
  );
}
