import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    const cookieStore = cookies();
    const myTokenCookie = cookieStore.get('myToken');

    if (!myTokenCookie) {
      return NextResponse.json(
        { success: false, message: 'Token no encontrado' },
        { status: 401 }
      );
    }

    // Validar el token antes de borrarlo
    verify(myTokenCookie.value, process.env.JWT_SECRET);

    // Serializar cookie con maxAge 0 para eliminarla
    const serialized = serialize('myToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 0,
      path: '/',
    });

    const res = NextResponse.json(
      { success: true, message: 'Sesión cerrada correctamente.' },
      { status: 200 }
    );
    res.headers.set('Set-Cookie', serialized);
    return res;
  } catch (error) {
    console.error('[LOG] Error al cerrar sesión:', error);
    return NextResponse.json(
      { success: false, message: 'Token inválido o error interno.' },
      { status: 401 }
    );
  }
}
