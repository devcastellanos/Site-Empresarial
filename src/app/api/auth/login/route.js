import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    const { email, num_empleado, password } = await req.json();
    const userIdentifier = email || num_empleado;
    console.log('[LOG] Intento de login con:', { email, num_empleado });

    if (!userIdentifier || !password) {
      console.warn('[WARN] Falta usuario o contraseña');
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresa tu correo o número de empleado y contraseña.' },
        { status: 400 }
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
    console.log('[LOG] Llamando a backend Express en:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, num_empleado, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Fallo en respuesta del backend:', errorText);
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas o backend falló.' },
        { status: 401 }
      );
    }

    const user = await response.json();
    console.log('[LOG] Respuesta exitosa del backend:', user);

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      email: user.data.email,
      user: user.data.name,
      num_empleado: user.data.num_empleado,
      rol: user.data.rol,
    }, 'secret');

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: true, // Cambiado a true para producción con HTTPS
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    const res = NextResponse.json(
      { success: true, message: 'Inicio de sesión exitoso.' },
      { status: 200 }
    );
    res.headers.set('Set-Cookie', serialized);

    console.log('[LOG] Token generado y cookie enviada.');
    return res;

  } catch (error) {
    console.error('[ERROR] Excepción en /api/auth/login:', error.message);
    console.error('[DEBUG] Stack trace:', error.stack);
    return NextResponse.json(
      { success: false, message: 'Error interno en el servidor. Revisa los logs.' },
      { status: 500 }
    );
  }
}
