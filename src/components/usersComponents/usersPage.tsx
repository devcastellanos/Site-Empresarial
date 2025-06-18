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

        <CardContent className="px-4 space-y-3">
          <div className="grid grid-cols-12 px-4 py-2 bg-white/50 backdrop-blur-md rounded-md font-semibold text-center text-sm">
            <div className="col-span-3">Nombre</div>
            <div className="col-span-4">Correo electrónico</div>
            <div className="col-span-2">Rol</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-1">Acciones</div>
          </div>

          {usuarios.length > 0 ? (
            usuarios.map(({ id, name, email, rol, status, num_empleado }) => (
              <div
                key={id}
                className="grid grid-cols-12 items-center bg-white/40 backdrop-blur-md rounded-lg px-4 py-3 shadow-sm hover:bg-white/60 transition"
              >
                <div className="col-span-3 text-center font-semibold ">{name}</div>
                <div className="col-span-4 truncate text-sm  opacity-80">{email}</div>
                <div className="col-span-2 text-center text-sm  opacity-80">{rol}</div>
                <div className="col-span-2 flex justify-center">
                  <Badge variant={status === "Activo" ? "default" : "outline"} className="text-xs px-2 py-0.5">
                    {status}
                  </Badge>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  {status === "Activo" && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-white/70 p-1"
                              onClick={() => handleOpenModal({ id, name, email, status, num_empleado, rol })}
                            >
                              <PencilIcon className="h-4 w-4 " />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-white/70 p-1"
                              onClick={() => id !== undefined && handleDeleteUsuario(id)}
                            >
                              <TrashIcon className="h-4 w-4 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm">No hay usuarios disponibles.</div>
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
                    {(user?.rol === "admin" || currentUsuario.rol === "admin") && (
  <SelectItem value="admin">Administrador</SelectItem>
)}
                    <SelectItem value="Usuario común">Usuario</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Coordinador">Coordinador</SelectItem>
                    <SelectItem value="Jefe">Jefe</SelectItem>
                    <SelectItem value="nominas">Nóminas</SelectItem>
                    <SelectItem value="atraccion de talento">Atracción de Talento</SelectItem>
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
