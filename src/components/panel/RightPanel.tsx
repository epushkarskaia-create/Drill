"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssistantChat } from "./AssistantChat";
import { CustomizationPanel } from "@/components/viewer/CustomizationPanel";
import { ChatInputBar } from "./ChatInputBar";
import { ChatCircle, Palette } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export function RightPanel() {
  const {
    rightPanelTab,
    setRightPanelTab,
    setMode,
    embed,
  } = useAppStore();

  const handleTabChange = (v: string) => {
    const tab = v as "assistant" | "customize";
    setRightPanelTab(tab);
    setMode(tab === "customize" ? "customize" : "explore");
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full min-h-0 rounded-2xl border border-neutral-200",
        "bg-neutral-100",
        embed ? "max-w-[400px]" : "w-[420px] min-w-[320px] max-w-[480px]"
      )}
    >
      <Tabs
        value={rightPanelTab}
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col min-h-0 overflow-hidden"
      >
        <div className="shrink-0 p-3">
          <TabsList className="flex flex-row rounded-lg border border-neutral-200 bg-neutral-200 p-0.5 h-10 w-full [&>button]:flex-1">
            <TabsTrigger
              value="assistant"
              className="rounded-md border-0 bg-neutral-200 text-neutral-500 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm h-full min-h-0 py-0 inline-flex items-center justify-center gap-1.5 text-sm font-medium after:hidden"
            >
              <ChatCircle className="size-4 shrink-0" />
              Assistant
            </TabsTrigger>
            <TabsTrigger
              value="customize"
              className="rounded-md border-0 bg-neutral-200 text-neutral-500 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm h-full min-h-0 py-0 inline-flex items-center justify-center gap-1.5 text-sm font-medium after:hidden"
            >
              <Palette className="size-4 shrink-0" />
              Customize
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden px-4 pt-0 pb-3 border-t border-neutral-200">
          <TabsContent value="assistant" className="mt-0 h-full min-h-0 overflow-hidden data-[state=inactive]:hidden">
            <AssistantChat />
          </TabsContent>
          <TabsContent value="customize" className="mt-0 h-full min-h-0 overflow-hidden data-[state=inactive]:hidden">
            <CustomizationPanel />
          </TabsContent>
        </div>
      </Tabs>
      <ChatInputBar />
    </div>
  );
}
