import dataset from "../data/hazard-library/phase4/phase4-hazard-master-dataset.json" with { type: "json" };
import type { BilingualText } from "./hazardData";
import type { HazardRecord, HazardControls, SceneEngineKind, SceneOverlay, ScenePoint, SceneVisualizationConfig } from "./hazardTypes";
import { PHASE4_CATEGORIES, PHASE4_WORK_CONTEXTS, phase4Subcategory } from "./phase4Taxonomy.ts";
import { resolveHazardStandards, type SuppliedStandardReference } from "./hazardStandardReferences.ts";
import { phase4Geometry, phase4Landmark } from "./hazard-scenes/phase4SceneGeometry.ts";
import { phase4SceneLabel } from "./hazard-scenes/phase4SceneLabels.ts";

export interface Phase4SourceRecord {
  id: string;
  categoryId: keyof typeof PHASE4_CATEGORIES;
  subcategoryId: string;
  name: BilingualText; summary: BilingualText;
  mechanisms: readonly BilingualText[]; consequences: readonly BilingualText[]; highRiskWork: readonly BilingualText[];
  controls: HazardControls;
  visualization: { engine: SceneEngineKind; template: string; overlays: readonly string[]; markers: readonly string[] };
  workContexts: readonly string[];
  relatedStandards: readonly SuppliedStandardReference[];
  relatedPracticeTags: readonly string[];
  source: { yatesEdition: number; yatesSection: string; yatesPageRangeApprox: string; yatesSupport: "direct" | "indirect" | "supplemented"; oshaVerification: string };
  searchTerms: { en: readonly string[]; ar: readonly string[] };
  contentStatus: string;
}
export const PHASE4_DATASET = dataset as unknown as { version: string; recordCount: number; categoryCounts: Record<keyof typeof PHASE4_CATEGORIES, number>; records: readonly Phase4SourceRecord[] };

/** Keep 44px targets apart on a 320px stage; connectors still begin at real regions. */
export function markerPositions(points: readonly ScenePoint[]): ScenePoint[] {
  const placed: ScenePoint[] = [];
  for (const point of points) {
    const candidates: ScenePoint[] = [point];
    for (const radius of [145, 210, 290]) for (let i = 0; i < 12; i++) candidates.push([point[0] + Math.cos(i * Math.PI / 6) * radius, point[1] + Math.sin(i * Math.PI / 6) * radius]);
    const bounded = candidates.map(([x, y]) => [Math.max(75, Math.min(925, x)), Math.max(75, Math.min(925, y))] as const);
    const next = bounded.find(candidate => placed.every(other => Math.hypot(candidate[0] - other[0], candidate[1] - other[1]) >= 145));
    if (!next) throw new Error("Scene marker layout needs more space");
    placed.push(next);
  }
  return placed;
}
export function phase4Visualization(record: Phase4SourceRecord): SceneVisualizationConfig {
  const { template, engine, overlays, markers } = record.visualization;
  const geometry = overlays.map(id => phase4Geometry(template, id));
  const positions = markerPositions(geometry.map(item => item.point));
  const callouts: SceneOverlay[] = overlays.map((id, index) => ({
    id, label: phase4SceneLabel(id), ...geometry[index], marker: positions[index],
    // Emphasis is an illustration hierarchy, not a risk rating or a new safety claim.
    role: geometry[index].semantic === "control" ? "possible" : index === geometry.findIndex(item => item.semantic !== "control") ? "primary" : "secondary",
    description: record.summary,
  }));
  return { kind: engine, status: "implemented", template, description: record.summary, overlays: callouts,
    note: { en: "Configured scene elements. Callout context uses the supplied record summary; illustration emphasis is not a risk rating.", ar: "عناصر المشهد حسب الإعداد. سياق التعليق هو ملخص السجل المرفق؛ إبراز الرسم ليس تصنيفًا للمخاطر." },
    landmarks: markers.map(id => { const point = phase4Landmark(template, id); return { id, label: phase4SceneLabel(id), point, shapes: [{ type: "ellipse", cx: point[0], cy: point[1], rx: 38, ry: 38 }] }; }),
  };
}
export function adaptPhase4Record(record: Phase4SourceRecord): HazardRecord {
  const categoryId = PHASE4_CATEGORIES[record.categoryId];
  const subcategory = phase4Subcategory(record.categoryId, record.subcategoryId);
  if (!categoryId || !subcategory) throw new Error(`Unmapped controlled taxonomy: ${record.id}`);
  const standardReferences = resolveHazardStandards(record.relatedStandards);
  return {
    id: record.id, categoryId, subcategoryId: subcategory.id,
    name: record.name, summary: record.summary, mechanisms: record.mechanisms, consequences: record.consequences,
    highRiskWork: record.highRiskWork, controls: record.controls,
    visualization: phase4Visualization(record),
    workContexts: record.workContexts,
    workContextTags: record.workContexts.map(en => { const ar = PHASE4_WORK_CONTEXTS[en]; if (!ar) throw new Error(`Untranslated work context: ${en}`); return { en, ar }; }),
    standardReferences, relatedStandardIds: [...new Set(standardReferences.flatMap(reference => reference.standardId ? [reference.standardId] : []))],
    relatedPracticeTags: record.relatedPracticeTags, relatedPracticeQuestionIds: [],
    source: { ...record.source, kind: "controlled-dataset", status: "study-summary", citation: {
      en: `Yates, edition ${record.source.yatesEdition} · ${record.source.yatesSection} · approximate pages ${record.source.yatesPageRangeApprox} · ${record.source.yatesSupport}`,
      ar: `ياتس، الطبعة ${record.source.yatesEdition} · ${record.source.yatesSection} · صفحات تقريبية ${record.source.yatesPageRangeApprox} · ${record.source.yatesSupport}`,
    } },
    searchTerms: record.searchTerms,
    importMetadata: { phase: 4, packageVersion: PHASE4_DATASET.version, contentStatus: record.contentStatus, categoryId: record.categoryId, subcategoryId: record.subcategoryId, visualization: record.visualization },
  };
}
export const PHASE4_HAZARD_RECORDS: readonly HazardRecord[] = PHASE4_DATASET.records.map(adaptPhase4Record);
export const PHASE4_STANDARD_AUDIT = PHASE4_HAZARD_RECORDS.flatMap(record => (record.standardReferences ?? []).map(reference => ({ hazardId: record.id, ...reference })));
