"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface OvertimeFieldsProps {
  hours: string;
  onHoursChange: (value: string) => void;
  entryTime: string;
  onEntryTimeChange: (value: string) => void;
  exitTime: string;
  onExitTimeChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function OvertimeFields({
  hours,
  onHoursChange,
  entryTime,
  onEntryTimeChange,
  exitTime,
  onExitTimeChange,
  comments,
  onCommentsChange,
}: OvertimeFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Cantidad de horas extra *</Label>
        <Input
          type="number"
          min={1}
          value={hours}
          onChange={(e) => onHoursChange(e.target.value)}
          placeholder="Ej. 2"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Hora de entrada *</Label>
        <Input
          type="time"
          value={entryTime}
          onChange={(e) => onEntryTimeChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Hora de salida *</Label>
        <Input
          type="time"
          value={exitTime}
          onChange={(e) => onExitTimeChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
