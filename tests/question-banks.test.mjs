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

const cspPracticeCounts = { D1: 200, D2: 200, D3: 120, D4: 72, D5: 48, D6: 80, D7: 80 };
const cspMockCounts = { D1: 50, D2: 50, D3: 30, D4: 18, D5: 12, D6: 20, D7: 20 };
const aspPracticeCounts = { A1: 80, A2: 200, A3: 64, A4: 96, A5: 80, A6: 96, A7: 56, A8: 88, A9: 40 };
const aspMockCounts = { A1: 20, A2: 50, A3: 16, A4: 24, A5: 20, A6: 24, A7: 14, A8: 22, A9: 10 };
const cspPracticeTopicMinimums = { D1: 24, D2: 24, D3: 16, D4: 12, D5: 10, D6: 14, D7: 12 };
const cspMockTopicMinimums = { D1: 14, D2: 14, D3: 10, D4: 8, D5: 6, D6: 8, D7: 8 };
const aspPracticeTopicMinimums = { A1: 15, A2: 24, A3: 12, A4: 16, A5: 12, A6: 16, A7: 10, A8: 14, A9: 8 };
const aspMockTopicMinimums = { A1: 8, A2: 14, A3: 7, A4: 9, A5: 8, A6: 9, A7: 6, A8: 8, A9: 5 };

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
