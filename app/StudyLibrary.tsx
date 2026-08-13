"use client";

import { BookOpenCheck, Calculator, Check, ChevronLeft, ChevronRight, CircleHelp, FlaskConical, Languages, Layers3, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { HAZARD_COUNTS, HAZARD_RECORDS, type HazardRecord } from "./hazardData";
import { nextFlashcardProgress, type FlashcardRating, type LearningProgress } from "./learningProgress";
import { FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const categories = ["all", ...new Set(FORMULA_ENTRIES.map((entry) => entry.category))];
  const entries = FORMULA_ENTRIES.filter((entry) => (category === "all" || entry.category === category) && `${entry.name} ${entry.formula} ${entry.whenToUse} ${entry.variables.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  return <section className="page-width library-panel"><div className="library-toolbar"><div><p className="eyebrow"><Calculator size={15} /> Smart formula sheet</p><h2>Search by problem, not page</h2></div><span>{entries.length} formulas</span></div><div className="resource-filters"><label><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search formula or use case" /></label><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option value={item} key={item}>{item === "all" ? "All categories" : item}</option>)}</select></div><div className="formula-grid">{entries.map((entry) => <details className="formula-card" key={entry.id}><summary><div><small>{entry.category}</small><h3>{entry.name}</h3></div><span className="formula-expression">{entry.formula}</span></summary><div className="formula-body"><p><strong>Use it when:</strong> {entry.whenToUse}</p><p><strong>Variables:</strong> {entry.variables.join(" · ")}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Common error:</strong> {entry.commonError}</p><div className="worked-example"><span>Worked example</span><p>{entry.workedExample}</p></div><small>Source reference: {entry.sourcePage}</small></div></details>)}</div></section>;
}

function HazardsLibrary() {
  const [category, setCategory] = useState<HazardRecord["category"]>("toxicological");
  const [language, setLanguage] = useState<"both" | "en" | "ar">("both");
  const [search, setSearch] = useState("");
  const fields: Array<[keyof Pick<HazardRecord, "hazardDisease" | "type" | "definition" | "targetOrganSystem" | "mainConsequences" | "exposureTransmission" | "highRiskOccupationsWorkplace">, string]> = [["hazardDisease", "Hazard / Disease"], ["type", "Type"], ["definition", "Definition"], ["targetOrganSystem", "Target Organ / System"], ["mainConsequences", "Main Consequences"], ["exposureTransmission", "Exposure / Transmission"], ["highRiskOccupationsWorkplace", "High-Risk Occupations / Workplace"]];
  const records = HAZARD_RECORDS.filter((record) => record.category === category && JSON.stringify(record).toLowerCase().includes(search.toLowerCase()));
  const renderText = (text: { en: string; ar: string }) => <>{language !== "ar" && <span lang="en">{text.en}</span>}{language === "both" && <i />}{language !== "en" && <span lang="ar" dir="rtl">{text.ar}</span>}</>;
  return <section className="page-width library-panel"><div className="library-toolbar"><div><p className="eyebrow"><FlaskConical size={15} /> Occupational health reference</p><h2>Toxicology & biological hazards</h2></div><span>{HAZARD_COUNTS.total} bilingual records</span></div><div className="hazard-switches"><div><button className={category === "toxicological" ? "active" : ""} onClick={() => setCategory("toxicological")}>Toxic substances ({HAZARD_COUNTS.toxicological})</button><button className={category === "biological" ? "active" : ""} onClick={() => setCategory("biological")}>Biological hazards ({HAZARD_COUNTS.biological})</button></div><div><Languages size={16} /><button className={language === "both" ? "active" : ""} onClick={() => setLanguage("both")}>Both</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button><button className={language === "ar" ? "active" : ""} onClick={() => setLanguage("ar")}>العربية</button></div></div><div className="resource-filters single"><label><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hazard, consequence, route, or occupation" /></label></div><div className="hazard-table-wrap"><table className="hazard-table"><thead><tr>{fields.map(([, label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{records.map((record) => <tr key={record.id}>{fields.map(([field]) => <td key={field}>{renderText(record[field])}</td>)}</tr>)}</tbody></table></div><div className="hazard-mobile-list">{records.map((record) => <details key={record.id}><summary>{renderText(record.hazardDisease)}</summary><div>{fields.slice(1).map(([field, label]) => <p key={field}><strong>{label}</strong>{renderText(record[field])}</p>)}</div></details>)}</div><p className="reference-note"><CircleHelp size={15} /> Study summaries based on the supplied workbook rows. They are not medical advice; verify workplace decisions against current authoritative guidance.</p></section>;
}
