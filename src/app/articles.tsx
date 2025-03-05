"use client";
import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ArticleCard from "@/components/article-card";

const ARTICLES = [
  {
    img: "/image/crehana.png",
    title: "Crehana",
    desc: "Crehana es una plataforma de educación online que ofrece cursos de diseño, marketing, fotografía, programación y más.",
    link: 'https://www.crehana.com/entrar/',
  },
  {
    img: "/image/Plan.webp",
    title: "Plan de Capacitación",
    desc: "Da clic para conocer el Plan anual de capacitación actualizada",
    link: '',
  },
  {
    img: "/image/asistencia.png",
    title: "Asistencia",
    desc: "Da clic aquí para descargar la lista de asistencia de la capacitación de Tarahumara.",
    link: 'https://gpotarahumara-my.sharepoint.com/...',
  },
  {
    img: "/image/solicitud.jpg",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
    link: 'https://gpotarahumara-my.sharepoint.com/...',
  },
  {
    img: "/image/Convenio.png",
    title: "Convenios Educativos",
    desc: "Da clic aquí para conocer los convenios educativos que tenemos.",
    link: '/Convenios',
  }
];

export function Articles() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-8 py-10 text-center">

      <Typography
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          color="blue-gray"
          className="text-[36px] lg:text-[50px] font-bold leading-tight"
        >
          Herramientas y Plataformas
        </Typography>

        {/* Descripción más pequeña y sin restricciones de margen */}
        <Typography
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          variant="lead"
          className="mt-2 text-sm lg:text-base text-gray-700" // Reduje mt-4 a mt-2
        >
          Herramientas y plataformas que te ayudarán a potenciar tu desarrollo profesional en tu área laboral.
        </Typography>

      <div className="mt-12">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={3}
          spaceBetween={10}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full"
        >
          {ARTICLES.map((article, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={`relative transition-all duration-300 transform ${
                  hoveredArticle === idx ? 'scale-100' : 'scale-95'
                }`}
                onMouseEnter={() => setHoveredArticle(idx)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <ArticleCard
                  img={article.img}
                  title={article.title}
                  desc={article.desc}
                  link={article.link}
                />

                {hoveredArticle === idx && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 rounded transition-opacity duration-300">
                    <p className="text-center">{article.desc}</p>
                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all"
                      >
                        Ir al enlace
                      </a>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Articles;
