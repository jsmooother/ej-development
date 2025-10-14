"use client";

import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface InlineToggleProps {
  id: string;
  checked: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onToggle: (checked: boolean) => void;
  label?: string;
}

export function InlineToggle({
  id,
  checked,
  isLoading = false,
  disabled = false,
  onToggle,
  label,
}: InlineToggleProps) {
  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled || isLoading) {
      return;
    }

    const nextValue = !checked;
    console.log(`🔁 InlineToggle ${id} → ${nextValue}`);
    onToggle(nextValue);
  };

  const ariaLabel =
    label ?? (checked ? "Published - click to unpublish" : "Draft - click to publish");

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={checked}
      aria-busy={isLoading}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "bg-green-500" : "bg-muted-foreground/20"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
      {isLoading ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
        </span>
      ) : null}
    </button>
  );
}

