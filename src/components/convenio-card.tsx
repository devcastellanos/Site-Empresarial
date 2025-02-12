import React, { useState } from "react";
import Image from "next/image";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Carousel,
} from "@material-tailwind/react";

import { Convenio } from "../app/convenio";

import { useAuth } from "@/app/hooks/useAuth";

interface ConvenioCardProps {
  idConvenio: number;
  img: string;

  titulo: string;
  descripcion: string;
  link: string;

  onConvenioEdit: (convenio: Convenio) => void;
  onConvenioDelete: (idConvenio: number) => void;
}

export function ConvenioCard({
  idConvenio,
  img,
  titulo,
  descripcion,
    link,
  onConvenioEdit,
  onConvenioDelete,
}: ConvenioCardProps) {
  const [openModal, setOpenModal] = React.useState(false);
  const [imageJson, setImageJson] = React.useState<string>();
  const [convenio, setConvenio] = React.useState<Convenio>({
    idConvenio: idConvenio,
    img: img,
    titulo: titulo,
    descripcion: descripcion,
    link: link
  });

  const { isAuthenticated } = useAuth();

  const handleEditClick = () => {
    setOpenModal(true); // Abre el modal cuando se hace clic en "Editar"
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cierra el modal
  };

  const handleEdit = () => {
    fetch(`http://api-cursos.192.168.29.40.sslip.io/actualizarConvenio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(convenio),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOpenModal(false);
        onConvenioEdit(convenio);
      });
    window.location.reload();
  };

  return (
    <>
      <Card
        shadow={true}
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <CardHeader
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          placeholder=""
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
                <Image
                src={`/api/images/${img}`}
                alt="blog"
                width={600}
                height={600}
                className="h-full w-full object-cover cursor-pointer"
                />
            </a>
        </CardHeader>
        <CardBody
          className="p-6"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Typography
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            as="a"
            href="#"
            variant="h5"
            color="blue-gray"
            className="mb-2 normal-case transition-colors hover:text-gray-900"
          >
            {titulo}
          </Typography>
          <Typography
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            className="mb-6 font-normal !text-gray-500"
          >
            {descripcion}
          </Typography>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div>
                <Button
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                  onClick={() => onConvenioDelete(idConvenio)}
                >
                  Eliminar
                </Button>
                <Button
                  className="ml-auto"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                  onClick={handleEditClick}
                >
                  Editar
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Modal para editar información */}
      <Dialog
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        open={openModal}
        handler={handleCloseModal}
      >
        <DialogHeader
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Edita la información
        </DialogHeader>
        <DialogBody
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <div>
            {/* Aquí puedes agregar los campos del formulario de edición */}
            <Input
              crossOrigin=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              type="text"
              placeholder="Título"
              value={convenio.titulo}
              onChange={(e) =>
                setConvenio({ ...convenio, titulo: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <Input
              crossOrigin=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              placeholder="Descripción"
              value={convenio.descripcion}
              onChange={(e) =>
                setConvenio({ ...convenio, descripcion: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <Input
              crossOrigin=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              placeholder="Link"
              value={convenio.link}
              onChange={(e) =>
                setConvenio({ ...convenio, link: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
          </div>
        </DialogBody>
        <DialogFooter
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Button
            variant="text"
            color="red"
            onClick={() => {
              handleCloseModal();
            }}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Cerrar
          </Button>
          <Button
            variant="gradient"
            onClick={() => {
              handleEdit();
              handleCloseModal();
            }}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default ConvenioCard;
