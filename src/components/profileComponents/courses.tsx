"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { CursoTomado } from "@/lib/interfaces";
import { useEffect, useState } from "react";


function Courses() {

    const[cursosTomados, setCursosTomados] = useState<CursoTomado[]>([]);
      const fetchCourses = async () => {
        try {

          const datacourse = await fetch(
            "http://api-cursos.192.168.29.40.sslip.io/cursostomados"
          );
          const data = await datacourse.json();
          const dataUser = data.filter((course: CursoTomado) => course.id_usuario === 2294);

          setCursosTomados(dataUser);


        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        fetchCourses();
      }, []);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Cursos</h1>

      <div className="space-y-6">
        {cursosTomados.map((curso) => (
          <Card key={`${curso.id_course}-${curso.start_date}`} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{curso.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {curso.description}
                  </p>
                </div>
                {curso.progress === '100' ? (
                  <Badge variant="default">Completado</Badge>
                ) : curso.progress === '0' ? (
                  <Badge variant="secondary">Pendiente</Badge>
                ) : (
                  <Badge variant="default">En progreso</Badge>
                )}

              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="text-sm">
                <p><strong>Tutor:</strong> {curso.tutor}</p>
                <p>
                  <strong>Fechas:</strong>{" "}
                  {curso.start_date
                    ? `${curso.start_date} ${curso.end_date ? `– ${curso.end_date}` : ""}`
                    : "Sin fecha asignada"}
                </p>
              </div>

              <div className="mt-2">
                <Progress value={parseInt(curso.progress)} />
                <p className="text-xs text-right mt-1">
                  {curso.progress}% completado
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Courses;
