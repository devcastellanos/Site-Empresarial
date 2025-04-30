import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function POST(req) {
  const cookieStore = cookies();
  const myTokenCookie = cookieStore.get('myToken');

  if (!myTokenCookie) {
    return NextResponse.json({ success: false, message: 'Token no encontrado' }, { status: 401 });
  }

  try {
    verify(myTokenCookie.value, process.env.JWT_SECRET || 'secret');

    const serialized = serialize('myToken', '', {
      httpOnly: true,
      secure: true, // 👈 obligatorio para SameSite=None
      sameSite: 'None', // 👈 si usaste esto al crearla
      domain: '.grupotarahumara.com.mx', // 👈 igual al dominio de creación
      path: '/',
      maxAge: 0
    });

    const res = NextResponse.json({ success: true, message: 'Logout successfully' }, { status: 200 });
    res.headers.set('Set-Cookie', serialized);
    return res;

  } catch (error) {
    console.error('[LOG] Error al verificar token:', error);
    return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
  }
}
