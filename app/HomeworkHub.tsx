"use client";

import { ArrowLeft, ArrowRight, BookOpenCheck, Check, ChevronDown, LockKeyhole, RotateCcw, Trophy, X } from "lucide-react";
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

export default function HomeworkHub({
  progress,
  onProgress,
}: {
  progress: LearningProgress;
  onProgress: (next: LearningProgress) => void;
}) {
  const [runner, setRunner] = useState<Runner | null>(null);
  const [result, setResult] = useState<{ runner: Runner; answers: Record<number, number>; score: number } | null>(null);

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
    const nextScore: ChapterScore = {
      chapterId: runnerState.chapterId,
      lastScore: score,
      bestScore: Math.max(previous?.bestScore ?? 0, score),
      total: runnerState.questions.length,
      attempts: (previous?.attempts ?? 0) + 1,
      completedAt: Date.now(),
      missedQuestionIds,
    };
    onProgress({
      ...progress,
      chapterScores: { ...progress.chapterScores, [runnerState.chapterId]: nextScore },
    });
  }

  if (runner) {
    return (
      <HomeworkRunner
        runner={runner}
        onExit={() => setRunner(null)}
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
  return (
    <main className="resource-page homework-page">
      <section className="library-hero page-width">
        <div><p className="eyebrow"><BookOpenCheck size={16} /> Chapter homework</p><h1>Study the chapter. Then prove it.</h1><p>Each available deck is paraphrased into original practice, scored separately from exam readiness, and followed by explanations after submission.</p></div>
        <div className="library-hero-stat"><strong>{completed}/{ready.length}</strong><span>chapters completed</span></div>
      </section>

      <section className="page-width homework-guidance">
        <div><RotateCcw /><strong>Previous-chapter warm-up</strong><span>Five new questions before the next homework when an earlier chapter is complete.</span></div>
        <div><LockKeyhole /><strong>Answers stay sealed</strong><span>Score and explanations unlock only after the whole assignment is submitted.</span></div>
        <div><Trophy /><strong>Chapter analytics</strong><span>Last score, best score, attempts, and percentage are saved to your learner profile.</span></div>
      </section>

      <section className="page-width chapter-section">
        <div className="section-heading"><div><p className="eyebrow">Available now</p><h2>Homework by course chapter</h2></div><p>Course labels are preserved; Yates Third Edition mappings are shown on each card.</p></div>
        <div className="chapter-grid">
          {ready.map((chapter) => {
            const score = progress.chapterScores[chapter.id];
            const count = HOMEWORK_QUESTIONS.filter((question) => question.chapterId === chapter.id).length;
            const lastPercent = score ? Math.round((score.lastScore / score.total) * 100) : null;
            const bestPercent = score ? Math.round((score.bestScore / score.total) * 100) : null;
            return (
              <article className="chapter-card" key={chapter.id}>
                <div className="chapter-card-top"><span className="chapter-number">CH {String(chapter.courseNumber).padStart(2, "0")}</span><span className={score ? "chapter-status complete" : "chapter-status"}>{score ? "Completed" : "Ready"}</span></div>
                <h3>{chapter.courseTitle}</h3>
                <p>{`Yates 3e Ch. ${chapter.yatesChapterNumber}: ${chapter.yatesChapterTitle}`}</p>
                <div className="chapter-metrics"><span><strong>{count}</strong> questions</span><span><strong>{lastPercent ?? "—"}{lastPercent !== null ? "%" : ""}</strong> last</span><span><strong>{bestPercent ?? "—"}{bestPercent !== null ? "%" : ""}</strong> best</span></div>
                <button className="primary-button full" onClick={() => begin(chapter.id)}>{score ? "Retake chapter" : "Start chapter"} <ArrowRight size={17} /></button>
              </article>
            );
          })}
        </div>
      </section>

      {pending.length > 0 && (
        <section className="page-width coming-section">
          <div className="section-heading"><div><p className="eyebrow">Planned library</p><h2>Coming when you add the remaining files</h2></div></div>
          <div className="coming-grid">{pending.map((chapter) => <div key={chapter.id}><span>CH {String(chapter.courseNumber).padStart(2, "0")}</span><strong>{chapter.courseTitle}</strong><small>Homework file not supplied yet</small></div>)}</div>
        </section>
      )}
    </main>
  );
}

function HomeworkRunner({ runner, onExit, onSubmit }: { runner: Runner; onExit: () => void; onSubmit: (answers: Record<number, number>, score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const current = runner.questions[index];
  const answered = Object.keys(answers).length;
  const chapter = CHAPTERS.find((item) => item.id === runner.chapterId);
  const title = runner.kind === "review" ? `Previous-chapter warm-up for ${chapter?.courseTitle ?? "this chapter"}` : chapter?.courseTitle ?? "Chapter homework";
  return (
    <main className="homework-runner">
      <header className="homework-runner-header"><button className="secondary-button" onClick={onExit}><X size={16} /> Exit</button><div><small>{runner.kind === "review" ? "Retrieval warm-up" : "Homework assignment"}</small><strong>{title}</strong></div><span>{answered}/{runner.questions.length} answered</span></header>
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

function HomeworkResults({ result, onHome, onContinue }: { result: { runner: Runner; answers: Record<number, number>; score: number }; onHome: () => void; onContinue: () => void }) {
  const percent = Math.round((result.score / result.runner.questions.length) * 100);
  const incorrect = result.runner.questions.filter((question, index) => result.answers[index] !== question.correctIndex);
  return (
    <main className="resource-page homework-results page-width">
      <section className="homework-result-hero"><div><p className="eyebrow"><Trophy size={16} /> Block submitted</p><h1>{percent >= 80 ? "Strong chapter recall." : "The gaps are now visible."}</h1><p>{result.runner.kind === "review" ? "Warm-up" : "Homework"} · {result.score}/{result.runner.questions.length} correct</p></div><div className="homework-score"><strong>{percent}%</strong><span>{result.runner.kind === "review" ? "warm-up score" : "chapter score"}</span></div></section>
      <div className="result-actions"><button className="secondary-button" onClick={onHome}>Chapter library</button>{result.runner.kind === "review" && <button className="primary-button" onClick={onContinue}>Continue to homework <ArrowRight size={16} /></button>}</div>
      <section className="homework-rationales"><div className="section-heading"><div><p className="eyebrow">Correction block</p><h2>{incorrect.length ? `${incorrect.length} response${incorrect.length === 1 ? "" : "s"} to repair` : "No incorrect responses"}</h2></div></div>{incorrect.map((question) => { const index = result.runner.questions.indexOf(question); const selected = result.answers[index]; return <details open className="homework-rationale" key={question.id}><summary><span>{index + 1}</span><strong>{question.stem}</strong><ChevronDown size={17} /></summary><div><p className="wrong-choice"><X size={15} /> Your answer: {selected === undefined ? "No response" : question.options[selected]}</p><p className="correct-choice"><Check size={15} /> Correct answer: {question.options[question.correctIndex]}</p><p><strong>Why:</strong> {question.rationale}</p>{selected !== undefined && selected !== question.correctIndex && <p><strong>Why your choice fails:</strong> {question.wrongRationales[selected]}</p>}</div></details>; })}</section>
      {incorrect.length === 0 && <div className="empty-state"><Trophy /><h3>Perfect block.</h3><p>Return later and prove it again after spacing.</p></div>}
    </main>
  );
}
