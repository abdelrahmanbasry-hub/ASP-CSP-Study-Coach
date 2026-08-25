import assert from "node:assert/strict";
import test from "node:test";

import {
  applyDomainStabilityForBlock,
  ASSESSMENT_EVIDENCE_CONFIG,
  chooseMockForm,
  defaultMastery,
  difficultyLabel,
  generateSession,
  normalizeDomainMastery,
  overallReadiness,
  PROVISIONAL_DIFFICULTY_NOTE,
  READINESS_DISCLAIMER,
  READINESS_INSUFFICIENT_EXPLANATION,
  READINESS_INSUFFICIENT_LABEL,
  READINESS_LABEL,
  readinessScore,
  updateDomainMastery,
} from "../app/adaptiveEngine.ts";

const cspDomains = [
  ["D1", 0.25], ["D2", 0.25], ["D3", 0.15], ["D4", 0.09],
  ["D5", 0.06], ["D6", 0.10], ["D7", 0.10],
].map(([id, weight]) => ({ id, weight, name: id, short: id, color: "#000" }));

const aspDomains = [
  ["A1", 0.10], ["A2", 0.25], ["A3", 0.08], ["A4", 0.12], ["A5", 0.10],
  ["A6", 0.12], ["A7", 0.07], ["A8", 0.11], ["A9", 0.05],
].map(([id, weight]) => ({ id, weight, name: id, short: id, color: "#000" }));

function bankFor(domains) {
  return domains.flatMap((domain) =>
    Array.from({ length: 60 }, (_, index) => ({
      id: `${domain.id}-TEST-${String(index + 1).padStart(2, "0")}`,
      domainId: domain.id,
      competency: "Blueprint allocation",
      difficulty: (index % 5) + 1,
      stem: `Original ${domain.id} test item ${index + 1}`,
      options: ["One", "Two", "Three", "Four"],
      correctIndex: 2,
      rationale: "Test rationale",
      wrongRationales: ["No", "No", "Correct", "No"],
      referenceFramework: "BCSP Blueprint",
      referenceTopic: "Public domain weights",
      challengePrompt: "Explain the decision.",
    })),
  );
}

function allocation(session, domains) {
  return domains.map((domain) => session.filter((item) => item.domainId === domain.id).length);
}

test("full simulations use exact current blueprint allocations", () => {
  const csp = generateSession({
    mode: "exam", count: 200, seed: 11, domains: cspDomains,
    masteries: defaultMastery(cspDomains), questionBank: bankFor(cspDomains),
  });
  const asp = generateSession({
    mode: "exam", count: 200, seed: 11, domains: aspDomains,
    masteries: defaultMastery(aspDomains), questionBank: bankFor(aspDomains),
  });

  assert.deepEqual(allocation(csp, cspDomains), [50, 50, 30, 18, 12, 20, 20]);
  assert.deepEqual(allocation(asp, aspDomains), [20, 50, 16, 24, 20, 24, 14, 22, 10]);
  assert.equal(new Set(csp.map((item) => item.catalogId)).size, 200);
  assert.equal(new Set(asp.map((item) => item.catalogId)).size, 200);
});

test("20-item balanced drills preserve blueprint proportions", () => {
  const csp = generateSession({
    mode: "quick", count: 20, seed: 29, domains: cspDomains,
    masteries: defaultMastery(cspDomains), questionBank: bankFor(cspDomains),
  });
  const asp = generateSession({
    mode: "quick", count: 20, seed: 29, domains: aspDomains,
    masteries: defaultMastery(aspDomains), questionBank: bankFor(aspDomains),
  });

  assert.deepEqual(allocation(csp, cspDomains), [5, 5, 3, 2, 1, 2, 2]);
  assert.deepEqual(allocation(asp, aspDomains), [2, 5, 2, 2, 2, 2, 2, 2, 1]);
});

test("sustained success can move the provisional authoring tie-breaker", () => {
  let mastery = defaultMastery(cspDomains).D1;
  for (let index = 0; index < 18; index += 1) {
    mastery = updateDomainMastery(mastery, mastery.difficulty, true, "sure", 75);
  }
  assert.ok(mastery.difficulty >= 4);
  assert.equal(difficultyLabel(4), "Provisional Level 4");
  assert.equal(difficultyLabel(5), "Provisional Level 5");
  assert.match(PROVISIONAL_DIFFICULTY_NOTE, /not yet been empirically calibrated/i);
});

