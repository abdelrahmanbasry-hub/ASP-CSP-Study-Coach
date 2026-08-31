import type { BilingualText } from "./hazardData";

/** UI taxonomy translations. Controlled IDs/text stay verbatim in import metadata. */
export const FINAL_CATEGORIES = {
  EXC: "excavation-trenching", CONF: "confined-spaces", LOTO: "hazardous-energy", PRESS: "pressure-systems",
  CHEM: "chemical-hazmat", FIRE: "fire-explosion", PSM: "process-safety", ERGO: "ergonomics-human-factors",
  NOISE: "noise", THERM: "thermal-stress", RAD: "radiation", ENV: "environmental", SEC: "security-emergency",
} as const;
export const FINAL_PHASES = { EXC: 5, CONF: 5, LOTO: 5, PRESS: 5, CHEM: 6, FIRE: 6, PSM: 6, ERGO: 7, NOISE: 7, THERM: 7, RAD: 7, ENV: 8, SEC: 8 } as const;
const t = (en: string, ar: string): BilingualText => ({ en, ar });
const labels: Record<string, BilingualText> = {
  air: t("Air", "الهواء"), groundwater: t("Groundwater", "المياه الجوفية"), pesticide: t("Pesticides", "مبيدات الآفات"), soil: t("Soil", "التربة"), stormwater: t("Stormwater", "مياه الأمطار"), ust: t("Underground storage tanks", "خزانات التخزين تحت الأرض"), active_attack: t("Active attack", "الهجوم الجاري"), bomb_threat: t("Bomb threat", "التهديد بوجود قنبلة"), evacuation: t("Evacuation", "الإخلاء"), hazmat_security: t("HazMat security", "أمن المواد الخطرة"), violence: t("Workplace violence", "العنف في مكان العمل"), weather: t("Weather", "الطقس"),
  anthropometry: t("Anthropometry", "قياسات الجسم"), contact_stress: t("Contact stress", "إجهاد التلامس"), fatigue: t("Fatigue", "التعب"), force: t("Force", "القوة"), lifting: t("Lifting", "الرفع"), overhead: t("Overhead reach", "الوصول فوق الرأس"), posture: t("Posture", "وضعية الجسم"), repetition: t("Repetition", "التكرار"), static_posture: t("Static posture", "الوضعية الثابتة"), vibration: t("Vibration", "الاهتزاز"), workstation: t("Workstation", "محطة العمل"),
  acoustics: t("Acoustics", "الصوتيات"), combined: t("Combined sources", "المصادر المشتركة"), continuous: t("Continuous noise", "الضوضاء المستمرة"), dose: t("Noise dose", "جرعة الضوضاء"), hearing_loss: t("Hearing loss", "فقدان السمع"), hearing_protection: t("Hearing protection", "حماية السمع"), impact: t("Impact noise", "الضوضاء الصدمية"), intermittent: t("Intermittent noise", "الضوضاء المتقطعة"),
  cold_stress: t("Cold stress", "إجهاد البرودة"), dehydration: t("Dehydration", "الجفاف"), frostbite: t("Frostbite", "قضمة الصقيع"), heat_cramps: t("Heat cramps", "التشنجات الحرارية"), heat_exhaustion: t("Heat exhaustion", "الإنهاك الحراري"), heat_rash: t("Heat rash", "الطفح الحراري"), heat_stress: t("Heat stress", "الإجهاد الحراري"), heat_stroke: t("Heat stroke", "ضربة الحرارة"), heat_syncope: t("Heat syncope", "الإغماء الحراري"), hypothermia: t("Hypothermia", "انخفاض حرارة الجسم"),
  ionizing_em: t("Ionizing electromagnetic", "الكهرومغناطيسية المؤينة"), ionizing_particle: t("Ionizing particles", "الجسيمات المؤينة"), laser: t("Laser", "الليزر"), nonionizing_optical: t("Non-ionizing optical", "البصرية غير المؤينة"), rf_microwave: t("RF / microwave", "الترددات الراديوية / الموجات الدقيقة"),
  chemical_properties: t("Chemical properties", "الخواص الكيميائية"), compatibility: t("Compatibility", "التوافق"), compressed_gas: t("Compressed gas", "الغاز المضغوط"), flammability: t("Flammability", "قابلية الاشتعال"), oxidizers: t("Oxidizers", "المؤكسدات"), reactivity: t("Reactivity", "التفاعلية"), release: t("Release", "الانبعاث"), spill: t("Spill", "الانسكاب"), storage: t("Storage", "التخزين"), temperature: t("Temperature", "درجة الحرارة"), waste: t("Waste", "النفايات"),
  battery: t("Battery", "البطارية"), detection: t("Detection", "الكشف"), dust: t("Dust", "الغبار"), explosion: t("Explosion", "الانفجار"), extinguishers: t("Extinguishers", "طفايات الحريق"), flammable: t("Flammable materials", "المواد القابلة للاشتعال"), hot_work: t("Hot work", "الأعمال الساخنة"), self_heating: t("Self heating", "التسخين الذاتي"), static: t("Static electricity", "الكهرباء الساكنة"), suppression: t("Suppression", "الإخماد"),
  containment: t("Containment", "الاحتواء"), instrumentation: t("Instrumentation", "أجهزة القياس والتحكم"), management_of_change: t("Management of change", "إدارة التغيير"), materials: t("Materials", "المواد"), pressure: t("Pressure", "الضغط"), reaction: t("Reaction", "التفاعل"), relief: t("Pressure relief", "تنفيس الضغط"), safeguards: t("Safeguards", "وسائل الحماية"), startup: t("Startup", "بدء التشغيل"),
  collapse: t("Collapse", "الانهيار"), utilities: t("Utilities", "المرافق"), water: t("Water", "المياه"), atmosphere: t("Atmosphere", "الأجواء"),
  access: t("Access", "الوصول"), surcharge: t("Surcharge loads", "الأحمال الإضافية"), mobile_equipment: t("Mobile equipment", "المعدات المتنقلة"), structures: t("Structures", "المنشآت"),
  physical: t("Physical hazards", "المخاطر الفيزيائية"), configuration: t("Internal configuration", "التكوين الداخلي"), energy: t("Energy", "الطاقة"), controls: t("Controls", "الضوابط"), entry_program: t("Entry program", "برنامج الدخول"),
  unexpected_startup: t("Unexpected startup", "بدء التشغيل غير المتوقع"), electrical: t("Electrical", "الكهربائية"), mechanical: t("Mechanical", "الميكانيكية"), hydraulic: t("Hydraulic", "الهيدروليكية"), pneumatic: t("Pneumatic", "الهوائية"), thermal: t("Thermal", "الحرارية"), gravity: t("Gravity", "الجاذبية"), chemical_process: t("Chemical / process", "الكيميائية / العمليات"), residual: t("Residual energy", "الطاقة المتبقية"), program_failure: t("Program failure", "فشل البرنامج"),
  vessel: t("Vessel", "الوعاء"), hose: t("Hose", "الخرطوم"), cylinders: t("Cylinders", "الأسطوانات"), compressed_air: t("Compressed air", "الهواء المضغوط"), vacuum: t("Vacuum", "التفريغ"), thermal_pressure: t("Thermal pressure", "الضغط الحراري"),
};
export const FINAL_SUBCATEGORY_CODES: Record<keyof typeof FINAL_CATEGORIES, readonly string[]> = {
  EXC: ["collapse", "utilities", "water", "atmosphere", "access", "surcharge", "mobile_equipment", "structures"],
  CONF: ["atmosphere", "physical", "configuration", "energy", "controls", "entry_program"],
  LOTO: ["unexpected_startup", "electrical", "mechanical", "hydraulic", "pneumatic", "thermal", "gravity", "chemical_process", "residual", "program_failure"],
  PRESS: ["vessel", "hose", "hydraulic", "cylinders", "pneumatic", "compressed_air", "vacuum", "thermal_pressure"],
  CHEM: ["chemical_properties", "compatibility", "compressed_gas", "flammability", "oxidizers", "reactivity", "release", "spill", "storage", "temperature", "waste"],
  FIRE: ["battery", "compressed_gas", "detection", "dust", "explosion", "extinguishers", "flammable", "hot_work", "self_heating", "static", "suppression"],
  PSM: ["containment", "instrumentation", "management_of_change", "materials", "pressure", "reaction", "relief", "safeguards", "startup", "utilities"],
  ERGO: ["anthropometry", "contact_stress", "fatigue", "force", "lifting", "overhead", "posture", "repetition", "static_posture", "vibration", "workstation"],
  NOISE: ["acoustics", "combined", "continuous", "dose", "hearing_loss", "hearing_protection", "impact", "intermittent"],
  THERM: ["cold_stress", "dehydration", "frostbite", "heat_cramps", "heat_exhaustion", "heat_rash", "heat_stress", "heat_stroke", "heat_syncope", "hypothermia"],
  RAD: ["ionizing_em", "ionizing_particle", "laser", "nonionizing_optical", "rf_microwave"],
  ENV: ["air", "groundwater", "pesticide", "soil", "spill", "stormwater", "ust", "waste", "water"],
  SEC: ["access", "active_attack", "bomb_threat", "evacuation", "hazmat_security", "utilities", "violence", "weather"],
};
export function finalSubcategories(code: keyof typeof FINAL_CATEGORIES) {
  return FINAL_SUBCATEGORY_CODES[code].map(id => {
    if (!labels[id]) throw new Error(`Untranslated subcategory: ${code}/${id}`);
    return { id: id.replaceAll("_", "-"), name: labels[id] };
  });
}
export const FINAL_WORK_CONTEXTS: Record<string, string> = {
  chemical: "الكيميائيات", civil: "الأعمال المدنية", construction: "البناء", environmental: "البيئة", facilities: "المنشآت", healthcare: "الرعاية الصحية", industrial: "الصناعة", laboratory: "المختبر", maintenance: "الصيانة", manufacturing: "التصنيع", medical: "الطب", office: "المكتب", outdoor: "العمل الخارجي", "process-industry": "صناعات العمليات", "public-facing": "التعامل مع الجمهور", research: "البحث", response: "الاستجابة", retail: "التجزئة", transportation: "النقل", utilities: "المرافق", warehouse: "المستودعات", waste: "النفايات",
};
