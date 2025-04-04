"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface RestChangeFieldsProps {
  assignedDay: string;
  onAssignedDayChange: (value: string) => void;
  requestedDay: string;
  onRequestedDayChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function RestChangeFields({
  assignedDay,
  onAssignedDayChange,
  requestedDay,
  onRequestedDayChange,
  comments,
  onCommentsChange,
}: RestChangeFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="assigned-rest-day">Día de Descanso Asignado *</Label>
        <Input
          id="assigned-rest-day"
          value={assignedDay}
          onChange={(e) => onAssignedDayChange(e.target.value)}
          placeholder="Ej. Domingo"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label htmlFor="requested-rest-day">Día de Descanso Solicitado *</Label>
        <Input
          id="requested-rest-day"
          value={requestedDay}
          onChange={(e) => onRequestedDayChange(e.target.value)}
          placeholder="Ej. Lunes"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
