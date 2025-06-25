"use client";
import React from "react";
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
    link: "https://gpotarahumara-my.sharepoint.com/:x:/g/personal/mariana_perez_grupotarahumara_com_mx/EQNL9xbkUwJKsVB23tLXhPkBndSs_0WkEpm5VRc1lQMv4w?e=cW0Drb",
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
    link: 'https://gpotarahumara-my.sharepoint.com/:x:/g/personal/mariana_perez_grupotarahumara_com_mx/EXIe6iBPgnNGpMuo63FeZ1gBYdjBXXY1AxVzK418aUpSFQ?e=gdJFIF',
  },
];

export function Articles() {
  return (
    <section className="w-full min-h-screen bg-gray-900 bg-opacity-95 text-center py-10 px-4 md:px-16">
      
      {/* Título */}
      <Typography color="white" className="text-[36px] lg:text-[50px] font-bold leading-tight" {...({} as any)}>
        Herramientas y Plataformas
      </Typography>

      {/* Descripción */}
      <Typography variant="lead" color="white" className="mt-2 text-sm lg:text-base" {...({} as any)}>
        Herramientas y plataformas que te ayudarán a potenciar tu desarrollo profesional en tu área laboral.
      </Typography>

      {/* Carrusel */}
      <div className="mt-12 relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, bulletClass: "swiper-pagination-bullet-custom" }}
          loop={true}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full pb-14" // Mayor separación de la paginación
        >
          {ARTICLES.map((article, idx) => (
            <SwiperSlide key={idx}>
              <div className="transition-all duration-300 transform hover:scale-105">
                <ArticleCard
                  img={article.img}
                  title={article.title}
                  desc={article.desc}
                  link={article.link}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-pagination {
            bottom: 5px !important; /* Separa la paginación */
          }
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background-color: white; 
   
          }
          .swiper-pagination-bullet-active {
            background-color: #007bff; /* Bullet activo en azul */
          }
        `}</style>
      </div>
    </section>
  );
}

export default Articles;
