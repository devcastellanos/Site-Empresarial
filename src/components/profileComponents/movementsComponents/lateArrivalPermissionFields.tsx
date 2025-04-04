"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface LateArrivePermissionFieldsProps {
  entryTime: string;
  onEntryTimeChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function LateArrivePermissionFields({
  entryTime,
  onEntryTimeChange,
  comments,
  onCommentsChange,
}: LateArrivePermissionFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Hora autorizada de entrada *</Label>
        <Input
          type="time"
          value={entryTime}
          onChange={(e) => onEntryTimeChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
