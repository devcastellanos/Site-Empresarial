"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Tipos
type Categoria = { id_categoria: number; nombre: string };
type Subcategoria = { id_subcategoria: number; nombre: string; id_categoria: number };
type Curso = { id_course: number; title: string; description: string };
type Plan = { id_plan: number; nombre: string };

type ComboItem = { label: string; value: number };
type Mode = "view" | "edit";

/* =============== Combobox ligero =============== */
function Combobox({
  items,
  placeholder,
  disabled = false,
  value = null,
  onChangeValue,
  onSelect,
  clearOnSelect = false,
  emptyState = "Sin resultados",
}: {
  items: ComboItem[];
  placeholder: string;
  disabled?: boolean;
  value?: number | null;
  onChangeValue?: (v: number | null) => void; // controlado (ej. puesto)
  onSelect?: (item: ComboItem) => void; // acción (ej. agregar curso)
  clearOnSelect?: boolean;
  emptyState?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const currentLabel = useMemo(
    () => items.find((i) => i.value === value)?.label ?? "",
    [items, value]
  );
  const [query, setQuery] = useState<string>(currentLabel);

  useEffect(() => {
    setQuery(currentLabel);
  }, [currentLabel]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectItem = (it: ComboItem) => {
    if (onChangeValue) onChangeValue(it.value);
    if (onSelect) onSelect(it);
    setOpen(false);
    setQuery(clearOnSelect ? "" : it.label);
  };

  return (
    <div ref={ref} className={`relative ${disabled ? "opacity-60" : ""}`}>
      <input
        disabled={disabled}
        className="w-full border px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
          if (!open) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const it = filtered[highlight];
            if (it) selectItem(it);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-64 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500">{emptyState}</div>
          ) : (
            filtered.map((it, idx) => (
              <button
                key={it.value}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                  idx === highlight ? "bg-slate-50" : ""
                }`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => selectItem(it)}
              >
                {it.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* =============== Página =============== */
export default function MallaCurricular() {
  // --- State base ---
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Record<number, Subcategoria[]>>({});
  const [cursosCatalogo, setCursosCatalogo] = useState<Curso[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [cursosPorSubcat, setCursosPorSubcat] = useState<Record<number, Curso[]>>({});
  const [nuevoSubcat, setNuevoSubcat] = useState<Record<number, string>>({});
  const [buscarGlobal, setBuscarGlobal] = useState("");
  const [habilitadas, setHabilitadas] = useState<Record<number, boolean>>({});
  const [mode, setMode] = useState<Mode>("view");
  // Estado de edición de nombre de subcategoría
  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState<string>("");

  // refs para inputs de “nueva subcat”
  const newSubRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // edición de nombre de subcategoría
  const [editingSub, setEditingSub] = useState<Record<number, boolean>>({});
  const [editNombreSub, setEditNombreSub] = useState<Record<number, string>>({});

  const norm = (s: string) => (s ?? "").toString().trim().toLowerCase();

  type HidratarOpts = { ignoreLegacy?: boolean };

  /* ---- Carga inicial ---- */
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/puestos`)
      .then((r) => r.json())
      .then((data: string[]) => setPlanes(data.map((nombre, i) => ({ id_plan: i + 1, nombre }))))
      .catch(() => setPlanes([]));

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categorias`)
      .then((r) => r.json())
      .then((arr: Categoria[]) => {
        setCategorias(arr);
        setHabilitadas((prev) => {
          const next: Record<number, boolean> = { ...prev };
          for (const c of arr) if (next[c.id_categoria] === undefined) next[c.id_categoria] = false;
          return next;
        });
      })
      .catch(() => setCategorias([]));

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cursospresenciales`)
      .then((r) => r.json())
      .then(setCursosCatalogo)
      .catch(() => setCursosCatalogo([]));
  }, []);

  /* ---- Hidratar malla de backend ---- */
  const hidratarDesdeBackend = (data: any, opts: HidratarOpts = { ignoreLegacy: true }) => {
    const { ignoreLegacy = true } = opts;

    if (!data?.etapas || categorias.length === 0) {
      setSubcategorias({});
      setCursosPorSubcat({});
      setHabilitadas((prev) => {
        const next: Record<number, boolean> = { ...prev };
        for (const c of categorias) next[c.id_categoria] = false;
        return next;
      });
      return;
    }

    const subcatsMap: Record<number, Subcategoria[]> = {};
    const cursosMap: Record<number, Curso[]> = {};
    const catIndex = new Map<string, Categoria>();
    categorias.forEach((c) => catIndex.set(norm(c.nombre), c));
    const habMap: Record<number, boolean> = {};

    for (const etapa of data.etapas as any[]) {
      const cat = catIndex.get(norm(etapa?.nombre));
      if (!cat) continue;

      const tieneSubcats = Array.isArray(etapa.subcategorias) && etapa.subcategorias.length > 0;

      if (tieneSubcats) {
        subcatsMap[cat.id_categoria] = etapa.subcategorias.map((sub: any) => ({
          id_subcategoria: Number(sub.id_subcategoria),
          nombre: sub.nombre,
          id_categoria: cat.id_categoria,
        }));

        for (const sub of etapa.subcategorias) {
          const subId = Number(sub.id_subcategoria);
          cursosMap[subId] = (sub.cursos || []).map((c: any) => ({
            id_course: Number(c.id_course),
            title: c.title,
            description: c.description,
          }));
        }
        habMap[cat.id_categoria] = true;
        continue;
      }

      // legacy (si decides no ignorarlo)
      const tieneLegacy = Array.isArray(etapa.cursos) && etapa.cursos.length > 0;
      if (!ignoreLegacy && tieneLegacy) {
        const tempId = -Number(etapa.id_etapa || Date.now());
        subcatsMap[cat.id_categoria] = [
          { id_subcategoria: tempId, nombre: `Auto-${etapa.nombre}`, id_categoria: cat.id_categoria },
        ];
        cursosMap[tempId] = etapa.cursos.map((c: any) => ({
          id_course: Number(c.id_course),
          title: c.title,
          description: c.description,
        }));
        habMap[cat.id_categoria] = true;
      }
    }

    for (const c of categorias) if (habMap[c.id_categoria] === undefined) habMap[c.id_categoria] = false;

    setSubcategorias(subcatsMap);
    setCursosPorSubcat(cursosMap);
    setHabilitadas((prev) => ({ ...prev, ...habMap }));
  };

  /* ---- Cargar al seleccionar puesto ---- */
  useEffect(() => {
    if (!seleccionado || categorias.length === 0) return;
    const plan = planes.find((p) => p.id_plan === seleccionado);
    if (!plan) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${encodeURIComponent(plan.nombre)}`)
      .then((r) => {
        if (!r.ok) throw new Error("No existe malla para este puesto");
        return r.json();
      })
      .then((data) => hidratarDesdeBackend(data, { ignoreLegacy: true }))
      .catch(() => {
        setSubcategorias({});
        setCursosPorSubcat({});
        setHabilitadas((prev) => {
          const next: Record<number, boolean> = { ...prev };
          for (const c of categorias) next[c.id_categoria] = false;
          return next;
        });
      });
  }, [seleccionado, categorias, planes]);

  /* ---- Acciones ---- */
  const agregarSubcat = (id_categoria: number) => {
    const input = newSubRefs.current[id_categoria];
    const nombre = (input?.value || nuevoSubcat[id_categoria] || "").trim();
    if (!nombre) return;
    const nueva: Subcategoria = { id_subcategoria: -Date.now(), nombre, id_categoria };
    setSubcategorias((prev) => ({ ...prev, [id_categoria]: [...(prev[id_categoria] || []), nueva] }));
    if (input) input.value = "";
    setNuevoSubcat((prev) => ({ ...prev, [id_categoria]: "" }));
  };

  const eliminarSubcategoria = (id_categoria: number, id_subcategoria: number) => {
    setSubcategorias((prev) => ({
      ...prev,
      [id_categoria]: (prev[id_categoria] || []).filter((s) => s.id_subcategoria !== id_subcategoria),
    }));
    setCursosPorSubcat((prev) => {
      const next = { ...prev };
      delete next[id_subcategoria];
      return next;
    });
  };

  const asignarCurso = (id_sub: number, id_course: number) => {
    const curso = cursosCatalogo.find((c) => Number(c.id_course) === Number(id_course));
    if (!curso) return;
    const yaEsta = (cursosPorSubcat[id_sub] || []).some(
      (c) => Number(c.id_course) === Number(id_course)
    );
    if (yaEsta) return alert("Curso ya asignado en esta subcategoría.");
    setCursosPorSubcat((prev) => ({ ...prev, [id_sub]: [...(prev[id_sub] || []), curso] }));
  };

  const eliminarCurso = (id_sub: number, id_course: number) => {
    setCursosPorSubcat((prev) => ({
      ...prev,
      [id_sub]: (prev[id_sub] || []).filter((c) => Number(c.id_course) !== Number(id_course)),
    }));
  };

  const toggleCategoria = (id_categoria: number) => {
    setHabilitadas((prev) => ({ ...prev, [id_categoria]: !prev[id_categoria] }));
  };

  const habilitarTodas = (valor: boolean) => {
    setHabilitadas((prev) => {
      const next: Record<number, boolean> = { ...prev };
      for (const c of categorias) next[c.id_categoria] = valor;
      return next;
    });
  };

  const guardarMalla = async () => {
    const planSel = planes.find((p) => p.id_plan === seleccionado);
    if (!planSel) return alert("Selecciona un puesto válido");

    const etapas = categorias
      .filter((cat) => !!habilitadas[cat.id_categoria])
      .map((cat) => {
        const subsDeCat = (subcategorias[cat.id_categoria] || []).map((sub) => {
          const cursosDeSub = (cursosPorSubcat[sub.id_subcategoria] || []).map((c) => ({
            id_course: c.id_course,
          }));
          return { nombre: sub.nombre, cursos: cursosDeSub };
        });
        if (subsDeCat.length === 0) return null;
        return { nombre: cat.nombre, subcategorias: subsDeCat };
      })
      .filter(Boolean) as { nombre: string; subcategorias: { nombre: string; cursos: { id_course: number }[] }[] }[];

    // Permitir “vaciar” todo (backend hará diff y borrará)
    if (!etapas.length) {
      const ok = confirm(
        "No hay categorías/subcategorías habilitadas. Se eliminará la malla de este puesto. ¿Continuar?"
      );
      if (!ok) return;
    }

    const payload = { plan: planSel.nombre, etapas };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/malla`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Bad Request");
      alert("✅ Malla guardada correctamente.");

      // refrescar
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${encodeURIComponent(planSel.nombre)}`
      );
      if (r.ok) {
        const data = await r.json();
        hidratarDesdeBackend(data, { ignoreLegacy: true });
      }
    } catch (e: any) {
      console.error("❌ Error al guardar malla:", e?.message);
      alert("❌ Error al guardar malla: " + (e?.message ?? ""));
    }
  };

  /* ---- Memos ---- */
  const catalogoFiltradoGlobal = useMemo(() => {
    const q = norm(buscarGlobal);
    if (!q) return cursosCatalogo;
    return cursosCatalogo.filter(
      (c) => norm(c.title).includes(q) || norm(c.description).includes(q)
    );
  }, [buscarGlobal, cursosCatalogo]);

  const totalHabilitadas = categorias.reduce(
    (acc, c) => acc + (habilitadas[c.id_categoria] ? 1 : 0),
    0
  );
  const planesItems: ComboItem[] = useMemo(
    () => planes.map((p) => ({ label: p.nombre, value: p.id_plan })),
    [planes]
  );

  /* ---- Header ---- */
  const Header = () => (
    <div className="sticky top-0 z-10 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur border-b p-4 rounded-xl shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          Plan de Carrera
        </h1>

        <div className="flex items-center gap-2 w-full sm:w-72">
          <span className="text-sm text-slate-600 pt-0.5">Puesto:</span>
          <div className="flex-1">
            <Combobox
              items={planesItems}
              value={seleccionado}
              onChangeValue={(v) => setSeleccionado(v)}
              placeholder="Selecciona un puesto"
            />
          </div>
        </div>

        {/* Toggle de modo */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Modo:</span>
          <div className="inline-flex rounded-lg border overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setMode("view")}
              className={`px-3 py-1.5 text-sm ${
                mode === "view" ? "bg-indigo-600 text-white" : "bg-white hover:bg-slate-50"
              }`}
            >
              Ver
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`px-3 py-1.5 text-sm ${
                mode === "edit" ? "bg-indigo-600 text-white" : "bg-white hover:bg-slate-50"
              }`}
            >
              Editar
            </button>
          </div>
        </div>

        {/* Acciones (solo edición) */}
        {mode === "edit" && (
          <>
            <div className="ml-auto flex items-center gap-2 w-full sm:w-72">
              <input
                className="w-full border px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="🔎 Buscar curso en todo el catálogo"
                value={buscarGlobal}
                onChange={(e) => setBuscarGlobal(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {totalHabilitadas} categorías habilitadas
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => habilitarTodas(true)}
                  className="px-3 py-1.5 rounded-lg border shadow-sm hover:bg-slate-50"
                >
                  Habilitar todas
                </button>
                <button
                  type="button"
                  onClick={() => habilitarTodas(false)}
                  className="px-3 py-1.5 rounded-lg border shadow-sm hover:bg-slate-50"
                >
                  Deshabilitar todas
                </button>
                <button
                  type="button"
                  onClick={guardarMalla}
                  className="px-4 py-2 rounded-lg shadow-sm bg-indigo-700 hover:bg-indigo-800 text-white font-medium disabled:opacity-60"
                  disabled={!seleccionado}
                  title={seleccionado ? "Guardar malla" : "Selecciona un puesto"}
                >
                  💾 Guardar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ---- Viewer (solo lectura) ---- */
  const Viewer = () => {
    const cats = categorias.filter(
      (cat) => !!habilitadas[cat.id_categoria] && (subcategorias[cat.id_categoria]?.length || 0) > 0
    );

    if (!seleccionado)
      return <div className="p-6 text-slate-500">Selecciona un puesto para ver su malla.</div>;

    if (cats.length === 0)
      return <div className="p-6 text-slate-500">Este puesto no tiene categorías registradas.</div>;

    return (
      <div className="grid grid-flow-col auto-cols-[minmax(320px,1fr)] gap-4 overflow-x-auto pb-2">
        {cats.map((cat) => (
          <div
            key={cat.id_categoria}
            className="relative rounded-2xl border p-4 flex flex-col min-h-[60vh] shadow-sm bg-white"
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-base font-semibold text-indigo-700 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                {cat.nombre}
              </h2>
            </div>

            <div className="flex-1 mt-3 space-y-4 overflow-y-auto pr-1">
              {(subcategorias[cat.id_categoria] || []).map((sub) => (
                <div key={sub.id_subcategoria} className="rounded-xl border bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium text-slate-800 truncate">{sub.nombre}</h3>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {(cursosPorSubcat[sub.id_subcategoria]?.length || 0)} cursos
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {(cursosPorSubcat[sub.id_subcategoria] || []).map((curso) => (
                      <div
                        key={`${sub.id_subcategoria}-${curso.id_course}`}
                        className="rounded-lg border bg-white px-3 py-2 shadow-sm"
                      >
                        <p className="text-sm font-medium text-slate-800">{curso.title}</p>
                        {!!curso.description && (
                          <p className="text-xs text-slate-500">{curso.description}</p>
                        )}
                      </div>
                    ))}
                    {!(cursosPorSubcat[sub.id_subcategoria] || []).length && (
                      <div className="text-xs text-slate-500">-</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ---- Editor ---- */
  const Editor = () => {
    return (
      <div className="grid grid-flow-col auto-cols-[minmax(320px,1fr)] gap-4 overflow-x-auto pb-2">
        {categorias.map((cat) => {
          const activa = !!habilitadas[cat.id_categoria];
          const cursosItems: ComboItem[] = catalogoFiltradoGlobal.map((c) => ({
            label: c.title,
            value: c.id_course,
          }));

          return (
            <div
              key={cat.id_categoria}
              className={`relative rounded-2xl border p-4 flex flex-col min-h-[70vh] shadow-sm ${
                activa ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <h2 className="text-base font-semibold text-indigo-700 flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      activa ? "bg-indigo-500" : "bg-slate-300"
                    }`}
                  />
                  {cat.nombre}
                </h2>
                <label className="inline-flex items-center gap-2 text-xs cursor-pointer select-none">
                  <span className="text-slate-600">Usar</span>
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      activa ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                    onClick={() => toggleCategoria(cat.id_categoria)}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                        activa ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </span>
                </label>
              </div>

              <div
                className={`flex-1 mt-3 space-y-4 overflow-y-auto pr-1 ${
                  activa ? "" : "opacity-60 grayscale"
                }`}
              >
                {(subcategorias[cat.id_categoria] || []).map((sub) => (
                  <div key={sub.id_subcategoria} className="group rounded-xl border bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {editingSub[sub.id_subcategoria] ? (
                          <input
                            className="w-full border px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={editNombreSub[sub.id_subcategoria] ?? sub.nombre}
                            onChange={(e) =>
                              setEditNombreSub((p) => ({
                                ...p,
                                [sub.id_subcategoria]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && activa) {
                                const nuevo = (editNombreSub[sub.id_subcategoria] ?? "").trim();
                                if (!nuevo) return;
                                setSubcategorias((prev) => ({
                                  ...prev,
                                  [cat.id_categoria]: (prev[cat.id_categoria] || []).map((s) =>
                                    s.id_subcategoria === sub.id_subcategoria
                                      ? { ...s, nombre: nuevo }
                                      : s
                                  ),
                                }));
                                setEditingSub((p) => ({ ...p, [sub.id_subcategoria]: false }));
                              }
                              if (e.key === "Escape") {
                                setEditingSub((p) => ({ ...p, [sub.id_subcategoria]: false }));
                              }
                            }}
                          />
                        ) : (
                          <h3 className="text-sm font-medium text-slate-800 truncate">
                            {sub.nombre}
                          </h3>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {editingSubId === sub.id_subcategoria ? (
                            <input
                              autoFocus
                              className="w-full border px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              value={editNombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                              onKeyDown={(e) => {
                                // Evita que algún handler externo robe el foco
                                e.stopPropagation();

                                if (e.key === "Enter" && activa) {
                                  const nuevo = editNombre.trim();
                                  if (!nuevo) return;
                                  setSubcategorias((prev) => ({
                                    ...prev,
                                    [cat.id_categoria]: (prev[cat.id_categoria] || []).map((s) =>
                                      s.id_subcategoria === sub.id_subcategoria ? { ...s, nombre: nuevo } : s
                                    ),
                                  }));
                                  setEditingSubId(null);
                                }
                                if (e.key === "Escape") {
                                  setEditingSubId(null);
                                }
                              }}
                            />
                          ) : (
                            <h3 className="text-sm font-medium text-slate-800 truncate">{sub.nombre}</h3>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {(cursosPorSubcat[sub.id_subcategoria]?.length || 0)} cursos
                          </span>

                          {editingSubId === sub.id_subcategoria ? (
                            <>
                              <button
                                onClick={() => {
                                  if (!activa) return;
                                  const nuevo = editNombre.trim();
                                  if (!nuevo) return;
                                  setSubcategorias((prev) => ({
                                    ...prev,
                                    [cat.id_categoria]: (prev[cat.id_categoria] || []).map((s) =>
                                      s.id_subcategoria === sub.id_subcategoria ? { ...s, nombre: nuevo } : s
                                    ),
                                  }));
                                  setEditingSubId(null);
                                }}
                                className={`px-2 py-1 rounded text-xs border shadow-sm ${
                                  activa ? "text-emerald-600 border-emerald-200 hover:bg-white/70" : "text-slate-400 border-slate-200 cursor-not-allowed"
                                }`}
                                disabled={!activa}
                                title={activa ? "Guardar nombre" : "Deshabilitada"}
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditingSubId(null)}
                                className="px-2 py-1 rounded text-xs border shadow-sm text-slate-600 hover:bg-white/70"
                                title="Cancelar edición"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                if (!activa) return;
                                setEditNombre(sub.nombre);       // precarga valor actual
                                setEditingSubId(sub.id_subcategoria);
                              }}
                              className={`px-2 py-1 rounded text-xs border shadow-sm ${
                                activa ? "hover:bg-white/70 text-slate-700" : "text-slate-400 border-slate-200 cursor-not-allowed"
                              }`}
                              disabled={!activa}
                              title={activa ? "Editar nombre" : "Deshabilitada"}
                            >
                              ✎
                            </button>
                          )}

                          {/* Botón eliminar existente (si ya lo tienes, déjalo tal cual) */}
                          <button
                            onClick={() =>
                              activa &&
                              confirm("¿Eliminar subcategoría y sus cursos?") &&
                              eliminarSubcategoria(cat.id_categoria, Number(sub.id_subcategoria))
                            }
                            className={`px-2 py-1 rounded text-xs border shadow-sm ${
                              activa ? "hover:bg-white/70 text-red-600 border-red-200" : "text-slate-400 border-slate-200 cursor-not-allowed"
                            }`}
                            disabled={!activa}
                            title={activa ? "Eliminar subcategoría" : "Deshabilitada"}
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="mt-2 space-y-2">
                      {(cursosPorSubcat[sub.id_subcategoria] || []).map((curso) => (
                        <div
                          key={`${sub.id_subcategoria}-${curso.id_course}`}
                          className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 shadow-sm"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {curso.title}
                            </p>
                            {!!curso.description && (
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {curso.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => activa && eliminarCurso(sub.id_subcategoria, curso.id_course)}
                            className={`ml-3 shrink-0 inline-flex items-center gap-1 text-xs font-medium hover:underline ${
                              activa ? "text-red-600" : "text-slate-400 cursor-not-allowed"
                            }`}
                            title={activa ? "Eliminar curso" : "Deshabilitada"}
                            disabled={!activa}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <Combobox
                        items={cursosItems}
                        placeholder="➕ Agregar curso"
                        disabled={!activa}
                        onSelect={(it) => asignarCurso(sub.id_subcategoria, it.value)}
                        clearOnSelect
                        emptyState="Sin cursos"
                      />
                    </div>
                  </div>
                ))}

                {/* Crear nueva subcategoría */}
                <div className="rounded-xl border border-dashed p-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={(el) => {
                        newSubRefs.current[cat.id_categoria] = el;
                      }}
                      type="text"
                      placeholder="Nueva subcategoría"
                      className="border px-3 py-2 rounded-lg text-sm flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                      disabled={!activa}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && activa) agregarSubcat(cat.id_categoria);
                      }}
                    />
                    <button
                      onClick={() => activa && agregarSubcat(cat.id_categoria)}
                      className={`text-white text-sm px-4 py-2 rounded-lg shadow-sm ${
                        activa ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-300 cursor-not-allowed"
                      }`}
                      disabled={!activa}
                    >
                      ➕ Agregar
                    </button>
                  </div>
                </div>
              </div>

              {!activa && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-200"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Header />
      {mode === "view" ? <Viewer /> : <Editor />}
    </div>
  );
}
