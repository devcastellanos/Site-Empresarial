"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import Swal from "sweetalert2";

export function ForgotPasswordForm() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!value) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa tu correo o número de empleado",
        confirmButtonColor: "#9A3324",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitar-recuperacion`, {
        email: value.includes("@") ? value : undefined,
        num_empleado: !value.includes("@") ? value : undefined,
      });

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: res.data.message || "Correo de recuperación enviado",
        confirmButtonColor: "#9A3324",
      });
    } catch (err: any) {
      Swal.fire({
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
    <Card className="max-w-md mx-auto mt-10 shadow-xl">
      <CardHeader>
        <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label>Correo electrónico o número de empleado</Label>
        <Input
          placeholder="usuario@empresa.com o 12345"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>
      </CardContent>
    </Card>
  );
}
