"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { Microphone } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { sendAssistantMessage } from "@/lib/assistantSend";

export function ChatInputBar() {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const assistantGenerating = useAppStore((s) => s.assistantGenerating);

  const handleSend = () => {
    const t = input.trim();
    if (!t) return;
    setInput("");
    sendAssistantMessage(t);
  };

  return (
    <div className="border-t border-neutral-200 p-2 shrink-0">
      <div className="flex items-center gap-2 rounded-2xl bg-neutral-200 px-2 py-1.5 focus-within:ring-2 focus-within:ring-neutral-300">
        <input
          type="text"
          placeholder="Ask anything"
          className="min-h-[40px] flex-1 border-0 bg-transparent pl-4 pr-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={assistantGenerating}
        />
        <button
          type="button"
          onClick={() => setListening(!listening)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-600 hover:bg-neutral-100 shadow-sm"
          aria-label={listening ? "Stop listening" : "Voice input"}
        >
          <Microphone className="size-4 text-neutral-500" weight="bold" />
        </button>
      </div>
    </div>
  );
}
