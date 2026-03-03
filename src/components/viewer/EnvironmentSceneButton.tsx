"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import type { Environment, SceneMode } from "@/data/rig";
import { Button } from "@/components/ui/button";
import { SunHorizon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const environments: { id: Environment; label: string }[] = [
  { id: "desert", label: "Desert" },
  { id: "arctic", label: "Arctic" },
];

const sceneModes: { id: SceneMode; label: string }[] = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
];

export function EnvironmentSceneButton() {
  const environment = useAppStore((s) => s.environment);
  const setEnvironment = useAppStore((s) => s.setEnvironment);
  const sceneMode = useAppStore((s) => s.sceneMode);
  const setSceneMode = useAppStore((s) => s.setSceneMode);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const ariaLabel = `Environment and scene: ${environment === "desert" ? "Desert" : "Arctic"} · ${sceneMode === "exterior" ? "Exterior" : "Interior"}`;

  return (
    <div className="relative">
      <div className="rounded-lg border border-neutral-200 bg-white/95 p-0.5 shadow-sm">
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="size-9 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={ariaLabel}
          aria-expanded={open}
        >
          <SunHorizon className="size-5 shrink-0 text-neutral-500" weight="bold" />
        </Button>
      </div>
      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 top-full mt-1.5 z-[100] w-56 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Environment
          </p>
          <div className="flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 mb-3">
            {environments.map(({ id, label: l }) => (
              <Button
                key={id}
                variant={environment === id ? "secondary" : "ghost"}
                size="sm"
                className={cn("flex-1", environment === id && "shadow-sm")}
                onClick={() => setEnvironment(id)}
              >
                {l}
              </Button>
            ))}
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Scene
          </p>
          <div className="flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5">
            {sceneModes.map(({ id, label: l }) => (
              <Button
                key={id}
                variant={sceneMode === id ? "secondary" : "ghost"}
                size="sm"
                className={cn("flex-1", sceneMode === id && "shadow-sm")}
                onClick={() => setSceneMode(id)}
              >
                {l}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
