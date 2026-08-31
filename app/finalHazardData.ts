import dataset from "../data/hazard-library/final/final-hazard-master-dataset.json" with { type: "json" };
import type { HazardRecord, SceneOverlay, SceneVisualizationConfig } from "./hazardTypes";
import type { Phase4SourceRecord } from "./phase4HazardData";
import { markerPositions } from "./phase4HazardData.ts";
import { FINAL_CATEGORIES, FINAL_PHASES, FINAL_WORK_CONTEXTS, finalSubcategories } from "./finalHazardTaxonomy.ts";
import { finalGeometry, FINAL_PHYSICAL_TEMPLATES } from "./hazard-scenes/finalSceneGeometry.ts";
import { finalSceneLabel } from "./hazard-scenes/finalSceneLabels.ts";
import { resolveHazardStandards } from "./hazardStandardReferences.ts";

export type FinalSourceRecord = Omit<Phase4SourceRecord, "categoryId" | "source"> & {
  categoryId: keyof typeof FINAL_CATEGORIES;
  source: Omit<Phase4SourceRecord["source"], "oshaVerification"> & { externalBasis: readonly string[]; regulatoryVerification: string };
};
export const FINAL_DATASET = dataset as unknown as { version: string; newCanonicalRecordCount: number; categoryCounts: Record<string, number>; records: readonly FinalSourceRecord[] };
export const FINAL_IMPLEMENTED_PHASE = 8;

export function finalVisualization(record: FinalSourceRecord): SceneVisualizationConfig {
  const { engine, template, overlays, markers } = record.visualization;
  const geometry = overlays.map(token => finalGeometry(template, token));
  const positions = markerPositions(geometry.map(value => value.point));
  const callouts: SceneOverlay[] = overlays.map((id, i) => ({
    id, ...geometry[i], label: finalSceneLabel(id), description: record.summary, marker: positions[i],
    role: geometry[i].semantic === "control" ? "possible" : i === geometry.findIndex(value => value.semantic !== "control") ? "primary" : "secondary",
  }));
  return { kind: engine, status: "implemented", template, description: record.summary, overlays: callouts,
    note: { en: "Configured scene elements. Context uses the supplied record summary; emphasis is not a risk rating. Illustrations show concepts, not a complete safe-work procedure.", ar: "عناصر المشهد حسب الإعداد. السياق هو ملخص السجل المرفق؛ الإبراز ليس تصنيفًا للمخاطر. الرسوم توضح المفاهيم ولا تمثل إجراء عمل آمنًا كاملًا." },
    landmarks: markers.map(id => {
      const point = FINAL_PHYSICAL_TEMPLATES[template]?.points[id];
      if (!point) throw new Error(`Missing final landmark: ${template}/${id}`);
      return { id, label: finalSceneLabel(id), point, shapes: [{ type: "ellipse", cx: point[0], cy: point[1], rx: 38, ry: 38 }] };
    }),
  };
}
export function adaptFinalRecord(record: FinalSourceRecord): HazardRecord {
  const subcategoryId = record.subcategoryId.replaceAll("_", "-");
  if (!finalSubcategories(record.categoryId).some(value => value.id === subcategoryId)) throw new Error(`Unmapped final taxonomy: ${record.id}`);
  const standardReferences = resolveHazardStandards(record.relatedStandards);
  return {
    id: record.id, categoryId: FINAL_CATEGORIES[record.categoryId], subcategoryId,
    name: record.name, summary: record.summary, mechanisms: record.mechanisms, consequences: record.consequences,
    highRiskWork: record.highRiskWork, controls: record.controls, visualization: finalVisualization(record), workContexts: record.workContexts,
    workContextTags: record.workContexts.map(en => { const ar = FINAL_WORK_CONTEXTS[en]; if (!ar) throw new Error(`Untranslated work context: ${en}`); return { en, ar }; }),
    standardReferences, relatedStandardIds: [...new Set(standardReferences.flatMap(value => value.standardId ? [value.standardId] : []))],
    relatedPracticeTags: record.relatedPracticeTags, relatedPracticeQuestionIds: [], searchTerms: record.searchTerms,
    source: { ...record.source, kind: "controlled-dataset", status: "study-summary", citation: {
      en: `Yates, edition ${record.source.yatesEdition} · ${record.source.yatesSection} · approximate pages ${record.source.yatesPageRangeApprox} · ${record.source.yatesSupport}`,
      ar: `ياتس، الطبعة ${record.source.yatesEdition} · ${record.source.yatesSection} · صفحات تقريبية ${record.source.yatesPageRangeApprox} · ${record.source.yatesSupport}`,
    } },
    importMetadata: { phase: FINAL_PHASES[record.categoryId], packageVersion: FINAL_DATASET.version, contentStatus: record.contentStatus, categoryId: record.categoryId, subcategoryId: record.subcategoryId, visualization: record.visualization },
  };
}
export const FINAL_HAZARD_RECORDS = FINAL_DATASET.records.filter(record => FINAL_PHASES[record.categoryId] <= FINAL_IMPLEMENTED_PHASE).map(adaptFinalRecord);
