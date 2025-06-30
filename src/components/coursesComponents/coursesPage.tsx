"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CourseCatalog2 from "./createCourse";
import AssignDepartmentModal from "./courseByDepartment";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from "@/lib/interfaces";
import { useAuth } from "@/app/context/AuthContext";

function CourseCatalog() {
  const [formatJson, setFormatJson] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [visibleCourses, setVisibleCourses] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cursosPresenciales`)
      .then(res => res.json())
      .then(setFormatJson)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/departments`)
      .then(res => res.json())
      .then(data => setDepartments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const filteredCourses = formatJson.filter(course => {
    const title = course.title || "";
    const description = course.description || "";
    const term = searchTerm.toLowerCase();
    return title.toLowerCase().includes(term) || description.toLowerCase().includes(term);
  });

  const handleSaveEdit = async () => {
    if (!editCourse) return;
    setFormatJson(prev => prev.map(c => c.id_course === editCourse.id_course ? editCourse : c));
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/actualizarCurso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCourse),
    }).catch(console.error);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCourse = async (course: Course) => {
    setFormatJson(prev => prev.filter(c => c.id_course !== course.id_course));
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/eliminarCurso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    }).catch(console.error);
  };

  return (
    <div className="relative w-full h-auto flex items-top justify-center mt-40">
      <Card className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-6">Cursos</h1>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <Input
            placeholder="Buscar por título o descripción"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="md:w-2/3"
          />
          {(user?.rol === "admin" || user?.rol === "Capacitacion") && (
            <>
              <Button onClick={() => setIsModalOpen(true)}>
                <FaPlus className="mr-2" /> Agregar Curso
              </Button>
            </>
          )}

        </div>

        <div className="grid grid-cols-4 gap-4 font-semibold text-gray-700 p-4 bg-white rounded-lg shadow">
          <span>Título</span>
          <span>Descripción</span>
          <span>Impartido por</span>
          <span className="text-center">Acciones</span>
        </div>

        {filteredCourses.slice(0, visibleCourses).map(course => (
          <div key={course.id_course} className="grid grid-cols-4 gap-4 items-center p-4 bg-white/70 rounded-lg">
            <span>{course.title}</span>
            <span>{course.description}</span>
            <span>{course.tutor}</span>
            <div className="flex justify-center gap-2">
              <Button variant="ghost" onClick={() => { setSelectedCourse(course); setIsDialogOpen(true); }}><FaEye /></Button>´
              {(user?.rol === "admin" || user?.rol === "Capacitacion") && (
                <>
                  <Button variant="ghost" onClick={() => { setEditCourse(course); setIsEditDialogOpen(true); }}><FaEdit /></Button>
                  <Button variant="ghost" onClick={() => handleDeleteCourse(course)}><FaTrash /></Button>
                  <Button variant="default" onClick={() => { setSelectedCourse(course); setIsAssignModalOpen(true); }}><FaPlus /></Button>
                </>
              )}
            </div>
          </div>
        ))}

        {visibleCourses < filteredCourses.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => setVisibleCourses(prev => prev + 5)}>Ver más</Button>
          </div>
        )}

        {/* Dialogs */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Curso</DialogTitle>
              <DialogDescription>
                <p><strong>Título:</strong> {selectedCourse?.title}</p>
                <p><strong>Descripción:</strong> {selectedCourse?.description}</p>
                <p><strong>Impartido por:</strong> {selectedCourse?.tutor}</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="destructive">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Curso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={editCourse?.title} onChange={(e) => setEditCourse({ ...editCourse!, title: e.target.value })} />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea value={editCourse?.description} onChange={(e) => setEditCourse({ ...editCourse!, description: e.target.value })} />
              </div>
              <div>
                <Label>Tutor</Label>
                <Input value={editCourse?.tutor} onChange={(e) => setEditCourse({ ...editCourse!, tutor: e.target.value })} />
              </div>
              <div>
                <Label>Categoría</Label>
                <Select value={editCourse?.category} onValueChange={(value) => setEditCourse({ ...editCourse!, category: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basicos">Básicos</SelectItem>
                    <SelectItem value="Tecnicos">Técnicos</SelectItem>
                    <SelectItem value="Practicos">Prácticos</SelectItem>
                    <SelectItem value="Habilidades y competencias">Habilidades y competencias</SelectItem>
                    <SelectItem value="Formacion">Formación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Guardar</Button>
              <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="p-0">
            <CourseCatalog2 onAddCourse={(course) => setFormatJson(prev => [...prev, course])} onClose={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent>
            <AssignDepartmentModal
              course={selectedCourse!}
              onClose={() => setIsAssignModalOpen(false)}
              onAssign={(course, department) => {
                console.log(`Asignado curso: ${course.title} al departamento: ${department}`);
              }}
              departments={departments}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}

export default CourseCatalog;