
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import {serialize} from 'cookie';

export async function POST(req) {

    try {
        // Leer el cuerpo de la solicitud
        const { email, password } = await req.json();
        console.log(`[LOG] Intento de inicio de sesión: ${email}`);
        // Validación de campos
        if (!email || !password) {
          return NextResponse.json(
            { success: false, message: 'Por favor, ingresa tu email y contraseña.' },
            { status: 400 }
          );
        }

        const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[LOG] Error en la autenticación: ${errorText}`);
          return NextResponse.json(
            { success: false, message: errorText || 'Credenciales incorrectas.' },
            { status: 401 }
          );
        }
        const user = await response.json();
        console.log(`[LOG] Usuario autenticado: ${user.data.name}`);
        console.log('[LOG] Respuesta completa de login:', user);

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60*60*24*30,
            email: email,
            user: user.data.name,
        },'secret')

        const serialized = serialize('myToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 1000*60*60*24*30,
            path: '/',
        });

        console.log(`[LOG] Cookie generada: ${serialized}`);
        const res = NextResponse.json(
            { success: true, message: 'Inicio de sesión exitoso.' },
            { status: 200 }
          );
          res.headers.set('Set-Cookie', serialized);
      
          return res;

      } catch (error) {
        console.error('[LOG] Error en el servidor:', error);
        return NextResponse.json(
          { success: false, message: 'Hubo un error al procesar tu solicitud.' },
          { status: 500 }
        );
      }
}