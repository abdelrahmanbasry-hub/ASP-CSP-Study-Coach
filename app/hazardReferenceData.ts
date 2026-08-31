import type { BilingualText } from "./hazardData";
import { HAZARD_SCENES } from "./hazardSceneData.ts";
import { emptyHazardControls, type HazardRecord, type HazardControls } from "./hazardTypes.ts";

const t = (en: string, ar: string): BilingualText => ({ en, ar });
const controls = (values: Partial<HazardControls>): HazardControls => ({ ...emptyHazardControls(), ...values });
const reference = (input: Omit<HazardRecord, "source" | "relatedPracticeQuestionIds" | "searchTerms"> & { urls: string[]; keywords?: BilingualText[] }): HazardRecord => {
  const { urls, keywords = [], ...record } = input;
  return { ...record, relatedPracticeQuestionIds: [], searchTerms: { en: keywords.map((text) => text.en), ar: keywords.map((text) => text.ar) },
    source: { kind: "architecture-reference", status: "study-summary", citation: t("Phase 3 reference scene. Brief educational summary informed by the linked OSHA resources; not a safe-work procedure. Reviewed 2026-08-31.", "مشهد مرجعي للمرحلة الثالثة. ملخص تعليمي موجز مستند إلى موارد OSHA المرتبطة؛ ليس إجراء عمل آمن. روجع في 2026-08-31."), urls } };
};

