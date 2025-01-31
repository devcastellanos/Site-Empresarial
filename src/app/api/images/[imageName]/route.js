import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req, { params }) {

  const imageName = params?.imageName;

  if (!imageName) {
    return NextResponse.json({ message: "Nombre de imagen no proporcionado" }, { status: 400 });
  }

  const imagePath = path.join(process.cwd(), 'uploads', imageName);
  console.log("Buscando imagen en:", imagePath);

  try {
    // Verificar si la imagen existe antes de intentar leerla
    await fs.access(imagePath);

    const imageBuffer = await fs.readFile(imagePath);
    const ext = path.extname(imageName).toLowerCase();

    // Mapear extensiones a tipos MIME
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(imageBuffer, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 });
  }
}