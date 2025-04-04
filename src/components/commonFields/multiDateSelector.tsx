"use client";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { es } from "date-fns/locale";

interface Props {
  selectedDates: Date[];
  onSelect: (dates: Date[] | undefined) => void;
}

export function MultiDateSelector({ selectedDates, onSelect }: Props) {
  return (
    <div>
      <Label>Select the days *</Label>
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={onSelect}
        className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        locale={es}
      />
    </div>
  );
}