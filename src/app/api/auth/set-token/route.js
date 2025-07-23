import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { user } = await req.json();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Datos de usuario faltantes' }, { status: 400 });
    }

    const token = jwt.sign(
      {
        id: user.id, // Asegúrate de que el objeto user tenga un campo id
        email: user.email,
        user: user.name,
        num_empleado: user.num_empleado,
        rol: user.rol,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      },
      'secret' // en producción usa process.env.JWT_SECRET
    );

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    const res = NextResponse.json({ success: true, message: 'Token generado y guardado' });
    res.headers.set('Set-Cookie', serialized);

    return res;
  } catch (error) {
    console.error('[ERROR] Al guardar token en cookie:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
