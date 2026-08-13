import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAPTERS,
  HOMEWORK_COUNTS,
  HOMEWORK_QUESTIONS,
  REVIEW_QUESTIONS,
} from "../app/homeworkData.ts";
import {
  BCSP_FREQUENTLY_USED_FORMULA_IDS,
  FLASHCARDS,
  FORMULA_CATEGORIES,
  FORMULA_ENTRIES,
  STUDY_LIBRARY_VALIDATION,
  validateFlashcards,
  validateFormulaEntries,
  validateStudyLibrary,
} from "../app/studyLibraryData.ts";
import { ADDITIONAL_FORMULA_ENTRY_IDS } from "../app/formulaSupplementData.ts";
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

const EXPECTED_BCSP_FREQUENT_IDS_BY_PDF_PAGE = {
  12: ["formula-math-right-triangle"],
  13: ["formula-stat-t", "formula-stat-z", "formula-stat-poisson"],
  14: [
    "formula-rel-failure",
    "formula-rel-exponential",
    "formula-mech-moment",
    "formula-mech-velocity",
  ],
  15: [
    "formula-mech-displacement",
    "formula-mech-velocity-distance",
    "formula-mech-energy-work",
  ],
  16: [
    "formula-mech-force-weight",
    "formula-elec-ohm",
    "formula-elec-power",
    "formula-elec-series-resistance",
    "formula-elec-parallel-resistance",
  ],
  17: [
    "formula-ih-ideal-gas",
    "formula-ih-combined-gas",
    "formula-hyd-velocity-pressure",
    "formula-hyd-static-residual-flow",
    "formula-hyd-flow-pressure",
  ],
  18: [
    "formula-hyd-hazen-williams",
    "formula-vent-flow",
    "formula-vent-velocity-pressure",
  ],
  19: [
    "formula-vent-hood-entry",
    "formula-vent-total-pressure",
    "formula-vent-fan-static-pressure",
    "formula-vent-capture",
    "formula-vent-dilution",
    "formula-rad-inverse-square",
  ],
  20: ["formula-rad-point-source"],
  21: [
    "formula-noise-sound-power-level",
    "formula-noise-sound-pressure-level",
    "formula-noise-duration",
    "formula-noise-dose-twa",
  ],
  22: [
    "formula-econ-future",
    "formula-econ-present",
    "formula-econ-annuity-future",
    "formula-econ-sinking-fund",
    "formula-econ-annuity-present",
    "formula-econ-capital-recovery",
  ],
  23: [
    "formula-heat-indoor-wbgt",
    "formula-heat-outdoor-wbgt",
    "formula-ih-ppm",
  ],
};

const EXPECTED_BCSP_FREQUENTLY_USED_FORMULA_IDS = Object.values(
  EXPECTED_BCSP_FREQUENT_IDS_BY_PDF_PAGE,
).flat();

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
  assert.equal(FORMULA_ENTRIES.length, 106);
  assert.equal(FLASHCARDS.length, 80);
  assert.equal(
    new Set(FORMULA_ENTRIES.map((entry) => entry.id)).size,
    FORMULA_ENTRIES.length,
  );
  assert.equal(new Set(FLASHCARDS.map((card) => card.id)).size, 80);
  assert.deepEqual(STUDY_LIBRARY_VALIDATION, { valid: true, errors: [] });
  assert.deepEqual(validateStudyLibrary(), { valid: true, errors: [] });

  const formulaCategories = new Set(FORMULA_ENTRIES.map((entry) => entry.category));
  const flashcardDecks = new Set(FLASHCARDS.map((card) => card.deck));
  assert.equal(FORMULA_CATEGORIES.length, 16);
  assert.equal(new Set(FORMULA_CATEGORIES).size, 16);
  assert.equal(formulaCategories.size, 16);
  assert.deepEqual([...formulaCategories].sort(), [...FORMULA_CATEGORIES].sort());
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

