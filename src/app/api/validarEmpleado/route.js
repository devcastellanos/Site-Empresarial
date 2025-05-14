import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { num_empleado } = await req.json();
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3041';

    const res = await fetch(`${backendUrl}/api/validarEmpleado`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num_empleado }),
    });

    const rawText = await res.text();
    if (rawText.startsWith('<!DOCTYPE html')) {
      return NextResponse.json(
        { success: false, message: 'El backend no respondió correctamente (HTML)' },
        { status: 500 }
      );
    }

    const data = JSON.parse(rawText);

    return res.ok
      ? NextResponse.json(data)
      : NextResponse.json({ success: false, message: data.message }, { status: res.status });
  } catch (error) {
    console.error('❌ Error en validarEmpleado route:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
