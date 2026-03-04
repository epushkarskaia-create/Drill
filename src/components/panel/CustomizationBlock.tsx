"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { rig, getVariantsByModule, getModulesForPoi, type Variant } from "@/data/rig";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CustomizationBlockProps {
  poiId: string;
}

export function CustomizationBlock({ poiId }: CustomizationBlockProps) {
  const { selectedVariants, setSelectedVariant } = useAppStore();
  const [applying, setApplying] = useState<string | null>(null);

  const moduleIds = getModulesForPoi(poiId);
  const modules = rig.modules.filter((m) => moduleIds.includes(m.id));

  const handleApply = (moduleId: string, variantId: string) => {
    setApplying(`${moduleId}-${variantId}`);
    setTimeout(() => {
      setSelectedVariant(moduleId, variantId);
      setApplying(null);
    }, 350);
  };

  if (modules.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium text-neutral-600">Customization</p>
      <div className="flex flex-wrap gap-1.5">
        {modules.map((module) => {
          const variants = getVariantsByModule(module.id);
          const activeId = selectedVariants[module.id] ?? variants[0]?.id;
          return variants.map((v) => (
            <VariantChip
              key={`${module.id}-${v.id}`}
              variant={v}
              active={activeId === v.id}
              applying={applying === `${module.id}-${v.id}`}
              onSelect={() => handleApply(module.id, v.id)}
            />
          ));
        })}
      </div>
    </div>
  );
}

function VariantChip({
  variant,
  active,
  applying,
  onSelect,
}: {
  variant: Variant;
  active: boolean;
  applying: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      disabled={applying}
      title={variant.summary}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-all",
        active
          ? "border-neutral-400 bg-neutral-100 text-neutral-900"
          : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 hover:border-neutral-300",
        applying && "opacity-70 pointer-events-none"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          active ? "border-neutral-600 bg-neutral-600" : "border-neutral-400 bg-transparent"
        )}
        aria-hidden
      >
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span className="text-sm font-medium">{variant.title}</span>
      {applying && (
        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 text-xs text-neutral-600 animate-pulse">
          Applying…
        </span>
      )}
    </button>
  );
}
