import assert from "node:assert/strict";
import test from "node:test";

import { QUESTION_BANK as CSP_SEED } from "../app/questionBank.ts";
import { CSP_QUESTION_BANK_EXTRA } from "../app/cspQuestionBankExtra.ts";
import {
  CSP_MOCK_A,
  CSP_MOCK_B,
  CSP_PRACTICE_EXTRA,
} from "../app/cspExpandedQuestionBank.ts";
import { ASP_QUESTION_BANK_A } from "../app/aspQuestionBankA.ts";
import { ASP_QUESTION_BANK_B } from "../app/aspQuestionBankB.ts";
import { ASP_QUESTION_BANK_EXTRA_A2 } from "../app/aspQuestionBankExtraA2.ts";
import { ASP_QUESTION_BANK_EXTRA_SET1 } from "../app/aspQuestionBankExtraSet1.ts";
import { ASP_QUESTION_BANK_EXTRA_SET2 } from "../app/aspQuestionBankExtraSet2.ts";
import {
  ASP_MOCK_A,
  ASP_MOCK_B,
  ASP_PRACTICE_EXTRA,
} from "../app/aspExpandedQuestionBank.ts";
import {
  BCSP_FREQUENTLY_USED_FORMULA_IDS,
  FORMULA_ENTRIES,
} from "../app/studyLibraryData.ts";
import {
  A1_PRACTICE_COVERAGE,
  buildA1CalculationProblem,
} from "../app/aspMathQuestionCatalog.ts";

const cspPracticeCounts = { D1: 200, D2: 200, D3: 120, D4: 72, D5: 48, D6: 80, D7: 80 };
const cspMockCounts = { D1: 50, D2: 50, D3: 30, D4: 18, D5: 12, D6: 20, D7: 20 };
const aspPracticeCounts = { A1: 80, A2: 200, A3: 64, A4: 96, A5: 80, A6: 96, A7: 56, A8: 88, A9: 40 };
const aspMockCounts = { A1: 20, A2: 50, A3: 16, A4: 24, A5: 20, A6: 24, A7: 14, A8: 22, A9: 10 };
const cspPracticeTopicMinimums = { D1: 24, D2: 24, D3: 16, D4: 12, D5: 10, D6: 14, D7: 12 };
const cspMockTopicMinimums = { D1: 14, D2: 14, D3: 10, D4: 8, D5: 6, D6: 8, D7: 8 };
const aspPracticeTopicMinimums = { A1: 15, A2: 24, A3: 12, A4: 16, A5: 12, A6: 16, A7: 10, A8: 14, A9: 8 };
const aspMockTopicMinimums = { A1: 8, A2: 14, A3: 7, A4: 9, A5: 8, A6: 9, A7: 6, A8: 8, A9: 5 };
const formulaEntryById = new Map(FORMULA_ENTRIES.map((entry) => [entry.id, entry]));
const requiredYatesMathFamilies = [
  "order-of-operations",
  "signed-and-absolute-values",
  "scientific-notation",
  "engineering-notation",
  "logarithms",
  "equation-transposition",
  "common-geometry",
  "right-triangle-trigonometry",
  "quadratic-equation",
  "factorials",
  "eulers-number",
];
const nonA1FrequentFormulaIds = new Set([
  "formula-stat-t",
  "formula-stat-poisson",
  "formula-mech-moment",
  "formula-elec-ohm",
  "formula-elec-power",
  "formula-elec-series-resistance",
  "formula-elec-parallel-resistance",
  "formula-ih-combined-gas",
  "formula-vent-flow",
]);
const requiredA1ReplacementFormulaIds = [
  "formula-stat-sample-sd",
  "formula-stat-population-sd",
  "formula-mech-momentum",
  "formula-vent-evaporation-dilution",
  "formula-hyd-bernoulli-loss",
  "formula-noise-absorption-change",
  "nws-heat-wind-chill-index",
  "formula-ih-mixture-tlv",
  "formula-vent-transient-clearance",
  "yates-rad-radioactive-decay-half-life",
  "formula-rad-nonionizing-far-field",
];
const requiredA1Categories = [
  "Mathematics & Logic",
  "Statistics & Probability",
  "Reliability",
  "Mechanics",
  "Industrial Hygiene & Gases",
  "Ergonomics",
  "Heat Stress",
  "Radiation",
  "Engineering Economy",
  "Noise",
  "Hydraulics",
  "Ventilation",
];
const requiredA1BlueprintObjectives = Array.from({ length: 16 }, (_, index) => `A1.${index + 1}`);

