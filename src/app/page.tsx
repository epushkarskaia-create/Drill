"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RigViewer3D } from "@/components/viewer/RigViewer3D";
import { RightPanel } from "@/components/panel/RightPanel";
import { TopBar } from "@/components/chrome/TopBar";
import { TourTimelineBar } from "@/components/viewer/TourTimelineBar";
import { useAppStore } from "@/lib/store/useAppStore";

function ViewerContent() {
  const searchParams = useSearchParams();
  const setEmbed = useAppStore((s) => s.setEmbed);

  useEffect(() => {
    const embed = searchParams.get("embed") === "1";
    setEmbed(embed);
  }, [searchParams, setEmbed]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background p-2 gap-2 items-stretch">
      <main className="relative flex-1 flex flex-col min-w-0 min-h-0 rounded-xl overflow-hidden">
        <RigViewer3D />
        <TopBar />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none px-4 pb-4 w-full box-border">
          <TourTimelineBar />
        </div>
      </main>
      <aside className="flex shrink-0 overflow-hidden min-h-0">
        <RightPanel />
      </aside>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-muted">Loading…</div>}>
      <ViewerContent />
    </Suspense>
  );
}
