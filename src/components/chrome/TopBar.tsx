"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { rig } from "@/data/rig";
import { EnvironmentSceneButton } from "@/components/viewer/EnvironmentSceneButton";
import { Button } from "@/components/ui/button";
import { Gear, ArrowsOut } from "@phosphor-icons/react/dist/ssr";
import { MenuSheet } from "./MenuSheet";
import { EmbedBanner } from "./EmbedBanner";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function TopBar() {
  const { embed, sceneMode, environment } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const sceneTitle = `${sceneMode === "exterior" ? "Exterior" : "Interior"} · ${environment === "desert" ? "Desert" : "Arctic"}`;

  return (
    <>
      <header
        className={cn(
          "absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-b from-black/40 to-transparent"
        )}
      >
        <div className="flex items-center gap-3">
          {!embed && <EnvironmentSceneButton />}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white drop-shadow-md">
              {rig.name}
            </span>
            <span className="text-xs text-white/80">{sceneTitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!embed && (
            <div className="rounded-lg border border-neutral-200 bg-white/95 p-0.5 shadow-sm">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 active:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                onClick={() => setMenuOpen(true)}
                aria-label="Settings"
              >
                <Gear className="size-5" />
              </Button>
            </div>
          )}
          <div className="rounded-lg border border-neutral-200 bg-white/95 p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 active:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen?.();
                  setFullscreen(true);
                } else {
                  document.exitFullscreen?.();
                  setFullscreen(false);
                }
              }}
              aria-label="Fullscreen"
            >
              <ArrowsOut className="size-5" />
            </Button>
          </div>
        </div>
      </header>
      <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
      {embed && <EmbedBanner />}
    </>
  );
}
