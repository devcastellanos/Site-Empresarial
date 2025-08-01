"use client";

import { useEffect, useState } from "react";

type Plan = { id_plan: number; nombre: string };
type Curso = { id_course: number; title: string; description: string };
type Etapa = { id_etapa: number; nombre: string };

let nextEtapaId = 1000;

export default function PlanEstudioPage() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [cursosCatalogo, setCursosCatalogo] = useState<Curso[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [cursosPorEtapa, setCursosPorEtapa] = useState<Record<number, Curso[]>>({});
  const [planSeleccionado, setPlanSeleccionado] = useState<number | null>(null);
  const [nuevoNombreEtapa, setNuevoNombreEtapa] = useState("");

  useEffect(() => {
    const mockPlanes: Plan[] = [
      { id_plan: 1, nombre: "Ing. Desarrollador Jr" },
      { id_plan: 2, nombre: "Jefe de Inventarios" },
      { id_plan: 3, nombre: "Coordinador de Soporte e Infraestructura" },
      { id_plan: 4, nombre: "Auxiliar Administrativo" },
    ];

    const mockCursos: Curso[] = [
      { id_course: 101, title: "Introducción a la empresa", description: "Visión general de la organización y su cultura." },
      { id_course: 102, title: "Fundamentos de desarrollo web", description: "HTML, CSS y JavaScript para nuevos desarrolladores." },
      { id_course: 103, title: "Gestión de inventarios", description: "Técnicas para controlar y optimizar inventarios." },
      { id_course: 104, title: "Atención a usuarios internos", description: "Buenas prácticas en soporte técnico." },
      { id_course: 105, title: "Normas de seguridad TI", description: "Políticas básicas para proteger sistemas de información." },
      { id_course: 106, title: "Excel intermedio", description: "Funciones, tablas dinámicas y análisis de datos." },
      { id_course: 107, title: "Comunicación organizacional", description: "Mejorar la comunicación interna y externa." },
      { id_course: 108, title: "Introducción a redes", description: "Fundamentos de redes de datos y cableado estructurado." },
    ];

    setPlanes(mockPlanes);
    setCursosCatalogo(mockCursos);
  }, []);

  useEffect(() => {
    if (planSeleccionado) {
      const mockEtapas: Etapa[] = [
        { id_etapa: 1, nombre: "Inducción" },
        { id_etapa: 2, nombre: "Formación Técnica" },
        { id_etapa: 3, nombre: "Especialización" },
      ];

      const cursosAsignados: Record<number, Curso[]> = {
        1: [cursosCatalogo.find((c) => c?.id_course === 101)!],
        2: [
          cursosCatalogo.find((c) => c?.id_course === 102)!,
          cursosCatalogo.find((c) => c?.id_course === 105)!,
        ],
        3: [cursosCatalogo.find((c) => c?.id_course === 104)!],
      };

      setEtapas(mockEtapas);
      setCursosPorEtapa(cursosAsignados);
    } else {
      setEtapas([]);
      setCursosPorEtapa({});
    }
  }, [planSeleccionado, cursosCatalogo]);

  const handleAsignarCurso = (id_etapa: number, id_curso: number) => {
    const curso = cursosCatalogo.find((c) => c.id_course === id_curso);
    if (!curso) return;

    const yaAsignado = Object.values(cursosPorEtapa).some((lista) =>
      lista.some((c) => c.id_course === id_curso)
    );
    if (yaAsignado) {
      alert("Este curso ya está asignado a otra etapa.");
      return;
    }

    setCursosPorEtapa((prev) => ({
      ...prev,
      [id_etapa]: [...(prev[id_etapa] || []), curso],
    }));
  };

  const handleEliminarCurso = (id_etapa: number, id_curso: number) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este curso?");
    if (!confirmar) return;

    setCursosPorEtapa((prev) => ({
      ...prev,
      [id_etapa]: (prev[id_etapa] || []).filter((c) => c.id_course !== id_curso),
    }));
  };

  const handleAgregarEtapa = () => {
    if (!nuevoNombreEtapa.trim()) {
      alert("El nombre de la etapa es requerido.");
      return;
    }

    const nueva: Etapa = { id_etapa: nextEtapaId++, nombre: nuevoNombreEtapa.trim() };
    setEtapas((prev) => [...prev, nueva]);
    setCursosPorEtapa((prev) => ({ ...prev, [nueva.id_etapa]: [] }));
    setNuevoNombreEtapa("");
  };

  const handleEliminarEtapa = (id_etapa: number) => {
    const confirmar = confirm("¿Eliminar esta etapa y todos sus cursos?");
    if (!confirmar) return;

    setEtapas((prev) => prev.filter((e) => e.id_etapa !== id_etapa));
    const copy = { ...cursosPorEtapa };
    delete copy[id_etapa];
    setCursosPorEtapa(copy);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-800">Malla Curricular por Puesto</h1>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <label className="font-semibold text-gray-700">Selecciona un puesto:</label>
        <select
          className="border px-3 py-1 rounded shadow-sm bg-white"
          value={planSeleccionado ?? ""}
          onChange={(e) => setPlanSeleccionado(Number(e.target.value))}
        >
          <option value="" disabled>-- Selecciona --</option>
          {planes.map((p) => (
            <option key={p.id_plan} value={p.id_plan}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {etapas.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <input
            type="text"
            placeholder="Nueva etapa"
            className="border px-3 py-1 rounded shadow-sm"
            value={nuevoNombreEtapa}
            onChange={(e) => setNuevoNombreEtapa(e.target.value)}
          />
          <button
            onClick={handleAgregarEtapa}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow"
          >
            ➕ Agregar etapa
          </button>
        </div>
      )}

      {etapas.length === 0 ? (
        <p className="text-center text-gray-500">Selecciona un plan para ver su malla curricular.</p>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2">
          {etapas.map((etapa) => {
            const cursos = cursosPorEtapa[etapa.id_etapa] || [];

            return (
              <div key={etapa.id_etapa} className="min-w-[320px] bg-white border rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-blue-700">{etapa.nombre}</h2>
                  <button
                    onClick={() => handleEliminarEtapa(etapa.id_etapa)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    🗑 Eliminar
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  {cursos.map((curso) => (
                    <div
                      key={curso.id_course}
                      className="border rounded p-2 text-sm bg-gray-50 shadow-sm relative"
                    >
                      <button
                        onClick={() => handleEliminarCurso(etapa.id_etapa, curso.id_course)}
                        className="absolute top-1 right-2 text-red-500 text-xs hover:text-red-700"
                      >
                        ✕
                      </button>
                      <div className="font-semibold text-gray-800">{curso.title}</div>
                      <p className="text-gray-600 text-xs">{curso.description}</p>
                    </div>
                  ))}
                </div>

                <select
                  className="border px-2 py-1 rounded w-full text-sm bg-white"
                  onChange={(e) => {
                    const idCurso = Number(e.target.value);
                    if (idCurso) handleAsignarCurso(etapa.id_etapa, idCurso);
                  }}
                >
                  <option value="">➕ Agregar curso</option>
                  {cursosCatalogo
                    .filter(
                      (c) => !Object.values(cursosPorEtapa).some((et) =>
                        et.some((asig) => asig.id_course === c.id_course)
                      )
                    )
                    .map((curso) => (
                      <option key={curso.id_course} value={curso.id_course}>
                        {curso.title}
                      </option>
                    ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
