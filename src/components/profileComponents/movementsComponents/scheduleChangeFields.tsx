"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface ScheduleChangeFieldsProps {
  newSchedule: string;
  onNewScheduleChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function ScheduleChangeFields({
  newSchedule,
  onNewScheduleChange,
  comments,
  onCommentsChange,
}: ScheduleChangeFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="new-schedule">Nuevo horario *</Label>
        <Input
          id="new-schedule"
          value={newSchedule}
          onChange={(e) => onNewScheduleChange(e.target.value)}
          placeholder="Ej: 8:00 a.m. - 5:00 p.m."
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
          required
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
