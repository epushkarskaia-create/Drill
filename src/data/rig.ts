export type Environment = "desert" | "arctic";
export type SceneMode = "exterior" | "interior";

export interface Rig {
  id: string;
  name: string;
  description: string;
  environments: Environment[];
  scenes: SceneMode[];
  modules: { id: string; name: string }[];
}

export interface SpecItem {
  key: string;
  label: string;
  value: string;
  unit?: string;
}

export interface MediaItem {
  type: "image";
  imageUrl: string;
}

export interface DocLink {
  title: string;
  url: string;
}

export interface POI {
  id: string;
  scene: SceneMode;
  title: string;
  description: string;
  position: { x: number; y: number }; // percentage 0-100 for overlay (2D fallback)
  /** 3D world position for R3F viewer (x, y, z) — Y up, model ~4 units wide */
  position3d?: { x: number; y: number; z: number };
  specs: SpecItem[];
  media: MediaItem[];
  docs: DocLink[];
  keywords: string[];
}

export interface TourStep {
  poiId: string;
  narration: string;
  safetyTag?: string;
  checklistItems?: string[];
}

export interface Tour {
  id: string;
  title: string;
  durationEstimate: string;
  steps: TourStep[];
}

export interface VariantDiff {
  key: string;
  from: string;
  to: string;
  unit?: string;
}

export interface Variant {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  diffSpecs: VariantDiff[];
  previewImageUrl: string;
}

export const rig: Rig = {
  id: "dr20",
  name: "DR-20 Mobile Drill Rig",
  description: "Compact, versatile drilling solution for exploration and geotechnical applications.",
  environments: ["desert", "arctic"],
  scenes: ["exterior", "interior"],
  modules: [
    { id: "chassis", name: "Chassis" },
    { id: "drillingUnit", name: "Drilling Unit" },
    { id: "cabin", name: "Cabin" },
  ],
};

const baseUrl = "/rigs/dr20";

/** Real photo of a drilling rig (Unsplash). Used for all POI media so catalog shows drilling systems, not generic pics. */
const DRILL_RIG_PHOTO =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837";

/** Extra drilling/industrial photos from Unsplash (drill rig, field rig, machinery). */
const DRILLING_PHOTOS = [
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=top&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=bottom&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=left&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=right&q=80",
];

/** Photos of drilling system parts (3–6 per POI). Uses real drilling rig imagery. */
function poiPhotos(poiId: string, count: number): MediaItem[] {
  return Array.from({ length: count }, (_, i) => ({
    type: "image" as const,
    imageUrl: DRILLING_PHOTOS[i % DRILLING_PHOTOS.length] ?? DRILL_RIG_PHOTO,
  }));
}

export const sceneImages: Record<SceneMode, Record<Environment, string>> = {
  exterior: {
    desert: `${baseUrl}/exterior-desert.jpg`,
    arctic: `${baseUrl}/exterior-arctic.jpg`,
  },
  interior: {
    desert: `${baseUrl}/interior.jpg`,
    arctic: `${baseUrl}/interior.jpg`,
  },
};

