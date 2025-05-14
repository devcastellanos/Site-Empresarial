"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Card,
  Input,
  Button,
  Dialog,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import Image from "next/image";

export function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empleadoValido, setEmpleadoValido] = useState<boolean | null>(null);
  const [infoEmpleado, setInfoEmpleado] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [registroEmpleado, setRegistroEmpleado] = useState("");
  const [registroPassword, setRegistroPassword] = useState("");
  const [registroConfirmar, setRegistroConfirmar] = useState("");
  const [registroInfo, setRegistroInfo] = useState<any>(null);
  const [registroValido, setRegistroValido] = useState<boolean | null>(null);

  const validarEmpleado = async (numEmpleado: string) => {
    try {
      const res = await fetch("/api/validarEmpleado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_empleado: numEmpleado }),
      });
      const data = await res.json();
      setEmpleadoValido(data.success);
      setInfoEmpleado(data.success ? data.data : null);
    } catch (error) {
      setEmpleadoValido(false);
      setInfoEmpleado(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!isNaN(Number(value)) && value.trim() !== "") {
      validarEmpleado(value);
    } else {
      setEmpleadoValido(null);
      setInfoEmpleado(null);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      return;
    }

    setIsLoading(true);
    const payload = isNaN(Number(email)) ? { email, password } : { num_empleado: email, password };

    try {
      const response = await axios.post("/api/auth/login", payload, { withCredentials: true });
      if (response.status === 200) {
        login();
        Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success").then(() => router.push("/"));
      } else throw new Error();
    } catch {
      Swal.fire("Error", "Credenciales incorrectas o fallo del servidor", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openRegistroModal = () => {
    setRegistroEmpleado("");
    setRegistroPassword("");
    setRegistroConfirmar("");
    setRegistroInfo(null);
    setRegistroValido(null);
    setOpenModal(true);
  };

  const validarRegistroEmpleado = async (numEmpleado: string) => {
    try {
      const res = await fetch("/api/validarEmpleado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_empleado: numEmpleado }),
      });
      const data = await res.json();
      setRegistroValido(data.success);
      setRegistroInfo(data.success ? data.data : null);
    } catch {
      setRegistroValido(false);
      setRegistroInfo(null);
    }
  };

  const enviarRegistro = async () => {
    if (!registroEmpleado || !registroPassword || !registroConfirmar) {
      Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
      return;
    }
    if (registroPassword !== registroConfirmar) {
      Swal.fire("Contraseñas no coinciden", "Verifica los campos de contraseña", "warning");
      return;
    }

    try {
      await axios.post("/api/agregarUsuario", {
        num_empleado: registroEmpleado,
        password: registroPassword,
      });
      Swal.fire("Registro exitoso", "Revisa tu correo para confirmar tu cuenta", "success");
      setOpenModal(false);
    } catch {
      Swal.fire("Error", "No se pudo completar el registro", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Image
            src="/image/logowhite.png"
            alt="Logo Grupo Tarahumara"
            width={260}
            height={80}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        <Card className="rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-10 shadow-2xl text-white">
          <h3 className="text-center font-bold text-2xl mb-4">Bienvenido</h3>
          <p className="text-center text-gray-300 text-sm mb-6">
            Inicia sesión con tu correo o número de empleado
          </p>

          <div className="space-y-4">
            <Input
              label="Correo o número de empleado"
              value={email}
              onChange={handleInputChange}
              crossOrigin=""
              className="text-white"
              labelProps={{ className: "text-white" }}
              containerProps={{ className: "min-w-full" }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />

            {empleadoValido !== null && (
              <p className={`text-sm ${empleadoValido ? "text-green-400" : "text-red-400"}`}>
                {empleadoValido
                  ? `Empleado válido: ${infoEmpleado?.NombreCompleto ?? ""}`
                  : "Número de empleado no válido"}
              </p>
            )}

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              crossOrigin=""
              className="text-white"
              labelProps={{ className: "text-white" }}
              containerProps={{ className: "min-w-full" }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />

            <Button
              fullWidth
              onClick={handleLogin}
              disabled={isLoading}
              className="text-white font-bold py-2 transition duration-300 rounded-lg"
              style={{ backgroundColor: "#9A3324" }}
              ripple={false}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {isLoading ? "Cargando..." : "INICIAR SESIÓN"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={openRegistroModal}
              className="border-white text-white hover:bg-white/10 transition duration-300 rounded-lg"
              ripple={false}
              crossOrigin=""
            >
              CREAR CUENTA NUEVA
            </Button>

            <p className="text-center text-sm text-gray-400 mt-4">
              ¿No tienes cuenta? Valida tu número de empleado y regístrate.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* DIALOG DE REGISTRO */}
      <Dialog open={openModal} handler={setOpenModal} size="xs" className="bg-transparent shadow-none" dismiss={{ enabled: true }}>
        <div className="w-screen max-w-sm mx-auto rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-6 shadow-2xl text-white">
          <div className="flex justify-center mb-8">
            <Image
              src="/image/logowhite.png"
              alt="Logo Grupo Tarahumara"
              width={260}
              height={80}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          <h3 className="text-xl font-bold mb-6 text-center">Crear cuenta nueva</h3>

          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-white text-sm font-medium">Número de empleado</label>
              <Input
                value={registroEmpleado}
                onChange={(e) => {
                  const val = e.target.value;
                  setRegistroEmpleado(val);
                  if (val) validarRegistroEmpleado(val);
                }}
                crossOrigin=""
                className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 rounded-md"
              />
              {registroValido !== null && (
                <p className={`text-sm ${registroValido ? "text-green-400" : "text-red-400"}`}>
                  {registroValido ? `✅ ${registroInfo?.NombreCompleto ?? ""}` : "Número no válido"}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-white text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                value={registroPassword}
                onChange={(e) => setRegistroPassword(e.target.value)}
                crossOrigin=""
                className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 rounded-md"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-white text-sm font-medium">Confirmar contraseña</label>
              <Input
                type="password"
                value={registroConfirmar}
                onChange={(e) => setRegistroConfirmar(e.target.value)}
                error={registroConfirmar !== "" && registroPassword !== registroConfirmar}
                success={registroConfirmar !== "" && registroPassword === registroConfirmar}
                crossOrigin=""
                className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 rounded-md"
              />
              {registroConfirmar && registroPassword !== registroConfirmar && (
                <p className="text-sm text-red-400">Las contraseñas no coinciden</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="text"
              onClick={() => setOpenModal(false)}
              className="text-gray-300 hover:text-white"
              ripple={false}
              crossOrigin=""
            >
              Cancelar
            </Button>
            <Button
              onClick={enviarRegistro}
              disabled={
                !registroValido ||
                !registroPassword ||
                registroPassword !== registroConfirmar
              }
              className="text-white px-4 py-2 font-semibold rounded-md hover:opacity-90"
              style={{ backgroundColor: "#9A3324" }}
              ripple={false}
              crossOrigin=""
            >
              Registrar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
