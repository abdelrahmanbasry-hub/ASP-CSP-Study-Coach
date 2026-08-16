import { CHAPTERS, HOMEWORK_QUESTIONS, type HomeworkChapter } from "./homeworkData.ts";
import { KEY_INFORMATION } from "./keyInformationData.ts";

export type PracticeLevel = "foundation" | "homework-level" | "application";
export type PracticeQuestion = {
  id: string;
  chapterId: string;
  level: PracticeLevel;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

const QUESTION_FORMS = [
  "Which statement accurately reflects the chapter material on ",
  "A trainee is reviewing this chapter before making a decision. Which detail must they retain about ",
  "Which point would correct a common oversimplification of ",
  "In a realistic workplace review, which principle should guide the analysis of ",
  "Which statement belongs in a technically sound plan involving ",
  "A supervisor asks for the basis of a decision. Which source-backed point applies to ",
] as const;

const FALLBACK_DISTRACTORS: Record<PracticeLevel, readonly string[]> = {
  foundation: [
    "It is only a matter of personal preference, so no defined principle applies.",
    "It can always be ignored when the task seems routine.",
    "It is interchangeable with any related term, without checking the distinction.",
  ],
  "homework-level": [
    "Use the most convenient approach first; the governing condition does not matter.",
    "Treat one familiar fact as enough, without applying the chapter's stated criteria.",
    "Substitute a broad rule of thumb for the specific term or requirement being tested.",
  ],
  application: [
    "Wait for an incident to show that the requirement mattered before acting on it.",
    "Choose the option that is easiest to implement, even if it omits the controlling condition.",
    "Assume a similar-looking situation has the same answer without checking the chapter's qualifiers.",
  ],
};

function sourcePointsForChapter(chapter: HomeworkChapter): string[] {
  const source = KEY_INFORMATION.find((item) => item.chapter === chapter.yatesChapterNumber)?.points;
  if (source?.length) return [...source];

  const tags = HOMEWORK_QUESTIONS
    .filter((item) => item.chapterId === chapter.id)
    .flatMap((item) => item.tags)
    .filter((tag, index, all) => all.indexOf(tag) === index);

  return tags.length
    ? tags.map((tag) => "Apply the chapter concept of " + tag.replaceAll("-", " ") + " to the facts given.")
    : ["Apply the controlling safety principle for " + chapter.courseTitle + " to the facts given."];
}

function levelFor(index: number, count: number): PracticeLevel {
  if (index < Math.ceil(count / 3)) return "foundation";
  if (index < Math.ceil((count * 2) / 3)) return "homework-level";
  return "application";
}

function topicFromPoint(point: string, chapter: HomeworkChapter): string {
  const firstClause = point.split(/[.:;]/, 1)[0].trim();
  return firstClause.length >= 12 ? firstClause : chapter.courseTitle;
}

function answerPosition(seed: string): number {
  return Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0) % 4;
}

function distractorsFor(points: readonly string[], index: number, level: PracticeLevel): string[] {
  const alternatives = points
    .filter((_, candidateIndex) => candidateIndex !== index)
    .map((point, candidateIndex) => ({ point, distance: (candidateIndex - index + points.length) % points.length }))
    .sort((left, right) => left.distance - right.distance)
    .map((candidate) => candidate.point);

  return [...alternatives, ...FALLBACK_DISTRACTORS[level]].filter((option, optionIndex, all) => all.indexOf(option) === optionIndex).slice(0, 3);
}

function questionStem(chapter: HomeworkChapter, point: string, index: number): string {
  const form = QUESTION_FORMS[index % QUESTION_FORMS.length];
  return form + topicFromPoint(point, chapter) + "?";
}

function explanation(chapter: HomeworkChapter, point: string, level: PracticeLevel): string {
  if (level === "foundation") {
    return "Begin by recalling the defined concept or fact from " + chapter.courseTitle + ". The source-backed point is: " + point;
  }
  if (level === "homework-level") {
    return "First identify the controlling term, condition, or relationship in the problem. Then compare the choices against the chapter material. The applicable point is: " + point;
  }
  return "Treat the situation as an application of the chapter's actual qualifiers, not a general preference. The decision should be grounded in: " + point;
}

function makeQuestions(chapter: HomeworkChapter): PracticeQuestion[] {
  const points = sourcePointsForChapter(chapter);

  return points.map((point, index) => {
    const level = levelFor(index, points.length);
    const correctIndex = answerPosition(chapter.id + point);
    const options = distractorsFor(points, index, level);
    options.splice(correctIndex, 0, point);

    return {
      id: "PQ-" + chapter.id.toUpperCase() + "-" + String(index + 1).padStart(2, "0"),
      chapterId: chapter.id,
      level,
      stem: questionStem(chapter, point, index),
      options: options as [string, string, string, string],
      correctIndex,
      explanation: explanation(chapter, point, level),
    };
  });
}

export const PRACTICE_QUESTIONS: readonly PracticeQuestion[] = CHAPTERS.flatMap(makeQuestions);

export function practiceQuestionsForChapter(chapterId: string): readonly PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((question) => question.chapterId === chapterId);
}

function validatePracticeQuestions(): void {
  const ids = new Set<string>();
  for (const chapter of CHAPTERS) {
    const questions = practiceQuestionsForChapter(chapter.id);
    if (!questions.length) throw new Error(chapter.id + " must have practice questions.");
    if (new Set(questions.map((question) => question.stem + question.options[question.correctIndex])).size !== questions.length) {
      throw new Error(chapter.id + " contains duplicate practice questions.");
    }
  }
  for (const question of PRACTICE_QUESTIONS) {
    if (ids.has(question.id) || new Set(question.options).size !== 4 || !question.explanation.trim()) {
      throw new Error("Invalid practice question " + question.id);
    }
    ids.add(question.id);
  }
}
validatePracticeQuestions();
