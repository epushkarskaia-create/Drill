"use client";

import { useRef, useLayoutEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { SuggestedChips } from "./SuggestedChips";
import { CustomizationBlock } from "./CustomizationBlock";
import { sendAssistantMessage } from "@/lib/assistantSend";
import {
  Sparkle,
  Compass,
  Info,
  Question,
  ClipboardText,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

const GENERAL_SUGGESTIONS = [
  { icon: Compass, label: "Explore rig", message: "Give me an overview of the drill rig" },
  { icon: Info, label: "About component", message: "Tell me about a component" },
  { icon: Question, label: "Max depth?", message: "What is the max drilling depth?" },
  { icon: ClipboardText, label: "Pre-start", message: "How do I perform pre-start checks?" },
];

export function AssistantChat() {
  const {
    chatHistory,
    setActivePoi,
    setRightPanelTab,
    streamingContent,
    setLastJumpPoiId,
  } = useAppStore();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Всегда внизу контента: подтягиваем скролл при любом наполнении (новое сообщение, стриминг)
  useLayoutEffect(() => {
    const scrollEl = chatScrollRef.current;
    if (!scrollEl) return;
    scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.clientHeight;
  }, [chatHistory, streamingContent]);

  const handleJumpToPoi = (poiId: string) => {
    setActivePoi(poiId);
    setRightPanelTab("assistant");
    setLastJumpPoiId(null);
  };

  const handleGeneralSuggestion = (item: (typeof GENERAL_SUGGESTIONS)[0]) => {
    if (item.message) sendAssistantMessage(item.message);
  };

  const empty = chatHistory.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0 text-neutral-900 relative">
      <div
        ref={chatScrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4"
      >
        {empty && !streamingContent ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center py-8 px-2 text-center">
            <div className="relative h-14 w-14 mb-5 shrink-0">
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-full text-[#FFF5EB]"
                style={{
                  background: "radial-gradient(circle at center, #ea580c 0%, #f97316 25%, #fb923c 50%, #fdba74 75%, #fed7aa 100%)",
                  boxShadow: "0 0 14px 4px rgba(251, 146, 60, 0.4), 0 0 8px 2px rgba(234, 88, 12, 0.25)",
                }}
              >
                <Sparkle className="size-8 text-[#FFF5EB]" weight="fill" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-neutral-800 mb-4">Hi! I'm your assistant</h2>
            <p className="text-sm text-neutral-500 max-w-[280px] mb-[56px] leading-relaxed">
              I'm here to help you explore the drill rig, its specifications, and how to get started. Ask a question or pick a suggestion below.
            </p>
            {/* General suggestions (scene + questions), centered, with icons */}
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {GENERAL_SUGGESTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleGeneralSuggestion(item)}
                      className="inline-flex items-center gap-1.5 justify-start text-left rounded-xl bg-[#FFF5EB] pl-[10px] pr-3 py-2 text-[12px] font-medium text-[#E17100] hover:bg-[#FFEBD9] transition-colors border border-[#edd9c4] outline-none"
                    >
                      <Icon className="size-4 shrink-0 text-[#E17100]" weight="bold" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {chatHistory.map((m) => (
              <div key={m.id} className="space-y-2">
                <div
                  className={`rounded-xl px-3 py-2.5 text-sm ${
                    m.role === "user"
                      ? "ml-auto mr-0 w-fit max-w-full bg-neutral-200 text-neutral-900"
                      : "mr-4 max-w-[85%] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 space-y-4"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.role === "assistant" && m.images && m.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.images.map((src, i) => (
                        <div
                          key={i}
                          className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="160px"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {m.role === "assistant" && (m.poiId || m.suggestedChips?.length || m.jumpPoiId) && (
                    <div className="pt-3 mt-3 border-t border-neutral-200">
                      {m.poiId && <CustomizationBlock poiId={m.poiId} />}
                      {(m.suggestedChips?.length || m.jumpPoiId) && (
                        <div className={m.poiId ? "mt-3 space-y-1.5" : "space-y-1.5"}>
                          <p className="text-sm font-medium text-neutral-700">I can also tell you:</p>
                          <SuggestedChips
                            chips={m.suggestedChips}
                            jumpPoiId={m.jumpPoiId}
                            onSelect={sendAssistantMessage}
                            onJumpToPoi={handleJumpToPoi}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {streamingContent && (
              <div className="mr-4 rounded-xl bg-white border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900">
                {streamingContent}
                <span className="animate-pulse">▋</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
