"use client";

import { Comentarios } from "@/lib/interfaces";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";

interface ComentariosPostProps {
  idBlog: number;
  isAdmin?: boolean;
}

const ComentariosPost: React.FC<ComentariosPostProps> = ({ idBlog, isAdmin = false }) => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState<Comentarios[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [editando, setEditando] = useState<Comentarios | null>(null);

  useEffect(() => {
    if (!user) return;

  }, [user]);

  const fetchComentarios = React.useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios`, {
        params: { post: idBlog },
      });
      setComentarios(res.data);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    }
  }, [idBlog]);

  useEffect(() => {
    if (idBlog) fetchComentarios();
  }, [idBlog, fetchComentarios]);

  const handleAgregar = async () => {
    if (!nuevoComentario.trim() || !user?.num_empleado) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios`, {
        idBlog,
        num_empleado: user.num_empleado,
        contenido: nuevoComentario,
      });
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
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comentarios/${editando.idComentario}`, {
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
      <h4 className="text-lg font-semibold mb-3">Comentarios</h4>

      {comentarios.map((c) => (
        <div key={c.idComentario} className="mb-4 bg-white/90 p-4 rounded-xl shadow">
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-bold text-gray-800">Empleado #{c.num_empleado}</span>
            {user?.rol === "admin" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setEditando(c)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleEliminar(c.idComentario)}>Eliminar</Button>
              </div>
            )}
          </div>

          {editando?.idComentario === c.idComentario ? (
            <>
              <Textarea
                value={editando.contenido}
                onChange={(e) => setEditando({ ...editando, contenido: e.target.value })}
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleGuardarEdicion}>Guardar</Button>
                <Button size="sm" variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-sm mt-1">{c.contenido}</p>
          )}
        </div>
      ))}

      <div className="mt-6">
        <Label className="mb-1 block text-sm font-medium text-gray-700">Nuevo comentario</Label>
        <Textarea
          placeholder="Escribe tu comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <Button className="mt-2" onClick={handleAgregar}>Comentar</Button>
      </div>
    </div>
  );
};

export default ComentariosPost;
