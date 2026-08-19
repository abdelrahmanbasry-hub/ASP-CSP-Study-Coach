"use client";
import { ArrowLeft, ArrowRight, Check, CircleHelp, FileQuestion, X } from "lucide-react";
import { useState } from "react";
import { CHAPTERS } from "./homeworkData";
import { practiceQuestionsForChapter, type PracticeQuestion } from "./practiceQuestionsData";
import { QuestionVisualAid } from "./VisualLearningPanel";

export default function PracticeQuestions() {
  const [runner, setRunner] = useState<{ chapterId: string; questions: readonly PracticeQuestion[] } | null>(null);
  const totalQuestions = CHAPTERS.reduce((total, chapter) => total + practiceQuestionsForChapter(chapter.id).length, 0);
  if (runner) return <Runner runner={runner} onExit={() => setRunner(null)} />;
  return <main className="resource-page homework-page">
    <section className="library-hero page-width">
      <div>
        <p className="eyebrow"><FileQuestion size={16} /> Independent preparation</p>
        <h1>Practice Questions</h1>
        <p>Every chapter has an individually reviewed, book-grounded core set. Additional questions will be added only after the same chapter-by-chapter review.</p>
      </div>
      <div className="library-hero-stat"><strong>{totalQuestions}</strong><span>separate practice questions</span></div>
    </section>
    <section className="page-width homework-guidance">
      <div><FileQuestion /><strong>Separate from homework</strong><span>These prompts and answers never reuse the homework questions.</span></div>
      <div><Check /><strong>Immediate feedback</strong><span>Check each response to see the answer and solution path.</span></div>
      <div><CircleHelp /><strong>Source-based coverage</strong><span>Each chapter gets as many questions as its available concepts support.</span></div>
    </section>
    <section className="page-width chapter-section">
      <div className="section-heading"><div><p className="eyebrow">Choose a chapter</p><h2>Practice by course chapter</h2></div><p>Practice progress is separate from homework completion and analytics.</p></div>
      <div className="chapter-grid">{CHAPTERS.map((chapter) => {
        const chapterQuestions = practiceQuestionsForChapter(chapter.id);
        const questionCount = chapterQuestions.length;
        const levelCount = new Set(chapterQuestions.map((question) => question.level)).size;
        return <article className="chapter-card" key={chapter.id}>
          <div className="chapter-card-top"><span className="chapter-number">CH {String(chapter.courseNumber).padStart(2, "0")}</span><span className="chapter-status">{questionCount ? "Practice" : "In review"}</span></div>
          <h3>{chapter.courseTitle}</h3>
          <p>{"Yates 3e Ch. " + chapter.yatesChapterNumber + ": " + chapter.yatesChapterTitle}</p>
          <div className="chapter-metrics"><span><strong>{questionCount}</strong> questions</span><span><strong>{levelCount}</strong> levels</span><span><strong>{questionCount ? "reviewed" : "not ready"}</strong></span></div>
          <button className="primary-button full" disabled={!questionCount} onClick={() => setRunner({ chapterId: chapter.id, questions: chapterQuestions })}>{questionCount ? "Start practice" : "Questions in review"} <ArrowRight size={17} /></button>
        </article>;
      })}</div>
    </section>
  </main>;
}

function Runner({ runner, onExit }: { runner: { chapterId: string; questions: readonly PracticeQuestion[] }; onExit: () => void }) {
  const [index, setIndex] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [checked, setChecked] = useState(false);
  const question = runner.questions[index]; const chapter = CHAPTERS.find((item) => item.id === runner.chapterId); const last = index === runner.questions.length - 1;
  const advance = () => { if (last) return onExit(); setIndex((value) => value + 1); setSelected(null); setChecked(false); };
  return <main className="homework-runner"><header className="homework-runner-header"><button className="secondary-button" onClick={onExit}><X size={16} /> Exit</button><div><small>Practice questions</small><strong>{chapter?.courseTitle ?? "Chapter practice"}</strong></div><span>{index + 1}/{runner.questions.length}</span></header><div className="homework-progress"><i style={{ width: ((index + 1) / runner.questions.length) * 100 + "%" }} /></div><section className="homework-question-card"><div className="question-meta"><span>Question {index + 1} / {runner.questions.length}</span><span className="difficulty-chip">{question.level}</span></div><QuestionVisualAid id={question.id} stem={question.stem} topic={chapter?.courseTitle} reveal={checked} /><h1>{question.stem}</h1><div className="answer-list">{question.options.map((option, optionIndex) => <button disabled={checked} className={"answer" + (selected === optionIndex ? " selected" : "") + (checked && optionIndex === question.correctIndex ? " correct" : "") + (checked && selected === optionIndex && optionIndex !== question.correctIndex ? " incorrect" : "")} key={option} onClick={() => setSelected(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span><strong>{option}</strong>{selected === optionIndex && <Check size={18} />}</button>)}</div>{checked && <div className={selected === question.correctIndex ? "practice-feedback correct" : "practice-feedback incorrect"}><strong>{selected === question.correctIndex ? "Correct" : "Not quite"}</strong><p><b>Answer:</b> {question.options[question.correctIndex]}</p><p><b>Solution:</b> {question.explanation}</p></div>}<div className="homework-nav"><button className="secondary-button" disabled={index === 0} onClick={() => { setIndex((value) => Math.max(0, value - 1)); setSelected(null); setChecked(false); }}><ArrowLeft size={16} /> Previous</button>{!checked ? <button className="primary-button" disabled={selected === null} onClick={() => setChecked(true)}>Check answer <Check size={16} /></button> : <button className="primary-button" onClick={advance}>{last ? "Finish practice" : "Next question"} <ArrowRight size={16} /></button>}</div></section></main>;
}
