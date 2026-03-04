"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { getPoisByScene } from "@/data/rig";
import { getTourById } from "@/data/rig";
import { Button } from "@/components/ui/button";
import {
  CaretLeft,
  CaretRight,
  Pause,
  Play,
  ArrowsClockwise,
} from "@phosphor-icons/react/dist/ssr";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function PresenterControls() {
  const {
    activePoiId,
    setActivePoi,
    setResetViewTrigger,
    sceneMode,
    activeTourId,
    tourStepIndex,
    tourPaused,
    setTourStepIndex,
    nextTourStep,
    prevTourStep,
    setTourPaused,
    exitTour,
    mode,
  } = useAppStore();

  const pois = getPoisByScene(sceneMode);
  const tour = activeTourId ? getTourById(activeTourId) : null;
  const tourSteps = tour?.steps ?? [];
  const currentStep = tourSteps[tourStepIndex];
  const isLastStep = tourStepIndex >= tourSteps.length - 1;
  const isFirstStep = tourStepIndex <= 0;

  const handleNextPoi = () => {
    if (tour && tourSteps.length > 0) {
      if (!isLastStep) {
        nextTourStep();
        const nextPoiId = tourSteps[tourStepIndex + 1]?.poiId;
        if (nextPoiId) setActivePoi(nextPoiId);
      }
    } else {
      const idx = pois.findIndex((p) => p.id === activePoiId);
      const nextIdx = idx < pois.length - 1 ? idx + 1 : 0;
      setActivePoi(pois[nextIdx]?.id ?? null);
    }
  };

  const handlePrevPoi = () => {
    if (tour && tourSteps.length > 0) {
      if (!isFirstStep) {
        prevTourStep();
        const prevPoiId = tourSteps[tourStepIndex - 1]?.poiId;
        if (prevPoiId) setActivePoi(prevPoiId);
      }
    } else {
      const idx = pois.findIndex((p) => p.id === activePoiId);
      const prevIdx = idx > 0 ? idx - 1 : pois.length - 1;
      setActivePoi(pois[prevIdx]?.id ?? null);
    }
  };

  const handleResetView = () => {
    setActivePoi(null);
    setResetViewTrigger();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-xl border bg-background/90 p-1 shadow-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handlePrevPoi}
              disabled={tour ? isFirstStep : false}
              aria-label="Previous"
            >
              <CaretLeft className="size-4 text-neutral-500" weight="bold" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous</TooltipContent>
        </Tooltip>

        {activeTourId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTourPaused(!tourPaused)}
                aria-label={tourPaused ? "Resume" : "Pause"}
              >
                {tourPaused ? (
                  <Play className="size-4 text-neutral-500" weight="bold" />
                ) : (
                  <Pause className="size-4 text-neutral-500" weight="bold" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tourPaused ? "Resume" : "Pause"}</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleNextPoi}
              disabled={tour ? isLastStep : false}
              aria-label="Next"
            >
              <CaretRight className="size-4 text-neutral-500" weight="bold" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleResetView}
              aria-label="Reset view"
            >
              <ArrowsClockwise className="size-4 text-neutral-500" weight="bold" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset view</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
