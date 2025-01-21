import Image from "next/image";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";

interface ArticleCardProps {
  img: string;
  title: string;
  desc: string;
  link: string; // Añadido para que reciba un enlace
}

export function ArticleCard({ img, title, desc, link }: ArticleCardProps) {
  const handleClick = () => {
    window.location.href = link; // Redirigir al hacer clic
  };

  return (
    <Card
      className="relative grid min-h-[30rem] overflow-hidden rounded-xl cursor-pointer"
      color="transparent"
      placeholder=""
      onClick={handleClick}
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <div className="relative">
        <Image
          width={768}
          height={768}
          src={img}
          alt="bg"
          className="w-full h-full object-cover object-center filter contrast-110" // Mejorar nitidez
        />
      </div>

      <div className="absolute inset-0" />
      <CardBody
        className="relative flex flex-col justify-end p-6 bg-black "
        placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}} 
      >
        <Typography
          variant="h4"
          color="white"
          className=" mb-2"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {title}
        </Typography>
        <Typography
          variant="paragraph"
          color="white"
          className="font-normal "
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {desc}
        </Typography>
      </CardBody>
    </Card>
  );
}

export default ArticleCard;
