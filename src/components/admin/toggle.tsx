"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  id: string;
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Toggle({ id, name, label, description, defaultChecked = false, onChange }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-white p-5 transition-all hover:border-border/60">
      <div className="flex-1">
        <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-foreground">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
        )}
      </div>
      
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-foreground/20",
          checked ? "bg-green-500" : "bg-muted-foreground/20"
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
    </div>
  );
}

