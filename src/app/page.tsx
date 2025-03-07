"use client";
import { Navbar, Footer } from "@/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion, useScroll, useTransform } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Button } from "@material-tailwind/react";
import { useRef } from "react";

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
    img: "/image/asistencia.png",
    title: "Asistencia",
    desc: "Da clic aquí para descargar la lista de asistencia de la capacitación de Tarahumara.",
    link: "https://gpotarahumara-my.sharepoint.com/...",
  },
  {
    img: "/image/Convenio.png",
    title: "Convenios Educativos",
    desc: "Da clic aquí para conocer los convenios educativos que tenemos.",
    link: "/Convenios",
  },
  {
    img: "/image/solicitud.jpg",
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
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
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
          <h1 className="text-[64px] lg:text-[80px] font-extrabold leading-tight">
            Capacitación Tarahumara
          </h1>
          <p className="mt-2 text-xl lg:text-2xl text-gray-200">
            Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional.
          </p>
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
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="mt-12"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full pb-14"
          >
            {ARTICLES.map((article, idx) => (
              <SwiperSlide key={idx}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-lg overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full bg-black bg-opacity-70 p-4 z-10">
                    <h3 className="text-xl font-bold text-white">{article.title}</h3>
                  </div>
                  <img src={article.img} alt={article.title} className="w-full h-80 object-cover rounded-lg transition-transform duration-300" />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white p-6 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  >
                    <p className="text-lg mb-4">{article.desc}</p>
                    <a 
                      href={article.link} 
                      target="_blank" 
                      className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                    >
                      Ver más
                    </a>
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </motion.section>
    </>
  );
}
