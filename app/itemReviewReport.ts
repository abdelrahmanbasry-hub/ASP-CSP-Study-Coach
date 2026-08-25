import { BLUEPRINT_COVERAGE_REPORT } from "./blueprintCoverageCatalog.ts";
import { BLUEPRINT_REGISTRIES } from "./blueprintRegistry.ts";
import {
  ITEM_REVIEW_CATALOG,
  ITEM_REVIEW_QUEUE,
  PILOT_REVIEW_QUEUE,
} from "./itemReviewCatalog.ts";
import { operationalEligibilityErrors } from "./itemReview.ts";

const operationalItems = ITEM_REVIEW_CATALOG.filter(
  (item) =>
    item.review.operationalStatus === "operational" &&
    operationalEligibilityErrors(item.review, item.history.versions.at(-1)!).length === 0,
);

const reviewedOperationalByObjective = new Map<string, string[]>();
for (const item of operationalItems) {
  for (const objectiveId of [
    item.review.primaryObjectiveId,
    ...item.review.secondaryObjectiveIds,
  ]) {
    if (!objectiveId) continue;
    reviewedOperationalByObjective.set(objectiveId, [
      ...(reviewedOperationalByObjective.get(objectiveId) ?? []),
      item.question.id,
    ]);
  }
}

export const REVIEW_COVERAGE = {
  reviewedOperationalItemsByObjective: BLUEPRINT_REGISTRIES.flatMap((registry) =>
    registry.objectives.map((objective) => ({
      objectiveId: objective.id,
      itemIds: reviewedOperationalByObjective.get(objective.id) ?? [],
      count: reviewedOperationalByObjective.get(objective.id)?.length ?? 0,
    })),
  ),
  suggestedItemsByObjective: BLUEPRINT_COVERAGE_REPORT.objectives.map((objective) => ({
    objectiveId: objective.objectiveId,
    count: objective.suggestedItems,
  })),
  itemsAwaitingSourceReview: ITEM_REVIEW_CATALOG.filter(
    (item) => item.review.sourceVerificationStatus !== "reviewed",
  ).map((item) => ({ credential: item.credential, itemId: item.question.id })),
  itemsAwaitingTechnicalReview: ITEM_REVIEW_CATALOG.filter(
    (item) => item.review.technicalReviewStatus !== "reviewed",
  ).map((item) => ({ credential: item.credential, itemId: item.question.id })),
  itemsRequiringChanges: ITEM_REVIEW_CATALOG.filter(
    (item) =>
      item.review.issueStatus === "changes-required" ||
      item.review.operationalStatus === "changes-required",
  ).map((item) => ({ credential: item.credential, itemId: item.question.id })),
  duplicateFamilyRisks: ITEM_REVIEW_CATALOG.filter((item) => item.repeatedFamilyRisk).map(
    (item) => ({
      credential: item.credential,
      itemId: item.question.id,
      itemFamilyId: item.review.itemFamilyId,
      relatedItemIds: item.relatedItemIds,
    }),
  ),
  mockFormIndependenceRisks: ITEM_REVIEW_CATALOG.filter((item) => item.mockIndependenceRisk).map(
    (item) => ({
      credential: item.credential,
      itemId: item.question.id,
      bankPool: item.review.bankPool,
      itemFamilyId: item.review.itemFamilyId,
      relatedItemIds: item.relatedItemIds,
    }),
  ),
  objectivesWithZeroReviewedOperationalItems: BLUEPRINT_REGISTRIES.flatMap((registry) =>
    registry.objectives.map((objective) => objective.id),
  ).filter((objectiveId) => !reviewedOperationalByObjective.get(objectiveId)?.length),
} as const;

export const REVIEWER_PROGRESS_DASHBOARD = {
  totalItems: ITEM_REVIEW_CATALOG.length,
  operationalItems: operationalItems.length,
  reviewedMappings: ITEM_REVIEW_CATALOG.filter(
    (item) => item.review.mappingStatus === "reviewed",
  ).length,
  suggestedMappings: ITEM_REVIEW_CATALOG.filter(
    (item) => item.review.mappingStatus === "suggested",
  ).length,
  unmappedItems: ITEM_REVIEW_CATALOG.filter(
    (item) => item.review.mappingStatus === "unmapped",
  ).length,
  awaitingSourceReview: REVIEW_COVERAGE.itemsAwaitingSourceReview.length,
  awaitingTechnicalReview: REVIEW_COVERAGE.itemsAwaitingTechnicalReview.length,
  requiringChanges: REVIEW_COVERAGE.itemsRequiringChanges.length,
  duplicateFamilyRiskItems: REVIEW_COVERAGE.duplicateFamilyRisks.length,
  duplicateFamilyRiskFamilies: new Set(
    REVIEW_COVERAGE.duplicateFamilyRisks.map(
      (risk) => `${risk.credential}:${risk.itemFamilyId}`,
    ),
  ).size,
  mockFormIndependenceRiskItems: REVIEW_COVERAGE.mockFormIndependenceRisks.length,
  mockFormIndependenceRiskFamilies: new Set(
    REVIEW_COVERAGE.mockFormIndependenceRisks.map(
      (risk) => `${risk.credential}:${risk.bankPool}:${risk.itemFamilyId}`,
    ),
  ).size,
  objectivesWithZeroOperationalItems:
    REVIEW_COVERAGE.objectivesWithZeroReviewedOperationalItems.length,
} as const;

export const EXTENDED_BLUEPRINT_COVERAGE_REPORT = {
  ...BLUEPRINT_COVERAGE_REPORT,
  reviewCoverage: REVIEW_COVERAGE,
  reviewerProgress: REVIEWER_PROGRESS_DASHBOARD,
} as const;

export const ITEM_REVIEW_REPORT = {
  schemaVersion: 1,
  generatedFromBlueprintCoverageSchemaVersion: BLUEPRINT_COVERAGE_REPORT.schemaVersion,
  reviewerProgress: REVIEWER_PROGRESS_DASHBOARD,
  pilotQueue: PILOT_REVIEW_QUEUE,
  prioritizedQueue: ITEM_REVIEW_QUEUE,
  reviewRecords: ITEM_REVIEW_CATALOG.map((item) => item.review),
} as const;
