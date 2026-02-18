import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Environment, SceneMode } from "@/data/rig";

export type AppMode = "explore" | "valueTour" | "startupTour" | "customize";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Image URLs to show in assistant messages (e.g. POI media) */
  images?: string[];
  /** Suggested follow-up questions (up to 3 chips) for this assistant message */
  suggestedChips?: string[];
  /** POI to jump to when user clicks "Jump to component" for this message */
  jumpPoiId?: string | null;
}

export interface AudioToggles {
  sound: boolean;
  music: boolean;
  voice: boolean;
}

interface AppState {
  // Viewer
  activePoiId: string | null;
  resetViewTrigger: number;
  environment: Environment;
  sceneMode: SceneMode;
  mode: AppMode;

  // Tours
  activeTourId: string | null;
  tourStepIndex: number;
  tourPaused: boolean;

  // Customization
  selectedVariants: Record<string, string>; // moduleId -> variantId

  // Panel
  rightPanelTab: "assistant" | "customize";
  panelCollapsed: boolean;

  // Assistant
  chatHistory: ChatMessage[];
  suggestedChips: string[];
  assistantGenerating: boolean;
  streamingContent: string | null;
  lastJumpPoiId: string | null;

  // Audio (persisted)
  audio: AudioToggles;

  // Theme (persisted)
  theme: "light" | "dark";

  // Embed
  embed: boolean;
}

type AppActions = {
  setActivePoi: (id: string | null) => void;
  setResetViewTrigger: () => void;
  setEnvironment: (env: Environment) => void;
  setSceneMode: (mode: SceneMode) => void;
  setMode: (mode: AppMode) => void;

  startTour: (tourId: string) => void;
  exitTour: () => void;
  setTourStepIndex: (index: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  setTourPaused: (paused: boolean) => void;

  setSelectedVariant: (moduleId: string, variantId: string) => void;
  resetVariants: () => void;

  setRightPanelTab: (tab: "assistant" | "customize") => void;
  setPanelCollapsed: (collapsed: boolean) => void;

  addChatMessage: (msg: ChatMessage) => void;
  setSuggestedChips: (chips: string[]) => void;
  setAssistantGenerating: (v: boolean) => void;
  setStreamingContent: (v: string | null) => void;
  setLastJumpPoiId: (v: string | null) => void;
  clearChat: () => void;

  setAudio: (key: keyof AudioToggles, value: boolean) => void;

  setTheme: (theme: "light" | "dark") => void;
  setEmbed: (v: boolean) => void;
};

const defaultAudio: AudioToggles = { sound: true, music: false, voice: true };

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      activePoiId: null,
      resetViewTrigger: 0,
      environment: "desert",
      sceneMode: "exterior",
      mode: "explore",

      activeTourId: null,
      tourStepIndex: 0,
      tourPaused: false,

      selectedVariants: {},

      rightPanelTab: "assistant",
      panelCollapsed: false,

      chatHistory: [],
      suggestedChips: [
        "What is the max drilling depth?",
        "Tell me about the power unit",
        "How do I perform pre-start checks?",
      ],
      assistantGenerating: false,
      streamingContent: null,
      lastJumpPoiId: null,

      audio: defaultAudio,
      theme: "light",
      embed: false,

      setActivePoi: (id) => set({ activePoiId: id }),
      setResetViewTrigger: () => set((s) => ({ resetViewTrigger: s.resetViewTrigger + 1 })),
      setEnvironment: (environment) => set({ environment }),
      setSceneMode: (sceneMode) => set({ sceneMode }),
      setMode: (mode) => set({ mode }),

      startTour: (tourId) =>
        set({
          activeTourId: tourId,
          tourStepIndex: 0,
          tourPaused: false,
          mode: tourId === "valueTour" ? "valueTour" : "startupTour",
          rightPanelTab: "assistant",
        }),
      exitTour: () =>
        set({
          activeTourId: null,
          tourStepIndex: 0,
          tourPaused: false,
          mode: "explore",
        }),
      setTourStepIndex: (tourStepIndex) => set({ tourStepIndex }),
      nextTourStep: () => {
        const state = get();
        if (!state.activeTourId) return;
        // Max index is set by caller using tour steps length
        set({ tourStepIndex: state.tourStepIndex + 1 });
      },
      prevTourStep: () =>
        set((s) => ({ tourStepIndex: Math.max(0, s.tourStepIndex - 1) })),
      setTourPaused: (tourPaused) => set({ tourPaused }),

      setSelectedVariant: (moduleId, variantId) =>
        set((s) => ({
          selectedVariants: { ...s.selectedVariants, [moduleId]: variantId },
        })),
      resetVariants: () => set({ selectedVariants: {} }),

      setRightPanelTab: (rightPanelTab) => set({ rightPanelTab }),
      setPanelCollapsed: (panelCollapsed) => set({ panelCollapsed }),

      addChatMessage: (msg) =>
        set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
      setSuggestedChips: (suggestedChips) => set({ suggestedChips }),
      setAssistantGenerating: (assistantGenerating) => set({ assistantGenerating }),
      setStreamingContent: (streamingContent) => set({ streamingContent }),
      setLastJumpPoiId: (lastJumpPoiId) => set({ lastJumpPoiId }),
      clearChat: () => set({ chatHistory: [] }),

      setAudio: (key, value) =>
        set((s) => ({ audio: { ...s.audio, [key]: value } })),

      setTheme: (theme) => set({ theme }),

      setEmbed: (embed) => set({ embed }),
    }),
    {
      name: "drill-rig-app",
      partialize: (state) => ({ audio: state.audio, theme: state.theme }),
    }
  )
);
