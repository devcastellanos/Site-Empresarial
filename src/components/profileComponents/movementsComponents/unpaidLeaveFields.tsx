"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface UnpaidLeaveFieldsProps {
  assignedDay: string;
  onAssignedDayChange: (value: string) => void;
  requestedDay: string;
  onRequestedDayChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function UnpaidLeaveFields({
  assignedDay,
  onAssignedDayChange,
  requestedDay,
  onRequestedDayChange,
  comments,
  onCommentsChange,
}: UnpaidLeaveFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Día con goce de sueldo asignado *</Label>
        <Input
          value={assignedDay}
          onChange={(e) => onAssignedDayChange(e.target.value)}
          placeholder="Ej. Lunes"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Día solicitado sin goce de sueldo *</Label>
        <Input
          value={requestedDay}
          onChange={(e) => onRequestedDayChange(e.target.value)}
          placeholder="Ej. Miércoles"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
