"use client";

import { ObservationsField } from "@/components/commonFields/observationField";

interface MissingEntryFieldsProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function MissingEntryFields({
  comments,
  onCommentsChange,
}: MissingEntryFieldsProps) {
  return (
    <div className="space-y-4">
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
