import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const generateImageName = (num_empleado) => {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-T:.Z]/g, ''); // YYYYMMDDHHMMSS
  return `${formattedDate}_${num_empleado}.jpg`; // Puedes cambiar la extensión si es necesario
};

// Si deseas almacenar el archivo, puedes usar una librería como `multer` o manipularlo manualmente.
export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const image = formData.get('image');
    const title = formData.get('title');
    const desc = formData.get('desc');
    const tag = formData.get('tag');
    const num_empleado = formData.get('num_empleado');

    // Verifica que se haya recibido una imagen
    if (image && image instanceof File) {
      const imageName = generateImageName(num_empleado);
      const imagePath = path.join(process.cwd(), 'public', 'image', 'blogs', imageName);

      // Guarda el archivo en el directorio adecuado
      const buffer = await image.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      console.log('Imagen guardada en:', imagePath);

      const imageUrl = `/image/blogs/${imageName}`; // URL de la imagen
      return NextResponse.json({ message: "Post creado exitosamente", imageUrl }, { status: 200 });
    } else {
      console.error("No se recibió una imagen válida");
      return NextResponse.json({ message: "No se recibió una imagen válida" }, { status: 400 });
    }

    // Aquí puedes hacer lo que necesites con los datos recibidos, como almacenarlos en la base de datos
    console.log("Datos recibidos:", { title, desc, tag, num_empleado });

    return NextResponse.json({ message: "No se recibió ninguna imagen" }, { status: 400 });
  } catch (error) {
    console.error("Error al procesar los datos:", error);
    return NextResponse.json({ message: "Hubo un error al procesar la solicitud" }, { status: 500 });
  }
}
