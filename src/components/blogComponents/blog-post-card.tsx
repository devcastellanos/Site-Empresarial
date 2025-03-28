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
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

import { Post } from "@/lib/interfaces";
import { useAuth } from "@/hooks/useAuth";
import ComentariosPost from "./comentariosPost";

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
  videoUrl?: string;
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
  videoUrl,
  onPostEdit,
  onPostDelete,
}: BlogPostCardProps) {
  const formattedUserId = num_empleado.toString().padStart(4, "0");
  const [openModal, setOpenModal] = useState(false);
  const [statusLike, setStatusLike] = useState(false);
  const [post, setPost] = useState<Post>({
    idBlog,
    img: Array.isArray(img) ? img : [],
    tag,
    title,
    desc,
    date,
    img_author: author.img,
    name_author: author.name,
    num_empleado,
    likes,
    videoUrl,
    impact: "bajo",
  });

  const [newImgFiles, setNewImgFiles] = useState<File[]>([]);

  const getProfile = async () => {
    const response = await axios.get('/api/auth/profile', { withCredentials: true });
    console.log(response);
    console.log(response.data.user.email);
    return response.data.user;
  }

  const extractYouTubeID = (url: string) => {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]*)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : "";
  };

  const { isAuthenticated } = useAuth();

  const handleEditClick = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewImgFiles([]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...post.img];
    updatedImages.splice(index, 1);
    setPost({ ...post, img: updatedImages });
  };

  const handleEdit = async () => {
    let updatedImages = [...post.img];

    if (newImgFiles.length > 0) {
      const formData = new FormData();
      newImgFiles.forEach((file) => formData.append("images", file));
      formData.append("num_empleado", num_empleado.toString());
      try {
        const res = await axios.post("/api/uploadImages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedImages = [...updatedImages, ...res.data.imageUrls];
      } catch (error) {
        console.error("Error al subir nuevas imágenes:", error);
        return;
      }
    }

    const updatedPost = { ...post, img: updatedImages, videoUrl: post.videoUrl || "" };

    try {
      const response = await fetch(
        "http://api-cursos.192.168.29.40.sslip.io/ActualizarPost",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost),
        }
      );

      if (!response.ok) throw new Error("Error en la solicitud");

      const data = await response.json();
      console.log("Post actualizado:", data);
      setOpenModal(false);
      setPost(updatedPost);
      onPostEdit(updatedPost);
    } catch (error) {
      console.error("Error al actualizar post:", error);
    }
  };

  const toggleLike = async (action: "like" | "dislike") => {
    const url = `http://api-cursos.192.168.29.40.sslip.io/${action}/${idBlog}`;
    const delta = action === "like" ? 1 : -1;

    try {
      const res = await fetch(url, { method: "PUT" });
      const data = await res.json();
      console.log(data);

      setPost((prev) => ({ ...prev, likes: prev.likes + delta }));
      setStatusLike((prev) => !prev);
    } catch (error) {
      console.error("Error al actualizar like:", error);
    }
  };




  return (
    <>
      <Card className="pt-10" shadow={true} {...({} as any)}>
        <CardHeader {...({} as any)}>
          <Carousel className="rounded-xl" {...({} as any)}>
            {post.videoUrl && (
              <div className="aspect-video w-full h-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(post.videoUrl)}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {post.img.map((imgUrl, index) => (
              <Image
                key={index}
                src={`/api/images/${imgUrl.split("/").pop()}`}
                alt={`Imagen ${index + 1}`}
                width={600}
                height={600}
                className="w-full object-cover"
              />
            ))}
          </Carousel>
        </CardHeader>
        <CardBody className="p-6" {...({} as any)}>
          <Typography variant="small" color="blue" className="mb-2 font-medium"{...({} as any)}>
            {tag}
          </Typography>
          <Typography as="a" href="#" variant="h5" color="blue-gray" className="mb-2 hover:text-gray-900" {...({} as any)}>
            {title}
          </Typography>
          <Typography className="mb-6 text-gray-500 font-normal" {...({} as any)}>
            {desc}
          </Typography>
          <div className="flex items-center gap-4">
            <Avatar size="sm" variant="circular" src={`/fotos/${formattedUserId}.jpg`} alt={author.name}{...({} as any)} />
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium" {...({} as any)}>
                {author.name}
              </Typography>
              <Typography variant="small" color="gray" className="text-xs font-normal"{...({} as any)}>
                {date}
              </Typography>
            </div>
            {isAuthenticated && (
              <div className="ml-auto flex gap-2">
                <Button onClick={() => onPostDelete(idBlog)} color="red" size="sm"{...({} as any)}>
                  Eliminar
                </Button>
                <Button onClick={handleEditClick} size="sm"{...({} as any)}>
                  Editar
                </Button>
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <IconButton onClick={() => toggleLike(statusLike ? "dislike" : "like")}{...({} as any)}>
                {statusLike ? (
                  <HeartIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartOutline className="h-5 w-5 text-gray-500" />
                )}
              </IconButton>
              <Typography variant="small" color="gray" {...({} as any)}>
                {post.likes}
              </Typography>
            </div>
          </div>
          <ComentariosPost idBlog={idBlog} isAdmin={isAuthenticated} />
        </CardBody>
      </Card>

      <Dialog open={openModal} handler={handleCloseModal}{...({} as any)}>
        <DialogHeader {...({} as any)}>Editar la información</DialogHeader>
        <DialogBody {...({} as any)}>
          <Input type="text" placeholder="Título" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} className="mb-4"{...({} as any)} />
          <Input placeholder="Descripción" value={post.desc} onChange={(e) => setPost({ ...post, desc: e.target.value })} className="mb-4"{...({} as any)} />
          <Input type="text" placeholder="Tag" value={post.tag} onChange={(e) => setPost({ ...post, tag: e.target.value })} className="mb-4"{...({} as any)} />
          <Input type="text" placeholder="Enlace de YouTube" value={post.videoUrl || ""} onChange={(e) => setPost({ ...post, videoUrl: e.target.value })} className="mb-4"{...({} as any)} />

          <Typography variant="small" color="blue-gray" className="mb-2"{...({} as any)}>Imágenes actuales:</Typography>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.img.map((imgUrl, index) => (
              <div key={index} className="relative">
                <Image src={`/api/images/${imgUrl.split("/").pop()}`} alt={`Imagen ${index + 1}`} width={100} height={100} className="rounded" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  x
                </button>
              </div>
            ))}
          </div>

          <Typography variant="small" color="blue-gray" className="mb-2"{...({} as any)}>Agregar nuevas imágenes:</Typography>
          <Input type="file" multiple onChange={(e) => { if (e.target.files) setNewImgFiles(Array.from(e.target.files)); }} {...({} as any)}/>
        </DialogBody>
        <DialogFooter{...({} as any)}>
          <Button variant="text" color="red" onClick={handleCloseModal}{...({} as any)}>Cerrar</Button>
          <Button variant="gradient" onClick={handleEdit}{...({} as any)}>Guardar</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default BlogPostCard;