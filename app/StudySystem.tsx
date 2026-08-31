"use client";

import { useId, useMemo, useRef, useState } from "react";
import { CHAPTERS, HOMEWORK_QUESTIONS } from "./homeworkData";
import { PageHeader, useDialogFocus } from "./ui/learning-ui";
import { useChapterPracticeProgress } from "./useChapterPracticeProgress";
import { updateResourceRoute } from "./coachRoutes";
import { BookMarked, Calculator, CalendarDays, Check, ChevronDown, ChevronRight, ExternalLink, FileQuestion, FlaskConical, Library, NotebookPen, Search, ShieldCheck, Sparkles, Star, Target, X } from "lucide-react";
import type { Attempt } from "./adaptiveEngine";
import type { LearningProgress } from "./learningProgress";
import { PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import { FORMULA_ENTRIES } from "./studyLibraryData";
import { canonicalHazardId, hazardNotebookKeys } from "./hazardAliases";
import { notebookResourceGroups } from "./hazardNotebook";
import { OSHA_STANDARDS } from "./standardsData";
import { MISTAKE_REASONS, attemptKey, mistakeInsight, type MistakeReason, type NotebookEntry, type NotebookKind, type StudySystemState } from "./studySystemState";
import ScientificCalculator from "./ScientificCalculator";
import type { SearchTarget } from "./globalSearch";

export const STUDY_CHAPTERS = [...new Map(PRACTICE_V2_QUESTIONS.filter((question) => question.reviewStatus !== "demo").map((question) => [question.chapterId, question.chapterTitle])).entries()].map(([id, title], index) => ({ id, title, courseNumber: CHAPTERS.find(chapter => chapter.id === id)?.courseNumber ?? (Number(id.split("-").at(-1)) || index + 1), courseMapped: CHAPTERS.some(chapter=>chapter.id===id), homeworkReady: CHAPTERS.some(chapter=>chapter.id===id&&chapter.status==="ready") }));

export type ResourceView = "homework" | "practice" | "key-information" | "library" | "review" | "standards" | "notebook" | "mastery" | "hazards";

export function ChapterMasteryMap({ learning, onOpen, initialChapterId }: { learning: LearningProgress; attempts: Attempt[]; initialChapterId?: string; onOpen: (view: ResourceView, query?: string, chapterId?: string, references?: Partial<SearchTarget>) => void }) {
  const [selectedId,setSelectedId]=useState<string|null>(initialChapterId??null);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [practice]=useChapterPracticeProgress();
  const records=STUDY_CHAPTERS.map(chapter=>{
    const items=PRACTICE_V2_QUESTIONS.filter(q=>q.chapterId===chapter.id);
    const answers=items.reduce((s,q)=>s+(practice.attempts[q.id]?.attempts??0),0);
    const correct=items.reduce((s,q)=>s+(practice.attempts[q.id]?.correct??0),0);
    const homework=learning.chapterScores[chapter.id];
    const evidence=answers+(homework?.total??0);
    const score=evidence?Math.round((correct+(homework?.lastScore??0))/evidence*100):0;
    return {...chapter,evidence,score,status:evidence<5?"not-enough":score>=80?"strong":score>=65?"developing":"weak",count:items.length};
  });
  const selected=records.find(c=>c.id===selectedId);
  const label=(status:string)=>status==="not-enough"?"Needs evidence":status[0].toUpperCase()+status.slice(1);
  const visible=records.filter(c=>(filter==="all"||c.status===filter)&&`${c.title} ${c.courseNumber}`.toLowerCase().includes(search.toLowerCase()));
  const panel=useRef<HTMLElement>(null);
  function choose(id:string){setSelectedId(id);updateResourceRoute({view:"mastery",chapterId:id},true);window.requestAnimationFrame(()=>{panel.current?.focus();panel.current?.scrollIntoView({block:"nearest",behavior:"instant"});});}
  return <main className="study-system-page page-width">
    <PageHeader title="Chapter mastery" description="Choose a chapter to see your evidence and open its learning resources." eyebrow={`${records.length} practice chapters`}/>
    <div className="learning-filter-bar"><label className="field-label">Find a chapter<input type="search" placeholder="Title or course number" value={search} onChange={e=>setSearch(e.target.value)}/></label><label className="field-label">Evidence status<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All chapters</option>{["strong","developing","weak","not-enough"].map(v=><option value={v} key={v}>{label(v)} ({records.filter(c=>c.status===v).length})</option>)}</select></label></div>
    <div className="mastery-layout">
      <section className="mastery-grid" aria-label="Chapter mastery map">{visible.map(c=><button aria-pressed={selectedId===c.id} className={`mastery-tile ${c.status} ${selectedId===c.id?"selected":""}`} key={c.id} onClick={()=>choose(c.id)}><span>{c.courseMapped?"Course":"Practice"} {String(c.courseNumber).padStart(2,"0")}</span><strong>{c.title}</strong><small>{label(c.status)}{c.evidence?` · ${c.score}%`:""}</small><i style={{width:`${c.score}%`}}/></button>)}{!visible.length&&<p role="status">No chapters match. Clear the search or choose another status.</p>}</section>
      <aside ref={panel} tabIndex={-1} aria-label="Selected chapter resources" className={`chapter-hub ${selected?"open":""}`}>{selected?<><button className="icon-button chapter-hub-close" onClick={()=>{setSelectedId(null);updateResourceRoute({view:"mastery"});}} aria-label="Close chapter"><X/></button><p className="eyebrow">{selected.courseMapped?"Course":"Practice"} chapter {selected.courseNumber}</p><h2>{selected.title}</h2><p className="scope-label">{selected.evidence} evidence points · {label(selected.status)}. Homework and device-local Chapter Practice; not exam readiness.</p><div className="chapter-links">
        <button onClick={()=>onOpen("practice",undefined,selected.id)}><FileQuestion/><span><strong>Practice</strong><small>{selected.count} questions</small></span><ChevronRight/></button>
        <button disabled={!selected.homeworkReady} onClick={()=>onOpen("homework",undefined,selected.id)}><BookMarked/><span><strong>Homework</strong><small>{selected.homeworkReady?"Assignment and saved review":"No assignment available"}</small></span><ChevronRight/></button>
        <button onClick={()=>onOpen("review",selected.title,undefined,{reviewSource:"chapter"})}><Target/><span><strong>Review practice</strong><small>Chapter questions and mistake status</small></span><ChevronRight/></button>
        <button onClick={()=>onOpen("library",selected.title,undefined,{libraryTab:"formulas"})}><Calculator/><span><strong>Formulas</strong><small>Find related equations</small></span><ChevronRight/></button>
        <button onClick={()=>onOpen("library",selected.title,undefined,{libraryTab:"flashcards"})}><Library/><span><strong>Flashcards</strong><small>Review chapter concepts</small></span><ChevronRight/></button>
        <button onClick={()=>onOpen("hazards",selected.title)}><FlaskConical/><span><strong>Hazards</strong><small>Find related hazard records</small></span><ChevronRight/></button>
        <button onClick={()=>onOpen("notebook",selected.title)}><NotebookPen/><span><strong>Notes</strong><small>Search your saved resources</small></span><ChevronRight/></button>
      </div></>:<div className="chapter-hub-empty"><Target/><h2>Select a chapter</h2><p>Open practice, Homework, formulas, hazards, flashcards, and notes.</p></div>}</aside>
    </div>
  </main>;
}

export function notebookTarget(entry: NotebookEntry): SearchTarget {
  const id=entry.id.slice(entry.kind.length+1);
  if(entry.kind==="hazard")return {view:"hazards",itemId:canonicalHazardId(id)};
  if(entry.kind==="formula")return {view:"library",libraryTab:"formulas",itemId:id};
  if(entry.kind==="flashcard")return {view:"library",libraryTab:"flashcards",itemId:id};
  if(entry.kind==="standard")return {view:"standards",itemId:id};
  if(entry.kind==="question"){
    if(PRACTICE_V2_QUESTIONS.some(q=>q.id===id))return {view:"practice",itemId:id};
    const homework=HOMEWORK_QUESTIONS.find(q=>q.id===id);
    if(homework)return {view:"homework",chapterId:homework.chapterId};
    return {view:"review",query:entry.title};
  }
  if(id.startsWith("key-point:"))return {view:"key-information",chapterNumber:Number(id.split(":")[1]),itemId:id};
  return {view:"homework",chapterId:entry.chapterId??id};
}

export function StudyNotebook({ system, onChange, initialQuery = "", onOpen }: { system: StudySystemState; onChange: (system: StudySystemState) => void; initialQuery?: string; onOpen?: (target:SearchTarget)=>void }) {
  const [search,setSearch]=useState(initialQuery);
  const [kind,setKind]=useState<NotebookKind|"all">("all");
  const [removed,setRemoved]=useState<NotebookEntry[]>([]);
  const [edited,setEdited]=useState<string|null>(null);
  const groups=notebookResourceGroups(system.notebook);
  const visible=groups.filter(group=>group.entries.some(e=>(kind==="all"||e.kind===kind)&&`${e.title} ${e.subtitle??""} ${e.note}`.toLowerCase().includes(search.toLowerCase())));
  function remove(entry:NotebookEntry){const notebook={...system.notebook};delete notebook[entry.id];onChange({...system,notebook});setRemoved([...removed,entry]);}
  function undo(){const notebook={...system.notebook};for(const entry of removed)if(!notebook[entry.id])notebook[entry.id]=entry;onChange({...system,notebook});setRemoved([]);}
  return <main className="study-system-page page-width"><PageHeader title="My Study Notebook" description="Saved resources, your own notes, and a direct path back to the source." eyebrow={`${groups.length} saved resources`}/>
    <div className="learning-filter-bar"><label className="field-label">Search notebook<input type="search" value={search} placeholder="Saved title, topic, or note" onChange={e=>setSearch(e.target.value)}/></label><label className="field-label">Resource type<select value={kind} onChange={e=>setKind(e.target.value as NotebookKind|"all")}><option value="all">All types</option>{(["question","formula","hazard","flashcard","chapter","standard"] as const).map(k=><option key={k} value={k}>{k}</option>)}</select></label></div>
    {removed.length>0&&<div className="undo-banner" role="status"><span>{removed.length} saved item{removed.length===1?"":"s"} removed, including any notes.</span><button className="secondary-button" onClick={undo}>Undo removal</button></div>}
    {visible.length?<section className="notebook-grid">{visible.map(group=><article className="notebook-card" key={group.id} data-notebook-resource={group.id}>{group.entries.length>1&&<p>Saved versions of this hazard. Each original note is preserved.</p>}{group.entries.map(entry=><section key={entry.id} data-notebook-entry={entry.id}><header><span>{entry.kind}</span><button onClick={()=>remove(entry)} aria-label={`Remove ${entry.title}`}><X/></button></header><h2>{entry.title}</h2>{entry.subtitle&&<p>{entry.subtitle}</p>}<button className="secondary-button" onClick={()=>onOpen?.(notebookTarget(entry))}>Open source<ExternalLink size={16}/></button><label className="field-label">Your note<textarea value={entry.note} placeholder="Add a memory cue or connection…" onChange={e=>{onChange({...system,notebook:{...system.notebook,[entry.id]:{...entry,note:e.target.value,updatedAt:Date.now()}}});setEdited(entry.id);}}/></label><small role={edited===entry.id?"status":undefined}>{edited===entry.id?"Note saved in this browser. Account sync status is shown in the header.":`Updated ${new Date(entry.updatedAt).toLocaleDateString()}`}</small></section>)}</article>)}</section>:<div className="empty-state notebook-empty"><NotebookPen/><h2>{groups.length?"No saved items match":"Your notebook is ready"}</h2><p>{groups.length?"Try another search or resource type.":"Save a formula, flashcard, question, or hazard and add a note here."}</p><button className="primary-button" onClick={()=>groups.length?(setSearch(""),setKind("all")):onOpen?.({view:"library"})}>{groups.length?"Clear filters":"Browse the Library"}</button></div>}
  </main>;
}

export function StandardsExplorer({ system, onChange, onOpen, initialQuery = "", initialStandardIds }: { system: StudySystemState; onChange: (system: StudySystemState) => void; onOpen: (view: ResourceView, query?: string, target?: Pick<SearchTarget, "libraryTab" | "practiceTags">) => void; initialQuery?: string; initialStandardIds?: readonly string[] }) {
  const [referenceIds, setReferenceIds] = useState(initialStandardIds);
  const initialStandard = OSHA_STANDARDS.find((standard) => initialStandardIds?.length ? initialStandardIds.includes(standard.id) : JSON.stringify(standard).toLowerCase().includes(initialQuery.toLowerCase()));
  const [search, setSearch] = useState(initialStandardIds ? "" : initialQuery);
  const [selectedId, setSelectedId] = useState(initialStandard?.id ?? OSHA_STANDARDS[0].id);
  const records = OSHA_STANDARDS.filter((standard) => (!referenceIds?.length || referenceIds.includes(standard.id)) && JSON.stringify(standard).toLowerCase().includes(search.toLowerCase()));
  const selected = records.find((standard) => standard.id === selectedId) ?? records[0];
  return <main className="study-system-page page-width"><section className="system-hero"><div><p className="eyebrow"><ShieldCheck size={16} /> OSHA knowledge network</p><h1>Standards Explorer</h1><p>Find the rule, then move directly to its key numbers, definitions, questions, hazards, formulas, and your notes.</p></div><div className="system-hero-stat"><strong>{OSHA_STANDARDS.length}</strong><span>core standards mapped</span></div></section><div className="standards-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search standards" placeholder="Standard number or topic" /></div>{referenceIds && <section className="reference-note" aria-label="Related hazard standards"><span>{referenceIds.length ? `Catalog connections for ${initialQuery}. Applicability has not been assessed.` : `No standard IDs are mapped for ${initialQuery} yet. Browse the existing catalog below.`}</span><button type="button" className="secondary-button" onClick={() => { setReferenceIds(undefined); setSearch(""); }}>Show all standards</button></section>}<div className="standards-layout"><nav aria-label="Standards results">{records.map((standard) => <button className={selected?.id === standard.id ? "active" : ""} key={standard.id} aria-current={selected?.id === standard.id ? "true" : undefined} onClick={() => { setSelectedId(standard.id); updateResourceRoute({view:"standards",itemId:standard.id}); }}><small>{standard.citation}</small><strong>{standard.title}</strong></button>)}</nav>{selected ? <article className="standard-detail"><div className="standard-heading"><div><p className="eyebrow">{selected.citation}</p><h2>{selected.title}</h2></div><BookmarkAction kind="standard" itemId={selected.id} title={`${selected.citation} ${selected.title}`} subtitle={selected.summary} system={system} onChange={onChange} /></div><p className="standard-summary">{selected.summary}</p><section><h3>Key numbers</h3><ul>{selected.keyNumbers.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Definitions to know</h3><ul>{selected.definitions.map((item) => <li key={item}>{item}</li>)}</ul></section><div className="standard-connections"><button onClick={() => onOpen("practice", selected.topics[0], { practiceTags: selected.topics })}><FileQuestion /><strong>Related Practice</strong><span>Search questions</span></button><button onClick={() => onOpen("library", selected.topics[0], {libraryTab:"formulas"})}><Library /><strong>Related formulas</strong><span>Open resources</span></button><button onClick={() => onOpen("library", selected.topics[0], { libraryTab: "hazards" })}><FlaskConical /><strong>Hazards</strong><span>Explore exposures</span></button></div><a className="official-link" href={selected.officialUrl} target="_blank" rel="noreferrer">Open current OSHA standard <ExternalLink /></a><p className="reference-note">Study summary only. Use the linked OSHA page for current regulatory language and applicability.</p></article> : <div className="empty-state"><Search /><h2>No standards match</h2></div>}</div></main>;
}

export function BookmarkAction({ kind, itemId, title, subtitle, chapterId, system, onChange, labels }: { kind: NotebookKind; itemId: string; title: string; subtitle?: string; chapterId?: string; system: StudySystemState; onChange: (system: StudySystemState) => void; labels?: { save: string; saved: string; saveLabel: string; removeLabel: string } }) {
  const id = `${kind}:${kind === "hazard" ? canonicalHazardId(itemId) : itemId}`;
  const compatibleKeys = kind === "hazard" ? hazardNotebookKeys(itemId) : [id];
  const saved = compatibleKeys.some(key => Boolean(system.notebook[key]));
  const [confirmRemove,setConfirmRemove]=useState(false);
  const hasNote=compatibleKeys.some(key=>Boolean(system.notebook[key]?.note.trim()));
  function toggle() { const notebook = { ...system.notebook }; if (saved) { for (const key of compatibleKeys) delete notebook[key]; } else notebook[id] = { id, kind, title, subtitle, chapterId, note: "", createdAt: Date.now(), updatedAt: Date.now() }; onChange({ ...system, notebook }); }
  if(confirmRemove && saved)return <span className="bookmark-confirm" role="group" aria-label={labels?"تأكيد إزالة الملاحظة المحفوظة":"Confirm saved note removal"}><span>{labels?"إزالة العنصر المحفوظ وملاحظته؟":"Remove saved item and its note?"}</span><button type="button" onClick={()=>{toggle();setConfirmRemove(false);}}>{labels?"إزالة العنصر والملاحظة":"Remove item and note"}</button><button type="button" onClick={()=>setConfirmRemove(false)}>{labels?"الاحتفاظ بالملاحظة":"Keep note"}</button></span>;
  return <button type="button" className={`bookmark-action ${saved ? "saved" : ""}`} onClick={()=>saved&&hasNote?setConfirmRemove(true):toggle()} aria-label={saved ? labels?.removeLabel ?? `Remove ${title} from notebook` : labels?.saveLabel ?? `Save ${title} to notebook`} title={saved ? labels?.saved ?? "Saved to notebook" : labels?.save ?? "Save to notebook"}><Star fill={saved ? "currentColor" : "none"} aria-hidden="true" /> <span>{saved ? labels?.saved ?? "Saved" : labels?.save ?? "Save"}</span></button>;
}

export function MistakeClassifier({ attempt, system, onChange }: { attempt: Attempt; system: StudySystemState; onChange: (system: StudySystemState) => void }) {
  if (attempt.correct) return null;
  const key = attemptKey(attempt);
  return <label className="mistake-classifier"><span>Why did this happen?</span><select value={system.mistakeReasons[key] ?? ""} onChange={(event) => onChange({ ...system, mistakeReasons: { ...system.mistakeReasons, [key]: event.target.value as MistakeReason } })}><option value="" disabled>Classify this miss</option>{MISTAKE_REASONS.map((reason) => <option value={reason} key={reason}>{reason}</option>)}</select></label>;
}

export function MistakeInsight({ system }: { system: StudySystemState }) { return <div className="mistake-insight"><Sparkles /><div><strong>Coach pattern</strong><p>{mistakeInsight(system.mistakeReasons)}</p></div></div>; }

export function Onboarding({ activeExam, examDate, completedChapterIds, onComplete, onCancel }: { onCancel?:()=>void; activeExam: "ASP" | "CSP"; examDate: string; completedChapterIds: string[]; onComplete: (values: { activeExam: "ASP" | "CSP"; examDate: string; completedChapterIds: string[] }) => void }) {
  const dialog = useDialogFocus(true,onCancel);
  const [exam, setExam] = useState(activeExam);
  const [date, setDate] = useState(examDate);
  const [selectedChapters, setSelectedChapters] = useState<string[]>(completedChapterIds);
  const [chaptersOpen, setChaptersOpen] = useState(true);
  const [chapterSearch, setChapterSearch] = useState("");
  const visibleChapters = STUDY_CHAPTERS.filter((chapter) => `${chapter.courseNumber} ${chapter.title}`.toLowerCase().includes(chapterSearch.trim().toLowerCase()));
  const toggleChapter = (chapterId: string) => setSelectedChapters((current) => current.includes(chapterId) ? current.filter((id) => id !== chapterId) : [...current, chapterId]);
  return <div className="modal-backdrop onboarding-backdrop">
    <section ref={dialog} tabIndex={-1} className="modal onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      {onCancel&&<button className="icon-button modal-close" onClick={onCancel} aria-label="Close setup without changes"><X/></button>}
      <div className="onboarding-mark"><ShieldCheck /></div>
      <p className="eyebrow">Two-minute setup</p>
      <h2 id="onboarding-title">Start with a useful plan today</h2>
      <p className="modal-lead">Tell the coach where you are. You can change this later.</p>
      <div className="onboarding-track" role="group" aria-label="Exam track"><button className={exam === "ASP" ? "active" : ""} aria-pressed={exam === "ASP"} onClick={() => setExam("ASP")}><strong>ASP</strong><span>Associate Safety Professional</span></button><button className={exam === "CSP" ? "active" : ""} aria-pressed={exam === "CSP"} onClick={() => setExam("CSP")}><strong>CSP</strong><span>Certified Safety Professional</span></button></div>
      <label className="onboarding-field"><span>Approximate exam date <small>optional</small></span><input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} /></label>
      <fieldset className="onboarding-chapters">
        <legend>Chapters already finished</legend>
        <p>Select any chapters you completed; they do not need to be consecutive.</p>
        <button type="button" className="chapter-select-trigger" aria-expanded={chaptersOpen} aria-controls="onboarding-chapter-options" onClick={() => setChaptersOpen((open) => !open)}><span><strong>{selectedChapters.length} selected</strong><small>{selectedChapters.length ? "Your finished chapters will be skipped in the initial plan." : "I am starting fresh"}</small></span><ChevronDown className={chaptersOpen ? "rotated" : ""} /></button>
        {chaptersOpen && <div className="chapter-multiselect" id="onboarding-chapter-options">
          <div className="chapter-multiselect-toolbar"><label><Search /><input value={chapterSearch} onChange={(event) => setChapterSearch(event.target.value)} placeholder="Search chapters" aria-label="Search completed chapters" /></label><div><button type="button" onClick={() => setSelectedChapters(STUDY_CHAPTERS.map((chapter) => chapter.id))}>Select all</button><button type="button" disabled={!selectedChapters.length} onClick={() => setSelectedChapters([])}>Clear</button></div></div>
          <div className="chapter-checkbox-list" aria-label="Completed chapters">{visibleChapters.map((chapter) => <label aria-label={`Chapter ${chapter.courseNumber}: ${chapter.title}`} htmlFor={`completed-${chapter.id}`} key={chapter.id}><input id={`completed-${chapter.id}`} type="checkbox" checked={selectedChapters.includes(chapter.id)} onChange={() => toggleChapter(chapter.id)} /><span><b>Chapter {chapter.courseNumber}</b><strong>{chapter.title}</strong></span></label>)}{!visibleChapters.length && <p className="chapter-search-empty">No chapters match that search.</p>}</div>
          <p className="chapter-selection-status" role="status" aria-live="polite">{selectedChapters.length} of {STUDY_CHAPTERS.length} chapters selected</p>
        </div>}
      </fieldset>
      <button className="primary-button full onboarding-submit" onClick={() => onComplete({ activeExam: exam, examDate: date, completedChapterIds: selectedChapters })}>Build my study plan <ChevronRight /></button>
    </section>
  </div>;
}

export interface CoachTask { id: string; title: string; detail: string; action: ResourceView; query?: string; chapterId?: string; }
export function CoachPlan({ tasks, completions, onToggle, onOpen }: { tasks: CoachTask[]; completions: Record<string, boolean>; onToggle: (id: string) => void; onOpen: (view: ResourceView, query?: string, chapterId?: string) => void }) {
  const done = tasks.filter((task) => completions[task.id]).length;
  return <div className="coach-plan"><div className="coach-plan-progress"><span><b>{done}/{tasks.length}</b> complete</span><i><em style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }} /></i></div>{tasks.map((task, index) => <div className={`coach-task ${completions[task.id] ? "complete" : ""}`} key={task.id}><button className="coach-task-check" onClick={() => onToggle(task.id)} aria-label={`Mark ${task.title} ${completions[task.id] ? "incomplete" : "complete"}`}>{completions[task.id] && <Check />}</button><button className="coach-task-body" onClick={() => onOpen(task.action, task.query, task.chapterId)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{task.title}</strong><small>{task.detail}</small></div><ChevronRight /></button></div>)}</div>;
}

