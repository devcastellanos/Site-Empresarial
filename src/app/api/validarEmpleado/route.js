import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { num_empleado } = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

    // ✅ Si ya está registrado, bloqueamos aquí mismo
    if (data.usuarioRegistrado) {
      return NextResponse.json(
        { success: false, message: 'Este número de empleado ya tiene una cuenta registrada.', usuarioRegistrado: true },
        { status: 409 }
      );
    }

    // ✅ Si no está registrado, permitimos continuar
    return res.ok
      ? NextResponse.json(data)
      : NextResponse.json({ success: false, message: data.message }, { status: res.status });

  } catch (error) {
    console.error('❌ Error en validarEmpleado route:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
