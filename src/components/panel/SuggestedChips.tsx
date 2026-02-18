"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

interface SuggestedChipsProps {
  onSelect: (text: string) => void;
  /** When provided, show these chips (e.g. from a message); otherwise use store (empty state) */
  chips?: string[];
  jumpPoiId?: string | null;
  onJumpToPoi?: (poiId: string) => void;
  className?: string;
}

export function SuggestedChips({
  onSelect,
  chips: chipsProp,
  jumpPoiId: jumpPoiIdProp,
  onJumpToPoi,
  className,
}: SuggestedChipsProps) {
  const storeChips = useAppStore((s) => s.suggestedChips);
  const storeJumpPoiId = useAppStore((s) => s.lastJumpPoiId);
  const chips = chipsProp ?? storeChips;
  const jumpPoiId = jumpPoiIdProp ?? storeJumpPoiId;

  if (!chips.length && !jumpPoiId) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.slice(0, 3).map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="rounded-xl bg-white border border-neutral-200 px-3 py-2 text-xs text-neutral-900 hover:bg-neutral-100"
        >
          {chip}
        </button>
      ))}
      {jumpPoiId && onJumpToPoi && (
        <button
          type="button"
          onClick={() => onJumpToPoi(jumpPoiId)}
          className="rounded-xl bg-white border border-neutral-200 px-3 py-2 text-xs text-neutral-900 hover:bg-neutral-100"
        >
          Jump to component
        </button>
      )}
    </div>
  );
}
