import type { BilingualText, OccupationalHealthRecord } from "./hazardData";
import type { HazardCategoryId } from "./hazardCategories";

export type ControlLevel = "elimination" | "substitution" | "engineering" | "administrative" | "ppe";
export type HazardControls = Record<ControlLevel, readonly BilingualText[]>;
export type PlaceholderVisualizationKind = "worker-scene" | "equipment-scene" | "process-diagram" | "concept-diagram";
export type SceneEngineKind = PlaceholderVisualizationKind;
export type SceneRole = "primary" | "secondary" | "possible" | "inactive";
export type SceneMode = "scene" | "mechanism" | "effects";
export type EnergyType = "electrical" | "mechanical" | "hydraulic" | "pneumatic" | "thermal" | "gravity" | "chemical-process" | "radiation" | "atmospheric";
/** Coordinates use a fixed 1000 × 1000 scene plane, independent of text direction. */
export type ScenePoint = readonly [number, number];
export type SceneShape =
  | { type: "path"; d: string; arrow?: boolean; fill?: boolean }
  | { type: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "burst"; cx: number; cy: number; radius: number };
export interface SceneOverlay {
  id: string;
  label: BilingualText;
  description: BilingualText;
  role: SceneRole;
  semantic: "source" | "worker" | "equipment" | "path" | "zone" | "control" | "condition" | "principle";
  point: ScenePoint;
  /** Optional marker offset; a connector still starts at the actual target point. */
  marker?: ScenePoint;
  energy?: EnergyType;
  icon?: "clock" | "distance" | "shield";
  shapes: readonly SceneShape[];
  consequences?: readonly BilingualText[];
  controls?: Partial<HazardControls>;
  modes?: readonly SceneMode[];
}
export type SceneVisualizationConfig = {
  kind: SceneEngineKind;
  status: "implemented";
  template: string;
  description: BilingualText;
  overlays: readonly SceneOverlay[];
  note?: BilingualText;
  /** Optional physical landmarks supplied separately from hazard overlays. */
  landmarks?: readonly { id: string; label: BilingualText; point: ScenePoint; shapes: readonly SceneShape[] }[];
};
export type HazardVisualizationConfig =
  | { kind: "body-system"; occupationalHealth: OccupationalHealthRecord }
  | { kind: PlaceholderVisualizationKind; status: "placeholder" }
  | SceneVisualizationConfig;

export interface HazardRecord {
  id: string;
  categoryId: HazardCategoryId;
  subcategoryId: string | null;
  name: BilingualText;
  summary: BilingualText;
  mechanisms: readonly BilingualText[];
  consequences: readonly BilingualText[];
  highRiskWork: readonly BilingualText[];
  controls: HazardControls;
  visualization: HazardVisualizationConfig;
  workContextTags: readonly BilingualText[];
  relatedStandardIds: readonly string[];
  standardReferences?: readonly { number: string; scope: string; relation: string; resolution: "resolved" | "unresolved"; standardId?: string; matchMethod?: "exact" | "parent-section"; reason?: "not-in-catalog" | "invalid-reference" | "ambiguous-catalog-match" }[];
  relatedPracticeTags: readonly string[];
  relatedPracticeQuestionIds: readonly string[];
  source: {
    kind: "workbook" | "architecture-reference" | "controlled-dataset";
    status: "study-summary" | "placeholder";
    citation: BilingualText;
    sourceRow?: number;
    urls?: readonly string[];
    yatesEdition?: number;
    yatesSection?: string;
    yatesPageRangeApprox?: string;
    yatesSupport?: "direct" | "indirect" | "supplemented";
    oshaVerification?: string;
    regulatoryVerification?: string;
    externalBasis?: readonly string[];
  };
  searchTerms: { en: readonly string[]; ar: readonly string[] };
  workContexts?: readonly string[];
  importMetadata?: { phase: 4 | 5 | 6 | 7 | 8; packageVersion: string; contentStatus: string; categoryId: string; subcategoryId: string; visualization: { engine: string; template: string; overlays: readonly string[]; markers: readonly string[] } };
}

export type ResourceReferences = {
  standardIds?: readonly string[];
  practiceTags?: readonly string[];
  practiceQuestionIds?: readonly string[];
};
export type HazardResourceOpener = (view: "practice" | "standards", query: string, references?: ResourceReferences) => void;

export const CONTROL_LEVELS: readonly { id: ControlLevel; name: BilingualText }[] = [
  { id: "elimination", name: { en: "Elimination", ar: "الإزالة" } },
  { id: "substitution", name: { en: "Substitution", ar: "الاستبدال" } },
  { id: "engineering", name: { en: "Engineering controls", ar: "الضوابط الهندسية" } },
  { id: "administrative", name: { en: "Administrative controls", ar: "الضوابط الإدارية" } },
  { id: "ppe", name: { en: "PPE", ar: "معدات الوقاية الشخصية" } },
];
export const emptyHazardControls = (): HazardControls => ({ elimination: [], substitution: [], engineering: [], administrative: [], ppe: [] });
