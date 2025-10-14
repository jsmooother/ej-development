"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InlineToggleProps {
  id: string;
  initialChecked: boolean;
  onToggle: (checked: boolean) => Promise<void>;
}

export function InlineToggle({ id, initialChecked, onToggle }: InlineToggleProps) {
  const [checked, setChecked] = useState(initialChecked);
  const [isUpdating, setIsUpdating] = useState(false);

  // Always sync with the prop - this is the source of truth
  useEffect(() => {
    setChecked((previous) => {
      console.log(`🔄 InlineToggle sync for ${id}: ${previous} → ${initialChecked}`);
      return initialChecked;
    });
  }, [initialChecked, id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking toggle
    e.stopPropagation(); // Stop event from bubbling to parent link

    console.log(`🔄 Toggle clicked for ${id}: ${checked} → ${!checked}`);

    setIsUpdating(true);
    const newValue = !checked;

    try {
      await onToggle(newValue);
      // Optimistically update the toggle so the UI reflects the change immediately.
      // The useEffect below will keep the state in sync with the parent should it
      // update from a fresh API response afterwards.
      setChecked(newValue);
      console.log(`✅ Toggle API call completed for ${id}: ${newValue}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
      // Revert to previous state on error
      setChecked(!newValue);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isUpdating}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50",
        checked ? "bg-green-500" : "bg-muted-foreground/20"
      )}
      aria-label={checked ? "Published - click to unpublish" : "Draft - click to publish"}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

