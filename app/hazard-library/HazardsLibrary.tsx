"use client";

import { ArrowRight, Bookmark, BookOpen, Target, ChevronRight, CircleHelp, FlaskConical, Grid2X2, NotebookPen, Search } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BookmarkAction } from "../StudySystem";
import { Bilingual } from "../body-explorer/Bilingual";
import { ANATOMY_REGIONS } from "../body-explorer/anatomyGeometry";
import { BODY_SYSTEM_BY_ID, type BodySystemId } from "../bodySystems";
import { HAZARD_CATEGORIES, HAZARD_CATEGORY_BY_ID, HAZARD_NAVIGATION, hazardSubcategoryName, type HazardCategoryId, type HazardCategorySelection } from "../hazardCategories";
import { filterHazards, type ExplorerLanguage } from "../hazardExplorer";
import { HAZARD_LIBRARY_BY_ID, HAZARD_LIBRARY_RECORDS, HIDDEN_LEGACY_HAZARD_RECORDS } from "../hazardLibraryData";
import { CONTROL_LEVELS, type HazardRecord, type HazardResourceOpener, type SceneOverlay } from "../hazardTypes";
import type { BilingualText, OccupationalHealthRecord } from "../hazardData";
import type { StudySystemState } from "../studySystemState";
import { HazardCategoryNavigation, hazardCategoryCounts } from "./HazardCategoryNavigation";
import { HazardIcon } from "./hazardIcons";
import { HazardControls } from "./HazardControls";
import { canonicalHazardId } from "../hazardAliases";
import { HazardVisualization } from "./HazardVisualization";
import "./hazard-library.css";
import "./hazard-premium.css";

type Props = { initialSearch?: string; initialItemId?: string; requestKey?: number; system: StudySystemState; onSystem: (system: StudySystemState) => void; onOpen: HazardResourceOpener; syncRoute?: boolean; onNotebook?: () => void; onLanguageChange?: (language: ExplorerLanguage) => void };
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

