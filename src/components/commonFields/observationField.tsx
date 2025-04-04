"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ObservationsField({ value, onChange }: Props) {
  return (
    <div>
      <Label>Observaciones *</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describa la situación del movimiento a realizar..."
        className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        required
      />
    </div>
  );
}