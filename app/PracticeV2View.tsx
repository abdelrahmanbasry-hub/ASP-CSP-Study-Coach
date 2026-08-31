"use client";

import { ArrowLeft, ArrowRight, Check, FlaskConical, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PRACTICE_V2_HAS_VERIFIED_CONTENT, PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import type { SearchTarget } from "./globalSearch";
import type { ResourceReferences } from "./hazardTypes";
import {
  PRACTICE_V2_COUNTS,
  emptyPracticeV2Progress,
  loadPracticeV2Progress,
  practiceV2VerificationBadge,
  recordPracticeV2Answer,
  savePracticeV2Progress,
  selectPracticeV2Questions,
  filterPracticeV2References,
  type PracticeV2Progress,
  type PracticeV2Question,
} from "./practiceV2";
import { BookmarkAction, QuestionTools } from "./StudySystem";
import type { StudySystemState } from "./studySystemState";

type Runner = { questions: PracticeV2Question[]; mode: "practice" | "mistakes" };

export default function PracticeV2({ searchTarget, system, onSystem }: { searchTarget?: (SearchTarget & { requestKey: number }) | null; system: StudySystemState; onSystem: (system: StudySystemState) => void }) {
  const [chapterMode, setChapterMode] = useState<"single" | "multiple">("single");
  const [relatedReferences, setRelatedReferences] = useState<ResourceReferences | null>(() => searchTarget?.practiceTags || searchTarget?.practiceQuestionIds ? { practiceTags: searchTarget.practiceTags, practiceQuestionIds: searchTarget.practiceQuestionIds } : null);
  const availableQuestions = useMemo(() => filterPracticeV2References(PRACTICE_V2_QUESTIONS, relatedReferences), [relatedReferences]);
  const chapters = useMemo(() => {
    const unique = new Map<string, string>();
    availableQuestions.filter((question) => question.reviewStatus !== "demo").forEach((question) => unique.set(question.chapterId, question.chapterTitle));
    return [...unique].map(([id, title]) => ({ id, title }));
  }, [availableQuestions]);
  const [chapterIds, setChapterIds] = useState<string[]>(searchTarget?.chapterId ? [searchTarget.chapterId] : []);
  const [count, setCount] = useState<(typeof PRACTICE_V2_COUNTS)[number]>(10);
  const [focus, setFocus] = useState<"balanced" | "weak" | "unseen" | "mistakes" | "calculation" | "scenario">("balanced");
  const [progress, setProgress] = useState<PracticeV2Progress>(emptyPracticeV2Progress);
  const [runner, setRunner] = useState<Runner | null>(() => {
    const exactQuestion = searchTarget?.itemId ? PRACTICE_V2_QUESTIONS.find((question) => question.id === searchTarget.itemId) : undefined;
    return exactQuestion ? { questions: [exactQuestion], mode: "practice" } : null;
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(loadPracticeV2Progress(window.localStorage)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectedChapters = chapterIds.filter((id) => chapters.some((chapter) => chapter.id === id));
  const effectiveChapters = selectedChapters.length ? selectedChapters : chapters.slice(0, 1).map((chapter) => chapter.id);
  const start = (mode: Runner["mode"]) => {
    const chapterAccuracy = Object.fromEntries(chapters.map((chapter) => { const attempts = Object.values(progress.attempts).filter((item) => item.chapterId === chapter.id); const total = attempts.reduce((sum, item) => sum + item.attempts, 0); const correct = attempts.reduce((sum, item) => sum + item.correct, 0); return [chapter.id, total ? correct / total : 0]; }));
    const weakestIds = [...effectiveChapters].sort((a, b) => (chapterAccuracy[a] ?? 0) - (chapterAccuracy[b] ?? 0)).slice(0, Math.max(1, Math.ceil(effectiveChapters.length / 2)));
    const filtered = availableQuestions.filter((question) => {
      if (question.reviewStatus === "demo") return false;
      if (focus === "weak" && !weakestIds.includes(question.chapterId)) return false;
      if (focus === "unseen" && progress.seenQuestionIds.includes(question.id)) return false;
      if (focus === "mistakes" && !progress.incorrectQuestionIds.includes(question.id)) return false;
      if (focus === "calculation" && question.questionType !== "calculation") return false;
      if (focus === "scenario" && question.questionType !== "scenario") return false;
      return true;
    });
    const questions = selectPracticeV2Questions({ questions: filtered, chapterIds: effectiveChapters, count, progress, mode: mode === "mistakes" || focus === "mistakes" ? "mistakes" : "practice", seed: `${progress.seenQuestionIds.length}:${mode}:${focus}` });
    if (questions.length) setRunner({ questions, mode });
  };
  if (runner) return <PracticeV2Runner runner={runner} progress={progress} onProgress={(next) => { setProgress(next); savePracticeV2Progress(window.localStorage, next); }} onExit={() => setRunner(null)} system={system} onSystem={onSystem} />;

  if (process.env.NODE_ENV === "production" && !PRACTICE_V2_HAS_VERIFIED_CONTENT) {
    return <main className="practice-v2-page"><section className="practice-v2-coming"><p className="eyebrow">Chapter practice</p><h1>Coming soon</h1><p>Practice will open after source-checked or human-reviewed question packs are imported. Homework, Mock Exams, progress, and readiness are unchanged.</p></section></main>;
  }

  const mistakeCount = availableQuestions.filter((question) => progress.incorrectQuestionIds.includes(question.id)).length;
  return <main className="practice-v2-page">
    <section className="practice-v2-hero">
      <div><p className="eyebrow"><FlaskConical size={16} /> Chapter-first practice</p><h1>Practice</h1><p>Choose one or more chapters or topics. New items are prioritized, and no item family repeats within a session.</p></div>
      {!PRACTICE_V2_HAS_VERIFIED_CONTENT && <aside><strong>DEMO ONLY</strong><span>These two placeholders test the interface. They are not approved study content.</span></aside>}
    </section>
    {relatedReferences && <section className="practice-v2-builder" aria-label="Related hazard practice"><h2>Related Practice: {searchTarget?.query}</h2><p>{availableQuestions.filter((question) => question.reviewStatus !== "demo").length ? `${availableQuestions.filter((question) => question.reviewStatus !== "demo").length} existing questions match the referenced topics. Choose a chapter below to begin.` : "No related verified questions are available yet. No new questions were created for this hazard."}</p><button type="button" className="secondary-button" onClick={() => setRelatedReferences(null)}>Browse all Practice</button></section>}
    <section className="practice-v2-builder" aria-label="Build a Practice session">
      <fieldset><legend>1. Chapters or topics</legend><div className="practice-v2-choice-row"><button className={chapterMode === "single" ? "active" : ""} onClick={() => { setChapterMode("single"); setChapterIds(chapterIds.slice(0, 1)); }}>One chapter</button><button className={chapterMode === "multiple" ? "active" : ""} onClick={() => setChapterMode("multiple")}>Multiple chapters</button></div>
        {chapterMode === "single" ? <select aria-label="Select chapter" value={effectiveChapters[0] ?? ""} onChange={(event) => setChapterIds(event.target.value ? [event.target.value] : [])}>{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select>
          : <div className="practice-v2-chapters">{chapters.map((chapter) => <label key={chapter.id}><input type="checkbox" checked={effectiveChapters.includes(chapter.id)} onChange={(event) => setChapterIds(event.target.checked ? [...new Set([...effectiveChapters, chapter.id])] : effectiveChapters.filter((id) => id !== chapter.id))} /> {chapter.title}</label>)}</div>}
      </fieldset>
      <fieldset><legend>2. Session length</legend><div className="practice-v2-choice-row">{PRACTICE_V2_COUNTS.map((value) => <button className={count === value ? "active" : ""} key={value} onClick={() => setCount(value)}>{value}</button>)}</div><p>Shorter sessions are created when the verified pack does not contain enough distinct item families.</p></fieldset>
      <fieldset><legend><SlidersHorizontal size={16} /> 3. Focus</legend><div className="practice-v2-focus-grid">{([['balanced','Balanced'],['weak','Weak only'],['unseen','Unseen only'],['mistakes','Mistakes only'],['calculation','Calculations'],['scenario','Scenario-based']] as const).map(([value, label]) => <button className={focus === value ? "active" : ""} key={value} onClick={() => setFocus(value)}>{label}</button>)}</div><p>The builder prioritizes the selected evidence type and still avoids duplicate item families.</p></fieldset>
      <div className="practice-v2-actions"><button className="primary-button" disabled={!effectiveChapters.length} onClick={() => start("practice")}>Start practice <ArrowRight size={16} /></button><button className="secondary-button" disabled={!mistakeCount} onClick={() => start("mistakes")}><RotateCcw size={16} /> Mistake Review ({mistakeCount})</button></div>
      <p className="practice-v2-isolation">Chapter Practice uses its own browser progress record and does not update Homework, legacy Practice, Mock Exams, cloud synchronization, or the Practice Readiness Indicator. Chapter Practice results are not psychometrically calibrated.</p>
      {PRACTICE_V2_HAS_VERIFIED_CONTENT && <p className="practice-v2-disclaimer">These practice questions were checked against cited study and regulatory sources. They are not official BCSP questions and have not necessarily been reviewed by an instructor.</p>}
    </section>
  </main>;
}

function PracticeV2Runner({ runner, progress, onProgress, onExit, system, onSystem }: { runner: Runner; progress: PracticeV2Progress; onProgress: (progress: PracticeV2Progress) => void; onExit: () => void; system: StudySystemState; onSystem: (system: StudySystemState) => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"low" | "medium" | "high">("medium");
  const [checked, setChecked] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const question = runner.questions[index];
  const correct = selected === question.correctOptionIndex;
  const advance = () => { if (index === runner.questions.length - 1) return onExit(); setIndex(index + 1); setSelected(null); setConfidence("medium"); setChecked(false); };
  const submit = () => {
    if (selected === null) return;
    const next = recordPracticeV2Answer(progress, question.id, selected === question.correctOptionIndex, confidence === "high", new Date().toISOString(), question.chapterId, question.chapterTitle);
    onProgress(next);
    setChecked(true);
  };
  return <main className="homework-runner practice-v2-runner">
    <header className="homework-runner-header"><button className="secondary-button" onClick={onExit}><X size={16} /> Exit</button><div><small>{runner.mode === "mistakes" ? "Mistake Review" : "Practice"}</small><strong>{question.chapterTitle}</strong></div><span>{index + 1}/{runner.questions.length}</span></header>
    <div className="homework-progress"><i style={{ width: `${((index + 1) / runner.questions.length) * 100}%` }} /></div>
    <div className="question-workspace">
    <section className="homework-question-card" onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const distance = event.changedTouches[0].clientX - touchStart; if (distance > 70 && index > 0) { setIndex(index - 1); setSelected(null); setChecked(false); } else if (distance < -70 && checked) advance(); setTouchStart(null); }}><div className="question-meta"><span>{question.chapterTitle} · {question.concept}</span><span className="difficulty-chip">{question.cognitiveLevel}</span></div><div className="question-personal-row"><div className="practice-v2-verification-badge">{practiceV2VerificationBadge(question)}</div><BookmarkAction kind="question" itemId={question.id} title={question.stem} subtitle={`${question.chapterTitle} · ${question.concept}`} chapterId={question.chapterId} system={system} onChange={onSystem} /></div>{question.verificationStatus !== "unverified" && <p className="practice-v2-runner-disclaimer">These practice questions were checked against cited study and regulatory sources. They are not official BCSP questions and have not necessarily been reviewed by an instructor.</p>}<h1>{question.stem}</h1>
      <div className="answer-list">{question.options.map((option, optionIndex) => <button disabled={checked} className={`answer${selected === optionIndex ? " selected" : ""}${checked && optionIndex === question.correctOptionIndex ? " correct" : ""}${checked && selected === optionIndex && !correct ? " incorrect" : ""}`} key={`${question.id}:${optionIndex}`} onClick={() => setSelected(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span><strong>{option}</strong>{selected === optionIndex && <Check size={18} />}</button>)}</div>
      {!checked && <div className="practice-v2-confidence"><span>Confidence</span>{(["low", "medium", "high"] as const).map((value) => <button className={confidence === value ? "active" : ""} key={value} onClick={() => setConfidence(value)}>{value}</button>)}</div>}
      {checked && <div className={`practice-feedback ${correct ? "correct" : "incorrect"}`}><strong>{correct ? "Correct" : confidence === "high" ? "High-confidence miss" : "Incorrect"}</strong><p><b>Why the correct option is correct:</b> {question.correctAnswerExplanation}</p><div className="practice-v2-option-feedback"><b>Why each incorrect option is wrong:</b>{question.options.map((option, optionIndex) => optionIndex === question.correctOptionIndex ? null : <p key={optionIndex}><span>{String.fromCharCode(65 + optionIndex)}.</span> {question.incorrectOptionExplanations[optionIndex]}</p>)}</div>{question.formula && <p><b>Formula:</b> {question.formula}</p>}{question.units && <p><b>Units:</b> {question.units}</p>}</div>}
      <div className="homework-nav"><button className="secondary-button" disabled={index === 0} onClick={() => { setIndex(Math.max(0, index - 1)); setSelected(null); setChecked(false); }}><ArrowLeft size={16} /> Previous</button>{checked ? <button className="primary-button" onClick={advance}>{index === runner.questions.length - 1 ? "Finish" : "Next"} <ArrowRight size={16} /></button> : <button className="primary-button" disabled={selected === null} onClick={submit}>Check answer <Check size={16} /></button>}</div>
    </section>
    <QuestionTools formulaQuery={`${question.stem} ${question.concept} ${question.chapterTitle}`} />
    </div>
  </main>;
}
