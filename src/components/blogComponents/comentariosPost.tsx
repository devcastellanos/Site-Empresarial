"use client";

import { Comentarios } from "@/lib/interfaces";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import Swal from "sweetalert2";

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

  const confirmarEliminacion = (idComentario: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleEliminar(idComentario);
      }
    });
  }

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
    <div className="mt-10">
      <h4 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">Comentarios</h4>

      {comentarios.map((c) => (
        <div
          key={c.idComentario}
          className="mb-6 bg-white shadow-sm border border-gray-200 rounded-xl p-5 transition hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-gray-700">Empleado #{c.num_empleado}</span>

            {(user && (user.rol === "admin" || user.rol === "Capacitacion")) && (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditando(c)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => confirmarEliminacion(c.idComentario)}>Eliminar</Button>
              </div>
            )}
          </div>

          {editando?.idComentario === c.idComentario ? (
            <div className="space-y-2 mt-2">
              <Textarea
                value={editando.contenido}
                onChange={(e) => setEditando({ ...editando, contenido: e.target.value })}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleGuardarEdicion}>Guardar</Button>
                <Button size="sm" variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-800 mt-1 leading-relaxed">{c.contenido}</p>
          )}
        </div>
      ))}

      {/* Nuevo comentario */}
      <div className="mt-10 bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
        <Label className="block text-sm font-medium text-gray-700 mb-2">Nuevo comentario</Label>
        <Textarea
          placeholder="Escribe tu comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className="mb-3"
        />
        <Button onClick={handleAgregar}>Comentar</Button>
      </div>
    </div>
  );

};

export default ComentariosPost;
