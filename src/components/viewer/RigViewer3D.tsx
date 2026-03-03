"use client";

import { Suspense, useMemo, useEffect, useLayoutEffect, useRef, useState, type ComponentRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Sky } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/lib/store/useAppStore";
import { getPoisByScene, getPoiById } from "@/data/rig";
import { sendAssistantMessage } from "@/lib/assistantSend";
import { DrillRigModel } from "./DrillRigModel";
import { cn } from "@/lib/utils";

const SAND_COLOR = "#d4c4a0";
const SKY_GROUND_COLOR = "#e8dcc8";

function DesertBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(SKY_GROUND_COLOR);
    return () => {
      scene.background = null;
    };
  }, [scene]);
  return null;
}

function DesertScene() {
  return (
    <>
      <DesertBackground />
      <Sky
        distance={450000}
        sunPosition={[20, 50, 20]}
        inclination={0.52}
        azimuth={0.25}
        turbidity={8}
        rayleigh={0.5}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={SAND_COLOR} roughness={0.95} metalness={0.05} />
      </mesh>
    </>
  );
}

const EXTERIOR_CAMERA_POSITION: [number, number, number] = [4, 3, 4];
const EXTERIOR_CAMERA_TARGET: [number, number, number] = [0, 1.2, 0];
/** Камера внутри кабины (оранжевый куб) — вид на панель/интерьер */
const INTERIOR_CAMERA_POSITION: [number, number, number] = [0.75, 1.35, 0.5];
const INTERIOR_CAMERA_TARGET: [number, number, number] = [1.1, 1.15, 0.25];

const INITIAL_CAMERA_POSITION = EXTERIOR_CAMERA_POSITION;
const CAMERA_TARGET = EXTERIOR_CAMERA_TARGET;

const FLY_DURATION = 0.6;
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function SceneContent() {
  const { sceneMode, environment, activePoiId, setActivePoi, resetViewTrigger, selectedVariants } = useAppStore();
  const pois = useMemo(() => getPoisByScene(sceneMode), [sceneMode]);
  const orbitRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();
  const [controlsReady, setControlsReady] = useState(false);

  const animFromTarget = useRef(new THREE.Vector3());
  const animToTarget = useRef(new THREE.Vector3());
  const animFromCamera = useRef(new THREE.Vector3());
  const animToCamera = useRef(new THREE.Vector3());
  const animStartTime = useRef<number | null>(null);

  useLayoutEffect(() => {
    camera.position.set(...INITIAL_CAMERA_POSITION);
    camera.lookAt(new THREE.Vector3(...CAMERA_TARGET));
    camera.updateProjectionMatrix();
    setControlsReady(true);
  }, [camera]);

  // При переключении Exterior/Interior — камера «проваливается» внутрь кабины или возвращается снаружи
  useLayoutEffect(() => {
    if (!orbitRef.current) return;
    animStartTime.current = null;
    const controls = orbitRef.current;
    const [pos, tgt] = sceneMode === "interior"
      ? [INTERIOR_CAMERA_POSITION, INTERIOR_CAMERA_TARGET]
      : [EXTERIOR_CAMERA_POSITION, EXTERIOR_CAMERA_TARGET];
    camera.position.set(pos[0], pos[1], pos[2]);
    controls.target.set(tgt[0], tgt[1], tgt[2]);
    camera.lookAt(controls.target);
    camera.updateProjectionMatrix();
  }, [sceneMode, camera]);

  const resetTrigger = resetViewTrigger;
  const poiId = activePoiId ?? null;
  const mode = sceneMode ?? "exterior";
  useEffect(() => {
    if (!orbitRef.current) return;
    const controls = orbitRef.current;
    const poi = poiId ? getPoiById(poiId) : null;
    const pos3d = poi?.position3d;
    if (pos3d) {
      const target = new THREE.Vector3(pos3d.x, pos3d.y, pos3d.z);
      const [basePos, baseTgt] = mode === "interior"
        ? [INTERIOR_CAMERA_POSITION, INTERIOR_CAMERA_TARGET]
        : [EXTERIOR_CAMERA_POSITION, EXTERIOR_CAMERA_TARGET];
      const offset = new THREE.Vector3(basePos[0] - baseTgt[0], basePos[1] - baseTgt[1], basePos[2] - baseTgt[2]);
      const toCamera = target.clone().add(offset);
      animFromTarget.current.copy(controls.target);
      animToTarget.current.copy(target);
      animFromCamera.current.copy(camera.position);
      animToCamera.current.copy(toCamera);
      animStartTime.current = performance.now();
    } else {
      animStartTime.current = null;
      const [pos, tgt] = mode === "interior"
        ? [INTERIOR_CAMERA_POSITION, INTERIOR_CAMERA_TARGET]
        : [EXTERIOR_CAMERA_POSITION, EXTERIOR_CAMERA_TARGET];
      camera.position.set(pos[0], pos[1], pos[2]);
      controls.target.set(tgt[0], tgt[1], tgt[2]);
      camera.lookAt(controls.target);
      camera.updateProjectionMatrix();
    }
  }, [resetTrigger, poiId, mode]);

  useFrame(() => {
    if (animStartTime.current === null || !orbitRef.current) return;
    const controls = orbitRef.current;
    const elapsed = (performance.now() - animStartTime.current) / 1000;
    let t = Math.min(elapsed / FLY_DURATION, 1);
    t = easeOutCubic(t);
    camera.position.lerpVectors(animFromCamera.current, animToCamera.current, t);
    controls.target.lerpVectors(animFromTarget.current, animToTarget.current, t);
    camera.lookAt(controls.target);
    camera.updateProjectionMatrix();
    if (t >= 1) animStartTime.current = null;
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} />
      {environment === "desert" && <DesertScene />}
      <DrillRigModel environment={environment} selectedVariants={selectedVariants} />
      {environment === "desert" && (
        <Environment preset="sunset" />
      )}
      {environment === "arctic" && (
        <Environment preset="night" />
      )}
      {controlsReady && (
        <OrbitControls
          ref={orbitRef}
          enablePan
          enableZoom
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 + 0.2}
          target={CAMERA_TARGET}
        />
      )}
      {pois.filter((p) => p.position3d).map((poi) => (
        <Html
          key={poi.id}
          position={[poi.position3d!.x, poi.position3d!.y, poi.position3d!.z]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "auto" }}
          zIndexRange={[0, 10]}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePoi(poi.id);
              sendAssistantMessage("Tell me about " + poi.title);
            }}
            className={cn(
              "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 transition-all cursor-pointer",
              activePoiId === poi.id
                ? "border-amber-500 bg-amber-500/20 scale-110 shadow-lg"
                : "border-white/90 bg-black/50 hover:bg-black/70 hover:scale-105 shadow-md"
            )}
            aria-label={poi.title}
            aria-pressed={activePoiId === poi.id}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </button>
          <div
            className={cn(
              "absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium text-white shadow-lg pointer-events-none",
              activePoiId === poi.id ? "bg-amber-600" : "bg-black/80"
            )}
          >
            {poi.title}
          </div>
        </Html>
      ))}
    </>
  );
}

export function RigViewer3D() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-amber-50">
      <Canvas
        shadows
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        className="touch-none"
      >
        <Suspense
          fallback={
            <Html center>
              <span className="rounded bg-amber-900/20 text-amber-900 px-3 py-1 text-sm border border-amber-200">
                Loading 3D…
              </span>
            </Html>
          }
        >
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
