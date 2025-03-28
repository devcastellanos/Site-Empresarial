import { useState } from "react";
import { Button, Card, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";    
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
<Card
              className="p-10 shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl w-[100%] max-w-7xl"
              {...({} as any)}
            >
              <Typography
                variant="h4"
                color="blue-gray"
                className="text-3xl font-bold text-blue-gray-900"
                {...({} as any)}
              >
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
                      
                      size="lg"
                      placeholder="Título del post"
                      {...({} as any)}
                      
                      value={post?.title}
                      onChange={(e) =>
                        setPost({ ...post!, title: e.target.value })
                      }
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
                      
                      {...({} as any)}
                      
                      size="lg"
                      placeholder="Nombre Autor"
                      value={post?.name_author}
                      onChange={(e) =>
                        setPost({ ...post!, name_author: e.target.value })
                      }
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
                      {...({} as any)}
                      
                      size="lg"
                      labelProps={{ className: "hidden" }}
                      className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
                      placeholder="Tag"
                      value={post.tag}
                      onChange={(value) => {
                        if (value) {
                          console.log("Selected value:", value);
                          setPost({ ...post!, tag: value });
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
                      
                      {...({} as any)}
                      
                      placeholder="Fecha"
                      type="date"
                      value={post?.date}
                      onChange={(e) =>
                        setPost({ ...post!, date: e.target.value })
                      }
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
                      
                      {...({} as any)}
                      
                      size="lg"
                      placeholder="Número de empleado"
                      value={post?.num_empleado}
                      onChange={(e) =>
                        setPost({
                          ...post!,
                          num_empleado: Number(e.target.value),
                        })
                      }
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
                      {...({} as any)}
                      
                      size="lg"
                      placeholder="Descripción"
                      value={post?.desc}
                      onChange={(e) =>
                        setPost({ ...post!, desc: e.target.value })
                      }
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
                    {...({} as any)}
                    
                    
                    size="lg"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={post.videoUrl || ""}
                    onChange={(e) =>
                      setPost({ ...post, videoUrl: e.target.value })
                    }
                    className="w-full text-blue-gray-800 placeholder:text-blue-gray-500 placeholder:font-medium focus:border-t-blue-800 border-t-blue-gray-600 bg-white/90"
                  />
                </div>

                <div>
                  <Input
                    
                    {...({} as any)}
                    
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
    );
}

    export default PostForm;