"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface JustifiedDelayFieldsProps {
  delayTime: string;
  onDelayTimeChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function JustifiedDelayFields({
  delayTime,
  onDelayTimeChange,
  comments,
  onCommentsChange,
}: JustifiedDelayFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Hora de llegada tardía *</Label>
        <Input
          type="time"
          value={delayTime}
          onChange={(e) => onDelayTimeChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
