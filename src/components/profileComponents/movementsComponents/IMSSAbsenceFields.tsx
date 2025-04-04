"use client";

import { ObservationsField } from "@/components/commonFields/observationField";

interface IMSSAbsenceFieldsProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function IMSSAbsenceFields({
  comments,
  onCommentsChange,
}: IMSSAbsenceFieldsProps) {
  return (
    <div className="space-y-4">
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
