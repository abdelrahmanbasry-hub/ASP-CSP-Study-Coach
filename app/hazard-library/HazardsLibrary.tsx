"use client";

import { CircleHelp, FlaskConical, Languages, Search } from "lucide-react";
import { useState } from "react";
import { BookmarkAction } from "../StudySystem";
import { Bilingual } from "../body-explorer/Bilingual";
import { ANATOMY_REGIONS } from "../body-explorer/anatomyGeometry";
import { BODY_SYSTEM_BY_ID, type BodySystemId } from "../bodySystems";
import { HAZARD_CATEGORY_BY_ID, HAZARD_NAVIGATION, hazardSubcategoryName, type HazardCategoryId, type HazardCategorySelection } from "../hazardCategories";
import { filterHazards, type ExplorerLanguage } from "../hazardExplorer";
import { HAZARD_LIBRARY_BY_ID, HAZARD_LIBRARY_RECORDS, HIDDEN_LEGACY_HAZARD_RECORDS } from "../hazardLibraryData";
import { CONTROL_LEVELS, type HazardRecord, type HazardResourceOpener, type SceneOverlay } from "../hazardTypes";
import type { BilingualText, OccupationalHealthRecord } from "../hazardData";
import type { StudySystemState } from "../studySystemState";
import { HazardCategoryNavigation } from "./HazardCategoryNavigation";
import { HazardVisualization } from "./HazardVisualization";
import "./hazard-library.css";

type Props = { initialSearch?: string; initialItemId?: string; requestKey?: number; system: StudySystemState; onSystem: (system: StudySystemState) => void; onOpen: HazardResourceOpener };
const recordsForCategory = (categoryId: HazardCategorySelection) => filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId });
const categoryName = (categoryId: HazardCategorySelection) => categoryId === "all" ? HAZARD_NAVIGATION.all : HAZARD_CATEGORY_BY_ID[categoryId].name;

function Subcategories({ categoryId, selected, onSelect, language }: { categoryId: HazardCategoryId; selected: string | null; onSelect: (id: string | null) => void; language: ExplorerLanguage }) {
  const category = HAZARD_CATEGORY_BY_ID[categoryId];
  if (!category.subcategories.length) return null;
  const options = [{ id: null, name: { en: "All in category", ar: "كل الفئة" } }, ...category.subcategories];
  return <div className="hazard-subcategories" role="group" aria-label={language === "ar" ? "الفئات الفرعية" : "Hazard subcategories"}>
    {options.map((option) => {
      const count = filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId, subcategoryId: option.id }).length;
      const text = { en: `${option.name.en} (${count})`, ar: `${option.name.ar} (${count})` };
      return <button type="button" data-subcategory-id={option.id ?? "all"} key={option.id ?? "all"} aria-pressed={selected === option.id} aria-label={text[language === "ar" ? "ar" : "en"]} onClick={() => onSelect(option.id)}><Bilingual text={text} language={language} /></button>;
    })}
  </div>;
}

