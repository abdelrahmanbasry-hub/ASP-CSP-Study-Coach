import type { BilingualText } from "../hazardData";
import type { EnergyType, SceneEngineKind, SceneOverlay, SceneRole } from "../hazardTypes";
export const overlayRoleLabel = (overlay: SceneOverlay): BilingualText => overlay.semantic === "control"
  ? { en: "Control point", ar: "نقطة تحكم" } : overlay.semantic === "principle"
    ? { en: "Protection principle", ar: "مبدأ وقاية" } : SCENE_ROLES[overlay.role];
export const SCENE_ROLES: Record<SceneRole, BilingualText> = {
  primary: { en: "Primary hazard", ar: "خطر رئيسي" },
  secondary: { en: "Secondary hazard", ar: "خطر ثانوي" },
  possible: { en: "Possible / other", ar: "محتمل / آخر" },
  inactive: { en: "Not active / not listed", ar: "غير نشط / غير مدرج" },
};
export const SCENE_ENGINES: Record<SceneEngineKind, { name: BilingualText; mechanism: BilingualText }> = {
  "worker-scene": { name: { en: "Worker scene", ar: "مشهد العامل" }, mechanism: { en: "Energy / path", ar: "الطاقة / المسار" } },
  "equipment-scene": { name: { en: "Equipment scene", ar: "مشهد المعدات" }, mechanism: { en: "Dynamics / event", ar: "الحركة / الحدث" } },
  "process-diagram": { name: { en: "Process diagram", ar: "مخطط العملية" }, mechanism: { en: "Energy / flow", ar: "الطاقة / التدفق" } },
  "concept-diagram": { name: { en: "Concept diagram", ar: "مخطط المفهوم" }, mechanism: { en: "Principles", ar: "المبادئ" } },
};
export const ENERGY_LABELS: Record<EnergyType, BilingualText> = {
  electrical: { en: "Electrical", ar: "كهربائية" }, mechanical: { en: "Mechanical", ar: "ميكانيكية" },
  hydraulic: { en: "Hydraulic", ar: "هيدروليكية" }, pneumatic: { en: "Pneumatic", ar: "هوائية" },
  thermal: { en: "Thermal", ar: "حرارية" }, gravity: { en: "Gravity", ar: "جاذبية" },
  "chemical-process": { en: "Chemical / process", ar: "كيميائية / عملية" },
  radiation: { en: "Radiation", ar: "إشعاع" }, atmospheric: { en: "Atmosphere", ar: "جو" },
};
