"use client";

import { ObservationsField } from "@/components/commonFields/observationField";

interface MissingExitFieldsProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function MissingExitFields({
  comments,
  onCommentsChange,
}: MissingExitFieldsProps) {
  return (
    <div className="space-y-4">
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
