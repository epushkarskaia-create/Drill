"use client";

import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

export function EmbedBanner() {
  return (
    <div className="absolute top-14 left-4 z-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-background border border-border"
      >
        <ArrowSquareOut className="size-3.5 text-neutral-500" weight="bold" />
        Open full experience
      </Link>
    </div>
  );
}
