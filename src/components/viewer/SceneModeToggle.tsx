"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import type { SceneMode } from "@/data/rig";
import { Button } from "@/components/ui/button";
import { TreeEvergreen, Armchair } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const modes: { id: SceneMode; label: string; Icon: typeof TreeEvergreen }[] = [
  { id: "exterior", label: "Exterior", Icon: TreeEvergreen },
  { id: "interior", label: "Interior", Icon: Armchair },
];

export function SceneModeToggle() {
  const sceneMode = useAppStore((s) => s.sceneMode);
  const setSceneMode = useAppStore((s) => s.setSceneMode);

  return (
    <div className="flex rounded-xl border bg-background/80 p-0.5">
      {modes.map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant={sceneMode === id ? "secondary" : "ghost"}
          size="sm"
          className={cn("gap-1.5", sceneMode === id && "shadow-sm")}
          onClick={() => setSceneMode(id)}
        >
          <Icon className="size-4 text-neutral-500" weight="bold" />
          {label}
        </Button>
      ))}
    </div>
  );
}
