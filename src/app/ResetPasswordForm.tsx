"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import NavbarRH from "@/components/navbarRH"; // Ajusta la ruta si es diferente
import Image from "next/image";

type ResetPasswordFormProps = {
  onClose?: () => void;
};

export function ResetPasswordForm({ onClose }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const searchParams = useSearchParams();
  const confirmarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!password || !confirmar || !token) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Ingresa y confirma tu nueva contraseña",
        confirmButtonColor: "#9A3324",
      });
      return;
    }

    if (password !== confirmar) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Asegúrate de que ambas contraseñas sean iguales",
        confirmButtonColor: "#9A3324",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/restablecer-password`,
        {
          token,
          nuevaPassword: password,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Serás redirigido al inicio de sesión.",
        confirmButtonColor: "#9A3324",
      });

      if (onClose) {
        onClose();
      } else {
        window.location.href = "/Login";
      }

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error al actualizar contraseña",
        confirmButtonColor: "#9A3324",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarRH />

      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        style={{ opacity: 1 }}
      >
        <source src="/image/background.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </motion.video>

      <div className="flex justify-center items-center min-h-[80vh] px-4 relative z-10">
        <Card className="w-full max-w-md bg-black/50 backdrop-blur-md text-white shadow-2xl rounded-2xl border border-white/10">
          <CardHeader className="text-center space-y-4">
            <Image
              src="/image/logowhite.png"
              alt="Logo"
              width={240}
              height={80}
              className="mx-auto rounded-full"
            />
            <div>
              <CardTitle className="text-xl">Restablecer contraseña</CardTitle>
              <CardDescription className="text-zinc-400">
                Ingresa tu nueva contraseña para continuar
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-1 relative">
              <Label>Nueva contraseña</Label>
              <Input
                type={verPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmarRef.current?.focus();
                }}
                className="bg-black/40 text-white placeholder:text-white/60 border border-white/20 rounded-lg pr-10 focus:ring-2 focus:ring-[#9A3324] focus:outline-none backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setVerPassword((prev) => !prev)}
                className="absolute right-2 top-9 text-zinc-400 hover:text-white"
              >
                {verPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="space-y-1 relative">
              <Label>Confirmar contraseña</Label>
              <Input
                type={verConfirmar ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                ref={confirmarRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className="bg-black/40 text-white placeholder:text-white/60 border border-white/20 rounded-lg pr-10 focus:ring-2 focus:ring-[#9A3324] focus:outline-none backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setVerConfirmar((prev) => !prev)}
                className="absolute right-2 top-9 text-zinc-400 hover:text-white"
              >
                {verConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#9A3324] text-white hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Guardar nueva contraseña"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
