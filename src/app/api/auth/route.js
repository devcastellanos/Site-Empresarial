import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('[LOG] Iniciando autenticación...');

  try {
    // Leer el cuerpo de la solicitud
    const { email, password } = await req.json();

    // Validación de campos
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresa tu email y contraseña.' },
        { status: 400 }
      );
    }

    console.log(`[LOG] Iniciando autenticación para el usuario: ${email}`);

    // Llamada a la API externa para validar credenciales
    const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LOG] Error en la autenticación: ${errorText}`);
      return NextResponse.json(
        { success: false, message: errorText || 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    const user = await response.json();
    console.log(`[LOG] Usuario autenticado: ${user.email}`);

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Configurar la cookie segura
    const nextResponse = NextResponse.json(
      { success: true, message: 'Login exitoso', user },
      { status: 200 }
    );
    nextResponse.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('[LOG] Error en el servidor:', error);
    return NextResponse.json(
      { success: false, message: 'Hubo un error al procesar tu solicitud.' },
      { status: 500 }
    );
  }
}