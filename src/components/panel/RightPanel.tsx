"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { AssistantChat } from "./AssistantChat";
import { ChatInputBar } from "./ChatInputBar";
import { cn } from "@/lib/utils";

export function RightPanel() {
  const embed = useAppStore((s) => s.embed);

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full min-h-0 rounded-2xl border border-neutral-200",
        "bg-neutral-100",
        embed ? "max-w-[400px]" : "w-[420px] min-w-[320px] max-w-[480px]"
      )}
    >
      <div className="flex-1 min-h-0 overflow-hidden px-4 pt-4 pb-3 border-b border-neutral-200">
        <AssistantChat />
      </div>
      <ChatInputBar />
    </div>
  );
}