export function HazardsLibrary({ initialSearch = "", initialItemId, system, onSystem, onOpen }: Props) {
  const [initialRecord] = useState(() => (initialItemId ? HAZARD_LIBRARY_BY_ID[initialItemId] : undefined) ?? (initialSearch ? filterHazards(HAZARD_LIBRARY_RECORDS, { query: initialSearch })[0] : undefined));
  const [legacyOpen, setLegacyOpen] = useState(Boolean(initialRecord && HIDDEN_LEGACY_HAZARD_RECORDS.includes(initialRecord)));
  const [categoryId, setCategoryId] = useState<HazardCategorySelection>(initialRecord?.categoryId ?? "occupational-health");
  const [subcategoryId, setSubcategoryId] = useState<string | null>(legacyOpen ? null : initialRecord ? initialRecord.subcategoryId : HAZARD_CATEGORY_BY_ID["occupational-health"].defaultSubcategoryId ?? null);
  const [language, setLanguage] = useState<ExplorerLanguage>("both");
  const [mode, setMode] = useState<"explore" | "table">("explore");
  const [search, setSearch] = useState(initialItemId && initialRecord ? "" : initialSearch);
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(initialRecord?.id ?? null);
  const [sceneSelection, setSceneSelection] = useState<{ recordId: string; overlayId: string } | null>(null);
  const category = categoryId === "all" ? undefined : HAZARD_CATEGORY_BY_ID[categoryId];
  const visibleRecords = filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId, subcategoryId, query: search, systemId: selectedSystem });
  const selectedRecord = legacyOpen ? initialRecord : visibleRecords.find((record) => record.id === selectedRecordId) ?? visibleRecords[0];
  const selectedOverlay = selectedRecord?.visualization.kind !== "body-system" && selectedRecord?.visualization.status === "implemented" && sceneSelection?.recordId === selectedRecord.id
    ? selectedRecord.visualization.overlays.find((overlay) => overlay.id === sceneSelection.overlayId) : undefined;
  const selectCategory = (next: HazardCategorySelection) => {
    setLegacyOpen(false);
    setCategoryId(next); setSubcategoryId(next === "all" ? null : HAZARD_CATEGORY_BY_ID[next].defaultSubcategoryId ?? null);
    setSelectedSystem(null); setSelectedRecordId(null); setSceneSelection(null); setMode("explore");
  };
  const chooseSystem = (id: BodySystemId) => { setSelectedSystem((current) => current === id ? null : id); setSelectedRecordId(null); };
  const clearFilters = () => { setSearch(""); setSelectedSystem(null); setSelectedRecordId(null); };
  const railName = selectedSystem ? BODY_SYSTEM_BY_ID[selectedSystem].text : (categoryId !== "all" && subcategoryId ? hazardSubcategoryName(categoryId, subcategoryId) : undefined) ?? categoryName(categoryId);
  const sourceCount = HAZARD_LIBRARY_RECORDS.filter((record) => record.source.kind === "workbook").length;
  const coreCount = HAZARD_LIBRARY_RECORDS.filter((record) => record.source.kind === "controlled-dataset").length;

  return <section className="page-width library-panel hazards-library-panel hazard-library-v2" data-language={language}>
    <div className="library-toolbar"><div><p className="eyebrow"><FlaskConical size={15} aria-hidden="true" /><Bilingual text={{ en: "Hazard Library", ar: "مكتبة المخاطر" }} language={language} /></p><h2><Bilingual text={{ en: "Explore workplace hazards", ar: "استكشف مخاطر مكان العمل" }} language={language} /></h2></div>
      <span><Bilingual text={{ en: `${sourceCount} occupational-health records · ${coreCount} controlled hazards`, ar: `${sourceCount} سجلًا للصحة المهنية · ${coreCount} خطرًا من البيانات المعتمدة` }} language={language} /></span>
    </div>
    <HazardCategoryNavigation selected={categoryId} onSelect={selectCategory} language={language} />
    {legacyOpen && <div className="hazard-reference-notice" role="status"><Bilingual text={{ en: "Saved legacy reference: Radiation Exposure. This broad educational record is preserved for your notes and is not one of the canonical radiation subtypes.", ar: "مرجع قديم محفوظ: التعرض للإشعاع. حُفظ هذا السجل التعليمي العام لملاحظاتك، ولا يمثل أحد الأنواع الفرعية المعتمدة للإشعاع." }} language={language} /><button type="button" className="secondary-button" onClick={() => selectCategory("radiation")}><Bilingual text={{ en: "Browse radiation hazards", ar: "تصفح مخاطر الإشعاع" }} language={language} /></button></div>}
    <div className="hazard-library-context">
      <h3><Bilingual text={categoryName(categoryId)} language={language} /></h3>
      <div className="hazard-language-switch" role="group" aria-label={language === "ar" ? "لغة العرض" : "Display language"}><Languages size={16} aria-hidden="true" />{([{ id: "both", name: "Both" }, { id: "en", name: "English" }, { id: "ar", name: "العربية" }] as const).map((item) => <button type="button" key={item.id} aria-pressed={language === item.id} onClick={() => setLanguage(item.id)}>{item.name}</button>)}</div>
    </div>
    {category?.sourceTable && <div className="hazard-view-switches" role="group" aria-label="Hazard library view">
      <button type="button" aria-pressed={mode === "explore"} aria-label={language === "ar" ? "مستكشف أجهزة الجسم" : "Body-system explorer"} className={mode === "explore" ? "active" : ""} onClick={() => setMode("explore")}><Bilingual text={{ en: "Body-system explorer", ar: "مستكشف أجهزة الجسم" }} language={language} /></button>
      <button type="button" aria-pressed={mode === "table"} aria-label={language === "ar" ? "جدول بيانات المصدر" : "Source data table"} className={mode === "table" ? "active" : ""} onClick={() => setMode("table")}><Bilingual text={{ en: "Source data table", ar: "جدول بيانات المصدر" }} language={language} /></button>
    </div>}
    <div hidden={mode !== "explore"}>
      {categoryId !== "all" && <Subcategories categoryId={categoryId} selected={subcategoryId} language={language} onSelect={(id) => { setLegacyOpen(false); setSubcategoryId(id); setSelectedSystem(null); setSelectedRecordId(null); setSceneSelection(null); }} />}
      <div className="resource-filters single"><label><Search size={16} aria-hidden="true" /><input aria-label="Search hazards" value={search} onChange={(event) => { setLegacyOpen(false); setSearch(event.target.value); setSelectedSystem(null); setSelectedRecordId(null); setSceneSelection(null); }} placeholder={language === "ar" ? "ابحث بالاسم أو الفئة أو الأثر أو العمل أو الضوابط أو المعيار…" : "Search name, category, consequence, work, body system, control, or standard…"} dir={language === "ar" ? "rtl" : "ltr"} /></label></div>
      <p className="hazard-explorer-intro"><Bilingual text={{ en: "Select a hazard to explore its source information and visualization. Select a body region to find related occupational-health records.", ar: "اختر خطرًا لاستكشاف معلومات مصدره وعرضه المرئي. اختر منطقة من الجسم للعثور على سجلات الصحة المهنية المرتبطة." }} language={language} /></p>
      <div className="hazard-result-status" role="status" aria-live="polite"><Bilingual text={{ en: `${visibleRecords.length} records in ${categoryName(categoryId).en}`, ar: `${visibleRecords.length} سجلًا في ${categoryName(categoryId).ar}` }} language={language} /></div>
      <div className="hazard-explorer">
        <aside className="hazard-record-rail" aria-label="Hazard records"><div className="hazard-rail-heading"><Bilingual text={railName} language={language} /><b>{visibleRecords.length}</b></div>
          <div className="hazard-record-list">{visibleRecords.map((record) => <button type="button" key={record.id} data-hazard-id={record.id} className={selectedRecord?.id === record.id ? "active" : ""} aria-pressed={selectedRecord?.id === record.id} onClick={() => { setLegacyOpen(false); setSelectedRecordId(record.id); setSceneSelection(null); }}><span className="hazard-record-dot" aria-hidden="true" /><span><Bilingual text={record.name} language={language} />{record.importMetadata && <small className="hazard-record-reference" dir="ltr">{record.id}</small>}{record.source.kind === "architecture-reference" && <Bilingual className="hazard-record-reference" text={{ en: "Reference scene", ar: "مشهد مرجعي" }} language={language} />}{record.source.status === "placeholder" && <Bilingual className="hazard-record-reference" text={{ en: "Architecture reference", ar: "مرجع لاختبار البنية" }} language={language} />}</span></button>)}
            {!visibleRecords.length && <div className="hazard-empty"><p><Bilingual text={recordsForCategory(categoryId).length ? { en: "No records match these filters.", ar: "لا توجد سجلات تطابق هذه التصفية." } : { en: "This category is configured. Its content has not been added yet.", ar: "تم إعداد هذه الفئة، ولم يُضف محتواها بعد." }} language={language} /></p>{(search || selectedSystem) && <button type="button" onClick={clearFilters}><Bilingual text={{ en: "Clear search and filter", ar: "مسح البحث والتصفية" }} language={language} /></button>}</div>}
          </div>
        </aside>
        <HazardVisualization record={selectedRecord} language={language} selectedSystem={selectedSystem} onSelectSystem={chooseSystem} onClearSystem={() => setSelectedSystem(null)} bodyContext={Boolean(category?.sourceTable || selectedSystem)} selectedOverlayId={selectedOverlay?.id ?? null} onSelectOverlay={(id) => setSceneSelection(id && selectedRecord ? { recordId: selectedRecord.id, overlayId: id } : null)} />
        <HazardDetail selectedOverlay={selectedOverlay} record={selectedRecord} selectedSystem={selectedSystem} onSelectSystem={chooseSystem} language={language} system={system} onSystem={onSystem} onOpen={onOpen} />
      </div>
    </div>
    <div hidden={mode !== "table" || !category?.sourceTable}><SourceHazardTable initialSearch={initialSearch} language={language} /></div>
  </section>;
}

