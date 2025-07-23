import { useEffect, useState } from "react";

export function MatrizAsignacionCursos() {
  type Plan = { id_plan: number; nombre: string };
  type Curso = { id_course: number; title: string };
  type Etapa = { id_etapa: number; nombre: string };

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [etapasPorPlan, setEtapasPorPlan] = useState<Record<number, Etapa[]>>({});
  const [asignaciones, setAsignaciones] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [nuevoPlanNombre, setNuevoPlanNombre] = useState("");

  useEffect(() => {
    fetchMatriz();
  }, []);

  const fetchMatriz = async () => {
    try {
      const res = await fetch("http://localhost:3041/asignacionCursos/matriz");
      const data = await res.json();
      setPlanes(data.planes);
      setCursos(data.cursos);

      const etapasMap: Record<number, Etapa[]> = {};
      for (const plan of data.planes) {
        const resEtapas = await fetch(`http://localhost:3041/planesEstudio/${plan.id_plan}/etapas`);
        const dataEtapas = await resEtapas.json();
        etapasMap[plan.id_plan] = dataEtapas.etapas || [];
      }
      setEtapasPorPlan(etapasMap);

      const asignacionMap: Record<string, number | null> = {};
      data.asignaciones.forEach((a: any) => {
        const key = `${a.id_plan}-${a.id_curso}`;
        asignacionMap[key] = a.id_etapa;
      });
      setAsignaciones(asignacionMap);
    } catch (err) {
      console.error("Error cargando matriz:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAsignacion = async (id_plan: number, id_curso: number, id_etapa: number | null) => {
  const key = `${id_plan}-${id_curso}`;
  const etapaActual = asignaciones[key];

  if (etapaActual === id_etapa) return;

  try {
    // Eliminar si ya había
    if (etapaActual != null) {
      await fetch("http://localhost:3041/asignacionCursos/eliminarEspecifico", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_etapa: etapaActual, id_curso }),
      });
    }

    // Asignar nueva si se eligió una
    if (id_etapa != null) {
      const res = await fetch("http://localhost:3041/etapas/asignarCursoUnitario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_plan, id_etapa, id_curso }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al asignar curso");
        return;
      }
    }

    // Actualizar estado local solo si todo fue bien
    setAsignaciones((prev) => ({ ...prev, [key]: id_etapa }));
  } catch (err) {
    console.error("Error actualizando asignación:", err);
    alert("Error en la asignación");
  }
};


  const handleAgregarPlan = async () => {
    if (!nuevoPlanNombre.trim()) return alert("Nombre requerido");

    try {
      const res = await fetch("http://localhost:3041/planesEstudio/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoPlanNombre }),
      });

      const data = await res.json();
      if (data.success) {
        setNuevoPlanNombre("");
        fetchMatriz();
      } else {
        alert("Error al crear plan");
      }
    } catch (err) {
      console.error("Error al crear plan:", err);
    }
  };

  if (loading) {
    return <p className="text-center p-4">Cargando matriz de asignación...</p>;
  }

  return (
    <div className="overflow-x-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Asignación de Cursos a Planes por Etapas</h1>

      <div className="flex gap-2 items-center justify-center">
        <input
          type="text"
          className="border rounded px-2 py-1 w-64"
          placeholder="Nuevo nombre de plan de estudio"
          value={nuevoPlanNombre}
          onChange={(e) => setNuevoPlanNombre(e.target.value)}
        />
        <button
          onClick={handleAgregarPlan}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Plan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Curso</th>
              {planes.map((plan) => (
                <th key={plan.id_plan} className="border px-2 py-1 text-center">
                  {plan.nombre}
                  {(etapasPorPlan[plan.id_plan] || []).map((etapa) => (
                    <div key={etapa.id_etapa} className="text-xs text-gray-600">- {etapa.nombre}</div>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id_course}>
                <td className="border px-2 py-1 font-medium">{curso.title}</td>
                {planes.map((plan) => {
                  const etapas = etapasPorPlan[plan.id_plan] || [];
                  const key = `${plan.id_plan}-${curso.id_course}`;
                  const asignada = asignaciones[key];

                  return (
                    <td key={plan.id_plan} className="border px-2 py-1">
                      <label className="block text-xs">
                        <input
                          type="radio"
                          name={`asig-${plan.id_plan}-${curso.id_course}`}
                          className="mr-1 accent-blue-600"
                          checked={asignada == null}
                          onChange={() => toggleAsignacion(plan.id_plan, curso.id_course, null)}
                        />
                        Ninguna
                      </label>
                      {etapas.map((etapa) => (
                        <label key={etapa.id_etapa} className="block text-xs">
                          <input
                            type="radio"
                            name={`asig-${plan.id_plan}-${curso.id_course}`}
                            className="mr-1 accent-blue-600"
                            checked={asignaciones[key] === etapa.id_etapa}
                            onChange={() => toggleAsignacion(plan.id_plan, curso.id_course, etapa.id_etapa)}
                          />
                          {etapa.nombre}
                        </label>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}