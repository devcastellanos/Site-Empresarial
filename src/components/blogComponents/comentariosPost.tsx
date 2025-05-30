"use client";

import {Comentarios} from "@/lib/interfaces"

import React, { useEffect, useState } from "react";
import { Button, Textarea, Typography, Input } from "@material-tailwind/react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { get } from "http";

interface ComentariosPostProps {
  idBlog: number;
  isAdmin?: boolean;
}

const ComentariosPost: React.FC<ComentariosPostProps> = ({ idBlog, isAdmin = false }) => {
    const isAdminRef = React.useRef(isAdmin);
  const [user, setUser] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Comentarios[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [editando, setEditando] = useState<Comentarios | null>(null);


  const getProfile = async () => {
    try {
      const response = await axios.get("/api/auth/profile", { withCredentials: true });
      const userData = response.data.user;
      if (userData.rol === "admin") isAdminRef.current = true;
      return userData;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getProfile();
      setUser(profile);
    };
    fetchUser();
  }, []);
  


  const fetchComentarios = React.useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios`, {
        params: { post: idBlog },
      });
      setComentarios(res.data);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    }
  }, [idBlog]);  // Add dependencies here
  
  useEffect(() => {
    if (idBlog) fetchComentarios();
  }, [idBlog, fetchComentarios]); 

  const handleAgregar = async () => {

    console.log("Datos enviados:", {
        idBlog,
        num_empleado: user?.num_empleado,
        contenido: nuevoComentario,
      });
    if (!nuevoComentario.trim() || !user?.num_empleado) return;

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios`, {
            idBlog,
            num_empleado: user.num_empleado,
            contenido: nuevoComentario,
          });
          console.log("Comentario enviado:", response.data);
      setNuevoComentario("");
      fetchComentarios();
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const handleEliminar = async (idComentario: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios/${idComentario}`);
      fetchComentarios();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  const handleGuardarEdicion = async () => {
    if (!editando) return;

    try {
      await axios.put(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios/${editando.idComentario}`, {
        contenido: editando.contenido,
      });
      setEditando(null);
      fetchComentarios();
    } catch (error) {
      console.error("Error al editar comentario:", error);
    }
  };

  return (
    <div className="mt-6">
      <Typography variant="h6" className="mb-2"{...({} as any)}>Comentarios</Typography>

      {comentarios.map((c) => (
        <div key={c.idComentario} className="mb-3 bg-white/90 p-4 rounded shadow">
          <div className="flex justify-between items-start mb-1">
            <Typography variant="small" className="text-gray-700 font-bold"{...({} as any)}>
              Empleado #{c.num_empleado}
            </Typography>

            {user?.rol === "admin" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setEditando(c)}{...({} as any)}>Editar</Button>
                <Button size="sm" color="red" onClick={() => handleEliminar(c.idComentario)}{...({} as any)}>Eliminar</Button>
              </div>
            )}
          </div>

          {editando?.idComentario === c.idComentario ? (
            <>
              <Textarea
                value={editando.contenido}
                onChange={(e) =>
                  setEditando({ ...editando, contenido: e.target.value })
                }
              {...({} as any)}/>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleGuardarEdicion}{...({} as any)}>Guardar</Button>
                <Button size="sm" color="gray" onClick={() => setEditando(null)}{...({} as any)}>Cancelar</Button>
              </div>
            </>
          ) : (
            <Typography variant="paragraph"{...({} as any)}>{c.contenido}</Typography>
          )}
        </div>
      ))}

      <div className="mt-4">
        <Textarea
          label="Nuevo comentario"
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        {...({} as any)}/>
        <Button className="mt-2" onClick={handleAgregar}{...({} as any)}>
          Comentar
        </Button>
      </div>
    </div>
  );
};

export default ComentariosPost;

