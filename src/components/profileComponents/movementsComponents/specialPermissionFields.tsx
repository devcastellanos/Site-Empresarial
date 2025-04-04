"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ObservationsField } from "@/components/commonFields/observationField";

interface SpecialPermissionFieldsProps {
  specialType: string;
  onSpecialTypeChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function SpecialPermissionFields({
  specialType,
  onSpecialTypeChange,
  comments,
  onCommentsChange,
}: SpecialPermissionFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Tipo de permiso especial *</Label>
        <Select value={specialType} onValueChange={onSpecialTypeChange}>
          <SelectTrigger className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="muerte">Muerte de familiar directo (2 días)</SelectItem>
            <SelectItem value="matrimonio">Matrimonio (5 días)</SelectItem>
            <SelectItem value="paternidad">Paternidad (5 días)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
