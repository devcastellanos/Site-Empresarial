"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { CursoTomado } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

function Courses() {
  const [cursosTomados, setCursosTomados] = useState<CursoTomado[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const { user } = useAuth();

  const fetchCourses = async () => {
    try {
      const datacourse = await fetch(
        "http://api-cursos.192.168.29.40.sslip.io/cursostomados"
      );
      const data = await datacourse.json();
      const dataUser = data
        .filter((course: CursoTomado) => course.id_usuario === user?.num_empleado)
        .filter((course: CursoTomado) => course.status === "true");
      setCursosTomados(dataUser);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getBadge = (progress: number) => {
    if (progress === 100) {
      return (
        <Badge className="bg-green-600 text-white hover:bg-green-700">
          Completado
        </Badge>
      );
    } else if (progress === 0) {
      return (
        <Badge className="bg-gray-500 text-white hover:bg-gray-600">
          Pendiente
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
          En progreso
        </Badge>
      );
    }
  };

  const cursosFiltrados = cursosTomados.filter((curso) => {
    const progress = parseInt(curso.progress || "0");
  
    if (filtroStatus === "pendiente") return progress === 0;
    if (filtroStatus === "progreso") return progress > 0 && progress < 100;
    if (filtroStatus === "completado") return progress === 100;
  
    return true; // "todos"
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm flex items-center gap-3">
            🎓 Mis Cursos
          </h1>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="progreso">En progreso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
      </Card>

      <div className="space-y-6">
        {cursosFiltrados.map((curso) => {
          const progress = parseInt(curso.progress || "0");

          return (
            <Card
              key={`${curso.id_course}-${curso.start_date}`}
              className="rounded-3xl border border-muted bg-white/80 backdrop-blur-lg shadow-md p-2"
            >
              <CardHeader className="pb-1 relative">
                {/* Badge en esquina superior derecha */}
                <div className="absolute top-4 right-4">
                  {getBadge(progress)}
                </div>

                <CardTitle className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                  {curso.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {curso.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <p>
                    <strong className="text-muted-foreground">Tutor:</strong>{" "}
                    {curso.tutor}
                  </p>
                  <p>
                    <strong className="text-muted-foreground">Fechas:</strong>{" "}
                    {curso.start_date
                      ? `${curso.start_date} ${
                          curso.end_date ? `– ${curso.end_date}` : ""
                        }`
                      : "Sin fecha asignada"}
                  </p>
                </div>

                <div>
                  <Progress value={progress} />
                  <p className="text-xs text-right text-muted-foreground mt-1">
                    {progress}% completado
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;
