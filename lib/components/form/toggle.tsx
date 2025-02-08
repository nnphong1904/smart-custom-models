import { Switch } from "@headlessui/react";
import { cn } from "@/utils";

interface ToggleProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <Switch.Group>
      <div className="flex items-start space-x-4">
        <Switch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full",
            checked ? "bg-blue-600" : "bg-gray-200",
            "transition-colors focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              checked ? "translate-x-6" : "translate-x-1",
            )}
          />
        </Switch>
        <div className="flex flex-col">
          <Switch.Label className="text-sm font-medium">{label}</Switch.Label>
          {description && (
            <Switch.Description className="text-sm text-gray-500">{description}</Switch.Description>
          )}
        </div>
      </div>
    </Switch.Group>
  );
}
