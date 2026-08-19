"use client";

import { BookOpenCheck, Calculator, Check, ChevronLeft, ChevronRight, CircleHelp, FlaskConical, Languages, Layers3, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { HAZARD_COUNTS, HAZARD_RECORDS, type HazardRecord } from "./hazardData";
import { nextFlashcardProgress, type FlashcardRating, type LearningProgress } from "./learningProgress";
import { BCSP_FREQUENTLY_USED_FORMULA_IDS, FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";
import { HazardSystemModel } from "./VisualLearningPanel";
import { BODY_SYSTEMS, getHazardBodySystems, type BodySystemId } from "./visualLearning";

type LibraryTab = "flashcards" | "formulas" | "hazards";

export default function StudyLibrary({ progress, onProgress }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void }) {
  const [tab, setTab] = useState<LibraryTab>("flashcards");
  return (
    <main className="resource-page library-page">
      <section className="library-hero page-width"><div><p className="eyebrow"><BookOpenCheck size={16} /> Study library</p><h1>Retrieve. Apply. Space the review.</h1><p>Use flashcards for recurring recall, the formula library for structured problem solving, and bilingual hazard tables for occupational-health review.</p></div><div className="library-hero-stat"><strong>{FLASHCARDS.length + FORMULA_ENTRIES.length + HAZARD_RECORDS.length}</strong><span>reference records</span></div></section>
      <nav className="library-tabs page-width" aria-label="Study library tabs"><button className={tab === "flashcards" ? "active" : ""} onClick={() => setTab("flashcards")}><Layers3 size={17} /> Flashcards</button><button className={tab === "formulas" ? "active" : ""} onClick={() => setTab("formulas")}><Calculator size={17} /> Formula sheet</button><button className={tab === "hazards" ? "active" : ""} onClick={() => setTab("hazards")}><FlaskConical size={17} /> Hazards</button></nav>
      {tab === "flashcards" && <Flashcards progress={progress} onProgress={onProgress} />}
      {tab === "formulas" && <FormulaLibrary />}
      {tab === "hazards" && <HazardsLibrary />}
    </main>
  );
}

function Flashcards({ progress, onProgress }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void }) {
  const [deck, setDeck] = useState("all");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewNow] = useState(() => Date.now());
  const decks = ["all", ...new Set(FLASHCARDS.map((card) => card.deck))];
  const filtered = FLASHCARDS.filter((card) => deck === "all" || card.deck === deck);
  const due = filtered.filter((card) => (progress.flashcards[card.id]?.dueAt ?? 0) <= reviewNow);
  const queue = due.length ? due : filtered;
  const card = queue[index % Math.max(1, queue.length)];
  const mastered = filtered.filter((item) => (progress.flashcards[item.id]?.intervalDays ?? 0) >= 21).length;

  function rate(rating: FlashcardRating) {
    if (!card) return;
    onProgress({ ...progress, flashcards: { ...progress.flashcards, [card.id]: nextFlashcardProgress(progress.flashcards[card.id], rating) } });
    setRevealed(false);
    setIndex((value) => (value + 1) % Math.max(1, queue.length));
  }

  return <section className="page-width library-panel"><div className="library-toolbar"><div><p className="eyebrow"><Sparkles size={15} /> Spaced review</p><h2>Flashcard queue</h2></div><select value={deck} onChange={(event) => { setDeck(event.target.value); setIndex(0); setRevealed(false); }} aria-label="Filter flashcard deck">{decks.map((item) => <option value={item} key={item}>{item === "all" ? "All decks" : item}</option>)}</select></div><div className="flash-stats"><span><strong>{due.length}</strong> due now</span><span><strong>{filtered.length - due.length}</strong> scheduled</span><span><strong>{mastered}</strong> mastered</span></div>{card ? <div className="flashcard-stage"><button type="button" className={revealed ? "flashcard revealed" : "flashcard"} onClick={() => setRevealed(true)}><small>{card.deck}{card.chapterId ? ` · ${card.chapterId.toUpperCase()}` : ""}</small><h3>{revealed ? card.back : card.front}</h3><span>{revealed ? "Rate how well you recalled it" : "Click to reveal the answer"}</span></button><div className="flashcard-nav"><button className="secondary-button" onClick={() => { setIndex((value) => (value - 1 + queue.length) % queue.length); setRevealed(false); }}><ChevronLeft size={16} /> Previous</button><span>{index % queue.length + 1} / {queue.length}</span><button className="secondary-button" onClick={() => { setIndex((value) => (value + 1) % queue.length); setRevealed(false); }}>Next <ChevronRight size={16} /></button></div>{revealed && <div className="rating-row"><button onClick={() => rate("again")}><strong>Again</strong><span>10 min</span></button><button onClick={() => rate("hard")}><strong>Hard</strong><span>1 day+</span></button><button onClick={() => rate("good")}><strong>Good</strong><span>adaptive</span></button><button onClick={() => rate("easy")}><strong>Easy</strong><span>longer gap</span></button></div>}</div> : <div className="empty-state"><Check /><h3>No cards in this deck.</h3></div>}</section>;
}