test("new learners receive an insufficient-evidence state, never an artificial percentage", () => {
  const mastery = defaultMastery(cspDomains);
  assert.equal(readinessScore(mastery.D1), null);
  assert.equal(overallReadiness(mastery, cspDomains, 0), null);
  assert.equal(READINESS_INSUFFICIENT_LABEL, "Insufficient evidence");
  assert.match(READINESS_INSUFFICIENT_EXPLANATION, /Complete the diagnostic/i);
  assert.equal(ASSESSMENT_EVIDENCE_CONFIG.readiness.minimumIndependentQuestions, 20);
});

test("repeated responses cannot substitute for the independent readiness threshold", () => {
  const mastery = defaultMastery(cspDomains);
  for (const domain of cspDomains) {
    mastery[domain.id] = {
      theta: 1,
      correct: 8,
      answered: 10,
      recent: Array(10).fill(true),
      stableBlocks: 0,
      difficulty: 3,
    };
  }
  assert.equal(overallReadiness(mastery, cspDomains, 5), null);
  assert.equal(typeof overallReadiness(mastery, cspDomains, 20), "number");
});

test("readiness is explicitly a practice indicator and not a BCSP result prediction", () => {
  assert.equal(READINESS_LABEL, "Practice Readiness Indicator");
  assert.match(READINESS_DISCLAIMER, /coaching estimate based on your practice activity/i);
  assert.match(READINESS_DISCLAIMER, /not a prediction of your BCSP examination result/i);
});

test("weakest mode concentrates exposure in the two lowest-readiness domains", () => {
  const mastery = defaultMastery(cspDomains);
  for (const domain of cspDomains.slice(2)) {
    mastery[domain.id] = { theta: 1.8, correct: 28, answered: 30, recent: Array(30).fill(true), stableBlocks: 2, difficulty: 4 };
  }
  const session = generateSession({
    mode: "weakest", count: 20, seed: 71, domains: cspDomains,
    masteries: mastery, questionBank: bankFor(cspDomains),
  });
  assert.deepEqual([...new Set(session.map((item) => item.domainId))].sort(), ["D1", "D2"]);
});

test("sealed mock selection uses each clean form before warning on a repeat", () => {
  assert.deepEqual(chooseMockForm([]), { form: "A", firstExposure: true });
  assert.deepEqual(chooseMockForm([{ mockForm: "A", date: 10 }]), { form: "B", firstExposure: true });
  assert.deepEqual(
    chooseMockForm([{ mockForm: "A", date: 10 }, { mockForm: "B", date: 20 }]),
    { form: "A", firstExposure: false },
  );
  assert.deepEqual(
    chooseMockForm([{ mockForm: "A", date: 30 }, { mockForm: "B", date: 20 }]),
    { form: "B", firstExposure: false },
  );
});

test("session generation cannot cross the bank boundary supplied by the caller", () => {
  const practice = bankFor(cspDomains).map((item) => ({ ...item, id: `P-${item.id}`, pool: "practice" }));
  const mock = bankFor(cspDomains).map((item) => ({ ...item, id: `MA-${item.id}`, pool: "mock-a" }));
  const generatedPractice = generateSession({
    mode: "quick", count: 20, seed: 91, domains: cspDomains,
    masteries: defaultMastery(cspDomains), questionBank: practice,
  });
  const generatedMock = generateSession({
    mode: "exam", count: 200, seed: 92, domains: cspDomains,
    masteries: defaultMastery(cspDomains), questionBank: mock,
  });
  assert.ok(generatedPractice.every((item) => item.pool === "practice" && item.id.startsWith("P-")));
  assert.ok(generatedMock.every((item) => item.pool === "mock-a" && item.id.startsWith("MA-")));
});

