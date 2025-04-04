"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface WorkedRestDayFieldsProps {
  assignedDay: string;
  onAssignedDayChange: (value: string) => void;
  requestedDay: string;
  onRequestedDayChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function WorkedRestDayFields({
  assignedDay,
  onAssignedDayChange,
  requestedDay,
  onRequestedDayChange,
  comments,
  onCommentsChange,
}: WorkedRestDayFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Día originalmente asignado como descanso *</Label>
        <Input
          value={assignedDay}
          onChange={(e) => onAssignedDayChange(e.target.value)}
          placeholder="Ej. Domingo"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Día en que se laboró el descanso *</Label>
        <Input
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
