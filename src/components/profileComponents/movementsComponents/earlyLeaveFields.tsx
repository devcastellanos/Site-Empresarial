import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ObservationsField } from "@/components/commonFields/observationField";

interface EarlyLeaveFieldsProps {
  earlyTime: string;
  onEarlyTimeChange: (value: string) => void;
  comments: string;
  onCommentsChange: (value: string) => void;
}

export function EarlyLeaveFields({
  earlyTime,
  onEarlyTimeChange,
  comments,
  onCommentsChange,
}: EarlyLeaveFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Hora de salida anticipada *</Label>
        <Input
          type="time"
          value={earlyTime}
          onChange={(e) => onEarlyTimeChange(e.target.value)}
          className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
          required
        />
      </div>
      <ObservationsField value={comments} onChange={onCommentsChange} />
    </div>
  );
}
