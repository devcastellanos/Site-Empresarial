"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownIcon } from "lucide-react";
import BlogPostCard from "@/components/blogComponents/blog-post-card";
import { Post } from "@/lib/interfaces";
import PostForm from "./postForm";
import { fetchPosts, deletePost, uploadImages, addPost } from "./postFunctions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  // Aplica overflow-y: scroll para evitar salto visual al abrir Select
  useEffect(() => {
    const html = document.documentElement;
    const previousOverflowY = html.style.overflowY;

    html.style.overflowY = "scroll";

    return () => {
      html.style.overflowY = previousOverflowY;
    };
  }, []);

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
    <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 bg-gray-50">
      <Card className="shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl w-full max-w-screen-2xl">
        <div className="h-64 relative rounded-t-2xl overflow-hidden">
          <Image
            width={1920}
            height={1080}
            src="/image/noti.png"
            alt="Cabecera del blog"
            className="h-full w-full object-cover"
          />
        </div>

        {(user && (user.rol === "admin" || user.rol === "Capacitacion")) && (
          <div className="p-8 border-b border-gray-200">
            <PostForm
              post={post}
              setPost={setPost}
              imgFiles={imgFiles}
              setImgFiles={setImgFiles}
              handleAddPost={handleAddPost}
            />
          </div>
        )}

        <div className="px-8 py-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Publicaciones recientes</h2>
            <p className="text-sm text-gray-500">
              Consulta las últimas novedades y noticias de Grupo Tarahumara.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
            <Select onValueChange={(val) => setSortOrder(val as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="w-48">
                <SelectItem value="reciente">Más reciente</SelectItem>
                <SelectItem value="antiguo">Más antiguo</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setTagFilter(val)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent className="w-48">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Sistemas">Sistemas</SelectItem>
                <SelectItem value="Capital Humano">Capital Humano</SelectItem>
                <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                <SelectItem value="Compras">Compras</SelectItem>
                <SelectItem value="Ventas">Ventas</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setPost({ ...post, impact: val as any })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Impacto" />
              </SelectTrigger>
              <SelectContent className="w-48">
                <SelectItem value="bajo">Bajo</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {filteredAndSortedPosts.length > 0 ? (
              filteredAndSortedPosts.slice(0, visiblePosts).map((p) => (
                <Card key={p.idBlog} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                  <BlogPostCard
                    {...p}
                    author={{ name: p.name_author, img: p.img_author }}
                    onPostEdit={handlePostEdit}
                    onPostDelete={() => handleDeletePost(p.idBlog)}
                  />
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <p className="text-base">No hay publicaciones disponibles por ahora.</p>
              </div>
            )}
          </div>

          {visiblePosts < filteredAndSortedPosts.length && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                className="border-gray-300 hover:border-gray-500 text-sm font-medium px-6 py-2"
                onClick={() => setVisiblePosts((prev) => prev + 6)}
              >
                <ArrowDownIcon className="w-4 h-4 mr-2" /> Ver más publicaciones
              </Button>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

export default Posts;
