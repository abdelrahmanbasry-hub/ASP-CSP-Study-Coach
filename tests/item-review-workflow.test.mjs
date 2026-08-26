import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ITEM_REVIEW_CATALOG,
  ITEM_REVIEW_QUEUE,
  PILOT_REVIEW_QUEUE,
} from "../app/itemReviewCatalog.ts";
import {
  EXTENDED_BLUEPRINT_COVERAGE_REPORT,
  ITEM_REVIEW_REPORT,
  REVIEWER_PROGRESS_DASHBOARD,
} from "../app/itemReviewReport.ts";
import {
  applyHumanReviewPatch,
  approveCurrentItemVersion,
  approveObjectiveMapping,
  createNextItemVersion,
  markItemOperational,
  operationalEligibilityErrors,
  resolveAttemptVersion,
  resolveItemVersion,
} from "../app/itemReview.ts";

const HUMAN = {
  reviewerId: "reviewer-001",
  reviewDate: "2026-08-25",
  confirmedHuman: true,
};

function currentSnapshot(history) {
  return history.versions.at(-1);
}

function exactSource() {
  return {
    sourceTitle: "Verified safety reference",
    sourceOrganizationOrAuthor: "Authoritative publisher",
    sourceEditionOrVersion: "2026 edition",
    sourceLocator: "Chapter 4, section 4.2, page 117",
    sourceEffectiveDate: "2026-01-01",
  };
}

test("all automated records remain unreviewed, suggested, and non-operational", () => {
  assert.equal(ITEM_REVIEW_CATALOG.length, 2400);
  assert.ok(
    ITEM_REVIEW_CATALOG.every(
      (item) =>
        item.review.operationalStatus === "unreviewed" &&
        item.review.mappingStatus !== "reviewed" &&
        item.review.mappingOrigin !== "human" &&
        item.review.reviewerId === null &&
        item.review.reviewedItemVersion === null,
    ),
  );
  const suggested = ITEM_REVIEW_CATALOG.find((item) => item.review.mappingStatus === "suggested");
  assert.ok(suggested);
  assert.throws(
    () => approveObjectiveMapping(
      suggested.review,
      suggested.review.primaryObjectiveId,
      suggested.review.secondaryObjectiveIds,
      { ...HUMAN, confirmedHuman: false },
    ),
    /confirmed human reviewer/,
  );
  assert.throws(
    () => applyHumanReviewPatch(
      suggested.review,
      { operationalStatus: "operational" },
      HUMAN,
    ),
    /validated operational gate/,
  );
});

test("reviewed operational items require an exact source citation", () => {
  const item = ITEM_REVIEW_CATALOG.find((candidate) => candidate.review.mappingStatus === "suggested");
  assert.ok(item);
  let record = approveObjectiveMapping(
    item.review,
    item.review.primaryObjectiveId,
    item.review.secondaryObjectiveIds,
    HUMAN,
  );
  record = applyHumanReviewPatch(record, {
    sourceVerificationStatus: "reviewed",
    keyedAnswerReviewStatus: "reviewed",
    technicalReviewStatus: "reviewed",
    assessmentWritingReviewStatus: "reviewed",
    issueStatus: "reviewed",
    calculationAndUnitsReviewStatus: "reviewed",
    formulaReviewStatus: "reviewed",
    unitReviewStatus: "reviewed",
    roundingAssumptionReviewStatus: "reviewed",
  }, HUMAN);
  record = approveCurrentItemVersion(record, currentSnapshot(item.history), HUMAN);
  assert.ok(
    operationalEligibilityErrors(record, currentSnapshot(item.history)).includes(
      "an exact source citation is required",
    ),
  );
  assert.throws(
    () => markItemOperational(record, currentSnapshot(item.history), HUMAN),
    /exact source citation/,
  );
});

test("controlled changes create a new version, preserve the old version, and reset review", () => {
  const item = ITEM_REVIEW_CATALOG.find((candidate) => candidate.review.mappingStatus === "suggested");
  assert.ok(item);
  const approved = approveObjectiveMapping(
    item.review,
    item.review.primaryObjectiveId,
    item.review.secondaryObjectiveIds,
    HUMAN,
  );
  const reviewedHistory = { ...item.history, currentReview: approved };
  const changedQuestion = { ...item.question, stem: `${item.question.stem} Controlled revision.` };
  const next = createNextItemVersion(reviewedHistory, changedQuestion, item.mapping);
  assert.equal(next.currentVersion, 2);
  assert.equal(next.versions.length, 2);
  assert.equal(next.versions[0].content.stem, item.question.stem);
  assert.equal(next.versions[0].reviewRecord.mappingStatus, "reviewed");
  assert.equal(next.versions[1].content.stem, changedQuestion.stem);
  assert.equal(next.currentReview.mappingStatus, "suggested");
  assert.equal(next.currentReview.technicalReviewStatus, "unreviewed");
  assert.equal(next.currentReview.operationalStatus, "changes-required");
  assert.equal(next.currentReview.reviewedItemVersion, null);
  assert.equal(resolveItemVersion(next, 1)?.content.stem, item.question.stem);
  assert.equal(resolveItemVersion(next, 2)?.content.stem, changedQuestion.stem);
});

