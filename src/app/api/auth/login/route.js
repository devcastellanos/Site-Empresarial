import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    const { email, num_empleado, password } = await req.json();
    const userIdentifier = email || num_empleado;

    if (!userIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresa tu correo o número de empleado y contraseña.' },
        { status: 400 }
      );
    }

    // Llamada al backend real
    const response = await fetch('https://api-site-cursos.in.grupotarahumara.com.mx/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, num_empleado, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, message: errorText || 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    const user = await response.json();

    // Firmar JWT
    const token = jwt.sign(
      {
        email: user.data.email,
        user: user.data.name,
        num_empleado: user.data.num_empleado,
        rol: user.data.rol,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    // Configurar cookie
    const isProd = process.env.NODE_ENV === 'production';
    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      domain: isProd ? '.grupotarahumara.com.mx' : undefined,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    const res = NextResponse.json({ success: true, message: 'Inicio de sesión exitoso' }, { status: 200 });
    res.headers.set('Set-Cookie', serialized);
    return res;

  } catch (err) {
    console.error('[LOGIN] Error inesperado:', err);
    return NextResponse.json(
      { success: false, message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
