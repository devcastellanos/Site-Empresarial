// utils/renderDatosJsonPorTipo.tsx

import React from "react";

export function renderDatosJsonPorTipo(tipo: string, datos: any) {
  switch (tipo) {
    case "Cambio de descanso":
      return (
        <>
          <p><strong>Día asignado:</strong> {datos.assignedRestDay}</p>
          <p><strong>Día solicitado:</strong> {datos.requestedRestDay}</p>
        </>
      );
    case "Cambio de horario":
      return <p><strong>Nuevo horario solicitado:</strong> {datos.newSchedule}</p>;
    case "Comisión fuera de Oficina":
      return <></>;
    case "Comisión Prolongada fuera de Oficina":
      return (
        <>
          <p><strong>Dias de home office:</strong> {datos.homeOfficeDays}</p>
          <p><strong>Fecha de inicio:</strong> {datos.startDate}</p>
          <p><strong>Fecha de fin:</strong> {datos.endDate}</p>
          <p><strong>Fecha de reincorporación:</strong> {datos.resumeDate}</p>
        </>
      );
    case "Descanso laborado":
      return (
        <>
          <p><strong>Día asignado como descanso:</strong> {datos.assignedRestDay}</p>
          <p><strong>Día laborado como descanso:</strong> {datos.requestedRestDay}</p>
        </>
      );
    case "Viaje de Trabajo":
      return (
        <>
          <p><strong>Ubicación del viaje:</strong> {datos.tripLocation}</p>
          <p><strong>Inicio:</strong> {datos.startDate}</p>
          <p><strong>Fin:</strong> {datos.endDate}</p>
          <p><strong>Reincorporación:</strong> {datos.resumeDate}</p>
        </>
      );
    case "Permisos Especiales":
      let diasDescanso = 0;
      switch (datos.specialType?.toLowerCase()) {
        case "matrimonio": diasDescanso = 5; break;
        case "muerte": diasDescanso = 2; break;
        case "paternidad": diasDescanso = 5; break;
        default: diasDescanso = 0;
      }
      return (
        <>
          <p><strong>Tipo de permiso especial:</strong> {datos.specialType}</p>
          <p><strong>Días de descanso asignados:</strong> {diasDescanso}</p>
        </>
      );
    case "Permiso con goce de sueldo":
      return <></>;
    case "Permiso sin goce de sueldo":
      return (
        <>
          <p><strong>Día solicitado sin goce de sueldo:</strong> {datos.requestedRestDay}</p>
          <p><strong>Día con goce de sueldo asignado:</strong> {datos.assignedRestDay}</p>
        </>
      );
    case "Permiso para llegar tarde":
      return <p><strong>Hora de entrada:</strong> {datos.entryTime}</p>;
    case "Retardo justificado":
      return <p><strong>Hora de llegada:</strong> {datos.delayTime}</p>;
    case "Salida anticipada":
      return <p><strong>Hora de salida anticipada:</strong> {datos.earlyTime}</p>;
    case "Sin registro entrada":
    case "Sin registro salida":
      return null;
    case "Horario de Lactancia":
    case "Curso/Capacitación":
      return (
        <>
          <p><strong>Nuevo horario solicitado:</strong> {datos.newSchedule}</p>
          <p><strong>Inicio:</strong> {datos.startDate}</p>
          <p><strong>Fin:</strong> {datos.endDate}</p>
          <p><strong>Reincorporación:</strong> {datos.resumeDate}</p>
        </>
      );
    case "Junta de trabajo":
      return (
        <>
          <p><strong>Dia de reunión asignado:</strong> {datos.assignedRestDay}</p>
          <p><strong>Dia de reunión solicitado:</strong> {datos.requestedRestDay}</p>
        </>
      );
    case "Falta justificada IMSS":
    case "Tiempo extra":
      return (
        <>
          <p><strong>Horas extra:</strong> {datos.hours}</p>
          <p><strong>Hora de entrada:</strong> {datos.entryTime}</p>
          <p><strong>Hora de salida:</strong> {datos.exitTime}</p>
        </>
      );
    default:
      return <p className="text-gray-400 italic">Sin datos específicos</p>;
  }
}
