"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm() {
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/restablecer-password`, {
        token,
        nuevaPassword: password,
      });

      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Serás redirigido al inicio de sesión.",
        confirmButtonColor: "#9A3324",
      }).then(() => {
        window.location.href = "/Login"; // ajusta según tu ruta real
      });

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
    <div className="space-y-6 text-white max-w-md w-full">
      <div className="text-center">
        <h2 className="text-xl font-bold">Restablecer contraseña</h2>
        <p className="text-sm text-white/80 mt-1">
          Ingresa tu nueva contraseña para continuar
        </p>
      </div>

      {/* Contraseña */}
      <div className="space-y-1 relative">
        <Label className="text-white">Nueva contraseña</Label>
        <Input
          type={verPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmarRef.current?.focus();
          }}
          className="bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pr-10 focus:ring-2 focus:ring-[#9A3324] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVerPassword((prev) => !prev)}
          className="absolute right-2 top-9 text-white/70 hover:text-white"
        >
          {verPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-1 relative">
        <Label className="text-white">Confirmar contraseña</Label>
        <Input
          type={verConfirmar ? "text" : "password"}
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          ref={confirmarRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          className="bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pr-10 focus:ring-2 focus:ring-[#9A3324] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVerConfirmar((prev) => !prev)}
          className="absolute right-2 top-9 text-white/70 hover:text-white"
        >
          {verConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Botón */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#9A3324] text-white hover:brightness-110 disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Guardar nueva contraseña"}
      </Button>
    </div>
  );
}
