"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { getTourById, getPoiById, getPoisByScene } from "@/data/rig";
import { sendAssistantMessage } from "@/lib/assistantSend";
import { Button } from "@/components/ui/button";
import {
  CaretLeft,
  CaretRight,
  ArrowsClockwise,
  Check,
  X,
  Book,
  Compass,
} from "@phosphor-icons/react/dist/ssr";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/** Bar tour buttons: when there are more than 2 tours, switch back to dropdown (see handleStartTour). */
const BAR_TOUR_BUTTONS: { tourId: string; label: string; icon: React.ComponentType<{ className?: string; weight?: "fill" }> }[] = [
  { tourId: "startupTour", label: "Training tour", icon: Book },
  { tourId: "valueTour", label: "Introductory tour", icon: Compass },
];

export function TourTimelineBar() {
  const {
    activeTourId,
    tourStepIndex,
    sceneMode,
    activePoiId,
    setActivePoi,
    setTourStepIndex,
    nextTourStep,
    prevTourStep,
    exitTour,
    startTour,
    setResetViewTrigger,
  } = useAppStore();

  const pois = getPoisByScene(sceneMode);

  const tour = activeTourId ? getTourById(activeTourId) : null;
  const steps = tour?.steps ?? [];
  const currentStep = steps[tourStepIndex];
  const currentPoi = currentStep ? getPoiById(currentStep.poiId) : null;
  const isFirstStep = tourStepIndex <= 0;
  const isLastStep = tourStepIndex >= steps.length - 1;
  const completedCount = tourStepIndex + (tourStepIndex >= steps.length ? 0 : 1);
  const remainingCount = Math.max(0, steps.length - tourStepIndex - 1);

  const handleStartTour = (tourId: string) => {
    startTour(tourId);
    const t = getTourById(tourId);
    const firstPoi = t?.steps[0]?.poiId;
    if (firstPoi) {
      setActivePoi(firstPoi);
      const poi = getPoiById(firstPoi);
      if (poi) sendAssistantMessage("Tell me about " + poi.title);
    }
  };

  const handlePrev = () => {
    if (!tour || steps.length === 0 || isFirstStep) return;
    prevTourStep();
    const prevPoiId = steps[tourStepIndex - 1]?.poiId;
    if (prevPoiId) {
      setActivePoi(prevPoiId);
      const poi = getPoiById(prevPoiId);
      if (poi) sendAssistantMessage("Tell me about " + poi.title);
    }
  };

  const handleNext = () => {
    if (!tour || steps.length === 0 || isLastStep) return;
    nextTourStep();
    const nextPoiId = steps[tourStepIndex + 1]?.poiId;
    if (nextPoiId) {
      setActivePoi(nextPoiId);
      const poi = getPoiById(nextPoiId);
      if (poi) sendAssistantMessage("Tell me about " + poi.title);
    }
  };

  const handleStopTour = () => {
    exitTour();
  };

  const handleResetView = () => {
    if (isTourActive) {
      setResetViewTrigger();
    } else {
      setActivePoi(null);
      exitTour();
      setResetViewTrigger();
    }
  };

  const handlePrevPoi = () => {
    if (isTourActive) handlePrev();
    else {
      const idx = pois.findIndex((p) => p.id === activePoiId);
      const prevIdx = idx > 0 ? idx - 1 : pois.length - 1;
      const prevPoi = pois[prevIdx];
      if (prevPoi) {
        setActivePoi(prevPoi.id);
        sendAssistantMessage("Tell me about " + prevPoi.title);
      } else {
        setActivePoi(null);
      }
    }
  };

  const handleNextPoi = () => {
    if (isTourActive) handleNext();
    else {
      const idx = pois.findIndex((p) => p.id === activePoiId);
      const nextIdx = idx < pois.length - 1 && idx >= 0 ? idx + 1 : 0;
      const nextPoi = pois[nextIdx];
      if (nextPoi) {
        setActivePoi(nextPoi.id);
        sendAssistantMessage("Tell me about " + nextPoi.title);
      } else {
        setActivePoi(null);
      }
    }
  };

  const handleStepClick = (index: number) => {
    if (!tour || index < 0 || index >= steps.length) return;
    setTourStepIndex(index);
    const poiId = steps[index]?.poiId;
    if (poiId) {
      setActivePoi(poiId);
      const poi = getPoiById(poiId);
      if (poi) sendAssistantMessage("Tell me about " + poi.title);
    }
  };

  const isTourActive = Boolean(activeTourId && tour);

  return (
    <div
      className={cn(
        "w-full max-w-full pointer-events-auto box-border",
        "rounded-xl border border-neutral-200 bg-white/95 shadow-lg backdrop-blur-sm",
        "flex flex-col gap-2 p-2 sm:p-2.5"
      )}
    >
      {!isTourActive ? (
        <div className="flex flex-wrap items-center gap-2">
          {BAR_TOUR_BUTTONS.map(({ tourId, label, icon: Icon }) => (
            <Button
              key={tourId}
              size="sm"
              variant="ghost"
              className="h-9 gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 hover:border-neutral-300 px-3"
              onClick={() => handleStartTour(tourId)}
              aria-label={label}
            >
              <Icon className="size-4 shrink-0 text-neutral-500" weight="bold" />
              {label}
            </Button>
          ))}
          <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 ml-auto">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handlePrevPoi}
              aria-label="Previous point"
              className="h-7 w-7 rounded-md text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            >
              <CaretLeft className="size-3.5 text-neutral-500" weight="bold" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleNextPoi}
              aria-label="Next point"
              className="h-7 w-7 rounded-md text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            >
              <CaretRight className="size-3.5 text-neutral-500" weight="bold" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleResetView}
              aria-label="Reset view"
              className="h-7 w-7 rounded-md text-neutral-600 hover:bg-neutral-200"
            >
              <ArrowsClockwise className="size-3.5 text-neutral-500" weight="bold" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header: (title + progress) left, step counter + actions right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 truncate text-sm font-medium text-neutral-900 max-w-[180px] sm:max-w-[220px]">
                {tour?.title}
              </span>
              <Progress
                value={steps.length ? ((tourStepIndex + 1) / steps.length) * 100 : 0}
                className="h-2 w-20 sm:w-28 shrink-0 bg-neutral-200 [&_[data-slot=progress-indicator]]:bg-neutral-600"
                aria-valuenow={tourStepIndex + 1}
                aria-valuemin={1}
                aria-valuemax={steps.length}
              />
              <span className="shrink-0 text-sm font-medium text-neutral-600 tabular-nums">
                {tourStepIndex + 1}/{steps.length}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 ml-auto">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                onClick={handleStopTour}
                aria-label="Exit tour"
              >
                <X className="size-3.5 text-neutral-500" weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md"
                onClick={handlePrev}
                disabled={isFirstStep}
                aria-label="Previous"
              >
                <CaretLeft className="size-3.5 text-neutral-500" weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                onClick={handleNext}
                disabled={isLastStep}
                aria-label="Next"
              >
                <CaretRight className="size-3.5 text-neutral-500" weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-neutral-600 hover:bg-neutral-200"
                onClick={handleResetView}
                aria-label="Reset view"
              >
                <ArrowsClockwise className="size-3.5 text-neutral-500" weight="bold" />
              </Button>
            </div>
          </div>

          {/* Horizontal checklist: checkpoint cards */}
          <div className="w-full overflow-x-auto overflow-y-hidden scroll-smooth">
            <div className="flex gap-2 py-1 min-w-0">
              {steps.map((step, i) => {
                const poi = getPoiById(step.poiId);
                const isCurrent = i === tourStepIndex;
                const isDone = i < tourStepIndex;
                return (
                  <button
                    key={step.poiId + i}
                    type="button"
                    onClick={() => handleStepClick(i)}
                    className={cn(
                      "shrink-0 min-w-[100px] w-max max-w-[260px] rounded-xl border px-3 py-2.5 pr-4 text-left transition-colors outline-none",
                      isCurrent &&
                        "bg-white border-2 border-neutral-800 shadow-md shadow-neutral-900/10",
                      !isCurrent && "border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300",
                      isDone && "opacity-90"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium leading-none",
                          isDone && "bg-neutral-600 text-white",
                          isCurrent && "border-2 border-neutral-600 bg-white text-neutral-900",
                          !isDone && !isCurrent && "bg-neutral-200 text-neutral-600"
                        )}
                      >
                        {isDone ? <Check className="size-3.5 text-white" weight="bold" /> : i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-neutral-900 whitespace-nowrap" title={poi?.title}>
                          {poi?.title ?? step.poiId}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
