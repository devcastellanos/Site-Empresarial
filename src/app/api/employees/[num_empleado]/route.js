import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const imageName = request.url.split("/").pop();

    if (!imageName) {
      return NextResponse.json({ message: "Nombre de imagen no proporcionado" }, { status: 400 });
    }

    const externalUrl = `http://api-img.172.16.15.30.sslip.io/uploads/${imageName}`;

    const externalResponse = await fetch(externalUrl);

    if (!externalResponse.ok) {
      return NextResponse.json({ message: "Imagen no encontrada en servidor externo" }, { status: 404 });
    }

    const imageBuffer = await externalResponse.arrayBuffer();

    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000", // cache si deseas
      },
    });
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    return NextResponse.json({ message: "Error interno al obtener la imagen" }, { status: 500 });
  }
}
