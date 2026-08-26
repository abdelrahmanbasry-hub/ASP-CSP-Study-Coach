"use client";

import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PRACTICE_V2_HAS_VERIFIED_CONTENT, PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import {
  PRACTICE_V2_COUNTS,
  emptyPracticeV2Progress,
  loadPracticeV2Progress,
  practiceV2VerificationBadge,
  recordPracticeV2Answer,
  savePracticeV2Progress,
  selectPracticeV2Questions,
  type PracticeV2Progress,
  type PracticeV2Question,
} from "./practiceV2";

type Runner = { questions: PracticeV2Question[]; mode: "practice" | "mistakes" };

export default function PracticeV2() {
  const [chapterMode, setChapterMode] = useState<"single" | "multiple">("single");
  const chapters = useMemo(() => {
    const unique = new Map<string, string>();
    PRACTICE_V2_QUESTIONS.forEach((question) => unique.set(question.chapterId, question.chapterTitle));
    return [...unique].map(([id, title]) => ({ id, title }));
  }, []);
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const [count, setCount] = useState<(typeof PRACTICE_V2_COUNTS)[number]>(10);
  const [progress, setProgress] = useState<PracticeV2Progress>(emptyPracticeV2Progress);
  const [runner, setRunner] = useState<Runner | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(loadPracticeV2Progress(window.localStorage)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectedChapters = chapterIds.filter((id) => chapters.some((chapter) => chapter.id === id));
  const effectiveChapters = selectedChapters.length ? selectedChapters : chapters.slice(0, 1).map((chapter) => chapter.id);
  const start = (mode: Runner["mode"]) => {
    const questions = selectPracticeV2Questions({ questions: PRACTICE_V2_QUESTIONS, chapterIds: effectiveChapters, count, progress, mode, seed: `${progress.seenQuestionIds.length}:${mode}` });
    if (questions.length) setRunner({ questions, mode });
  };
  if (runner) return <PracticeV2Runner runner={runner} progress={progress} onProgress={(next) => { setProgress(next); savePracticeV2Progress(window.localStorage, next); }} onExit={() => setRunner(null)} />;

  if (process.env.NODE_ENV === "production" && !PRACTICE_V2_HAS_VERIFIED_CONTENT) {
    return <main className="practice-v2-page"><section className="practice-v2-coming"><p className="eyebrow">Chapter practice</p><h1>Coming soon</h1><p>Practice will open after source-checked or human-reviewed question packs are imported. Homework, Mock Exams, progress, and readiness are unchanged.</p></section></main>;
  }

  const mistakeCount = PRACTICE_V2_QUESTIONS.filter((question) => progress.incorrectQuestionIds.includes(question.id)).length;
  const previewCount = selectPracticeV2Questions({ questions: PRACTICE_V2_QUESTIONS, chapterIds: effectiveChapters, count, progress, mode: "practice", seed: `${progress.seenQuestionIds.length}:practice` }).length;
  return <main className="practice-v2-page">
    <section className="practice-v2-hero">
      <div><div className="practice-title-line"><h1>Practice</h1><strong>Setup</strong></div><p>Build a practice session tailored to your goals.</p></div>
      {!PRACTICE_V2_HAS_VERIFIED_CONTENT && <aside><strong>DEMO ONLY</strong><span>These two placeholders test the interface. They are not approved study content.</span></aside>}
    </section>
    <section className="practice-v2-builder" aria-label="Build a Practice session">
      <div className="practice-config-grid">
        <div className="practice-config-card">
          <fieldset aria-label="Chapters or topics"><legend>1. Choose Chapters / Topics</legend><div className="practice-v2-choice-row"><button className={chapterMode === "single" ? "active" : ""} onClick={() => { setChapterMode("single"); setChapterIds(chapterIds.slice(0, 1)); }}>One Chapter</button><button className={chapterMode === "multiple" ? "active" : ""} onClick={() => setChapterMode("multiple")}>Multiple Chapters</button></div>
            <span className="field-label">Select chapter</span>
            {chapterMode === "single" ? <select aria-label="Select chapter" value={effectiveChapters[0] ?? ""} onChange={(event) => setChapterIds(event.target.value ? [event.target.value] : [])}>{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select>
              : <div className="practice-v2-chapters">{chapters.map((chapter) => <label key={chapter.id}><input type="checkbox" checked={effectiveChapters.includes(chapter.id)} onChange={(event) => setChapterIds(event.target.checked ? [...new Set([...effectiveChapters, chapter.id])] : effectiveChapters.filter((id) => id !== chapter.id))} /> {chapter.title}</label>)}</div>}
          </fieldset>
          <fieldset><legend>2. Session Length</legend><div className="practice-v2-choice-row">{PRACTICE_V2_COUNTS.map((value) => <button className={count === value ? "active" : ""} key={value} onClick={() => setCount(value)}>{value}</button>)}</div><p>Shorter sessions are created if there are not enough distinct item families.</p></fieldset>
        </div>
        <div className="practice-config-card practice-options-card">
          <fieldset><legend>3. Question Filters</legend><div className="practice-setting-row"><span>Question Type</span><strong>Multiple Choice</strong></div><div className="practice-setting-row"><span>Content status</span><strong>{PRACTICE_V2_HAS_VERIFIED_CONTENT ? "Source-checked" : "Unavailable"}</strong></div><div className="practice-setting-row"><span>Include unanswered</span><i className="setting-toggle active" aria-label="Enabled" /></div><div className="practice-setting-row"><span>Avoid repeated families</span><i className="setting-toggle active" aria-label="Enabled" /></div></fieldset>
          <fieldset><legend>4. Additional Options</legend><div className="practice-check-row"><Check size={15} /> Show explanations after each answer</div><div className="practice-check-row"><Check size={15} /> Capture confidence with each answer</div></fieldset>
          <button className="mistake-review-button" disabled={!mistakeCount} onClick={() => start("mistakes")}><RotateCcw size={15} /> Mistake Review <span>{mistakeCount}</span></button>
        </div>
      </div>
      <div className="practice-summary-strip"><div><span>You will practice</span><strong>{effectiveChapters.length === 1 ? chapters.find((chapter) => chapter.id === effectiveChapters[0])?.title : `${effectiveChapters.length} chapters`}</strong></div><div><span>Questions available</span><strong>{previewCount}{previewCount < count ? ` of ${count} requested` : ""}</strong></div><div><span>Pacing</span><strong>Self-paced</strong></div><button className="primary-button" disabled={!effectiveChapters.length || !previewCount} onClick={() => start("practice")}>Start Practice <ArrowRight size={16} /></button></div>
      <p className="practice-v2-isolation">Chapter Practice uses its own browser progress record and does not update Homework, legacy Practice, Mock Exams, cloud synchronization, or the Practice Readiness Indicator. Chapter Practice results are not psychometrically calibrated.</p>
      {PRACTICE_V2_HAS_VERIFIED_CONTENT && <p className="practice-v2-disclaimer">These practice questions were checked against cited study and regulatory sources. They are not official BCSP questions and have not necessarily been reviewed by an instructor.</p>}
    </section>
  </main>;
}

function PracticeV2Runner({ runner, progress, onProgress, onExit }: { runner: Runner; progress: PracticeV2Progress; onProgress: (progress: PracticeV2Progress) => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"low" | "medium" | "high">("medium");
  const [checked, setChecked] = useState(false);
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
    <div className="practice-session-layout"><aside className="practice-session-meta"><div><span>Chapter</span><strong>{question.chapterTitle}</strong></div><div><span>Topic</span><strong>{question.concept}</strong></div><div><span>Question type</span><strong>Multiple choice</strong></div><div><span>Cognitive level</span><strong>{question.cognitiveLevel}</strong></div><button className="secondary-button" onClick={onExit}>End session</button></aside><section className="homework-question-card"><div className="question-meta"><span>{question.chapterTitle} · {question.concept}</span><span className="difficulty-chip">{question.cognitiveLevel}</span></div><div className="practice-v2-verification-badge">{practiceV2VerificationBadge(question)}</div>{question.verificationStatus !== "unverified" && <p className="practice-v2-runner-disclaimer">These practice questions were checked against cited study and regulatory sources. They are not official BCSP questions and have not necessarily been reviewed by an instructor.</p>}<h1>{question.stem}</h1>
      <div className="answer-list">{question.options.map((option, optionIndex) => <button disabled={checked} className={`answer${selected === optionIndex ? " selected" : ""}${checked && optionIndex === question.correctOptionIndex ? " correct" : ""}${checked && selected === optionIndex && !correct ? " incorrect" : ""}`} key={`${question.id}:${optionIndex}`} onClick={() => setSelected(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span><strong>{option}</strong>{selected === optionIndex && <Check size={18} />}</button>)}</div>
      {!checked && <div className="practice-v2-confidence"><span>Confidence</span>{(["low", "medium", "high"] as const).map((value) => <button className={confidence === value ? "active" : ""} key={value} onClick={() => setConfidence(value)}>{value}</button>)}</div>}
      {checked && <div className={`practice-feedback ${correct ? "correct" : "incorrect"}`}><strong>{correct ? "Correct" : confidence === "high" ? "High-confidence miss" : "Incorrect"}</strong><p><b>Why the correct option is correct:</b> {question.correctAnswerExplanation}</p><div className="practice-v2-option-feedback"><b>Why each incorrect option is wrong:</b>{question.options.map((option, optionIndex) => optionIndex === question.correctOptionIndex ? null : <p key={optionIndex}><span>{String.fromCharCode(65 + optionIndex)}.</span> {question.incorrectOptionExplanations[optionIndex]}</p>)}</div>{question.formula && <p><b>Formula:</b> {question.formula}</p>}{question.units && <p><b>Units:</b> {question.units}</p>}</div>}
      <div className="homework-nav"><button className="secondary-button" disabled={index === 0} onClick={() => { setIndex(Math.max(0, index - 1)); setSelected(null); setChecked(false); }}><ArrowLeft size={16} /> Previous</button>{checked ? <button className="primary-button" onClick={advance}>{index === runner.questions.length - 1 ? "Finish" : "Next"} <ArrowRight size={16} /></button> : <button className="primary-button" disabled={selected === null} onClick={submit}>Check answer <Check size={16} /></button>}</div>
    </section></div>
  </main>;
}
