import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('[LOGIN] Body recibido:', body);

    const { email, num_empleado, password } = body;
    const userIdentifier = email || num_empleado;

    if (!userIdentifier || !password) {
      return NextResponse.json({ success: false, message: 'Campos faltantes' }, { status: 400 });
    }

    console.log('[LOGIN] Autenticando contra backend...');
    const response = await fetch('https://api-site-cursos.in.grupotarahumara.com.mx/login', {
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
    console.log('[LOGIN] Usuario autenticado:', user);

    // ✅ Asegúrate de que `user.data` exista
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

    console.log('[LOGIN] Token generado:', token);

    const isProd = process.env.NODE_ENV === 'production';
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
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
