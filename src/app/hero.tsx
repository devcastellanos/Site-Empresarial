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
    <header className="relative w-full h-screen flex items-center justify-center text-center">
      {/* Video de fondo */}
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/image/background.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      {/* Capa oscura para mejorar visibilidad del texto */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-3xl px-8">
        <Typography
          color="white"
          className="text-[36px] lg:text-[50px] font-bold leading-tight"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Capacitacion Tarahumara
        </Typography>

        <Typography
          variant="lead"
          className="mt-2 text-sm lg:text-base text-gray-200"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional en tu área laboral.
          {'\n'}¡Aquí tienes todo lo necesario para crecer y avanzar!
        </Typography>
      </div>
    </header>
  );
}

export default Hero;
