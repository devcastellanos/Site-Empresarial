"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface WorkTripFieldsProps {
  tripLocation: string;
  onTripLocationChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  resumeDate: string;
  onResumeDateChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function WorkTripFields({
  tripLocation,
  onTripLocationChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  resumeDate,
  onResumeDateChange,
  comments,
  onCommentsChange,
}: WorkTripFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Lugar del viaje *</Label>
        <Input
          value={tripLocation}
          onChange={(e) => onTripLocationChange(e.target.value)}
          placeholder="Ej. Ciudad de México"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Fecha de inicio *</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Fecha de fin *</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div>
        <Label>Reanudar labores el día *</Label>
        <Input
          type="date"
          value={resumeDate}
          onChange={(e) => onResumeDateChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