export function QuestionTools({ formulaQuery = "" }: { formulaQuery?: string }) {
  const [open, setOpen] = useState<"calculator" | "formulas" | null>(null);
  const [hasOpenedCalculator, setHasOpenedCalculator] = useState(false);
  const toolsId = useId();
  const calculatorButton = useRef<HTMLButtonElement>(null);
  const formulaButton = useRef<HTMLButtonElement>(null);
  const formulas = useMemo(() => { const terms = formulaQuery.toLowerCase().split(/\W+/).filter((term) => term.length > 3); const ranked = FORMULA_ENTRIES.map((entry) => ({ entry, score: terms.filter((term) => `${entry.name} ${entry.whenToUse} ${entry.category}`.toLowerCase().includes(term)).length })).sort((a, b) => b.score - a.score); return ranked.slice(0, 8).map(({ entry }) => entry); }, [formulaQuery]);
  return (
    <div className="question-tools" data-open={open ?? "none"}>
      <div className="question-tool-buttons">
        <button type="button" ref={calculatorButton} aria-expanded={open === "calculator"} aria-controls={`${toolsId}-calculator`} onClick={() => {
          setHasOpenedCalculator(true);
          setOpen(open === "calculator" ? null : "calculator");
        }}><Calculator aria-hidden="true" /> TI-30XS Calculator</button>
        <button type="button" ref={formulaButton} aria-expanded={open === "formulas"} aria-controls={`${toolsId}-formulas`} onClick={() => setOpen(open === "formulas" ? null : "formulas")}><BookMarked aria-hidden="true" /> Formula sheet</button>
      </div>
      {/* Mount on first use, then hide rather than unmount to preserve calculator work. */}
      {hasOpenedCalculator && <ScientificCalculator id={`${toolsId}-calculator`} hidden={open !== "calculator"} onClose={() => {
        setOpen(null);
        calculatorButton.current?.focus();
      }} />}
      {open === "formulas" && <aside id={`${toolsId}-formulas`} className="question-tool-drawer" aria-labelledby={`${toolsId}-formulas-title`}>
        <header><strong id={`${toolsId}-formulas-title`}>Formula sheet</strong><button type="button" onClick={() => {
          setOpen(null);
          formulaButton.current?.focus();
        }} aria-label="Close formula sheet"><X aria-hidden="true" /></button></header>
        <div className="inline-formulas">{formulas.map((entry) => <details key={entry.id}><summary><span>{entry.name}</span><b>{entry.formula}</b></summary><p><strong>Use when:</strong> {entry.whenToUse}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Trap:</strong> {entry.commonError}</p></details>)}</div>
      </aside>}
    </div>
  );
}

export function ExamTimeline({ examDate, completedChapters }: { examDate: string; completedChapters: number }) {
  const [timelineNow] = useState(() => Date.now());
  if (!examDate) return <div className="timeline-empty"><CalendarDays /><div><strong>Add an exam date</strong><span>The coach will distribute chapters, reviews, and mocks across the time available.</span></div></div>;
  const days = Math.max(0, Math.ceil((new Date(`${examDate}T12:00:00`).getTime() - timelineNow) / 86400000));
  const remaining = Math.max(0, STUDY_CHAPTERS.length - completedChapters);
  const weeks = Math.max(1, Math.ceil(days / 7));
  const perWeek = Math.max(1, Math.ceil(remaining / Math.max(1, weeks - 2)));
  return <div className="exam-timeline"><div className="countdown"><strong>{days}</strong><span>days to exam</span></div><div className="timeline-phases"><div><b>Now</b><span>{perWeek} chapters/week + mistake repair</span></div><div><b>{days > 21 ? "Final 2 weeks" : "This week"}</b><span>Mixed review + first mock</span></div><div><b>Final days</b><span>Formula, standards, and light recall</span></div></div></div>;
}
