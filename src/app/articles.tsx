"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import ArticleCard from "@/components/article-card";
import { link } from "fs";

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
    desc: " Da clic para conocer el Plan anual de capacitación actualizada",
    link: '',
  },
  {
    img: "/image/asistencia.png",
    title: "Asistencia",
    desc: "Da clic aqui para descargar la lista de asistencia de la capacitación de Tarahumara.",
    link: 'https://gpotarahumara-my.sharepoint.com/personal/mariana_perez_grupotarahumara_com_mx/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmariana%5Fperez%5Fgrupotarahumara%5Fcom%5Fmx%2FDocuments%2FDocumentos%2FDocumentaci%C3%B3n%20del%20%C3%A1rea%2FF%2DP%2DRHU%2D01%2D03%5F6%5FRegistros%20de%20capacitacion%5Foriginal%2Epdf&parent=%2Fpersonal%2Fmariana%5Fperez%5Fgrupotarahumara%5Fcom%5Fmx%2FDocuments%2FDocumentos%2FDocumentaci%C3%B3n%20del%20%C3%A1rea&ct=1737406876098&or=OWA%2DNT%2DMail&cid=1ecde25e%2D3b4d%2Dad25%2D8d3e%2D568fc48914c0&ga=1',
  },
  {
    img: "/image/solicitud.jpg",
    title: "Formato de solicitud",
    desc: "Da clic aquí para descargar el formato de solicitud de cursos.",
    link: 'https://gpotarahumara-my.sharepoint.com/:x:/g/personal/mariana_perez_grupotarahumara_com_mx/EXIe6iBPgnNGpMuo63FeZ1gBYdjBXXY1AxVzK418aUpSFQ?e=89xqdG&CID=efd56ef1-2340-296e-d712-2c877bb06ace',
  },
  {
    img: "/image/Convenio.png",
    title: "Convenios Educativos",
    desc: "Da clic aquí para conocer los convenios educativos que tenemos.",
    link: 'https://forms.office.com/pages/responsepage.aspx?id=HR1qNFvnU0eQK3TtYK53oRa6ro17qA9HmqqIEDMD7wpUMkdVRTNTUzRSTk1SQkk0N0hXVlJENE5YUS4u',
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