function FormulaLibrary() {
  const PAGE_SIZE = 24;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [formulaSet, setFormulaSet] = useState<"all" | "frequent">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const frequentlyUsedIds = new Set<string>(BCSP_FREQUENTLY_USED_FORMULA_IDS);
  const categories = ["all", ...new Set(FORMULA_ENTRIES.map((entry) => entry.category))];
  const formulaSetEntries = formulaSet === "frequent" ? FORMULA_ENTRIES.filter((entry) => frequentlyUsedIds.has(entry.id)) : FORMULA_ENTRIES;
  const categoryCounts = Object.fromEntries(categories.map((item) => [item, item === "all" ? formulaSetEntries.length : formulaSetEntries.filter((entry) => entry.category === item).length]));
  const frequentlyUsedCount = FORMULA_ENTRIES.filter((entry) => frequentlyUsedIds.has(entry.id)).length;
  const normalizedSearch = search.trim().toLowerCase();
  const entries = formulaSetEntries.filter((entry) => {
    if (category !== "all" && entry.category !== category) return false;
    if (!normalizedSearch) return true;
    return [entry.name, entry.formula, entry.whenToUse, entry.variables.join(" "), entry.units, entry.commonError, entry.sourcePage].join(" ").toLowerCase().includes(normalizedSearch);
  });
  const visibleEntries = entries.slice(0, visibleCount);
  const remaining = Math.max(0, entries.length - visibleEntries.length);

  function changeSearch(value: string) {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }

  function changeCategory(value: string) {
    setCategory(value);
    setVisibleCount(PAGE_SIZE);
  }

  function changeFormulaSet(value: "all" | "frequent") {
    setFormulaSet(value);
    setVisibleCount(PAGE_SIZE);
  }
  return <section className="page-width library-panel">
    <div className="library-toolbar">
      <div><p className="eyebrow"><Calculator size={15} /> Smart formula sheet</p><h2>Search by problem, not page</h2></div>
      <span>{entries.length} filtered · {FORMULA_ENTRIES.length} total</span>
    </div>
    <div className="resource-filters">
      <label><Search size={16} /><input value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Search name, equation, variable, unit, use, or source" /></label>
      <select value={category} onChange={(event) => changeCategory(event.target.value)} aria-label="Filter formula category">
        {categories.map((item) => <option value={item} key={item}>{item === "all" ? "All categories" : item} ({categoryCounts[item]})</option>)}
      </select>
      <select value={formulaSet} onChange={(event) => changeFormulaSet(event.target.value as "all" | "frequent")} aria-label="Filter formula set">
        <option value="all">All formulas ({FORMULA_ENTRIES.length})</option>
        <option value="frequent">Equations most often used on BCSP exams ({frequentlyUsedCount})</option>
      </select>
    </div>
    {entries.length ? <>
      <div className="formula-grid">{visibleEntries.map((entry) => <details className="formula-card" key={entry.id}><summary><div><small>{entry.category}{frequentlyUsedIds.has(entry.id) ? " · Most often used" : ""}</small><h3>{entry.name}</h3></div><span className="formula-expression">{entry.formula}</span></summary><div className="formula-body"><p><strong>Use it when:</strong> {entry.whenToUse}</p><p><strong>Variables:</strong> {entry.variables.join(" · ")}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Common error:</strong> {entry.commonError}</p><div className="worked-example"><span>Worked example</span><p>{entry.workedExample}</p></div><small>Source reference: {entry.sourcePage}</small></div></details>)}</div>
      {remaining > 0 && <div className="flashcard-nav" aria-label="Formula results controls">
        <button className="secondary-button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, remaining)} more</button>
        <span>Showing {visibleEntries.length} of {entries.length}</span>
        <button className="secondary-button" onClick={() => setVisibleCount(entries.length)}>Show all</button>
      </div>}
    </> : <div className="empty-state"><Search size={22} /><h3>No formulas match those filters.</h3><p>Try a different term or select another category.</p></div>}
    <p className="reference-note"><CircleHelp size={15} /> Complete coverage includes 104 deduplicated equation, conversion, and constant families from the supplied 23-page ASP formula sheet, plus 2 clearly marked Yates supplemental cards. Six lookup tables and charts were visually reviewed but are intentionally not counted as formulas. The 47 printed equations in “Equations Most Often Used on BCSP Exams” on pp. 12–23 map to 44 deduplicated cards. This is the supplied study-sheet label, not a guarantee of current exam frequency.</p>
  </section>;
}

