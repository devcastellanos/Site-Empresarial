import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const myTokenCookie = cookieStore.get('myToken');

    if (!myTokenCookie) {
      return NextResponse.json({ success: false, message: 'Token no encontrado' }, { status: 401 });
    }

    const myToken = myTokenCookie.value;

    const user = verify(myToken, process.env.JWT_SECRET || 'secret');
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[AUTH PROFILE] Error al verificar token:', error);
    return NextResponse.json({ success: false, message: 'Token inválido o expirado' }, { status: 401 });
  }
}
