"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
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
  X,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

type LightboxState = { urls: string[]; index: number };

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
  const stripRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") setLightbox((prev) => prev && { ...prev, index: (prev.index - 1 + prev.urls.length) % prev.urls.length });
      if (e.key === "ArrowRight") setLightbox((prev) => prev && { ...prev, index: (prev.index + 1) % prev.urls.length });
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  // Scroll strip so current thumbnail is visible
  useEffect(() => {
    if (!lightbox || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-index="${lightbox.index}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [lightbox?.index]);

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
                    <div className="mt-3 grid grid-cols-3 gap-1.5 max-w-md">
                      <button
                        type="button"
                        onClick={() => setLightbox({ urls: m.images!, index: 0 })}
                        className={`relative overflow-hidden border border-neutral-200 bg-neutral-100 cursor-pointer hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 ${
                          m.images.length >= 2
                            ? "col-span-2 row-span-2 min-h-[160px] rounded-l-xl"
                            : "col-span-3 min-h-[180px] rounded-xl"
                        }`}
                      >
                        <Image
                          src={m.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="320px"
                          unoptimized
                        />
                      </button>
                      {m.images.length >= 2 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setLightbox({ urls: m.images!, index: 1 })}
                            className="relative aspect-square overflow-hidden rounded-tr-xl border border-neutral-200 border-l-0 bg-neutral-100 cursor-pointer hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                          >
                            <Image
                              src={m.images[1]}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="140px"
                              unoptimized
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => m.images![2] && setLightbox({ urls: m.images!, index: 2 })}
                            disabled={!m.images[2]}
                            className="relative aspect-square overflow-hidden rounded-br-xl border border-neutral-200 border-l-0 border-t-0 bg-neutral-100 cursor-pointer hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-default disabled:hover:opacity-100"
                          >
                            {m.images[2] ? (
                              <>
                                <Image
                                  src={m.images[2]}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="140px"
                                  unoptimized
                                />
                                {m.images.length > 3 && (
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-br-xl text-white font-semibold text-lg pointer-events-none">
                                    +{m.images.length - 3}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center bg-neutral-200/80 rounded-br-xl text-neutral-500 font-semibold text-lg">
                                +{m.images.length - 2}
                              </span>
                            )}
                          </button>
                        </>
                      )}
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

      {/* Lightbox: large photo, arrows, strip of all photos below */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="View photo"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-neutral-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            <X className="size-5" weight="bold" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-2 min-h-0 w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightbox((prev) => prev && { ...prev, index: (prev.index - 1 + prev.urls.length) % prev.urls.length })}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 text-neutral-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous photo"
            >
              <CaretLeft className="size-6" weight="bold" />
            </button>

            <div className="relative flex-1 flex items-center justify-center max-h-[70vh] min-w-0">
              <Image
                src={lightbox.urls[lightbox.index]}
                alt=""
                width={1200}
                height={800}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
                unoptimized
              />
            </div>

            <button
              type="button"
              onClick={() => setLightbox((prev) => prev && { ...prev, index: (prev.index + 1) % prev.urls.length })}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 text-neutral-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next photo"
            >
              <CaretRight className="size-6" weight="bold" />
            </button>
          </div>

          <div
            ref={stripRef}
            className="mt-4 flex gap-2 overflow-x-auto overflow-y-hidden py-2 px-1 max-w-full scroll-smooth"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.urls.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                data-index={i}
                onClick={() => setLightbox((prev) => prev ? { ...prev, index: i } : null)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white [&>img]:object-cover ${
                  i === lightbox.index ? "border-white ring-2 ring-white" : "border-white/30 hover:border-white/60"
                }`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
