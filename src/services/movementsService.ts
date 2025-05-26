// src/services/movementsService.ts

export async function crearMovimiento(movimiento: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimiento),
    });
    return res.json();
  }
  
  export async function responderAprobacion(idAprobacion: number, estatus: string, nota: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aprobaciones/${idAprobacion}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estatus, nota }),
    });
    return res.json();
  }
  
  export async function obtenerMovimientosPendientes(idAprobador: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aprobaciones/pendientes/${idAprobador}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aprobaciones?aprobador=${aprobador}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movimientos/mios/${numEmpleado}`, {
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

  export async function cargarMovimientos() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movimientos`);
    const data = await response.json();
    if (!data || !data.data) throw new Error("Datos vacíos");
    
    return data.data ?? [];	
  } catch (error) {
    console.error("Error al cargar movimientos:", error);
    return [];
  }
}
  