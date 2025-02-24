import React, { useState } from "react";
import axios from "axios";
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
  IconButton,
} from "@material-tailwind/react";

import { Post } from "../app/posts";
import { useAuth } from "@/app/hooks/useAuth";

interface BlogPostCardProps {
  img: string[];
  tag: string;
  title: string;
  desc: string;
  author: { name: string; img: string };
  date: string;
  idBlog: number;
  num_empleado: number;
  likes: number;
  onPostEdit: (post: Post) => void;
  onPostDelete: (idBlog: number) => void;
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
  likes,
  onPostEdit,
  onPostDelete,
}: BlogPostCardProps) {
  const formattedUserId = num_empleado.toString().padStart(4, "0");
  const [openModal, setOpenModal] = useState(false);
  const [statusLike, setStatusLike] = useState(false);
  const [post, setPost] = useState<Post>({
    idBlog: idBlog,
    img: Array.isArray(img) ? img : [],
    tag: tag,
    title: title,
    desc: desc,
    date: date,
    img_author: author.img,
    name_author: author.name,
    num_empleado: num_empleado,
    likes: likes,
  });

  // Estado para las imágenes nuevas seleccionadas durante la edición
  const [newImgFiles, setNewImgFiles] = useState<File[]>([]);

  const { isAuthenticated } = useAuth();

  const handleEditClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Limpiar las imágenes nuevas al cerrar el modal
    setNewImgFiles([]);
  };

  // Función para eliminar una imagen de la lista actual
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...post.img];
    updatedImages.splice(index, 1);
    setPost({ ...post, img: updatedImages });
  };

  const handleEdit = async () => {
    // Toma las imágenes actuales (ya con las eliminaciones realizadas)
    let updatedImages = [...post.img];

    // Si se seleccionaron nuevas imágenes, se suben y se concatenan
    if (newImgFiles.length > 0) {
      const formData = new FormData();
      newImgFiles.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("num_empleado", num_empleado.toString());
      try {
        console.log("Subiendo nuevas imágenes...");
        const res = await axios.post("/api/uploadImages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Imágenes subidas correctamente:", res.data.imageUrls);
        // Concatenar las imágenes ya existentes con las nuevas subidas
        updatedImages = [...updatedImages, ...res.data.imageUrls];
      } catch (error) {
        console.error("Error al subir nuevas imágenes:", error);
        return;
      }
    }

    // Construir el objeto actualizado con el arreglo completo de imágenes
    const updatedPost = { ...post, img: updatedImages };

    try {
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/ActualizarPost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const data = await response.json();
      console.log("Post actualizado:", data);
      setOpenModal(false);
      onPostEdit(updatedPost);
    } catch (error) {
      console.error("Error al actualizar post:", error);
    }
  };

  return (
    <>
      <Card shadow={true}
      placeholder=""
      onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        <CardHeader
        placeholder=""
        onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          {Array.isArray(post.img) && post.img.length > 0 && (
            <Carousel
            placeholder=""
      onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
              {post.img.map((imgUrl, index) => (
                <div key={index} className="relative">
                  <Image
                    src={`/api/images/${imgUrl.split("/").pop()}`}
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
        <CardBody className="p-6"
        placeholder=""
        onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          <Typography variant="small" color="blue" className="mb-2 !font-medium"
          placeholder=""
          onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            {tag}
          </Typography>
          <Typography
          placeholder=""
          onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            as="a"
            href="#"
            variant="h5"
            color="blue-gray"
            className="mb-2 normal-case transition-colors hover:text-gray-900"
          >
            {title}
          </Typography>
          <Typography className="mb-6 font-normal !text-gray-500"
          placeholder=""
          onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            {desc}
          </Typography>
          <div className="flex items-center gap-4">
            <Avatar
              size="sm"
              variant="circular"
              src={`/fotos/${formattedUserId}.jpg`}
              alt={author.name}
              placeholder=""
      onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            />
            <div>
              <Typography variant="small" color="blue-gray" className="mb-0.5 !font-medium"
              placeholder=""
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                {author.name}
              </Typography>
              <Typography variant="small" color="gray" className="text-xs !text-gray-500 font-normal"
              placeholder=""
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                {date}
              </Typography>
            </div>
            {isAuthenticated && (
              <div>
                <Button onClick={() => onPostDelete(idBlog)}
                  placeholder=""
                  onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Eliminar</Button>
                <Button className="ml-auto" onClick={handleEditClick}
                placeholder=""
                onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                  Editar
                </Button>
              </div>
            )}
            {statusLike ? (
              <IconButton
              placeholder=""
      onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                onClick={() => {
                  fetch(`http://api-cursos.192.168.29.40.sslip.io/dislike/${idBlog}`, {
                    method: "PUT",
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data);
                      setPost((prevPost) => ({
                        ...prevPost,
                        likes: prevPost.likes + 1,
                      }));
                      setStatusLike(!statusLike);
                      onPostEdit(post);
                    });
                }}
              >
                <i className="fas fa-heart" />
              </IconButton>
            ) : (
              <IconButton
              placeholder=""
      onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                onClick={() => {
                  fetch(`http://api-cursos.192.168.29.40.sslip.io/like/${idBlog}`, {
                    method: "PUT",
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data);
                      setPost((prevPost) => ({
                        ...prevPost,
                        likes: prevPost.likes - 1,
                      }));
                      setStatusLike(!statusLike);
                      onPostEdit(post);
                    });
                }}
              >
                <i className="far fa-heart" />
              </IconButton>
            )}
            {likes}
          </div>
        </CardBody>
      </Card>

      {/* Modal para editar información */}
      <Dialog open={openModal} handler={handleCloseModal}
      placeholder=""
      onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} 
      >
        <DialogHeader
        onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        placeholder=""
        >Editar la información</DialogHeader>
        <DialogBody
        onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} 
        placeholder=""
        >
          <div>
            {/* Campos de edición de texto */}
            <Input
              type="text"
              placeholder="Título"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} 
              crossOrigin=""
            />
            <Input
              placeholder="Descripción"
              value={post.desc}
              onChange={(e) => setPost({ ...post, desc: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} 
              crossOrigin=""
            />
            <Input
              type="text"
              placeholder="Tag"
              value={post.tag}
              onChange={(e) => setPost({ ...post, tag: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} 
              crossOrigin=""
            />

            {/* Sección para editar imágenes */}
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="mb-2"
              placeholder=""
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
                Imágenes actuales:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {post.img.map((imgUrl, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={`/api/images/${imgUrl.split("/").pop()}`}
                      alt={`Imagen ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="mb-2"
              placeholder=""
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
                Agregar nuevas imágenes:
              </Typography>
              <Input
              crossOrigin=""
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setNewImgFiles(Array.from(e.target.files));
                  }
                }}
                className="w-full p-2 border rounded"
                onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} 
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter
        placeholder=""
        onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
          <Button variant="text" color="red" onClick={handleCloseModal}
          placeholder=""
          onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
            Cerrar
          </Button>
          <Button variant="gradient" onClick={handleEdit}
          placeholder=""
          onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default BlogPostCard;
