"use client";

import React, { useEffect, useState } from "react";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import { useAuth } from '../../hooks/useAuth';
interface Usuario {
  id?: number;
  name: string;
  email: string;
  password?: string;
  status: string;
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({ id: 0, name: "", email: "", password: "", status: "Activo" });
  const { isAuthenticated } = useAuth();

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("https://apicursos.in.grupotarahumara.com.mx/usuarios");
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

  const handleOpenModal = (usuario?: Usuario) => {
    setCurrentUsuario(usuario || { id: 0, name: "", email: "", password: "", status: "Activo" });
    setOpenModal(!openModal);
  };

  const handleSaveUsuario = async (usuario: Usuario) => {
    try {
      const method = usuario.id ? "PUT" : "POST";
      const url = usuario.id
        ? "https://apicursos.in.grupotarahumara.com.mx/actualizarUsuario"
        : "https://apicursos.in.grupotarahumara.com.mx/agregarUsuario";

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
    try {
      const response = await fetch("https://apicursos.in.grupotarahumara.com.mx/eliminarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full pb-20">
    <Card className="w-full max-w-6xl mt-32 bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-6" {...({} as any)}>
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-xl mb-6 bg-white/70 backdrop-blur-md shadow-lg"
        {...({} as any)}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Typography variant="h4" className="text-blue-gray-900 font-semibold" {...({} as any)}>
            Gestión de Usuarios
          </Typography>
          <IconButton
            onClick={() => handleOpenModal()}
            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
            title="Agregar usuario"
            {...({} as any)}
          >
            <UserPlusIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </CardHeader>

      <CardBody className="px-4 space-y-3" {...({} as any)}>
        <div className="grid grid-cols-12 px-4 py-2 bg-white/50 backdrop-blur-md rounded-md font-semibold text-blue-gray-700 text-center">
          <div className="col-span-3 text-center">Nombre</div>
          <div className="col-span-5">Correo electrónico</div>
          <div className="col-span-2 text-center">Estado</div>
          <div className="col-span-2 text-center">Acciones</div>
        </div>

          {usuarios.length > 0 ? (
            usuarios.map(({ id, name, email, status }) => (
              <div
                key={id}
                className="grid grid-cols-12 items-center bg-white/40 backdrop-blur-md rounded-lg px-4 py-3 shadow-sm hover:bg-white/60 transition"
              >
                {/* Nombre */}
                <div className="col-span-3">
                  <Typography className="font-semibold text-blue-gray-900 text-center" {...({} as any)}>{name}</Typography>
                </div>

                {/* Email (más grande) */}
                <div className="col-span-5">
                  <Typography className="text-sm text-blue-gray-700 opacity-80 truncate" {...({} as any)}>{email}</Typography>
                </div>

                {/* Estado (más pequeño) */}
                <div className="col-span-2">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value={status}
                    color={status === "Activo" ? "green" : "blue-gray"}
                    className="w-full text-center text-xs px-1 py-0.5 font-medium"
                  />
                </div>

                {/* Iconos (más pequeños y ajustados) */}
                <div className="col-span-2 flex justify-end gap-2">
                  {status === "Activo" && (
                    <>
                      <Tooltip content="Editar">
                        <IconButton
                          variant="text"
                          className="hover:bg-white/70 p-1"
                          onClick={() => handleOpenModal({ id, name, email, status })}
                          {...({} as any)}
                        >
                          <PencilIcon className="h-3.5 w-3.5 text-blue-gray-800" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar">
                        <IconButton
                          variant="text"
                          className="hover:bg-white/70 p-1"
                          onClick={() => id !== undefined && handleDeleteUsuario(id)}
                          {...({} as any)}
                        >
                          <TrashIcon className="h-3.5 w-3.5 text-red-600" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Typography className="text-center text-blue-gray-600" {...({} as any)}>
              No hay usuarios disponibles.
            </Typography>
          )}
        </CardBody>


        <Dialog open={openModal} handler={() => handleOpenModal()} className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6" {...({} as any)}>
          <DialogHeader className="text-blue-gray-800" {...({} as any)}>{currentUsuario.id ? "Editar usuario" : "Agregar usuario"}</DialogHeader>
          <DialogBody className="space-y-4" {...({} as any)}>
            <Input label="Nombre" value={currentUsuario.name} crossOrigin="anonymous" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} onChange={(e) => setCurrentUsuario({ ...currentUsuario, name: e.target.value })} />
            <Input label="Correo" value={currentUsuario.email} crossOrigin="anonymous" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })} />
            <Input label="Contraseña" type="password" value={currentUsuario.password || ""} crossOrigin="anonymous" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} onChange={(e) => setCurrentUsuario({ ...currentUsuario, password: e.target.value })} />
          </DialogBody>
          <DialogFooter className="mt-4" {...({} as any)}>
            <Button variant="text" color="red" onClick={() => handleOpenModal()} {...({} as any)}>Cancelar</Button>
            <Button variant="gradient" color="green" onClick={() => handleSaveUsuario(currentUsuario)} {...({} as any)}>Guardar</Button>
          </DialogFooter>
        </Dialog>
    </Card>
    </div>
  );
};

export default UsuariosPage;
