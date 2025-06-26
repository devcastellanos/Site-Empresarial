"use client";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import Image from "next/image";

export function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [registroEmpleado, setRegistroEmpleado] = useState("");
  const [registroPassword, setRegistroPassword] = useState("");
  const [registroConfirmar, setRegistroConfirmar] = useState("");
  const [registroLoading, setRegistroLoading] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmarRef = useRef<HTMLInputElement>(null);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      return;
    }

    const isNumeric = !isNaN(Number(email));
    const payload = isNumeric
      ? { num_empleado: email, password }
      : { email, password };

    setIsLoading(true);

    try {
      // 1. Validar con backend Express
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, payload);
      const user = res.data.data;

      // 3. Guardar el token en cookie vía API interna de Next
      await axios.post('/api/auth/set-token', { user });

      // Mostrar mensaje de éxito y redirigir con recarga
      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success").then(() => {
        window.location.href = "/"; // navega y recarga a la vez
      });
      
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", "Credenciales incorrectas o cuenta no verificada", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openRegistroModal = () => {
    setRegistroEmpleado("");
    setRegistroPassword("");
    setRegistroConfirmar("");
    setOpenModal(true);
  };

  const enviarRegistro = async () => {
    if (registroLoading) return;

    if (!registroEmpleado || !registroPassword || !registroConfirmar) {
      Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
      return;
    }

    if (registroPassword !== registroConfirmar) {
      Swal.fire("Contraseñas no coinciden", "Verifica los campos de contraseña", "warning");
      return;
    }

    setRegistroLoading(true);

    try {
      const check = await fetch(`${baseURL}/api/validarEmpleado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_empleado: registroEmpleado }),
      });

      const checkData = await check.json();

      if (!checkData.success) {
        Swal.fire("Empleado inválido", "Ese número no existe en el sistema", "error");
        return;
      }

      if (checkData.usuarioRegistrado) {
        Swal.fire("Ya registrado", "Este empleado ya tiene una cuenta", "info");
        return;
      }

      await axios.post(`${baseURL}/api/agregarUsuario`, {
        num_empleado: registroEmpleado,
        password: registroPassword,
      });

      Swal.fire("Registro exitoso", "Revisa tu correo para confirmar tu cuenta", "success");
      setOpenModal(false);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.response?.data?.error || "Error desconocido";
        Swal.fire("Error", message, "error");
      }
    } finally {
      setRegistroLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4 py-10">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="/image/background.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl bg-black/50 backdrop-blur-lg border border-white/10 p-10 shadow-2xl text-white">
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
          <h3 className="text-center font-bold text-2xl mb-4">Bienvenido</h3>
          <p className="text-center text-gray-300 text-sm mb-6">
            Inicia sesión con tu correo o número de empleado
          </p>

          <div className="space-y-1">
            <label htmlFor="login-email" className="text-white text-sm font-medium">
              Correo o número de empleado
            </label>
            <Input
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordRef.current?.focus();
                }
              }}
              className="text-white min-w-full"
            />

            <label htmlFor="login-password" className="text-white text-sm font-medium mt-4">
              Contraseña
            </label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className="text-white min-w-full"
              ref={passwordRef}
            />

            <div className="mt-4">
              <Button
                onClick={handleLogin}
                disabled={isLoading || email.trim() === "" || password.trim() === ""}
                className="text-white font-bold w-full transition duration-300 rounded-lg"
                style={{ backgroundColor: "#9A3324" }}
              >
                {isLoading ? "Cargando..." : "INICIAR SESIÓN"}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-300 mt-4">
              ¿No tienes cuenta?{" "}
              <button
                onClick={openRegistroModal}
                className="text-white underline hover:text-red-400 transition"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* REGISTRO */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-black/60 backdrop-blur-xl border border-white/10 text-white">
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
          <DialogTitle className="text-xl font-bold text-center mb-4">Crear cuenta nueva</DialogTitle>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Número de empleado</label>
              <Input
                type="number"
                value={registroEmpleado}
                onChange={(e) => setRegistroEmpleado(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") passwordRef.current?.focus();
                }}
                className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                value={registroPassword}
                onChange={(e) => setRegistroPassword(e.target.value)}
                ref={passwordRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmarRef.current?.focus();
                }}
                className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirmar contraseña</label>
              <Input
                type="password"
                value={registroConfirmar}
                onChange={(e) => setRegistroConfirmar(e.target.value)}
                ref={confirmarRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") enviarRegistro();
                }}
                className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setOpenModal(false)}
              className="text-gray-300 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={enviarRegistro}
              disabled={registroLoading}
              className="text-white px-4 py-2 font-semibold rounded-md hover:opacity-90"
              style={{ backgroundColor: "#9A3324" }}
            >
              {registroLoading ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
