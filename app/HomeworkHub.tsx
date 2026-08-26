"use client";

import { ArrowLeft, ArrowRight, BookOpenCheck, Check, ChevronDown, Grid2X2, List, LockKeyhole, SlidersHorizontal, Trophy, X } from "lucide-react";
import { useState } from "react";
import {
  CHAPTERS,
  HOMEWORK_QUESTIONS,
  REVIEW_QUESTIONS,
  type HomeworkQuestion,
} from "./homeworkData";
import type { ChapterScore, LearningProgress } from "./learningProgress";

type Runner = {
  chapterId: string;
  kind: "homework" | "review";
  questions: readonly HomeworkQuestion[];
};

type HomeworkResult = {
  runner: Runner;
  answers: Record<number, number>;
  score: number;
  savedReview?: "all" | "missed";
};

export default function HomeworkHub({
  progress,
  onProgress,
}: {
  progress: LearningProgress;
  onProgress: (next: LearningProgress) => void;
}) {
  const [runner, setRunner] = useState<Runner | null>(null);
  const [result, setResult] = useState<HomeworkResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "ready" | "progress" | "completed">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const ready = CHAPTERS.filter((chapter) => chapter.status === "ready");
  const pending = CHAPTERS.filter((chapter) => chapter.status !== "ready");

  function begin(chapterId: string) {
    const selectedChapter = ready.find((chapter) => chapter.id === chapterId);
    const earlierCompleted = ready
      .filter(
        (chapter) =>
          selectedChapter &&
          chapter.courseNumber < selectedChapter.courseNumber &&
          progress.chapterScores[chapter.id],
      )
      .sort((a, b) => b.courseNumber - a.courseNumber)[0];
    if (earlierCompleted) {
      const missed = new Set(progress.chapterScores[earlierCompleted.id]?.missedQuestionIds ?? []);
      const warmup = REVIEW_QUESTIONS
        .filter((question) => question.chapterId === earlierCompleted.id)
        .sort((a, b) => Number(missed.has(b.sourceQuestionId ?? "")) - Number(missed.has(a.sourceQuestionId ?? "")))
        .slice(0, 5);
      if (warmup.length) {
        setRunner({ chapterId, kind: "review", questions: warmup });
        return;
      }
    }
    startHomework(chapterId);
  }

  function startHomework(chapterId: string) {
    const questions = HOMEWORK_QUESTIONS.filter((question) => question.chapterId === chapterId);
    setRunner({ chapterId, kind: "homework", questions });
  }

  function recordHomework(score: number, runnerState: Runner, answers: Record<number, number>) {
    if (runnerState.kind !== "homework") return;
    const previous = progress.chapterScores[runnerState.chapterId];
    const missedQuestionIds = runnerState.questions
      .filter((question, index) => answers[index] !== question.correctIndex)
      .map((question) => question.id);
    const lastAnswers: Record<string, number> = Object.fromEntries(
      runnerState.questions.map((question, index) => [question.id, answers[index] as number]),
    );
    const nextScore: ChapterScore = {
      chapterId: runnerState.chapterId,
      lastScore: score,
      bestScore: Math.max(previous?.bestScore ?? 0, score),
      total: runnerState.questions.length,
      attempts: (previous?.attempts ?? 0) + 1,
      completedAt: Date.now(),
      missedQuestionIds,
      lastAnswers,
    };
    onProgress({
      ...progress,
      chapterScores: { ...progress.chapterScores, [runnerState.chapterId]: nextScore },
    });
  }

  function openSavedReview(chapterId: string, kind: "all" | "missed") {
    const score = progress.chapterScores[chapterId];
    if (!score) return;
    const missedQuestionIds = score.missedQuestionIds ?? [];
    const allQuestions = HOMEWORK_QUESTIONS.filter((question) => question.chapterId === chapterId);
    const questions = kind === "missed"
      ? allQuestions.filter((question) => missedQuestionIds.includes(question.id))
      : allQuestions;
    if (!questions.length) return;
    const answers: Record<number, number> = {};
    questions.forEach((question, index) => {
      const answer = score.lastAnswers?.[question.id];
      if (answer !== undefined) answers[index] = answer;
    });
    const reviewScore = questions.filter((question, index) => answers[index] === question.correctIndex).length;
    setResult({ runner: { chapterId, kind: "homework", questions }, answers, score: reviewScore, savedReview: kind });
  }

  if (runner) {
    return (
      <HomeworkRunner
        runner={runner}
        onExit={() => setRunner(null)}
        onSkipWarmup={runner.kind === "review" ? () => startHomework(runner.chapterId) : undefined}
        onSubmit={(answers, score) => {
          recordHomework(score, runner, answers);
          setResult({ runner, answers, score });
          setRunner(null);
        }}
      />
    );
  }

  if (result) {
    return (
      <HomeworkResults
        result={result}
        onHome={() => setResult(null)}
        onContinue={() => {
          const chapterId = result.runner.chapterId;
          setResult(null);
          startHomework(chapterId);
        }}
      />
    );
  }

  const completed = ready.filter((chapter) => progress.chapterScores[chapter.id]).length;
  const visible = ready.filter((chapter) => {
    const score = progress.chapterScores[chapter.id];
    const percent = score ? Math.round((score.lastScore / score.total) * 100) : 0;
    if (statusFilter === "ready") return !score;
    if (statusFilter === "completed") return Boolean(score && percent >= 80);
    if (statusFilter === "progress") return Boolean(score && percent < 80);
    return true;
  });
  return (
    <main className="resource-page homework-page">
      <section className="page-width compact-page-header">
        <div><h1>Homework</h1><p>Assigned reading and activities by chapter.</p></div>
        <div className="homework-view-controls"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><Grid2X2 size={15} /> Grid</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><List size={15} /> List</button><button><SlidersHorizontal size={15} /> Filter</button></div>
      </section>

      <section className="page-width chapter-section compact-chapter-section">
        <div className="status-tabs" role="tablist" aria-label="Homework status">
          <button className={statusFilter === "all" ? "active" : ""} onClick={() => setStatusFilter("all")}>All Chapters <span>{ready.length}</span></button>
          <button className={statusFilter === "ready" ? "active" : ""} onClick={() => setStatusFilter("ready")}>To Do <span>{ready.length - completed}</span></button>
          <button className={statusFilter === "progress" ? "active" : ""} onClick={() => setStatusFilter("progress")}>In Progress</button>
          <button className={statusFilter === "completed" ? "active" : ""} onClick={() => setStatusFilter("completed")}>Completed <span>{completed}</span></button>
        </div>
        <div className={`homework-chapter-grid ${view === "list" ? "list-view" : ""}`}>
          {visible.map((chapter) => {
            const score = progress.chapterScores[chapter.id];
            const count = HOMEWORK_QUESTIONS.filter((question) => question.chapterId === chapter.id).length;
            const lastPercent = score ? Math.round((score.lastScore / score.total) * 100) : null;
            const complete = lastPercent !== null && lastPercent >= 80;
            const state = complete ? "completed" : score ? "progress" : "ready";
            return (
              <article className={`homework-chapter-card ${state}`} key={chapter.id}>
                <div className="homework-card-heading"><span className="chapter-icon"><BookOpenCheck size={17} /></span><div><h3>{chapter.courseNumber}. {chapter.courseTitle}</h3><span className={`homework-status ${state}`}>{complete ? "Completed" : score ? "In Progress" : "Ready to start"}</span></div></div>
                <p>{`Yates 3e Ch. ${chapter.yatesChapterNumber}: ${chapter.yatesChapterTitle}`}</p>
                <div className="chapter-progress-line"><span><strong>{lastPercent ?? 0}%</strong></span><i><b style={{ width: `${lastPercent ?? 0}%` }} /></i></div>
                <small>{score?.lastScore ?? 0}/{count} activities</small>
                <button className={complete ? "review-chapter-button" : "chapter-action-button"} onClick={() => complete ? openSavedReview(chapter.id, "all") : begin(chapter.id)}>{complete ? "Review" : score ? "Continue" : "Begin Chapter"}<ArrowRight size={15} /></button>
              </article>
            );
          })}
        </div>
      </section>

      {pending.length > 0 && (
        <section className="page-width coming-section">
          <div className="section-heading"><div><p className="eyebrow">Planned library</p><h2>Still waiting for source material</h2></div></div>
          <div className="coming-grid">{pending.map((chapter) => <div key={chapter.id}><span>CH {String(chapter.courseNumber).padStart(2, "0")}</span><strong>{chapter.courseTitle}</strong><small>Homework source not supplied yet</small></div>)}</div>
        </section>
      )}
    </main>
  );
}

