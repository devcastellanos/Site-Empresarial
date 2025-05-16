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
import { fetchPosts, deletePost, uploadImages, addPost } from "./postFunctions";
import PostForm from "./postForm";

import { Post } from "@/lib/interfaces";

export function Posts() {
  const [post, setPost] = React.useState<Post>({
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
    impact: "bajo",
  });

  const [sortOrder, setSortOrder] = useState<"reciente" | "antiguo">(
    "reciente"
  );
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);

  const [visiblePosts, setVisiblePosts] = useState(5);

  const { isAuthenticated } = useAuth();

  const filteredAndSortedPosts = [...posts]
    .filter((post) => {
      if (!tagFilter) return true;
      return post.tag === tagFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "reciente" ? dateB - dateA : dateA - dateB;
    });

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };

    loadPosts();
  }, []);

  const handleDeletePost = async (idBlog: number) => {
    // Encontrar el post que se va a eliminar
    const postDeleted = posts.find((post) => post.idBlog === idBlog);
    console.log("Imágenes del post a eliminar:", postDeleted?.img);
    console.log("Post a eliminar:", idBlog);

    const success = await deletePost(idBlog, postDeleted);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.idBlog !== idBlog));
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
      alert(
        "Por favor, sube una imagen o proporciona un enlace de video y proporciona el número de empleado."
      );
      return;
    }

    const imageUrls = await uploadImages(imgFiles, post.num_empleado);

    const newPost = {
      ...post,
      img: imageUrls,
      videoUrl: post.videoUrl || "",
    };
    const addedPost = await addPost(newPost);

    if (addedPost) {
      setPosts((prevPosts) => [...prevPosts, addedPost]);
      console.log("Post agregado:", addedPost);
      window.location.reload();
    }
  };

  return (
    <section className="min-h-screen flex items-start justify-center px-4 pt-24 pb-12">
      <motion.video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        style={{ opacity: 0.4 }}
      >
        <source src="/image/background.mp4" type="video/mp4" />
      </motion.video>

      <Card
        className="shadow-2xl bg-white/80 backdrop-blur-md rounded-2xl  max-w-full"
        {...({} as any)}
      >
        <CardHeader
          floated={false}
          shadow={false}
          className="relative h-64"
          {...({} as any)}
        >
          <Image
            width={1920}
            height={1080}
            src="/image/noti.png"
            alt="background"
            className="h-full w-full rounded-lg object-cover"
          />
        </CardHeader>
        {isAuthenticated ? (
          <PostForm
            post={post}
            setPost={setPost}
            imgFiles={imgFiles}
            setImgFiles={setImgFiles}
            handleAddPost={handleAddPost}
          />
        ) : null}

        <div className="py-10"></div>
        <CardBody {...({} as any)}>
          <Typography variant="h5" color="blue-gray" {...({} as any)}>
            Últimos posts
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 mt-2"
            {...({} as any)}
          >
            Aquí puedes ver la última información y noticias de Grupo
            Tarahumara.
          </Typography>
          <div className="flex flex-col md:flex-row justify-end gap-4 mb-6">
            <div className="w-64">
              <Select
                label="Ordenar por fecha"
                value={sortOrder}
                onChange={(val) => setSortOrder(val as "reciente" | "antiguo")}
                {...({} as any)}
              >
                <Option value="reciente">Más reciente</Option>
                <Option value="antiguo">Más antiguo</Option>
              </Select>
            </div>
            <div className="w-64">
              <Select
                label="Filtrar por departamento"
                value={tagFilter ?? ""}
                onChange={(val) => setTagFilter(val || null)}
                {...({} as any)}
              >
                <Option value="">Todos</Option>
                <Option value="Sistemas">Sistemas</Option>
                <Option value="Recursos Humanos">Recursos Humanos</Option>
                <Option value="Contabilidad">Contabilidad</Option>
                <Option value="Compras">Compras</Option>
                <Option value="Ventas">Ventas</Option>
              </Select>
            </div>
            <div className="w-64">
            <Select
            label="Impacto"
            value={post.impact}
            onChange={(val) => setPost({ ...post, impact: val as "bajo" | "medio" | "alto" })}
            {...({} as any)}
          >
            <Option value="bajo">Bajo</Option>
            <Option value="medio">Medio</Option>
            <Option value="alto">Alto</Option>
          </Select>
          </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6 ">
            {posts.length > 0 ? (
              filteredAndSortedPosts
                .slice(0, visiblePosts)
                .map(
                  ({
                    img,
                    tag,
                    title,
                    desc,
                    date,
                    img_author,
                    name_author,
                    idBlog,
                    num_empleado,
                    likes,
                    videoUrl,
                  }) => (
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
                  )
                )
            ) : (
              <Typography
                variant="small"
                className="text-gray-500"
                {...({} as any)}
              >
                No hay publicaciones disponibles.
              </Typography>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-center" {...({} as any)}>
          {visiblePosts < filteredAndSortedPosts.length && (
            <Button
              variant="text"
              size="lg"
              color="gray"
              className="flex items-center gap-2"
              onClick={() => setVisiblePosts((prev) => prev + 6)}
              {...({} as any)}
            >
              <ArrowSmallDownIcon className="h-5 w-5 text-gray-900" /> Ver más
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}

export default Posts;
