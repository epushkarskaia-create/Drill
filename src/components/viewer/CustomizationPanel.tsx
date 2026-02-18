"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { rig, getVariantsByModule, type Variant } from "@/data/rig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export function CustomizationPanel() {
  const { selectedVariants, setSelectedVariant, mode } = useAppStore();
  const [applying, setApplying] = useState<string | null>(null);

  if (mode !== "customize") return null;

  const handleApply = (moduleId: string, variantId: string) => {
    setApplying(`${moduleId}-${variantId}`);
    setTimeout(() => {
      setSelectedVariant(moduleId, variantId);
      setApplying(null);
    }, 350);
  };

  return (
    <div className="flex flex-col h-full min-h-0 text-neutral-900">
      <h3 className="text-sm font-semibold text-neutral-600 shrink-0 px-4 pt-4 pb-2">
        Customization
      </h3>
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-6 p-4 pt-0 pr-6">
          {rig.modules.map((module) => {
            const variants = getVariantsByModule(module.id);
            const activeId = selectedVariants[module.id] ?? variants[0]?.id;
            return (
              <div key={module.id} className="rounded-xl bg-white border border-neutral-200 p-4">
                <p className="text-base font-semibold text-neutral-900 pb-2">{module.name}</p>
                <div className="flex flex-wrap gap-2">
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
      </ScrollArea>
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
      className={cn(
        "relative flex flex-col items-start rounded-xl border-2 p-3 text-left transition-all min-w-[140px]",
        active
          ? "border-neutral-400 bg-neutral-100 text-neutral-900"
          : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-300",
        applying && "opacity-70 pointer-events-none"
      )}
    >
      {active && (
        <span className="absolute right-2 top-2 text-neutral-700">
          <Check className="size-4" weight="bold" />
        </span>
      )}
      <span className="font-medium text-sm">{variant.title}</span>
      <span className="text-xs text-neutral-600 mt-0.5">
        {variant.summary}
      </span>
      {applying && (
        <span className="mt-2 text-xs text-neutral-600 animate-pulse">
          Applying…
        </span>
      )}
    </button>
  );
}