function normalized(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function countsByDomain(items) {
  return Object.fromEntries(
    [...new Set(items.map((item) => item.domainId))]
      .sort()
      .map((domainId) => [domainId, items.filter((item) => item.domainId === domainId).length]),
  );
}

function validateItems(items, label) {
  assert.equal(new Set(items.map((item) => item.id)).size, items.length, `${label}: duplicate IDs`);
  assert.equal(
    new Set(items.map((item) => normalized(item.stem))).size,
    items.length,
    `${label}: duplicate stems`,
  );
  for (const item of items) {
    assert.equal(item.options.length, 4, `${item.id}: option count`);
    assert.equal(item.wrongRationales.length, 4, `${item.id}: rationale count`);
    assert.equal(new Set(item.options.map(normalized)).size, 4, `${item.id}: duplicate option`);
    assert.ok(Number.isInteger(item.correctIndex) && item.correctIndex >= 0 && item.correctIndex <= 3, `${item.id}: answer key`);
    assert.ok(item.stem.trim().length >= 35, `${item.id}: stem is too shallow`);
    assert.ok(item.rationale.trim().length >= 35, `${item.id}: rationale is too shallow`);
    assert.ok(item.wrongRationales.every((value) => value.trim().length >= 15), `${item.id}: weak option rationale`);
    assert.match(item.wrongRationales[item.correctIndex], /correct/i, `${item.id}: keyed feedback is misaligned`);
    assert.ok(item.competency.trim() && item.referenceTopic.trim() && item.challengePrompt.trim(), `${item.id}: missing metadata`);
  }
}

function validateDifficultyCoverage(items, label) {
  for (const domainId of new Set(items.map((item) => item.domainId))) {
    assert.deepEqual(
      [...new Set(items.filter((item) => item.domainId === domainId).map((item) => item.difficulty))].sort(),
      [1, 2, 3, 4, 5],
      `${label} ${domainId}: incomplete difficulty ladder`,
    );
  }
}

function validateTopicBreadth(items, minimums, label) {
  for (const [domainId, minimum] of Object.entries(minimums)) {
    const topics = new Set(
      items
        .filter((item) => item.domainId === domainId)
        .map((item) => normalized(item.referenceTopic)),
    );
    assert.ok(topics.size >= minimum, `${label} ${domainId}: only ${topics.size} distinct topics; expected at least ${minimum}`);
  }
}

function validateExpandedPoolIsolation(practice, mockA, mockB, label) {
  for (const [pool, expected, idMarker] of [[practice, "practice", "-P-"], [mockA, "mock-a", "-MA-"], [mockB, "mock-b", "-MB-"]]) {
    assert.ok(pool.every((item) => item.pool === expected), `${label}: incorrect pool metadata`);
    assert.ok(pool.every((item) => item.id.includes(idMarker)), `${label}: item ID does not identify its pool`);
    assert.ok(pool.every((item) => item.scenarioFamily?.trim()), `${label}: missing scenario family metadata`);
  }
  const practiceFamilies = new Set(practice.map((item) => item.scenarioFamily));
  const mockAFamilies = new Set(mockA.map((item) => item.scenarioFamily));
  const mockBFamilies = new Set(mockB.map((item) => item.scenarioFamily));
  assert.equal([...practiceFamilies].filter((family) => mockAFamilies.has(family) || mockBFamilies.has(family)).length, 0, `${label}: practice family leaked into a mock`);
  assert.equal([...mockAFamilies].filter((family) => mockBFamilies.has(family)).length, 0, `${label}: mock forms share a scenario family`);
}

function stemSkeleton(stem) {
  const firstSentence = stem.indexOf(". ");
  const decisionText = firstSentence >= 0 ? stem.slice(firstSentence + 2) : stem;
  return decisionText
    .toLowerCase()
    .replace(/[$€£]?\d[\d,.]*(?:%|\s?(?:ft3|ft2|ft|in|lb|kg|ppm|mg\/m3|cfm|db|hours?|minutes?|years?))?/g, " # ")
    .replace(/\s+/g, " ")
    .trim();
}

function validateStemSkeletons(items, maxCluster, label) {
  const clusters = new Map();
  for (const item of items) {
    const skeleton = stemSkeleton(item.stem);
    clusters.set(skeleton, (clusters.get(skeleton) ?? 0) + 1);
  }
  const largest = Math.max(...clusters.values());
  assert.ok(largest <= maxCluster, `${label}: a single question skeleton repeats ${largest} times (limit ${maxCluster})`);
}

function validateAnswerDiversity(items, label, { minimumSetRate, maximumSetRepeat, minimumKeyRate }) {
  const optionSets = items.map((item) => item.options.map(normalized).sort().join(" || "));
  const optionSetCounts = new Map();
  optionSets.forEach((signature) => optionSetCounts.set(signature, (optionSetCounts.get(signature) ?? 0) + 1));
  assert.ok(new Set(optionSets).size >= Math.ceil(items.length * minimumSetRate), `${label}: insufficient four-option-set breadth`);
  assert.ok(Math.max(...optionSetCounts.values()) <= maximumSetRepeat, `${label}: one four-option set repeats too often`);
  const keyedAnswers = new Set(items.map((item) => normalized(item.options[item.correctIndex])));
  assert.ok(keyedAnswers.size >= Math.ceil(items.length * minimumKeyRate), `${label}: only ${keyedAnswers.size} distinct keyed answers across ${items.length} items`);
}

function validateAnswerStyleBalance(items, label) {
  let keyedLongest = 0;
  let keyedShortest = 0;
  let keyedLength = 0;
  let distractorLength = 0;
  let distractorCount = 0;
  for (const item of items) {
    const lengths = item.options.map((option) => option.trim().length);
    const keyed = lengths[item.correctIndex];
    const longestDistractor = Math.max(...lengths.filter((_, index) => index !== item.correctIndex));
    const shortestDistractor = Math.min(...lengths.filter((_, index) => index !== item.correctIndex));
    keyedLongest += Number(keyed > longestDistractor);
    keyedShortest += Number(keyed < shortestDistractor);
    keyedLength += keyed;
    lengths.forEach((length, index) => {
      if (index !== item.correctIndex) {
        distractorLength += length;
        distractorCount += 1;
      }
    });
  }
  const longestRate = keyedLongest / items.length;
  const shortestRate = keyedShortest / items.length;
  const lengthRatio = (keyedLength / items.length) / (distractorLength / distractorCount);
  assert.ok(longestRate <= 0.7, `${label}: keyed option is longest in ${Math.round(longestRate * 100)}% of items`);
  assert.ok(shortestRate <= 0.7, `${label}: keyed option is shortest in ${Math.round(shortestRate * 100)}% of items`);
  assert.ok(lengthRatio <= 1.45, `${label}: keyed options are ${lengthRatio.toFixed(2)}x the mean distractor length`);
}

function validateMockKeyBalance(items, label) {
  const counts = [0, 1, 2, 3].map((index) => items.filter((item) => item.correctIndex === index).length);
  assert.ok(counts.every((count) => count >= 35 && count <= 65), `${label}: unbalanced answer positions ${counts}`);
}

function validateA1FormulaMetadata(items, label) {
  for (const item of items) {
    assert.ok(item.formulaId?.trim(), `${label} ${item.id}: missing stable formula ID`);
    assert.ok(item.formulaCategory?.trim(), `${item.id}: missing stable formula category`);
    assert.ok(item.formulaFamily?.trim(), `${item.id}: missing stable formula family`);
    assert.match(
      item.blueprintObjective ?? "",
      /^A1\.(?:[1-9]|1[0-6])$/,
      `${item.id}: missing or invalid A1 blueprint objective`,
    );
    const catalogEntry = formulaEntryById.get(item.formulaId);
    if (catalogEntry) {
      assert.equal(
        item.formulaCategory,
        catalogEntry.category,
        `${item.id}: formula category does not match ${item.formulaId}`,
      );
    } else {
      assert.match(
        item.formulaId,
        /^(?:yates|nws)-[a-z0-9]+(?:-[a-z0-9]+)*$/,
        `${item.id}: supplemental formula IDs must use a stable source namespace`,
      );
    }
    assert.doesNotMatch(
      item.referenceTopic,
      /\s+—\s+.*\blens\s+\d+$/i,
      `${item.id}: synthetic reference-topic lens must not stand in for a formula family`,
    );
  }
}

function validateA1MockFormulaBreadth(items, label) {
  assert.equal(items.length, 20, `${label}: expected 20 A1 items`);
  validateA1FormulaMetadata(items, label);
  const families = new Set(items.map((item) => normalized(item.formulaFamily)));
  assert.equal(families.size, 20, `${label}: expected 20 distinct stable formula families`);
  const categories = new Set(items.map((item) => item.formulaCategory));
  assert.ok(categories.size >= 10, `${label}: only ${categories.size} formula categories; expected at least 10`);
  const objectives = new Set(items.map((item) => item.blueprintObjective));
  for (const objective of requiredA1BlueprintObjectives) {
    assert.ok(objectives.has(objective), `${label}: missing blueprint objective ${objective}`);
  }
}

function substantiveA1Stem(item) {
  return normalized(item.stem.replace(
    /^During (?:a guided calculation|an unannounced field assessment|a pre-startup assurance review),\s*/i,
    "",
  ));
}

function validateA1PoolIsolation(leftItems, leftLabel, rightItems, rightLabel) {
  const rightByFormula = new Map(rightItems.map((item) => [item.formulaId, item]));
  for (const left of leftItems) {
    const right = rightByFormula.get(left.formulaId);
    if (!right) continue;
    const comparison = `${left.formulaId} in ${leftLabel} and ${rightLabel}`;
    assert.notEqual(
      substantiveA1Stem(left),
      substantiveA1Stem(right),
      `${comparison}: substantive stem and parameter set must differ`,
    );
    assert.notEqual(
      normalized(left.options[left.correctIndex]),
      normalized(right.options[right.correctIndex]),
      `${comparison}: correct result must not leak across pools`,
    );
    assert.notDeepEqual(
      left.options.map(normalized).sort(),
      right.options.map(normalized).sort(),
      `${comparison}: answer set must not be recycled across pools`,
    );
  }
}

test("CSP bank contains 800 isolated practice items and two sealed 200-item forms", () => {
  const practice = [...CSP_SEED, ...CSP_QUESTION_BANK_EXTRA, ...CSP_PRACTICE_EXTRA];
  const all = [...practice, ...CSP_MOCK_A, ...CSP_MOCK_B];
  assert.equal(practice.length, 800);
  assert.equal(CSP_MOCK_A.length, 200);
  assert.equal(CSP_MOCK_B.length, 200);
  assert.equal(all.length, 1200);
  assert.deepEqual(countsByDomain(practice), cspPracticeCounts);
  assert.deepEqual(countsByDomain(CSP_MOCK_A), cspMockCounts);
  assert.deepEqual(countsByDomain(CSP_MOCK_B), cspMockCounts);
  validateExpandedPoolIsolation(CSP_PRACTICE_EXTRA, CSP_MOCK_A, CSP_MOCK_B, "CSP expanded");
  validateItems(all, "CSP all");
  validateMockKeyBalance(CSP_MOCK_A, "CSP Mock A");
  validateMockKeyBalance(CSP_MOCK_B, "CSP Mock B");
  validateDifficultyCoverage(practice, "CSP practice");
  validateDifficultyCoverage(CSP_MOCK_A, "CSP Mock A");
  validateDifficultyCoverage(CSP_MOCK_B, "CSP Mock B");
  validateTopicBreadth(practice, cspPracticeTopicMinimums, "CSP practice");
  validateTopicBreadth(CSP_MOCK_A, cspMockTopicMinimums, "CSP Mock A");
  validateTopicBreadth(CSP_MOCK_B, cspMockTopicMinimums, "CSP Mock B");
  validateStemSkeletons(CSP_PRACTICE_EXTRA, 10, "CSP expanded practice");
  validateStemSkeletons(CSP_MOCK_A, 4, "CSP Mock A");
  validateStemSkeletons(CSP_MOCK_B, 4, "CSP Mock B");
  validateAnswerDiversity(CSP_PRACTICE_EXTRA, "CSP expanded practice", { minimumSetRate: 0.5, maximumSetRepeat: 10, minimumKeyRate: 0.2 });
  validateAnswerDiversity(CSP_MOCK_A, "CSP Mock A", { minimumSetRate: 0.8, maximumSetRepeat: 3, minimumKeyRate: 0.25 });
  validateAnswerDiversity(CSP_MOCK_B, "CSP Mock B", { minimumSetRate: 0.8, maximumSetRepeat: 3, minimumKeyRate: 0.25 });
  validateAnswerStyleBalance(CSP_PRACTICE_EXTRA, "CSP expanded practice");
  validateAnswerStyleBalance(CSP_MOCK_A, "CSP Mock A");
  validateAnswerStyleBalance(CSP_MOCK_B, "CSP Mock B");
});

test("ASP bank contains 800 isolated practice items and two sealed 200-item forms", () => {
  const practice = [
    ...ASP_QUESTION_BANK_A,
    ...ASP_QUESTION_BANK_B,
    ...ASP_QUESTION_BANK_EXTRA_A2,
    ...ASP_QUESTION_BANK_EXTRA_SET1,
    ...ASP_QUESTION_BANK_EXTRA_SET2,
    ...ASP_PRACTICE_EXTRA,
  ];
  const all = [...practice, ...ASP_MOCK_A, ...ASP_MOCK_B];
  assert.equal(practice.length, 800);
  assert.equal(ASP_MOCK_A.length, 200);
  assert.equal(ASP_MOCK_B.length, 200);
  assert.equal(all.length, 1200);
  assert.deepEqual(countsByDomain(practice), aspPracticeCounts);
  assert.deepEqual(countsByDomain(ASP_MOCK_A), aspMockCounts);
  assert.deepEqual(countsByDomain(ASP_MOCK_B), aspMockCounts);
  validateExpandedPoolIsolation(ASP_PRACTICE_EXTRA, ASP_MOCK_A, ASP_MOCK_B, "ASP expanded");
  validateItems(all, "ASP all");
  validateMockKeyBalance(ASP_MOCK_A, "ASP Mock A");
  validateMockKeyBalance(ASP_MOCK_B, "ASP Mock B");
  validateDifficultyCoverage(practice, "ASP practice");
  validateDifficultyCoverage(ASP_MOCK_A, "ASP Mock A");
  validateDifficultyCoverage(ASP_MOCK_B, "ASP Mock B");
  validateTopicBreadth(practice, aspPracticeTopicMinimums, "ASP practice");
  validateTopicBreadth(ASP_MOCK_A, aspMockTopicMinimums, "ASP Mock A");
  validateTopicBreadth(ASP_MOCK_B, aspMockTopicMinimums, "ASP Mock B");
  validateStemSkeletons(ASP_PRACTICE_EXTRA, 10, "ASP expanded practice");
  validateStemSkeletons(ASP_MOCK_A, 4, "ASP Mock A");
  validateStemSkeletons(ASP_MOCK_B, 4, "ASP Mock B");
  validateAnswerDiversity(ASP_PRACTICE_EXTRA, "ASP expanded practice", { minimumSetRate: 0.5, maximumSetRepeat: 10, minimumKeyRate: 0.2 });
  validateAnswerDiversity(ASP_MOCK_A, "ASP Mock A", { minimumSetRate: 0.8, maximumSetRepeat: 3, minimumKeyRate: 0.25 });
  validateAnswerDiversity(ASP_MOCK_B, "ASP Mock B", { minimumSetRate: 0.8, maximumSetRepeat: 3, minimumKeyRate: 0.25 });
  validateAnswerStyleBalance(ASP_PRACTICE_EXTRA, "ASP expanded practice");
  validateAnswerStyleBalance(ASP_MOCK_A, "ASP Mock A");
  validateAnswerStyleBalance(ASP_MOCK_B, "ASP Mock B");
});

test("ASP A1 expanded pools cover Yates calculations and all ASP11 A1 objectives", () => {
  const authored = [
    ...ASP_QUESTION_BANK_A,
    ...ASP_QUESTION_BANK_B,
    ...ASP_QUESTION_BANK_EXTRA_SET1,
  ].filter((item) => item.domainId === "A1");
  const practice = ASP_PRACTICE_EXTRA.filter((item) => item.domainId === "A1");
  const mockA = ASP_MOCK_A.filter((item) => item.domainId === "A1");
  const mockB = ASP_MOCK_B.filter((item) => item.domainId === "A1");

  assert.equal(authored.length, 20, "ASP A1 must retain 20 authored calculation questions");
  assert.equal(practice.length, 60, "ASP A1 expanded practice must contain 60 generated calculations");
  assert.match(authored.find((item) => item.id === "A1-014")?.objective ?? "", /slope run/i);
  assert.match(authored.find((item) => item.id === "A1-017")?.objective ?? "", /mean, median, and mode/i);
  validateA1FormulaMetadata(practice, "ASP A1 expanded practice");

  const practiceFormulaIds = new Set(practice.map((item) => item.formulaId));
  assert.equal(
    practiceFormulaIds.size,
    practice.length,
    "ASP A1 expanded practice must use a distinct primary formula for every generated calculation",
  );
  for (const formulaId of BCSP_FREQUENTLY_USED_FORMULA_IDS) {
    if (nonA1FrequentFormulaIds.has(formulaId)) {
      assert.ok(!practiceFormulaIds.has(formulaId), `ASP A1 must not retain out-of-scope or duplicated formula ${formulaId}`);
    } else {
      assert.ok(practiceFormulaIds.has(formulaId), `ASP A1 expanded practice is missing relevant frequent formula ${formulaId}`);
    }
  }
  for (const formulaId of requiredA1ReplacementFormulaIds) {
    assert.ok(practiceFormulaIds.has(formulaId), `ASP A1 expanded practice is missing replacement family ${formulaId}`);
  }

  const practiceCategories = new Set(practice.map((item) => item.formulaCategory));
  assert.ok(!practiceCategories.has("Electricity"), "Electrical calculations belong to ASP A2, not the A1 calculation pool");
  for (const category of requiredA1Categories) {
    assert.ok(practiceCategories.has(category), `ASP A1 expanded practice is missing formula category ${category}`);
  }

  const practiceFamilies = new Set(practice.map((item) => normalized(item.formulaFamily)));
  for (const family of requiredYatesMathFamilies) {
    assert.ok(practiceFamilies.has(family), `ASP A1 expanded practice is missing Yates Ch. 3 family ${family}`);
  }
  const practiceObjectives = new Set(practice.map((item) => item.blueprintObjective));
  for (const objective of requiredA1BlueprintObjectives) {
    assert.ok(practiceObjectives.has(objective), `ASP A1 expanded practice is missing blueprint objective ${objective}`);
  }

  validateA1MockFormulaBreadth(mockA, "ASP Mock A A1");
  validateA1MockFormulaBreadth(mockB, "ASP Mock B A1");
  assert.equal(
    mockB.find((item) => item.blueprintObjective === "A1.16")?.formulaId,
    "formula-ih-ppm",
    "Mock B A1.16 must perform a real unit/concentration conversion",
  );
  assert.equal(
    practice.find((item) => item.formulaId === "nws-heat-wind-chill-index")?.referenceFramework,
    "NWS",
    "The supplied wind-chill equation must retain its NWS provenance",
  );

  validateA1PoolIsolation(practice, "practice", mockA, "Mock A");
  validateA1PoolIsolation(practice, "practice", mockB, "Mock B");
  validateA1PoolIsolation(mockA, "Mock A", mockB, "Mock B");
});

test("every latent ASP A1 numeric variant remains answerable and collision-free", () => {
  for (const coverage of A1_PRACTICE_COVERAGE) {
    const stems = new Set();
    for (let seed = 0; seed < 3; seed += 1) {
      const generated = buildA1CalculationProblem(coverage.formulaId, seed);
      const answers = [generated.correct, ...generated.distractors];
      assert.equal(
        new Set(answers.map((answer) => normalized(answer.text))).size,
        4,
        `${coverage.formulaId} variant ${seed}: duplicate answer text`,
      );
      assert.ok(
        answers.every((answer) => answer.rationale.trim().length >= 20),
        `${coverage.formulaId} variant ${seed}: shallow answer rationale`,
      );
      stems.add(normalized(generated.stem));
    }
    assert.equal(stems.size, 3, `${coverage.formulaId}: numeric variants must produce distinct stems`);
  }
});
