import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, num_empleado, password } = body;
    const userIdentifier = email || num_empleado;

    console.log('[LOG] Payload recibido:', body);
    console.log('[LOG] Intento de login con:', { email, num_empleado });

    if (!userIdentifier || !password) {
      console.warn('[WARN] Faltan datos obligatorios');
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresa tu correo o número de empleado y contraseña.' },
        { status: 400 }
      );
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiUrl = `${apiBase}/login`;

    console.log('[LOG] URL destino del backend:', apiUrl);
    if (!apiBase) console.warn('[WARN] Variable NEXT_PUBLIC_API_BASE_URL no definida');

    const startTime = Date.now();
    console.log('[LOG] Enviando request al backend Express...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, num_empleado, password }),
    });

    const duration = Date.now() - startTime;
    console.log(`[LOG] Tiempo de respuesta del backend: ${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Backend respondió con error:', errorText);
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas o backend falló.' },
        { status: 401 }
      );
    }

    const user = await response.json();
    console.log('[LOG] Respuesta exitosa del backend:', user);

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      puesto: user.data.puesto,
      email: user.data.email,
      user: user.data.name,
      num_empleado: user.data.num_empleado,
      rol: user.data.rol,
    }, 'secret');

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: true,
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
    if (error.cause) console.error('[DEBUG] Causa:', error.cause);
    if (error.code) console.error('[DEBUG] Código:', error.code);
    console.error('[DEBUG] Stack trace:', error.stack);

    return NextResponse.json(
      { success: false, message: 'Error interno en el servidor. Revisa los logs.' },
      { status: 500 }
    );
  }
}
