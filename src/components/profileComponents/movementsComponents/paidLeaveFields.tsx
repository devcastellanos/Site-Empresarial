"use client";

import { ObservationsField } from "@/components/commonFields/observationField";

interface PaidLeaveFieldsProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function PaidLeaveFields({
  comments,
  onCommentsChange,
}: PaidLeaveFieldsProps) {
  return (
    <div className="space-y-4">
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
