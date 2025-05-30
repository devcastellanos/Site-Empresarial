"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Modulo {
  modulo_id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  estatus: number;
  fecha_completado: string | null;
}

const categoriasOrden = [
  "Básicos",
  "Técnicos",
  "Prácticos",
  "Habilidades y competencias",
  "Formación",
];

export default function VistaPlanEstudios() {
  const { user } = useAuth();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [empleadoBuscado, setEmpleadoBuscado] = useState(user?.num_empleado ?? "");
  const [inputBusqueda, setInputBusqueda] = useState("");

  useEffect(() => {
    if (empleadoBuscado) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plan-estudios/${empleadoBuscado}`)
        .then((res) => res.json())
        .then(setModulos)
        .catch(() => toast.error("Error al cargar el plan de estudios"));
    }
  }, [empleadoBuscado]);

  const total = modulos.length;
  const completados = modulos.filter((m) => m.estatus === 1).length;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  const handleCheck = async (modulo_id: number, checked: boolean) => {
    const estatus = checked ? 1 : 0;
    const body = { num_empleado: empleadoBuscado, modulo_id, estatus };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plan-estudios`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModulos((prev) =>
        prev.map((m) =>
          m.modulo_id === modulo_id ? { ...m, estatus } : m
        )
      );
    } else {
      toast.error("Error al actualizar el estatus");
    }
  };

  const buscarEmpleado = () => {
    if (inputBusqueda.trim() === "") return toast("Ingresa un número de empleado");
    setEmpleadoBuscado(inputBusqueda.trim());
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-4">Plan de Estudios</h1>

      {user && user.rol === "admin" && (
        <div className="flex gap-4 items-center mb-6">
          <Input
            type="text"
            placeholder="Buscar por número de empleado"
            value={inputBusqueda}
            onChange={(e) => setInputBusqueda(e.target.value)}
          />
          <Button onClick={buscarEmpleado}>Buscar</Button>
        </div>
      )}

      {/* Progreso general */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-1">Progreso general</h2>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-gray-700 h-4 rounded-full transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1 text-muted-foreground">
          {completados} de {total} módulos completados ({porcentaje}%)
        </p>
      </div>

      {/* Categorías como acordeón */}
      <Accordion type="multiple" className="space-y-2">
        {categoriasOrden.map((categoria) => {
          const modulosCategoria = modulos.filter((m) => m.categoria === categoria);
          if (modulosCategoria.length === 0) return null;

          return (
  <AccordionItem key={categoria} value={categoria}>
    <AccordionTrigger className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold flex justify-between items-center">
      <span>{categoria}</span>
      <span className="text-sm font-normal text-gray-500">
        {
          modulosCategoria.filter((m) => m.estatus === 1).length
        }{" "}
        de {modulosCategoria.length} módulos
      </span>
    </AccordionTrigger>
    <AccordionContent className="bg-white rounded-md shadow-inner px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modulosCategoria.map((modulo) => (
          <Card
            key={modulo.modulo_id}
            className="bg-gray-50 hover:bg-gray-100 transition"
          >
            <CardContent className="flex items-center gap-4 py-4">
              <Checkbox
                id={`modulo-${modulo.modulo_id}`}
                checked={!!modulo.estatus}
                onCheckedChange={(checked) =>
                  handleCheck(modulo.modulo_id, !!checked)
                }
              />
              <div>
                <Label
                  htmlFor={`modulo-${modulo.modulo_id}`}
                  className="text-base font-medium"
                >
                  {modulo.nombre}
                </Label>
                {modulo.descripcion && (
                  <p className="text-sm text-muted-foreground">
                    {modulo.descripcion}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
);

        })}
      </Accordion>
    </div>
  );
}