function HomeworkRunner({ runner, onExit, onSkipWarmup, onSubmit }: { runner: Runner; onExit: () => void; onSkipWarmup?: () => void; onSubmit: (answers: Record<number, number>, score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const current = runner.questions[index];
  const answered = Object.keys(answers).length;
  const chapter = CHAPTERS.find((item) => item.id === runner.chapterId);
  const title = runner.kind === "review" ? `Previous-chapter warm-up for ${chapter?.courseTitle ?? "this chapter"}` : chapter?.courseTitle ?? "Chapter homework";
  return (
    <main className="homework-runner">
      <header className="homework-runner-header"><button className="secondary-button" onClick={onExit}><X size={16} /> Exit</button><div><small>{runner.kind === "review" ? "Retrieval warm-up" : "Homework assignment"}</small><strong>{title}</strong></div><div className="homework-runner-actions">{onSkipWarmup && <button className="text-button warmup-skip-button" onClick={onSkipWarmup}>Skip warm-up <ArrowRight size={15} /></button>}<span>{answered}/{runner.questions.length} answered</span></div></header>
      <div className="homework-progress"><i style={{ width: `${((index + 1) / runner.questions.length) * 100}%` }} /></div>
      <section className="homework-question-card">
        <div className="question-meta"><span>Question {index + 1} / {runner.questions.length}</span><span className="difficulty-chip">{current.difficulty}</span></div>
        <h1>{current.stem}</h1>
        <div className="answer-list">{current.options.map((option, optionIndex) => <button className={answers[index] === optionIndex ? "answer selected" : "answer"} key={option} onClick={() => setAnswers((existing) => ({ ...existing, [index]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span><strong>{option}</strong>{answers[index] === optionIndex && <Check size={18} />}</button>)}</div>
        <div className="homework-nav"><button className="secondary-button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}><ArrowLeft size={16} /> Previous</button>{index < runner.questions.length - 1 ? <button className="primary-button" onClick={() => setIndex((value) => value + 1)}>Next <ArrowRight size={16} /></button> : <button className="primary-button" disabled={answered < runner.questions.length} title={answered < runner.questions.length ? "Answer every question before submitting" : undefined} onClick={() => { const score = runner.questions.filter((question, questionIndex) => answers[questionIndex] === question.correctIndex).length; onSubmit(answers, score); }}>Submit assignment <Check size={16} /></button>}</div>
      </section>
      <p className="homework-lock-note"><LockKeyhole size={15} /> Explanations stay hidden until the assignment is submitted.</p>
    </main>
  );
}

function HomeworkResults({ result, onHome, onContinue }: { result: HomeworkResult; onHome: () => void; onContinue: () => void }) {
  const percent = Math.round((result.score / result.runner.questions.length) * 100);
  const incorrect = result.runner.questions.filter((question, index) => result.answers[index] !== question.correctIndex);
  const reviewed = result.runner.questions;
  const isSavedReview = Boolean(result.savedReview);
  const resultTitle = isSavedReview ? result.savedReview === "missed" ? "Review missed questions." : "Review your last homework." : percent >= 80 ? "Strong chapter recall." : "The gaps are now visible.";
  const resultSummary = isSavedReview ? `${reviewed.length} question${reviewed.length === 1 ? "" : "s"} from your last attempt` : `${result.runner.kind === "review" ? "Warm-up" : "Homework"} · ${result.score}/${result.runner.questions.length} correct`;
  const reviewHeading = isSavedReview
    ? `${reviewed.length} question${reviewed.length === 1 ? "" : "s"} available to review`
    : incorrect.length
      ? `${incorrect.length} response${incorrect.length === 1 ? "" : "s"} to repair · review every question`
      : "Perfect block · review every answer";
  return (
    <main className="resource-page homework-results page-width">
      <section className="homework-result-hero"><div><p className="eyebrow"><Trophy size={16} /> {isSavedReview ? "Saved homework review" : "Block submitted"}</p><h1>{resultTitle}</h1><p>{resultSummary}</p></div><div className="homework-score"><strong>{isSavedReview ? reviewed.length : `${percent}%`}</strong><span>{isSavedReview ? "questions available" : result.runner.kind === "review" ? "warm-up score" : "chapter score"}</span></div></section>
      <div className="result-actions"><button className="secondary-button" onClick={onHome}>Chapter library</button>{result.runner.kind === "review" && <button className="primary-button" onClick={onContinue}>Continue to homework <ArrowRight size={16} /></button>}</div>
      <section className="homework-rationales"><div className="section-heading"><div><p className="eyebrow">Answer review</p><h2>{reviewHeading}</h2></div></div>{reviewed.map((question, index) => { const selected = result.answers[index]; const responseWasNotSaved = isSavedReview && selected === undefined; const isCorrect = selected === question.correctIndex; const responseClass = responseWasNotSaved ? "saved-answer-unavailable" : isCorrect ? "correct-choice" : "wrong-choice"; return <details open className={isCorrect ? "homework-rationale correct-review" : "homework-rationale"} key={question.id}><summary><span>{index + 1}</span><strong>{question.stem}</strong><ChevronDown size={17} /></summary><div><p className={responseClass}>{responseWasNotSaved ? <BookOpenCheck size={15} /> : isCorrect ? <Check size={15} /> : <X size={15} />} Your answer: {responseWasNotSaved ? "Not saved for this earlier attempt" : selected === undefined ? "No response" : question.options[selected]}</p>{!isCorrect && <p className="correct-choice"><Check size={15} /> Correct answer: {question.options[question.correctIndex]}</p>}<p><strong>Why:</strong> {question.rationale}</p>{selected !== undefined && !isCorrect && <p><strong>Why your choice fails:</strong> {question.wrongRationales[selected]}</p>}</div></details>; })}</section>
    </main>
  );
}
