"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Textarea,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/solid";
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
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Convenios`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data: Convenio[] = await response.json();
        setConvenios(data);
      } catch (error) {
        console.error("Error al obtener convenios:", error);
        setConvenios([]);
      }
    };
    fetchConvenios();
  }, []);

  const handleDeleteConvenio = async (idConvenio: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/eliminarConvenio`, {
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
    if (!imgFile) return alert("Por favor, sube una imagen.");

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agregarConvenio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConvenio),
      });

      if (!response.ok) throw new Error("Error en la solicitud");
      const result = await response.json();
      setConvenios((prev) => [...prev, { ...newConvenio, idConvenio: result.idConvenio }]);
      setConvenio({ idConvenio: 0, img: "", titulo: "", descripcion: "", link: "" });
      setImgFile(null);
      setOpen(false);
    } catch (error) {
      console.error("Error al agregar Convenio:", error);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center p-8">
      <div className="max-w-3xl w-full mx-auto border border-gray-300 rounded-xl overflow-hidden shadow-md mb-10 mt-24">
        <Image
          width={1200}
          height={600}
          src="/image/background-convenios.webp"
          alt="background"
          className="w-full object-cover h-64"
        />
      </div>

      {isAuthenticated && (
        <>
          <Button
            onClick={handleOpen}
            color="blue"
            className="mb-10 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Agregar Convenio
          </Button>

          <Dialog open={open} handler={handleOpen} size="lg">
            <DialogHeader>Nuevo Convenio</DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <Input
                  label="Título"
                  value={convenio.titulo}
                  onChange={(e) => setConvenio({ ...convenio, titulo: e.target.value })}
                />
                <Input
                  label="Link"
                  value={convenio.link}
                  onChange={(e) => setConvenio({ ...convenio, link: e.target.value })}
                />
                <Textarea
                  label="Descripción"
                  value={convenio.descripcion}
                  onChange={(e) => setConvenio({ ...convenio, descripcion: e.target.value })}
                />
                <Input
                  type="file"
                  label="Imagen"
                  accept="image/*"
                  onChange={(e) => setImgFile(e.target.files ? e.target.files[0] : null)}
                />
                {imgFile && (
                  <Image
                    src={URL.createObjectURL(imgFile)}
                    alt="Vista previa"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="text" onClick={handleOpen} className="mr-2">Cancelar</Button>
              <Button color="blue" onClick={handleAddConvenio}>Agregar</Button>
            </DialogFooter>
          </Dialog>
        </>
      )}

      <Typography variant="h1" className="mb-2">Convenios</Typography>
      <Typography variant="lead" color="gray" className="max-w-3xl mb-12 text-center text-gray-500">
        Aquí puedes ver los convenios actuales de Grupo Tarahumara
      </Typography>

      <div className="container grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {convenios.length > 0 ? convenios.map(({ img, titulo, descripcion, link, idConvenio }) => (
          <ConvenioCard
            key={idConvenio}
            img={img}
            titulo={titulo}
            descripcion={descripcion}
            link={link}
            idConvenio={idConvenio}
            onConvenioEdit={(convenio) => {}}
            onConvenioDelete={handleDeleteConvenio}
          />
        )) : <p>No hay publicaciones</p>}
      </div>
    </section>
  );
}

export default Convenio;
