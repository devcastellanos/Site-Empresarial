"use client";

import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import { useAuth } from './hooks/useAuth';

const TABLE_HEAD = ["Usuarios", "Nombre", "Status", "Acciones"];

interface Usuario {
  id?: number;
  name: string;
  email: string;
  password?: string;
  status: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({ id: 0, name: "", email: "", password: "", status: "Activo" });
  const { isAuthenticated } = useAuth();

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/usuarios");
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
        ? "http://api-cursos.192.168.29.40.sslip.io/actualizarUsuario"
        : "http://api-cursos.192.168.29.40.sslip.io/agregarUsuario";

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
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/eliminarUsuario", {
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
    <Card className="h-full w-full" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
      <CardHeader floated={false} shadow={false} className="rounded-none" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        <div className="mb-8 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">Usuarios</Typography>
          <Button className="flex items-center gap-3" size="sm" onClick={() => handleOpenModal()} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
            <UserPlusIcon className="h-4 w-4" /> Add member
          </Button>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0" onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal opacity-70" onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">{head}</Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(({ id, name, email, status }) => (
              <tr key={id} className="border-b border-blue-gray-50">
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">{name}</Typography>
                  <Typography variant="small" color="blue-gray" onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="" className="opacity-70">{email}</Typography>
                </td>
                <td className="p-4">{name}</td>
                <td className="p-4">
                  <Chip variant="ghost" size="sm" value={status} color={status === "Activo" ? "green" : "blue-gray"} />
                </td>
                <td className="p-4">
                  { status === 'Activo' ? (<div>
                    <Tooltip content="Edit User">
                      <IconButton variant="text" onClick={() => handleOpenModal({ id, name, email, status })} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete User">
                      <IconButton variant="text" onClick={() => id !== undefined && handleDeleteUsuario(id)} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </div>) : null}
                  
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <Dialog open={openModal} handler={() => handleOpenModal()} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder=""> 
        <DialogHeader onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">{currentUsuario.id ? "Edit User" : "Add User"}</DialogHeader>
        <DialogBody onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
          <div className="flex flex-col gap-4">
            <Input label="Name" value={currentUsuario.name} onChange={(e) => setCurrentUsuario({ ...currentUsuario, name: e.target.value })} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="" crossOrigin="" />
            <Input label="Email" value={currentUsuario.email} onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="" crossOrigin=""/>
            <Input label="Password" type="password" value={currentUsuario.password || ""} onChange={(e) => setCurrentUsuario({ ...currentUsuario, password: e.target.value })}onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="" crossOrigin="" />
          </div>
        </DialogBody>
        <DialogFooter onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
          <Button variant="text" color="red" onClick={() => handleOpenModal()} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">Cancel</Button>
          <Button variant="gradient" color="green" onClick={() => handleSaveUsuario(currentUsuario)} onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">Save</Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default Usuarios;
