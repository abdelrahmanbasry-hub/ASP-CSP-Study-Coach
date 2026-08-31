"use client";

import { BookOpenCheck, Calculator, Check, ChevronLeft, ChevronRight, CircleHelp, FlaskConical, Layers3, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import type { SearchTarget } from "./globalSearch";
import { HAZARD_LIBRARY_RECORDS } from "./hazardLibraryData";
import { nextFlashcardProgress, type FlashcardRating, type LearningProgress } from "./learningProgress";
import { BCSP_FREQUENTLY_USED_FORMULA_IDS, FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";
import { BookmarkAction } from "./StudySystem";
import type { StudySystemState } from "./studySystemState";
import type { Attempt } from "./adaptiveEngine";
import type { HazardResourceOpener } from "./hazardTypes";
import { HazardsLibrary } from "./hazard-library/HazardsLibrary";
export { HazardsLibrary } from "./hazard-library/HazardsLibrary";

type LibraryTab = "flashcards" | "formulas" | "hazards";

export default function StudyLibrary({ progress, onProgress, searchTarget, system, onSystem, mistakeAttempts, onOpen }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void; searchTarget?: (SearchTarget & { requestKey: number }) | null; system: StudySystemState; onSystem: (system: StudySystemState) => void; mistakeAttempts: Attempt[]; onOpen: HazardResourceOpener }) {
  const [tab, setTab] = useState<LibraryTab>(searchTarget?.libraryTab ?? "flashcards");
  return (
    <main className="resource-page library-page">
      <section className="library-hero page-width"><div><p className="eyebrow"><BookOpenCheck size={16} /> Study library</p><h1>Retrieve. Apply. Space the review.</h1><p>Use flashcards for recurring recall, the formula library for structured problem solving, and the bilingual Hazard Library for workplace-hazard review.</p></div><div className="library-hero-stat"><strong>{FLASHCARDS.length + FORMULA_ENTRIES.length + HAZARD_LIBRARY_RECORDS.length}</strong><span>reference records</span></div></section>
      <nav className="library-tabs page-width" aria-label="Study library tabs"><button className={tab === "flashcards" ? "active" : ""} onClick={() => setTab("flashcards")}><Layers3 size={17} /> Flashcards</button><button className={tab === "formulas" ? "active" : ""} onClick={() => setTab("formulas")}><Calculator size={17} /> Formula sheet</button><button className={tab === "hazards" ? "active" : ""} onClick={() => setTab("hazards")}><FlaskConical size={17} /> Hazards</button></nav>
      {tab === "flashcards" && <Flashcards progress={progress} onProgress={onProgress} initialSearch={searchTarget?.libraryTab === "flashcards" ? searchTarget.query : undefined} requestKey={searchTarget?.requestKey} system={system} onSystem={onSystem} mistakeAttempts={mistakeAttempts} />}
      {tab === "formulas" && <FormulaLibrary initialSearch={searchTarget?.libraryTab === "formulas" ? searchTarget.query : undefined} requestKey={searchTarget?.requestKey} system={system} onSystem={onSystem} onOpen={onOpen} />}
      {tab === "hazards" && <HazardsLibrary initialItemId={searchTarget?.itemId} initialSearch={searchTarget?.libraryTab === "hazards" ? searchTarget.query : undefined} requestKey={searchTarget?.requestKey} system={system} onSystem={onSystem} onOpen={onOpen} />}
    </main>
  );
}

function Flashcards({ progress, onProgress, initialSearch, system, onSystem, mistakeAttempts }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void; initialSearch?: string; requestKey?: number; system: StudySystemState; onSystem: (system: StudySystemState) => void; mistakeAttempts: Attempt[] }) {
  const [deck, setDeck] = useState("all");
  const [search, setSearch] = useState(initialSearch ?? "");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewNow] = useState(() => Date.now());
  const mistakeCards = [...new Map(mistakeAttempts.map((attempt) => [attempt.referenceTopic, { id: `mistake:${attempt.referenceTopic}`, deck: "Mistake repair", front: `What decision rule corrects this mistake? ${attempt.stem}`, back: `${attempt.rationale} Teach-back: ${attempt.challengePrompt}`, tags: [attempt.competency, attempt.referenceTopic], chapterId: undefined }])).values()];
  const allCards = [...mistakeCards, ...FLASHCARDS];
  const decks = ["all", ...new Set(allCards.map((card) => card.deck))];
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = allCards.filter((card) => (deck === "all" || card.deck === deck) && (!normalizedSearch || `${card.front} ${card.back} ${card.tags.join(" ")}`.toLowerCase().includes(normalizedSearch)));
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

  return <section className="page-width library-panel"><div className="library-toolbar"><div><p className="eyebrow"><Sparkles size={15} /> Spaced review</p><h2>Flashcard queue</h2></div><select value={deck} onChange={(event) => { setDeck(event.target.value); setIndex(0); setRevealed(false); }} aria-label="Filter flashcard deck">{decks.map((item) => <option value={item} key={item}>{item === "all" ? "All decks" : item}</option>)}</select></div><div className="resource-filters single flashcard-search"><label><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setIndex(0); setRevealed(false); }} placeholder="Search flashcards by concept or tag" aria-label="Search flashcards" /></label></div><div className="flash-stats"><span><strong>{due.length}</strong> due now</span><span><strong>{filtered.length - due.length}</strong> scheduled</span><span><strong>{mastered}</strong> mastered</span></div>{card ? <div className="flashcard-stage"><div className="library-bookmark-row"><BookmarkAction kind="flashcard" itemId={card.id} title={card.front} subtitle={card.back} chapterId={card.chapterId} system={system} onChange={onSystem} /></div><button type="button" className={revealed ? "flashcard revealed" : "flashcard"} onClick={() => setRevealed(true)}><small>{card.deck}{card.chapterId ? ` · ${card.chapterId.toUpperCase()}` : ""}</small><h3>{revealed ? card.back : card.front}</h3><span>{revealed ? "Rate how well you recalled it" : "Click to reveal the answer"}</span></button><div className="flashcard-nav"><button className="secondary-button" onClick={() => { setIndex((value) => (value - 1 + queue.length) % queue.length); setRevealed(false); }}><ChevronLeft size={16} /> Previous</button><span>{index % queue.length + 1} / {queue.length}</span><button className="secondary-button" onClick={() => { setIndex((value) => (value + 1) % queue.length); setRevealed(false); }}>Next <ChevronRight size={16} /></button></div>{revealed && <div className="rating-row"><button onClick={() => rate("again")}><strong>Again</strong><span>10 min</span></button><button onClick={() => rate("hard")}><strong>Hard</strong><span>1 day+</span></button><button onClick={() => rate("good")}><strong>Good</strong><span>adaptive</span></button><button onClick={() => rate("easy")}><strong>Easy</strong><span>longer gap</span></button></div>}</div> : <div className="empty-state"><Check /><h3>No cards match this search.</h3></div>}</section>;
}

