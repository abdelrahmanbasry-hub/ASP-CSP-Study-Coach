"use client";

import { Calculator, Check, ChevronLeft, ChevronRight, CircleHelp, Layers3, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "./ui/learning-ui";
import { updateResourceRoute } from "./coachRoutes";
import type { SearchTarget } from "./globalSearch";
import { nextFlashcardProgress, type FlashcardRating, type LearningProgress } from "./learningProgress";
import { BCSP_FREQUENTLY_USED_FORMULA_IDS, FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";
import { BookmarkAction } from "./StudySystem";
import type { StudySystemState } from "./studySystemState";
import type { Attempt } from "./adaptiveEngine";
import type { HazardResourceOpener } from "./hazardTypes";
export { HazardsLibrary } from "./hazard-library/HazardsLibrary";

type LibraryTab = "flashcards" | "formulas";

export default function StudyLibrary({ progress, onProgress, searchTarget, system, onSystem, mistakeAttempts, onOpen }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void; searchTarget?: (SearchTarget & { requestKey: number }) | null; system: StudySystemState; onSystem: (system: StudySystemState) => void; mistakeAttempts: Attempt[]; onOpen: HazardResourceOpener }) {
  const [tab, setTab] = useState<LibraryTab>(searchTarget?.libraryTab === "formulas" ? "formulas" : "flashcards");
  return (
    <main className="resource-page library-page">
      <div className="page-width"><PageHeader title="Study Library" description={`${FLASHCARDS.length} flashcards · ${FORMULA_ENTRIES.length} formulas. Recall a concept or work through a calculation.`}/></div>
      <nav className="library-tabs page-width" aria-label="Study library tabs"><button className={tab === "flashcards" ? "active" : ""} aria-current={tab==="flashcards"?"page":undefined} onClick={() => {setTab("flashcards");updateResourceRoute({view:"library",libraryTab:"flashcards"},true);}}><Layers3 size={17} /> Flashcards</button><button className={tab === "formulas" ? "active" : ""} aria-current={tab==="formulas"?"page":undefined} onClick={() => {setTab("formulas");updateResourceRoute({view:"library",libraryTab:"formulas"},true);}}><Calculator size={17} /> Formula sheet</button></nav>
      {tab === "flashcards" && <Flashcards target={searchTarget?.libraryTab === tab ? searchTarget : undefined} progress={progress} onProgress={onProgress} initialSearch={searchTarget?.libraryTab === "flashcards" ? searchTarget.query : undefined} requestKey={searchTarget?.requestKey} system={system} onSystem={onSystem} mistakeAttempts={mistakeAttempts} />}
      {tab === "formulas" && <FormulaLibrary target={searchTarget?.libraryTab === tab ? searchTarget : undefined} initialSearch={searchTarget?.libraryTab === "formulas" ? searchTarget.query : undefined} requestKey={searchTarget?.requestKey} system={system} onSystem={onSystem} onOpen={onOpen} />}
    </main>
  );
}

function Flashcards({ progress, onProgress, initialSearch, system, onSystem, mistakeAttempts, target }: { progress: LearningProgress; onProgress: (next: LearningProgress) => void; initialSearch?: string; requestKey?: number; system: StudySystemState; onSystem: (next: StudySystemState) => void; mistakeAttempts: Attempt[]; target?: SearchTarget }) {
  const [deck,setDeck]=useState(target?.deck??"all");
  const [search,setSearch]=useState(initialSearch??"");
  const [revealed,setRevealed]=useState(false);
  const [index,setIndex]=useState(0);
  const [reviewed,setReviewed]=useState<string[]>([]);
  const [selectedItem,setSelectedItem]=useState(target?.itemId);
  const [freeReview,setFreeReview]=useState(Boolean(target?.itemId));
  const [reviewNow]=useState(()=>Date.now());
  const mistakeCards=[...new Map(mistakeAttempts.map(attempt=>[attempt.referenceTopic,{id:`mistake:${attempt.referenceTopic}`,deck:"Mistake repair",front:attempt.stem,back:`${attempt.rationale} Teach-back: ${attempt.challengePrompt}`,tags:[attempt.competency,attempt.referenceTopic],chapterId:undefined}])).values()];
  const allCards=[...mistakeCards,...FLASHCARDS];
  const decks=["all",...new Set(allCards.map(card=>card.deck))];
  const filtered=allCards.filter(c=>(!selectedItem||c.id===selectedItem)&&(deck==="all"||c.deck===deck)&&`${c.front} ${c.back} ${c.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  const due=filtered.filter(c=>(progress.flashcards[c.id]?.dueAt??0)<=reviewNow);
  const remaining=(freeReview?filtered:due).filter(c=>!reviewed.includes(c.id));
  const card=reviewed.length<10?remaining[index%Math.max(1,remaining.length)]:undefined;
  function reset(){setReviewed([]);setIndex(0);setRevealed(false);}
  function rate(rating:FlashcardRating){
    if(!card)return;
    onProgress({...progress,flashcards:{...progress.flashcards,[card.id]:nextFlashcardProgress(progress.flashcards[card.id],rating)}});
    setReviewed([...reviewed,card.id]);setIndex(0);setRevealed(false);
  }
  function route(q:string,d:string){setSelectedItem(undefined);updateResourceRoute({view:"library",libraryTab:"flashcards",query:q,deck:d==="all"?undefined:d});}
  return <section className="page-width library-panel">
    <div className="library-toolbar"><div><h2>Flashcard review</h2><p>Up to 10 cards per session. Reveal, recall, then rate.</p></div><span className="scope-label" role="status">{reviewed.length} reviewed · {due.length} due</span></div>
    <div className="learning-filter-bar"><label className="field-label">Search flashcards<input type="search" value={search} onChange={e=>{setSearch(e.target.value);reset();route(e.target.value,deck);}} placeholder="Concept or tag"/></label><label className="field-label">Deck<select value={deck} onChange={e=>{setDeck(e.target.value);reset();route(search,e.target.value);}}>{decks.map(d=><option key={d} value={d}>{d==="all"?"All decks":d}</option>)}</select></label></div>
    {card?<div className="flashcard-stage"><div className="library-bookmark-row"><BookmarkAction kind="flashcard" itemId={card.id} title={card.front} subtitle={card.back} chapterId={card.chapterId} system={system} onChange={onSystem}/></div><button type="button" aria-expanded={revealed} className={revealed?"flashcard revealed":"flashcard"} onClick={()=>setRevealed(!revealed)}><small>{card.deck}</small><h3>{revealed?card.back:card.front}</h3><span>{revealed?"Answer shown · rate your recall below":"Reveal answer"}</span></button>{revealed?<div className="rating-row">{([["again","Again","10 minutes"],["hard","Hard","1 day or more"],["good","Good","Adaptive interval"],["easy","Easy","Longer interval"]] as const).map(([rating,label,hint])=><button key={rating} onClick={()=>rate(rating)}><strong>{label}</strong><span>{hint}</span></button>)}</div>:<div className="flashcard-nav"><button className="secondary-button" disabled={remaining.length<2} onClick={()=>setIndex((index-1+remaining.length)%remaining.length)}><ChevronLeft/>Previous</button><span>{index%remaining.length+1} / {remaining.length}</span><button className="secondary-button" disabled={remaining.length<2} onClick={()=>setIndex((index+1)%remaining.length)}>Next<ChevronRight/></button></div>}</div>:<div className="empty-state"><Check/><h3>{!filtered.length?"No cards match":reviewed.length?"Review session complete":"You’re caught up"}</h3><p>{!filtered.length?"Try a different concept or deck.":reviewed.length?`${reviewed.length} cards reviewed. Your next review times are saved.`:"No cards in this selection are due. You can still review them by choice."}</p><button className="primary-button" onClick={()=>{if(!filtered.length){setSearch("");setDeck("all");route("","all");}setFreeReview(true);reset();}}>{!filtered.length?"Clear filters":"Start optional review"}</button></div>}
  </section>;
}

function FormulaLibrary({ initialSearch, system, onSystem, onOpen, target }: { target?: SearchTarget; initialSearch?: string; requestKey?: number; system: StudySystemState; onSystem: (system: StudySystemState) => void; onOpen: HazardResourceOpener }) {
  const PAGE_SIZE = 24;
  const [selectedItem,setSelectedItem]=useState(target?.itemId);
  const [search, setSearch] = useState(initialSearch ?? "");
  const [category, setCategory] = useState(target?.category ?? "all");
  const [formulaSet, setFormulaSet] = useState<"all" | "frequent">(target?.formulaSet ?? "all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const frequentlyUsedIds = new Set<string>(BCSP_FREQUENTLY_USED_FORMULA_IDS);
  const categories = ["all", ...new Set(FORMULA_ENTRIES.map((entry) => entry.category))];
  const formulaSetEntries = formulaSet === "frequent" ? FORMULA_ENTRIES.filter((entry) => frequentlyUsedIds.has(entry.id)) : FORMULA_ENTRIES;
  const categoryCounts = Object.fromEntries(categories.map((item) => [item, item === "all" ? formulaSetEntries.length : formulaSetEntries.filter((entry) => entry.category === item).length]));
  const frequentlyUsedCount = FORMULA_ENTRIES.filter((entry) => frequentlyUsedIds.has(entry.id)).length;
  const normalizedSearch = search.trim().toLowerCase();
  const entries = formulaSetEntries.filter((entry) => {
    if (selectedItem && entry.id !== selectedItem) return false;
    if (category !== "all" && entry.category !== category) return false;
    if (!normalizedSearch) return true;
    return [entry.name, entry.formula, entry.whenToUse, entry.variables.join(" "), entry.units, entry.commonError, entry.sourcePage].join(" ").toLowerCase().includes(normalizedSearch);
  });
  const visibleEntries = entries.slice(0, visibleCount);
  const remaining = Math.max(0, entries.length - visibleEntries.length);

  function changeSearch(value: string) {
    setSearch(value);
    updateResourceRoute({view:"library",libraryTab:"formulas",query:value,category,formulaSet});
    setSelectedItem(undefined);
    setVisibleCount(PAGE_SIZE);
  }

  function changeCategory(value: string) {
    setCategory(value);
    updateResourceRoute({view:"library",libraryTab:"formulas",query:search,category:value,formulaSet});
    setSelectedItem(undefined);
    setVisibleCount(PAGE_SIZE);
  }

  function changeFormulaSet(value: "all" | "frequent") {
    setFormulaSet(value);
    updateResourceRoute({view:"library",libraryTab:"formulas",query:search,category,formulaSet:value});
    setSelectedItem(undefined);
    setVisibleCount(PAGE_SIZE);
  }
  return <section className="page-width library-panel">
    <div className="library-toolbar">
      <div><p className="eyebrow"><Calculator size={15} /> Smart formula sheet</p><h2>Search by problem, not page</h2></div>
      <span>{entries.length} filtered · {FORMULA_ENTRIES.length} total</span>
    </div>
    <div className="resource-filters">
      <label><Search size={16} /><input value={search} onChange={(event) => changeSearch(event.target.value)} aria-label="Search formulas" placeholder="Equation, variable, unit, or concept" /></label>
      <select value={category} onChange={(event) => changeCategory(event.target.value)} aria-label="Filter formula category">
        {categories.map((item) => <option value={item} key={item}>{item === "all" ? "All categories" : item} ({categoryCounts[item]})</option>)}
      </select>
      <select value={formulaSet} onChange={(event) => changeFormulaSet(event.target.value as "all" | "frequent")} aria-label="Filter formula set">
        <option value="all">All formulas ({FORMULA_ENTRIES.length})</option>
        <option value="frequent">Equations most often used on BCSP exams ({frequentlyUsedCount})</option>
      </select>
    </div>
    {entries.length ? <>
      <div className="formula-grid">{visibleEntries.map((entry) => <details className="formula-card" key={entry.id} open={selectedItem === entry.id ? true : undefined}><summary><div><small>{entry.category}{frequentlyUsedIds.has(entry.id) ? " · Most often used" : ""}</small><h3>{entry.name}</h3></div><span className="formula-expression">{entry.formula}</span></summary><div className="formula-body"><BookmarkAction kind="formula" itemId={entry.id} title={entry.name} subtitle={`${entry.formula} · ${entry.whenToUse}`} system={system} onChange={onSystem} /><p><strong>Use it when:</strong> {entry.whenToUse}</p><p><strong>Variables:</strong> {entry.variables.join(" · ")}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Common error:</strong> {entry.commonError}</p><div className="worked-example"><span>Worked example</span><p>{entry.workedExample}</p></div><button className="secondary-button" onClick={() => onOpen("practice", entry.name, {practiceTags:[entry.name,entry.category]})}>Practice this formula <ChevronRight size={15} /></button><small>Source reference: {entry.sourcePage}</small></div></details>)}</div>
      {remaining > 0 && <div className="flashcard-nav" aria-label="Formula results controls">
        <button className="secondary-button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, remaining)} more</button>
        <span>Showing {visibleEntries.length} of {entries.length}</span>
        <button className="secondary-button" onClick={() => setVisibleCount(entries.length)}>Show all</button>
      </div>}
    </> : <div className="empty-state"><Search size={22} /><h3>No formulas match those filters.</h3><p>Try a different term or select another category.</p><button className="secondary-button" onClick={()=>{setSearch("");setCategory("all");setFormulaSet("all");setSelectedItem(undefined);setVisibleCount(PAGE_SIZE);updateResourceRoute({view:"library",libraryTab:"formulas"});}}>Clear filters</button></div>}
    <p className="reference-note"><CircleHelp size={15} /> Complete coverage includes 104 deduplicated equation, conversion, and constant families from the supplied 23-page ASP formula sheet, plus 2 clearly marked Yates supplemental cards. Six lookup tables and charts were visually reviewed but are intentionally not counted as formulas. The 47 printed equations in “Equations Most Often Used on BCSP Exams” on pp. 12–23 map to 44 deduplicated cards. This is the supplied study-sheet label, not a guarantee of current exam frequency.</p>
  </section>;
}
