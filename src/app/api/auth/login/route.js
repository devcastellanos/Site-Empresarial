import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

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

    const response = await fetch('http://api-site-cursos.172.16.15.30.sslip.io/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, num_empleado, password }),
      credentials: 'include'
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || !result.success) {
      const message = result?.message || 'Credenciales incorrectas';
      console.error(`[LOG] Fallo en autenticación: ${message}`);
      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    const user = result.data;

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 días
      email: user.email,
      user: user.name || user.nombre,
      num_empleado: user.num_empleado,
      rol: user.rol,
    }, process.env.JWT_SECRET);

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None', // necesario para cross-origin en HTTPS
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

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
