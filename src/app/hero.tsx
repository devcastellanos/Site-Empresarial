"use client";
import axios from "axios";
import Image from "next/image";
import { Button, Typography, Input } from "@material-tailwind/react";

function Hero() {
  const getProfile = async () => {
    const response = await axios.get('/api/auth/profile', { withCredentials: true });
    console.log(response);
    console.log(response.data.user.email);
  }

  return (
    <header className="bg-white p-8">
      <div className="w-full container mx-auto pt-2 pb-14 text-center"> {/* Reduje pb-48 a pb-12 */}

        {/* Título más arriba */}
        <Typography
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          color="blue-gray"
          className="text-[36px] lg:text-[50px] font-bold leading-tight"
        >
          Capacitacion Tarahumara
        </Typography>

        {/* Descripción más pequeña y sin restricciones de margen */}
        <Typography
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          variant="lead"
          className="mt-2 text-sm lg:text-base text-gray-700" // Reduje mt-4 a mt-2
        >
          Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional en tu área laboral.
          {'\n'}¡Aquí tienes todo lo necesario para crecer y avanzar!
        </Typography>

        {/* Formulario */}
        <div className="grid place-items-start justify-center gap-2">
        </div>
      </div>

      {/* Imagen */}
      <div className="w-full lg:container lg:mx-auto">
        <Image
          width={1920}
          height={1080}
          src="/image/Apples.jpg"
          alt="background"
          className="h-96 w-full rounded-lg object-cover lg:h-[21rem]"
        />
      </div>
    </header>
  );
}
export default Hero;
