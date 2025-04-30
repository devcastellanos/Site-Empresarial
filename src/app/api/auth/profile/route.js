import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const myTokenCookie = cookies().get('myToken'); // ⬅️ no uses await

    if (!myTokenCookie) {
      return NextResponse.json({ success: false, message: 'Token no encontrado' }, { status: 401 });
    }

    const myToken = myTokenCookie.value;
    const user = verify(myToken, process.env.JWT_SECRET);

    console.log('[LOG] Usuario verificado:', user);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[LOG] Error al verificar token:', error);
    return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
  }
}
