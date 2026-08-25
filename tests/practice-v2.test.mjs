import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import demoPack from "../practice-v2/demo/demo-questions.json" with { type: "json" };
import { importPracticeV2Pack } from "../scripts/practice-v2-import-lib.mjs";
import {
  PRACTICE_V2_PROGRESS_KEY,
  emptyPracticeV2Progress,
  filterPracticeV2Questions,
  isPracticeV2ProductionEligible,
  loadPracticeV2Progress,
  practiceV2VerificationBadge,
  recordPracticeV2Answer,
  savePracticeV2Progress,
  selectPracticeV2Questions,
  validatePracticeV2Pack,
} from "../app/practiceV2.ts";

const demoAsp = demoPack.questions[0];
const q = (id, overrides = {}) => ({
  ...structuredClone(demoAsp),
  id,
  itemFamilyId: `family-${id}`,
  reviewStatus: "ready",
  verificationStatus: "source-checked",
  authoringOrigin: "ai-assisted",
  contentValidationStatus: "passed",
  duplicateSimilarityCheckStatus: "passed",
  sourceTitle: "Exact reviewed source title",
  sourceLocation: "Chapter 1, p. 1",
  ...overrides,
});
const pack = (questions) => ({ schemaVersion: 2, packId: "test-pack", packStatus: "content", questions });

test("the two-item demo pack is valid and cannot be mistaken for approved content", () => {
  assert.equal(demoPack.questions.length, 2);
  assert.deepEqual(validatePracticeV2Pack(demoPack), []);
  assert.ok(demoPack.questions.every((question) => question.reviewStatus === "demo"));
  assert.ok(demoPack.questions.every((question) => question.verificationStatus === "unverified"));
  assert.ok(demoPack.questions.every((question) => question.stem.startsWith("DEMO ONLY")));
});

test("validation rejects duplicate IDs and non-unique or non-four-option sets", () => {
  const duplicate = pack([q("one"), q("one")]);
  assert.ok(validatePracticeV2Pack(duplicate).some((issue) => issue.code === "duplicate-id"));
  const three = pack([q("three", { options: ["A", "B", "C"] })]);
  assert.ok(validatePracticeV2Pack(three).some((issue) => issue.code === "invalid-option-count"));
  const repeated = pack([q("repeat", { options: ["A", "A", "C", "D"] })]);
  assert.ok(validatePracticeV2Pack(repeated).some((issue) => issue.code === "duplicate-options"));
});

test("validation rejects invalid answer indexes and missing distractor explanations", () => {
  assert.ok(validatePracticeV2Pack(pack([q("bad-index", { correctOptionIndex: 4 })])).some((issue) => issue.code === "invalid-correct-index"));
  assert.ok(validatePracticeV2Pack(pack([q("missing-explanation", { incorrectOptionExplanations: [null, "", "why C", "why D"] })])).some((issue) => issue.code === "missing-option-explanation"));
});

test("validation rejects missing chapters, invalid objectives, and unsourced verified items", () => {
  const issues = validatePracticeV2Pack(pack([q("invalid", { chapterId: "", primaryObjectiveId: "ASP11-A1.99", sourceTitle: null })]));
  assert.ok(issues.some((issue) => issue.code === "missing-chapter-id"));
  assert.ok(issues.some((issue) => issue.code === "invalid-objective"));
  assert.ok(issues.some((issue) => issue.code === "missing-verified-source-title"));
});

test("pack labels cannot promote demo or unverified items", () => {
  assert.ok(validatePracticeV2Pack({ ...pack([q("demo-mismatch")]), packStatus: "demo" }).some((issue) => issue.code === "pack-status-mismatch"));
  assert.ok(validatePracticeV2Pack(pack([q("content-demo", { reviewStatus: "demo", verificationStatus: "unverified", contentValidationStatus: "pending", duplicateSimilarityCheckStatus: "pending" })])).some((issue) => issue.code === "pack-status-mismatch"));
});