test("source, formula, units, and objective edits cannot silently overwrite a version", () => {
  const item = ITEM_REVIEW_CATALOG.find(
    (candidate) => candidate.review.mappingStatus === "suggested" && candidate.question.formulaId,
  );
  assert.ok(item);
  assert.throws(
    () => applyHumanReviewPatch(item.review, { sourceTitle: "Different source" }, HUMAN),
    /new item version/,
  );
  assert.throws(
    () => approveObjectiveMapping(
      item.review,
      item.review.primaryObjectiveId === "ASP11-A1.01" ? "ASP11-A1.02" : "ASP11-A1.01",
      [],
      HUMAN,
    ),
    /new item version/,
  );

  const formulaRevision = createNextItemVersion(
    item.history,
    { ...item.question, formulaId: `${item.question.formulaId}-revised` },
    item.mapping,
  );
  assert.equal(formulaRevision.currentVersion, 2);
  assert.notEqual(
    formulaRevision.versions[0].content.formulaId,
    formulaRevision.versions[1].content.formulaId,
  );

  const unitsRevision = createNextItemVersion(
    item.history,
    { ...item.question, stem: `${item.question.stem} Report the result in SI units.` },
    item.mapping,
  );
  assert.equal(unitsRevision.currentVersion, 2);
  assert.match(unitsRevision.versions[1].content.stem, /SI units/);

  const mappingRevision = createNextItemVersion(item.history, item.question, {
    ...item.mapping,
    primaryObjectiveId:
      item.mapping.primaryObjectiveId === "ASP11-A1.01" ? "ASP11-A1.02" : "ASP11-A1.01",
    mappingStatus: "suggested",
    mappingOrigin: "human",
  });
  assert.equal(mappingRevision.currentVersion, 2);
  assert.notEqual(
    mappingRevision.versions[0].reviewRecord.primaryObjectiveId,
    mappingRevision.versions[1].reviewRecord.primaryObjectiveId,
  );
});

test("learner history resolves the immutable version originally served", () => {
  const item = ITEM_REVIEW_CATALOG.find((candidate) => candidate.review.mappingStatus === "suggested");
  assert.ok(item);
  const next = createNextItemVersion(
    item.history,
    { ...item.question, rationale: `${item.question.rationale} Controlled revision.` },
    item.mapping,
  );
  assert.equal(resolveAttemptVersion(next, { itemVersion: 1 })?.itemVersion, 1);
  assert.equal(resolveAttemptVersion(next, { itemVersion: 2 })?.itemVersion, 2);
  assert.equal(resolveAttemptVersion(next, {})?.itemVersion, 1);
});

test("calculation items require formula, unit, rounding, and calculation review", () => {
  const item = ITEM_REVIEW_CATALOG.find(
    (candidate) => candidate.review.calculationItem && candidate.review.mappingStatus === "suggested",
  );
  assert.ok(item);
  let record = approveObjectiveMapping(
    item.review,
    item.review.primaryObjectiveId,
    item.review.secondaryObjectiveIds,
    HUMAN,
  );
  record = { ...record, ...exactSource(), sourceVerificationStatus: "reviewed", keyedAnswerReviewStatus: "reviewed", technicalReviewStatus: "reviewed", assessmentWritingReviewStatus: "reviewed", issueStatus: "reviewed", reviewedItemVersion: 1, reviewedContentFingerprint: currentSnapshot(item.history).contentFingerprint };
  const errors = operationalEligibilityErrors(record, currentSnapshot(item.history));
  assert.ok(errors.includes("controlled item data changed without a new item version"));
  assert.ok(errors.includes("formula review is required"));
  assert.ok(errors.includes("unit review is required"));
  assert.ok(errors.includes("rounding and assumption review is required"));
  assert.ok(errors.includes("calculation and units review is required"));
});

test("mock items require family-independence and distractor-quality review", () => {
  const item = ITEM_REVIEW_CATALOG.find(
    (candidate) => candidate.credential === "CSP" && candidate.review.bankPool === "mock-a",
  );
  assert.ok(item);
  const objectiveId = `CSP11-${item.question.domainId}.01`;
  const mapping = {
    ...item.mapping,
    primaryObjectiveId: objectiveId,
    secondaryObjectiveIds: [],
    mappingStatus: "suggested",
    mappingOrigin: "human",
  };
  const versioned = createNextItemVersion(item.history, item.question, mapping, exactSource());
  let record = approveObjectiveMapping(
    versioned.currentReview,
    objectiveId,
    [],
    HUMAN,
  );
  record = applyHumanReviewPatch(record, {
    sourceVerificationStatus: "reviewed",
    keyedAnswerReviewStatus: "reviewed",
    technicalReviewStatus: "reviewed",
    assessmentWritingReviewStatus: "reviewed",
    issueStatus: "reviewed",
  }, HUMAN);
  record = approveCurrentItemVersion(record, currentSnapshot(versioned), HUMAN);
  const errors = operationalEligibilityErrors(record, currentSnapshot(versioned));
  assert.ok(errors.includes("mock item-family independence review is required"));
  assert.ok(errors.includes("mock distractor-quality review is required"));
});

