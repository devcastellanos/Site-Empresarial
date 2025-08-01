"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "@/lib/interfaces";
import { useAuth } from "@/app/context/AuthContext";

function PatronCard() {
  const cartaRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [empleado, setEmpleado] = useState<User | null>(null);
  const { user } = useAuth();
  const [ubicacion, setUbicacion] = useState("default"); // clave válida

  const direcciones: Record<string, string> = {
    BodegaVictoria: "Calle 4 #447 y 449, Comercial Abastos, 44530 Guadalajara, Jal., México",
    BodegaCentral: "Calle 4 #430, Comercial Abastos, 44530 Guadalajara, Jal., México",
    BodegaTarahumara: "Calle 4 #419, Comercial Abastos, 44530 Guadalajara, Jal., México",
    BodegaAdministracion: "Calle 4 #2568, Comercial Abastos, 44530 Guadalajara, Jal., México",
    BodegaVictoriaOutlet: "Calle 5, Comercial Abastos, 44530 Guadalajara, Jal., México",
    BodegaLechuga: "Calle 10 #2620, Comercial Abastos, 44530 Guadalajara, Jal., México",
    CedisPremier: "Calle Elote #2627, Calle 09, Comercial Abastos, 44530 Guadalajara, Jal., México",
    BodegaQCDMX: "Calle Q #153, Central de Abasto CDMX, C.P. 09040",
    BodegaRCDMX: "Calle R #164, Central de Abasto CDMX, C.P. 09040",
    CEDISMexicali: "Carretera a San Luis #33, Mexicali, Baja California, C.P. 21397",
  };

  const localidades: Record<string, string> = {
    BodegaVictoria: "Bodega Victoria (Guadalajara)",
    BodegaCentral: "Bodega Central (Guadalajara)",
    BodegaTarahumara: "Bodega Tarahumara (Guadalajara)",
    BodegaAdministracion: "Bodega Administración (Guadalajara)",
    BodegaVictoriaOutlet: "Bodega Victoria Outlet (Guadalajara)",
    BodegaLechuga: "Bodega Lechuga (Guadalajara)",
    CedisPremier: "Cedis Premier (Guadalajara)",
    BodegaQCDMX: "Bodega Q (CDMX)",
    BodegaRCDMX: "Bodega R (CDMX)",
    CEDISMexicali: "CEDIS Mexicali",
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/all`
      );
      const data = await response.json();
      const mappedUsers = data.map((user: any) => ({
        ...user,
        Personal: Number(user.Personal),
      }));
      setUsers(mappedUsers);

      const dataUser = mappedUsers.find(
        (u: User) => u.Personal === user?.num_empleado
      );
      setEmpleado(dataUser || null);

      console.log(
        dataUser ? "Usuario encontrado:" : "Usuario no encontrado",
        dataUser
      );
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }, [user?.num_empleado]);


  useEffect(() => {
    if (user && users.length === 0) {
      fetchUsers();
    }
  }, [user, users.length, fetchUsers]);

  const generarPDF = () => {
    if (ubicacion === "default") {
      alert("Por favor selecciona una ubicación antes de generar el PDF.");
      return;
    }

    if (cartaRef.current) {
      const html2pdf = require("html2pdf.js");

      // Clonamos el nodo y quitamos clases visuales que no deben verse en PDF
      const cartaClone = cartaRef.current.cloneNode(true) as HTMLElement;
      cartaClone.classList.remove("border", "border-gray-300", "rounded-md");

      // Generamos un contenedor temporal
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.appendChild(cartaClone);
      document.body.appendChild(tempContainer);

      const opt = {
        margin: 0.5,
        filename: "Carta_Patronal.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(cartaClone)
        .save()
        .then(() => {
          document.body.removeChild(tempContainer);
        });
    }
  };


  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      {/* Selector de ubicación */}
      <div className="flex items-center gap-2">
        <label htmlFor="ubicacion" className="text-sm font-medium text-gray-700">
          Ubicación:
        </label>
        <select
          id="ubicacion"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="default" disabled hidden>
            Selecciona una ubicación
          </option>
          {Object.entries(localidades).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Constancia Laboral</h2>
        <Button onClick={generarPDF}>Generar PDF</Button>
      </div>

      {/* Contenido exportable */}
      <div
        ref={cartaRef}
        className="p-8 bg-white text-base text-black leading-relaxed space-y-4 border border-gray-300 rounded-md print:border-none"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/image/logo.png"
            alt="Logo empresa"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        {/* {ubicacion !== "default" && (
    <p className="text-right font-medium uppercase">
      México, {localidades[ubicacion]} a 13 de marzo de 2025.
    </p>
  )} */}

        <p className="font-semibold uppercase">A quien corresponda:</p>
        <p className="uppercase">Presente:</p>

        <p>
          Por medio del presente hago constar que{" "}
          <span className="font-semibold">
            {empleado?.Nombre} {empleado?.ApellidoPaterno} {empleado?.ApellidoMaterno}
          </span>
          , con número de colaborador{" "}
          <span className="font-semibold">{empleado?.Personal}</span>, contando con NSS{" "}
          <span className="font-semibold">{empleado?.NSS}</span>, RFC{" "}
          <span className="font-semibold">{empleado?.RFC}</span>, quien labora en la empresa denominada{" "}
          <span className="font-semibold">
            COMERCIALIZADORA DE FRUTAS FINAS TARAHUMARA
          </span>, con RPU{" "}
          <span className="font-semibold">r12-34-183-10-8</span>, ubicada en{" "}
          {ubicacion !== "default" ? (
            <>
              <span className="font-semibold">{direcciones[ubicacion]}</span>, con domicilio fiscal en{" "}
              <span className="font-semibold">
                Calle 4, #419 y #421, Comercial Abastos, 44530, Guadalajara, Jal.
              </span>
            </>
          ) : (
            <span className="font-semibold">________________________</span>
          )}
          , se desempeña en el puesto de{" "}
          <span className="font-semibold">{empleado?.Puesto}</span> desde el{" "}
          <span className="font-semibold">{empleado?.FechaAlta || empleado?.FechaAntiguedad}</span>.
        </p>
        <p>
          Se extiende la presente constancia laboral a solicitud del interesado
          y para los fines legales que al mismo convengan.
        </p>

        <p className="mt-8 font-semibold tracking-widest text-center">A T E N T A M E N T E :</p>
        <br />
        <br />
        {/* 🖋️ Espacio para firma */}
        <div className="mt-12 mb-4 flex flex-col items-center space-y-1">
          <Image
            src="/image/firmaLiliana.png"
            alt="Firma del Coordinador"
            width={96}
            height={40}
            className="mb-2"
          />
          <div className="w-64 border-t border-black" />
          <p className="text-sm text-center">Firma del Coordinador</p>
        </div>

        {/* Datos del firmante */}
        <div className="mt-4 space-y-1 text-center">
          <p className="font-bold">LILIANA ESMERALDA ARANA CALDERON</p>
          <p className="text-sm font-medium">COORDINADOR RELACIONES LABORALES</p>
          <p className="text-sm">liliana.arana@grupotarahumara.com.mx</p>
          <p className="text-sm">Cel. +52 33-2637-7507</p>
        </div>
      </div>

    </div>
  );
}

export default PatronCard;
