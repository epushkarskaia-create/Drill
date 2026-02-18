"use client";

import { cn } from "@/lib/utils";

interface PoiMarkerProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  active?: boolean;
  onClick: () => void;
  showLabel?: boolean;
}

export function PoiMarker({
  id,
  title,
  position,
  active,
  onClick,
  showLabel = true,
}: PoiMarkerProps) {
  return (
    <button
      type="button"
      aria-label={`Point of interest: ${title}`}
      aria-pressed={active}
      className={cn(
        "absolute z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "border-amber-500 bg-amber-500/20 scale-110 shadow-lg"
          : "border-white/80 bg-black/40 hover:bg-black/60 hover:scale-105 shadow-md"
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <span className="h-2 w-2 rounded-full bg-white" />
      {showLabel && (
        <span
          className={cn(
            "absolute left-1/2 top-full mt-1 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium text-white shadow-lg",
            active ? "bg-amber-600" : "bg-black/70"
          )}
          style={{ transform: "translateX(-50%)" }}
        >
          {title}
        </span>
      )}
    </button>
  );
}
