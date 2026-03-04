"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store/useAppStore";
import Link from "next/link";
import {
  Globe,
  Envelope,
  SpeakerHigh,
  MusicNotes,
  Microphone,
  Sun,
  Moon,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type IconProps = { className?: string; weight?: "bold" | "fill" | "duotone" | "light" | "regular" | "thin" };

type MenuItem =
  | {
      id: string;
      label: string;
      Icon: React.ComponentType<IconProps>;
      href: string;
      external?: boolean;
    }
  | {
      id: string;
      label: string;
      Icon: React.ComponentType<IconProps>;
      handler: (close: () => void, ...args: unknown[]) => void;
    };

const menuActions: MenuItem[] = [
  {
    id: "site",
    label: "Site",
    Icon: Globe,
    href: "https://example.com",
    external: true,
  },
  {
    id: "contact",
    label: "Contact",
    Icon: Envelope,
    href: "/contact",
  },
];

const themes = [
  { id: "light" as const, label: "Light", Icon: Sun },
  { id: "dark" as const, label: "Dark", Icon: Moon },
];

export function MenuSheet({ open, onOpenChange }: MenuSheetProps) {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const audio = useAppStore((s) => s.audio);
  const setAudio = useAppStore((s) => s.setAudio);

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[320px] sm:max-w-[320px] p-0 flex flex-col">
        <SheetHeader className="px-5 pr-12 pt-5 pb-2">
          <SheetTitle className="text-lg">Settings</SheetTitle>
          <SheetDescription>Theme and navigation</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-5 pb-5">
          <div className="flex flex-col gap-5 flex-1 min-h-0">
            <section className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Theme
              </p>
              <div className="flex rounded-xl border border-neutral-200 bg-neutral-100 p-0.5">
                {themes.map(({ id, label, Icon }) => (
                  <Button
                    key={id}
                    variant={theme === id ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("flex-1 gap-1.5", theme === id && "shadow-sm")}
                    onClick={() => setTheme(id)}
                  >
                    <Icon className="size-4 shrink-0 text-neutral-500" weight="bold" />
                    {label}
                  </Button>
                ))}
              </div>
            </section>
              <Separator className="my-0" />
              <section className="flex flex-col">
                <div className="rounded-xl border border-neutral-200 bg-neutral-100/80 px-3 pt-3 pb-3 space-y-0">
                  <label className="flex h-10 items-center justify-between gap-3 cursor-pointer">
                    <span className="text-sm font-medium text-foreground flex items-center gap-3">
                      <SpeakerHigh className="size-4 shrink-0 text-neutral-500" weight="bold" />
                      Sound
                    </span>
                    <Switch
                      checked={audio.sound}
                      onCheckedChange={(v) => setAudio("sound", v)}
                    />
                  </label>
                  <div className="rounded-xl bg-neutral-200/60 mt-2 py-1.5 px-2 space-y-0">
                    <label className="flex h-9 items-center justify-between gap-3 cursor-pointer px-1 rounded hover:bg-neutral-300/40">
                      <span className="text-sm text-foreground flex items-center gap-3">
                        <MusicNotes className="size-4 shrink-0 text-neutral-500" weight="bold" />
                        Music
                      </span>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={audio.music}
                        onClick={() => setAudio("music", !audio.music)}
                        className={cn(
                          "size-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                          audio.music
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-neutral-300"
                        )}
                      >
                        {audio.music && <Check className="size-3" weight="bold" />}
                      </button>
                    </label>
                    <div className="my-1 border-t border-neutral-300/80" />
                    <label className="flex h-9 items-center justify-between gap-3 cursor-pointer px-1 rounded hover:bg-neutral-300/40">
                      <span className="text-sm text-foreground flex items-center gap-3">
                        <Microphone className="size-4 shrink-0 text-neutral-500" weight="bold" />
                        Voice
                      </span>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={audio.voice}
                        onClick={() => setAudio("voice", !audio.voice)}
                        className={cn(
                          "size-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                          audio.voice
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-neutral-300"
                        )}
                      >
                        {audio.voice && <Check className="size-3" weight="bold" />}
                      </button>
                    </label>
                  </div>
                </div>
              </section>
            <nav className="flex flex-col gap-0.5 mt-auto">
              {menuActions.map((item) => {
                const Icon = item.Icon;
                const btnClass = "w-full justify-start gap-3 h-10 px-2 -mx-2";
                if ("href" in item && item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={close}
                    >
                      <Button variant="ghost" className={btnClass}>
                        <Icon className="size-5 shrink-0 text-neutral-500" weight="bold" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                }
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={btnClass}
                    onClick={() => {
                      if (!("handler" in item)) return;
                      item.handler(close);
                    }}
                  >
                    <Icon className="size-5 shrink-0 text-neutral-500" weight="bold" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