function HazardsLibrary() {
  const [mode, setMode] = useState<"explore" | "table">("explore");
  return <section className="page-width library-panel">
    <div className="library-toolbar">
      <div><p className="eyebrow"><FlaskConical size={15} /> Occupational health reference</p><h2>See where hazards can act</h2></div>
      <span>Built from {HAZARD_COUNTS.total} bilingual table records</span>
    </div>
    <div className="hazard-view-switches" role="group" aria-label="Hazard library view">
      <button className={mode === "explore" ? "active" : ""} onClick={() => setMode("explore")}>Body-system explorer</button>
      <button className={mode === "table" ? "active" : ""} onClick={() => setMode("table")}>Source data table</button>
    </div>
    {mode === "explore" ? <HazardExplorer /> : <HazardTable />}
  </section>;
}

function HazardExplorer() {
  const [category, setCategory] = useState<HazardRecord["category"]>("toxicological");
  const [language, setLanguage] = useState<"both" | "en" | "ar">("both");
  const [search, setSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId>("lungs");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const records = HAZARD_RECORDS.filter((record) => record.category === category && JSON.stringify(record).toLowerCase().includes(search.toLowerCase()));
  const activeSystems = [...new Set(records.flatMap((record) => getHazardBodySystems(record.id)))];
  const visibleRecords = records.filter((record) => getHazardBodySystems(record.id).includes(selectedSystem));
  const selectedRecord = visibleRecords.find((record) => record.id === selectedRecordId) ?? visibleRecords[0];
  const renderText = (text: { en: string; ar: string }) => <>{language !== "ar" && <span lang="en">{text.en}</span>}{language === "both" && <i />}{language !== "en" && <span lang="ar" dir="rtl">{text.ar}</span>}</>;
  const selectCategory = (next: HazardRecord["category"]) => { setCategory(next); setSelectedSystem("lungs"); setSelectedRecordId(null); };
  const chooseSystem = (system: BodySystemId) => { setSelectedSystem(system); setSelectedRecordId(null); };

  return <div className="hazard-explorer-panel">
    <div className="hazard-switches">
      <div><button className={category === "toxicological" ? "active" : ""} onClick={() => selectCategory("toxicological")}>Toxic substances ({HAZARD_COUNTS.toxicological})</button><button className={category === "biological" ? "active" : ""} onClick={() => selectCategory("biological")}>Biological hazards ({HAZARD_COUNTS.biological})</button></div>
      <div><Languages size={16} /><button className={language === "both" ? "active" : ""} onClick={() => setLanguage("both")}>Both</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button><button className={language === "ar" ? "active" : ""} onClick={() => setLanguage("ar")}>العربية</button></div>
    </div>
    <div className="resource-filters single"><label><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedRecordId(null); }} placeholder="Search hazard, consequence, route, or occupation" /></label></div>
    <p className="hazard-explorer-intro">Choose a body system, drag the study model to inspect it, then select an affected hazard. The detail panel stays linked to the original bilingual table record.</p>
    <div className="hazard-explorer">
      <aside className="hazard-record-rail" aria-label="Hazard records">
        <div className="hazard-rail-heading"><span>{BODY_SYSTEMS.find((system) => system.id === selectedSystem)?.label}</span><b>{visibleRecords.length}</b></div>
        <div className="hazard-record-list">
          {visibleRecords.map((record) => <button className={selectedRecord?.id === record.id ? "active" : ""} type="button" onClick={() => setSelectedRecordId(record.id)} key={record.id}><span className="hazard-record-dot" /> <span><strong>{record.hazardDisease.en}</strong>{language !== "en" && <small lang="ar" dir="rtl">{record.hazardDisease.ar}</small>}</span></button>)}
          {!visibleRecords.length && <p className="hazard-empty">No records match this body system and search.</p>}
        </div>
      </aside>
      <HazardSystemModel activeSystems={activeSystems} selectedSystem={selectedSystem} onSelect={chooseSystem} />
      <article className="hazard-detail-card">
        {selectedRecord ? <>
          <div className="hazard-detail-kicker"><span>{selectedRecord.category === "biological" ? "Biological hazard" : "Toxicological hazard"}</span><small>Source row {selectedRecord.sourceRow}</small></div>
          <h3>{renderText(selectedRecord.hazardDisease)}</h3>
          <div className="hazard-system-chips">{getHazardBodySystems(selectedRecord.id).map((systemId) => { const system = BODY_SYSTEMS.find((item) => item.id === systemId)!; return <button key={systemId} type="button" onClick={() => chooseSystem(systemId)}><i style={{ background: system.color }} />{system.label}</button>; })}</div>
          <dl>
            <div><dt>Target organ / system</dt><dd>{renderText(selectedRecord.targetOrganSystem)}</dd></div>
            <div><dt>Main consequences</dt><dd>{renderText(selectedRecord.mainConsequences)}</dd></div>
            <div><dt>Exposure / transmission</dt><dd>{renderText(selectedRecord.exposureTransmission)}</dd></div>
            <div><dt>High-risk work</dt><dd>{renderText(selectedRecord.highRiskOccupationsWorkplace)}</dd></div>
          </dl>
          <p className="hazard-detail-disclaimer"><CircleHelp size={14} /> Study summary only — verify workplace actions against current SDSs, site procedures, and authoritative guidance.</p>
        </> : <div className="hazard-detail-empty"><FlaskConical size={24} /><h3>No matching record</h3><p>Try another body system or clear the search term.</p></div>}
      </article>
    </div>
  </div>;
}

