// src/services/movementsService.ts

export async function crearMovimiento(movimiento: any) {
    const res = await fetch('http://localhost:3041/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimiento),
    });
    return res.json();
  }
  
  export async function responderAprobacion(idAprobacion: number, estatus: string, nota: string) {
    const res = await fetch(`http://localhost:3041/api/aprobaciones/${idAprobacion}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estatus, nota }),
    });
    return res.json();
  }
  
  export async function obtenerMovimientosPendientes(idAprobador: number) {
    try {
      const response = await fetch(`http://localhost:3041/api/aprobaciones/pendientes/${idAprobador}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

  
      if (!response.ok) {
        throw new Error("Error obteniendo movimientos pendientes");
      }
  
      const data = await response.json();
      console.log("Movimientos pendientes:", data);
return data.movimientos ?? [];
    } catch (error) {
      console.error("❌ Error al obtener movimientos pendientes:", error);
      return [];
    }
  }
  
  export async function obtenerAprobaciones(aprobador: number | string) {
    try {
      const response = await fetch(`http://localhost:3041/api/aprobaciones?aprobador=${aprobador}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error obteniendo aprobaciones");
      }
  
      const data = await response.json();
return data.data ?? [];
    } catch (error) {
      console.error("❌ Error al obtener aprobaciones:", error);
      return [];
    }
  }
  
  // 🔥 NUEVA FUNCIÓN para obtener movimientos SOLICITADOS por un empleado
  export async function obtenerMisMovimientos(numEmpleado: number) {
    try {
      const response = await fetch(`http://localhost:3041/api/movimientos/mios/${numEmpleado}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error obteniendo mis movimientos solicitados");
      }
  
      const data = await response.json();
return data.data ?? [];
    } catch (error) {
      console.error("❌ Error al obtener mis movimientos solicitados:", error);
      return [];
    }
  }
  