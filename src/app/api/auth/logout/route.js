// app/api/auth/logout/route.js
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serialize } from "cookie";


export async function POST(req) {
    const cookieStore = await cookies(); // 👈 Agrega `await`
    const myTokenCookie = cookieStore.get('myToken');
    if (!myTokenCookie) {
        return NextResponse.json({ success: false, message: 'Token no encontrado' }, { status: 401 });
    }
    
    try
    {
        verify(myTokenCookie.value, 'secret');
        const serialized = serialize('myToken', null, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            sameSite: 'Lax',
            maxAge: 0,
            path: '/',
        });
        const res = NextResponse.json(
            { success: true, message: 'logout succesfully' },
            { status: 200 }
        );
        res.headers.set('Set-Cookie', serialized);
        return res;
    }   
    catch (error){
        console.error('[LOG] Error al verificar token:', error);
        return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
    }
}