import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Mapeo de rutas protegidas por rol
const roleAccess: Record<string, string[]> = {
  admin: ['/Cursos', '/Usuarios', '/Perfil', '/PlanEstudio', '/cargaMasiva'],
  docente: ['/Cursos', '/Perfil'],
  alumno: ['/PlanEstudio', '/Perfil'],
  Gerente: ['/Cursos', '/Usuarios', '/Perfil', '/PlanEstudio'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('myToken')?.value;
  console.log('Middleware este es el token:', token);

  if (!token) {
    return NextResponse.redirect(new URL('Login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode('secret'));
    console.log('Token verificado exitosamente', payload);

    const userRol = payload.rol as string;
    const pathname = request.nextUrl.pathname;

    // Verificar si el rol tiene acceso a la ruta
    const allowedPaths = roleAccess[userRol] || [];
    const isAuthorized = allowedPaths.some((path) => pathname.startsWith(path));

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('Login', request.url));
  }
}

export const config = {
  matcher: ['/Cursos', '/cargaMasiva', '/Usuarios', '/Perfil', '/PlanEstudio'],
};