function HazardDetail({ record, selectedOverlay, language, selectedSystem, onSelectSystem, system, onSystem, onOpen }: { record?: HazardRecord; selectedOverlay?: SceneOverlay; language: ExplorerLanguage; selectedSystem: BodySystemId | null; onSelectSystem: (id: BodySystemId) => void; system: StudySystemState; onSystem: (system: StudySystemState) => void; onOpen: HazardResourceOpener }) {
  const body = record?.visualization.kind === "body-system" ? record.visualization.occupationalHealth : undefined;
  const text = (value: BilingualText) => <Bilingual text={value} language={language} />;
  const field = (label: BilingualText, values: readonly BilingualText[]) => <div key={label.en}><dt>{text(label)}</dt><dd>{values.length ? values.map((value, index) => <p key={index}>{text(value)}</p>) : text({ en: "Not authored in this phase", ar: "لم يُعدّ في هذه المرحلة" })}</dd></div>;
  if (!record) return <article className="hazard-detail-card"><div className="hazard-detail-empty"><FlaskConical size={24} aria-hidden="true" /><h3>{text({ en: "No matching record", ar: "لا يوجد سجل مطابق" })}</h3><p>{text({ en: "Choose another category or clear the filters.", ar: "اختر فئة أخرى أو امسح التصفية." })}</p></div></article>;
  return <article className="hazard-detail-card">
    <div className="hazard-detail-kicker"><span>{text(HAZARD_CATEGORY_BY_ID[record.categoryId].name)}</span><small>{record.source.sourceRow ? text({ en: `Source row ${record.source.sourceRow}`, ar: `صف المصدر ${record.source.sourceRow}` }) : record.importMetadata ? <span dir="ltr">{record.id}</span> : text({ en: "Reference scene", ar: "مشهد مرجعي" })}</small></div>
    <div className="hazard-bookmark-heading"><h3>{text(record.name)}</h3><BookmarkAction kind="hazard" itemId={record.id} title={record.name.en} subtitle={record.consequences[0]?.en ?? record.summary.en} system={system} onChange={onSystem} labels={language === "ar" ? { save: "حفظ", saved: "محفوظ", saveLabel: `حفظ ${record.name.ar} في الدفتر`, removeLabel: `إزالة ${record.name.ar} من الدفتر` } : undefined} /></div>
    {body ? <div className="hazard-system-chips">{body.targets.map(({ systemId, role }) => <button key={systemId} type="button" onClick={() => onSelectSystem(systemId)} aria-pressed={selectedSystem === systemId}><i className={`body-legend-symbol is-${role}`} aria-hidden="true" style={{ background: role === "primary" ? ANATOMY_REGIONS[systemId].accent : undefined, borderColor: role === "secondary" ? ANATOMY_REGIONS[systemId].accent : undefined }} />{text(BODY_SYSTEM_BY_ID[systemId].text)}</button>)}</div> : <p className="hazard-reference-notice">{text(record.summary)}</p>}
    {selectedOverlay && <section className="scene-selected-detail" data-role={selectedOverlay.role} data-semantic={selectedOverlay.semantic} data-selected-callout={selectedOverlay.id} aria-live="polite">
      <small>{text({ en: "Selected scene callout", ar: "تعليق المشهد المحدد" })}</small>
      <h4>{text(selectedOverlay.label)}</h4>{record.importMetadata && <small>{text({ en: "Scene context", ar: "سياق المشهد" })}</small>}<p>{text(selectedOverlay.description)}</p>
      {!!selectedOverlay.consequences?.length && <dl>{field({ en: "Related effects", ar: "الآثار المرتبطة" }, selectedOverlay.consequences)}</dl>}
      {selectedOverlay.controls && <dl>{CONTROL_LEVELS.filter((level) => selectedOverlay.controls?.[level.id]?.length).map((level) => field(level.name, selectedOverlay.controls?.[level.id] ?? []))}</dl>}
    </section>}
    <dl>
      {body && field({ en: "Target organ / system", ar: "العضو / الجهاز المستهدف" }, [body.targetOrganSystem])}
      {field({ en: "Main consequences", ar: "الآثار الرئيسية" }, record.consequences)}
      {field(body ? { en: "Exposure / transmission", ar: "التعرض / الانتقال" } : { en: "Mechanisms", ar: "آليات الخطر" }, record.mechanisms)}
      {field({ en: "High-risk work", ar: "العمل عالي الخطورة" }, record.highRiskWork)}
    </dl>
    {(!body || Object.values(record.controls).some((values) => values.length)) && <details className="hazard-controls"><summary>{text({ en: "Hierarchy of controls", ar: "التسلسل الهرمي للضوابط" })}</summary><dl>{CONTROL_LEVELS.map((level) => field(level.name, record.controls[level.id]))}</dl></details>}
    {!!record.workContextTags.length && <div className="hazard-work-tags">{record.workContextTags.map((tag) => <span key={tag.en}>{text(tag)}</span>)}</div>}
    {!!body?.mappingReview.length && <p className="body-review-note">{text({ en: "Mapping needs review. Original wording is preserved; see Exposure Route for details.", ar: "الربط يحتاج إلى مراجعة. النص الأصلي محفوظ؛ راجع مسار التعرض للتفاصيل." })}</p>}
    {record.standardReferences && <details className="hazard-standard-references"><summary>{text({ en: "Standard mapping status", ar: "حالة ربط المعايير" })}</summary><ul>{record.standardReferences.map((reference, index) => <li key={`${reference.number}-${index}`} data-standard-resolution={reference.resolution}><strong dir="ltr">{reference.number}</strong><span>{text(reference.resolution === "resolved" ? { en: "Resolved in catalog", ar: "مرتبط بالدليل" } : { en: "Unresolved — not in catalog", ar: "غير مرتبط — غير موجود بالدليل" })}</span><small dir="ltr">{reference.scope} · {reference.relation}</small></li>)}</ul></details>}
    {record.importMetadata && <details className="hazard-source-metadata"><summary>{text({ en: "Controlled source & provenance", ar: "المصدر المعتمد وبياناته" })}</summary><p>{text({ en: `Yates edition ${record.source.yatesEdition}`, ar: `ياتس، الطبعة ${record.source.yatesEdition}` })}</p><p dir="ltr">{record.source.yatesSection}</p><p>{text({ en: "Approximate source pages", ar: "صفحات المصدر التقريبية" })}: <b dir="ltr">{record.source.yatesPageRangeApprox}</b></p><p>{text({ en: "Yates support", ar: "دعم ياتس" })}: <strong dir="ltr" data-yates-support={record.source.yatesSupport}>{record.source.yatesSupport}</strong></p><p dir="ltr">{record.source.regulatoryVerification ?? record.source.oshaVerification}</p>{!!record.source.externalBasis?.length && <div><strong>{text({ en: "Additional source basis", ar: "أساس المصدر الإضافي" })}</strong>{record.source.externalBasis.map((basis, index) => <p key={index} dir="ltr">{basis}</p>)}</div>}<small dir="ltr">{record.importMetadata.packageVersion} · {record.importMetadata.contentStatus}</small></details>}
    <div className="hazard-crosslinks"><button type="button" className="secondary-button" aria-label={language === "ar" ? "معايير OSHA المرتبطة" : "Related OSHA standards"} onClick={() => onOpen("standards", record.name.en, { standardIds: record.relatedStandardIds })}>{text({ en: "Related OSHA standards", ar: "معايير OSHA المرتبطة" })}</button><button type="button" className="secondary-button" aria-label={language === "ar" ? "تدريب مرتبط" : "Related Practice"} onClick={() => onOpen("practice", record.name.en, { practiceTags: record.relatedPracticeTags, practiceQuestionIds: record.relatedPracticeQuestionIds })}>{text({ en: "Related Practice", ar: "تدريب مرتبط" })}</button></div>
    {!record.relatedStandardIds.length && <p className="body-source-note">{text(record.importMetadata && !record.standardReferences?.length ? { en: "This dataset supplies no OSHA standard reference for this record. The link opens the existing catalog.", ar: "لا توفر هذه البيانات مرجع معيار OSHA لهذا السجل. يفتح الرابط الدليل الحالي." } : { en: "No standard IDs mapped yet. The link opens the existing standards catalog.", ar: "لم تُربط معرّفات المعايير بعد. يفتح الرابط دليل المعايير الحالي." })}</p>}
    {!!record.source.urls?.length && <details className="scene-source-links"><summary>{text({ en: "Source references", ar: "مراجع المصدر" })}</summary><p>{text(record.source.citation)}</p>{record.source.urls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">{text({ en: `OSHA source ${index + 1}`, ar: `مصدر OSHA ${index + 1}` })}</a>)}</details>}
    <p className="hazard-detail-disclaimer"><CircleHelp size={14} aria-hidden="true" />{text(record.source.status === "placeholder" ? record.source.citation : { en: "Study summary only. Standards links are catalog connections, not an assessment of legal applicability. Verify workplace decisions against authoritative guidance.", ar: "ملخص دراسي فقط. روابط المعايير صلات بالدليل وليست تقييمًا للانطباق القانوني. تحقّق من قرارات مكان العمل بالرجوع إلى الإرشادات المعتمدة." })}</p>
  </article>;
}

const SOURCE_FIELDS: readonly [keyof Pick<OccupationalHealthRecord, "hazardDisease" | "type" | "definition" | "targetOrganSystem" | "mainConsequences" | "exposureTransmission" | "highRiskOccupationsWorkplace">, BilingualText][] = [
  ["hazardDisease", { en: "Hazard / Disease", ar: "الخطر / المرض" }], ["type", { en: "Type", ar: "النوع" }], ["definition", { en: "Definition", ar: "التعريف" }], ["targetOrganSystem", { en: "Target Organ / System", ar: "العضو / الجهاز المستهدف" }], ["mainConsequences", { en: "Main Consequences", ar: "الآثار الرئيسية" }], ["exposureTransmission", { en: "Exposure / Transmission", ar: "التعرض / الانتقال" }], ["highRiskOccupationsWorkplace", { en: "High-Risk Occupations / Workplace", ar: "المهن / أماكن العمل عالية الخطورة" }],
];

function SourceHazardTable({ initialSearch, language }: { initialSearch: string; language: ExplorerLanguage }) {
  const [subcategoryId, setSubcategoryId] = useState<string | null>("toxicological");
  const [search, setSearch] = useState(initialSearch);
  const records = filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId: "occupational-health", subcategoryId, query: search }).flatMap((record) => record.visualization.kind === "body-system" ? [record.visualization.occupationalHealth] : []);
  return <div className="hazard-table-panel">
    <p className="hazard-table-intro"><Bilingual text={{ en: "The original seven source fields, unchanged. Table filters do not replace your explorer selection.", ar: "حقول المصدر السبعة الأصلية دون تغيير. لا تغيّر تصفية الجدول اختيارك في المستكشف." }} language={language} /></p>
    <Subcategories categoryId="occupational-health" selected={subcategoryId} onSelect={setSubcategoryId} language={language} />
    <div className="resource-filters single"><label><Search size={16} aria-hidden="true" /><input aria-label={language === "ar" ? "البحث في جدول المصدر" : "Search source table"} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={language === "ar" ? "ابحث في سجلات المصدر…" : "Search source records…"} /></label></div>
    {/* Keyboard focus is necessary to scroll the source table without a pointer. */}
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
    <div className="hazard-table-wrap" tabIndex={0} role="region" aria-label={language === "ar" ? "جدول المصدر القابل للتمرير" : "Scrollable source table"}><table className="hazard-table"><thead><tr>{SOURCE_FIELDS.map(([key, label]) => <th scope="col" key={key}><Bilingual text={label} language={language} /></th>)}</tr></thead><tbody>{records.map((record) => <tr key={record.id}>{SOURCE_FIELDS.map(([key]) => <td key={key}><Bilingual text={record[key]} language={language} /></td>)}</tr>)}</tbody></table></div>
    <div className="hazard-mobile-list">{records.map((record) => <details key={record.id}><summary><Bilingual text={record.hazardDisease} language={language} /></summary><div>{SOURCE_FIELDS.slice(1).map(([key, label]) => <p key={key}><strong><Bilingual text={label} language={language} /></strong><Bilingual text={record[key]} language={language} /></p>)}</div></details>)}</div>
    {!records.length && <p role="status"><Bilingual text={{ en: "No source records match this search.", ar: "لا توجد سجلات مصدر تطابق البحث." }} language={language} /></p>}
  </div>;
}