test("expanded formula library preserves complete supplemental coverage and corrected equations", () => {
  assert.equal(ADDITIONAL_FORMULA_ENTRY_IDS.length, 62);
  assert.equal(new Set(ADDITIONAL_FORMULA_ENTRY_IDS).size, 62);

  const formulasById = new Map(FORMULA_ENTRIES.map((entry) => [entry.id, entry]));
  const supplementalEntries = ADDITIONAL_FORMULA_ENTRY_IDS.map((id) => {
    const entry = formulasById.get(id);
    assert.ok(entry, `Supplemental formula ${id} is missing from FORMULA_ENTRIES`);
    return entry;
  });

  for (const entry of supplementalEntries) {
    assert.match(entry.sourcePage, /\d/, `${entry.id} must cite at least one source page`);
  }

  const serializedLibrary = JSON.stringify(FORMULA_ENTRIES);
  for (const marker of ["\uFFFD", "Â", "Ã", "â€", "âˆ", "â‰", "â‚", "â"]) {
    assert.equal(
      serializedLibrary.includes(marker),
      false,
      `Formula library contains the mojibake marker ${JSON.stringify(marker)}`,
    );
  }

  const searchable = (entry) =>
    `${entry.id} ${entry.name} ${entry.formula} ${entry.variables.join(" ")}`;

  const footcandle = FORMULA_ENTRIES.find((entry) =>
    /foot[- ]?candle|\bfc\b/i.test(searchable(entry)),
  );
  assert.ok(footcandle, "Footcandle/lux conversion is missing");
  assert.match(
    footcandle.formula,
    /1\s*(?:foot[- ]?candle|fc)\s*=\s*10\.76(?:4)?\s*(?:lux|lx)/i,
    "One footcandle must equal 10.76 lux",
  );

  const inverseSquare = formulasById.get("formula-rad-inverse-square");
  assert.ok(inverseSquare, "Radiation inverse-square formula is missing");
  assert.match(
    inverseSquare.formula.replace(/\s/g, ""),
    /I(?:₂|2)=I(?:₁|1)\(d(?:₁|1)\/d(?:₂|2)\)(?:²|\^2)/,
    "Inverse-square distance ratio must be initial distance over final distance",
  );

  const radiationYield = formulasById.get("formula-rad-point-source");
  assert.ok(radiationYield, "Radiation point-source shortcut is missing");
  assert.match(
    radiationYield.formula.replace(/[\s×·*]/g, ""),
    /S(?:=|≈)6CiEf$/i,
    "Point-source shortcut must include fractional yield f",
  );
  assert.ok(
    radiationYield.variables.some((variable) => /fractional yield/i.test(variable)),
    "Point-source variables must define f as fractional yield",
  );

  const acousticIntensity = FORMULA_ENTRIES.find((entry) =>
    /(?:acoustic|sound) intensity/i.test(searchable(entry)),
  );
  assert.ok(acousticIntensity, "Acoustic-intensity relation is missing");
  assert.match(
    acousticIntensity.formula.replace(/[\s()]/g, ""),
    /I=p(?:ᵣₘₛ)?(?:²|\^2)\/(?:ρ|rho)c/i,
    "Acoustic intensity must use squared sound pressure, I = p²/(ρc)",
  );

  const ppm = formulasById.get("formula-ih-ppm");
  assert.ok(ppm, "Gas/vapour ppm relations are missing");
  assert.match(
    ppm.formula.replace(/\s/g, ""),
    /Cppm=\(Pv\/Pb\)×10⁶/i,
    "Partial-pressure ppm relation Cppm = (Pv/Pb) × 10⁶ must be present",
  );

  const boolean = formulasById.get("formula-logic-boolean-identities");
  assert.ok(boolean, "Boolean identities are missing");
  for (const identity of ["A+B=B+A", "A·B=B·A", "A(BC)=(AB)C", "A+(B+C)=(A+B)+C"]) {
    assert.ok(boolean.formula.includes(identity), "Boolean identity is missing: " + identity);
  }

  const mixtureLimit = formulasById.get("formula-ih-mixture-lel");
  assert.ok(mixtureLimit, "Mixture LFL/LEL relation is missing");
  assert.match(mixtureLimit.formula, /LFLm.*Σ\(fi\/LFLi\)/);
});

test("BCSP frequently-used formula filter exactly matches ASP Formula Sheet pages 12-23", () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(EXPECTED_BCSP_FREQUENT_IDS_BY_PDF_PAGE).map(([page, ids]) => [
        page,
        ids.length,
      ]),
    ),
    {
      12: 1,
      13: 3,
      14: 4,
      15: 3,
      16: 5,
      17: 5,
      18: 3,
      19: 6,
      20: 1,
      21: 4,
      22: 6,
      23: 3,
    },
  );

  assert.equal(EXPECTED_BCSP_FREQUENTLY_USED_FORMULA_IDS.length, 44);
  assert.equal(
    new Set(EXPECTED_BCSP_FREQUENTLY_USED_FORMULA_IDS).size,
    EXPECTED_BCSP_FREQUENTLY_USED_FORMULA_IDS.length,
    "The page-mapped expected list must not contain duplicate formula cards",
  );
  assert.deepEqual(
    [...BCSP_FREQUENTLY_USED_FORMULA_IDS],
    EXPECTED_BCSP_FREQUENTLY_USED_FORMULA_IDS,
    "The filter must preserve the PDF's page and formula order",
  );

  const libraryIds = new Set(FORMULA_ENTRIES.map((entry) => entry.id));
  for (const id of BCSP_FREQUENTLY_USED_FORMULA_IDS) {
    assert.ok(libraryIds.has(id), `${id} must resolve to a formula-library card`);
  }

  const frequentIds = new Set(BCSP_FREQUENTLY_USED_FORMULA_IDS);
  const representativePageFormulaIds = [
    "formula-math-right-triangle", // p. 12
    "formula-stat-poisson", // p. 13
    "formula-rel-exponential", // p. 14
    "formula-mech-displacement", // p. 15
    "formula-elec-parallel-resistance", // p. 16
    "formula-hyd-static-residual-flow", // p. 17
    "formula-hyd-hazen-williams", // p. 18
    "formula-vent-fan-static-pressure", // p. 19
    "formula-rad-point-source", // p. 20
    "formula-noise-sound-pressure-level", // p. 21
    "formula-econ-capital-recovery", // p. 22
    "formula-ih-ppm", // p. 23
  ];
  for (const id of representativePageFormulaIds) {
    assert.ok(frequentIds.has(id), `Frequently-used filter is missing ${id}`);
  }

  for (const masterSheetOnlyId of [
    "formula-logic-boolean-identities",
    "formula-math-law-cosines",
    "formula-noise-lined-duct",
  ]) {
    assert.equal(
      frequentIds.has(masterSheetOnlyId),
      false,
      `${masterSheetOnlyId} appears on the master sheet but not in the PDF's frequently-used section`,
    );
  }
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
