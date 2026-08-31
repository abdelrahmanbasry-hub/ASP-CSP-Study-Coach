import { finalSubcategories } from "./finalHazardTaxonomy.ts";
import { PHASE4_SUBCATEGORIES } from "./phase4Taxonomy.ts";
import type { BilingualText } from "./hazardData";

type CategoryConfig = {
  id: string; name: BilingualText; icon: string; placement: "primary" | "more";
  defaultSubcategoryId?: string; sourceTable?: boolean;
  subcategories: readonly { id: string; name: BilingualText }[];
};

// Navigation, labels, subcategory options and empty categories all come from here.
export const HAZARD_CATEGORIES = [
  { id: "occupational-health", name: { en: "Occupational Health", ar: "الصحة المهنية" }, icon: "lungs", placement: "primary", defaultSubcategoryId: "toxicological", sourceTable: true, subcategories: [
    { id: "toxicological", name: { en: "Toxic substances", ar: "المواد السامة" } },
    { id: "biological", name: { en: "Biological hazards", ar: "المخاطر البيولوجية" } },
  ] },
  { id: "chemical-hazmat", name: { en: "Chemical & HazMat", ar: "المواد الكيميائية والخطرة" }, icon: "flask", placement: "primary", subcategories: finalSubcategories("CHEM") },
  { id: "electrical", name: { en: "Electrical", ar: "الكهرباء" }, icon: "zap", placement: "primary", subcategories: Object.values(PHASE4_SUBCATEGORIES.ELEC) },
  { id: "fire-explosion", name: { en: "Fire & Explosion", ar: "الحريق والانفجار" }, icon: "flame", placement: "primary", subcategories: finalSubcategories("FIRE") },
  { id: "falls-height", name: { en: "Falls & Work at Height", ar: "السقوط والعمل على ارتفاع" }, icon: "height", placement: "primary", subcategories: Object.values(PHASE4_SUBCATEGORIES.FALL) },
  { id: "machinery-tools", name: { en: "Machinery & Tools", ar: "الآلات والأدوات" }, icon: "gear", placement: "primary", subcategories: Object.values(PHASE4_SUBCATEGORIES.MACH) },
  { id: "material-handling", name: { en: "Material Handling", ar: "مناولة المواد" }, icon: "forklift", placement: "primary", subcategories: Object.values(PHASE4_SUBCATEGORIES.MAT) },
  { id: "ergonomics-human-factors", name: { en: "Ergonomics / Human Factors", ar: "الأرغونوميا والعوامل البشرية" }, icon: "person", placement: "primary", subcategories: finalSubcategories("ERGO") },
  { id: "radiation", name: { en: "Radiation", ar: "الإشعاع" }, icon: "radiation", placement: "primary", subcategories: finalSubcategories("RAD") },
  { id: "confined-spaces", name: { en: "Confined Spaces", ar: "الأماكن المحصورة" }, icon: "space", placement: "more", subcategories: finalSubcategories("CONF") },
  { id: "hazardous-energy", name: { en: "LOTO / Hazardous Energy", ar: "القفل والوسم والطاقة الخطرة" }, icon: "lock", placement: "more", subcategories: finalSubcategories("LOTO") },
  { id: "pressure-systems", name: { en: "Pressure / Hydraulic / Pneumatic", ar: "الضغط والأنظمة الهيدروليكية والهوائية" }, icon: "gauge", placement: "more", subcategories: finalSubcategories("PRESS") },
  { id: "noise", name: { en: "Noise", ar: "الضوضاء" }, icon: "ear", placement: "more", subcategories: finalSubcategories("NOISE") },
  { id: "thermal-stress", name: { en: "Thermal Stress", ar: "الإجهاد الحراري" }, icon: "temperature", placement: "more", subcategories: finalSubcategories("THERM") },
  { id: "excavation-trenching", name: { en: "Excavation & Trenching", ar: "الحفر والخنادق" }, icon: "shovel", placement: "more", subcategories: finalSubcategories("EXC") },
  { id: "process-safety", name: { en: "Process Safety", ar: "سلامة العمليات" }, icon: "workflow", placement: "more", subcategories: finalSubcategories("PSM") },
  { id: "environmental", name: { en: "Environmental", ar: "البيئة" }, icon: "leaf", placement: "more", subcategories: finalSubcategories("ENV") },
  { id: "security-emergency", name: { en: "Security / Emergency", ar: "الأمن والطوارئ" }, icon: "shield", placement: "more", subcategories: finalSubcategories("SEC") },
] as const satisfies readonly CategoryConfig[];

export type HazardCategoryId = (typeof HAZARD_CATEGORIES)[number]["id"];
export type HazardCategorySelection = HazardCategoryId | "all";
export const HAZARD_NAVIGATION = {
  all: { en: "All Hazards", ar: "جميع المخاطر" },
  more: { en: "More", ar: "المزيد" },
} satisfies Record<string, BilingualText>;
export const HAZARD_CATEGORY_BY_ID = HAZARD_CATEGORIES.reduce((index, category) => {
  index[category.id] = category;
  return index;
}, {} as Record<HazardCategoryId, CategoryConfig>);

export function hazardSubcategoryName(categoryId: HazardCategoryId, subcategoryId: string | null) {
  return HAZARD_CATEGORY_BY_ID[categoryId].subcategories.find((item) => item.id === subcategoryId)?.name;
}
