import Image from "next/image";
import {
  Typography,
  Card,
  CardBody,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { useState } from "react";

interface ArticleCardProps {
  img: string;
  title: string;
  desc: string;
  link: string;
}

export function ArticleCard({ img, title, desc, link }: ArticleCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className="relative w-full rounded-xl shadow-lg overflow-hidden bg-gray-800"
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      {/* Imagen del artículo */}
      <div className="relative">
        <Image
          width={768}
          height={1200}
          src={img}
          alt={title}
          className="w-full object-cover object-center"
        />
      </div>

      {/* Accordion para la información */}
      <Accordion
        open={open}
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        {/* Título con botón para expandir */}
        <AccordionHeader
          onClick={() => setOpen(!open)}
          className="bg-gray-900 text-white px-4 py-3 cursor-pointer"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Typography variant="h5" className="text-white" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            {title}
          </Typography>
        </AccordionHeader>

        {/* Contenido desplegable */}
        <AccordionBody className="bg-gray-700 text-gray-200 p-4">
          <Typography
            variant="paragraph"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {desc}
          </Typography>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Ir al enlace
            </a>
          )}
        </AccordionBody>
      </Accordion>
    </Card>
  );
}

export default ArticleCard;
