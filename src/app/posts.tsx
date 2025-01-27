"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Textarea,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import BlogPostCard from "@/components/blog-post-card";
import Image from "next/image";
import { Input, Select, Option } from "@material-tailwind/react";
import path from "path";
import axios from "axios";

import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

// day picker
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";

// @heroicons/react
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";


export interface Post {
  idBlog: number;
  img: string;
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
      img: "",
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [imgFile, setImgFile] = React.useState<File | null>(null);


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
        setPosts([]); // Vacía los posts en caso de error
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

    if (!imgFile || !post?.num_empleado) {
      alert("Por favor, sube una imagen y proporciona el número de empleado.");
      return;
    }

    const formData = new FormData();
    if (post && imgFile instanceof File) {
      formData.append("image", imgFile);
    }
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
        img: res.data.imageUrl,
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
    } catch (error) {
      console.error('Error al agregar post:', error);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center p-8">
      {/* <Tabs value="trends" className="mx-auto max-w-7xl w-full mb-16 ">
        <div className="w-full flex mb-8 flex-col items-center">
          <TabsHeader className="h-10 !w-12/12 md:w-[50rem] border border-white/25 bg-opacity-90"   >
            <Tab value="trends"   >Trends</Tab>
            <Tab value="frontend"   >Frontend</Tab>
            <Tab value="backend"   >Backend</Tab>
            <Tab value="cloud"   >Cloud</Tab>
            <Tab value="ai"   >AI</Tab>
            <Tab value="tools"   >Tools</Tab>
          </TabsHeader>
        </div>
      </Tabs> Tabs */}
      {/* <iframe src="https://gpotarahumara-my.sharepoint.com/personal/becario2_sis_grupotarahumara_com_mx1/_layouts/15/Doc.aspx?sourcedoc={e0152e46-6a54-4a22-9dc4-d3c33f2983d7}&amp;action=embedview&amp;wdAr=1.7777777777777777" width="476px" height="288px" frameBorder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> presentation, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe> */}
      <Image
        width={1920}
        height={1080}
        src="/image/noti.png"
        alt="background"
        className="h-96 w-full rounded-lg object-cover lg:h-[21rem]"
      />
      <section className="px-8 py-20 container mx-auto">
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
            placeholder="Imagen"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImgFile(file);
              }
            }}
          />
          {imgFile && (
            <Image
              src={URL.createObjectURL(imgFile)}
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


      <div className="py-2"></div>
      <Typography variant="h1" className="mb-2 "  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}  >
        Ultimos posts
      </Typography>
      <Typography
       placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        variant="lead"
        color="gray"
        className="max-w-3xl mb-36 text-center text-gray-500"
      >
        Aquí puedes ver la ultima información y noticias de Grupo Tarahumara
      </Typography>
      <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-16 items-start lg:grid-cols-3">
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
        className="flex items-center gap-2 mt-24"
      >
        <ArrowSmallDownIcon className="h-5 w-5 font-bold text-gray-900" />
        VIEW MORE
      </Button>
    </section>
  );
}

export default Posts;
