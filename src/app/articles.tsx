"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import ArticleCard from "@/components/article-card";

const ARTICLES = [
  {
    img: "/image/crehana.png",
    title: "Crehana",
    desc: "Crehana es una plataforma de educación online que ofrece cursos de diseño, marketing, fotografía, programación y más.",
  },
  {
    img: "/image/plan.webp",
    title: "Plan de Capacitación",
    desc: "Da clic aquí para conocer el plan de capacitación de la empresa Tarahumara para 2025.",
  },
  {
    img: "/image/asistencia.png",
    title: "Asistencia",
    desc: "Da clic aqui para descargar la lista de asistencia de la capacitación de Tarahumara.",
  },
  {
    img: "/image/solicitud.jpg",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
  },
  {
    img: "/image/registro.jpg",
    title: "Formato de Registro",
    desc: "Registra tu asistencia al curso que hayas tomado.",
  }
];

export function Articles() {
  return (
    <section className="container mx-auto px-8 py-20">
      <Typography variant="h2" color="blue-gray" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        Herramientas y Plataformas
      </Typography>
      <Typography
        variant="lead"
        className="my-2 w-full font-normal !text-gray-500 lg:w-5/12"
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}
      >
       Herramientas y plataformas que te ayudarán a potenciar tu desarrollo profesional en tu área laboral.
      </Typography>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {ARTICLES.map((props, idx) => (
          <ArticleCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
export default Articles;
