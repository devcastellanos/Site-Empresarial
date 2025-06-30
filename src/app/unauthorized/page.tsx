import React from "react";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-6">
        No tienes permiso para acceder a esta página.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Regresar al inicio
      </Link>
    </div>
  );
}