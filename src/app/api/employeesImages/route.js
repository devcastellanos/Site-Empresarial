import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("file") ;
    let num_empleado = formData.get("id") ;

    // Validar num_empleado
    if (!num_empleado || isNaN(Number(num_empleado))) {
      return NextResponse.json(
        { message: "ID de empleado inválido" },
        { status: 400 }
      );
    }

    // Asegurar formato de 4 dígitos
    num_empleado = num_empleado.padStart(4, "0");

    if (!image) {
      return NextResponse.json(
        { message: "No se recibió ninguna imagen" },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), "public", "fotos");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Generar nombre único
    const imageName = `${num_empleado}.jpg`;
    const imagePath = path.join(uploadDir, imageName);

    // Guardar imagen
    const buffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);

    console.log("Imagen guardada en:", imagePath);

    return NextResponse.json(
      { message: "Imagen guardada correctamente", imageUrl: `/fotos/${imageName}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return NextResponse.json(
      { message: "Hubo un error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
