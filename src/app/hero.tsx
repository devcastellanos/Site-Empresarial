"use client";

import Image from "next/image";
import { Button, Typography, Input } from "@material-tailwind/react";


function Hero() {
  return (
    <header className="mt-5 bg-white p-8">
    <div className="w-w-full container mx-auto pt-12 pb-24 text-center">
      <Typography
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        color="blue-gray"
        className="mx-auto w-full text-[30px] lg:text-[48px] font-bold leading-[45px] lg:leading-[60px] lg:max-w-2xl"
      >
        Capacitacion Tarahumara
      </Typography>
      <Typography
      placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        variant="lead"
        className="mx-auto mt-8 mb-4 w-full px-8 !text-gray-700 lg:w-10/12 lg:px-12 xl:w-8/12 xl:px-20"
      >
        Descubre herramientas, presentaciones, guías y contenido multimedia diseñados para potenciar tu desarrollo profesional en tu área laboral.
        {'\n'}¡Aquí tienes todo lo necesario para crecer y avanzar!
      </Typography>
      <div className="grid place-items-start justify-center gap-2">
        <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
          <div className="w-80">
            {/* @ts-ignore */}
            <Input label="name@grupotarahumara.com.mx" />
          </div>
          <Button size="md" className="lg:w-max shrink-0" fullWidth color="gray"  >
            get started
          </Button>
        </div>

      </div>
    </div>
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
