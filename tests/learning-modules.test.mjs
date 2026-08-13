import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAPTERS,
  HOMEWORK_COUNTS,
  HOMEWORK_QUESTIONS,
  REVIEW_QUESTIONS,
} from "../app/homeworkData.ts";
import {
  FLASHCARDS,
  FORMULA_ENTRIES,
  STUDY_LIBRARY_VALIDATION,
  validateFlashcards,
  validateFormulaEntries,
  validateStudyLibrary,
} from "../app/studyLibraryData.ts";
import {
  HAZARD_COUNTS,
  HAZARD_RECORDS,
  validateHazardRecords,
} from "../app/hazardData.ts";
import {
  emptyLearningProgress,
  nextFlashcardProgress,
  normalizeLearningProgress,
} from "../app/learningProgress.ts";

const EXPECTED_HOMEWORK_BY_CHAPTER = {
  "ch-02": 6,
  "ch-03": 2,
  "ch-04": 10,
  "ch-05": 6,
  "ch-06": 7,
  "ch-07": 7,
  "ch-10": 10,
  "ch-11": 10,
  "ch-12": 10,
  "ch-13": 10,
  "ch-15": 12,
  "ch-16": 10,
  "ch-17": 8,
  "ch-18": 3,
  "ch-19": 10,
  "ch-23": 8,
};

const REQUIRED_BILINGUAL_FIELDS = [
  "hazardDisease",
  "type",
  "definition",
  "targetOrganSystem",
  "mainConsequences",
  "exposureTransmission",
  "highRiskOccupationsWorkplace",
  "sourceNote",
];

test("homework catalog preserves the supplied chapter manifest and exact counts", () => {
  assert.deepEqual(HOMEWORK_COUNTS, {
    readyChapters: 16,
    comingLaterChapters: 21,
    totalChapters: 37,
    homework: 129,
    review: 80,
    totalQuestions: 209,
    homeworkByChapter: EXPECTED_HOMEWORK_BY_CHAPTER,
    reviewByChapter: Object.fromEntries(
      Object.keys(EXPECTED_HOMEWORK_BY_CHAPTER).map((chapterId) => [chapterId, 5]),
    ),
  });
  assert.equal(CHAPTERS.filter((chapter) => chapter.status === "ready").length, 16);
  assert.equal(CHAPTERS.filter((chapter) => chapter.status === "coming-later").length, 21);

  for (const chapter of CHAPTERS) {
    if (chapter.status === "ready") {
      assert.equal(chapter.homeworkCount, EXPECTED_HOMEWORK_BY_CHAPTER[chapter.id]);
      assert.equal(chapter.reviewCount, 5);
      assert.ok(chapter.sourcePdf);
      assert.ok(chapter.sourcePages.length > 0);
    } else {
      assert.equal(chapter.homeworkCount, 0);
      assert.equal(chapter.reviewCount, 0);
    }
  }
});

test("every homework and review item is complete, uniquely keyed, and answerable", () => {
  const allQuestions = [...HOMEWORK_QUESTIONS, ...REVIEW_QUESTIONS];
  assert.equal(new Set(allQuestions.map((question) => question.id)).size, 209);
  assert.equal(new Set(allQuestions.map((question) => question.stem)).size, 209);

  for (const question of allQuestions) {
    assert.match(question.id, /^(HW|RV)-CH\d{2}-\d{2}$/);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(Number.isInteger(question.correctIndex));
    assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
    assert.ok(question.rationale.trim().length > 0);
    assert.equal(question.wrongRationales.length, 4);
    assert.ok(question.wrongRationales.every((rationale) => rationale.trim().length > 0));
    assert.match(question.wrongRationales[question.correctIndex], /^Correct:/);
    question.wrongRationales.forEach((rationale, index) => {
      if (index !== question.correctIndex) assert.match(rationale, /^Incorrect:/);
    });
  }
});

test("each ready chapter has five provenance-linked review questions", () => {
  const homeworkById = new Map(HOMEWORK_QUESTIONS.map((question) => [question.id, question]));
  for (const chapterId of Object.keys(EXPECTED_HOMEWORK_BY_CHAPTER)) {
    const reviews = REVIEW_QUESTIONS.filter((question) => question.chapterId === chapterId);
    assert.equal(reviews.length, 5, chapterId);
    for (const review of reviews) {
      const source = homeworkById.get(review.sourceQuestionId);
      assert.ok(source, `${review.id} should reference a homework item`);
      assert.equal(source.chapterId, chapterId);
      assert.ok(review.tags.some((tag) => source.tags.includes(tag)));
    }
  }
});

