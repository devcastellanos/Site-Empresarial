import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request) {
    try {
      const imageName = request.nextUrl.pathname.split("/").pop(); // <-- Asegúrate de usar el nombre correcto del parámetro dinámico
  
      if (!imageName) {
        return NextResponse.json({ message: "Nombre de imagen no proporcionado" }, { status: 400 });
      }
  
      const imagePath = path.join(process.cwd(), "upload", "fotos", `${imageName}.jpg`);
      console.log("Buscando imagen en:", imagePath);
  
      try {
        await fs.access(imagePath); // Verifica si la imagen existe
      } catch (error) {
        return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 });
      }
      const imageBuffer = await fs.readFile(imagePath);
  
      return new NextResponse(imageBuffer, {
        headers: { "Content-Type": "image/jpeg" },
      });
    } catch (error) {
      console.error("Error al buscar la imagen:", error);
      return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 });
    }
  }