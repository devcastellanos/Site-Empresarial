"use client";

import { useEffect, useState } from "react";

export function FormularioEtapas() {
  const [planes, setPlanes] = useState<{ id_plan: number; nombre: string }[]>([]);
  const [etapas, setEtapas] = useState<{ id_etapa: number; nombre: string; orden: number }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [nombreEtapa, setNombreEtapa] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState<number>(1);

  const fetchPlanes = async () => {
    try {
      const res = await fetch("http://localhost:3041/asignacionCursos/matriz");
      const data = await res.json();
      setPlanes(data.planes || []);
    } catch (err) {
      console.error("Error cargando planes:", err);
    }
  };

  const fetchEtapas = async (id_plan: number) => {
    try {
      const res = await fetch(`http://localhost:3041/planesEstudio/${id_plan}/etapas`);
      const data = await res.json();
      setEtapas(data.etapas || []);
    } catch (err) {
      console.error("Error cargando etapas:", err);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchEtapas(selectedPlan);
    }
  }, [selectedPlan]);

  const handleCrearEtapa = async () => {
    if (!selectedPlan || !nombreEtapa.trim()) {
      alert("Debes seleccionar un plan y escribir un nombre para la etapa.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3041/etapas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_plan: selectedPlan,
          nombre: nombreEtapa,
          descripcion,
          orden,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Etapa creada correctamente");
        setNombreEtapa("");
        setDescripcion("");
        setOrden(orden + 1);
        fetchEtapas(selectedPlan);
      } else {
        alert(data.error || "Error al crear etapa");
      }
    } catch (err) {
      console.error("Error al crear etapa:", err);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow bg-white space-y-6">
      <h2 className="text-xl font-bold text-center">Agregar Etapas a un Plan</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Selecciona un Plan:</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedPlan ?? ""}
            onChange={(e) => setSelectedPlan(Number(e.target.value))}
          >
            <option value="">-- Selecciona --</option>
            {planes.map((plan) => (
              <option key={plan.id_plan} value={plan.id_plan}>
                {plan.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Nombre de la Etapa:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={nombreEtapa}
            onChange={(e) => setNombreEtapa(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción (opcional):</label>
          <textarea
            className="w-full border p-2 rounded"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Orden:</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={orden}
            onChange={(e) => setOrden(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleCrearEtapa}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Etapa
        </button>
      </div>

      {etapas.length > 0 && (
        <div className="pt-6 border-t">
          <h3 className="font-semibold mb-2 text-gray-700">Etapas actuales:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
            {etapas.map((e) => (
              <li key={e.id_etapa}>
                #{e.orden} — <strong>{e.nombre}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
