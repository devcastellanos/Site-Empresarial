"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import ArticleCard from "@/components/article-card";

const ARTICLES = [
  {
    img: "/image/blogs/blog-1.png",
    title: "Crehana",
    desc: "Crehana es una plataforma de educación online que ofrece cursos de diseño, marketing, fotografía, programación y más.",
  },
  {
    img: "/image/blogs/blog-2.png",
    title: "Plan de Capacitación",
    desc: "Da clic aquí para conocer el plan de capacitación de la empresa Tarahumara para 2025.",
  },
  {
    img: "/image/blogs/blog-1.png",
    title: "Asistencia",
    desc: "Da clic aqui para descargar la lista de asistencia de la capacitación de Tarahumara.",
  },
  {
    img: "/image/blogs/blog-1.png",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
  },
  {
    img: "/image/blogs/blog-1.png",
    title: "Formato de Registro",
    desc: "Registra tu asistencia al curso que hayas tomado.",
  }
];

export function Articles() {
  return (
    <section className="container mx-auto px-8 py-20">
      <Typography variant="h2" color="blue-gray">
        Herramientas y Plataformas
      </Typography>
      <Typography
        variant="lead"
        className="my-2 w-full font-normal !text-gray-500 lg:w-5/12"
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
