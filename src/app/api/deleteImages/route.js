// app/api/deleteImages/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { images } = await req.json(); // Obtener las imágenes a eliminar

    if (!images || !Array.isArray(images)) {
      return NextResponse.json({ message: "No se recibieron imágenes válidas" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');

    // Eliminar cada imagen
    images.forEach((image) => {
      const imagePath = path.join(uploadDir, image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Eliminar el archivo
        console.log(`Imagen eliminada: ${imagePath}`);
      } else {
        console.log(`Imagen no encontrada: ${imagePath}`);
      }
    });

    return NextResponse.json({ message: "Imágenes eliminadas correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar imágenes:", error);
    return NextResponse.json({ message: "Hubo un error al eliminar las imágenes" }, { status: 500 });
  }
}