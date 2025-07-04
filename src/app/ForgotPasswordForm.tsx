"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Swal from "sweetalert2";

type ForgotPasswordFormProps = {
  onClose?: () => void;
};

export function ForgotPasswordForm({ onClose }: ForgotPasswordFormProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (loading) return; // ⛔ Evita múltiples clics

    if (!value.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa tu correo o número de empleado",
        confirmButtonColor: "#9A3324",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitar-recuperacion`,
        {
          email: value.includes("@") ? value : undefined,
          num_empleado: !value.includes("@") ? value : undefined,
        }
      );

      // ✅ Cierra el modal y limpia input ANTES del Swal
      setTimeout(() => {
        onClose?.();
        setValue("");
      }, 0);

      await Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: res.data.message || "Correo de recuperación enviado",
        confirmButtonColor: "#9A3324",
      });
    } catch (err: any) {
      // ✅ También cierra y limpia si falla
      setTimeout(() => {
        onClose?.();
        setValue("");
      }, 0);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error al enviar solicitud",
        confirmButtonColor: "#9A3324",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 text-white">
      <div className="text-center">
        <h2 className="text-xl font-bold">Genera tu Contraseña</h2>
        <p className="text-sm text-white/80 mt-1">
          Ingresa tu correo electrónico o número de empleado para enviarte un enlace seguro.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Correo o número de empleado</Label>
        <Input
          placeholder="usuario@grupotarahumara.com.mx o 2294"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#9A3324] focus:outline-none"
          disabled={loading}
        />
      </div>

      <Button
        onClick={handleSend}
        disabled={loading}
        className="w-full bg-[#9A3324] text-white hover:brightness-110 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
      </Button>
    </div>
  );
}
