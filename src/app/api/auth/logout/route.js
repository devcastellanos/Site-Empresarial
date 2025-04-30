import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function POST() {
  const cookieStore = cookies();
  const myTokenCookie = cookieStore.get("myToken");

  if (!myTokenCookie) {
    return NextResponse.json({ success: false, message: "Token no encontrado" }, { status: 401 });
  }

  try {
    verify(myTokenCookie.value, process.env.JWT_SECRET || "secret");

    const isProd = process.env.NODE_ENV === "production";
    const serialized = serialize("myToken", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      domain: isProd ? ".grupotarahumara.com.mx" : undefined,
      path: "/",
      maxAge: 0,
    });

    const res = NextResponse.json({ success: true, message: "Logout exitoso" }, { status: 200 });
    res.headers.set("Set-Cookie", serialized);
    return res;
  } catch (error) {
    console.error("[LOGOUT] Error al verificar token:", error);
    return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 });
  }
}
