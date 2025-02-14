import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  

  // Obtener el token de las cookies
  const token = request.cookies.get('myToken')?.value;
  console.log('Middleware este es el token:', token);

  // Si no hay token, redirige al usuario a la página de login
  if (!token) {
    return NextResponse.redirect(new URL('Login', request.url));
  }

  try {
    // Verificar el token con la secret key
    const { payload } = await jwtVerify(token, new TextEncoder().encode('secret'));

    // Si el token es válido, permitir que la solicitud continúe
    console.log('Token verificado exitosamente', payload);
    return NextResponse.next();
  } catch (error) {
    // Si el token no es válido, redirige al login
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('Login', request.url));
  }
}

// Esto aplica el middleware solo a las rutas que necesitas
export const config = {
  matcher: ['/Cursos', '/cargaMasiva', '/Usuarios'], // Aplica el middleware solo a estas rutas
};
