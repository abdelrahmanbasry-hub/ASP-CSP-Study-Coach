import assert from "node:assert/strict";
import test from "node:test";

import {
  chooseMockForm,
  defaultMastery,
  difficultyLabel,
  generateSession,
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

test("sustained success escalates into the explicit exam-level band", () => {
  let mastery = defaultMastery(cspDomains).D1;
  for (let index = 0; index < 18; index += 1) {
    mastery = updateDomainMastery(mastery, mastery.difficulty, true, "sure", 75);
  }
  assert.ok(mastery.difficulty >= 4);
  assert.equal(difficultyLabel(4), "Exam level");
  assert.equal(difficultyLabel(5), "Exam-day stretch");
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
