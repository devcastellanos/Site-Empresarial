"use client";

import { ObservationsField } from "@/components/commonFields/observationField";

interface ExternalAssignmentFieldsProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function ExternalAssignmentFields({
  comments,
  onCommentsChange,
}: ExternalAssignmentFieldsProps) {
  return (
    <div className="space-y-4">
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
