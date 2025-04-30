import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    const { email, num_empleado, password } = await req.json();
    const userIdentifier = email || num_empleado;

    if (!userIdentifier || !password) {
      return NextResponse.json({ success: false, message: 'Campos faltantes' }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === 'production';
    const BACKEND_URL = isProd
      ? 'https://api-site-cursos.in.grupotarahumara.com.mx'
      : 'http://localhost:3011'; // cambia esto si usas otro puerto en local

    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, num_empleado, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LOGIN] Backend rechazó:', errorText);
      return NextResponse.json({ success: false, message: errorText }, { status: 401 });
    }

    const user = await response.json();

    if (!user.data?.email || !user.data?.name || !user.data?.num_empleado) {
      console.error('[LOGIN] Respuesta malformada del backend:', user);
      return NextResponse.json({ success: false, message: 'Respuesta del backend inválida' }, { status: 500 });
    }

    const token = jwt.sign({
      email: user.data.email,
      user: user.data.name,
      num_empleado: user.data.num_empleado,
      rol: user.data.rol,
    }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      domain: isProd ? '.grupotarahumara.com.mx' : undefined,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    const res = NextResponse.json({ success: true, message: 'Login exitoso' }, { status: 200 });
    res.headers.set('Set-Cookie', serialized);
    return res;

  } catch (err) {
    console.error('[LOGIN] Error interno:', err);
    return NextResponse.json({ success: false, message: 'Error interno del servidor o conexión al backend' }, { status: 500 });
  }
}
