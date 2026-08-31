import { HAZARD_ID_ALIASES } from "./hazardAliases.ts";
import { PHASE4_HAZARD_RECORDS } from "./phase4HazardData.ts";
import { FINAL_HAZARD_RECORDS } from "./finalHazardData.ts";
import { HAZARD_RECORDS, type OccupationalHealthRecord } from "./hazardData.ts";
import { HAZARD_CATEGORY_BY_ID } from "./hazardCategories.ts";
import { emptyHazardControls, type HazardRecord } from "./hazardTypes.ts";
import { HAZARD_REFERENCE_RECORDS } from "./hazardReferenceData.ts";
export { HAZARD_REFERENCE_RECORDS };
import { OSHA_STANDARDS } from "./standardsData.ts";
import { SCENE_TEMPLATES, supportsSceneEngine } from "./hazard-scenes/sceneTemplates.ts";

// A lossless adapter: the body engine and source table receive the original object.
// Empty controls mean not authored, never that no control is needed.
export function adaptOccupationalHealthRecord(record: OccupationalHealthRecord): HazardRecord {
  return {
    id: record.id, categoryId: "occupational-health", subcategoryId: record.category,
    name: record.hazardDisease, summary: record.definition,
    mechanisms: [record.exposureTransmission], consequences: [record.mainConsequences], highRiskWork: [record.highRiskOccupationsWorkplace],
    controls: emptyHazardControls(), visualization: { kind: "body-system", occupationalHealth: record }, workContextTags: [],
    // Existing catalog topics only; these are study connections, not applicability determinations.
    relatedStandardIds: [ ...(record.category === "toxicological" ? ["1910-1200"] : []), ...(record.exposureRoutes.includes("inhalation") ? ["1910-134"] : []) ],
    relatedPracticeTags: [record.hazardDisease.en], relatedPracticeQuestionIds: [],
    source: { kind: "workbook", status: "study-summary", citation: record.sourceNote, sourceRow: record.sourceRow },
    searchTerms: { en: [], ar: [] },
  };
}

// Retain approved reference objects/assets for compatibility and scene provenance,
// but expose only controlled IDs for the three populated families.
// Broad Radiation Exposure has no semantically equivalent single RAD subtype.
// Keep the original object for historic saved links only, outside counts/search.
export const HIDDEN_LEGACY_HAZARD_RECORDS = HAZARD_REFERENCE_RECORDS.filter(record => record.id === "ref-radiation-exposure");
export const UNIQUE_HAZARD_REFERENCE_RECORDS = HAZARD_REFERENCE_RECORDS.filter(record => !HAZARD_ID_ALIASES[record.id] && !HIDDEN_LEGACY_HAZARD_RECORDS.includes(record));
const approvedScenes = Object.fromEntries(HAZARD_REFERENCE_RECORDS.flatMap(record => {
  const canonicalId = HAZARD_ID_ALIASES[record.id];
  return canonicalId ? [[canonicalId, record.visualization]] : [];
}));
export const HAZARD_LIBRARY_RECORDS: readonly HazardRecord[] = [
  ...HAZARD_RECORDS.map(adaptOccupationalHealthRecord), ...UNIQUE_HAZARD_REFERENCE_RECORDS,
  ...[...PHASE4_HAZARD_RECORDS, ...FINAL_HAZARD_RECORDS].map(record => approvedScenes[record.id] ? { ...record, visualization: approvedScenes[record.id] } : record),
];
export const HAZARD_LIBRARY_BY_ID = Object.fromEntries(HAZARD_LIBRARY_RECORDS.map((record) => [record.id, record])) as Record<string, HazardRecord | undefined>;
for (const record of HIDDEN_LEGACY_HAZARD_RECORDS) HAZARD_LIBRARY_BY_ID[record.id] = record;
for (const [legacy, canonical] of Object.entries(HAZARD_ID_ALIASES)) {
  if (!canonical || !HAZARD_LIBRARY_BY_ID[canonical]) throw new Error(`Missing canonical hazard for ${legacy}`);
  HAZARD_LIBRARY_BY_ID[legacy] = HAZARD_LIBRARY_BY_ID[canonical];
}

export function validateHazardLibrary(records: readonly HazardRecord[] = HAZARD_LIBRARY_RECORDS) {
  const ids = new Set<string>();
  const standardIds = new Set(OSHA_STANDARDS.map((standard) => standard.id));
  for (const record of records) {
    if (!record.id.trim() || ids.has(record.id)) throw new Error(`Duplicate or missing hazard ID: ${record.id}`);
    ids.add(record.id);
    const category = HAZARD_CATEGORY_BY_ID[record.categoryId];
    if (!category || (record.subcategoryId && !category.subcategories.some((item) => item.id === record.subcategoryId))) throw new Error(`Invalid category/subcategory: ${record.id}`);
    const texts = [record.name, record.summary, record.source.citation, ...record.mechanisms, ...record.consequences, ...record.highRiskWork, ...record.workContextTags, ...Object.values(record.controls).flat()];
    if (texts.some((text) => !text.en.trim() || !text.ar.trim())) throw new Error(`Missing bilingual text: ${record.id}`);
    if (record.relatedStandardIds.some((id) => !standardIds.has(id))) throw new Error(`Unknown standard reference: ${record.id}`);
    if (record.visualization.kind === "body-system" && record.visualization.occupationalHealth.id !== record.id) throw new Error(`Body record ID mismatch: ${record.id}`);
    if (record.visualization.kind !== "body-system" && record.visualization.status === "implemented") {
      const scene = record.visualization;
      if (!supportsSceneEngine(SCENE_TEMPLATES[scene.template], scene.kind)) throw new Error(`Invalid scene template: ${record.id}`);
      const overlayIds = new Set<string>();
      for (const overlay of scene.overlays) {
        if (!overlay.id || overlayIds.has(overlay.id)) throw new Error(`Duplicate or missing overlay ID: ${record.id}`);
        overlayIds.add(overlay.id);
        if ([overlay.label, overlay.description, ...(overlay.consequences ?? []), ...Object.values(overlay.controls ?? {}).flat()].some((value) => !value.en.trim() || !value.ar.trim())) throw new Error(`Missing bilingual callout: ${record.id}/${overlay.id}`);
        if ([...overlay.point, ...(overlay.marker ?? [])].some((value) => !Number.isFinite(value) || value < 0 || value > 1000)) throw new Error(`Invalid scene coordinate: ${record.id}/${overlay.id}`);
      }
    }
  }
}
validateHazardLibrary();
