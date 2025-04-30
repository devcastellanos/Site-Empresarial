import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Obtener las cookies de forma asíncrona
        const cookieStore = await cookies(); // 👈 Agrega `await`
        const myTokenCookie = cookieStore.get('myToken');

        // console.log('[LOG] Token recibido:', myTokenCookie);

        if (!myTokenCookie) {
            return NextResponse.json({ success: false, message: 'Token no encontrado' }, { status: 401 });
        }

        const myToken = myTokenCookie.value;

        const user = verify(myToken, 'secret');
        console.log('[LOG] Usuario verificado:', user);

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('[LOG] Error al verificar token:', error);
        return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
    }
}
