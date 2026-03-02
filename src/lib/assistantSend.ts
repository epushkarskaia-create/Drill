import { useAppStore } from "@/lib/store/useAppStore";

export async function sendAssistantMessage(text: string): Promise<void> {
  const t = text.trim();
  if (!t) return;
  const store = useAppStore.getState();
  store.setRightPanelTab("assistant");
  store.addChatMessage({ id: crypto.randomUUID(), role: "user", content: t });
  store.setAssistantGenerating(true);
  store.setStreamingContent("");
  const { activePoiId, mode } = store;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: t, context: { activePoiId, mode } }),
    });
    if (!res.ok) throw new Error("Chat failed");
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let responseImages: string[] | undefined;
    let responseChips: string[] | undefined;
    let responseJumpPoiId: string | null = null;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.chunk) {
              full += data.chunk;
              useAppStore.getState().setStreamingContent(full);
            }
            if (data.done) {
              if (Array.isArray(data.suggestedChips)) responseChips = data.suggestedChips;
              if (data.jumpPoiId != null) responseJumpPoiId = data.jumpPoiId;
              if (Array.isArray(data.images)) responseImages = data.images;
            }
          } catch {}
        }
      }
    }
    useAppStore.getState().addChatMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content: full || "No response.",
      ...(responseImages?.length ? { images: responseImages } : {}),
      ...(responseChips?.length ? { suggestedChips: responseChips.slice(0, 3) } : {}),
      ...(responseJumpPoiId != null ? { jumpPoiId: responseJumpPoiId } : {}),
      ...(activePoiId ? { poiId: activePoiId } : {}),
    });
  } catch {
    useAppStore.getState().addChatMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Sorry, I couldn't get a response. Please try again.",
    });
  } finally {
    useAppStore.getState().setAssistantGenerating(false);
    useAppStore.getState().setStreamingContent(null);
  }
}