function HazardTable() {
  const [category, setCategory] = useState<HazardRecord["category"]>("toxicological");
  const [language, setLanguage] = useState<"both" | "en" | "ar">("both");
  const [search, setSearch] = useState("");
  const fields: Array<[keyof Pick<HazardRecord, "hazardDisease" | "type" | "definition" | "targetOrganSystem" | "mainConsequences" | "exposureTransmission" | "highRiskOccupationsWorkplace">, string]> = [["hazardDisease", "Hazard / Disease"], ["type", "Type"], ["definition", "Definition"], ["targetOrganSystem", "Target Organ / System"], ["mainConsequences", "Main Consequences"], ["exposureTransmission", "Exposure / Transmission"], ["highRiskOccupationsWorkplace", "High-Risk Occupations / Workplace"]];
  const records = HAZARD_RECORDS.filter((record) => record.category === category && JSON.stringify(record).toLowerCase().includes(search.toLowerCase()));
  const renderText = (text: { en: string; ar: string }) => <>{language !== "ar" && <span lang="en">{text.en}</span>}{language === "both" && <i />}{language !== "en" && <span lang="ar" dir="rtl">{text.ar}</span>}</>;
  return <div className="hazard-table-panel">
    <p className="hazard-table-intro">Use the table when you want the original source fields side by side. The explorer preserves the same records while making target systems easier to compare.</p>
    <div className="hazard-switches"><div><button className={category === "toxicological" ? "active" : ""} onClick={() => setCategory("toxicological")}>Toxic substances ({HAZARD_COUNTS.toxicological})</button><button className={category === "biological" ? "active" : ""} onClick={() => setCategory("biological")}>Biological hazards ({HAZARD_COUNTS.biological})</button></div><div><Languages size={16} /><button className={language === "both" ? "active" : ""} onClick={() => setLanguage("both")}>Both</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button><button className={language === "ar" ? "active" : ""} onClick={() => setLanguage("ar")}>العربية</button></div></div>
    <div className="resource-filters single"><label><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hazard, consequence, route, or occupation" /></label></div>
    <div className="hazard-table-wrap"><table className="hazard-table"><thead><tr>{fields.map(([, label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{records.map((record) => <tr key={record.id}>{fields.map(([field]) => <td key={field}>{renderText(record[field])}</td>)}</tr>)}</tbody></table></div>
    <div className="hazard-mobile-list">{records.map((record) => <details key={record.id}><summary>{renderText(record.hazardDisease)}</summary><div>{fields.slice(1).map(([field, label]) => <p key={field}><strong>{label}</strong>{renderText(record[field])}</p>)}</div></details>)}</div>
    <p className="reference-note"><CircleHelp size={15} /> Study summaries based on the supplied workbook rows. They are not medical advice; verify workplace decisions against current authoritative guidance.</p>
  </div>;
}
