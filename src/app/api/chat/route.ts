import { NextRequest } from "next/server";
import { getPoiById } from "@/data/rig";
import type { POI } from "@/data/rig";

export const maxDuration = 30;

function buildPoiResponseText(poi: POI): string {
  let text = `Here is detailed information about the ${poi.title}.\n\n`;
  text += poi.description + "\n\n";
  if (poi.specs.length > 0) {
    text += "Key specifications:\n";
    for (const s of poi.specs) {
      text += `• ${s.label}: ${s.value}${s.unit ? " " + s.unit : ""}\n`;
    }
  }
  if (poi.media.length > 0) {
    text += "\nBelow you can see reference photos of this component.";
  }
  if (poi.docs.length > 0) {
    text += "\n\nRelated documents: " + poi.docs.map((d) => d.title).join(", ") + ".";
  }
  return text.trim();
}

function getPoiImageUrls(poi: POI): string[] {
  return poi.media
    .filter((m): m is { type: "image"; imageUrl: string } => m.type === "image" && !!m.imageUrl)
    .map((m) => m.imageUrl);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, context } = body as {
    message: string;
    context?: { activePoiId?: string | null; mode?: string; language?: string };
  };

  const lower = message.toLowerCase();
  const isTellMeAbout = lower.includes("tell me about") || lower.startsWith("about ");

  // POI-specific response when user asks about a POI (e.g. after clicking a marker)
  const activePoiId = context?.activePoiId ?? null;
  const poi = activePoiId ? getPoiById(activePoiId) : null;
  let responseText: string;
  let suggestedChips: string[];
  let jumpPoiId: string | null = null;
  let responseImages: string[] = [];

  if (poi && isTellMeAbout) {
    responseText = buildPoiResponseText(poi);
    responseImages = getPoiImageUrls(poi);
    suggestedChips = [
      "What is the max drilling depth?",
      "Tell me about the power unit",
      "How do I perform pre-start checks?",
      "What are the dimensions?",
    ].filter((c) => c !== message);
    jumpPoiId = activePoiId;
  } else {
    // Fallback: detect POI keywords for jump suggestion
    const keywordsByPoi: Record<string, string[]> = {
      overview: ["overview", "rig", "general"],
      engine: ["engine", "power", "torque", "fuel", "diesel"],
      mast: ["mast", "drilling", "depth", "angle"],
      hydraulics: ["hydraulics", "hydraulic", "pressure"],
      cab: ["cab", "cabin", "operator"],
      "cabin-interior": ["cabin", "interior", "controls"],
      "control-panel": ["control", "panel", "safety", "start", "pre-start"],
    };
    for (const [pid, words] of Object.entries(keywordsByPoi)) {
      if (words.some((w) => lower.includes(w))) {
        jumpPoiId = pid;
        break;
      }
    }
    const mockResponses: string[] = [
      "The DR-20 rig offers a maximum drilling depth of 200 m in standard configuration, with optional heavy-duty unit up to 300 m.",
      "The power unit is a 120 kW diesel engine with low emissions. Max torque is 4500 Nm. Service access is designed for quick maintenance.",
      "Pre-start checks include: level ground, area clear, fuel and coolant levels, hydraulic reservoir, cab displays on, seatbelt, E-stop released, and running the pre-start checklist on the control panel.",
    ];
    responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    suggestedChips = [
      "What is the max drilling depth?",
      "Tell me about the power unit",
      "How do I perform pre-start checks?",
      "What are the dimensions?",
    ].filter((c) => c !== message);
  }

  const stream = new ReadableStream({
    start(controller) {
      const words = responseText.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        if (i >= words.length) {
          clearInterval(interval);
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({
                done: true,
                suggestedChips,
                jumpPoiId,
                images: responseImages,
              }) + "\n"
            )
          );
          controller.close();
          return;
        }
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({ chunk: words[i] + " " }) + "\n"
          )
        );
        i++;
      }, 80);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
    },
  });
}
