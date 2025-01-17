"use client";

import React, { useEffect } from "react";
import {
  Button,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import BlogPostCard from "@/components/blog-post-card";
import Image from "next/image";
import { Input } from "@material-tailwind/react";
import path from "path";
import axios from "axios";


interface Post {
  img: string;
  tag: string;
  title: string;
  desc: string;
  date: string;
  img_author: string;
  name_author: string;
  num_empleado: number;
  imgFile?: File;
}

export function Posts() {
  const [post, setPost] = React.useState<Post | null>(
    {
      img: "",
      tag: "",
      title: "",
      desc: "",
      date: "",
      img_author: "",
      name_author: "",
      num_empleado: 0,
      imgFile: undefined,
    }
  );
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [imgFile, setImgFile] = React.useState<File | null>(null);


  useEffect(() => {
    const fetchPosts = async () => {

      const dataBlog = await fetch('http://localhost:3001/posts');
      const posts = await dataBlog.json();
      console.log(posts);
      setPosts(posts);
    }
    fetchPosts();

  }, []);

  const handleAddPost = async () => {

    if (!post?.imgFile || !post?.num_empleado) {
      alert("Por favor, sube una imagen y proporciona el número de empleado.");
      return;
    }

    const formData = new FormData();
    if (post && post.imgFile instanceof File) { formData.append("image", post.imgFile); }
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

      console.log("Imagen guardada correctamente");

      const newPost = {
        ...post,
        img:res.data.imageUrl,
      };
      
      const response = await fetch('http://localhost:3001/Agregarpost', {
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
    } catch (error) {
      console.error('Error al agregar post:', error);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center p-8">
      <Tabs value="trends" className="mx-auto max-w-7xl w-full mb-16 ">
        <div className="w-full flex mb-8 flex-col items-center">
          <TabsHeader className="h-10 !w-12/12 md:w-[50rem] border border-white/25 bg-opacity-90" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            <Tab value="trends" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Trends</Tab>
            <Tab value="frontend" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Frontend</Tab>
            <Tab value="backend" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Backend</Tab>
            <Tab value="cloud" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Cloud</Tab>
            <Tab value="ai" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>AI</Tab>
            <Tab value="tools" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Tools</Tab>
          </TabsHeader>
        </div>
      </Tabs>
      <Image
        src={"/image/noti.png"}
        alt={"Grupo Tarahumara"}
        width={1280}
        height={349}
        layout="responsive"
        className="object-cover"
      />
      <div>
        <Typography variant="h1" className="mb-2 " placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          Nuevo post
        </Typography>
        <Input
          placeholder="Titulo"
          crossOrigin=""
          value={post?.title}
          onChange={(e) => setPost({ ...post!, title: e.target.value })}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        
        <Input
          placeholder="Descripcion"
          crossOrigin=""
          value={post?.desc}
          onChange={(e) => setPost({ ...post!, desc: e.target.value })}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          placeholder="Tag"
          crossOrigin=""
          value={post?.tag}
          onChange={(e) => setPost({ ...post!, tag: e.target.value })}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          placeholder="Fecha"
          crossOrigin=""
          value={post?.date}
          onChange={(e) => setPost({ ...post!, date: e.target.value })}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          placeholder="Imagen"
          crossOrigin=""
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setImgFile(file);
              if (post) {
                setPost({ ...post, imgFile: file });
              }
            }
          }}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          placeholder="Nombre Autor"
          crossOrigin=""
          value={post?.name_author}
          onChange={(e) => setPost({ ...post!, name_author: e.target.value })}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          placeholder="Numero Empleado"
          crossOrigin=""
          value={post?.num_empleado}
          onChange={(e) => setPost({ ...post!, num_empleado: Number(e.target.value) })}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        {post?.imgFile && (
          <Image
            src={URL.createObjectURL(post.imgFile)}
            alt="Post image"
            width={200}
            height={200}
            className="object-cover"
          />
        )}
        
        <Button
          variant="filled"
          color="blue"
          className="flex items-center gap-2 mt-4"
          placeholder=""
          onClick={handleAddPost}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Agregar
        </Button>

      </div>
      <div className="py-8"></div>
      <Typography variant="h1" className="mb-2 " placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        Trends News
      </Typography>
      <Typography
        variant="lead"
        color="gray"
        className="max-w-3xl mb-36 text-center text-gray-500"
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}
      >
        Check out what&apos;s new in the web development and tech worls! Do not
        forget to subscribe to our blog and we will notify you with the latest
        news.
      </Typography>
      <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-16 items-start lg:grid-cols-3">
        {posts?.map(({ img, tag, title, desc, date, img_author, name_author  }) => (
          <BlogPostCard
            key={title}
            img={img}
            tag={tag}
            title={title}
            desc={desc}
            date={date}
            author={{ img: img_author, name: name_author }}
          />
        ))}
      </div>
      <Button
        variant="text"
        size="lg"
        color="gray"
        className="flex items-center gap-2 mt-24"
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}
      >
        <ArrowSmallDownIcon className="h-5 w-5 font-bold text-gray-900" />
        VIEW MORE
      </Button>
    </section>
  );
}

export default Posts;
