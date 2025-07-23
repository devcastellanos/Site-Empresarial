"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { MatrizAsignacionCursos } from "./matrizPlan";
import { FormularioEtapas } from "./FormularioEtapas";
import { Button } from "@/components/ui/button";
import { PlusCircle, Table } from "lucide-react";

export default function VistaPlanEstudios() {
  const { user } = useAuth();

  type Curso = {
    id_etapa: number;
    etapa: string;
    id_course: number;
    title: string;
    progress?: number;
    description?: string;
  };

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.num_empleado) return;

    const fetchCursos = async () => {
      try {
        const res = await fetch(`http://localhost:3041/usuarios/${user.num_empleado}/planCompleto`);
        if (!res.ok) throw new Error("Error al obtener cursos");
        const data = await res.json();
        setCursos(
          (data.cursos || []).filter((c: Curso) => c.id_course && c.title && c.etapa && c.id_etapa)
        );
      } catch (err) {
        console.error("❌ Error cargando cursos del plan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [user]);

  const etapas = cursos.reduce((acc: Record<string, Curso[]>, curso) => {
    if (!acc[curso.etapa]) acc[curso.etapa] = [];
    acc[curso.etapa].push(curso);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Plan de Estudios</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
  <Button asChild variant="default" className="px-6 py-2 text-base">
    <a href="/PlanEstudio/CrearEtapa">
      <PlusCircle className="inline-block mr-2" size={18} />
      Crear Etapa
    </a>
  </Button>
  <Button asChild variant="secondary" className="px-6 py-2 text-base">
    <a href="/PlanEstudio/Asignar">
      <Table className="inline-block mr-2" size={18} />
      Ver Matriz de Asignación
    </a>
  </Button>
</div>
      {loading ? (
        <p className="text-center">Cargando cursos...</p>
      ) : cursos.length === 0 ? (
        <p className="text-center text-gray-500">No hay cursos asignados actualmente.</p>
      ) : (
        <><div className="space-y-10">
          {Object.entries(etapas).map(([nombreEtapa, cursosEtapa], index) => {
            const completados = cursosEtapa.filter(c => (c.progress ?? 0) >= 100).length;
            const porcentaje = Math.round((completados / cursosEtapa.length) * 100);

            return (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-2">{nombreEtapa}</h2>
                <p className="mb-4 text-blue-600">
                  {completados} / {cursosEtapa.length} cursos completados ({porcentaje}%)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cursosEtapa.map((curso, i) => (
                    <div key={i} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                      <h3 className="text-lg font-semibold flex justify-between mb-2">
                        {curso.title}
                        {curso.progress === 100 ? (
                          <span className="text-green-600 font-medium">✓</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">…</span>
                        )}
                      </h3>
                      <p className="text-gray-600 mb-2">Descripción: {curso.description || '—'}</p>
                      <p className="text-gray-600">Progreso: {curso.progress ?? 0}%</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}

    </div>
  );
}

// Componente de matriz de asignación de cursos (importar en admin dashboard si aplica)