test("source-checked eligibility requires every production safety gate", () => {
  const valid = q("eligible");
  assert.deepEqual(validatePracticeV2Pack(pack([valid])), []);
  assert.equal(isPracticeV2ProductionEligible(valid), true);
  for (const [field, value, code] of [
    ["primaryObjectiveId", "ASP11-A1.99", "invalid-objective"],
    ["sourceTitle", null, "missing-verified-source-title"],
    ["sourceLocation", "somewhere nearby", "missing-exact-source-location"],
    ["contentValidationStatus", "pending", "content-validation-not-passed"],
    ["duplicateSimilarityCheckStatus", "pending", "similarity-check-not-passed"],
  ]) {
    const candidate = q(`bad-${field}`, { [field]: value });
    assert.ok(validatePracticeV2Pack(pack([candidate])).some((issue) => issue.code === code));
    assert.equal(isPracticeV2ProductionEligible(candidate), false);
  }
});

test("calculation items require formula and units before verification", () => {
  const missing = q("calculation", { questionType: "calculation", formula: null, units: null });
  assert.ok(validatePracticeV2Pack(pack([missing])).some((issue) => issue.code === "missing-calculation-metadata"));
  assert.equal(isPracticeV2ProductionEligible(missing), false);
  assert.equal(isPracticeV2ProductionEligible(q("calculation-ready", { questionType: "calculation", formula: "demo formula", units: "demo units" })), true);
});

test("verification labels cannot overstate AI-assisted or unverified content", () => {
  const checked = q("checked");
  assert.equal(practiceV2VerificationBadge(checked), "Source-checked · AI-assisted");
  assert.ok(validatePracticeV2Pack(pack([{ ...checked, verificationStatus: "human-reviewed" }])).some((issue) => issue.code === "human-reviewed-origin"));
  const human = q("human", { verificationStatus: "human-reviewed", authoringOrigin: "human-authored" });
  assert.equal(practiceV2VerificationBadge(human), "Human-reviewed");
  const unverified = q("hidden", { reviewStatus: "draft", verificationStatus: "unverified", authoringOrigin: "imported", contentValidationStatus: "pending", duplicateSimilarityCheckStatus: "pending", sourceTitle: null, sourceLocation: null });
  assert.equal(isPracticeV2ProductionEligible(unverified), false);
  assert.equal(practiceV2VerificationBadge(unverified), "Unverified");
});

test("Practice V2 renders the required source disclaimer and keeps verified content outside readiness", async () => {
  const view = await readFile(new URL("../app/PracticeV2View.tsx", import.meta.url), "utf8");
  const catalog = await readFile(new URL("../app/practiceV2Catalog.ts", import.meta.url), "utf8");
  assert.match(view, /These practice questions were checked against cited study and regulatory sources/);
  assert.match(view, /not official BCSP questions and have not necessarily been reviewed by an instructor/);
  assert.match(view, /does not update Homework, legacy Practice, Mock Exams, cloud synchronization, or the Practice Readiness Indicator/);
  assert.match(view, /not psychometrically calibrated/);
  assert.match(catalog, /filter\(isPracticeV2ProductionEligible\)/);
});

test("single- and multi-chapter filtering stays inside the selected credential", () => {
  const questions = [q("a", { chapterId: "a" }), q("b", { chapterId: "b" }), q("csp", { credential: "CSP", blueprintVersion: "CSP11", primaryObjectiveId: "CSP11-D1.01", chapterId: "a" })];
  assert.deepEqual(filterPracticeV2Questions(questions, "ASP", ["a"]).map((item) => item.id), ["a"]);
  assert.deepEqual(filterPracticeV2Questions(questions, "ASP", ["a", "b"]).map((item) => item.id), ["a", "b"]);
});

test("selection prioritizes unseen items and separates item families", () => {
  const questions = [q("seen"), q("new-a", { itemFamilyId: "shared" }), q("new-b", { itemFamilyId: "shared" }), q("new-c")];
  const progress = { ...emptyPracticeV2Progress(), seenQuestionIds: ["seen"] };
  const selected = selectPracticeV2Questions({ questions, credential: "ASP", chapterIds: ["demo-asp"], count: 3, progress, seed: "fixed" });
  assert.equal(new Set(selected.map((item) => item.itemFamilyId)).size, selected.length);
  assert.ok(!selected.slice(0, 2).some((item) => item.id === "seen"));
  assert.equal(selected.filter((item) => item.itemFamilyId === "shared").length, 1);
});

