"use client";

import { useMemo, useState } from "react";
import { BookMarked, Calculator, CalendarDays, Check, ChevronRight, ExternalLink, FileQuestion, FlaskConical, Library, NotebookPen, Search, ShieldCheck, Sparkles, Star, Target, X } from "lucide-react";
import type { Attempt } from "./adaptiveEngine";
import type { LearningProgress } from "./learningProgress";
import { loadPracticeV2Progress, type PracticeV2Progress } from "./practiceV2";
import { PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import { FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";
import { HAZARD_RECORDS } from "./hazardData";
import { OSHA_STANDARDS } from "./standardsData";
import { MISTAKE_REASONS, attemptKey, mistakeInsight, type MistakeReason, type NotebookEntry, type NotebookKind, type StudySystemState } from "./studySystemState";

export const STUDY_CHAPTERS = [...new Map(PRACTICE_V2_QUESTIONS.filter((question) => question.reviewStatus !== "demo").map((question) => [question.chapterId, question.chapterTitle])).entries()].map(([id, title], index) => ({ id, title, courseNumber: index + 1 }));

type ResourceView = "homework" | "practice" | "key-information" | "library" | "review" | "standards" | "notebook" | "mastery";

function relatedCount(chapterTitle: string, values: string[]) {
  const terms = chapterTitle.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 4);
  return values.filter((value) => terms.some((term) => value.toLowerCase().includes(term))).length;
}

export function ChapterMasteryMap({ learning, attempts, onOpen }: { learning: LearningProgress; attempts: Attempt[]; onOpen: (view: ResourceView, query?: string, chapterId?: string) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "strong" | "developing" | "weak" | "not-enough">("all");
  const [practice] = useState<PracticeV2Progress>(() => typeof window === "undefined" ? { schemaVersion: 1, seenQuestionIds: [], incorrectQuestionIds: [], highConfidenceIncorrectQuestionIds: [], attempts: {} } : loadPracticeV2Progress(window.localStorage));
  const records = STUDY_CHAPTERS.map((chapter) => {
    const questionIds = PRACTICE_V2_QUESTIONS.filter((question) => question.chapterId === chapter.id).map((question) => question.id);
    const practiceAttempts = questionIds.reduce((sum, id) => sum + (practice.attempts[id]?.attempts ?? 0), 0);
    const practiceCorrect = questionIds.reduce((sum, id) => sum + (practice.attempts[id]?.correct ?? 0), 0);
    const homework = learning.chapterScores[chapter.id];
    const evidence = practiceAttempts + (homework?.total ?? 0);
    const score = evidence ? Math.round(((practiceCorrect + (homework?.lastScore ?? 0)) / evidence) * 100) : 0;
    const status = evidence < 5 ? "not-enough" : score >= 80 ? "strong" : score >= 65 ? "developing" : "weak";
    return { ...chapter, evidence, score, status };
  });
  const visible = filter === "all" ? records : records.filter((record) => record.status === filter);
  const selected = records.find((record) => record.id === selectedId);
  const statusLabel = (status: string) => status === "not-enough" ? "Not enough evidence" : status[0].toUpperCase() + status.slice(1);
  return <main className="study-system-page page-width">
    <section className="system-hero"><div><p className="eyebrow"><Target size={16} /> 40-chapter evidence map</p><h1>Chapter mastery</h1><p>One view connects what you know to exactly what to do next. Statuses use current Homework and Chapter Practice evidence.</p></div><div className="system-hero-stat"><strong>{records.filter((item) => item.status === "strong").length}</strong><span>chapters strong</span></div></section>
    <div className="mastery-filters" role="group" aria-label="Filter mastery"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All 40</button>{(["strong", "developing", "weak", "not-enough"] as const).map((value) => <button className={filter === value ? `active ${value}` : value} onClick={() => setFilter(value)} key={value}>{statusLabel(value)} <b>{records.filter((record) => record.status === value).length}</b></button>)}</div>
    <div className="mastery-layout"><section className="mastery-grid" aria-label="Chapter mastery map">{visible.map((chapter) => <button key={chapter.id} className={`mastery-tile ${chapter.status} ${selectedId === chapter.id ? "selected" : ""}`} onClick={() => setSelectedId(chapter.id)}><span>{String(chapter.courseNumber).padStart(2, "0")}</span><strong>{chapter.title}</strong><small>{statusLabel(chapter.status)}{chapter.evidence ? ` · ${chapter.score}%` : ""}</small><i style={{ width: `${chapter.score}%` }} /></button>)}</section>
      <aside className={`chapter-hub ${selected ? "open" : ""}`}>{selected ? <><button className="icon-button chapter-hub-close" onClick={() => setSelectedId(null)} aria-label="Close chapter"><X /></button><p className="eyebrow">Chapter {selected.courseNumber}</p><h2>{selected.title}</h2><div className={`mastery-status-large ${selected.status}`}><strong>{statusLabel(selected.status)}</strong><span>{selected.evidence} evidence points{selected.evidence ? ` · ${selected.score}% correct` : ""}</span></div><p className="chapter-hub-prompt">Open any connected resource without losing the chapter context.</p><div className="chapter-links"><button onClick={() => onOpen("practice", selected.title, selected.id)}><FileQuestion /><span><strong>Practice</strong><small>{PRACTICE_V2_QUESTIONS.filter((q) => q.chapterId === selected.id && q.reviewStatus !== "demo").length} questions</small></span><ChevronRight /></button><button onClick={() => onOpen("homework", selected.title, selected.id)}><BookMarked /><span><strong>Homework</strong><small>Chapter assignment and review</small></span><ChevronRight /></button><button onClick={() => onOpen("review", selected.title)}><Target /><span><strong>Your mistakes</strong><small>{attempts.filter((attempt) => `${attempt.competency} ${attempt.referenceTopic}`.toLowerCase().includes(selected.title.toLowerCase())).length} related attempts</small></span><ChevronRight /></button><button onClick={() => onOpen("library", selected.title)}><Calculator /><span><strong>Formulas</strong><small>{relatedCount(selected.title, FORMULA_ENTRIES.map((entry) => `${entry.name} ${entry.whenToUse}`))} related cards</small></span><ChevronRight /></button><button onClick={() => onOpen("library", selected.title)}><FlaskConical /><span><strong>Hazards & flashcards</strong><small>{relatedCount(selected.title, [...FLASHCARDS.map((card) => `${card.front} ${card.tags.join(" ")}`), ...HAZARD_RECORDS.map((hazard) => JSON.stringify(hazard))])} connections</small></span><ChevronRight /></button><button onClick={() => onOpen("notebook", selected.title, selected.id)}><NotebookPen /><span><strong>Notes</strong><small>Open your study notebook</small></span><ChevronRight /></button></div></> : <div className="chapter-hub-empty"><Target /><h2>Select a chapter</h2><p>Its questions, Homework, errors, formulas, hazards, flashcards, and notes will appear here.</p></div>}</aside>
    </div>
  </main>;
}

export function StudyNotebook({ system, onChange, initialQuery = "" }: { system: StudySystemState; onChange: (system: StudySystemState) => void; initialQuery?: string }) {
  const [search, setSearch] = useState(initialQuery);
  const [kind, setKind] = useState<NotebookKind | "all">("all");
  const entries = Object.values(system.notebook).sort((a, b) => b.updatedAt - a.updatedAt).filter((entry) => (kind === "all" || entry.kind === kind) && `${entry.title} ${entry.subtitle ?? ""} ${entry.note}`.toLowerCase().includes(search.toLowerCase()));
  function update(entry: NotebookEntry, note: string) { onChange({ ...system, notebook: { ...system.notebook, [entry.id]: { ...entry, note, updatedAt: Date.now() } } }); }
  function remove(id: string) { const notebook = { ...system.notebook }; delete notebook[id]; onChange({ ...system, notebook }); }
  return <main className="study-system-page page-width"><section className="system-hero"><div><p className="eyebrow"><NotebookPen size={16} /> Personal knowledge layer</p><h1>My Study Notebook</h1><p>Everything you star stays here with your own notes, regardless of where it lives in the course.</p></div><div className="system-hero-stat"><strong>{Object.keys(system.notebook).length}</strong><span>saved resources</span></div></section><div className="notebook-toolbar"><label><Search /><input aria-label="Search notebook" placeholder="Search saved items and notes" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select value={kind} onChange={(event) => setKind(event.target.value as NotebookKind | "all")}><option value="all">All resource types</option>{(["question", "formula", "hazard", "flashcard", "chapter", "standard"] as const).map((value) => <option value={value} key={value}>{value[0].toUpperCase() + value.slice(1)}s</option>)}</select></div>{entries.length ? <section className="notebook-grid">{entries.map((entry) => <article className="notebook-card" key={entry.id}><header><span><Star size={15} fill="currentColor" /> {entry.kind}</span><button onClick={() => remove(entry.id)} aria-label={`Remove ${entry.title}`}><X /></button></header><h2>{entry.title}</h2>{entry.subtitle && <p>{entry.subtitle}</p>}<label>Your note<textarea value={entry.note} placeholder="Add a memory cue, question, or connection…" onChange={(event) => update(entry, event.target.value)} /></label><small>Updated {new Date(entry.updatedAt).toLocaleDateString()}</small></article>)}</section> : <div className="empty-state notebook-empty"><NotebookPen /><h2>{Object.keys(system.notebook).length ? "No saved items match" : "Your notebook is ready"}</h2><p>Use the star beside a question, formula, hazard, flashcard, chapter, or standard to save it here.</p></div>}</main>;
}

export function StandardsExplorer({ system, onChange, onOpen, initialQuery = "" }: { system: StudySystemState; onChange: (system: StudySystemState) => void; onOpen: (view: ResourceView, query?: string) => void; initialQuery?: string }) {
  const initialStandard = OSHA_STANDARDS.find((standard) => JSON.stringify(standard).toLowerCase().includes(initialQuery.toLowerCase()));
  const [search, setSearch] = useState(initialQuery);
  const [selectedId, setSelectedId] = useState(initialStandard?.id ?? OSHA_STANDARDS[0].id);
  const records = OSHA_STANDARDS.filter((standard) => JSON.stringify(standard).toLowerCase().includes(search.toLowerCase()));
  const selected = records.find((standard) => standard.id === selectedId) ?? records[0];
  return <main className="study-system-page page-width"><section className="system-hero"><div><p className="eyebrow"><ShieldCheck size={16} /> OSHA knowledge network</p><h1>Standards Explorer</h1><p>Find the rule, then move directly to its key numbers, definitions, questions, hazards, formulas, and your notes.</p></div><div className="system-hero-stat"><strong>{OSHA_STANDARDS.length}</strong><span>core standards mapped</span></div></section><div className="standards-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try 1910.95, noise, fit test, or confined space" /></div><div className="standards-layout"><nav aria-label="Standards results">{records.map((standard) => <button className={selected?.id === standard.id ? "active" : ""} key={standard.id} onClick={() => setSelectedId(standard.id)}><small>{standard.citation}</small><strong>{standard.title}</strong></button>)}</nav>{selected ? <article className="standard-detail"><div className="standard-heading"><div><p className="eyebrow">{selected.citation}</p><h2>{selected.title}</h2></div><BookmarkAction kind="standard" itemId={selected.id} title={`${selected.citation} ${selected.title}`} subtitle={selected.summary} system={system} onChange={onChange} /></div><p className="standard-summary">{selected.summary}</p><section><h3>Key numbers</h3><ul>{selected.keyNumbers.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Definitions to know</h3><ul>{selected.definitions.map((item) => <li key={item}>{item}</li>)}</ul></section><div className="standard-connections"><button onClick={() => onOpen("practice", selected.topics[0])}><FileQuestion /><strong>Related Practice</strong><span>Search questions</span></button><button onClick={() => onOpen("library", selected.topics[0])}><Library /><strong>Formula & flashcards</strong><span>Open resources</span></button><button onClick={() => onOpen("library", selected.topics[0])}><FlaskConical /><strong>Hazards</strong><span>Explore exposures</span></button></div><a className="official-link" href={selected.officialUrl} target="_blank" rel="noreferrer">Open current OSHA standard <ExternalLink /></a><p className="reference-note">Study summary only. Use the linked OSHA page for current regulatory language and applicability.</p></article> : <div className="empty-state"><Search /><h2>No standards match</h2></div>}</div></main>;
}

export function BookmarkAction({ kind, itemId, title, subtitle, chapterId, system, onChange }: { kind: NotebookKind; itemId: string; title: string; subtitle?: string; chapterId?: string; system: StudySystemState; onChange: (system: StudySystemState) => void }) {
  const id = `${kind}:${itemId}`;
  const saved = system.notebook[id];
  function toggle() { const notebook = { ...system.notebook }; if (saved) delete notebook[id]; else notebook[id] = { id, kind, title, subtitle, chapterId, note: "", createdAt: Date.now(), updatedAt: Date.now() }; onChange({ ...system, notebook }); }
  return <button type="button" className={`bookmark-action ${saved ? "saved" : ""}`} onClick={toggle} aria-label={saved ? `Remove ${title} from notebook` : `Save ${title} to notebook`} title={saved ? "Saved to notebook" : "Save to notebook"}><Star fill={saved ? "currentColor" : "none"} /> <span>{saved ? "Saved" : "Save"}</span></button>;
}

export function MistakeClassifier({ attempt, system, onChange }: { attempt: Attempt; system: StudySystemState; onChange: (system: StudySystemState) => void }) {
  if (attempt.correct) return null;
  const key = attemptKey(attempt);
  return <label className="mistake-classifier"><span>Why did this happen?</span><select value={system.mistakeReasons[key] ?? ""} onChange={(event) => onChange({ ...system, mistakeReasons: { ...system.mistakeReasons, [key]: event.target.value as MistakeReason } })}><option value="" disabled>Classify this miss</option>{MISTAKE_REASONS.map((reason) => <option value={reason} key={reason}>{reason}</option>)}</select></label>;
}

export function MistakeInsight({ system }: { system: StudySystemState }) { return <div className="mistake-insight"><Sparkles /><div><strong>Coach pattern</strong><p>{mistakeInsight(system.mistakeReasons)}</p></div></div>; }

export function Onboarding({ activeExam, examDate, onComplete }: { activeExam: "ASP" | "CSP"; examDate: string; onComplete: (values: { activeExam: "ASP" | "CSP"; examDate: string; completedChapterIds: string[] }) => void }) {
  const [exam, setExam] = useState(activeExam);
  const [date, setDate] = useState(examDate);
  const [through, setThrough] = useState(0);
  return <div className="modal-backdrop onboarding-backdrop"><section className="modal onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div className="onboarding-mark"><ShieldCheck /></div><p className="eyebrow">Two-minute setup</p><h2 id="onboarding-title">Start with a useful plan today</h2><p className="modal-lead">Tell the coach where you are. You can change this later.</p><div className="onboarding-track"><button className={exam === "ASP" ? "active" : ""} onClick={() => setExam("ASP")}><strong>ASP</strong><span>Associate Safety Professional</span></button><button className={exam === "CSP" ? "active" : ""} onClick={() => setExam("CSP")}><strong>CSP</strong><span>Certified Safety Professional</span></button></div><label className="onboarding-field"><span>Approximate exam date <small>optional</small></span><input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} /></label><label className="onboarding-field"><span>Chapters already finished</span><select value={through} onChange={(event) => setThrough(Number(event.target.value))}><option value={0}>I am starting fresh</option>{STUDY_CHAPTERS.map((chapter, index) => <option value={index + 1} key={chapter.id}>Through chapter {index + 1}: {chapter.title}</option>)}</select></label><button className="primary-button full" onClick={() => onComplete({ activeExam: exam, examDate: date, completedChapterIds: STUDY_CHAPTERS.slice(0, through).map((chapter) => chapter.id) })}>Build my study plan <ChevronRight /></button></section></div>;
}

export interface CoachTask { id: string; title: string; detail: string; action: ResourceView; query?: string; }
export function CoachPlan({ tasks, completions, onToggle, onOpen }: { tasks: CoachTask[]; completions: Record<string, boolean>; onToggle: (id: string) => void; onOpen: (view: ResourceView, query?: string) => void }) {
  const done = tasks.filter((task) => completions[task.id]).length;
  return <div className="coach-plan"><div className="coach-plan-progress"><span><b>{done}/{tasks.length}</b> complete</span><i><em style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }} /></i></div>{tasks.map((task, index) => <div className={`coach-task ${completions[task.id] ? "complete" : ""}`} key={task.id}><button className="coach-task-check" onClick={() => onToggle(task.id)} aria-label={`Mark ${task.title} ${completions[task.id] ? "incomplete" : "complete"}`}>{completions[task.id] && <Check />}</button><button className="coach-task-body" onClick={() => onOpen(task.action, task.query)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{task.title}</strong><small>{task.detail}</small></div><ChevronRight /></button></div>)}</div>;
}

function evaluateExpression(input: string) {
  const source = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/π/g, String(Math.PI)).replace(/√/g, "sqrt").replace(/\s/g, "");
  if (!source || /[^0-9+*/().%^a-z-]/i.test(source)) throw new Error("Invalid expression");
  let position = 0;
  const parsePrimary = (): number => { if (source.slice(position, position + 4) === "sqrt") { position += 4; if (source[position++] !== "(") throw new Error(); const value = parseAdd(); if (source[position++] !== ")") throw new Error(); return Math.sqrt(value); } if (source[position] === "(") { position++; const value = parseAdd(); if (source[position++] !== ")") throw new Error(); return value; } const match = source.slice(position).match(/^\d*\.?\d+(?:e[-+]?\d+)?/i); if (!match) throw new Error(); position += match[0].length; return Number(match[0]); };
  const parseUnary = (): number => source[position] === "-" ? (position++, -parseUnary()) : source[position] === "+" ? (position++, parseUnary()) : parsePrimary();
  const parsePower = (): number => { let value = parseUnary(); while (source[position] === "^") { position++; value **= parseUnary(); } return value; };
  const parseMultiply = (): number => { let value = parsePower(); while (["*", "/", "%"].includes(source[position])) { const operation = source[position++]; const right = parsePower(); value = operation === "*" ? value * right : operation === "/" ? value / right : value % right; } return value; };
  const parseAdd = (): number => { let value = parseMultiply(); while (["+", "-"].includes(source[position])) { const operation = source[position++]; const right = parseMultiply(); value = operation === "+" ? value + right : value - right; } return value; };
  const result = parseAdd(); if (position !== source.length || !Number.isFinite(result)) throw new Error(); return result;
}

export function QuestionTools({ formulaQuery = "" }: { formulaQuery?: string }) {
  const [open, setOpen] = useState<"calculator" | "formulas" | null>(null);
  const [expression, setExpression] = useState("");
  const [answer, setAnswer] = useState("");
  const formulas = useMemo(() => { const terms = formulaQuery.toLowerCase().split(/\W+/).filter((term) => term.length > 3); const ranked = FORMULA_ENTRIES.map((entry) => ({ entry, score: terms.filter((term) => `${entry.name} ${entry.whenToUse} ${entry.category}`.toLowerCase().includes(term)).length })).sort((a, b) => b.score - a.score); return ranked.slice(0, 8).map(({ entry }) => entry); }, [formulaQuery]);
  function calculate() { try { setAnswer(String(Number(evaluateExpression(expression).toPrecision(10)))); } catch { setAnswer("Check expression"); } }
  return <div className="question-tools"><div className="question-tool-buttons"><button onClick={() => setOpen(open === "calculator" ? null : "calculator")}><Calculator /> TI-30XS Calculator</button><button onClick={() => setOpen(open === "formulas" ? null : "formulas")}><BookMarked /> Formula sheet</button></div>{open && <aside className="question-tool-drawer">{open === "calculator" ? <><div className="calculator-display"><small>TI-30XS study calculator</small><input value={expression} onChange={(event) => setExpression(event.target.value)} onKeyDown={(event) => event.key === "Enter" && calculate()} placeholder="(12.5 × 8) ÷ 4" /><strong>{answer || "0"}</strong></div><div className="calculator-keys">{["7", "8", "9", "÷", "√(", "4", "5", "6", "×", "^", "1", "2", "3", "-", "(", "0", ".", "%", "+", ")"].map((key) => <button key={key} onClick={() => setExpression((value) => value + key)}>{key}</button>)}<button onClick={() => { setExpression(""); setAnswer(""); }}>AC</button><button onClick={() => setExpression((value) => value.slice(0, -1))}>DEL</button><button onClick={() => setExpression((value) => value + "π")}>π</button><button className="equals" onClick={calculate}>=</button></div></> : <><header><strong>Formula sheet</strong><button onClick={() => setOpen(null)} aria-label="Close formula sheet"><X /></button></header><div className="inline-formulas">{formulas.map((entry) => <details key={entry.id}><summary><span>{entry.name}</span><b>{entry.formula}</b></summary><p><strong>Use when:</strong> {entry.whenToUse}</p><p><strong>Units:</strong> {entry.units}</p><p className="formula-warning"><strong>Trap:</strong> {entry.commonError}</p></details>)}</div></>}</aside>}</div>;
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
