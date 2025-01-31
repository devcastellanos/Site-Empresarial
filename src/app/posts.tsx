"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import BlogPostCard from "@/components/blog-post-card";
import Image from "next/image";
import { Input, Select, Option, Carousel } from "@material-tailwind/react";
import axios from "axios";

import { useAuth } from "@/app/hooks/useAuth";

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
    }
  );

  const [posts, setPosts] = React.useState<Post[]>([]);
 
  const [imgFiles, setImgFiles] = useState<File[]>([]);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/posts');
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

  const handlePostEdit = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.idBlog === updatedPost.idBlog ? updatedPost : post
      )
    );
  };

  const handleAddPost = async () => {

    if (!imgFiles.length || !post?.num_empleado) {
      alert("Por favor, sube una imagen y proporciona el número de empleado.");
      return;
    }

    const formData = new FormData();

    imgFiles.forEach((file, index) => {
    if (file instanceof File) {
      formData.append("images", file); // 👈 Agrega múltiples imágenes con el mismo key
    }
    });

    formData.append("num_empleado", post.num_empleado.toString());
    formData.append("name_author", post.name_author);
    formData.append("title", post.title);
    formData.append("desc", post.desc);
    formData.append("tag", post.tag);
    formData.append("date", post.date);

    try {
      console.log("Guardando imagen...");
      const res = await axios.post("/api/uploadImages", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      console.log("Imagenes guardada correctamente");

      const newPost = {
        ...post,
        img: res.data.imageUrls,
      };

      const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/Agregarpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const result = await response.json();
      console.log('Post agregado con éxito', result);

      setPosts((prevPosts) => [...prevPosts, newPost]);

      console.log('Post agregado:', posts);
    } catch (error) {
      console.error('Error al agregar post:', error);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center p-8">
      <Image
        width={1920}
        height={1080}
        src="/image/noti.png"
        alt="background"
        className="h-96 w-full rounded-lg object-cover lg:h-[21rem]"
      />
      {
      isAuthenticated ? (
        <section className="px-8 py-10 container mx-auto">
        <Typography variant="h5" color="blue-gray"  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
          New Post
        </Typography>
        <Typography
         placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          variant="small"
          className="text-gray-600 font-normal mt-1"   
        >
          Llena los campos para agregar un nuevo post
        </Typography>
        <div className="flex flex-col mt-8">
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <Typography
               placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"   
              >
                Titulo
              </Typography>
              <Input
                crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                size="lg"
                placeholder="Titulo del post"
                value={post?.title}
                onChange={(e) => setPost({ ...post!, title: e.target.value })}
                labelProps={{
                  className: "hidden",
                }}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            </div>
            <div className="w-full">
              <Typography
               placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
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
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            </div>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              >
                Tags
              </Typography>
              <Select
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                size="lg"
                labelProps={{ className: "hidden" }}
                className="border-t-blue-gray-200 aria-[expanded=true]:border-t-primary"
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
                placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              >
                Fecha
              </Typography>
              <Input
              crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
                placeholder="Fecha"
                type="date"
                value={post?.date}
                onChange={(e) => setPost({ ...post!, date: e.target.value })}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
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
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />

            </div>
          </div>

          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
                placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
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
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            </div>
          </div>
                
          <div>
          <Input
          crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            placeholder="Imagen"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setImgFiles([...e.target.files]);
              }
            }}
          />
          {imgFiles[1] && (
            <Image
              src={URL.createObjectURL(imgFiles[1])}
              alt="Post image"
              width={200}
              height={200}
              className="object-cover self-center"
            />
          )}
          </div>
            <div className="flex justify-center mt-4">
            <Button
            placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              variant="filled"
              color="blue"
              size="sm"
              onClick={handleAddPost} 
            >
              Agregar
            </Button>
            </div>

        </div>
      </section>

      ): null }

      <div className="py-10"></div>
      <Typography variant="h1" className="mb-2 "  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}  >
        Ultimos posts
      </Typography>
      <Typography
       placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        variant="lead"
        color="gray"
        className="max-w-3xl mb-12 text-center text-gray-500"
      >
        Aquí puedes ver la ultima información y noticias de Grupo Tarahumara
      </Typography>
      <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-10 items-start lg:grid-cols-2">
        {posts?.length > 0 ? (
          posts.map(({ img, tag, title, desc, date, img_author, name_author, idBlog, num_empleado }) => (
            <BlogPostCard
              key={title}
              img={img}
              tag={tag}
              title={title}
              desc={desc}
              date={date}
              author={{ img: img_author, name: name_author }}
              idBlog={idBlog}
              num_empleado={num_empleado}
              onPostEdit={handlePostEdit}
            />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
      <Button
      placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        variant="text"
        size="lg"
        color="gray"
        className="flex items-center gap-2 mt-12"
      >
        <ArrowSmallDownIcon className="h- w-5 font-bold text-gray-900" />
        VIEW MORE
      </Button>
    </section>
  );
}

export default Posts;
