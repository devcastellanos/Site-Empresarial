"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Textarea,
  Input,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import ConvenioCard from "@/components/agreementsComponents/agreementsCard";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

export interface Convenio {
  idConvenio: number;
  img: string;
  titulo: string;
  descripcion: string;
  link: string;
}

export function Convenio() {
  const [convenio, setConvenio] = useState<Convenio>({
    idConvenio: 0,
    img: "",
    titulo: "",
    descripcion: "",
    link: "",
  });

  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/Convenios");
        console.log(response);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data: Convenio[] = await response.json();
        
        setConvenios(data);
      } catch (error) {
        console.error("Error :", error);
        setConvenios([]);
      }
    };
    fetchConvenios();
  }, []);

  const handleDeleteConvenio = async (idConvenio: number) => {
    try {
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/eliminarConvenio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idConvenio }),
      });
      if (!response.ok) throw new Error("Error en la solicitud");
      setConvenios((prev) => prev.filter((c) => c.idConvenio !== idConvenio));
    } catch (error) {
      console.error("Error al eliminar convenio:", error);
    }
  };

  const handleAddConvenio = async () => {
    if (!imgFile) {
      alert("Por favor, sube una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imgFile);
    formData.append("title", convenio.titulo);
    formData.append("desc", convenio.descripcion);
    formData.append("link", convenio.link);

    try {
      const res = await axios.post("/api/imageConvenio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const newConvenio = { ...convenio, img: res.data.imageUrls };
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/agregarConvenio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConvenio),
      });

      if (!response.ok) throw new Error("Error en la solicitud");
      const result = await response.json();
      setConvenios((prev) => [...prev, { ...newConvenio, idConvenio: result.idConvenio }]);
      setConvenio({ idConvenio: 0, img: "", titulo: "", descripcion: "", link: "" });
      setImgFile(null);
    } catch (error) {
      console.error("Error al agregar Convenio:", error);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center p-8">
      <Image width={1920} height={1080} src="/image/background-convenios.webp" alt="background" className="h-96 w-full rounded-lg object-cover lg:h-[21rem]" />
      {isAuthenticated && (
        <section className="px-8 py-10 container mx-auto">
          <Typography variant="h5" color="blue-gray" {...({} as any)} placeholder="Nuevo Convenio">Nuevo Convenio</Typography>
          <Typography variant="small" className="text-gray-600 font-normal mt-1"
          {...({} as any)} >Llena los campos para agregar un nuevo convenio</Typography>
          <div className="flex flex-col mt-8">
            <div className="mb-6">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"
              {...({} as any)} >Título</Typography>
              <Input 
                size="lg" 
                placeholder="Título del Convenio" 
                value={convenio.titulo} 
                onChange={(e) => setConvenio({ ...convenio, titulo: e.target.value })} 
                crossOrigin="" 
                onPointerLeaveCapture={() => {}} 
                onPointerEnterCapture={() => {}} 
              />

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"
                {...({} as any)} >Link</Typography>
                <Input
                    size="lg"
                    placeholder="Link del Convenio"
                    value={convenio.link}
                    onChange={(e) => setConvenio({ ...convenio, link: e.target.value })}
                    crossOrigin=""
                    onPointerLeaveCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                />

            </div>
            <div className="mb-6">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"
              {...({} as any)} >Descripción</Typography>
              <Textarea 
                size="lg" 
                placeholder="Descripción" 
                value={convenio.descripcion} 
                onChange={(e) => setConvenio({ ...convenio, descripcion: e.target.value })} 
                onPointerLeaveCapture={() => {}} 
                onPointerEnterCapture={() => {}} 
              />
            </div>
            <div className="mb-6">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImgFile(e.target.files ? e.target.files[0] : null)} 
                crossOrigin="" 
                onPointerLeaveCapture={() => {}} 
                onPointerEnterCapture={() => {}} 
              />
              {imgFile && <Image src={URL.createObjectURL(imgFile)} alt="Imagen de Convenio" width={200} height={200} className="object-cover self-center" />}
            </div>
            <Button 
              variant="filled" 
              color="blue" 
              size="sm" 
              onClick={handleAddConvenio} 
              onPointerLeaveCapture={() => {}} 
              onPointerEnterCapture={() => {}} 
              placeholder="Agregar"
            >
              Agregar
            </Button>
          </div>
        </section>
      )}
      <Typography variant="h1" className="mb-2"
      {...({} as any)} >Convenios</Typography>
      <Typography variant="lead" color="gray" className="max-w-3xl mb-12 text-center text-gray-500"
      {...({} as any)} >Aquí puedes ver los convenios actuales de Grupo Tarahumara</Typography>
      <div className="container grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {convenios.length > 0 ? convenios.map(({ img, titulo, descripcion, link, idConvenio }) => (
          <ConvenioCard  key={idConvenio} img={img} titulo={titulo} descripcion={descripcion} link={link} idConvenio={idConvenio} onConvenioEdit={(convenio) => {}} onConvenioDelete={handleDeleteConvenio} />
        )) : <p>No hay publicaciones</p>}
      </div>
    </section>
  );
}

export default Convenio;
