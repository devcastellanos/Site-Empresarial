"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowDownIcon } from "lucide-react";
import BlogPostCard from "@/components/blogComponents/blog-post-card";
import { Post } from "@/lib/interfaces";
import PostForm from "./postForm";
import { fetchPosts, deletePost, uploadImages, addPost } from "./postFunctions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/app/context/AuthContext";

export function Posts() {
  const [post, setPost] = useState<Post>({
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
    impact: "bajo"
  });

  const [sortOrder, setSortOrder] = useState<"reciente" | "antiguo">("reciente");
  const [tagFilter, setTagFilter] = useState<string>("todos");
  const [posts, setPosts] = useState<Post[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const { user } = useAuth();

const filteredAndSortedPosts = [...posts]
  .filter((post) => tagFilter === "todos" || post.tag === tagFilter)
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
    const postDeleted = posts.find((p) => p.idBlog === idBlog);
    const success = await deletePost(idBlog, postDeleted);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.idBlog !== idBlog));
    }
  };

  const handlePostEdit = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.idBlog === updatedPost.idBlog ? updatedPost : p)));
  };

  const handleAddPost = async () => {
    if ((!imgFiles.length && !post.videoUrl) || !post?.num_empleado) {
      alert("Sube imagen o video y número de empleado");
      return;
    }

    const imageUrls = await uploadImages(imgFiles, post.num_empleado);
    console.log("Imagenes subidas:", imageUrls);
    const newPost = { ...post, img: imageUrls, videoUrl: post.videoUrl || "" };
    if (!imageUrls || imageUrls.length === 0) {
  alert("No se pudieron subir imágenes. Intenta de nuevo.");
  return;
}
    const addedPost = await addPost(newPost);

    if (addedPost) {
      setPosts((prev) => [...prev, addedPost]);
      window.location.reload();
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
      <motion.video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-20 opacity-40"
      >
        <source src="/image/background.mp4" type="video/mp4" />
      </motion.video>

      <Card className="shadow-2xl bg-white/80 backdrop-blur-md rounded-2xl max-w-screen-lg w-full">
        <div className="h-64 relative">
          <Image
            width={1920}
            height={1080}
            src="/image/noti.png"
            alt="background"
            className="h-full w-full rounded-t-2xl object-cover"
          />
        </div>

        {user && user.rol == "admin" && (
          <div className="p-6">
            <PostForm
              post={post}
              setPost={setPost}
              imgFiles={imgFiles}
              setImgFiles={setImgFiles}
              handleAddPost={handleAddPost}
            />
          </div>
        )}

        <div className="px-6 py-4">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Últimos posts</h2>
            <p className="text-sm text-gray-600">
              Aquí puedes ver la última información y noticias de Grupo Tarahumara.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select onValueChange={(val) => setSortOrder(val as any)}>
              <SelectTrigger><SelectValue placeholder="Ordenar por" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="reciente">Más reciente</SelectItem>
                <SelectItem value="antiguo">Más antiguo</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setTagFilter(val)}>
              <SelectTrigger><SelectValue placeholder="Departamento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Sistemas">Sistemas</SelectItem>
                <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                <SelectItem value="Compras">Compras</SelectItem>
                <SelectItem value="Ventas">Ventas</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setPost({ ...post, impact: val as any })}>
              <SelectTrigger><SelectValue placeholder="Impacto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bajo">Bajo</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {filteredAndSortedPosts.length > 0 ? (
              filteredAndSortedPosts.slice(0, visiblePosts).map((p) => (
                <Card key={p.idBlog} className="shadow-md">
                  <BlogPostCard
                    {...p}
                    author={{ name: p.name_author, img: p.img_author }}
                    onPostEdit={handlePostEdit}
                    onPostDelete={() => handleDeletePost(p.idBlog)}
                  />
                </Card>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay publicaciones disponibles.</p>
            )}
          </div>

          {visiblePosts < filteredAndSortedPosts.length && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={() => setVisiblePosts((prev) => prev + 6)}>
                <ArrowDownIcon className="w-4 h-4 mr-2" /> Ver más
              </Button>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

export default Posts;