import type { BodySystemId, ExposureRouteId, HazardTarget, MappingReview } from "./bodySystems";
import type { OccupationalHealthRecord, SourceHazardRecord } from "./hazardData";

// Exact source vocabulary, not hazard-name conditionals or inferred medical facts.
const TARGET_TERMS: Record<string, BodySystemId> = {
  lungs: "lungs", skin: "skin", mucosa: "skin", "nervous system": "brain", "central nervous system": "brain", brain: "brain",
  kidneys: "kidneys", liver: "liver", blood: "blood", "bone marrow": "bone-marrow", bones: "musculoskeletal",
  heart: "heart", "gastrointestinal system": "digestive", "lymphatic system": "immune", "respiratory system": "respiratory",
  systemic: "systemic", "systemic infection": "systemic",
};

// Verbatim consequence excerpts. Secondary denotes source-field provenance,
// not a clinical ranking or an inferred medical relationship.
const SECONDARY_EFFECTS: Array<{ systemId: BodySystemId; en: string; ar: string }> = [
  { systemId: "reproductive", en: "reproductive effects may also occur", ar: "وقد تحدث آثار تناسلية أيضًا" },
  { systemId: "respiratory", en: "respiratory injury", ar: "إصابة تنفسية" },
  { systemId: "eyes", en: "Eye and airway irritation", ar: "تهيج العين والمجاري الهوائية" },
];

export function migrateHazardRecord(source: SourceHazardRecord): OccupationalHealthRecord {
  const mappingReview: MappingReview[] = [];
  const targetTerms = source.targetOrganSystem.en.toLowerCase().split(/\s*\/\s*/);
  const primaryIds = [...new Set(targetTerms.map((term) => TARGET_TERMS[term]).filter(Boolean))];
  if (targetTerms.some((term) => !TARGET_TERMS[term])) mappingReview.push({ field: "targets", reason: {
    en: "Some source target terms cannot be confidently mapped. Original text is preserved.", ar: "تعذر ربط بعض الأعضاء المذكورة بنظام محدد بثقة. تم الاحتفاظ بالنص الأصلي.",
  } });
  const targets: HazardTarget[] = primaryIds.map((systemId) => ({ systemId, role: "primary", effects: source.mainConsequences, effectsScope: "source-row", sourceField: "targetOrganSystem" }));
  for (const effect of SECONDARY_EFFECTS) {
    if (!primaryIds.includes(effect.systemId) && source.mainConsequences.en.includes(effect.en) && source.mainConsequences.ar.includes(effect.ar)) {
      targets.push({ systemId: effect.systemId, role: "secondary", effects: { en: effect.en, ar: effect.ar }, effectsScope: "system", sourceField: "mainConsequences" });
    }
  }
  const exposureRoutes: ExposureRouteId[] = [];
  const route = source.exposureTransmission.en.toLowerCase();
  if (/inhalation|airborne droplet nuclei/.test(route)) exposureRoutes.push("inhalation");
  if (/ingestion|fecal-oral/.test(route)) exposureRoutes.push("ingestion");
  if (/skin absorption|skin contact\/absorption|dermal absorption/.test(route)) exposureRoutes.push("dermal-absorption");
  if (/\bbites?\b|scratches|wound contamination|injection|percutaneous/.test(route)) exposureRoutes.push("percutaneous");
  // Contact is not necessarily absorption; blood exposure does not establish a portal.
  const ambiguousContact = /contact|exposure|ticks|endogenous/.test(route) && !/skin contact\/absorption/.test(route);
  if (!exposureRoutes.length || ambiguousContact) mappingReview.push({ field: "exposureRoutes", reason: {
    en: "The source includes contact, transmission, or context without a definite entry pathway. Only explicit routes are shown; review the original wording below.",
    ar: "يتضمن المصدر تلامسًا أو انتقالًا أو سياقًا دون تحديد مسار دخول واضح. تُعرض المسارات الصريحة فقط؛ راجع النص الأصلي أدناه.",
  } });
  return { ...source, targets, exposureRoutes, mappingReview };
}
