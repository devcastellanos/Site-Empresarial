import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  const { imageName } = params;
  const imagePath = path.join(process.cwd(), 'uploads', imageName);

  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    return new NextResponse(imageBuffer, {
      headers: { 'Content-Type': 'image/jpeg' }
    });
  } else {
    return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 });
  }
}