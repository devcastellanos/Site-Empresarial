"use client"

import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";
   
  export function Login() {
    return (
       <Card 
         color="transparent" 
         shadow={false} 
         placeholder="" 
         onPointerEnterCapture={() => {}} 
         onPointerLeaveCapture={() => {}}>
        <Typography variant="h4" color="blue-gray"placeholder="" 
         onPointerEnterCapture={() => {}} 
         onPointerLeaveCapture={() => {}}>
          Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal"placeholder="" 
         onPointerEnterCapture={() => {}} 
         onPointerLeaveCapture={() => {}}>
          Bienvenido administrador, por favor ingresa tus datos para continuar
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3"placeholder="" 
         onPointerEnterCapture={() => {}} 
         onPointerLeaveCapture={() => {}}>
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@grupotarahumara.com.mx"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={""}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}

            />
            <Typography variant="h6" color="blue-gray" className="-mb-3" placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />
          </div>
          <Button className="mt-6" fullWidth  size="lg" placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
>
            sign In
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal" placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-gray-900">
              Sign Up
            </a>
          </Typography>
        </form>
      </Card>
    );
  }