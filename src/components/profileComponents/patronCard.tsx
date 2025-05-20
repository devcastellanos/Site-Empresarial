"use client";

import { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "@/lib/interfaces";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";


function PatronCard() {
  const cartaRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [empleado, setEmpleado] = useState<User | null>(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_INTELISIS}/api/users/all`
      );
      const data = await response.json();
      const mappedUsers = data.map((user: any) => ({
        ...user,
        Personal: Number(user.Personal),
      }));
      setUsers(mappedUsers);
      // Buscar usuario directamente después de obtener los datos
      const dataUser = mappedUsers.find((u: User) => u.Personal === user?.num_empleado);
      setEmpleado(dataUser || null);

      if (dataUser) {
        console.log("Usuario encontrado:", dataUser);
      } else {
        console.log("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.rol === "admin") {
        await fetchUsers(); // Solo admin puede ver otras personas
      }
    };

    fetchData();
  }, []);

  const generarPDF = () => {
    if (cartaRef.current) {
      const html2pdf = require("html2pdf.js");
      const opt = {
        margin: 0.5,
        filename: "Carta_Patronal.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(cartaRef.current).save();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Carta Patronal</h2>
        <Button onClick={generarPDF}>Generar PDF</Button>
      </div>

      {/* 📄 Contenido exportable */}
      <div
        ref={cartaRef}
        className="p-8 bg-white text-base text-black leading-relaxed space-y-4 border border-gray-300 rounded-md"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image
            src="/image/logo.png"
            alt="Logo empresa"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        <p className="text-right font-medium uppercase">
          México, Iztapalapa a 13 de marzo de 2025.
        </p>

        <p className="font-semibold uppercase">A quien corresponda:</p>
        <p className="uppercase">Presente:</p>

        <p>
          Por medio del presente hago constar que la C.{" "}
          <span className="font-semibold">
            {empleado?.Nombre} {empleado?.ApellidoPaterno} {empleado?.ApellidoMaterno}
          </span>
          , con número de colaborador{" "}
          <span className="font-semibold">{empleado?.Personal }</span>, contando con NSS{" "}
          <span className="font-semibold">{empleado?.NSS}</span>, RFC{" "}
          <span className="font-semibold">{empleado?.RFC}</span>, quien labora en la empresa denominada{" "}
          <span className="font-semibold">
            COMERCIALIZADORA DE FRUTAS FINAS TARAHUMARA
          </span>, con RPU{" "}
          <span className="font-semibold">r12-34-183-10-8</span>, ubicada en{" "}
          <span className="font-semibold">
            AVENIDA RÍO CHURUBUSCO, NÚMERO 1015-Q A Y B 164, CENTRAL DE ABASTOS,
            IZTAPALAPA, CDMX, C.P. 09040
          </span>, se desempeña en el puesto de{" "}
          <span className="font-semibold">{empleado?.Puesto}</span> desde el{" "}
          <span className="font-semibold">{empleado?.FechaAlta || empleado?.FechaAntiguedad}</span>.
        </p>

        <p>
          Se extiende la presente constancia laboral a solicitud del interesado
          y para los fines legales que al mismo convengan.
        </p>

        <p className="mt-8 font-semibold tracking-widest">A T E N T A M E N T E :</p>

        <div className="mt-10 space-y-1">
          <p className="font-bold">C. VÍCTOR DANIEL MONROY GUTIÉRREZ</p>
          <p className="text-sm font-medium">COORDINADOR RELACIONES LABORALES</p>
          <p className="text-sm">victor.monroy@grupotarahumara.com.mx</p>
          <p className="text-sm">Cel. +52 33-2637-7507</p>
        </div>
      </div>
    </div>
  );
}

export default PatronCard;
