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
import Swal
  from "sweetalert2";
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
  const { isAuthenticated } = useAuth();

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
                <div className="col-span-3">
                  <Typography className="font-semibold text-blue-gray-900 text-center" {...({} as any)}>{name}</Typography>
                </div>
                <div className="col-span-4">
                  <Typography className="text-sm text-blue-gray-700 opacity-80 truncate" {...({} as any)}>{email}</Typography>
                </div>
                <div className="col-span-2">
                  <Typography className="text-sm text-blue-gray-700 opacity-80 text-center" {...({} as any)}>{rol}</Typography>
                </div>
                <div className="col-span-2">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value={status}
                    color={status === "Activo" ? "green" : "blue-gray"}
                    className="w-full text-center text-xs px-1 py-0.5 font-medium"
                  />
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  {status === "Activo" && (
                    <>
                      <Tooltip content="Editar">
                        <IconButton
                          variant="text"
                          className="hover:bg-white/70 p-1"
                          {...({} as any)}
                          onClick={() =>
                            handleOpenModal({ id, name, email, status, num_empleado, rol })
                          }
                        >
                          <PencilIcon className="h-3.5 w-3.5 text-blue-gray-800" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar">
                        <IconButton
                          variant="text"
                          className="hover:bg-white/70 p-1"
                          {...({} as any)}
                          onClick={() => id !== undefined && handleDeleteUsuario(id)}
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
            <Input label="Nombre" value={currentUsuario.name}  {...({} as any)} onChange={(e) => setCurrentUsuario({ ...currentUsuario, name: e.target.value })} />
            <Input label="Correo" value={currentUsuario.email}  {...({} as any)} onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })} />
            <Input label="Contraseña" type="password" value={currentUsuario.password || ""}  {...({} as any)} onChange={(e) => setCurrentUsuario({ ...currentUsuario, password: e.target.value })} />
            <Input label="Rol" type="text" value={currentUsuario.rol}  {...({} as any)} onChange={(e) => setCurrentUsuario({ ...currentUsuario, rol: e.target.value })} />
            <Input label="Número de empleado" type="number" value={currentUsuario.num_empleado}  {...({} as any)} onChange={(e) => setCurrentUsuario({ ...currentUsuario, num_empleado: Number(e.target.value) })} disabled={currentUsuario.id !== undefined} />
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
