"use client";

import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PRACTICE_V2_HAS_VERIFIED_CONTENT, PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import type { SearchTarget } from "./globalSearch";
import {
  PRACTICE_V2_COUNTS, practiceV2VerificationBadge, recordPracticeV2Answer,
  selectPracticeV2Questions, filterPracticeV2References,
  type PracticeV2Progress, type PracticeV2Question,
} from "./practiceV2";
import { BookmarkAction, QuestionTools } from "./StudySystem";
import type { StudySystemState } from "./studySystemState";
import { PageHeader, useLearningFocus } from "./ui/learning-ui";
import { useChapterPracticeProgress } from "./useChapterPracticeProgress";
import { updateResourceRoute } from "./coachRoutes";

type Runner = { questions: PracticeV2Question[]; mode: "practice" | "mistakes" };
type Focus = NonNullable<SearchTarget["practiceFocus"]>;
type Answer = { selected: number; confidence: "low" | "medium" | "high"; correct: boolean };
const focuses = [["balanced","Balanced"],["weak","Weak chapters"],["unseen","Unseen"],["mistakes","Mistakes only"],["calculation","Calculations"],["scenario","Scenarios"]] as const;

export default function PracticeV2({ searchTarget, system, onSystem }: { searchTarget?: (SearchTarget & { requestKey: number }) | null; system: StudySystemState; onSystem: (system: StudySystemState) => void }) {
  const [chapterMode, setChapterMode] = useState<"single" | "multiple">("single");
  const [related, setRelated] = useState(() => searchTarget?.practiceTags || searchTarget?.practiceQuestionIds ? { practiceTags: searchTarget.practiceTags, practiceQuestionIds: searchTarget.practiceQuestionIds } : searchTarget?.query && !searchTarget.chapterId && !searchTarget.itemId ? { practiceTags: [searchTarget.query] } : null);
  const available = useMemo(() => filterPracticeV2References(PRACTICE_V2_QUESTIONS, related).filter(q => q.reviewStatus !== "demo"), [related]);
  const chapters = useMemo(() => [...new Map(available.map(q => [q.chapterId,q.chapterTitle]))].map(([id,title])=>({id,title})), [available]);
  const [chapterIds, setChapterIds] = useState<string[]>(searchTarget?.chapterId ? [searchTarget.chapterId] : []);
  const [chapterSearch, setChapterSearch] = useState("");
  const [count, setCount] = useState<(typeof PRACTICE_V2_COUNTS)[number]>(10);
  const [focus, setFocus] = useState<Focus>(searchTarget?.practiceFocus ?? "balanced");
  const [progress, saveProgress] = useChapterPracticeProgress();
  const [error, setError] = useState("");
  const [runner, setRunner] = useState<Runner | null>(() => {
    const exact = searchTarget?.itemId ? PRACTICE_V2_QUESTIONS.find(q => q.id === searchTarget.itemId && q.reviewStatus !== "demo") : undefined;
    return exact ? {questions:[exact],mode:"practice"} : null;
  });
  const selected = chapterIds.filter(id=>chapters.some(c=>c.id===id));
  const effective = selected.length || chapterMode === "multiple" ? selected : chapters.slice(0,1).map(c=>c.id);
  const mistakes = available.filter(q=>progress.incorrectQuestionIds.includes(q.id)).length;
  function build(mode: Runner["mode"], chosenFocus = focus) {
    if (!effective.length) return [];
    const accuracy = (id:string) => { const a=Object.values(progress.attempts).filter(v=>v.chapterId===id); const n=a.reduce((s,v)=>s+v.attempts,0); return n ? a.reduce((s,v)=>s+v.correct,0)/n : 0; };
    const weak = [...effective].sort((a,b)=>accuracy(a)-accuracy(b)).slice(0,Math.max(1,Math.ceil(effective.length/2)));
    const filtered = available.filter(q =>
      (chosenFocus !== "weak" || weak.includes(q.chapterId)) &&
      (chosenFocus !== "unseen" || !progress.seenQuestionIds.includes(q.id)) &&
      (chosenFocus !== "mistakes" || progress.incorrectQuestionIds.includes(q.id)) &&
      (chosenFocus !== "calculation" || q.questionType === "calculation") &&
      (chosenFocus !== "scenario" || q.questionType === "scenario"));
    return selectPracticeV2Questions({questions:filtered,chapterIds:effective,count,progress,mode,seed:`${progress.seenQuestionIds.length}:${mode}:${chosenFocus}`});
  }
  const preview = build(focus==="mistakes"?"mistakes":"practice");
  function start(mode:Runner["mode"]) {
    const questions=build(mode,mode==="mistakes"?"mistakes":focus);
    if (!questions.length) { setError("No questions match this selection. Use Balanced or choose another chapter."); return; }
    setError(""); setRunner({questions,mode});
  }
  useLearningFocus(runner ? "runner" : "builder");
  function chooseChapter(id:string) {
    setChapterIds([id]);
    updateResourceRoute({view:"practice",chapterId:id,practiceFocus:focus,...(related ?? {})});
  }
  if (runner) return <PracticeV2Runner runner={runner} progress={progress} onProgress={saveProgress} onExit={()=>setRunner(null)} system={system} onSystem={onSystem}/>;
  if (process.env.NODE_ENV === "production" && !PRACTICE_V2_HAS_VERIFIED_CONTENT) return <main className="practice-v2-page"><PageHeader title="Practice is being prepared" description="Source-checked question packs will appear here when available."/></main>;
  return <main className="practice-v2-page">
    <PageHeader title="Chapter Practice" description="Choose a chapter, set your focus, and learn from each answer." eyebrow="Practice"><span className="scope-label">Saved on this device · separate from readiness</span></PageHeader>
    {related && <section className="context-banner"><div><strong>Related practice: {searchTarget?.query || "selected resources"}</strong><p>{available.length} source-checked questions match this topic.</p></div><button className="secondary-button" onClick={()=>{setRelated(null);setChapterIds([]);updateResourceRoute({view:"practice"});}}>Browse all chapters</button></section>}
    <section className="practice-v2-builder" aria-label="Build a Practice session">
      <fieldset><legend>1. Choose chapters</legend><div className="practice-v2-choice-row" role="group" aria-label="Chapter selection mode">{(["single","multiple"] as const).map(mode=><button key={mode} aria-pressed={chapterMode===mode} className={chapterMode===mode?"active":""} onClick={()=>{setChapterMode(mode);setChapterIds(effective.slice(0,1));}}>{mode==="single"?"One chapter":"Multiple chapters"}</button>)}</div>
        {chapterMode==="single" ? <label className="field-label">Chapter<select value={effective[0]??""} onChange={e=>chooseChapter(e.target.value)}>{!chapters.length&&<option value="">No matching chapters</option>}{chapters.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label> :
        <><label className="field-label">Find chapters<input type="search" value={chapterSearch} onChange={e=>setChapterSearch(e.target.value)} placeholder="Chapter title"/></label><div className="practice-v2-chapters">{chapters.filter(c=>c.title.toLowerCase().includes(chapterSearch.toLowerCase())).map(c=><label key={c.id}><input type="checkbox" checked={effective.includes(c.id)} onChange={e=>setChapterIds(e.target.checked?[...new Set([...effective,c.id])]:effective.filter(id=>id!==c.id))}/>{c.title}</label>)}</div><p>{effective.length} chapters selected</p></>}
      </fieldset>
      <fieldset><legend>2. Session length</legend><div className="practice-v2-choice-row" role="group" aria-label="Question count">{PRACTICE_V2_COUNTS.map(n=><button aria-pressed={count===n} className={count===n?"active":""} onClick={()=>setCount(n)} key={n}>{n} questions</button>)}</div></fieldset>
      <fieldset><legend>3. Learning focus</legend><div className="practice-v2-focus-grid" role="group" aria-label="Learning focus">{focuses.map(([value,label])=><button aria-pressed={focus===value} className={focus===value?"active":""} key={value} onClick={()=>{setFocus(value);setError("");updateResourceRoute({view:"practice",chapterId:effective[0],practiceFocus:value,...(related??{})});}}>{label}</button>)}</div></fieldset>
      <div className="practice-session-summary" role="status"><strong>{preview.length ? `${preview.length} questions ready` : "No matching questions"}</strong><p>{preview.length ? `From ${effective.length} selected chapter${effective.length===1?"":"s"}. No repeated item families.` : focus==="mistakes" ? "No recorded mistakes match these chapters. Try Balanced to build your practice history." : "Try another chapter or use Balanced to include all question types."}</p>{!preview.length&&<button className="secondary-button" onClick={()=>{setFocus("balanced");setError("");updateResourceRoute({view:"practice",chapterId:effective[0],practiceFocus:"balanced",...(related??{})});}}>Use Balanced</button>}</div>
      {error&&<p role="alert" className="inline-error">{error}</p>}
      <div className="practice-v2-actions"><button className="primary-button" disabled={!preview.length} onClick={()=>start(focus==="mistakes"?"mistakes":"practice")}>Start practice <ArrowRight size={18}/></button><button className="secondary-button" disabled={!mistakes} onClick={()=>start("mistakes")}><RotateCcw size={18}/>Review mistakes ({mistakes})</button></div>
      <div className="practice-mobile-start"><span><strong>{preview.length} questions</strong>{effective.length} chapter{effective.length===1?"":"s"} · {focuses.find(([value])=>value===focus)?.[1]}</span><button className="primary-button" disabled={!preview.length} onClick={()=>start(focus==="mistakes"?"mistakes":"practice")}>Start practice<ArrowRight size={16}/></button></div>
      <details className="learning-disclosure"><summary>How progress and source checking work</summary><p>Chapter Practice is saved in this browser, not synced to your account. You can find its activity in Analytics and Review. It does not change Homework, adaptive block scores, Mock Exams, or the Practice Readiness Indicator.</p><p>These practice questions were checked against cited study and regulatory sources. They are not official BCSP questions and have not necessarily been reviewed by an instructor. They are not psychometrically calibrated.</p></details>
    </section>
  </main>;
}

function PracticeV2Runner({runner,progress,onProgress,onExit,system,onSystem}:{runner:Runner;progress:PracticeV2Progress;onProgress:(p:PracticeV2Progress)=>void;onExit:()=>void;system:StudySystemState;onSystem:(s:StudySystemState)=>void}) {
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [confidence,setConfidence]=useState<Answer["confidence"]>("medium");
  const [answers,setAnswers]=useState<Record<string,Answer>>({});
  const [finished,setFinished]=useState(false);
  const [saveError,setSaveError]=useState("");
  const question=runner.questions[index];
  const recorded=answers[question.id];
  const choice=recorded?.selected??selected;
  const correctCount=Object.values(answers).filter(a=>a.correct).length;
  useLearningFocus(finished?"finished":question.id);
  function move(next:number){setIndex(next);setSelected(null);setConfidence("medium");}
  function submit() {
    if(selected===null||recorded)return;
    try {
      onProgress(recordPracticeV2Answer(progress,question.id,selected===question.correctOptionIndex,confidence==="high",new Date().toISOString(),question.chapterId,question.chapterTitle));
      setAnswers({...answers,[question.id]:{selected,confidence,correct:selected===question.correctOptionIndex}});
      setSaveError("");
    } catch { setSaveError("Your answer could not be saved on this device. Check available browser storage, then try Check answer again."); }
  }
  if(finished)return <main className="practice-v2-page"><PageHeader title="Practice complete" description="Your answers are saved on this device. These results are separate from exam readiness."/><section className="practice-completion"><div className="completion-score"><strong>{correctCount} / {runner.questions.length}</strong><span>correct in this session</span></div><h2>{correctCount===runner.questions.length?"All questions answered correctly":"Your next review"}</h2><p>{Object.values(answers).filter(a=>!a.correct&&a.confidence==="high").length} high-confidence misses</p>{runner.questions.filter(q=>!answers[q.id]?.correct).map(q=><button className="session-review-row" key={q.id} onClick={()=>{move(runner.questions.indexOf(q));setFinished(false);}}><span>{q.concept}</span><ArrowRight size={18}/></button>)}<div className="practice-v2-actions"><button className="primary-button" onClick={onExit}>Build another session</button><button className="secondary-button" onClick={()=>{move(0);setFinished(false);}}>Review my answers</button></div></section></main>;
  return <main className="homework-runner practice-v2-runner">
    <header className="homework-runner-header"><button className="secondary-button" onClick={onExit}><X size={18}/>Exit</button><div><small>Chapter Practice · saved on this device</small><strong>{question.chapterTitle}</strong></div><span>{index+1} / {runner.questions.length}</span></header>
    <div className="homework-progress" role="progressbar" aria-label="Session answered" aria-valuemin={0} aria-valuemax={runner.questions.length} aria-valuenow={Object.keys(answers).length}><i style={{width:`${Object.keys(answers).length/runner.questions.length*100}%`}}/></div>
    <div className="question-workspace"><section className="homework-question-card">
      <div className="question-meta"><span>{question.concept}</span><span className="difficulty-chip">{question.cognitiveLevel}</span></div>
      <div className="question-personal-row"><span className="practice-v2-verification-badge">{practiceV2VerificationBadge(question)}</span><BookmarkAction kind="question" itemId={question.id} title={question.stem} subtitle={question.chapterTitle} chapterId={question.chapterId} system={system} onChange={onSystem}/></div>
      <h1 tabIndex={-1}>{question.stem}</h1>
      <div className="answer-list" role="group" aria-label="Answer options">{question.options.map((option,i)=><button key={i} aria-pressed={choice===i} disabled={!!recorded} className={`answer${choice===i?" selected":""}${recorded&&i===question.correctOptionIndex?" correct":""}${recorded&&choice===i&&!recorded.correct?" incorrect":""}`} onClick={()=>setSelected(i)}><span>{String.fromCharCode(65+i)}</span><strong>{option}</strong>{choice===i&&<Check size={18}/>}</button>)}</div>
      {!recorded&&<div className="practice-v2-confidence" role="group" aria-label="Confidence in this answer"><span>Confidence</span>{(["low","medium","high"] as const).map(v=><button key={v} aria-pressed={confidence===v} className={confidence===v?"active":""} onClick={()=>setConfidence(v)}>{v}</button>)}</div>}
      {saveError&&<p role="alert" className="inline-error">{saveError}</p>}
      {recorded&&<div className={`practice-feedback ${recorded.correct?"correct":"incorrect"}`} role="status"><strong>{recorded.correct?"Correct":recorded.confidence==="high"?"High-confidence miss":"Incorrect"}</strong><p>{question.correctAnswerExplanation}</p><details><summary>Why the other options are incorrect</summary>{question.options.map((_,i)=>i===question.correctOptionIndex?null:<p key={i}><b>{String.fromCharCode(65+i)}.</b> {question.incorrectOptionExplanations[i]}</p>)}</details>{question.formula&&<p><b>Formula:</b> {question.formula}</p>}{question.units&&<p><b>Units:</b> {question.units}</p>}</div>}
      <div className="homework-nav"><button className="secondary-button" disabled={!index} onClick={()=>move(index-1)}><ArrowLeft size={18}/>Previous</button>{recorded?<button className="primary-button" onClick={()=>index===runner.questions.length-1?setFinished(true):move(index+1)}>{index===runner.questions.length-1?"Finish session":"Next question"}<ArrowRight size={18}/></button>:<button className="primary-button" disabled={selected===null} onClick={submit}>Check answer<Check size={18}/></button>}</div>
      <details className="learning-disclosure"><summary>Source and verification</summary><p>{question.sourceTitle} · {question.sourceLocation}</p><p>Source-checked study material, not official BCSP questions or a calibrated readiness assessment.</p></details>
    </section><QuestionTools formulaQuery={`${question.stem} ${question.concept} ${question.chapterTitle}`}/></div>
  </main>;
}
