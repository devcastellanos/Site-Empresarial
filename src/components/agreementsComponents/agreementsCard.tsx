"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { Convenio } from "./convenio";
import Swal from "sweetalert2"; // ← Añadido

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ConvenioCardProps {
  idConvenio: number;
  img: string;
  titulo: string;
  descripcion: string;
  link: string;
  tipo: string;
  onConvenioEdit: (convenio: Convenio) => void;
  onConvenioDelete: (idConvenio: number) => void;
}

export function ConvenioCard({
  idConvenio,
  img,
  titulo,
  descripcion,
  link,
  tipo,
  onConvenioEdit,
  onConvenioDelete,
}: ConvenioCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const [convenio, setConvenio] = useState<Convenio>({
    idConvenio,
    img,
    titulo,
    descripcion,
    link,
    tipo,
  });

  const { user } = useAuth();

  const handleCloseModal = () => setOpenModal(false);

  const handleEdit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/actualizarConvenio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convenio),
      });

      if (!response.ok) throw new Error("Error al actualizar convenio");
      const result = await response.json();
      onConvenioEdit(convenio);
      setOpenModal(false);
    } catch (error) {
      console.error("Error actualizando convenio:", error);
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el convenio y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onConvenioDelete(idConvenio);
      }
    });
  };

  return (
    <>
      <Card className="w-full overflow-hidden rounded-xl shadow-md">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Image
            src={`/api/images/${img}`}
            alt="Imagen del convenio"
            width={600}
            height={300}
            className="w-full h-60 object-cover"
          />
        </a>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-semibold">{titulo}</h2>
          <p className="text-sm text-muted-foreground">{descripcion}</p>
          <p className="text-xs italic text-gray-500">Tipo: {tipo}</p>
          {user && user.rol === "admin" && (
            <div className="flex gap-2 pt-2">
              <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
              <Button variant="default" onClick={() => setOpenModal(true)}>Editar</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Convenio</DialogTitle>
            <DialogDescription>
              Cambia la información del convenio y guarda los cambios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={convenio.titulo}
                onChange={(e) => setConvenio({ ...convenio, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={convenio.link}
                onChange={(e) => setConvenio({ ...convenio, link: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={convenio.descripcion}
                onChange={(e) => setConvenio({ ...convenio, descripcion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={convenio.tipo}
                onValueChange={(value) => setConvenio({ ...convenio, tipo: value })}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educativo">Educativo</SelectItem>
                  <SelectItem value="no educativo">No Educativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ConvenioCard;
