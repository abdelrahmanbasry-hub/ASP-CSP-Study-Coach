"use client";

import { BookOpenCheck, Calculator, Check, ChevronLeft, ChevronRight, CircleHelp, FlaskConical, Languages, Layers3, Search, Settings2 } from "lucide-react";
import { useState } from "react";
import { HAZARD_COUNTS, HAZARD_RECORDS, type HazardRecord } from "./hazardData";
import { nextFlashcardProgress, type FlashcardRating, type LearningProgress } from "./learningProgress";
import { BCSP_FREQUENTLY_USED_FORMULA_IDS, FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";
import { HazardBodyMap } from "./VisualLearningPanel";
import { BODY_SYSTEMS, getHazardBodySystems, type BodySystemId } from "./visualLearning";

type LibraryTab = "flashcards" | "formulas" | "hazards";

export default function StudyLibrary({ progress, onProgress, initialTab = "flashcards" }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void; initialTab?: LibraryTab }) {
  const [tab, setTab] = useState<LibraryTab>(initialTab);
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
  const newCards = filtered.filter((item) => !progress.flashcards[item.id]).length;

  function rate(rating: FlashcardRating) {
    if (!card) return;
    onProgress({ ...progress, flashcards: { ...progress.flashcards, [card.id]: nextFlashcardProgress(progress.flashcards[card.id], rating) } });
    setRevealed(false);
    setIndex((value) => (value + 1) % Math.max(1, queue.length));
  }

  return <section className="page-width library-panel flashcards-panel">
    <div className="library-toolbar"><div><h2>Flashcards</h2><p>Spaced repetition to lock in critical knowledge.</p></div><button className="secondary-button"><Settings2 size={15} /> Study Settings</button></div>
    <div className="flashcard-filter-tabs"><select value={deck} onChange={(event) => { setDeck(event.target.value); setIndex(0); setRevealed(false); }} aria-label="Filter flashcard deck">{decks.map((item) => <option value={item} key={item}>{item === "all" ? "All Decks" : item}</option>)}</select><button className="active">Queue <span>{due.length}</span></button><button>Due <span>{due.length}</span></button><button>New <span>{newCards}</span></button><button>Learned <span>{mastered}</span></button></div>
    {card ? <div className="flashcards-workspace">
      <aside className="queue-summary"><span>Your Queue</span><strong>{queue.length}</strong><small>Cards to review</small><dl><div><dt>Due Today</dt><dd>{due.length}</dd></div><div><dt>New Cards</dt><dd>{newCards}</dd></div><div><dt>Learned</dt><dd>{mastered}</dd></div></dl></aside>
      <div className="flashcard-stage"><button type="button" className={revealed ? "flashcard revealed" : "flashcard"} onClick={() => setRevealed(true)}><small>{card.deck}{card.chapterId ? ` · ${card.chapterId.toUpperCase()}` : ""}</small><h3>{revealed ? card.back : card.front}</h3><span>{revealed ? "Rate how well you recalled it" : "Show Answer"}</span></button><div className="flashcard-nav"><button className="secondary-button" onClick={() => { setIndex((value) => (value - 1 + queue.length) % queue.length); setRevealed(false); }}><ChevronLeft size={16} /></button><span>{index % queue.length + 1} / {queue.length}</span><button className="secondary-button" onClick={() => { setIndex((value) => (value + 1) % queue.length); setRevealed(false); }}><ChevronRight size={16} /></button></div><div className="rating-row"><button disabled={!revealed} onClick={() => rate("again")}><strong>Again</strong><span>10 min</span></button><button disabled={!revealed} onClick={() => rate("hard")}><strong>Hard</strong><span>1 day+</span></button><button disabled={!revealed} onClick={() => rate("good")}><strong>Good</strong><span>adaptive</span></button><button disabled={!revealed} onClick={() => rate("easy")}><strong>Easy</strong><span>longer gap</span></button></div></div>
      <aside className="deck-list"><h3>Decks</h3>{decks.slice(1).map((item, deckIndex) => <button className={deck === item ? "active" : ""} onClick={() => { setDeck(item); setIndex(0); setRevealed(false); }} key={item}><span>{deckIndex + 1}</span><strong>{item}</strong><small>{FLASHCARDS.filter((flashcard) => flashcard.deck === item).length} cards</small></button>)}</aside>
    </div> : <div className="empty-state"><Check /><h3>No cards in this deck.</h3></div>}
  </section>;
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
      <div><h2>Formula Sheet</h2><p>Essential equations and problem-solvers.</p></div>
      <div className="formula-unit-control"><span>Units</span><strong>Source units</strong></div>
    </div>
    <div className="resource-filters">
      <label><Search size={16} /><input value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Search formulas, symbols, or use cases" /></label>
      <select value={formulaSet} onChange={(event) => changeFormulaSet(event.target.value as "all" | "frequent")} aria-label="Filter formula set">
        <option value="all">All formulas ({FORMULA_ENTRIES.length})</option>
        <option value="frequent">Equations most often used on BCSP exams ({frequentlyUsedCount})</option>
      </select>
    </div>
    <div className="formula-category-tabs">{categories.slice(0, 8).map((item) => <button className={category === item ? "active" : ""} onClick={() => changeCategory(item)} key={item}>{item === "all" ? "All" : item}<span>{categoryCounts[item]}</span></button>)}</div>
    {entries.length ? <>
      <div className="formula-grid">{visibleEntries.map((entry) => <details className="formula-card" key={entry.id}><summary><div><small>{entry.category}{frequentlyUsedIds.has(entry.id) ? " · Most often used" : ""}</small><h3>{entry.name}</h3></div><span className="formula-expression">{entry.formula}</span><small className="formula-symbol-preview">{entry.variables.slice(0, 2).join(" · ")}</small></summary><div className="formula-body"><p><strong>Use it when:</strong> {entry.whenToUse}</p><p><strong>Variables:</strong> {entry.variables.join(" · ")}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Common error:</strong> {entry.commonError}</p><div className="worked-example"><span>Worked example</span><p>{entry.workedExample}</p></div><small>Source reference: {entry.sourcePage}</small></div></details>)}</div>
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
      <div><p className="eyebrow"><FlaskConical size={15} /> Occupational health reference</p><h2>Hazard Atlas</h2><p>Explore source-backed hazards, their effects, and the work contexts in the imported library.</p></div>
      <span>Built from {HAZARD_COUNTS.total} bilingual table records</span>
    </div>
    <div className="hazard-category-overview"><div><FlaskConical /><strong>Toxicological</strong><span>{HAZARD_COUNTS.toxicological} records</span></div><div><Layers3 /><strong>Biological</strong><span>{HAZARD_COUNTS.biological} records</span></div><div className="future-slot"><CircleHelp /><strong>Advanced Atlas</strong><span>Data unavailable</span></div></div>
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
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const records = HAZARD_RECORDS.filter((record) => record.category === category && JSON.stringify(record).toLowerCase().includes(search.toLowerCase()));
  const activeSystems = [...new Set(records.flatMap((record) => getHazardBodySystems(record.id)))];
  const visibleRecords = selectedSystem ? records.filter((record) => getHazardBodySystems(record.id).includes(selectedSystem)) : records;
  const selectedRecord = visibleRecords.find((record) => record.id === selectedRecordId) ?? visibleRecords[0];
  const renderText = (text: { en: string; ar: string }) => <>{language !== "ar" && <span lang="en">{text.en}</span>}{language === "both" && <i />}{language !== "en" && <span lang="ar" dir="rtl">{text.ar}</span>}</>;
  const selectCategory = (next: HazardRecord["category"]) => { setCategory(next); setSelectedSystem(null); setSelectedRecordId(null); };
  const chooseSystem = (system: BodySystemId) => { setSelectedSystem((current) => current === system ? null : system); setSelectedRecordId(null); };

  return <div className="hazard-explorer-panel">
    <div className="hazard-switches">
      <div><button className={category === "toxicological" ? "active" : ""} onClick={() => selectCategory("toxicological")}>Toxic substances ({HAZARD_COUNTS.toxicological})</button><button className={category === "biological" ? "active" : ""} onClick={() => selectCategory("biological")}>Biological hazards ({HAZARD_COUNTS.biological})</button></div>
      <div><Languages size={16} /><button className={language === "both" ? "active" : ""} onClick={() => setLanguage("both")}>Both</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button><button className={language === "ar" ? "active" : ""} onClick={() => setLanguage("ar")}>العربية</button></div>
    </div>
    <div className="resource-filters single"><label><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedSystem(null); setSelectedRecordId(null); }} placeholder="Search hazard, consequence, route, or occupation" /></label></div>
    <p className="hazard-explorer-intro">Select a body-system marker to narrow the source table, then choose a record to connect the route of exposure, likely consequences, and work context.</p>
    <div className="hazard-explorer">
      <aside className="hazard-record-rail" aria-label="Hazard records">
        <div className="hazard-rail-heading"><span>{selectedSystem ? BODY_SYSTEMS.find((system) => system.id === selectedSystem)?.label : category === "biological" ? "Biological hazards" : "Toxic substances"}</span><b>{visibleRecords.length}</b></div>
        <div className="hazard-record-list">
          {visibleRecords.map((record) => <button className={selectedRecord?.id === record.id ? "active" : ""} type="button" onClick={() => setSelectedRecordId(record.id)} key={record.id}><span className="hazard-record-dot" /> <span><strong>{record.hazardDisease.en}</strong>{language !== "en" && <small lang="ar" dir="rtl">{record.hazardDisease.ar}</small>}</span></button>)}
          {!visibleRecords.length && <p className="hazard-empty">No records match this body system and search.</p>}
        </div>
      </aside>
      <HazardBodyMap activeSystems={activeSystems} selectedSystem={selectedSystem} onSelect={chooseSystem} />
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