test("formula and flashcard libraries meet their validated content targets", () => {
  assert.equal(FORMULA_ENTRIES.length, 44);
  assert.equal(FLASHCARDS.length, 80);
  assert.equal(new Set(FORMULA_ENTRIES.map((entry) => entry.id)).size, 44);
  assert.equal(new Set(FLASHCARDS.map((card) => card.id)).size, 80);
  assert.deepEqual(STUDY_LIBRARY_VALIDATION, { valid: true, errors: [] });
  assert.deepEqual(validateStudyLibrary(), { valid: true, errors: [] });

  const formulaCategories = new Set(FORMULA_ENTRIES.map((entry) => entry.category));
  const flashcardDecks = new Set(FLASHCARDS.map((card) => card.deck));
  assert.equal(formulaCategories.size, 13);
  assert.deepEqual([...flashcardDecks].sort(), [
    "Biological Hazards",
    "Exam Strategy",
    "Formula Essentials",
    "Homework Review",
    "Toxicology",
  ]);

  assert.equal(
    validateFormulaEntries([{ ...FORMULA_ENTRIES[0], id: "" }]).valid,
    false,
  );
  assert.equal(
    validateFlashcards([...FLASHCARDS, FLASHCARDS[0]]).valid,
    false,
  );
});

test("hazard library has exact source counts and complete English/Arabic fields", () => {
  assert.deepEqual(HAZARD_COUNTS, {
    total: 37,
    biological: 19,
    toxicological: 18,
  });
  assert.equal(new Set(HAZARD_RECORDS.map((record) => record.id)).size, 37);
  assert.doesNotThrow(() => validateHazardRecords());

  for (const record of HAZARD_RECORDS) {
    for (const field of REQUIRED_BILINGUAL_FIELDS) {
      assert.ok(record[field].en.trim().length > 0, `${record.id}.${field}.en`);
      assert.ok(record[field].ar.trim().length > 0, `${record.id}.${field}.ar`);
      assert.match(record[field].ar, /[\u0600-\u06ff]/, `${record.id}.${field}.ar`);
    }
  }

  const invalid = HAZARD_RECORDS.map((record) => ({ ...record }));
  invalid[0] = {
    ...invalid[0],
    definition: { ...invalid[0].definition, ar: "" },
  };
  assert.throws(() => validateHazardRecords(invalid), /Missing bilingual definition/);
});

test("learning progress normalization starts safely and preserves valid maps", () => {
  assert.deepEqual(emptyLearningProgress(), { chapterScores: {}, flashcards: {} });
  assert.deepEqual(normalizeLearningProgress(null), emptyLearningProgress());
  assert.deepEqual(normalizeLearningProgress([]), emptyLearningProgress());

  const value = {
    chapterScores: { "ch-02": { bestScore: 6 } },
    flashcards: { "card-1": { reviews: 3 } },
  };
  assert.deepEqual(normalizeLearningProgress(value), value);
  assert.deepEqual(normalizeLearningProgress({ chapterScores: null, flashcards: null }), {
    chapterScores: {},
    flashcards: {},
  });
});

test("flashcard scheduling responds monotonically to again, hard, good, and easy", () => {
  const now = Date.UTC(2026, 7, 13, 12, 0, 0);
  const again = nextFlashcardProgress(undefined, "again", now);
  const hard = nextFlashcardProgress(undefined, "hard", now);
  const good = nextFlashcardProgress(undefined, "good", now);
  const easy = nextFlashcardProgress(undefined, "easy", now);

  assert.deepEqual(
    [again.intervalDays, hard.intervalDays, good.intervalDays, easy.intervalDays],
    [0, 1, 3, 7],
  );
  assert.equal(again.dueAt, now + 10 * 60 * 1000);
  assert.equal(hard.dueAt, now + 24 * 60 * 60 * 1000);
  assert.equal(good.dueAt, now + 3 * 24 * 60 * 60 * 1000);
  assert.equal(easy.dueAt, now + 7 * 24 * 60 * 60 * 1000);
  assert.equal(again.lapses, 1);
  assert.ok(hard.dueAt < good.dueAt && good.dueAt < easy.dueAt);

  const mature = {
    dueAt: now,
    intervalDays: 10,
    ease: 2.4,
    lapses: 2,
    reviews: 8,
    lastRating: "good",
  };
  const advanced = nextFlashcardProgress(mature, "good", now);
  assert.equal(advanced.intervalDays, 24);
  assert.equal(advanced.reviews, 9);
  assert.equal(advanced.lapses, 2);
});
