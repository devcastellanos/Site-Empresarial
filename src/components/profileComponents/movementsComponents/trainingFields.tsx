"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ObservationsField } from "@/components/commonFields/observationField";

interface TrainingFieldsProps {
  trainingDays: string;
  onTrainingDaysChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  resumeDate: string;
  onResumeDateChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function TrainingFields({
  trainingDays,
  onTrainingDaysChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  resumeDate,
  onResumeDateChange,
  comments,
  onCommentsChange,
}: TrainingFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="training-days">Días de curso *</Label>
        <Input
          id="training-days"
          value={trainingDays}
          onChange={(e) => onTrainingDaysChange(e.target.value)}
          placeholder="Ej. 3"
          required
          type="number"
          min={1}
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Fecha de inicio *</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            required
            className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
          />
        </div>

        <div>
          <Label htmlFor="end-date">Fecha de fin *</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            required
            className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="resume-date">Reanudar labores el día *</Label>
        <Input
          id="resume-date"
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
