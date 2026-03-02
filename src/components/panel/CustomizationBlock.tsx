"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { rig, getVariantsByModule, getModulesForPoi, type Variant } from "@/data/rig";
import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react/dist/ssr";
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
      <div className="rounded-xl bg-white border border-neutral-200 px-3 py-2.5 space-y-2.5">
        {modules.map((module) => {
          const variants = getVariantsByModule(module.id);
          const activeId = selectedVariants[module.id] ?? variants[0]?.id;
          return (
            <div key={module.id}>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5">
                {module.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((v) => (
                  <VariantChip
                    key={v.id}
                    variant={v}
                    active={activeId === v.id}
                    applying={applying === `${module.id}-${v.id}`}
                    onSelect={() => handleApply(module.id, v.id)}
                  />
                ))}
              </div>
            </div>
          );
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
      onClick={onSelect}
      disabled={applying}
      title={variant.summary}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left transition-all",
        active
          ? "border-neutral-400 bg-neutral-100 text-neutral-900"
          : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 hover:border-neutral-300",
        applying && "opacity-70 pointer-events-none"
      )}
    >
      {active && <Check className="size-3.5 shrink-0 text-neutral-600" weight="bold" />}
      <span className="text-sm font-medium">{variant.title}</span>
      {applying && (
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 text-xs text-neutral-600 animate-pulse">
          Applying…
        </span>
      )}
    </button>
  );
}
