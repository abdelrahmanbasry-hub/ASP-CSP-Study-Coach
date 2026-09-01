import type { BilingualText } from "./hazardData";

/**
 * Editorial UI copy for the Hazards workspace.
 *
 * Arabic terminology is intentionally consistent:
 * - "الرسم التوضيحي" for the interactive visual (not the literal "المشهد")
 * - "علامة توضيحية" for a selectable callout (not "تعليق")
 * - "إزالة" for clearing filters/selections
 * - concise noun headings for reference sections instead of translated questions
 *
 * Controlled hazard records and citations remain unchanged.
 */
export const HAZARD_UI_COPY = {
  libraryTitle: { en: "Hazard Library", ar: "دليل مخاطر العمل" },
  librarySubtitle: { en: "Explore workplace hazards", ar: "تعرّف إلى المخاطر وطرق التحكم فيها" },
  allInCategory: { en: "All in category", ar: "جميع مخاطر الفئة" },
  searchHazards: { en: "Search hazards", ar: "ابحث في دليل المخاطر" },
  startWithHazard: { en: "Start with the hazard.", ar: "ابدأ بنوع الخطر." },
  overviewLead: { en: "Explore the scene. Understand the risk. Learn the controls.", ar: "شاهد الرسم، وافهم الخطر، ثم تعرّف إلى وسائل التحكم." },
  changeFilters: { en: "Change filters", ar: "تعديل عوامل التصفية" },
  clearFilters: { en: "Clear filters", ar: "إزالة عوامل التصفية" },
  clearSearchAndFilters: { en: "Clear search and filter", ar: "إزالة البحث وعوامل التصفية" },
  category: { en: "Category", ar: "فئة الخطر" },
  subcategory: { en: "Subcategory", ar: "النوع الفرعي" },
  chooseHazard: { en: "Choose a hazard", ar: "اختر الخطر" },
  savedNotes: { en: "Saved notes", ar: "الملاحظات المحفوظة" },
  bodyExplorer: { en: "Body-system explorer", ar: "تأثير الخطر في أجهزة الجسم" },
  sourceTable: { en: "Source data table", ar: "جدول بيانات المصدر" },
  noMatchingRecords: { en: "No records match these filters.", ar: "لا توجد مخاطر مطابقة لاختياراتك." },
  noMatchingRecord: { en: "No matching record", ar: "لا توجد نتيجة مطابقة" },
  tryAnotherFilter: { en: "Choose another category or clear the filters.", ar: "اختر فئة أخرى أو أزل عوامل التصفية." },
  hazardGuide: { en: "Hazard guide", ar: "ملخص الخطر" },
  referenceIllustration: { en: "Reference scene", ar: "رسم توضيحي مرجعي" },
  selectedCallout: { en: "Selected scene callout", ar: "العلامة المحددة في الرسم" },
  illustrationContext: { en: "Scene context", ar: "شرح الرسم" },
  relatedEffects: { en: "Related effects", ar: "العواقب المرتبطة" },
  targetSystem: { en: "Target organ / system", ar: "العضو أو الجهاز المتأثر" },
  definition: { en: "What is it?", ar: "تعريف الخطر" },
  mechanism: { en: "How does it happen?", ar: "كيف يحدث التعرض أو الحادث؟" },
  consequences: { en: "What can happen?", ar: "العواقب المحتملة" },
  highRiskWork: { en: "Where is the risk?", ar: "الأعمال الأكثر تعرضًا للخطر" },
  controls: { en: "How do we control it?", ar: "كيف نتحكم في الخطر؟" },
  unavailable: { en: "Not authored in this phase", ar: "لا تتوفر معلومات لهذا القسم بعد" },
  standardMapping: { en: "Standard mapping status", ar: "الارتباط بالمعايير" },
  resolvedStandard: { en: "Resolved in catalog", ar: "متاح في دليل المعايير" },
  unresolvedStandard: { en: "Unresolved — not in catalog", ar: "غير متاح في دليل المعايير" },
  relatedStandards: { en: "Related OSHA standards", ar: "معايير OSHA ذات الصلة" },
  relatedPractice: { en: "Related Practice", ar: "تدريب على هذا الموضوع" },
  sourceProvenance: { en: "Controlled source & provenance", ar: "المصادر وتوثيق المحتوى" },
  sourceReferences: { en: "Source references", ar: "المراجع الأصلية" },
  studyDisclaimer: {
    en: "Study summary only. Standards links are catalog connections, not an assessment of legal applicability. Verify workplace decisions against authoritative guidance.",
    ar: "هذا ملخص للمذاكرة، وليس تقييمًا للمتطلبات القانونية في موقع بعينه. راجع المصادر الرسمية قبل اتخاذ أي قرار في مكان العمل.",
  },
} as const satisfies Record<string, BilingualText>;
