"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface ExtendedAssignmentFieldsProps {
  homeOfficeDays: string;
  onHomeOfficeDaysChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  resumeDate: string;
  onResumeDateChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function ExtendedAssignmentFields({
  homeOfficeDays,
  onHomeOfficeDaysChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  resumeDate,
  onResumeDateChange,
  comments,
  onCommentsChange,
}: ExtendedAssignmentFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
        <Label>Días de home office *</Label>
        <Input
          type="number"
          min={1}
          value={homeOfficeDays}
          onChange={(e) => onHomeOfficeDaysChange(e.target.value)}
          placeholder="Ej. 3"
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
        </div>
        

        <div className="col-span-1">
        <Label>Fecha de inicio *</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
        </div>

        
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
