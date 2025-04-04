"use client";

import { ObservationsField } from "@/components/commonFields/observationField";

interface CommissionRestDayFieldsProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function CommissionRestDayFields({
  comments,
  onCommentsChange,
}: CommissionRestDayFieldsProps) {
  return (
    <div className="space-y-4">
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}