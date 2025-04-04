"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface WorkMeetingFieldsProps {
  assignedDay: string;
  onAssignedDayChange: (value: string) => void;
  requestedDay: string;
  onRequestedDayChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function WorkMeetingFields({
  assignedDay,
  onAssignedDayChange,
  requestedDay,
  onRequestedDayChange,
  comments,
  onCommentsChange,
}: WorkMeetingFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Fecha de reunión asignada *</Label>
        <Input
          value={assignedDay}
          onChange={(e) => onAssignedDayChange(e.target.value)}
          placeholder="Ej. 12 de Abril"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Fecha de reunión solicitada *</Label>
        <Input
          value={requestedDay}
          onChange={(e) => onRequestedDayChange(e.target.value)}
          placeholder="Ej. 13 de Abril"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