test("mistake review selects only unresolved incorrect questions", () => {
  const questions = [q("wrong"), q("right")];
  const progress = { ...emptyPracticeV2Progress(), incorrectQuestionIds: ["wrong"] };
  const selected = selectPracticeV2Questions({ questions, credential: "ASP", chapterIds: ["demo-asp"], count: 10, progress, mode: "mistakes" });
  assert.deepEqual(selected.map((item) => item.id), ["wrong"]);
  const corrected = recordPracticeV2Answer(progress, "wrong", true, false, "2026-01-01T00:00:00.000Z");
  assert.deepEqual(corrected.incorrectQuestionIds, []);
});

test("incorrect and high-confidence incorrect answers are tracked independently", () => {
  const next = recordPracticeV2Answer(emptyPracticeV2Progress(), "miss", false, true, "2026-01-01T00:00:00.000Z");
  assert.deepEqual(next.seenQuestionIds, ["miss"]);
  assert.deepEqual(next.incorrectQuestionIds, ["miss"]);
  assert.deepEqual(next.highConfidenceIncorrectQuestionIds, ["miss"]);
  assert.equal(next.attempts.miss.attempts, 1);
});

test("Practice V2 persistence changes only its own key and preserves existing learner data", () => {
  const values = new Map([
    ["asp-csp-coach-v2", "legacy-progress"],
    ["homework-progress", "homework-progress"],
    ["mock-progress", "mock-progress"],
    ["cloud-progress", "cloud-progress"],
  ]);
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  savePracticeV2Progress(storage, recordPracticeV2Answer(emptyPracticeV2Progress(), "new", false, false));
  assert.equal(values.get("asp-csp-coach-v2"), "legacy-progress");
  assert.equal(values.get("homework-progress"), "homework-progress");
  assert.equal(values.get("mock-progress"), "mock-progress");
  assert.equal(values.get("cloud-progress"), "cloud-progress");
  assert.ok(values.has(PRACTICE_V2_PROGRESS_KEY));
  assert.deepEqual(loadPracticeV2Progress(storage).incorrectQuestionIds, ["new"]);
});

test("import is atomic, preserves supplied JSON bytes, and reports imported items", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "practice-v2-import-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = path.join(root, "supplied.json");
  const supplied = `${JSON.stringify(pack([q("imported-one")]), null, 4)}\n`;
  await writeFile(input, supplied, "utf8");
  const report = await importPracticeV2Pack(input, { rootDirectory: root });
  assert.equal(report.status, "imported");
  assert.deepEqual(report.imported, ["imported-one"]);
  assert.equal(await readFile(report.destinationFile, "utf8"), supplied);
});

test("invalid or duplicate imports reject the complete file without partial output", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "practice-v2-reject-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = path.join(root, "invalid.json");
  await writeFile(input, JSON.stringify(pack([q("same"), q("same")])), "utf8");
  const report = await importPracticeV2Pack(input, { rootDirectory: root });
  assert.equal(report.status, "rejected");
  assert.deepEqual(report.imported, []);
  assert.deepEqual(report.duplicates, ["same"]);
  await assert.rejects(readdir(path.join(root, "practice-v2", "imported")), { code: "ENOENT" });
  const persistedReport = JSON.parse(await readFile(path.join(root, "reports", "practice-v2-import-report.json"), "utf8"));
  assert.equal(persistedReport.status, "rejected");
});

test("importer independently rejects highly similar stems", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "practice-v2-similar-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = path.join(root, "similar.json");
  const first = q("similar-one", { stem: "A long unique safety scenario asks which exact control should be selected before work begins today." });
  const second = q("similar-two", { stem: "A long unique safety scenario asks which exact control should be selected before work begins today." });
  await writeFile(input, JSON.stringify(pack([first, second])), "utf8");
  const report = await importPracticeV2Pack(input, { rootDirectory: root });
  assert.equal(report.status, "rejected");
  assert.equal(report.similarItems.length, 1);
  assert.equal(report.similarItems[0].similarToQuestionId, "similar-one");
  assert.ok(report.errors.some((issue) => issue.code === "similar-question"));
});
