export type ChapterScore = {
  chapterId: string;
  lastScore: number;
  bestScore: number;
  total: number;
  attempts: number;
  completedAt: number;
  missedQuestionIds: string[];
  lastAnswers?: Record<string, number>;
};

export type FlashcardRating = "again" | "hard" | "good" | "easy";

export type FlashcardProgress = {
  dueAt: number;
  intervalDays: number;
  ease: number;
  lapses: number;
  reviews: number;
  lastRating: FlashcardRating;
};

export type LearningProgress = {
  chapterScores: Record<string, ChapterScore>;
  flashcards: Record<string, FlashcardProgress>;
};

export const emptyLearningProgress = (): LearningProgress => ({
  chapterScores: {},
  flashcards: {},
});

export function normalizeLearningProgress(value: unknown): LearningProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return emptyLearningProgress();
  }
  const candidate = value as Partial<LearningProgress>;
  return {
    chapterScores:
      candidate.chapterScores && typeof candidate.chapterScores === "object"
        ? candidate.chapterScores
        : {},
    flashcards:
      candidate.flashcards && typeof candidate.flashcards === "object"
        ? candidate.flashcards
        : {},
  };
}

export function nextFlashcardProgress(
  current: FlashcardProgress | undefined,
  rating: FlashcardRating,
  now = Date.now(),
): FlashcardProgress {
  const base = current ?? {
    dueAt: now,
    intervalDays: 0,
    ease: 2.5,
    lapses: 0,
    reviews: 0,
    lastRating: "again" as const,
  };
  const nextEase = Math.min(
    3,
    Math.max(1.3, base.ease + (rating === "easy" ? 0.15 : rating === "hard" ? -0.15 : rating === "again" ? -0.2 : 0)),
  );
  const intervalDays =
    rating === "again"
      ? 0
      : rating === "hard"
        ? Math.max(1, Math.round(Math.max(1, base.intervalDays) * 1.2))
        : rating === "good"
          ? Math.max(1, Math.round(Math.max(1, base.intervalDays) * nextEase))
          : Math.max(4, Math.round(Math.max(2, base.intervalDays) * (nextEase + 0.8)));
  const dueAt =
    rating === "again"
      ? now + 10 * 60 * 1000
      : now + intervalDays * 24 * 60 * 60 * 1000;
  return {
    dueAt,
    intervalDays,
    ease: nextEase,
    lapses: base.lapses + Number(rating === "again"),
    reviews: base.reviews + 1,
    lastRating: rating,
  };
}
