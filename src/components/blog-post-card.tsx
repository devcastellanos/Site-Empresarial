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
} from "@material-tailwind/react";

import { Post } from "../app/posts";


interface BlogPostCardProps {
  img: string;
  tag: string;
  title: string;
  desc: string;
  author: { name: string; img: string };
  date: string;
  idBlog: number;
  num_empleado: number;
  onPostEdit: (post: Post) => void;
}

export function BlogPostCard({
  img,
  tag,
  title,
  desc,
  author,
  date,
  idBlog,
  num_empleado,
  onPostEdit,}: BlogPostCardProps) {
  const formattedUserId = num_empleado.toString().padStart(4, '0');
  const [openModal, setOpenModal] = React.useState(false);
  const [post, setPost] = React.useState<Post >(
     {
       idBlog: idBlog,
       img: img,
       tag: tag,
       title: title,
       desc: desc,
       date: date,
       img_author: author.img,
       name_author: author.name,
       num_empleado: num_empleado,
     }
   );

  const handleEditClick = () => {
    setOpenModal(true); // Abre el modal cuando se hace clic en "Editar"
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cierra el modal
  };

  const handleEdit = () => {
    fetch(`http://localhost:3001/ActualizarPost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOpenModal(false);
        onPostEdit(post);
      });
  }

  return (
    <>
    <Card shadow={true} placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
      <CardHeader placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        <Image
          width={768}
          height={768}
          src={img}
          alt={title}
          className="h-full w-full scale-110 object-cover"
        />
      </CardHeader>
      <CardBody className="p-6" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        <Typography
          variant="small"
          color="blue"
          className="mb-2 !font-medium"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {tag}
        </Typography>
        <Typography
          as="a"
          href="#"
          variant="h5"
          color="blue-gray"
          className="mb-2 normal-case transition-colors hover:text-gray-900"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {title}
        </Typography>
        <Typography
          className="mb-6 font-normal !text-gray-500"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {desc}
        </Typography>
        <div className="flex items-center gap-4">
          <Avatar
            size="sm"
            variant="circular"
            src={`/fotos/${formattedUserId}.jpg`}
            alt={author.name}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-0.5 !font-medium"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {author.name}
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="text-xs !text-gray-500 font-normal"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {date}
            </Typography>
           
          </div>
          <Button 
          className="ml-auto"
          placeholder="" 
          onPointerEnterCapture={() => {}} 
          onPointerLeaveCapture={() => {}}
          onClick={handleEditClick}>
            
              Editar
          </Button>
        </div>
      </CardBody>
    </Card>

    {/* Modal para editar información */}
    <Dialog 
      open={openModal} 
      handler={handleCloseModal} 
      placeholder="" 
      onPointerEnterCapture={() => {}} 
      onPointerLeaveCapture={() => {}}>
    <DialogHeader 
      placeholder="" 
      onPointerEnterCapture={() => {}} 
      onPointerLeaveCapture={() => {}}>
      Edita la información
    </DialogHeader>
    <DialogBody 
      placeholder="" 
      onPointerEnterCapture={() => {}} 
      onPointerLeaveCapture={() => {}}>
      <div>
        {/* Aquí puedes agregar los campos del formulario de edición */}
        <Input
          type="text"
          placeholder="Título"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          crossOrigin=""
        />
        <Input
          placeholder="Descripción"
          value={post.desc}
          onChange={(e) => setPost({ ...post, desc: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          crossOrigin=""
        />
        <Input
          type="text"
          placeholder="Tag"
          value={post.tag}
          onChange={(e) => setPost({ ...post, tag: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          crossOrigin=""
        />

      </div>
    </DialogBody>
    <DialogFooter 
      placeholder="" 
      onPointerEnterCapture={() => {}} 
      onPointerLeaveCapture={() => {}}>
      <Button 
        variant="text" 
        color="red" 
        onClick={() => {  handleCloseModal(); }}
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}>
        Cerrar
      </Button>
      <Button 
        variant="gradient" 
        onClick={() =>{handleEdit();handleCloseModal();} }
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}>
        Guardar
      </Button>
    </DialogFooter>
  </Dialog>
    </>
  );
}


export default BlogPostCard;