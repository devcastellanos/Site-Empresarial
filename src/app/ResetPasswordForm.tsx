"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import Swal from "sweetalert2";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!password || !token) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes ingresar una nueva contraseña",
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
  window.location.href = "/login"; // ajusta la ruta si es diferente
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
    <Card className="max-w-md mx-auto mt-10 shadow-xl">
      <CardHeader>
        <CardTitle>Restablecer contraseña</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label>Nueva contraseña</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Actualizando..." : "Guardar nueva contraseña"}
        </Button>
      </CardContent>
    </Card>
  );
}
