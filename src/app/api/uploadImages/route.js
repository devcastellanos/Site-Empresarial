import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const generateImageName = (num_empleado, index) => {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-T:.Z]/g, '');
  return `${formattedDate}_${num_empleado}_${index}.jpg`;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const images = formData.getAll('images');
    const num_empleado = formData.get('num_empleado');

    if (!images.length) {
      console.error("No se recibieron imágenes válidas");
      return NextResponse.json({ message: "No se recibieron imágenes" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image) continue;

      const imageName = generateImageName(num_empleado, i);
      const imagePath = path.join(uploadDir, imageName);

      const buffer = await image.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      console.log("Imagen guardada en:", imagePath);

      imageUrls.push(imageName); // 👈 Guardamos todas las URLs
    }

    return NextResponse.json(
      { message: "Imágenes guardadas correctamente", imageUrls },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al procesar los datos:", error);
    return NextResponse.json({ message: "Hubo un error al procesar la solicitud" }, { status: 500 });
  }
}