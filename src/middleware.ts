import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rutas protegidas por rol
const roleAccess: Record<string, string[]> = {
  admin: [
    '/Cursos', '/Usuarios', '/Perfil', '/PlanEstudio', '/cargaMasiva',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex', '/Movimientos'
  ],
  Gerente: [
    '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex', 
  ],
  Coordinador: [
    '/Perfil', 
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex'
  ],
  'Usuario común': [
     '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex'
  ],
  Nominas:[
    '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex', '/Movimientos'
  ],
  Capacitacion: [
    '/Cursos',  '/Perfil', '/PlanEstudio', '/cargaMasiva',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex'
  ],
  Reclutamiento: [
    '/Usuarios', '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex'
  ],
  Jefe:[
     '/Usuarios', '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex'
  ],
  Subjefe: [
    '/Usuarios', '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex'
  ],
  Direccion: [
    '/Usuarios', '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex',
  ],
  Director: [
     '/Usuarios', '/Perfil',
    '/confirmar-cuenta', '/Convenios', '/HomeCH', '/HomeUT',
    '/kardex',
  ],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('myToken')?.value;
  console.log('Middleware este es el token:', token);

  if (!token) {
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode('secret'));
    console.log('Token verificado exitosamente', payload);

    const userRol = payload.rol as string;
    const pathname = request.nextUrl.pathname;

    const allowedPaths = roleAccess[userRol] || [];
    const isAuthorized = allowedPaths.some((path) => pathname.startsWith(path));

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('/Login', request.url));
  }
}

export const config = {
  matcher: ['/Cursos', '/cargaMasiva', '/Usuarios', '/Perfil', '/PlanEstudio'],
};
