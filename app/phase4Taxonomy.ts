import type { BilingualText } from "./hazardData";

/** Interface translations only. Controlled hazard text and source taxonomy remain unchanged. */
export const PHASE4_CATEGORIES = {
  ELEC: "electrical", FALL: "falls-height", MACH: "machinery-tools", MAT: "material-handling",
} as const;
const t = (en: string, ar: string): BilingualText => ({ en, ar });
export const PHASE4_SUBCATEGORIES = {
  ELEC: {
    arc: { id: "arc-flash", name: t("Arc flash", "القوس الكهربائي") },
    shock_contact: { id: "shock-contact", name: t("Shock / contact", "الصدمة / التلامس") },
    exposed_parts: { id: "exposed-parts", name: t("Exposed parts", "الأجزاء المكشوفة") },
    overhead_lines: { id: "overhead-lines", name: t("Overhead lines", "الخطوط الهوائية") },
    wiring_protection: { id: "wiring-protection", name: t("Wiring / protection", "التمديدات / الحماية") },
    grounding: { id: "grounding", name: t("Grounding", "التأريض") },
    fire: { id: "electrical-fire", name: t("Electrical fire", "الحريق الكهربائي") },
  },
  FALL: {
    same_level: { id: "same-level", name: t("Same level", "نفس المستوى") },
    openings_edges: { id: "openings-edges", name: t("Openings / edges", "الفتحات / الحواف") },
    ladders_stairs: { id: "ladders-stairs", name: t("Ladders / stairs", "السلالم / الدرج") },
    scaffolds: { id: "scaffolds", name: t("Scaffolds", "السقالات") },
    elevated_platforms: { id: "elevated-platforms", name: t("Elevated surfaces / platforms", "الأسطح / المنصات المرتفعة") },
    fall_arrest: { id: "fall-arrest", name: t("Fall arrest / descent", "إيقاف السقوط / النزول") },
    falling_objects: { id: "falling-objects", name: t("Falling objects", "الأجسام الساقطة") },
  },
  MACH: {
    guarding: { id: "guarding", name: t("Machine guarding", "حواجز الآلات") },
    motion: { id: "motion", name: t("Machine motion", "حركة الآلات") },
    cutting: { id: "cutting", name: t("Cutting", "القطع") },
    hand_tools: { id: "hand-tools", name: t("Hand tools", "الأدوات اليدوية") },
    power_tools: { id: "power-tools", name: t("Power tools", "الأدوات الآلية") },
    automation: { id: "automation", name: t("Automation", "الأتمتة") },
    conveyors: { id: "conveyors", name: t("Conveyors", "السيور الناقلة") },
  },
  MAT: {
    manual_handling: { id: "manual-handling", name: t("Manual handling", "المناولة اليدوية") },
    powered_industrial_trucks: { id: "industrial-trucks", name: t("Industrial trucks", "المركبات الصناعية") },
    loading_docks: { id: "loading-docks", name: t("Loading docks", "أرصفة التحميل") },
    manual_equipment: { id: "manual-equipment", name: t("Manual equipment", "المعدات اليدوية") },
    storage: { id: "storage", name: t("Storage", "التخزين") },
    cranes_rigging: { id: "cranes-rigging", name: t("Cranes / rigging", "الرافعات / معدات الربط") },
    battery_charging: { id: "battery-charging", name: t("Battery charging", "شحن البطاريات") },
  },
};
export function phase4Subcategory(categoryId: string, subcategoryId: string) {
  const category = PHASE4_SUBCATEGORIES[categoryId as keyof typeof PHASE4_SUBCATEGORIES];
  return category ? (category as Record<string, { id: string; name: BilingualText }>)[subcategoryId] : undefined;
}
export const PHASE4_WORK_CONTEXTS: Record<string, string | undefined> = {
  automation: "الأتمتة", carpentry: "النجارة", construction: "الإنشاءات", distribution: "التوزيع",
  fabrication: "التصنيع والتشكيل", facilities: "المرافق", "general-industry": "الصناعة العامة",
  healthcare: "الرعاية الصحية", industrial: "صناعي", maintenance: "الصيانة", manufacturing: "التصنيع",
  retail: "التجزئة", utilities: "الخدمات والمرافق", warehouse: "المستودعات", yards: "الساحات",
};
