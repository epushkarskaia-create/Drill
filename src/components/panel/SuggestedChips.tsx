"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";
import { Question } from "@phosphor-icons/react/dist/ssr";

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

  const chipClass = "inline-flex items-center gap-1.5 justify-start text-left rounded-xl bg-[#FFF5EB] pl-[10px] pr-3 py-2 text-[12px] font-medium text-[#E17100] hover:bg-[#FFEBD9] transition-colors border border-[#edd9c4] outline-none";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.slice(0, 3).map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className={chipClass}
        >
          <Question className="size-4 shrink-0 text-[#E17100]" weight="bold" />
          {chip}
        </button>
      ))}
      {jumpPoiId && onJumpToPoi && (
        <button
          type="button"
          onClick={() => onJumpToPoi(jumpPoiId)}
          className={chipClass}
        >
          <Question className="size-4 shrink-0 text-[#E17100]" weight="bold" />
          Jump to component
        </button>
      )}
    </div>
  );
}
