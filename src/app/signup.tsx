"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Card, Input, Button, Typography } from "@material-tailwind/react";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, ingresa tu email y contraseña.',
      });
      return;
    }
    setIsLoading(true);

    try {
      console.log('Enviando solicitud a /api/auth');
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Respuesta recibida:', response);

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error en la solicitud',
          text: result.message || 'No se pudo completar el inicio de sesión.',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido de nuevo!',
      }).then(() => {
        window.location.href = '/'; // Redirigir al usuario
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al intentar iniciar sesión. Inténtalo nuevamente.',
      });
      console.error('Error al logear usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Sign In
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Bienvenido administrador, por favor ingresa tus datos para continuar
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            type="email"
            placeholder="name@grupotarahumara.com.mx"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          className="mt-6"
          fullWidth
          size="lg"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Sign In'}
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-medium text-gray-900">
            Sign Up
          </a>
        </Typography>
      </form>
    </Card>
  );
}