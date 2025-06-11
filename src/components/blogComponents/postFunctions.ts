import axios from "axios";
import { Post } from "@/lib/interfaces";
import { da } from "date-fns/locale";
    
    export const fetchPosts = async (): Promise<Post[]>  => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Post[] = await response.json();
        return data;

      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    };

    export const deletePost = async (idBlog: number, postDeleted: Post | undefined): Promise<boolean> => {

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/EliminarPost`,
                {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idBlog: idBlog }),
                  }
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            console.log("Post eliminado con éxito", result);

            if (postDeleted?.img && postDeleted.img.length > 0) {
                const res = await axios.post("/api/deleteImages", { images: postDeleted.img });
                console.log("Imágenes eliminadas correctamente:", res.data);
              }

            return true;
        } catch (error) {
            console.error("Error al eliminar post:", error);
            return false;
          }
        };
        
export const uploadImages = async (imgFiles: File[], num_empleado: number): Promise<string[]> => {
    const formData = new FormData();
    imgFiles.forEach((file) => formData.append("images", file));
    formData.append("num_empleado", num_empleado.toString());

    try
    {
        const res = await axios.post("/api/uploadImages", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Imágenes subidas correctamente:", res.data);
        return res.data.imageUrls; 
    }
    catch(error) {
        console.error("Error al subir imágenes:", error);
        return [];
    }
}

export const addPost = async (newPost: Post): Promise<Post | null> => {
    try{
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/Agregarpost`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newPost),
            }
          );

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        console.log("Post agregado con éxito", result);
        return {
            ...newPost,
            idBlog: result.insertId || result.idBlog,
          };
    }

    catch (error) {
        console.error("Error al agregar post:", error);
        return null;
      }
    };
