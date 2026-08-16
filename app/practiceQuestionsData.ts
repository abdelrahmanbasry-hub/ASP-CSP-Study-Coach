import { CHAPTERS, HOMEWORK_QUESTIONS, type HomeworkChapter } from "./homeworkData.ts";
import { KEY_INFORMATION } from "./keyInformationData.ts";

export type PracticeLevel = "foundation" | "homework-level" | "application";
export type PracticeQuestion = { id: string; chapterId: string; level: PracticeLevel; stem: string; options: readonly [string, string, string, string]; correctIndex: number; explanation: string };
export const PRACTICE_QUESTIONS_PER_CHAPTER = 15;

const distractors = ["Treat it as optional when conditions are familiar.", "Replace the controlling requirement with a general preference.", "Wait for an incident before considering it."] as const;

function concepts(chapter: HomeworkChapter): string[] {
  const source = KEY_INFORMATION.find((item) => item.chapter === chapter.yatesChapterNumber)?.points;
  if (source?.length) return [...source];
  const tags = HOMEWORK_QUESTIONS.filter((item) => item.chapterId === chapter.id).flatMap((item) => item.tags).filter((tag, index, all) => all.indexOf(tag) === index);
  return tags.length ? tags.map((tag) => "Apply the chapter concept of " + tag.replaceAll("-", " ") + " to the facts given.") : ["Apply the controlling safety principle for " + chapter.courseTitle + " to the facts given."];
}

function makeQuestions(chapter: HomeworkChapter): PracticeQuestion[] {
  const sourcePoints = concepts(chapter);
  return Array.from({ length: PRACTICE_QUESTIONS_PER_CHAPTER }, (_, index) => {
    const level: PracticeLevel = index < 5 ? "foundation" : index < 10 ? "homework-level" : "application";
    const correct = sourcePoints[index % sourcePoints.length];
    const answerIndex = index % 4;
    const options: string[] = [...distractors];
    options.splice(answerIndex, 0, correct);
    const stem = level === "foundation" ? "Which statement is a core point for " + chapter.courseTitle + "?" : level === "homework-level" ? "Before solving a new " + chapter.courseTitle + " problem, which detail should the learner identify as controlling?" : "A workplace situation raises a " + chapter.courseTitle + " issue. Which principle should guide the decision?";
    return { id: "PQ-" + chapter.id.toUpperCase() + "-" + String(index + 1).padStart(2, "0"), chapterId: chapter.id, level, stem, options: options as [string, string, string, string], correctIndex: answerIndex, explanation: "Step 1: identify the controlling " + chapter.courseTitle + " principle. Step 2: compare each choice against that principle. Step 3: select the source-backed statement: " + correct };
  });
}

export const PRACTICE_QUESTIONS: readonly PracticeQuestion[] = CHAPTERS.flatMap(makeQuestions);
export function practiceQuestionsForChapter(chapterId: string): readonly PracticeQuestion[] { return PRACTICE_QUESTIONS.filter((question) => question.chapterId === chapterId); }

function validatePracticeQuestions(): void {
  for (const chapter of CHAPTERS) {
    const questions = practiceQuestionsForChapter(chapter.id);
    if (questions.length !== PRACTICE_QUESTIONS_PER_CHAPTER) throw new Error(chapter.id + " must have 15 practice questions.");
    for (const level of ["foundation", "homework-level", "application"] as const) if (questions.filter((question) => question.level === level).length !== 5) throw new Error(chapter.id + " must have five " + level + " questions.");
  }
  const ids = new Set<string>();
  for (const question of PRACTICE_QUESTIONS) {
    if (ids.has(question.id) || new Set(question.options).size !== 4 || !question.explanation.trim()) throw new Error("Invalid practice question " + question.id);
    ids.add(question.id);
  }
}
validatePracticeQuestions();
