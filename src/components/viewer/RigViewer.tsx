"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { getPoisByScene, sceneImages } from "@/data/rig";
import { sendAssistantMessage } from "@/lib/assistantSend";
import { PoiMarker } from "./PoiMarker";
import { useMemo, useState } from "react";

export function RigViewer() {
  const { sceneMode, environment, activePoiId, setActivePoi } =
    useAppStore();
  const [imgError, setImgError] = useState(false);

  const pois = useMemo(
    () => getPoisByScene(sceneMode),
    [sceneMode]
  );

  const imageSrc = sceneImages[sceneMode][environment];

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      {/* Background: image or gradient placeholder */}
      <div className="absolute inset-0">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={`Rig scene ${sceneMode} ${environment}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : null}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 ${!imgError ? "hidden" : "flex items-center justify-center"}`}
        >
          <span className="text-white/60 text-lg">
            Rig scene — {sceneMode} / {environment}
          </span>
        </div>
      </div>

      {/* POI markers */}
      {pois.map((poi) => (
        <PoiMarker
          key={poi.id}
          id={poi.id}
          title={poi.title}
          position={poi.position}
          active={activePoiId === poi.id}
          showLabel={true}
          onClick={() => {
            setActivePoi(poi.id);
            sendAssistantMessage("Tell me about " + poi.title);
          }}
        />
      ))}
    </div>
  );
}
