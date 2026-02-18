"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import type { Environment } from "@/data/rig";
import { Button } from "@/components/ui/button";
import { Sun, Snowflake } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const envs: { id: Environment; label: string; Icon: typeof Sun }[] = [
  { id: "desert", label: "Desert", Icon: Sun },
  { id: "arctic", label: "Arctic", Icon: Snowflake },
];

export function EnvironmentSwitcher() {
  const environment = useAppStore((s) => s.environment);
  const setEnvironment = useAppStore((s) => s.setEnvironment);

  return (
    <div className="flex rounded-lg border bg-background/80 p-0.5">
      {envs.map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant={environment === id ? "secondary" : "ghost"}
          size="sm"
          className={cn("gap-1.5", environment === id && "shadow-sm")}
          onClick={() => setEnvironment(id)}
        >
          <Icon className="size-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
