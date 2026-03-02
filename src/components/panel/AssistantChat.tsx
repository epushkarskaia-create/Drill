"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SuggestedChips } from "./SuggestedChips";
import { CustomizationBlock } from "./CustomizationBlock";
import { sendAssistantMessage } from "@/lib/assistantSend";
import Image from "next/image";

export function AssistantChat() {
  const {
    chatHistory,
    setActivePoi,
    setRightPanelTab,
    streamingContent,
    setLastJumpPoiId,
  } = useAppStore();

  const handleJumpToPoi = (poiId: string) => {
    setActivePoi(poiId);
    setRightPanelTab("assistant");
    setLastJumpPoiId(null);
  };

  const empty = chatHistory.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0 text-neutral-900">
      <ScrollArea className="flex-1 min-h-0 pr-4">
        {empty && !streamingContent ? (
          <div className="py-6 space-y-4">
            <p className="text-sm text-neutral-600">
              Try asking about the rig, specifications, or how to start.
            </p>
            <p className="text-sm font-medium text-neutral-900">I can also tell you:</p>
            <SuggestedChips
              onSelect={sendAssistantMessage}
              onJumpToPoi={handleJumpToPoi}
            />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {chatHistory.map((m) => (
              <div key={m.id} className="space-y-2">
                <div
                  className={`rounded-xl px-3 py-2.5 text-sm ${
                    m.role === "user"
                      ? "ml-auto mr-0 w-fit max-w-full bg-neutral-200 text-neutral-900"
                      : "mr-4 bg-white border border-neutral-200 text-neutral-900"
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
                </div>
                {m.role === "assistant" && m.poiId && (
                  <div className="mr-4">
                    <CustomizationBlock poiId={m.poiId} />
                  </div>
                )}
                {m.role === "assistant" && (m.suggestedChips?.length || m.jumpPoiId) && (
                  <div className="mr-4 space-y-1.5 pl-1">
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
            ))}
            {streamingContent && (
              <div className="mr-4 rounded-xl bg-white border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900">
                {streamingContent}
                <span className="animate-pulse">▋</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