test("adaptive selection exhausts unseen practice items before recycling seen items", () => {
  const domains = [{ id: "D1", weight: 1, name: "D1", short: "D1", color: "#000" }];
  const bank = bankFor(domains).slice(0, 20);
  const onlyUnseen = bank.at(-1).id;
  const session = generateSession({
    mode: "daily",
    count: 1,
    seed: 101,
    domains,
    masteries: defaultMastery(domains),
    questionBank: bank,
    seenQuestionIds: bank.slice(0, -1).map((item) => item.id),
  });
  assert.equal(session[0].id, onlyUnseen);
});

test("weak-objective evidence outranks a closer provisional difficulty match", () => {
  const domains = [{ id: "D1", weight: 1, name: "D1", short: "D1", color: "#000" }];
  const [weak, difficultyMatch] = bankFor(domains).slice(0, 2).map((item) => ({ ...item }));
  weak.id = "weak-objective";
  weak.objective = "Weak objective";
  weak.difficulty = 5;
  difficultyMatch.id = "difficulty-match";
  difficultyMatch.objective = "Strong objective";
  difficultyMatch.difficulty = 1;
  const session = generateSession({
    mode: "daily",
    count: 1,
    seed: 5,
    domains,
    masteries: defaultMastery(domains),
    questionBank: [weak, difficultyMatch],
    weakObjectiveKeys: ["D1::Weak objective"],
  });
  assert.equal(session[0].id, "weak-objective");
});

test("recent incorrect and confident-error evidence outranks provisional difficulty", () => {
  const domains = [{ id: "D1", weight: 1, name: "D1", short: "D1", color: "#000" }];
  const [errorItem, difficultyMatch] = bankFor(domains).slice(0, 2).map((item) => ({ ...item }));
  errorItem.id = "confident-error";
  errorItem.difficulty = 5;
  difficultyMatch.id = "difficulty-match";
  difficultyMatch.difficulty = 1;
  const session = generateSession({
    mode: "daily",
    count: 1,
    seed: 7,
    domains,
    masteries: defaultMastery(domains),
    questionBank: [errorItem, difficultyMatch],
    seenQuestionIds: [errorItem.id, difficultyMatch.id],
    recentIncorrectIds: [errorItem.id],
    highConfidenceIncorrectIds: [errorItem.id],
  });
  assert.equal(session[0].id, errorItem.id);
});

test("a domain cannot gain stability from insufficient current-block evidence", () => {
  const current = { ...defaultMastery(cspDomains).D1, stableBlocks: 1, answered: 40, correct: 35 };
  const updated = applyDomainStabilityForBlock(current, [
    { questionId: "only-one", correct: true, itemFamily: "family-a" },
  ]);
  assert.equal(updated.stableBlocks, 1);
  assert.equal(updated.lastBlockEvidence, "not-enough-current-evidence");
});

test("domain stability requires independent families when family metadata exists", () => {
  const current = { ...defaultMastery(cspDomains).D1, stableBlocks: 1 };
  const sameFamily = applyDomainStabilityForBlock(current, [
    { questionId: "one", correct: true, itemFamily: "family-a" },
    { questionId: "two", correct: true, itemFamily: "family-a" },
    { questionId: "three", correct: true, itemFamily: "family-a" },
  ]);
  const independent = applyDomainStabilityForBlock(current, [
    { questionId: "one", correct: true, itemFamily: "family-a" },
    { questionId: "two", correct: true, itemFamily: "family-b" },
    { questionId: "three", correct: true, itemFamily: "family-c" },
    { questionId: "four", correct: true, itemFamily: "family-d" },
    { questionId: "five", correct: false, itemFamily: "family-e" },
  ]);
  assert.equal(sameFamily.lastBlockEvidence, "not-enough-current-evidence");
  assert.equal(sameFamily.stableBlocks, 1);
  assert.equal(independent.lastBlockEvidence, "qualified");
  assert.equal(independent.stableBlocks, 2);
});

test("older partial mastery records remain readable with defensive defaults", () => {
  const normalized = normalizeDomainMastery({ answered: 12, correct: 9 });
  assert.deepEqual(normalized, {
    theta: -0.35,
    correct: 9,
    answered: 12,
    recent: [],
    stableBlocks: 0,
    difficulty: 2,
  });
  assert.doesNotThrow(() => normalizeDomainMastery({ recent: undefined, difficulty: undefined }));
});
