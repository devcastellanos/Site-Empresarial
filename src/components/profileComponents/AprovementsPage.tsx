import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Aprobacion {
  idAprobacion: number;
  idMovimiento: number;
  num_empleado: number;
  tipo_movimiento: string;
  fecha_incidencia: string;
  estatus: string;
  datos_json: any;
}

export default function AprobacionesPage() {
  const { user } = useAuth();
  const [aprobaciones, setAprobaciones] = useState<Aprobacion[]>([]);
  const [notas, setNotas] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    if (user) {
      fetch(`http://api-cursos.192.168.29.40.sslip.io/api/aprobaciones?aprobador=${user.num_empleado}`)
        .then(res => res.json())
        .then(setAprobaciones);
    }
  }, [user]);

  const responder = async (idAprobacion: number, estatus: "aprobado" | "rechazado") => {
    const nota = notas[idAprobacion] || "";
    await fetch(`http://api-cursos.192.168.29.40.sslip.io/api/aprobaciones/${idAprobacion}/responder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estatus, nota }),
    });

    // refrescar lista
    setAprobaciones(prev => prev.filter(a => a.idAprobacion !== idAprobacion));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Solicitudes para aprobar</h1>

      {aprobaciones.map(aprob => (
        <Card key={aprob.idAprobacion}>
          <CardHeader>
            <CardTitle>{aprob.tipo_movimiento} de empleado #{aprob.num_empleado}</CardTitle>
            <p className="text-sm text-muted-foreground">Fecha incidencia: {aprob.fecha_incidencia}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {aprob.datos_json?.fechas?.map((f: string, i: number) => (
                <Badge key={i}>{f}</Badge>
              ))}
            </div>
            <Textarea
              placeholder="Comentario (opcional)"
              value={notas[aprob.idAprobacion] || ""}
              onChange={(e) =>
                setNotas((prev) => ({
                  ...prev,
                  [aprob.idAprobacion]: e.target.value,
                }))
              }
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => responder(aprob.idAprobacion, "rechazado")}>
                ❌ Rechazar
              </Button>
              <Button onClick={() => responder(aprob.idAprobacion, "aprobado")}>
                ✅ Aprobar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {aprobaciones.length === 0 && (
        <p className="text-center text-muted-foreground">No tienes solicitudes pendientes.</p>
      )}
    </div>
  );
}
