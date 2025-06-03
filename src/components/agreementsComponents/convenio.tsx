"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import ConvenioCard from "@/components/agreementsComponents/agreementsCard";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";


export interface Convenio {
  idConvenio: number;
  img: string;
  titulo: string;
  descripcion: string;
  link: string;
  tipo?: string | "educativo" | "no educativo";
}

export function Convenio() {
  const [convenio, setConvenio] = useState<Convenio>({
    idConvenio: 0,
    img: "",
    titulo: "",
    descripcion: "",
    link: "",
    tipo: "",
  });
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [tipoSeleccionado, setTipoSeleccionado] = useState<"educativo" | "no educativo">("educativo");
  const searchParams = useSearchParams();
  const tipoQuery = searchParams.get("tipo");
  const handleOpen = () => setOpen(prev => !prev);

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
     if (tipoQuery === "educativo" || tipoQuery === "no educativo") {
    setTipoSeleccionado(tipoQuery);
  }
  }, [tipoQuery]);

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
    if (!convenio.tipo) return alert("Selecciona un tipo de convenio.");

    const formData = new FormData();
    formData.append("image", imgFile);
    formData.append("title", convenio.titulo);
    formData.append("desc", convenio.descripcion);
    formData.append("link", convenio.link);
    formData.append("tipo", convenio.tipo);

    try {
      const res = await axios.post("/api/imageConvenio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newConvenio = {
        ...convenio,
        img: res.data.imageUrls,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agregarConvenio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConvenio),
      });

      if (!response.ok) throw new Error("Error en la solicitud");

      const result = await response.json();
      setConvenios((prev) => [...prev, { ...newConvenio, idConvenio: result.idConvenio }]);

      // Limpia formulario
      setConvenio({
        idConvenio: 0,
        img: "",
        titulo: "",
        descripcion: "",
        link: "",
        tipo: "", // importante para resetear
      });
      setImgFile(null);
      setOpen(false);
    } catch (error) {
      console.error("Error al agregar Convenio:", error);
    }
  };

  const conveniosFiltrados = convenios.filter(c => c.tipo === tipoSeleccionado);
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mb-10 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Agregar Convenio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nuevo Convenio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input
                  placeholder="Título"
                  value={convenio.titulo}
                  onChange={(e) => setConvenio({ ...convenio, titulo: e.target.value })}
                />
                <Input
                  placeholder="Link"
                  value={convenio.link}
                  onChange={(e) => setConvenio({ ...convenio, link: e.target.value })}
                />
                <Textarea
                  placeholder="Descripción"
                  value={convenio.descripcion}
                  onChange={(e) => setConvenio({ ...convenio, descripcion: e.target.value })}
                />
                <Input
                  type="file"
                  onChange={(e) => setImgFile(e.target.files ? e.target.files[0] : null)}
                />
                <select
                  className="w-full border rounded-md p-2"
                  value={convenio.tipo}
                  onChange={(e) => setConvenio({ ...convenio, tipo: e.target.value })}
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="educativo">Educativo</option>
                  <option value="no educativo">No Educativo</option>
                </select>
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
              <DialogFooter>
                <Button variant="outline" onClick={handleOpen}>Cancelar</Button>
                <Button onClick={handleAddConvenio}>Agregar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      <h1 className="text-4xl font-bold mb-2">Convenios</h1>
      <p className="text-muted-foreground max-w-3xl mb-12 text-center">
        Aquí puedes ver los convenios actuales de Grupo Tarahumara
      </p>

      {!tipoQuery && (
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={tipoSeleccionado === "educativo" ? "default" : "outline"}
            onClick={() => setTipoSeleccionado("educativo")}
          >
            Educativos
          </Button>
          <Button
            variant={tipoSeleccionado === "no educativo" ? "default" : "outline"}
            onClick={() => setTipoSeleccionado("no educativo")}
          >
            No Educativos
          </Button>
        </div>
      )}

      <div className="container grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {conveniosFiltrados.length > 0 ? conveniosFiltrados.map(({ img, titulo, descripcion, link, idConvenio, tipo }) => (
          <ConvenioCard
            key={idConvenio}
            img={img}
            titulo={titulo}
            descripcion={descripcion}
            link={link}
            idConvenio={idConvenio}
            tipo={tipo || ""}
            onConvenioEdit={(updatedConvenio) => {
              setConvenios((prev) =>
                prev.map((c) =>
                  c.idConvenio === updatedConvenio.idConvenio ? updatedConvenio : c
                )
              );
            }}
            onConvenioDelete={handleDeleteConvenio}
          />
        )) : <p>No hay convenios {tipoSeleccionado}</p>}
      </div>
    </section>
  );
}

export default Convenio;