export const pois: POI[] = [
  {
    id: "overview",
    scene: "exterior",
    title: "Rig Overview",
    description: "Full view of the DR-20 mobile drill rig. Compact footprint for easy transport and setup.",
    position: { x: 50, y: 35 },
    position3d: { x: 0, y: 2.2, z: 0 },
    specs: [
      { key: "length", label: "Length", value: "8.2", unit: "m" },
      { key: "width", label: "Width", value: "2.5", unit: "m" },
      { key: "height", label: "Transport height", value: "3.1", unit: "m" },
    ],
    media: poiPhotos("overview", 4),
    docs: [{ title: "DR-20 Brochure", url: "/docs/sample-spec.pdf" }],
    keywords: ["overview", "rig", "mobile"],
  },
  {
    id: "engine",
    scene: "exterior",
    title: "Power Unit",
    description: "Efficient diesel power unit with low emissions and easy maintenance access.",
    position: { x: 35, y: 55 },
    position3d: { x: -1.3, y: 0.7, z: -0.9 },
    specs: [
      { key: "power", label: "Power", value: "120", unit: "kW" },
      { key: "fuel", label: "Fuel type", value: "Diesel", unit: "" },
      { key: "torque", label: "Max torque", value: "4500", unit: "Nm" },
    ],
    media: poiPhotos("engine", 4),
    docs: [{ title: "Engine Spec Sheet", url: "/docs/sample-spec.pdf" }],
    keywords: ["engine", "power", "torque", "fuel", "diesel"],
  },
  {
    id: "mast",
    scene: "exterior",
    title: "Drilling Mast",
    description: "Robust mast with adjustable angle for vertical and inclined drilling.",
    position: { x: 62, y: 25 },
    position3d: { x: 0, y: 2.8, z: 1.4 },
    specs: [
      { key: "depth", label: "Max depth", value: "200", unit: "m" },
      { key: "angle", label: "Mast angle", value: "0–30°", unit: "" },
      { key: "pull", label: "Pull capacity", value: "25", unit: "kN" },
    ],
    media: poiPhotos("mast", 5),
    docs: [{ title: "Mast Technical Data", url: "/docs/sample-spec.pdf" }],
    keywords: ["mast", "drilling", "depth", "angle"],
  },
  {
    id: "hydraulics",
    scene: "exterior",
    title: "Hydraulic System",
    description: "Closed-loop hydraulic system for smooth control and reliability.",
    position: { x: 45, y: 70 },
    position3d: { x: -1, y: 0.6, z: 0.2 },
    specs: [
      { key: "pressure", label: "System pressure", value: "350", unit: "bar" },
      { key: "flow", label: "Flow rate", value: "45", unit: "L/min" },
    ],
    media: poiPhotos("hydraulics", 4),
    docs: [],
    keywords: ["hydraulics", "hydraulic", "pressure"],
  },
  {
    id: "cab",
    scene: "exterior",
    title: "Operator Cab",
    description: "Ergonomic cab with climate control and full instrumentation.",
    position: { x: 72, y: 45 },
    position3d: { x: 1.25, y: 1.4, z: 0.4 },
    specs: [
      { key: "seats", label: "Seats", value: "2", unit: "" },
      { key: "ac", label: "Climate", value: "HVAC", unit: "" },
    ],
    media: poiPhotos("cab", 5),
    docs: [],
    keywords: ["cab", "cabin", "operator", "cabinet"],
  },
  {
    id: "cabin-interior",
    scene: "interior",
    title: "Cabin Interior",
    description: "Spacious operator station with controls and displays.",
    position: { x: 50, y: 50 },
    position3d: { x: 1.2, y: 1.2, z: 0.3 },
    specs: [
      { key: "displays", label: "Displays", value: "2", unit: "" },
      { key: "controls", label: "Control type", value: "Electro-hydraulic", unit: "" },
    ],
    media: poiPhotos("cabin-interior", 6),
    docs: [],
    keywords: ["cabin", "interior", "controls", "operator"],
  },
  {
    id: "control-panel",
    scene: "interior",
    title: "Control Panel",
    description: "Main control panel for drilling parameters and safety systems.",
    position: { x: 40, y: 55 },
    position3d: { x: 1.05, y: 1.1, z: 0.2 },
    specs: [
      { key: "safety", label: "Safety level", value: "SIL 2", unit: "" },
      { key: "emergency", label: "E-stop", value: "Dual circuit", unit: "" },
    ],
    media: poiPhotos("control-panel", 3),
    docs: [{ title: "Operator Manual", url: "/docs/sample-spec.pdf" }],
    keywords: ["control", "panel", "safety", "start", "pre-start"],
  },
];

export const valueTour: Tour = {
  id: "valueTour",
  title: "Value & Advantages Tour",
  durationEstimate: "3–5 min",
  steps: [
    { poiId: "overview", narration: "Welcome. This is the DR-20 mobile drill rig — compact and versatile." },
    { poiId: "engine", narration: "The power unit delivers 120 kW with low emissions and easy service access." },
    { poiId: "mast", narration: "The mast supports up to 200 m depth and adjustable angle for inclined drilling." },
    { poiId: "hydraulics", narration: "Our closed-loop hydraulic system ensures smooth control and long life." },
    { poiId: "cab", narration: "The operator cab offers full climate control and clear visibility." },
  ],
};

