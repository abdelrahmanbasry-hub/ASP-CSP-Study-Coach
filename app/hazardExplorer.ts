import { hazardCompatibilityIds } from "./hazardAliases.ts";
import { BODY_SYSTEM_BY_ID, EXPOSURE_ROUTES, type BodySystemId } from "./bodySystems.ts";
import type { OccupationalHealthRecord } from "./hazardData";
import { HAZARD_CATEGORY_BY_ID, hazardSubcategoryName, type HazardCategorySelection } from "./hazardCategories.ts";
import { adaptOccupationalHealthRecord } from "./hazardLibraryData.ts";
import { CONTROL_LEVELS, type HazardRecord } from "./hazardTypes.ts";
import { OSHA_STANDARDS } from "./standardsData.ts";
import { matchesSearchText } from "./searchText.ts";

export type ExplorerLanguage = "both" | "en" | "ar";
export type ExplorerMode = "systems" | "routes" | "effects";

export type HazardFilters = { categoryId?: HazardCategorySelection; subcategoryId?: string | null; query?: string; systemId?: BodySystemId | null };
const isCanonicalRecord = (record: HazardRecord | OccupationalHealthRecord): record is HazardRecord => "categoryId" in record;

// Used by both Library views and the existing global search index.
export function hazardSearchText(record: HazardRecord) {
  const body = record.visualization.kind === "body-system" ? record.visualization.occupationalHealth : undefined;
  const texts = [record.name, record.summary, HAZARD_CATEGORY_BY_ID[record.categoryId].name,
    hazardSubcategoryName(record.categoryId, record.subcategoryId), ...record.mechanisms, ...record.consequences, ...record.highRiskWork,
    ...(record.visualization.kind !== "body-system" && record.visualization.status === "implemented" ? record.visualization.overlays.flatMap((overlay) => [overlay.label, overlay.description]) : []),
    ...record.workContextTags, ...Object.values(record.controls).flat(),
    ...CONTROL_LEVELS.filter((level) => record.controls[level.id].length).map((level) => level.name),
    ...(body ? [body.type, body.targetOrganSystem, ...body.targets.map((target) => BODY_SYSTEM_BY_ID[target.systemId].text), ...body.exposureRoutes.map((route) => EXPOSURE_ROUTES[route])] : []),
  ];
  const standards = OSHA_STANDARDS.filter((standard) => record.relatedStandardIds.includes(standard.id));
  return [...hazardCompatibilityIds(record.id), ...texts.filter((text) => !!text).map((text) => `${text.en} ${text.ar}`),
    ...record.searchTerms.en, ...record.searchTerms.ar, ...record.relatedPracticeTags, ...record.relatedPracticeQuestionIds, ...(record.workContexts ?? []),
    ...(record.standardReferences ?? []).map(reference => `${reference.number} ${reference.scope} ${reference.relation}`),
    ...standards.map((standard) => `${standard.id} ${standard.citation} ${standard.title} ${standard.topics.join(" ")}`),
  ].join(" ");
}

// The string signature is retained for Phase 1 consumers; both signatures share one matcher.
export function filterHazards<T extends HazardRecord | OccupationalHealthRecord>(records: readonly T[], filters: HazardFilters | OccupationalHealthRecord["category"], query = "", systemId: BodySystemId | null = null): T[] {
  const options: HazardFilters = typeof filters === "string" ? { categoryId: "occupational-health", subcategoryId: filters, query, systemId } : filters;
  return records.filter((source) => {
    const record = isCanonicalRecord(source) ? source : adaptOccupationalHealthRecord(source);
    return (!options.categoryId || options.categoryId === "all" || record.categoryId === options.categoryId)
      && (!options.subcategoryId || record.subcategoryId === options.subcategoryId)
      && (!options.systemId || (record.visualization.kind === "body-system" && record.visualization.occupationalHealth.targets.some((target) => target.systemId === options.systemId)))
      && matchesSearchText(hazardSearchText(record), options.query ?? "");
  });
}

export function targetRole(record: OccupationalHealthRecord | undefined, systemId: BodySystemId) {
  return record?.targets.find((target) => target.systemId === systemId)?.role ?? "inactive";
}
