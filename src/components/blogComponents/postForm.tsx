"use client";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Post } from "@/lib/interfaces";

interface PostFormProps {
  post: Post;
  imgFiles: File[];
  setPost: (post: Post) => void;
  setImgFiles: (files: File[]) => void;
  handleAddPost: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, setPost, imgFiles, setImgFiles, handleAddPost }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-900">Nuevo Post</h2>
      <p className="text-gray-600 mb-6">Llena los campos para agregar un nuevo post</p>

      <div className="flex flex-col gap-6">
        {/* Título y Autor */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <Label className="mb-1 block">Título</Label>
            <Input
              placeholder="Título del post"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </div>
          <div className="w-full">
            <Label className="mb-1 block">Nombre del autor</Label>
            <Input
              placeholder="Nombre del autor"
              value={post.name_author}
              onChange={(e) => setPost({ ...post, name_author: e.target.value })}
            />
          </div>
        </div>

        {/* Tag, Fecha, Número de empleado */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <Label className="mb-1 block">Tag</Label>
            <Select
              value={post.tag}
              onValueChange={(value) => setPost({ ...post, tag: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sistemas">Sistemas</SelectItem>
                <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                <SelectItem value="Compras">Compras</SelectItem>
                <SelectItem value="Ventas">Ventas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="mb-1 block">Fecha</Label>
            <Input
              type="date"
              value={post.date}
              onChange={(e) => setPost({ ...post, date: e.target.value })}
            />
          </div>

          <div className="w-full">
            <Label className="mb-1 block">Número de empleado</Label>
            <Input
              type="number"
              placeholder="Número de empleado"
              value={post.num_empleado}
              onChange={(e) => setPost({ ...post, num_empleado: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <Label className="mb-1 block">Descripción</Label>
          <Textarea
            placeholder="Descripción del post"
            value={post.desc}
            onChange={(e) => setPost({ ...post, desc: e.target.value })}
          />
        </div>

        {/* YouTube */}
        <div>
          <Label className="mb-1 block">Video de YouTube (URL)</Label>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={post.videoUrl || ""}
            onChange={(e) => setPost({ ...post, videoUrl: e.target.value })}
          />
        </div>

        {/* Imagen */}
        <div>
          <Label className="mb-1 block">Imagen</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setImgFiles(Array.from(e.target.files));
              }
            }}
          />
          {imgFiles[0] && (
            <div className="mt-4">
              <Image
                src={URL.createObjectURL(imgFiles[0])}
                alt="Vista previa"
                width={200}
                height={200}
                className="rounded-lg object-cover mx-auto"
              />
            </div>
          )}
        </div>

        {/* Botón */}
        <div className="flex justify-center mt-4">
          <Button onClick={handleAddPost}>Agregar</Button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