function FormulaLibrary({ initialSearch, system, onSystem, onOpen }: { initialSearch?: string; requestKey?: number; system: StudySystemState; onSystem: (system: StudySystemState) => void; onOpen: HazardResourceOpener }) {
  const PAGE_SIZE = 24;
  const [search, setSearch] = useState(initialSearch ?? "");
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
      <div className="formula-grid">{visibleEntries.map((entry) => <details className="formula-card" key={entry.id}><summary><div><small>{entry.category}{frequentlyUsedIds.has(entry.id) ? " · Most often used" : ""}</small><h3>{entry.name}</h3></div><span className="formula-expression">{entry.formula}</span></summary><div className="formula-body"><BookmarkAction kind="formula" itemId={entry.id} title={entry.name} subtitle={`${entry.formula} · ${entry.whenToUse}`} system={system} onChange={onSystem} /><p><strong>Use it when:</strong> {entry.whenToUse}</p><p><strong>Variables:</strong> {entry.variables.join(" · ")}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Common error:</strong> {entry.commonError}</p><div className="worked-example"><span>Worked example</span><p>{entry.workedExample}</p></div><button className="secondary-button" onClick={() => onOpen("practice", entry.name)}>Practice this formula <ChevronRight size={15} /></button><small>Source reference: {entry.sourcePage}</small></div></details>)}</div>
      {remaining > 0 && <div className="flashcard-nav" aria-label="Formula results controls">
        <button className="secondary-button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, remaining)} more</button>
        <span>Showing {visibleEntries.length} of {entries.length}</span>
        <button className="secondary-button" onClick={() => setVisibleCount(entries.length)}>Show all</button>
      </div>}
    </> : <div className="empty-state"><Search size={22} /><h3>No formulas match those filters.</h3><p>Try a different term or select another category.</p></div>}
    <p className="reference-note"><CircleHelp size={15} /> Complete coverage includes 104 deduplicated equation, conversion, and constant families from the supplied 23-page ASP formula sheet, plus 2 clearly marked Yates supplemental cards. Six lookup tables and charts were visually reviewed but are intentionally not counted as formulas. The 47 printed equations in “Equations Most Often Used on BCSP Exams” on pp. 12–23 map to 44 deduplicated cards. This is the supplied study-sheet label, not a guarantee of current exam frequency.</p>
  </section>;
}
