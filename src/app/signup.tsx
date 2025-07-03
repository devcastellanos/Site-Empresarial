"use client";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react"; // si usas lucide-react

import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from './ResetPasswordForm';

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
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmarRef = useRef<HTMLInputElement>(null);

  const [openForgot, setOpenForgot] = useState(false);
const [openReset, setOpenReset] = useState(false);

  // const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, payload);
      const user = res.data.data;

      await axios.post('/api/auth/set-token', { user });

      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success").then(() => {
        window.location.href = "/";
      });

    } catch (error) {

      let response;
      let message = "Error desconocido";

      if (axios.isAxiosError(error)) {
        response = error.response;
        message = response?.data?.message || "Error desconocido";
      }

      setOpenForgot(false);
      setOpenReset(false);
      setOpenModal(false); // si lo usas para registro

      switch (response?.data?.code) {
        case 'NOT_FOUND':
          setOpenModal(false);       // ⬅️ Por si estaba abierto
          setOpenForgot(false);      // ⬅️ Por si estaba abierto
          setOpenReset(false);       // ⬅️ Por si estaba abierto
          Swal.fire("No encontrado", message, "error");
          break;

        case 'ACCOUNT_NOT_CONFIRMED':
          setOpenModal(false);
          setOpenForgot(false);
          setOpenReset(false);
          Swal.fire(
            "Cuenta no confirmada",
            `${message}<br>Por favor revisa tu correo electrónico para confirmar tu cuenta.`,
            "warning"
          );
          break;

        case 'INACTIVE_EXTERNAL':
          setOpenModal(false);
          setOpenForgot(false);
          setOpenReset(false);
          Swal.fire("Usuario dado de baja", message, "warning");
          break;

        case 'INVALID_PASSWORD':
          setOpenModal(false);
          setOpenForgot(false);
          setOpenReset(false);
          Swal.fire("Contraseña incorrecta", message, "error");
          break;

        default:
          setOpenModal(false);
          setOpenForgot(false);
          setOpenReset(false);
          Swal.fire("Error", message, "error");
          break;
      }
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
      setOpenModal(false); // Cierra el modal antes de mostrar el Swal
      await Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
      return;
    }

    if (registroPassword !== registroConfirmar) {
      setOpenModal(false); // Cierra el modal antes de mostrar el Swal
      await Swal.fire("Contraseñas no coinciden", "Verifica los campos de contraseña", "warning");
      return;
    }


    setRegistroLoading(true);

    try {
      const check = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validarEmpleado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_empleado: registroEmpleado }),
      });

      const checkData = await check.json();

      if (!checkData.success) {
        Swal.fire({
          icon: "error",
          title: "Empleado inválido",
          html: `
            <p>Ese número no existe en el sistema.</p>
            <p>No uses <strong>ceros a la izquierda</strong> de tu número de empleado.</p>
            <p><em><strong>Ejemplo:</em></strong> si en otras plataformas usas <strong><code>0135</code></strong>, aquí solo debes ingresar <strong><code>135</code></strong>.</p>
          `
        });
        return;
      }

      if (checkData.usuarioRegistrado) {
        Swal.fire("Ya registrado", "Este empleado ya tiene una cuenta", "info");
        return;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agregarUsuario`, {
        num_empleado: registroEmpleado,
        password: registroPassword,
      });

      Swal.fire("Registro exitoso", "Revisa tu correo para confirmar tu cuenta", "success");
      setOpenModal(false);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.response?.data?.error || "Error desconocido";

        setOpenModal(false); // 👈 Cierra el modal ANTES del Swal
        await Swal.fire("Error", message, "error");
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
        <Card className="rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 p-10 shadow-2xl text-white max-w-md w-full mx-auto animate-in fade-in zoom-in-90">
          {/* Logo */}
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

          {/* Título */}
          <h3 className="text-center font-extrabold text-3xl mb-2 tracking-tight">Bienvenido</h3>
          <p className="text-center text-gray-300 text-sm mb-6">
            Inicia sesión con tu correo o número de empleado
          </p>

          {/* Formulario */}
          <div className="space-y-5">
            {/* Email / Número */}
            <div className="space-y-1">
              <label htmlFor="login-email" className="text-sm font-medium text-white/90">
                Correo o número de empleado
              </label>
              <Input
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") passwordRef.current?.focus();
                }}
                className="bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#9A3324] focus:outline-none"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label htmlFor="login-password" className="text-sm font-medium text-white/90">
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
                className="bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#9A3324] focus:outline-none"
                ref={passwordRef}
              />

              {/* 🔐 Link de recuperación */}
              <div className="text-right pt-1">
                <button
                onClick={() => setOpenForgot(true)}
                className="text-xs text-white/80 underline hover:text-red-400 transition"
              >
                ¿Olvidaste tu contraseña o todavía no la tienes?
              </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleLogin}
                disabled={isLoading || email.trim() === "" || password.trim() === ""}
                className="w-full text-white font-semibold py-2 rounded-md transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "#9A3324" }}
              >
                {isLoading ? "Cargando..." : "INICIAR SESIÓN"}
              </Button>
            </div>

           
            {/* <p className="text-center text-sm text-gray-300 pt-2">
              ¿No tienes cuenta?{" "}
              <button
                onClick={openRegistroModal}
                className="text-white underline hover:text-red-400 transition"
              >
                Regístrate aquí
              </button>
            </p> */}
          </div>
        </Card>

      </motion.div>

      {/* REGISTRO */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-black/70 backdrop-blur-2xl border border-white/10 text-white shadow-2xl rounded-2xl px-6 py-8 animate-in fade-in zoom-in-90">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/image/logowhite.png"
              alt="Logo Grupo Tarahumara"
              width={260}
              height={80}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Título */}
          <DialogTitle className="text-2xl font-extrabold text-center mb-6 tracking-tight">
            Crear Nueva Cuenta
          </DialogTitle>

          {/* Inputs */}
          <div className="space-y-5">
            {/* Número de empleado */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/90">Número de empleado</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={registroEmpleado}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setRegistroEmpleado(val);
                }}
                onKeyDown={(e) => {
                  // Prevenir caracteres no numéricos (como e, +, -)
                  if (
                    ["e", "E", "+", "-", ".", ","].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                  if (e.key === "Enter") passwordRef.current?.focus();
                }}
                className="bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#9A3324] focus:outline-none"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-white/90">Contraseña</label>
              <Input
                type={verPassword ? "text" : "password"}
                value={registroPassword}
                onChange={(e) => setRegistroPassword(e.target.value)}
                ref={passwordRef}
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
              <label className="text-sm font-medium text-white/90">Confirmar contraseña</label>
              <Input
                type={verConfirmar ? "text" : "password"}
                value={registroConfirmar}
                onChange={(e) => setRegistroConfirmar(e.target.value)}
                ref={confirmarRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") enviarRegistro();
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
          </div>

          {/* Botones */}
          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setOpenModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              onClick={enviarRegistro}
              disabled={registroLoading}
              className="text-white px-5 py-2 font-semibold rounded-md transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: "#9A3324" }}
            >
              {registroLoading ? "Registrando..." : "Registrar"}
            </Button>
          </div>

        </DialogContent>
      </Dialog>

{/* Recuperar contraseña */}
<Dialog open={openForgot} onOpenChange={setOpenForgot}>
  <DialogContent className="bg-black/70 backdrop-blur-2xl border border-white/10 text-white shadow-2xl rounded-2xl px-6 py-8 animate-in fade-in zoom-in-90">
    <ForgotPasswordForm onClose={() => setOpenForgot(false)} />
  </DialogContent>
</Dialog>

{/* Restablecer contraseña */}
<Dialog open={openReset} onOpenChange={setOpenReset}>
  <DialogContent className="bg-black/70 backdrop-blur-2xl border border-white/10 text-white shadow-2xl rounded-2xl px-6 py-8 animate-in fade-in zoom-in-90">
    <ResetPasswordForm onClose={() => setOpenReset(false)} />
  </DialogContent>
</Dialog>

    </div>
  );
}
