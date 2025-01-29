import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const generateImageName = (num_empleado) => {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-T:.Z]/g, '');
  return `${formattedDate}_${num_empleado}.jpg`;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const image = formData.get('image');
    const num_empleado = formData.get('num_empleado');

    if (image) {
      const imageName = generateImageName(num_empleado);
      const uploadDir = path.join(process.cwd(), 'uploads'); // Guardamos en `/uploads`, NO en `public`
      const imagePath = path.join(uploadDir, imageName);

      // 📁 Asegurarse de que el directorio `uploads` existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Guarda el archivo
      const buffer = await image.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      console.log('Imagen guardada en:', imagePath);

      const imageUrl = `${imageName}`; // Nueva URL
      return NextResponse.json({ message: "Post creado exitosamente", imageUrl }, { status: 200 });
    } else {
      console.error("No se recibió una imagen válida");
      return NextResponse.json({ message: "No se recibió una imagen válida" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error al procesar los datos:", error);
    return NextResponse.json({ message: "Hubo un error al procesar la solicitud" }, { status: 500 });
  }
}