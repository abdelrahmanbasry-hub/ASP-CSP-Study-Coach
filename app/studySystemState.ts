export const MISTAKE_REASONS = [
  "Concept gap",
  "Calculation error",
  "Misread question",
  "Confused standards",
  "Unit conversion",
] as const;

export type MistakeReason = (typeof MISTAKE_REASONS)[number];
export type NotebookKind = "question" | "formula" | "hazard" | "flashcard" | "chapter" | "standard";

export interface NotebookEntry {
  id: string;
  kind: NotebookKind;
  title: string;
  subtitle?: string;
  note: string;
  chapterId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StudySystemState {
  onboardingComplete: boolean;
  completedChapterIds: string[];
  notebook: Record<string, NotebookEntry>;
  mistakeReasons: Record<string, MistakeReason>;
  planCompletions: Record<string, boolean>;
}

export const emptyStudySystemState = (): StudySystemState => ({
  onboardingComplete: false,
  completedChapterIds: [],
  notebook: {},
  mistakeReasons: {},
  planCompletions: {},
});

export function normalizeStudySystemState(value: unknown): StudySystemState {
  const base = emptyStudySystemState();
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  const candidate = value as Partial<StudySystemState>;
  const allowedReasons = new Set<string>(MISTAKE_REASONS);
  return {
    onboardingComplete: candidate.onboardingComplete === true,
    completedChapterIds: Array.isArray(candidate.completedChapterIds)
      ? [...new Set(candidate.completedChapterIds.filter((id): id is string => typeof id === "string"))]
      : [],
    notebook: candidate.notebook && typeof candidate.notebook === "object" ? candidate.notebook : {},
    mistakeReasons: candidate.mistakeReasons && typeof candidate.mistakeReasons === "object"
      ? Object.fromEntries(Object.entries(candidate.mistakeReasons).filter(([, reason]) => allowedReasons.has(reason))) as Record<string, MistakeReason>
      : {},
    planCompletions: candidate.planCompletions && typeof candidate.planCompletions === "object" ? candidate.planCompletions : {},
  };
}

export function attemptKey(attempt: { exam: string; sessionId: string; questionId: string }) {
  return `${attempt.exam}:${attempt.sessionId}:${attempt.questionId}`;
}

export function mistakeInsight(reasons: Record<string, MistakeReason>) {
  const counts = Object.values(reasons).reduce<Record<string, number>>((accumulator, reason) => {
    accumulator[reason] = (accumulator[reason] ?? 0) + 1;
    return accumulator;
  }, {});
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return "Classify a few misses and the coach will identify your dominant error pattern.";
  const [reason, count] = sorted[0];
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const percent = Math.round((count / total) * 100);
  return reason === "Concept gap"
    ? `${percent}% of classified misses point to concept gaps. Schedule short retrieval blocks before more timed work.`
    : `Your main issue is ${reason.toLowerCase()} (${percent}% of classified misses), not simply missing knowledge.`;
}
