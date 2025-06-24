'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Post } from '@/lib/interfaces';
import ComentariosPost from './comentariosPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { HeartIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useAuth } from '@/app/context/AuthContext';
import 'swiper/css';
import Swal from 'sweetalert2';


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
  onPostDelete
}: BlogPostCardProps) {
  const formattedUserId = num_empleado.toString().padStart(4, '0');
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
    impact: 'bajo'
  });
  const [newImgFiles, setNewImgFiles] = useState<File[]>([]);
  const { user } = useAuth();

  const extractYouTubeID = (url: string) => {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]*)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : '';
  };

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
      newImgFiles.forEach((file) => formData.append('images', file));
      formData.append('num_empleado', num_empleado.toString());
      try {
        const res = await axios.post('/api/uploadImages', formData);
        updatedImages = [...updatedImages, ...res.data.imageUrls];
      } catch (error) {
        console.error('Error al subir nuevas imágenes:', error);
        return;
      }
    }

    const updatedPost = { ...post, img: updatedImages, videoUrl: post.videoUrl || '' };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ActualizarPost`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      });
      if (!response.ok) throw new Error('Error en la solicitud');

      const data = await response.json();
      setOpenModal(false);
      setPost(updatedPost);
      onPostEdit(updatedPost);
    } catch (error) {
      console.error('Error al actualizar post:', error);
    }
  };

  const toggleLike = async (action: 'like' | 'dislike') => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${action}/${idBlog}`;
    const delta = action === 'like' ? 1 : -1;
    try {
      await fetch(url, { method: 'PUT' });
      setPost((prev) => ({ ...prev, likes: prev.likes + delta }));
      setStatusLike(!statusLike);
    } catch (error) {
      console.error('Error al actualizar like:', error);
    }
  };

  const confirmDeletePost = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el post permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onPostDelete(idBlog);
      }
    });
  };

  return (
    <>
      <Card className="rounded-xl shadow-xl p-4 space-y-4">
        <div className="relative">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            className="w-full rounded-md"
            modules={[Navigation]}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            {post.videoUrl && (
              <SwiperSlide>
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-md pointer-events-none"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(post.videoUrl)}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </SwiperSlide>
            )}
            {post.img.map((imgUrl, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={`/api/images/${imgUrl.split('/').pop()}`}
                  alt={`img-${idx}`}
                  width={600}
                  height={400}
                  className="rounded-md object-cover w-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Botones de navegación grandes */}
          <button className="swiper-button-prev absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full">
            ‹
          </button>
          <button className="swiper-button-next absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full">
            ›
          </button>
        </div>
        <div>
          <span className="text-sm text-blue-600 font-semibold">{tag}</span>
          <h3 className="text-xl font-bold text-gray-800 mt-1">{title}</h3>
          <p className="text-gray-600 mt-2">{desc}</p>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src={`/fotos/${formattedUserId}.jpg`}
            width={40}
            height={40}
            className="rounded-full"
            alt={author.name}
          />
          <div className="text-sm">
            <p className="text-gray-800 font-medium">{author.name}</p>
            <p className="text-gray-500 text-xs">{date}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => toggleLike(statusLike ? 'dislike' : 'like')}>
              <HeartIcon className={`w-5 h-5 ${statusLike ? 'text-red-500' : 'text-gray-400'}`} />
            </Button>
            <span className="text-sm text-gray-600">{post.likes}</span>
          </div>

          {(user && (user.rol === "admin" || user.rol === "Capacitacion"))&& (
            <div className="ml-4 flex gap-2">
              <Button variant="destructive" onClick={() => onPostDelete(idBlog)}>Eliminar</Button>
              <Button onClick={handleEditClick}>Editar</Button>
            </div>
          )}
        </div>

        <ComentariosPost idBlog={idBlog} isAdmin={user?.rol === "admin"} />
      </Card>


      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar la información</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} placeholder="Título" />
            <Textarea value={post.desc} onChange={(e) => setPost({ ...post, desc: e.target.value })} placeholder="Descripción" />
            <Input value={post.tag} onChange={(e) => setPost({ ...post, tag: e.target.value })} placeholder="Tag" />
            <Input value={post.videoUrl || ''} onChange={(e) => setPost({ ...post, videoUrl: e.target.value })} placeholder="Enlace de YouTube" />

            <Label className="block text-sm font-medium">Imágenes actuales:</Label>
            <div className="flex flex-wrap gap-2">
              {post.img.map((imgUrl, index) => (
                <div key={index} className="relative">
                  <Image src={`/api/images/${imgUrl.split('/').pop()}`} alt={`Imagen ${index}`} width={100} height={100} className="rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <Input type="file" multiple onChange={(e) => e.target.files && setNewImgFiles(Array.from(e.target.files))} />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCloseModal}>Cerrar</Button>
            <Button onClick={handleEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BlogPostCard;
