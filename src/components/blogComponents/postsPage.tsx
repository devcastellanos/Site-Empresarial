"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import BlogPostCard from "@/components/blogComponents/blog-post-card";
import Image from "next/image";
import { Input, Select, Option, Carousel } from "@material-tailwind/react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { id } from "date-fns/locale";
import { Nanum_Pen_Script } from "next/font/google";

export interface Post {
  idBlog: number;
  img: string[];
  tag: string;
  title: string;
  desc: string;
  date: string;
  img_author: string;
  name_author: string;
  num_empleado: number;
  likes: number;
  videoUrl?: string;
}


export function Posts() {
  const [post, setPost] = React.useState<Post>(
    {
      idBlog: 0,
      img: [],
      tag: "",
      title: "",
      desc: "",
      date: "",
      img_author: "",
      name_author: "",
      num_empleado: 0,
      likes: 0,
      videoUrl: "",
    }
  );

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://apicursos.in.grupotarahumara.com.mx/posts');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Post[] = await response.json();
        console.log('Posts fetched:', data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };

    fetchPosts();

  }, []);

  const handleDeletePost = async (idBlog: number) => {
    // Encontrar el post que se va a eliminar
    const postDeleted = posts.find((post) => post.idBlog === idBlog);
    console.log('Imágenes del post a eliminar:', postDeleted?.img);
    console.log('Post a eliminar:', idBlog);
    try {
      // Eliminar el post de la base de datos
      const response = await fetch("https://apicursos.in.grupotarahumara.com.mx/EliminarPost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idBlog: idBlog }),
      });
  
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
  
      const result = await response.json();
      console.log("Post eliminado con éxito", result);
  
      // Eliminar las imágenes asociadas al post
      if (postDeleted?.img && postDeleted.img.length > 0) {
        const res = await axios.post("/api/deleteImages", { images: postDeleted.img });
        console.log("Imágenes eliminadas correctamente:", res.data);
      }
  
      // Actualizar el estado de los posts
      setPosts((prevPosts) => prevPosts.filter((post) => post.idBlog !== idBlog));
    } catch (error) {
      console.error("Error al eliminar post:", error);
    }
  };
  
  const handlePostEdit = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.idBlog === updatedPost.idBlog ? updatedPost : post
      )
    );
  };

  const handleAddPost = async () => {

    if ((!imgFiles.length && !post.videoUrl) || !post?.num_empleado) {
      alert("Por favor, sube una imagen o proporciona un enlace de video y proporciona el número de empleado.");
      return;
    }

    const formData = new FormData();

    let imageUrls: string[] = [];
    if (imgFiles.length > 0) {
      const formData = new FormData();
  
      imgFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
  
      formData.append("num_empleado", post.num_empleado.toString());
  
      try {
        console.log("Subiendo imágenes...");
        const res = await axios.post("/api/uploadImages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        console.log("Imágenes subidas correctamente");
        imageUrls = res.data.imageUrls;
      } catch (error) {
        console.error("Error al subir imágenes:", error);
        return;
      }
    }

    const newPost = {
      ...post,
      img: imageUrls,
      videoUrl: post.videoUrl || "",
    };
  

    try {
      const response = await fetch("https://apicursos.in.grupotarahumara.com.mx/Agregarpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
  
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
  
      const result = await response.json();
      console.log("Post agregado con éxito", result);
  
      const postWithId = {
        ...newPost,
        idBlog: result.insertId || result.idBlog, // Asegura compatibilidad con ambos formatos de respuesta
      };
  
      setPosts((prevPosts) => [...prevPosts, postWithId]);
      console.log("Post agregado:", postWithId);
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar post:", error);
    }
  };
  

  return (
    <section className="grid min-h-screen place-items-center mt-20 p-10">
      <motion.video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        style={{ opacity: 0.4 }}
      >
        <source src="/image/background.mp4" type="video/mp4" />
      </motion.video>

      <Card className="p-10 shadow-2xl bg-white/80 backdrop-blur-md rounded-2xl w-[90%] max-w-full"{...({} as any)}>

        <CardHeader 
          floated={false} 
          shadow={false} 
          className="relative h-64" 
          {...({} as any)}>
          <Image
            width={1920}
            height={1080}
            src="/image/noti.png"
            alt="background"
            className="h-full w-full rounded-lg object-cover"
          />
        </CardHeader>
      {
      isAuthenticated ? (
        
        <section className="px-8 py-10 container mx-auto">
          <Card className="p-10 shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl w-[100%] max-w-7xl"
           
{...({} as any)}>
        <Typography variant="h4" color="blue-gray" className="text-3xl font-bold text-blue-gray-900" {...({} as any)} >
          New Post
        </Typography>
        <Typography
         {...({} as any)}
          variant="small"
          className="text-gray-600 font-normal mt-1"   
        >
          Llena los campos para agregar un nuevo post
        </Typography>
        <div className="flex flex-col mt-8">
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <Typography
               {...({} as any)}
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"   
              >
                Titulo
              </Typography>
              <Input
                crossOrigin=""
                size="lg"
                placeholder="Título del post" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                value={post?.title}
                onChange={(e) => setPost({ ...post!, title: e.target.value })}
                labelProps={{
                  className: "hidden",
                }}
                className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
              />

            </div>
            <div className="w-full">
              <Typography
               {...({} as any)}
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"   
              >
                Nombre del autor
              </Typography>
              <Input
              crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                size="lg"
                placeholder="Nombre Autor"
                value={post?.name_author}
                onChange={(e) => setPost({ ...post!, name_author: e.target.value })}
                labelProps={{
                  className: "hidden",
                }}
                className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
              />
            </div>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                {...({} as any)}
              >
                Tags
              </Typography>
              <Select
                onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                size="lg"
                labelProps={{ className: "hidden" }}
                className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
                placeholder="Tag"
                value={post.tag}
                onChange={(value: string | undefined) => {
                  if (value) {
                    console.log('Selected value:', value);
                    setPost((prevPost) => ({ ...prevPost, tag: value }));
                  }
                }}
                
                
              >
                <Option value="Sistemas">Sistemas</Option>
                <Option value="Recursos Humanos">Recursos Humanos</Option>
                <Option value="Contabilidad">Contabilidad</Option>
                <Option value="Compras">Compras</Option>
                <Option value="Ventas">Ventas</Option>
              </Select>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                {...({} as any)}
              >
                Fecha
              </Typography>
              <Input
              crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                placeholder="Fecha"
                type="date"
                value={post?.date}
                onChange={(e) => setPost({ ...post!, date: e.target.value })}
                className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
              />
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                {...({} as any)}
              >
                Número de empleado
              </Typography>
              <Input
              crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                size="lg"
                placeholder="Número de empleado"
                value={post?.num_empleado}
                onChange={(e) => setPost({ ...post!, num_empleado: Number(e.target.value) })}
                labelProps={{
                  className: "hidden",
                }}
                className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
              />

            </div>
          </div>

          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                {...({} as any)}
              >
                Descripción
              </Typography>
              <Textarea
                onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                size="lg"
                placeholder="Descripción"
                value={post?.desc}
                onChange={(e) => setPost({ ...post!, desc: e.target.value })}
                labelProps={{
                  className: "hidden",
                }}
                className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
              />
            </div>
          </div>

          <div className="mb-6">
            <Typography
              {...({} as any)}
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Video de YouTube (URL)
            </Typography>
            <Input
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              crossOrigin=""
              size="lg"
              placeholder="https://www.youtube.com/watch?v=..."
              value={post.videoUrl || ""}
              onChange={(e) => setPost({ ...post, videoUrl: e.target.value })}
              className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
            />
          </div>
                
          <div>
          <Input
          crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            placeholder="Imagen"
            type="file"
            accept="image/*"
            multiple
            onResize={() => {}}
            onResizeCapture={() => {}}
            onChange={(e) => {
              if (e.target.files) {
                setImgFiles([...e.target.files]);
              }
            }}
          />
          {imgFiles[0] && (
            <Image
              src={URL.createObjectURL(imgFiles[0])}
              alt="Post image"
              width={200}
              height={200}
              className="object-cover self-center"
            />
          )}


          </div>
            <div className="flex justify-center mt-4">
            <Button
            {...({} as any)}
              variant="filled"
              color="blue"
              size="sm"
              onClick={handleAddPost} 
            >
              Agregar
            </Button>
            </div>

        </div>
        </Card>
      </section>

      ): null }

      <div className="py-10"></div>
      <CardBody {...({} as any)}>
          <Typography variant="h5" color="blue-gray" {...({} as any)}>
            Últimos posts
          </Typography>
          <Typography variant="lead" className="text-gray-600 mt-2" {...({} as any)}>
            Aquí puedes ver la última información y noticias de Grupo Tarahumara.
          </Typography>
      <div className="grid grid-cols-1 gap-6 mt-6 ">
            {posts.length > 0 ? (
              posts.map(({ img, tag, title, desc, date, img_author, name_author, idBlog, num_empleado, likes, videoUrl }) => (
                <Card key={idBlog} className="shadow-md" {...({} as any)}>
                  <BlogPostCard
                    img={img}
                    tag={tag}
                    title={title}
                    desc={desc}
                    date={date}
                    author={{ img: img_author, name: name_author }}
                    idBlog={idBlog}
                    num_empleado={num_empleado}
                    likes={likes}
                    videoUrl={videoUrl}
                    onPostEdit={handlePostEdit}
                    onPostDelete={() => handleDeletePost(idBlog)}
                  />
                </Card>
              ))
            ) : (
              <Typography variant="small" className="text-gray-500" {...({} as any)}>
                No hay publicaciones disponibles.
              </Typography>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-center" {...({} as any)}>
          <Button variant="text" size="lg" color="gray" className="flex items-center gap-2" {...({} as any)}>
            <ArrowSmallDownIcon className="h-5 w-5 text-gray-900" /> Ver más
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Posts;