export function HazardsLibrary({ initialSearch = "", initialItemId, system, onSystem, onOpen, syncRoute = false, onNotebook, onLanguageChange }: Props) {
  const [routeParams] = useState(() => new URLSearchParams(syncRoute && typeof window !== "undefined" ? window.location.search : ""));
  const [initialRecord] = useState(() => (initialItemId ? HAZARD_LIBRARY_BY_ID[initialItemId] : undefined) ?? (initialSearch ? filterHazards(HAZARD_LIBRARY_RECORDS, { query: initialSearch })[0] : undefined));
  const [legacyOpen, setLegacyOpen] = useState(Boolean(initialRecord && HIDDEN_LEGACY_HAZARD_RECORDS.includes(initialRecord)));
  const [categoryId, setCategoryId] = useState<HazardCategorySelection>(() => {
    const requested = routeParams.get("category");
    return requested === "all" || (requested && Object.hasOwn(HAZARD_CATEGORY_BY_ID, requested)) ? requested as HazardCategorySelection : initialRecord?.categoryId ?? "occupational-health";
  });
  const [subcategoryId, setSubcategoryId] = useState<string | null>(() => routeParams.has("subcategory") ? routeParams.get("subcategory") || null : legacyOpen ? null : initialRecord ? initialRecord.subcategoryId : routeParams.has("category") ? null : HAZARD_CATEGORY_BY_ID["occupational-health"].defaultSubcategoryId ?? null);
  const [language, setLanguage] = useState<ExplorerLanguage>(() => routeParams.get("lang") === "ar" ? "ar" : routeParams.get("lang") === "en" ? "en" : "both");
  useEffect(() => { onLanguageChange?.(language); }, [language, onLanguageChange]);
  const [mode, setMode] = useState<"explore" | "table">("explore");
  const [search, setSearch] = useState(initialItemId && initialRecord ? routeParams.get("q") ?? "" : initialSearch);
  const [categorySearch, setCategorySearch] = useState(routeParams.get("filter") ?? "");
  const [overview, setOverview] = useState(syncRoute && !initialRecord && !initialSearch && !routeParams.has("category"));
  const [savedOnly, setSavedOnly] = useState(routeParams.get("saved") === "1");
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(initialRecord?.id ?? null);
  const [sceneSelection, setSceneSelection] = useState<{ recordId: string; overlayId: string } | null>(null);
  const routeInitialized = useRef(false);
  const lastQuery = useRef(`${search}\0${categorySearch}`);
  const category = categoryId === "all" ? undefined : HAZARD_CATEGORY_BY_ID[categoryId];
  const categoryTotal = categoryId === "all" ? HAZARD_LIBRARY_RECORDS.length : hazardCategoryCounts[categoryId];
  const savedIds = new Set(Object.values(system.notebook).filter(entry => entry.kind === "hazard").map(entry => canonicalHazardId(entry.id.replace(/^hazard:/, ""))));
  const visibleRecords = filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId, subcategoryId, query: search || categorySearch, systemId: selectedSystem }).filter(record => !savedOnly || savedIds.has(record.id));
  const selectedRecord = legacyOpen ? initialRecord : visibleRecords.find(record => record.id === selectedRecordId) ?? visibleRecords[0];
  const selectedOverlay = selectedRecord?.visualization.kind !== "body-system" && selectedRecord?.visualization.status === "implemented" && sceneSelection?.recordId === selectedRecord.id
    ? selectedRecord.visualization.overlays.find(overlay => overlay.id === sceneSelection.overlayId) : undefined;

  useEffect(() => {
    if (!syncRoute) return;
    const url = new URL(window.location.href);
    if (url.pathname !== "/hazards") return;
    const params = new URLSearchParams();
    if (!overview) {
      params.set("category", categoryId);
      params.set("subcategory", subcategoryId ?? "");
      if (selectedRecord) params.set("hazard", selectedRecord.id);
    }
    if (search) params.set("q", search);
    if (categorySearch) params.set("filter", categorySearch);
    if (savedOnly) params.set("saved", "1");
    if (language !== "both") params.set("lang", language);
    const href = "/hazards" + (params.size ? "?" + params : "");
    if (href !== url.pathname + url.search) {
      const replace = !routeInitialized.current || lastQuery.current !== `${search}\0${categorySearch}`;
      window.history[replace ? "replaceState" : "pushState"]({ ...window.history.state, coachTarget: null }, "", href);
    }
    routeInitialized.current = true;
    lastQuery.current = `${search}\0${categorySearch}`;
  }, [syncRoute, overview, categoryId, subcategoryId, selectedRecord, search, categorySearch, savedOnly, language]);

  const selectCategory = (next: HazardCategorySelection) => {
    setLegacyOpen(false); setOverview(false); setSearch(""); setCategorySearch("");
    setCategoryId(next); setSubcategoryId(next === "all" ? null : HAZARD_CATEGORY_BY_ID[next].defaultSubcategoryId ?? null);
    setSelectedSystem(null); setSelectedRecordId(null); setSceneSelection(null); setMode("explore");
  };
  const selectRecord = (id: string) => { setLegacyOpen(false); setSelectedRecordId(id); setSceneSelection(null); };
  const chooseSystem = (id: BodySystemId) => { setSelectedSystem(current => current === id ? null : id); setSelectedRecordId(null); };
  const clearFilters = () => { setSearch(""); setCategorySearch(""); setSubcategoryId(null); setSavedOnly(false); setSelectedSystem(null); setSelectedRecordId(null); };
  const railName = selectedSystem ? BODY_SYSTEM_BY_ID[selectedSystem].text : categoryName(categoryId);
  const text = (value: BilingualText) => <Bilingual text={value} language={language} />;
  const subcategories = categoryId !== "all" && <Subcategories categoryId={categoryId} selected={subcategoryId} language={language} onSelect={id => { setLegacyOpen(false); setSubcategoryId(id); setSelectedSystem(null); setSelectedRecordId(null); setSceneSelection(null); }} />;
  const recordKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const rows = [...event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>("[data-hazard-id]")];
    const index = rows.indexOf(event.currentTarget as HTMLButtonElement);
    event.preventDefault();
    rows[event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length]?.focus();
  };

  return <section className="page-width library-panel hazards-library-panel hazard-library-v2 hazard-premium" data-language={language} dir={language === "ar" ? "rtl" : "ltr"}>
    <header className="hazard-toolbar">
      <div className="hazard-product-title"><h1>{text({ en: "Hazard Library", ar: "مكتبة المخاطر" })}</h1><p>{text({ en: "Explore workplace hazards", ar: "استكشف مخاطر مكان العمل" })}</p></div>
      <label className="hazard-global-search"><Search size={19} aria-hidden="true" /><span className="sr-only">{text({ en: "Search hazards", ar: "البحث في المخاطر" })}</span><input aria-label={language === "ar" ? "البحث في المخاطر" : "Search hazards"} value={search} onChange={event => { setSearch(event.target.value); setCategoryId("all"); setSubcategoryId(null); setCategorySearch(""); setOverview(false); setLegacyOpen(false); setSelectedSystem(null); setSelectedRecordId(null); setSceneSelection(null); setMode("explore"); }} placeholder={language === "ar" ? `ابحث في جميع المخاطر (${HAZARD_LIBRARY_RECORDS.length})…` : `Search all ${HAZARD_LIBRARY_RECORDS.length} hazards…`} /></label>
      <div className="hazard-toolbar-actions">
        <button type="button" className="hazard-toolbar-button" aria-pressed={overview} onClick={() => { setOverview(!overview); setSearch(""); setMode("explore"); }}><Grid2X2 size={16} aria-hidden="true" />{language === "ar" ? "الفئات" : "Categories"}</button>
        <button type="button" className="hazard-toolbar-button" aria-pressed={savedOnly} onClick={() => { setSavedOnly(!savedOnly); setOverview(false); setCategoryId("all"); setSubcategoryId(null); setSearch(""); setCategorySearch(""); setLegacyOpen(false); setSelectedSystem(null); }}><Bookmark size={16} aria-hidden="true" />{language === "ar" ? "المحفوظ" : "Saved"}<span>{savedIds.size}</span></button>
        <div className="hazard-language-switch" role="group" aria-label={language === "ar" ? "لغة العرض" : "Display language"}>{([{ id: "both", name: "Both" }, { id: "en", name: "English" }, { id: "ar", name: "العربية" }] as const).map(item => <button type="button" key={item.id} aria-pressed={language === item.id} onClick={() => setLanguage(item.id)}>{item.name}</button>)}</div>
      </div>
    </header>
    {overview ? <section className="hazard-overview" aria-label={language === "ar" ? "نظرة عامة على الفئات" : "Hazard category overview"}>
      <div className="hazard-overview-heading"><div><p>{text({ en: `${HAZARD_LIBRARY_RECORDS.length} hazards · ${HAZARD_CATEGORIES.length} categories`, ar: `${HAZARD_LIBRARY_RECORDS.length} خطرًا · ${HAZARD_CATEGORIES.length} فئة` })}</p><h2>{text({ en: "Start with the hazard.", ar: "ابدأ بالخطر." })}</h2><p>{text({ en: "Explore the scene. Understand the risk. Learn the controls.", ar: "استكشف المشهد. افهم الخطر. تعلّم الضوابط." })}</p></div><button type="button" className="secondary-button" onClick={() => selectCategory("all")}>{text(HAZARD_NAVIGATION.all)}<ArrowRight size={16} aria-hidden="true" /></button></div>
      <div className="hazard-category-grid">{HAZARD_CATEGORIES.map(item => <button type="button" key={item.id} data-overview-category={item.id} onClick={() => selectCategory(item.id)}><HazardIcon categoryId={item.id} size={34} /><strong>{text(item.name)}</strong><span>{text({ en: `${hazardCategoryCounts[item.id]} hazards`, ar: `${hazardCategoryCounts[item.id]} خطرًا` })}</span><ArrowRight size={16} aria-hidden="true" /></button>)}</div>
    </section> : <>
    <HazardCategoryNavigation selected={categoryId} onSelect={selectCategory} language={language} />
    <details className="hazard-compact-filters"><summary>{text({en:`${subcategoryId ? hazardSubcategoryName(categoryId as HazardCategoryId,subcategoryId)?.en ?? railName.en : railName.en} · ${visibleRecords.length} of ${categoryTotal}`,ar:`${subcategoryId ? hazardSubcategoryName(categoryId as HazardCategoryId,subcategoryId)?.ar ?? railName.ar : railName.ar} · ${visibleRecords.length} من ${categoryTotal}`})}<span>{text({en:"Change filters",ar:"تغيير التصفية"})}</span></summary><div>
      <label>{text({en:"Category",ar:"الفئة"})}<select value={categoryId} onChange={event=>selectCategory(event.target.value as HazardCategorySelection)}>{[{id:"all",name:HAZARD_NAVIGATION.all},...HAZARD_CATEGORIES].map(item=><option key={item.id} value={item.id}>{language==="ar"?item.name.ar:language==="both"?`${item.name.en} — ${item.name.ar}`:item.name.en}</option>)}</select></label>
      {category && <label>{text({en:"Subcategory",ar:"الفئة الفرعية"})}<select value={subcategoryId??""} onChange={event=>{setSubcategoryId(event.target.value||null);setSelectedSystem(null);setSelectedRecordId(null);setSceneSelection(null);}}><option value="">{language==="ar"?"كل الفئة":"All in category"}</option>{category.subcategories.map(item=><option key={item.id} value={item.id}>{language==="ar"?item.name.ar:language==="both"?`${item.name.en} — ${item.name.ar}`:item.name.en}</option>)}</select></label>}
      <button className="secondary-button" type="button" onClick={clearFilters}>{text({en:"Clear filters",ar:"مسح التصفية"})}</button>
    </div></details>
    {legacyOpen && <div className="hazard-reference-notice" role="status">{text({ en: "Saved legacy reference: Radiation Exposure. This broad educational record is preserved for your notes and is not one of the canonical radiation subtypes.", ar: "مرجع قديم محفوظ: التعرض للإشعاع. حُفظ هذا السجل التعليمي العام لملاحظاتك، ولا يمثل أحد الأنواع الفرعية المعتمدة للإشعاع." })}<button type="button" className="secondary-button" onClick={() => selectCategory("radiation")}>{text({ en: "Browse radiation hazards", ar: "تصفح مخاطر الإشعاع" })}</button></div>}
    {category?.sourceTable && <div className="hazard-view-switches" role="group" aria-label="Hazard library view">
      <button type="button" aria-pressed={mode === "explore"} aria-label={language === "ar" ? "مستكشف أجهزة الجسم" : "Body-system explorer"} className={mode === "explore" ? "active" : ""} onClick={() => setMode("explore")}>{text({ en: "Body-system explorer", ar: "مستكشف أجهزة الجسم" })}</button>
      <button type="button" aria-pressed={mode === "table"} aria-label={language === "ar" ? "جدول بيانات المصدر" : "Source data table"} className={mode === "table" ? "active" : ""} onClick={() => setMode("table")}>{text({ en: "Source data table", ar: "جدول بيانات المصدر" })}</button>
    </div>}
    <div hidden={mode !== "explore"}>
      <div className="hazard-result-status sr-only" role="status" aria-live="polite">{text({ en: `${visibleRecords.length} records in ${categoryName(categoryId).en}`, ar: `${visibleRecords.length} سجلًا في ${categoryName(categoryId).ar}` })}</div>
      <div className="hazard-explorer">
        <aside className="hazard-record-rail" aria-label={language === "ar" ? "مستكشف المخاطر" : "Hazard records"}>
          <div className="hazard-rail-heading"><div><h2>{text(railName)}</h2><small>{text({ en: visibleRecords.length === categoryTotal ? `${categoryTotal} hazards` : `${visibleRecords.length} of ${categoryTotal} hazards`, ar: visibleRecords.length === categoryTotal ? `${categoryTotal} خطرًا` : `${visibleRecords.length} من ${categoryTotal} خطرًا` })}</small></div><HazardIcon categoryId={categoryId} size={23} /></div>
          {subcategories}
          <label className="hazard-category-search"><Search size={15} aria-hidden="true" /><input aria-label={language === "ar" ? "البحث في هذه الفئة" : "Search this category"} value={categorySearch} onChange={event => { setCategorySearch(event.target.value); setSearch(""); setSelectedSystem(null); setSceneSelection(null); setSelectedRecordId(null); }} placeholder={language === "ar" ? "ابحث في هذه الفئة…" : "Search this category…"} /></label>
          <label className="hazard-mobile-selector"><span>{text({ en: "Choose a hazard", ar: "اختر خطرًا" })}</span><select value={selectedRecord?.id ?? ""} onChange={event => selectRecord(event.target.value)}>{!visibleRecords.length && <option value="">{language === "ar" ? "لا توجد نتائج" : "No matching hazards"}</option>}{visibleRecords.map(record => <option key={record.id} value={record.id}>{language === "ar" ? record.name.ar : language === "both" ? `${record.name.en} — ${record.name.ar}` : record.name.en}</option>)}</select></label>
          <div className="hazard-record-list">{visibleRecords.map(record => <button type="button" key={record.id} data-hazard-id={record.id} className={selectedRecord?.id === record.id ? "active" : ""} aria-pressed={selectedRecord?.id === record.id} onKeyDown={recordKeyboard} onClick={() => selectRecord(record.id)}><HazardIcon record={record} size={21} /><span>{text(record.name)}</span>{savedIds.has(record.id) && <Bookmark size={13} className="hazard-saved-indicator" aria-label={language === "ar" ? "محفوظ" : "Saved"} />}</button>)}</div>
          {!visibleRecords.length && <div className="hazard-empty"><p>{text({ en: "No records match these filters.", ar: "لا توجد سجلات تطابق هذه التصفية." })}</p><button type="button" onClick={clearFilters}>{text({ en: "Clear search and filter", ar: "مسح البحث والتصفية" })}</button></div>}
          <div className="hazard-rail-footer"><button type="button" onClick={clearFilters}>{text({ en: "Clear filters", ar: "مسح التصفية" })}</button>{onNotebook && <button type="button" onClick={onNotebook}><NotebookPen size={15} aria-hidden="true" />{text({ en: "Saved notes", ar: "الملاحظات المحفوظة" })}</button>}</div>
        </aside>
        <div className="hazard-visual-column">
          {selectedRecord && <div className="hazard-scene-title"><p className="hazard-breadcrumb">{text(HAZARD_CATEGORY_BY_ID[selectedRecord.categoryId].name)}<ChevronRight size={12} aria-hidden="true" />{text(hazardSubcategoryName(selectedRecord.categoryId, selectedRecord.subcategoryId) ?? HAZARD_CATEGORY_BY_ID[selectedRecord.categoryId].name)}</p><h2><HazardIcon record={selectedRecord} size={26} />{text(selectedRecord.name)}</h2></div>}
          <HazardVisualization record={selectedRecord} language={language} selectedSystem={selectedSystem} onSelectSystem={chooseSystem} onClearSystem={() => setSelectedSystem(null)} bodyContext={Boolean(category?.sourceTable || selectedSystem)} selectedOverlayId={selectedOverlay?.id ?? null} onSelectOverlay={id => setSceneSelection(id && selectedRecord ? { recordId: selectedRecord.id, overlayId: id } : null)} />
        </div>
        <HazardDetail selectedOverlay={selectedOverlay} record={selectedRecord} selectedSystem={selectedSystem} onSelectSystem={chooseSystem} language={language} system={system} onSystem={onSystem} onOpen={onOpen} />
      </div>
    </div>
    <div hidden={mode !== "table" || !category?.sourceTable}><SourceHazardTable initialSearch={initialSearch} language={language} /></div>
    </>}
  </section>;
}
function HazardDetail({ record, selectedOverlay, language, selectedSystem, onSelectSystem, system, onSystem, onOpen }: { record?: HazardRecord; selectedOverlay?: SceneOverlay; language: ExplorerLanguage; selectedSystem: BodySystemId | null; onSelectSystem: (id: BodySystemId) => void; system: StudySystemState; onSystem: (system: StudySystemState) => void; onOpen: HazardResourceOpener }) {
  const body = record?.visualization.kind === "body-system" ? record.visualization.occupationalHealth : undefined;
  const text = (value: BilingualText) => <Bilingual text={value} language={language} />;
  const field = (label: BilingualText, values: readonly BilingualText[]) => <div key={label.en}><dt>{text(label)}</dt><dd>{values.length ? values.map((value, index) => <p key={index}>{text(value)}</p>) : text({ en: "Not authored in this phase", ar: "لم يُعدّ في هذه المرحلة" })}</dd></div>;
  if (!record) return <article className="hazard-detail-card"><div className="hazard-detail-empty"><FlaskConical size={24} aria-hidden="true" /><h3>{text({ en: "No matching record", ar: "لا يوجد سجل مطابق" })}</h3><p>{text({ en: "Choose another category or clear the filters.", ar: "اختر فئة أخرى أو امسح التصفية." })}</p></div></article>;
  return <article className="hazard-detail-card">
    <div className="hazard-detail-kicker"><span>{text(HAZARD_CATEGORY_BY_ID[record.categoryId].name)}</span><small>{record.source.sourceRow ? text({ en: `Source row ${record.source.sourceRow}`, ar: `صف المصدر ${record.source.sourceRow}` }) : record.importMetadata ? <span dir="ltr">{record.id}</span> : text({ en: "Reference scene", ar: "مشهد مرجعي" })}</small></div>
    <div className="hazard-bookmark-heading"><h3>{text({en:"Hazard guide",ar:"دليل الخطر"})}<span className="sr-only"> · {text(record.name)}</span></h3><BookmarkAction kind="hazard" itemId={record.id} title={record.name.en} subtitle={record.consequences[0]?.en ?? record.summary.en} system={system} onChange={onSystem} labels={language === "ar" ? { save: "حفظ", saved: "محفوظ", saveLabel: `حفظ ${record.name.ar} في الدفتر`, removeLabel: `إزالة ${record.name.ar} من الدفتر` } : undefined} /></div>
    {body ? <div className="hazard-system-chips">{body.targets.map(({ systemId, role }) => <button key={systemId} type="button" onClick={() => onSelectSystem(systemId)} aria-pressed={selectedSystem === systemId}><i className={`body-legend-symbol is-${role}`} aria-hidden="true" style={{ background: role === "primary" ? ANATOMY_REGIONS[systemId].accent : undefined, borderColor: role === "secondary" ? ANATOMY_REGIONS[systemId].accent : undefined }} />{text(BODY_SYSTEM_BY_ID[systemId].text)}</button>)}</div> : null}
    {selectedOverlay && <section className="scene-selected-detail" data-role={selectedOverlay.role} data-semantic={selectedOverlay.semantic} data-selected-callout={selectedOverlay.id} aria-live="polite">
      <small>{text({ en: "Selected scene callout", ar: "تعليق المشهد المحدد" })}</small>
      <h4>{text(selectedOverlay.label)}</h4>{record.importMetadata && <small>{text({ en: "Scene context", ar: "سياق المشهد" })}</small>}<p>{text(selectedOverlay.description)}</p>
      {!!selectedOverlay.consequences?.length && <dl>{field({ en: "Related effects", ar: "الآثار المرتبطة" }, selectedOverlay.consequences)}</dl>}
      {selectedOverlay.controls && <dl>{CONTROL_LEVELS.filter((level) => selectedOverlay.controls?.[level.id]?.length).map((level) => field(level.name, selectedOverlay.controls?.[level.id] ?? []))}</dl>}
    </section>}
    <dl>
      {body && field({ en: "Target organ / system", ar: "العضو / الجهاز المستهدف" }, [body.targetOrganSystem])}
      {field({ en: "What is it?", ar: "ما هو الخطر؟" }, [record.summary])}
      {field({ en: "How does it happen?", ar: "كيف يحدث؟" }, record.mechanisms)}
      {field({ en: "What can happen?", ar: "ماذا يمكن أن يحدث؟" }, record.consequences)}
      {field({ en: "Where is the risk?", ar: "أين يكمن الخطر؟" }, record.highRiskWork)}
    </dl>
    {(!body || Object.values(record.controls).some(values => values.length)) && <HazardControls controls={record.controls} language={language} />}
    {!!record.workContextTags.length && <div className="hazard-work-tags">{record.workContextTags.map((tag) => <span key={tag.en}>{text(tag)}</span>)}</div>}
    {!!body?.mappingReview.length && <p className="body-review-note">{text({ en: "Mapping needs review. Original wording is preserved; see Exposure Route for details.", ar: "الربط يحتاج إلى مراجعة. النص الأصلي محفوظ؛ راجع مسار التعرض للتفاصيل." })}</p>}
    {record.standardReferences && <details className="hazard-standard-references"><summary>{text({ en: "Standard mapping status", ar: "حالة ربط المعايير" })}</summary><ul>{record.standardReferences.map((reference, index) => <li key={`${reference.number}-${index}`} data-standard-resolution={reference.resolution}><strong dir="ltr">{reference.number}</strong><span>{text(reference.resolution === "resolved" ? { en: "Resolved in catalog", ar: "مرتبط بالدليل" } : { en: "Unresolved — not in catalog", ar: "غير مرتبط — غير موجود بالدليل" })}</span><small dir="ltr">{reference.scope} · {reference.relation}</small></li>)}</ul></details>}
    <div className="hazard-crosslinks"><button type="button" className="secondary-button" aria-label={language === "ar" ? "معايير OSHA المرتبطة" : "Related OSHA standards"} onClick={() => onOpen("standards", record.name.en, { standardIds: record.relatedStandardIds })}><BookOpen size={17} aria-hidden="true" />{text({ en: "Related OSHA standards", ar: "معايير OSHA المرتبطة" })}</button><button type="button" className="secondary-button" aria-label={language === "ar" ? "تدريب مرتبط" : "Related Practice"} onClick={() => onOpen("practice", record.name.en, { practiceTags: record.relatedPracticeTags, practiceQuestionIds: record.relatedPracticeQuestionIds })}><Target size={17} aria-hidden="true" />{text({ en: "Related Practice", ar: "تدريب مرتبط" })}</button></div>
    {!record.relatedStandardIds.length && <p className="body-source-note">{text(record.importMetadata && !record.standardReferences?.length ? { en: "This dataset supplies no OSHA standard reference for this record. The link opens the existing catalog.", ar: "لا توفر هذه البيانات مرجع معيار OSHA لهذا السجل. يفتح الرابط الدليل الحالي." } : { en: "No standard IDs mapped yet. The link opens the existing standards catalog.", ar: "لم تُربط معرّفات المعايير بعد. يفتح الرابط دليل المعايير الحالي." })}</p>}
    {record.importMetadata && <details className="hazard-source-metadata"><summary>{text({ en: "Controlled source & provenance", ar: "المصدر المعتمد وبياناته" })}</summary><p>{text({ en: `Yates edition ${record.source.yatesEdition}`, ar: `ياتس، الطبعة ${record.source.yatesEdition}` })}</p><p dir="ltr">{record.source.yatesSection}</p><p>{text({ en: "Approximate source pages", ar: "صفحات المصدر التقريبية" })}: <b dir="ltr">{record.source.yatesPageRangeApprox}</b></p><p>{text({ en: "Yates support", ar: "دعم ياتس" })}: <strong dir="ltr" data-yates-support={record.source.yatesSupport}>{record.source.yatesSupport}</strong></p><p dir="ltr">{record.source.regulatoryVerification ?? record.source.oshaVerification}</p>{!!record.source.externalBasis?.length && <div><strong>{text({ en: "Additional source basis", ar: "أساس المصدر الإضافي" })}</strong>{record.source.externalBasis.map((basis, index) => <p key={index} dir="ltr">{basis}</p>)}</div>}<small dir="ltr">{record.importMetadata.packageVersion} · {record.importMetadata.contentStatus}</small></details>}
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
