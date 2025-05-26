import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useAuth } from "@/app/context/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardHeader } from "@/components/ui/card";


export default function Reclutamiento() {


  return (
    <Card className="w-full h-full">
        <CardHeader className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Requisiciones Aprobadas</h2>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/Perfil">Perfil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Requsiciones de Personal aprobadas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            <Dialog>
                <DialogTrigger className="btn btn-primary">Crear Campaña</DialogTrigger>
                <DialogContent>
                    <DialogHeader>Crear Nueva Campaña</DialogHeader>
                    {/* Aquí iría el formulario para crear una nueva campaña */}
                    <DialogClose className="btn btn-secondary">Cerrar</DialogClose>
                </DialogContent>
            </Dialog>
        </CardHeader>
        
    </Card>

  );
}