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

import { Post } from "../app/posts";


interface BlogPostCardProps {
  img: string[];
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
  const [imageJson, setImageJson] = React.useState<string[]>([]);
  const [post, setPost] = React.useState<Post >(
     {
       idBlog: idBlog,
       img: Array.isArray(img) ? img : [],
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
    fetch(`http://api-cursos.192.168.29.40.sslip.io/ActualizarPost`, {
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
    <Card shadow={true}   placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
      <CardHeader onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}  placeholder="">
      {Array.isArray(post.img) && post.img.length > 0 && (
        <Carousel placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          {post.img.map((imgUrl, index) => (
            <div key={index}>
              <Image
                src={`/api/images/${imgUrl.split('/').pop()}`}
                alt={`Imagen ${index + 1}`}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
            ))}
        </Carousel>
      )}
      </CardHeader>
      <CardBody className="p-6" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
        <Typography
         placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          variant="small"
          color="blue"
          className="mb-2 !font-medium"
        >
          {tag}
        </Typography>
        <Typography
         placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          as="a"
          href="#"
          variant="h5"
          color="blue-gray"
          className="mb-2 normal-case transition-colors hover:text-gray-900"
        >
          {title}
        </Typography>
        <Typography
         placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          className="mb-6 font-normal !text-gray-500"
        >
          {desc}
        </Typography>
        <div className="flex items-center gap-4">
          <Avatar
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            size="sm"
            variant="circular"
            src={`/fotos/${formattedUserId}.jpg`}
            alt={author.name}
          />
          <div>
            <Typography
             placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              variant="small"
              color="blue-gray"
              className="mb-0.5 !font-medium"
            >
              {author.name}
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="text-xs !text-gray-500 font-normal"
              placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            >
              {date}
            </Typography>
           
          </div>
          <Button 
          className="ml-auto"
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          onClick={handleEditClick}>
            
              Editar
          </Button>
        </div>
      </CardBody>
    </Card>

    {/* Modal para editar información */}
    <Dialog 
    placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
      open={openModal} 
      handler={handleCloseModal}    
    >

    <DialogHeader 
    placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
      >
      Edita la información
    </DialogHeader>
    <DialogBody placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
      <div>
        {/* Aquí puedes agregar los campos del formulario de edición */}
        <Input
        crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          type="text"
          placeholder="Título"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <Input
        crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          placeholder="Descripción"
          value={post.desc}
          onChange={(e) => setPost({ ...post, desc: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <Input
        crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          type="text"
          placeholder="Tag"
          value={post.tag}
          onChange={(e) => setPost({ ...post, tag: e.target.value })}
          className="w-full p-2 border rounded mb-4"

        />

      </div>
    </DialogBody>
    <DialogFooter placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
      <Button 
        variant="text" 
        color="red" 
        onClick={() => {  handleCloseModal(); }}
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        >
        Cerrar
      </Button>
      <Button 
        variant="gradient" 
        onClick={() =>{handleEdit();handleCloseModal();} }
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        >
        Guardar
      </Button>
    </DialogFooter>
  </Dialog>
    </>
  );
}


export default BlogPostCard;