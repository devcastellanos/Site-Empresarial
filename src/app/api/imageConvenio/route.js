import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const generateImageName = () => {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-T:.Z]/g, '');
  return `${formattedDate}.jpg`;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    console.log("Datos recibidos:", formData);
    
    const image = formData.get('image');

    if (!image) {
      console.error("No se recibieron imágenes válidas");
      return NextResponse.json({ message: "No se recibieron imágenes" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const imageUrls = [];

    if (image) {
      const imageName = generateImageName();
      const imagePath = path.join(uploadDir, imageName);

      const buffer = await image.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      console.log("Imagen guardada en:", imagePath);

      imageUrls.push(imageName); //  Guardamos todas las URLs
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