"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { Course } from "@/lib/interfaces";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Props {
  onAddCourse: (course: Course) => void;
  onClose: () => void;
}

function CourseCatalog2({ onAddCourse, onClose }: Props) {
  const [newCourse, setNewCourse] = useState<Course>({
    id_course: 0,
    title: "",
    description: "",
    area: "",
    tutor: "",
    start_date: "",
    end_date: "",
    status: "Activo",
    noEndDate: false,
    category: "",
  });

  const handleAddMoodle = async (course: Course) => {
    if (!course.title || !course.tutor) {
      Swal.fire("Error", "El título y el instructor son obligatorios", "error");
      return null;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agregarCurso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      if (!res.ok) throw new Error("Error en la solicitud");

      const result = await res.json();
      Swal.fire("Curso agregado", `El curso ${result.title} ha sido agregado correctamente`, "success");
      return result;
    } catch (error) {
      console.error("Error al agregar el curso:", error);
      Swal.fire("Error", "No se pudo agregar el curso", "error");
      return null;
    }
  };

  const handleAddCourse = async () => {
    const result = await handleAddMoodle(newCourse);
    if (result) {
      onAddCourse(newCourse);
      onClose();
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Capacitación Tarahumara</h1>
      <h2 className="text-xl font-semibold">Registrar Nuevo Curso</h2>

      <div className="space-y-2">
        <Label>Título del curso</Label>
        <Input
          placeholder="Título del curso"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        />

        <Label>Descripción del curso</Label>
        <Textarea
          placeholder="Descripción"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        />

        <Label>Impartido por</Label>
        <Input
          placeholder="Instructor"
          value={newCourse.tutor}
          onChange={(e) => setNewCourse({ ...newCourse, tutor: e.target.value })}
        />

        <Label>Categoría</Label>
        <Input
          placeholder="Categoría del curso"
          value={newCourse.category}
          onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAddCourse}>Agregar Curso</Button>
        </div>
      </div>
    </Card>
  );
}

export default CourseCatalog2;