"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useAuth }  from '../app/hooks/useAuth';

export function Login() {
  const { isAuthenticated, login,  logout} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getProfile = async () => {
    const response = await axios.get('/api/auth/profile', { withCredentials: true });
    console.log(response);
    console.log(response.data.user.email);
  }

  const handleSubmit = async () => {
    console.log(email, password);
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    console.log(response);
    
  };

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
      const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      login();
      console.log('Respuesta recibida:', response);

      if (response.status !== 200) {
        Swal.fire({
          icon: 'error',
          title: 'Error en la solicitud',
          text: response.data.message || 'No se pudo completar el inicio de sesión.',
        });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido de nuevo!',
      }).then(() => {
        router.push('/');
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
    <Card color="transparent" shadow={false} placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
      <Typography variant="h4" color="blue-gray" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        Sign In
      </Typography>
      <Typography color="gray" className="mt-1 font-normal"  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        Bienvenido administrador, por favor ingresa tus datos para continuar
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3"  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            Your Email
          </Typography>
          <Input
          crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
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
          <Typography variant="h6" color="blue-gray" className="-mb-3"  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            Password
          </Typography>
          <Input
          crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
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
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          className="mt-6"
          fullWidth
          size="lg"
          onClick={handleLogin}
          // onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Sign In'}
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal"  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          Don&apos;t have an account?{" "}
          <a href="#" className="font-medium text-gray-900">
            Sign Up
          </a>
        </Typography>
      </form>
    </Card>
  );
}

