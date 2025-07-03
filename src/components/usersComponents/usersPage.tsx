"use client";

import React, { useEffect, useState } from "react";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { useAuth } from '../../hooks/useAuth';
import Swal
  from "sweetalert2";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Label } from "../ui/label";
interface Usuario {
  id?: number;
  name: string;
  email: string;
  password?: string;
  status: string;
  rol?: string;
  num_empleado: number;
}



const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({ id: 0, name: "", email: "", password: "", status: "Activo", num_empleado: 0, rol: "" });
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usuarios`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data: Usuario[] = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsuarios([]);
    }
  };
  useEffect(() => {

    fetchUsuarios();
  }, []);

  useEffect(() => {
    console.log("Usuarios actualizados: ", usuarios);
  }, [usuarios]);

  const handleOpenModal = (usuario?: Usuario) => {
    setCurrentUsuario(usuario || { id: 0, name: "", email: "", password: "", status: "Activo", num_empleado: 0 });
    setOpenModal(!openModal);
  };

  const handleSaveUsuario = async (usuario: Usuario) => {
    try {
      const method = usuario.id ? "PUT" : "POST";
      const url = usuario.id
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/actualizarUsuario`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/agregarUsuario`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const savedUsuario: Usuario = await response.json();

      await fetchUsuarios();

      handleOpenModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente al usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/eliminarUsuario`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));

        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error", "Ocurrió un error al eliminar el usuario.", "error");
      }
    }
  };

  const handleEnviarRecuperacion = async (email: string, num_empleado: number) => {
  const confirm = await Swal.fire({
    title: "¿Enviar recuperación?",
    text: `¿Deseas generar y enviar un enlace para que el usuario cambie su contraseña?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#9A3324",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, enviar",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitar-recuperacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, num_empleado }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al enviar");
    }

    await Swal.fire({
      icon: "success",
      title: "¡Enlace generado y enviado!",
      html: `
        <p>Se envió un enlace de recuperación al correo registrado.</p>
        <p class="mt-2"><strong>Link generado:</strong></p>
        <code style="display:block; word-break:break-all; background:#f4f4f4; padding:8px; border-radius:6px;">
          ${data.enlace}
        </code>
      `,
      showCancelButton: true,
      confirmButtonText: "Copiar link",
      cancelButtonText: "Cerrar",
      confirmButtonColor: "#9A3324",
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(data.enlace);
        Swal.fire("Copiado", "El enlace fue copiado al portapapeles", "success");
      }
    });
  } catch (err: any) {
    Swal.fire("Error", err.message || "No se pudo generar el enlace", "error");
  }
};

useEffect(() => {
  const term = searchTerm.toLowerCase();
  const filtered = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(term)
  );
  setFilteredUsuarios(filtered);
}, [searchTerm, usuarios]);

  return (
    <div className="flex justify-center items-center w-full pb-20">
      <Card className="w-full max-w-6xl mt-32 bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-6" {...({} as any)}>
        <CardHeader className="rounded-xl mb-6 bg-white/70 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-xl font-semibold ">Gestión de Usuarios</h4>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-green-600 hover:bg-green-700 text-white shadow-md px-3 py-2"
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-6 space-y-4 bg-white/60 rounded-b-xl">
          {/* Título y buscador */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Usuarios registrados</h2>
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reiniciar página si cambia filtro
              }}
              className="max-w-sm"
            />
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Correo electrónico</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Rol</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Estado</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsuarios
                  .slice((currentPage - 1) * 10, currentPage * 10)
                  .map(({ id, name, email, rol, status, num_empleado }) => (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{name}</td>
                      <td className="px-6 py-3 text-gray-700">{email}</td>
                      <td className="px-6 py-3 text-gray-700">{rol}</td>
                      <td className="px-6 py-3 text-center">
                        <Badge
                          variant={status === "Activo" ? "default" : "outline"}
                          className={`text-xs ${status === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                        >
                          {status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleOpenModal({ id, name, email, status, num_empleado, rol })}
                        >
                          <PencilIcon className="h-4 w-4 text-gray-700" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => id !== undefined && handleDeleteUsuario(id)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleEnviarRecuperacion(email, num_empleado)}
                        >
                          🔐
                        </Button>
                      </td>
                    </tr>
                  ))}

                {filteredUsuarios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay usuarios disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {filteredUsuarios.length > 10 && (
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-gray-600">
                Página {currentPage} de {Math.ceil(filteredUsuarios.length / 10)}
              </span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < Math.ceil(filteredUsuarios.length / 10) ? prev + 1 : prev
                    )
                  }
                  disabled={currentPage >= Math.ceil(filteredUsuarios.length / 10)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className=" backdrop-blur-xl rounded-xl shadow-lg p-6 max-w-lg w-full">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {currentUsuario.id ? "Editar usuario" : "Agregar usuario"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                  value={currentUsuario.name}
                  onChange={(e) => setCurrentUsuario({ ...currentUsuario, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={currentUsuario.email}
                  onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={currentUsuario.password || ""}
                  onChange={(e) => setCurrentUsuario({ ...currentUsuario, password: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Rol</Label>
                <Select
                  value={currentUsuario.rol || ""}
                  onValueChange={(val) => setCurrentUsuario({ ...currentUsuario, rol: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
  {user?.rol === "admin" && (
    <>
      <SelectItem value="admin">Administrador</SelectItem>
      <SelectItem value="Usuario común">Usuario</SelectItem>
      <SelectItem value="Gerente">Gerente</SelectItem>
      <SelectItem value="Coordinador">Coordinador</SelectItem>
      <SelectItem value="Jefe">Jefe</SelectItem>
      <SelectItem value="Nominas">Nóminas</SelectItem>
      <SelectItem value="Capacitacion">Capacitación</SelectItem>
      <SelectItem value="Reclutamiento">Reclutamiento</SelectItem>
      <SelectItem value="Subjefe">Subjefe</SelectItem>
      <SelectItem value="Direccion">Dirección</SelectItem>
      <SelectItem value="Director">Director</SelectItem>
    </>
  )}

  {user?.rol === "Capacitacion" && (
    <>
      <SelectItem value="Usuario común">Usuario</SelectItem>
      <SelectItem value="Gerente">Gerente</SelectItem>
      <SelectItem value="Coordinador">Coordinador</SelectItem>
      <SelectItem value="Jefe">Jefe</SelectItem>
      <SelectItem value="Nominas">Nóminas</SelectItem>
      <SelectItem value="Capacitacion">Capacitación</SelectItem>
      <SelectItem value="Reclutamiento">Reclutamiento</SelectItem>
      <SelectItem value="Subjefe">Subjefe</SelectItem>
      <SelectItem value="Direccion">Dirección</SelectItem>
      <SelectItem value="Director">Director</SelectItem>
    </>
  )}
</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Número de empleado</Label>
                <Input
                  type="number"
                  value={currentUsuario.num_empleado}
                  onChange={(e) =>
                    setCurrentUsuario({ ...currentUsuario, num_empleado: Number(e.target.value) })
                  }
                  disabled={currentUsuario.id !== undefined}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={() => handleSaveUsuario(currentUsuario)} className="bg-green-600 hover:bg-green-700 text-white">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default UsuariosPage;
