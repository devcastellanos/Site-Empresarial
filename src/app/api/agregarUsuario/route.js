import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3041";

    const response = await fetch(`${backendUrl}/agregarUsuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("❌ Error en la API route agregarUsuario:", err);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
