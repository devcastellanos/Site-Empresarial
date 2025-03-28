"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import Image from "next/image";

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Por favor, ingresa tu email y contraseña.",
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      login();

      if (response.status !== 200) {
        Swal.fire({
          icon: "error",
          title: "Error en la solicitud",
          text:
            response.data.message ||
            "No se pudo completar el inicio de sesión.",
        });
        return;
      }
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido de nuevo!",
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al intentar iniciar sesión. Inténtalo nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-2">
          <div className="bg-white/70 rounded-xl px-6 py-1 shadow-md">
          <Image
  src="/image/logo.png"
  alt="Logo"
  width={120}        // o el tamaño real de tu logo
  height={40}
  className="h-auto w-auto"
/>
          </div>
        </div>

        <Card
          shadow={false}
          className="backdrop-blur-sm bg-black/60 border border-white/10 text-white p-8 rounded-xl w-full max-w-md"
          {...({} as any)}
        >
          <Typography
            variant="h3"
            color="white"
            className="text-center mb-2"
            {...({} as any)}
          >
            Inicio de Sesión
          </Typography>
          <Typography
            className="text-gray-300 text-center text-sm mb-6"
            {...({} as any)}
          >
            Bienvenido administrador, ingresa tus datos para continuar
          </Typography>

          <form className="space-y-6">
            <div>
              <Typography
                variant="h6"
                className="text-white mb-1"
                {...({} as any)}
              >
                Correo o Número de Empleado
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="nombre@grupotarahumara.com.mx o 1234"
                {...({} as any)}
                className="text-white placeholder:text-gray-400 bg-white/10 focus:!border-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Typography
                variant="h6"
                className="text-white mb-1"
                {...({} as any)}
              >
                Contraseña
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                {...({} as any)}
                className="text-white placeholder:text-gray-400 bg-white/10 focus:!border-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              fullWidth
              size="lg"
              className="bg-white text-black font-bold hover:bg-gray-200 transition-colors"
              onClick={handleLogin}
              disabled={isLoading}
              {...({} as any)}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Button>

            <Typography
              className="text-center text-gray-400 text-sm mt-4"
              {...({} as any)}
            >
              Si no tienes cuenta de administrador, comunícate con soporte
            </Typography>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
