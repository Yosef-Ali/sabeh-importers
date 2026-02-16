"use client";

import { useTransition, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SettingsToggleProps {
  label: string;
  description: string;
  initialValue: boolean;
  action: (value: boolean) => Promise<{ success: boolean }>;
}

export function SettingsToggle({ label, description, initialValue, action }: SettingsToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function onCheckedChange(checked: boolean) {
    setEnabled(checked); // Optimistic update
    startTransition(async () => {
      try {
        await action(checked);
        toast.success(`Setting ${checked ? "enabled" : "disabled"} successfully`);
      } catch (error) {
        setEnabled(!checked); // Revert on error
        toast.error("Failed to update setting");
      }
    });
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-0.5">
        <Label className="text-base font-bold text-primary">{label}</Label>
        <p className="text-sm text-muted-foreground font-mono">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        <Switch
          checked={enabled}
          onCheckedChange={onCheckedChange}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