test("a fully human-reviewed practice item can pass the operational gate", () => {
  const item = ITEM_REVIEW_CATALOG.find(
    (candidate) => candidate.review.calculationItem && candidate.review.mappingStatus === "suggested",
  );
  assert.ok(item);
  const versioned = createNextItemVersion(item.history, item.question, item.mapping, exactSource());
  let record = approveObjectiveMapping(
    versioned.currentReview,
    versioned.currentReview.primaryObjectiveId,
    [],
    HUMAN,
  );
  record = applyHumanReviewPatch(record, {
    sourceVerificationStatus: "reviewed",
    keyedAnswerReviewStatus: "reviewed",
    technicalReviewStatus: "reviewed",
    assessmentWritingReviewStatus: "reviewed",
    calculationAndUnitsReviewStatus: "reviewed",
    formulaReviewStatus: "reviewed",
    unitReviewStatus: "reviewed",
    roundingAssumptionReviewStatus: "reviewed",
    issueStatus: "reviewed",
  }, HUMAN);
  record = approveCurrentItemVersion(record, currentSnapshot(versioned), HUMAN);
  assert.deepEqual(operationalEligibilityErrors(record, currentSnapshot(versioned)), []);
  const operational = markItemOperational(record, currentSnapshot(versioned), HUMAN);
  assert.equal(operational.operationalStatus, "operational");
  assert.equal(operational.mappingOrigin, "human");
});

test("priority and pilot queues match the required order and remain unapproved", () => {
  assert.equal(ITEM_REVIEW_QUEUE.length, 2400);
  assert.deepEqual(
    [...new Set(ITEM_REVIEW_QUEUE.slice(0, 200).map((entry) => entry.priorityReason))],
    ["CSP Mock A"],
  );
  assert.equal(PILOT_REVIEW_QUEUE.aspA1Suggestions.length, 100);
  assert.equal(PILOT_REVIEW_QUEUE.highSimilarityCspMockItems.length, 20);
  assert.equal(PILOT_REVIEW_QUEUE.calculationItems.length, 20);
  assert.equal(PILOT_REVIEW_QUEUE.uniqueItemCount, 140);
  assert.ok(
    [
      ...PILOT_REVIEW_QUEUE.aspA1Suggestions,
      ...PILOT_REVIEW_QUEUE.highSimilarityCspMockItems,
      ...PILOT_REVIEW_QUEUE.calculationItems,
    ].every((entry) => entry.mappingStatus !== "reviewed"),
  );
});

test("review reports expose operational coverage and pending-review risks", () => {
  assert.equal(REVIEWER_PROGRESS_DASHBOARD.totalItems, 2400);
  assert.equal(REVIEWER_PROGRESS_DASHBOARD.operationalItems, 0);
  assert.equal(REVIEWER_PROGRESS_DASHBOARD.awaitingSourceReview, 2400);
  assert.equal(REVIEWER_PROGRESS_DASHBOARD.awaitingTechnicalReview, 2400);
  assert.equal(REVIEWER_PROGRESS_DASHBOARD.objectivesWithZeroOperationalItems, 162);
  assert.equal(
    EXTENDED_BLUEPRINT_COVERAGE_REPORT.reviewCoverage.objectivesWithZeroReviewedOperationalItems.length,
    162,
  );
  assert.equal(ITEM_REVIEW_REPORT.reviewRecords.length, 2400);
  assert.equal(ITEM_REVIEW_REPORT.prioritizedQueue.length, 2400);
});

test("checked-in item-review report matches the generated records and queues", async () => {
  const report = JSON.parse(await readFile("reports/item-review-report.json", "utf8"));
  assert.deepEqual(report, ITEM_REVIEW_REPORT);
});

test("development review route is unavailable in production", async () => {
  const route = await readFile("app/internal/item-review/page.tsx", "utf8");
  assert.match(route, /process\.env\.NODE_ENV === "production"/);
  assert.match(route, /disabled in production/);
  const workbench = await readFile("app/ItemReviewWorkbench.tsx", "utf8");
  assert.match(workbench, /Approve proposed mapping/);
  assert.match(workbench, /Create new version with controlled edits/);
  assert.match(workbench, /Mark operational/);
});
