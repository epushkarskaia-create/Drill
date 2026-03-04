"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Microphone, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { useState, useCallback } from "react";

export function BottomAskBar() {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const assistantGenerating = useAppStore((s) => s.assistantGenerating);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const setSuggestedChips = useAppStore((s) => s.setSuggestedChips);
  const setAssistantGenerating = useAppStore((s) => s.setAssistantGenerating);
  const setRightPanelTab = useAppStore((s) => s.setRightPanelTab);
  const activePoiId = useAppStore((s) => s.activePoiId);

  const sendMessage = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t) return;
      setInput("");
      setRightPanelTab("assistant");
      addChatMessage({ id: crypto.randomUUID(), role: "user", content: t });
      setAssistantGenerating(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: t,
            context: { activePoiId, mode: "explore" },
          }),
        });
        if (!res.ok) throw new Error("Chat failed");
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let full = "";
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const lines = decoder.decode(value, { stream: true }).split("\n");
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const data = JSON.parse(line);
                if (data.chunk) full += data.chunk;
                if (data.done && data.suggestedChips)
                  setSuggestedChips(data.suggestedChips);
              } catch {}
            }
          }
        }
        addChatMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: full || "No response.",
        });
      } catch {
        addChatMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't get a response. Please try again.",
        });
      } finally {
        setAssistantGenerating(false);
      }
    },
    [
      addChatMessage,
      setSuggestedChips,
      setAssistantGenerating,
      setRightPanelTab,
      activePoiId,
    ]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center px-4 py-3 bg-gradient-to-t from-black/30 to-transparent">
      <div className="flex w-full max-w-xl gap-2">
        <input
          type="text"
          placeholder="Ask about the rig…"
          className="flex-1 min-h-[44px] rounded-xl border border-input bg-background/95 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          disabled={assistantGenerating}
        />
        <Button
          type="button"
          size="icon"
          variant={listening ? "default" : "secondary"}
          className="min-h-[44px] min-w-[44px]"
          onClick={() => setListening(!listening)}
          aria-label={listening ? "Stop listening" : "Voice input"}
        >
          <Microphone className="size-4 text-neutral-500" weight="bold" />
        </Button>
        <Button
          type="button"
          size="icon"
          className="min-h-[44px] min-w-[44px]"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || assistantGenerating}
          aria-label="Send"
        >
          <PaperPlaneTilt className="size-4 text-neutral-500" weight="bold" />
        </Button>
      </div>
    </div>
  );
}
