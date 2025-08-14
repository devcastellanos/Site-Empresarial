"use client";

import { useMemo, useState } from "react";

// Tipos esperados en la vista de solo lectura
export type Curso = { id_course: number; title: string; description?: string };
export type Subcategoria = { nombre: string; cursos: Curso[] };
export type Etapa = { nombre: string; subcategorias: Subcategoria[] };

export type MallaCurricularData = {
  plan: string;
  etapas: Etapa[];
};

/**
 * Vista de solo lectura altamente estética para la malla curricular.
 * - Sin edición
 * - Responsive con columnas verticales (una por categoría/etapa)
 * - Búsqueda no intrusiva
 * - Estilos listos para impresión
 */
export default function MallaCurricularView({ data }: { data: MallaCurricularData }) {
  const [query, setQuery] = useState("");
  const [expandedAll, setExpandedAll] = useState(true);

  const stats = useMemo(() => {
    const totalSubcats = data.etapas.reduce((acc, e) => acc + e.subcategorias.length, 0);
    const totalCursos = data.etapas.reduce(
      (acc, e) => acc + e.subcategorias.reduce((s, sc) => s + sc.cursos.length, 0),
      0
    );
    return { totalSubcats, totalCursos };
  }, [data]);

  const normalized = (s: string) => (s || "").toLowerCase().trim();

  const filteredEtapas = useMemo(() => {
    const q = normalized(query);
    if (!q) return data.etapas;
    return data.etapas
      .map((e) => ({
        ...e,
        subcategorias: e.subcategorias
          .map((sc) => ({
            ...sc,
            cursos: sc.cursos.filter(
              (c) => normalized(c.title).includes(q) || normalized(c.description || "").includes(q)
            ),
          }))
          .filter((sc) => sc.cursos.length > 0),
      }))
      .filter((e) => e.subcategorias.length > 0);
  }, [data, query]);

  return (
    <div className="p-6 space-y-6 print:p-0">
      {/* Encabezado */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur border-b p-4 rounded-xl shadow-sm print:static print:bg-white print:border-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {data.plan}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {stats.totalSubcats} subcategorías · {stats.totalCursos} cursos
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 w-full sm:w-80 print:hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔎 Buscar cursos (título o descripción)"
              className="w-full border px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg shadow-sm"
            >
              Imprimir
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-3 print:hidden">
          <button
            onClick={() => setExpandedAll(true)}
            className={`px-3 py-1.5 rounded-lg text-sm border shadow-sm ${
              expandedAll ? "bg-slate-900 text-white" : "bg-white"
            }`}
            title="Expandir todo"
          >
            Expandir todo
          </button>
          <button
            onClick={() => setExpandedAll(false)}
            className={`px-3 py-1.5 rounded-lg text-sm border shadow-sm ${
              !expandedAll ? "bg-slate-900 text-white" : "bg-white"
            }`}
            title="Colapsar todo"
          >
            Colapsar todo
          </button>
        </div>
      </div>

      {/* Columnas verticales: una por etapa/categoría */}
      {filteredEtapas.length === 0 ? (
        <p className="text-center text-slate-500 py-12">No hay resultados para “{query}”.</p>
      ) : (
        <div className="grid grid-flow-col auto-cols-[minmax(320px,1fr)] gap-4 overflow-x-auto pb-2 print:grid-flow-row print:auto-cols-auto print:grid-cols-2 print:gap-3">
          {filteredEtapas.map((etapa, i) => (
            <Column key={etapa.nombre + i} etapa={etapa} expandedAll={expandedAll} />)
          )}
        </div>
      )}

      {/* Pie */}
      <div className="text-center text-xs text-slate-400 pt-6 print:hidden">
        Vista de lectura · Generada automáticamente
      </div>
    </div>
  );
}

function Column({ etapa, expandedAll }: { etapa: Etapa; expandedAll: boolean }) {
  return (
    <section className="relative bg-white rounded-2xl shadow-sm border p-4 flex flex-col min-h-[70vh] print:min-h-0">
      <header className="flex items-center justify-between pb-3 border-b">
        <h2 className="text-base font-semibold text-indigo-700 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
          {etapa.nombre}
        </h2>
        <span className="text-xs text-slate-500">{etapa.subcategorias.length} subcats</span>
      </header>

      <div className="flex-1 mt-3 space-y-4 overflow-y-auto pr-1 print:overflow-visible">
        {etapa.subcategorias.map((sub, idx) => (
          <SubcatCard key={sub.nombre + idx} sub={sub} expandedAll={expandedAll} />
        ))}
      </div>
    </section>
  );
}

function SubcatCard({ sub, expandedAll }: { sub: Subcategoria; expandedAll: boolean }) {
  return (
    <details open={expandedAll} className="group rounded-xl border bg-slate-50 p-3">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-800">{sub.nombre}</h3>
          <p className="text-[11px] text-slate-500">{sub.cursos.length} cursos</p>
        </div>
        <span className="text-[10px] text-slate-500 group-open:hidden">Mostrar</span>
        <span className="text-[10px] text-slate-500 hidden group-open:inline">Ocultar</span>
      </summary>

      <div className="mt-3 space-y-2">
        {sub.cursos.map((curso) => (
          <article
            key={curso.id_course}
            className="rounded-lg border bg-white px-3 py-2 shadow-sm hover:shadow transition-shadow"
          >
            <h4 className="text-sm font-semibold text-slate-900">{curso.title}</h4>
            {curso.description && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{curso.description}</p>
            )}
          </article>
        ))}
      </div>
    </details>
  );
}