export const startupTour: Tour = {
  id: "startupTour",
  title: "How to Start / Pre-start Checks",
  durationEstimate: "5–7 min",
  steps: [
    {
      poiId: "overview",
      narration: "Before starting, ensure the rig is on level ground and the area is clear.",
      safetyTag: "Safety",
      checklistItems: ["Level ground", "Area clear", "Chocks in place"],
    },
    {
      poiId: "engine",
      narration: "Check fuel level and engine condition. No leaks around the power unit.",
      safetyTag: "Safety",
      checklistItems: ["Fuel level OK", "No leaks", "Coolant level"],
    },
    {
      poiId: "hydraulics",
      narration: "Inspect hydraulic lines and reservoir. Fluid level within range.",
      checklistItems: ["Lines intact", "Reservoir level OK"],
    },
    {
      poiId: "cabin-interior",
      narration: "Enter the cab and ensure all displays are on. Fasten seatbelt.",
      safetyTag: "Safety",
      checklistItems: ["Displays on", "Seatbelt on", "E-stop released"],
    },
    {
      poiId: "control-panel",
      narration: "Run through pre-start checklist on the control panel. Start engine only when all green.",
      safetyTag: "Safety",
      checklistItems: ["Pre-start checklist complete", "All systems green", "Start engine"],
    },
  ],
};

export const tours: Tour[] = [valueTour, startupTour];

export const variants: Variant[] = [
  {
    id: "chassis-standard",
    moduleId: "chassis",
    title: "Standard Chassis",
    summary: "4×4 configuration, standard wheelbase.",
    diffSpecs: [
      { key: "wheelbase", from: "—", to: "3.2 m", unit: "" },
      { key: "axles", from: "—", to: "2", unit: "" },
    ],
    previewImageUrl: `${baseUrl}/exterior-desert.jpg`,
  },
  {
    id: "chassis-extended",
    moduleId: "chassis",
    title: "Extended Chassis",
    summary: "6×6 configuration for heavier loads.",
    diffSpecs: [
      { key: "wheelbase", from: "3.2 m", to: "4.5 m", unit: "" },
      { key: "axles", from: "2", to: "3", unit: "" },
    ],
    previewImageUrl: `${baseUrl}/exterior-desert.jpg`,
  },
  {
    id: "drill-standard",
    moduleId: "drillingUnit",
    title: "Standard Drilling Unit",
    summary: "200 m max depth, NQ core.",
    diffSpecs: [
      { key: "depth", from: "—", to: "200 m", unit: "" },
      { key: "core", from: "—", to: "NQ", unit: "" },
    ],
    previewImageUrl: `${baseUrl}/exterior-desert.jpg`,
  },
  {
    id: "drill-heavy",
    moduleId: "drillingUnit",
    title: "Heavy-duty Drilling Unit",
    summary: "300 m max depth, HQ capability.",
    diffSpecs: [
      { key: "depth", from: "200 m", to: "300 m", unit: "" },
      { key: "core", from: "NQ", to: "HQ", unit: "" },
    ],
    previewImageUrl: `${baseUrl}/exterior-desert.jpg`,
  },
  {
    id: "cabin-basic",
    moduleId: "cabin",
    title: "Basic Cabin",
    summary: "Single operator, essential HVAC.",
    diffSpecs: [
      { key: "seats", from: "—", to: "1", unit: "" },
      { key: "hvac", from: "—", to: "Basic", unit: "" },
    ],
    previewImageUrl: `${baseUrl}/interior.jpg`,
  },
  {
    id: "cabin-premium",
    moduleId: "cabin",
    title: "Premium Cabin",
    summary: "Dual seat, full HVAC, sound insulation.",
    diffSpecs: [
      { key: "seats", from: "1", to: "2", unit: "" },
      { key: "hvac", from: "Basic", to: "Full HVAC", unit: "" },
    ],
    previewImageUrl: `${baseUrl}/interior.jpg`,
  },
];

export function getPoisByScene(scene: SceneMode): POI[] {
  return pois.filter((p) => p.scene === scene);
}

export function getPoiById(id: string): POI | undefined {
  return pois.find((p) => p.id === id);
}

export function getVariantsByModule(moduleId: string): Variant[] {
  return variants.filter((v) => v.moduleId === moduleId);
}

/** Module IDs to show in customization block for this POI (only this part of the object). */
const poiModuleIds: Record<string, string[]> = {
  overview: [],
  engine: ["chassis"],
  mast: ["drillingUnit"],
  hydraulics: ["chassis"],
  cabin: ["cabin"],
};

export function getModulesForPoi(poiId: string): string[] {
  return poiModuleIds[poiId] ?? [];
}

export function getTourById(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
