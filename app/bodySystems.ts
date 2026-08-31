import type { BilingualText } from "./hazardData";

// Keep the original nine IDs stable; new regions extend that vocabulary.
export type BodySystemId = "brain" | "eyes" | "ears" | "upper-respiratory" | "respiratory" | "lungs" | "heart" | "blood" | "bone-marrow" | "liver" | "kidneys" | "digestive" | "skin" | "musculoskeletal" | "reproductive" | "immune" | "systemic";
export type BodySystem = { id: BodySystemId; label: string; text: BilingualText; color: string; x: number; y: number };

export const BODY_SYSTEMS: readonly BodySystem[] = [
  { id: "brain", label: "Brain & nervous system", text: { en: "Brain & nervous system", ar: "الدماغ والجهاز العصبي" }, color: "#8857a6", x: 50, y: 9 },
  { id: "eyes", label: "Eyes", text: { en: "Eyes", ar: "العينان" }, color: "#397a98", x: 47, y: 14 },
  { id: "ears", label: "Ears / hearing", text: { en: "Ears / hearing", ar: "الأذنان / السمع" }, color: "#b9863a", x: 59, y: 14 },
  { id: "upper-respiratory", label: "Upper respiratory tract", text: { en: "Upper respiratory tract", ar: "الجهاز التنفسي العلوي" }, color: "#438aa3", x: 50, y: 20 },
  { id: "respiratory", label: "Respiratory system", text: { en: "Respiratory system", ar: "الجهاز التنفسي" }, color: "#438aa3", x: 42, y: 30 },
  { id: "lungs", label: "Lungs", text: { en: "Lungs", ar: "الرئتان" }, color: "#438aa3", x: 59, y: 32 },
  { id: "heart", label: "Heart / cardiovascular", text: { en: "Heart / cardiovascular", ar: "القلب والجهاز القلبي الوعائي" }, color: "#d8655d", x: 53, y: 35 },
  { id: "blood", label: "Blood / hematopoietic system", text: { en: "Blood / hematopoietic system", ar: "الدم والجهاز المكوّن للدم" }, color: "#b74e64", x: 50, y: 43 },
  { id: "bone-marrow", label: "Bone marrow", text: { en: "Bone marrow", ar: "نخاع العظم" }, color: "#8857a6", x: 57, y: 68 },
  { id: "liver", label: "Liver", text: { en: "Liver", ar: "الكبد" }, color: "#b9863a", x: 44, y: 41 },
  { id: "kidneys", label: "Kidneys", text: { en: "Kidneys", ar: "الكليتان" }, color: "#4e789b", x: 59, y: 47 },
  { id: "digestive", label: "Gastrointestinal system", text: { en: "Gastrointestinal system", ar: "الجهاز الهضمي" }, color: "#d17c56", x: 50, y: 52 },
  { id: "skin", label: "Skin / mucosa", text: { en: "Skin / mucosa", ar: "الجلد والأغشية المخاطية" }, color: "#ce7f75", x: 28, y: 43 },
  { id: "musculoskeletal", label: "Musculoskeletal system", text: { en: "Musculoskeletal system", ar: "الجهاز العضلي الهيكلي" }, color: "#b9863a", x: 43, y: 76 },
  { id: "reproductive", label: "Reproductive system", text: { en: "Reproductive system", ar: "الجهاز التناسلي" }, color: "#8857a6", x: 50, y: 60 },
  { id: "immune", label: "Immune / lymphatic system", text: { en: "Immune / lymphatic system", ar: "الجهاز المناعي واللمفاوي" }, color: "#6a947b", x: 38, y: 25 },
  { id: "systemic", label: "Whole body / systemic", text: { en: "Whole body / systemic", ar: "الجسم كله / جهازي" }, color: "#6a947b", x: 77, y: 69 },
];

export const BODY_SYSTEM_BY_ID = Object.fromEntries(BODY_SYSTEMS.map((system) => [system.id, system])) as Record<BodySystemId, BodySystem>;
export type ExposureRouteId = "inhalation" | "ingestion" | "dermal-absorption" | "percutaneous";
export const EXPOSURE_ROUTES: Record<ExposureRouteId, BilingualText> = {
  inhalation: { en: "Inhalation", ar: "الاستنشاق" },
  ingestion: { en: "Ingestion", ar: "الابتلاع" },
  "dermal-absorption": { en: "Dermal absorption", ar: "الامتصاص عبر الجلد" },
  percutaneous: { en: "Injection / percutaneous", ar: "الحقن / اختراق الجلد" },
};

export type HazardTarget = {
  systemId: BodySystemId;
  role: "primary" | "secondary";
  effects: BilingualText;
  // Source rows often combine effects: never imply an organ-specific attribution.
  effectsScope: "source-row" | "system";
  sourceField: "targetOrganSystem" | "mainConsequences";
};
export type MappingReview = { field: "targets" | "exposureRoutes"; reason: BilingualText };
