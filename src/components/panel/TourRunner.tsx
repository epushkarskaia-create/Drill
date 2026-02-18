"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { getTourById, getPoiById } from "@/data/rig";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, CaretRight, CaretLeft, X, Play } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export function TourRunner() {
  const {
    activeTourId,
    tourStepIndex,
    tourPaused,
    setActivePoi,
    setTourStepIndex,
    nextTourStep,
    prevTourStep,
    setTourPaused,
    exitTour,
    startTour,
    setRightPanelTab,
  } = useAppStore();

  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const tour = activeTourId ? getTourById(activeTourId) : null;
  const steps = tour?.steps ?? [];
  const currentStep = steps[tourStepIndex];
  const isCompleted = steps.length > 0 && tourStepIndex >= steps.length;
  const progress = steps.length
    ? Math.min(100, ((tourStepIndex + 1) / steps.length) * 100)
    : 0;

  const handleExit = () => {
    exitTour();
    setExitDialogOpen(false);
  };

  const handleStartTour = (tourId: string) => {
    startTour(tourId);
    const t = getTourById(tourId);
    const firstPoi = t?.steps[0]?.poiId;
    if (firstPoi) setActivePoi(firstPoi);
  };

  if (!tour) {
    return (
      <ScrollArea className="h-full min-h-0 text-neutral-900">
        <div className="space-y-4 py-4">
          <p className="text-sm text-neutral-600">
            Start a guided tour to explore the rig.
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-white border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
            onClick={() => handleStartTour("valueTour")}
          >
            <p className="text-base font-semibold text-neutral-900">Value & Advantages Tour</p>
            <p className="text-xs text-neutral-600 mt-0.5">3–5 min</p>
            <span className="mt-2 inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-2 py-1 text-sm text-neutral-900">
              <Play className="size-4" />
              Start tour
            </span>
          </button>
          <button
            type="button"
            className="w-full rounded-xl bg-white border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
            onClick={() => handleStartTour("startupTour")}
          >
            <p className="text-base font-semibold text-neutral-900">How to Start / Pre-start Checks</p>
            <p className="text-xs text-neutral-600 mt-0.5">5–7 min</p>
            <span className="mt-2 inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-2 py-1 text-sm text-neutral-900">
              <Play className="size-4" />
              Start tour
            </span>
          </button>
        </div>
      </ScrollArea>
    );
  }

  if (isCompleted) {
    return (
      <ScrollArea className="h-full min-h-0 text-neutral-900">
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-3">
          <p className="font-semibold text-neutral-900">Tour complete</p>
          <p className="text-sm text-neutral-600">
            You’ve completed &quot;{tour.title}&quot;.
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-neutral-100 py-2.5 text-sm text-neutral-900 hover:bg-neutral-200 flex items-center justify-center gap-2"
            onClick={() => {
              setTourStepIndex(0);
              const firstPoi = tour.steps[0]?.poiId;
              if (firstPoi) setActivePoi(firstPoi);
            }}
          >
            <Play className="size-4" />
            Restart tour
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-neutral-200 py-2.5 text-sm text-neutral-900 hover:bg-neutral-100"
            onClick={() => {
              exitTour();
              setRightPanelTab("assistant");
            }}
          >
            Explore freely
          </button>
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="flex flex-col h-full text-neutral-900">
      <div className="flex items-center justify-between gap-2 py-2">
        <span className="text-sm font-medium truncate text-neutral-900">{tour.title}</span>
        <Progress value={progress} className="flex-1 max-w-[120px] bg-neutral-200 [&_[data-slot=progress-indicator]]:bg-neutral-600" />
        <span className="text-xs text-neutral-600">
          {tourStepIndex + 1} / {steps.length}
        </span>
      </div>
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2 py-2">
          {steps.map((step, i) => {
            const poi = getPoiById(step.poiId);
            const isCurrent = i === tourStepIndex;
            const isDone = i < tourStepIndex;
            return (
              <button
                key={step.poiId + i}
                type="button"
                className={`w-full rounded-xl p-3 text-left transition-colors border ${
                  isCurrent ? "bg-white border-neutral-300 ring-2 ring-neutral-300" : "bg-white border-neutral-200 hover:bg-neutral-50"
                } ${isDone ? "opacity-80" : ""}`}
                onClick={() => {
                  setTourStepIndex(i);
                  setActivePoi(step.poiId);
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                      isDone
                        ? "bg-neutral-600 text-white"
                        : isCurrent
                          ? "border-2 border-neutral-600 text-neutral-900"
                          : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {isDone ? <Check className="size-3" weight="bold" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-neutral-900">{poi?.title ?? step.poiId}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{step.narration}</p>
                    {step.safetyTag && (
                      <span className="mt-1 inline-block rounded-lg bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                        {step.safetyTag}
                      </span>
                    )}
                    {step.checklistItems && step.checklistItems.length > 0 && (
                      <ul className="mt-2 list-inside list-disc text-xs text-neutral-600">
                        {step.checklistItems.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="flex gap-2 pt-2 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => setExitDialogOpen(true)}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-100"
        >
          <X className="size-4 inline-block" />
          Exit
        </button>
        <button
          type="button"
          disabled={tourStepIndex <= 0}
          onClick={() => {
            prevTourStep();
            const prev = steps[tourStepIndex - 1];
            if (prev) setActivePoi(prev.poiId);
          }}
          className="rounded-xl bg-white border border-neutral-200 p-2 text-neutral-900 hover:bg-neutral-100 disabled:opacity-50"
        >
          <CaretLeft className="size-4" />
        </button>
        <button
          type="button"
          disabled={tourStepIndex >= steps.length}
          onClick={() => {
            nextTourStep();
            const next = steps[tourStepIndex + 1];
            if (next) setActivePoi(next.poiId);
          }}
          className="flex-1 rounded-xl bg-neutral-200 py-2 text-sm text-neutral-900 hover:bg-neutral-300 disabled:opacity-50 flex items-center justify-center gap-1"
        >
          Next
          <CaretRight className="size-4" />
        </button>
      </div>

      <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <DialogContent className="border-neutral-200 bg-white text-neutral-900">
          <DialogHeader>
            <DialogTitle>Exit tour?</DialogTitle>
            <DialogDescription className="text-neutral-600">
              Your progress will be lost. You can start the tour again anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExit}>Exit tour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
