"use client";
import { useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { SearchTarget } from "./globalSearch";
import type { LearningProgress } from "./learningProgress";
import { PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import { CHAPTERS, HOMEWORK_QUESTIONS } from "./homeworkData";
import { useChapterPracticeProgress } from "./useChapterPracticeProgress";
import { updateResourceRoute } from "./coachRoutes";
import { PageHeader } from "./ui/learning-ui";

export default function LearningActivity({ view, target, learning, onOpen, children }: { view: "stats" | "review"; target?: SearchTarget | null; learning: LearningProgress; onOpen: (target: SearchTarget) => void; children: ReactNode }) {
  const [source, setSource] = useState(target?.reviewSource ?? "adaptive");
  const [query, setQuery] = useState(target?.query ?? "");
  const [mistakesOnly, setMistakesOnly] = useState(view === "review");
  const [limit, setLimit] = useState(24);
  const [practice] = useChapterPracticeProgress();
  const rows = PRACTICE_V2_QUESTIONS.filter(q => practice.attempts[q.id]);
  const attempts = Object.values(practice.attempts).reduce((s,a)=>s+a.attempts,0);
  const correct = Object.values(practice.attempts).reduce((s,a)=>s+a.correct,0);
  const filtered = rows.filter(q => (!mistakesOnly || practice.incorrectQuestionIds.includes(q.id)) && `${q.stem} ${q.chapterTitle} ${q.concept}`.toLowerCase().includes(query.toLowerCase()));
  const homework = CHAPTERS.filter(c=>learning.chapterScores[c.id]);
  function change(next: typeof source) { setSource(next); setQuery(""); setLimit(24); updateResourceRoute({view,reviewSource:next},true); }
  return <div className="activity-shell">
    <nav className="activity-source-tabs page-width" aria-label="Learning evidence source">{([["adaptive","Adaptive & mock"],["chapter","Chapter Practice"],["homework","Homework"]] as const).map(([id,label])=><button key={id} aria-pressed={source===id} onClick={()=>change(id)}>{label}</button>)}</nav>
    {source==="adaptive" ? children : <main className="study-system-page page-width">
      <PageHeader title={`${view==="review"?"Review":"Analytics"} · ${source==="chapter"?"Chapter Practice":"Homework"}`} description={source==="chapter"?"Activity saved in this browser. It is not cloud-synced and does not change the Practice Readiness Indicator.":"Completed chapter assignments from your learner profile. Homework scores are separate from exam readiness."}/>
      {source==="chapter" ? <>
        <section className="activity-metrics" aria-label="Chapter Practice summary"><div><strong>{attempts}</strong><span>answers recorded</span></div><div><strong>{attempts?`${Math.round(correct/attempts*100)}%`:"—"}</strong><span>{attempts?"overall answer accuracy":"no answers yet"}</span></div><div><strong>{practice.incorrectQuestionIds.length}</strong><span>questions to revisit</span></div></section>
        <div className="learning-filter-bar"><label className="field-label">Search practiced questions<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);updateResourceRoute({view,reviewSource:source,query:e.target.value});}} placeholder="Chapter, concept, or question"/></label><label className="checkbox-filter"><input type="checkbox" checked={mistakesOnly} onChange={e=>setMistakesOnly(e.target.checked)}/>Mistakes only</label></div>
        <p className="scope-label">Per-question totals and latest mistake status are available. Earlier answer choices were not stored.</p>
        <section className="activity-list">{filtered.length?filtered.slice(0,limit).map(q=><article key={q.id}><div><span className="scope-label">{q.chapterTitle}</span><h2>{q.concept}</h2><p>{q.stem}</p><small>{practice.attempts[q.id].correct} correct / {practice.attempts[q.id].attempts} attempts · {practice.incorrectQuestionIds.includes(q.id)?"Last answer incorrect":"Last answer correct"}{practice.highConfidenceIncorrectQuestionIds.includes(q.id)?" · High-confidence miss":""}</small></div><button className="secondary-button" onClick={()=>onOpen({view:"practice",itemId:q.id})}>Practice again<ArrowRight size={17}/></button></article>):<div className="empty-state"><h2>{rows.length?"No questions match":"Your practice history starts here"}</h2><p>{rows.length?"Clear the search or turn off Mistakes only to see all practiced questions.":"Complete a Chapter Practice question to see its activity here."}</p><button className="primary-button" onClick={()=>rows.length?(setQuery(""),setMistakesOnly(false)):onOpen({view:"practice"})}>{rows.length?"Show all practiced questions":"Start Chapter Practice"}</button></div>}</section>{filtered.length>limit&&<button className="secondary-button" onClick={()=>setLimit(limit+24)}>Show more ({filtered.length-limit} remaining)</button>}
      </> : <section className="activity-list">{homework.length?homework.map(c=>{const s=learning.chapterScores[c.id];const misses=HOMEWORK_QUESTIONS.filter(q=>q.chapterId===c.id&&s.missedQuestionIds.includes(q.id));return <article key={c.id}><div><span className="scope-label">Course chapter {c.courseNumber}</span><h2>{c.courseTitle}</h2><p>{s.lastScore}/{s.total} correct in the latest assignment · {s.attempts} completed attempts</p>{view==="review"&&<details><summary>{misses.length} questions to review</summary>{misses.map(q=><div className="homework-review-item" key={q.id}><h3>{q.stem}</h3><p>{q.rationale}</p></div>)}</details>}</div><button className="secondary-button" onClick={()=>onOpen({view:"homework",chapterId:c.id})}>Open chapter<ArrowRight size={17}/></button></article>}):<div className="empty-state"><h2>No completed Homework yet</h2><p>Complete an assignment to see chapter scores and review its questions.</p><button className="primary-button" onClick={()=>onOpen({view:"homework"})}>Choose a chapter</button></div>}</section>}
    </main>}
  </div>;
}
