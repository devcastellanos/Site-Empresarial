import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import {serialize} from 'cookie';

export async function POST(req) {
  try {
    const { email, num_empleado, password } = await req.json();
    const userIdentifier = email || num_empleado;
    console.log(`[LOG] Intento de inicio de sesión: ${userIdentifier}`);

    if (!userIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresa tu correo o número de empleado y contraseña.' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api-site-cursos.in.grupotarahumara.com.mx/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, num_empleado, password }),
      credentials: 'include'
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
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      email: user.data.email,
      user: user.data.name,
      num_empleado: user.data.num_empleado,
      rol: user.data.rol,
    }, 'secret');

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None', // 👈 Para cross-site cookies
      domain: '.grupotarahumara.com.mx', // 👈 Disponible en todos los subdominios
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });    

    const res = NextResponse.json({ success: true, message: 'Inicio de sesión exitoso.' }, { status: 200 });
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