/** Only the six requested reference hazards. Existing five IDs remain stable for Save. */
export const HAZARD_REFERENCE_RECORDS: readonly HazardRecord[] = [
  reference({
    id: "ref-arc-flash", categoryId: "electrical", subcategoryId: "arc-flash", name: t("Arc Flash", "القوس الكهربائي"),
    summary: t("A sudden release of electrical energy can expose a nearby worker to heat, light and pressure.", "قد يعرّض الانطلاق المفاجئ للطاقة الكهربائية العامل القريب للحرارة والضوء والضغط."),
    mechanisms: [t("Electrical arc; thermal energy, intense light and blast pressure.", "قوس كهربائي؛ طاقة حرارية وضوء شديد وضغط انفجار.")],
    consequences: [t("Burns, eye or hearing injury, and secondary impact injuries.", "حروق وإصابات العين أو السمع وإصابات الصدمة الثانوية.")],
    highRiskWork: [t("Electrical switching, troubleshooting and maintenance near energized equipment.", "الفصل والتوصيل الكهربائي واستكشاف الأعطال والصيانة قرب معدات مكهربة.")],
    controls: controls({ elimination: [t("Establish an electrically safe work condition through appropriate de-energization, isolation and verification.", "أنشئ حالة عمل آمنة كهربائيًا بالفصل والعزل والتحقق المناسب.")], administrative: [t("Qualified personnel, task assessment and equipment-specific procedures.", "أفراد مؤهلون وتقييم المهمة وإجراءات خاصة بالمعدات.")], ppe: [t("Select protective equipment from the applicable hazard assessment; the illustration does not specify a rating.", "اختر معدات الوقاية وفق تقييم الخطر المعمول به؛ لا يحدد الرسم تصنيفًا للوقاية.")] }),
    visualization: HAZARD_SCENES.arc, workContextTags: [t("Electrical maintenance", "صيانة كهربائية")],
    relatedStandardIds: [], relatedPracticeTags: ["arc flash"], keywords: [t("electrical arc", "وميض قوسي")],
    urls: ["https://www.osha.gov/electrical/flash-hazards", "https://www.osha.gov/sites/default/files/2026-02/Module1TrainerGuide.pdf"],
  }),
  reference({
    id: "ref-scaffold-fall", categoryId: "falls-height", subcategoryId: "scaffolds", name: t("Scaffold Fall", "السقوط من السقالة"),
    summary: t("An open edge at elevation can lead to a fall onto a lower level.", "قد تؤدي حافة مفتوحة على ارتفاع إلى السقوط على مستوى أدنى."),
    mechanisms: [t("Loss of support or balance at an inadequately protected scaffold edge.", "فقدان الدعم أو التوازن عند حافة سقالة غير محمية بما يكفي.")],
    consequences: [t("Serious fall injuries or death; falling materials can also strike people below.", "إصابات سقوط خطيرة أو وفاة؛ وقد تصيب المواد المتساقطة الأشخاص في الأسفل.")],
    highRiskWork: [t("Scaffold erection, use, alteration and dismantling.", "تركيب السقالات واستخدامها وتعديلها وتفكيكها.")],
    controls: controls({ engineering: [t("Provide fall and falling-object protection appropriate to the scaffold and task.", "وفّر حماية من السقوط وسقوط الأجسام تناسب السقالة والمهمة.")], administrative: [t("Inspection, training and controlled access beneath overhead work.", "الفحص والتدريب والتحكم في الدخول أسفل العمل المرتفع.")] }),
    visualization: HAZARD_SCENES.scaffold, workContextTags: [t("Construction", "الإنشاءات")],
    relatedStandardIds: [], relatedPracticeTags: ["scaffold"], keywords: [t("scaffolding", "سقالات")],
    urls: ["https://www.osha.gov/etools/scaffolding", "https://www.osha.gov/fall-protection/construction"],
  }),
  reference({
    id: "ref-forklift-tip-over", categoryId: "material-handling", subcategoryId: "industrial-trucks", name: t("Forklift Tip-Over", "انقلاب الرافعة الشوكية"),
    summary: t("Load position and vehicle movement can cause a forklift to lose stability.", "قد يتسبب موضع الحمولة وحركة المركبة في فقدان ثبات الرافعة الشوكية."),
    mechanisms: [t("A shift in the combined center of gravity can overturn the truck.", "قد يؤدي تغير مركز الثقل المشترك إلى انقلاب الرافعة.")],
    consequences: [t("Crushing injuries, struck-by injuries and equipment or property damage.", "إصابات السحق والاصطدام وتلف المعدات أو الممتلكات.")],
    highRiskWork: [t("Handling elevated or uneven loads, turning, and operating near grades or edges.", "مناولة حمولات مرتفعة أو غير متوازنة والانعطاف والتشغيل قرب المنحدرات أو الحواف.")],
    controls: controls({ engineering: [t("Arrange stable loads and separate pedestrian routes from vehicle routes.", "رتّب الحمولات بثبات وافصل مسارات المشاة عن المركبات.")], administrative: [t("Trained operators; follow the truck capacity and operating instructions and avoid travel with an elevated load.", "مشغلون مدربون؛ اتبع سعة الرافعة وتعليمات تشغيلها وتجنب السير بحمولة مرتفعة.")] }),
    visualization: HAZARD_SCENES.forklift, workContextTags: [t("Warehouse", "المستودعات")],
    relatedStandardIds: [], relatedPracticeTags: ["forklift"], keywords: [t("powered industrial truck", "رافعة شوكية")],
    urls: ["https://www.osha.gov/etools/powered-industrial-trucks/load-handling/load-composition"],
  }),
  reference({
    id: "ref-oxygen-deficient-space", categoryId: "confined-spaces", subcategoryId: "atmospheric-hazards", name: t("Oxygen-Deficient Confined Space", "مكان محصور ناقص الأكسجين"),
    summary: t("A confined space may contain an oxygen-deficient atmosphere that cannot be judged by sight.", "قد يحتوي المكان المحصور على جو ناقص الأكسجين لا يمكن تقييمه بالنظر."),
    mechanisms: [t("An entrant breathes an atmosphere with insufficient oxygen.", "يتنفس الداخل جوًا لا يحتوي على أكسجين كافٍ.")],
    consequences: [t("Incapacitation, asphyxiation or death, including danger to unplanned rescuers.", "العجز أو الاختناق أو الوفاة، مع تعريض من يحاول الإنقاذ دون تخطيط للخطر.")],
    highRiskWork: [t("Entry into tanks and vessels for inspection, cleaning or maintenance.", "دخول الخزانات والأوعية للفحص أو التنظيف أو الصيانة.")],
    controls: controls({ elimination: [t("Avoid entry where the task can be completed from outside.", "تجنب الدخول عندما يمكن إنجاز المهمة من الخارج.")], engineering: [t("Appropriate isolation and ventilation, with atmospheric testing and monitoring.", "عزل وتهوية مناسبان مع فحص الجو ومراقبته.")], administrative: [t("An applicable entry program, trained personnel, attendant and suitable rescue arrangements.", "برنامج دخول مناسب وأفراد مدربون ومراقب وترتيبات إنقاذ ملائمة.")] }),
    visualization: HAZARD_SCENES.confined, workContextTags: [t("Entry work", "أعمال الدخول")],
    relatedStandardIds: ["1910-146", "1910-134"], relatedPracticeTags: ["confined space"], keywords: [t("oxygen deficiency", "نقص الأكسجين")],
    urls: ["https://www.osha.gov/confined-spaces", "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146"],
  }),
  reference({
    id: "ref-unexpected-startup", categoryId: "hazardous-energy", subcategoryId: "unexpected-startup", name: t("Unexpected Startup / LOTO", "بدء التشغيل غير المتوقع / القفل والوسم"),
    summary: t("Unexpected energization or release of stored energy can harm a person servicing equipment.", "قد يؤذي التشغيل غير المتوقع أو انطلاق الطاقة المخزنة شخصًا يصون المعدات."),
    mechanisms: [t("Uncontrolled electrical, mechanical, fluid-pressure or other energy reaches equipment during servicing.", "تصل طاقة كهربائية أو ميكانيكية أو ضغط مائع أو طاقة أخرى غير متحكم فيها إلى المعدات أثناء الصيانة.")],
    consequences: [t("Unexpected movement, crushing, cuts or pressure-related injuries.", "حركة غير متوقعة أو سحق أو جروح أو إصابات مرتبطة بالضغط.")],
    highRiskWork: [t("Maintenance, cleaning, clearing jams and inspection requiring exposure to hazardous energy.", "الصيانة والتنظيف وإزالة الانحشار والفحص الذي يعرّض العامل لطاقة خطرة.")],
    controls: controls({ engineering: [t("Isolate energy sources and control stored or residual energy.", "اعزل مصادر الطاقة وتحكم في الطاقة المخزنة أو المتبقية.")], administrative: [t("Apply the equipment-specific energy-control procedure, locks/tags and verification before servicing.", "طبّق إجراء التحكم في الطاقة الخاص بالمعدات والأقفال والوسوم والتحقق قبل الصيانة.")] }),
    visualization: HAZARD_SCENES.loto, workContextTags: [t("Equipment servicing", "صيانة المعدات")],
    relatedStandardIds: ["1910-147"], relatedPracticeTags: ["lockout", "hazardous energy"], keywords: [t("energy isolation LOTO", "عزل الطاقة")],
    urls: ["https://www.osha.gov/etools/lockout-tagout/tutorial/application-energy-control"],
  }),
  reference({
    id: "ref-radiation-exposure", categoryId: "radiation", subcategoryId: "ionizing-radiation", name: t("Radiation Exposure", "التعرض للإشعاع"),
    summary: t("Time, distance and suitable shielding help reduce exposure to ionizing radiation.", "يساعد الزمن والمسافة والتدريع المناسب على تقليل التعرض للإشعاع المؤين."),
    mechanisms: [t("Energy from an ionizing radiation source reaches a worker.", "تصل طاقة من مصدر إشعاع مؤين إلى العامل.")],
    consequences: [t("Tissue damage and increased cancer risk, depending on exposure.", "تضرر الأنسجة وزيادة خطر السرطان حسب التعرض.")],
    highRiskWork: [t("Industrial radiography and work around radiation-generating equipment or radioactive sources.", "التصوير الإشعاعي الصناعي والعمل قرب معدات مولدة للإشعاع أو مصادر مشعة.")],
    controls: controls({ engineering: [t("Suitable source shielding, barriers and separation.", "تدريع مناسب للمصدر وحواجز وفصل.")], administrative: [t("Minimize exposure time and maximize distance within the radiation-protection program.", "قلل زمن التعرض وزد المسافة ضمن برنامج الوقاية من الإشعاع.")] }),
    visualization: HAZARD_SCENES.radiation, workContextTags: [t("Industrial radiography", "التصوير الإشعاعي الصناعي")],
    relatedStandardIds: [], relatedPracticeTags: ["radiation"], keywords: [t("time distance shielding ionizing", "زمن مسافة تدريع مؤين")],
    urls: ["https://www.osha.gov/ionizing-radiation/control-prevention", "https://www.osha.gov/ionizing-radiation/health-effects"],
  }),
];
