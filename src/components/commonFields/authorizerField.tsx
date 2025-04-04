"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function AuthorizerField({ value, onChange }: Props) {
  return (
    <div>
      <Label>Authorized by *</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Name of supervisor or approver"
        className="w-full rounded-xl border bg-white/95 shadow-md backdrop-blur-sm"
        required
      />
    </div>
  );
}