import type { CoachQuestion, QuestionPool } from "./adaptiveEngine.ts";
import {
  ASP_COVERAGE_QUESTIONS,
  CSP_COVERAGE_QUESTIONS,
  ITEM_BLUEPRINT_MAPPINGS,
} from "./blueprintCoverageCatalog.ts";
import type { Credential } from "./blueprintRegistry.ts";
import type { ItemBlueprintMapping } from "./blueprintMapping.ts";
import {
  createInitialVersionHistory,
  isCalculationQuestion,
  type ItemReviewRecord,
  type ItemVersionHistory,
} from "./itemReview.ts";

export interface ReviewCatalogItem {
  key: string;
  credential: Credential;
  question: CoachQuestion;
  mapping: ItemBlueprintMapping;
  review: ItemReviewRecord;
  history: ItemVersionHistory;
  relatedItemIds: readonly string[];
  repeatedFamilyRisk: boolean;
  mockIndependenceRisk: boolean;
}

export interface ReviewQueueEntry {
  queuePosition: number;
  priority: number;
  priorityReason: string;
  questionId: string;
  credential: Credential;
  domainId: string;
  objectiveId: string | null;
  bankPool: QuestionPool;
  mappingStatus: ItemReviewRecord["mappingStatus"];
  sourceVerificationStatus: ItemReviewRecord["sourceVerificationStatus"];
  technicalReviewStatus: ItemReviewRecord["technicalReviewStatus"];
  calculationItem: boolean;
  repeatedFamilyRisk: boolean;
  mockIndependenceRisk: boolean;
  itemFamilyId: string | null;
}

export interface PilotReviewQueue {
  aspA1Suggestions: readonly ReviewQueueEntry[];
  highSimilarityCspMockItems: readonly ReviewQueueEntry[];
  calculationItems: readonly ReviewQueueEntry[];
  uniqueItemCount: number;
}

function itemKey(credential: Credential, questionId: string) {
  return `${credential}:${questionId}`;
}

const questionEntries = [
  ...ASP_COVERAGE_QUESTIONS.map((question) => ({ credential: "ASP" as const, question })),
  ...CSP_COVERAGE_QUESTIONS.map((question) => ({ credential: "CSP" as const, question })),
];

const mappingByKey = new Map(
  ITEM_BLUEPRINT_MAPPINGS.map((mapping) => [itemKey(mapping.credential, mapping.questionId), mapping]),
);
const familyMembers = new Map<string, string[]>();
for (const mapping of ITEM_BLUEPRINT_MAPPINGS) {
  if (!mapping.itemFamilyId) continue;
  const key = `${mapping.credential}:${mapping.itemFamilyId}`;
  familyMembers.set(key, [...(familyMembers.get(key) ?? []), mapping.questionId]);
}

export const ITEM_REVIEW_CATALOG: readonly ReviewCatalogItem[] = questionEntries.map(
  ({ credential, question }) => {
    const mapping = mappingByKey.get(itemKey(credential, question.id));
    if (!mapping) throw new Error(`Missing blueprint mapping overlay for ${credential}:${question.id}`);
    const history = createInitialVersionHistory(question, mapping);
    const familyKey = mapping.itemFamilyId ? `${credential}:${mapping.itemFamilyId}` : null;
    const members = familyKey ? familyMembers.get(familyKey) ?? [] : [];
    const relatedItemIds = members.filter((questionId) => questionId !== question.id).sort();
    const bankPool = question.pool ?? "practice";
    return {
      key: itemKey(credential, question.id),
      credential,
      question,
      mapping,
      review: history.currentReview,
      history,
      relatedItemIds,
      repeatedFamilyRisk: relatedItemIds.length > 0,
      mockIndependenceRisk: bankPool !== "practice" && relatedItemIds.length > 0,
    };
  },
);

function queuePriority(item: ReviewCatalogItem): [number, string] {
  const pool = item.review.bankPool;
  if (item.credential === "CSP" && pool === "mock-a") return [1, "CSP Mock A"];
  if (item.credential === "CSP" && pool === "mock-b") return [2, "CSP Mock B"];
  if (item.credential === "ASP" && pool === "mock-a") return [3, "ASP Mock A"];
  if (item.credential === "ASP" && pool === "mock-b") return [4, "ASP Mock B"];
  if (isCalculationQuestion(item.question)) return [5, "Calculation item"];
  if (item.credential === "ASP" && item.question.domainId === "A2") return [6, "ASP A2"];
  if (item.credential === "CSP" && item.question.domainId === "D1") return [7, "CSP D1"];
  if (item.credential === "CSP" && item.question.domainId === "D2") return [8, "CSP D2"];
  return [9, "Remaining objectives"];
}

export const ITEM_REVIEW_QUEUE: readonly ReviewQueueEntry[] = ITEM_REVIEW_CATALOG
  .map((item) => {
    const [priority, priorityReason] = queuePriority(item);
    return {
      queuePosition: 0,
      priority,
      priorityReason,
      questionId: item.question.id,
      credential: item.credential,
      domainId: item.question.domainId,
      objectiveId: item.review.primaryObjectiveId,
      bankPool: item.review.bankPool,
      mappingStatus: item.review.mappingStatus,
      sourceVerificationStatus: item.review.sourceVerificationStatus,
      technicalReviewStatus: item.review.technicalReviewStatus,
      calculationItem: item.review.calculationItem,
      repeatedFamilyRisk: item.repeatedFamilyRisk,
      mockIndependenceRisk: item.mockIndependenceRisk,
      itemFamilyId: item.review.itemFamilyId,
    };
  })
  .sort(
    (a, b) =>
      a.priority - b.priority ||
      Number(b.repeatedFamilyRisk) - Number(a.repeatedFamilyRisk) ||
      Number(b.mappingStatus === "suggested") - Number(a.mappingStatus === "suggested") ||
      a.credential.localeCompare(b.credential) ||
      a.questionId.localeCompare(b.questionId),
  )
  .map((entry, index) => ({ ...entry, queuePosition: index + 1 }));

const aspA1Suggestions = ITEM_REVIEW_QUEUE.filter(
  (entry) =>
    entry.credential === "ASP" &&
    entry.domainId === "A1" &&
    entry.mappingStatus === "suggested",
);
const highSimilarityCspMockItems = ITEM_REVIEW_QUEUE.filter(
  (entry) =>
    entry.credential === "CSP" &&
    entry.bankPool !== "practice" &&
    entry.repeatedFamilyRisk,
).slice(0, 20);
const reservedKeys = new Set(
  [...aspA1Suggestions, ...highSimilarityCspMockItems].map((entry) =>
    itemKey(entry.credential, entry.questionId),
  ),
);
const calculationItems = ITEM_REVIEW_QUEUE.filter(
  (entry) =>
    entry.calculationItem && !reservedKeys.has(itemKey(entry.credential, entry.questionId)),
).slice(0, 20);

export const PILOT_REVIEW_QUEUE: PilotReviewQueue = {
  aspA1Suggestions,
  highSimilarityCspMockItems,
  calculationItems,
  uniqueItemCount: new Set(
    [...aspA1Suggestions, ...highSimilarityCspMockItems, ...calculationItems].map((entry) =>
      itemKey(entry.credential, entry.questionId),
    ),
  ).size,
};

export const REVIEW_CATALOG_BY_KEY = new Map(
  ITEM_REVIEW_CATALOG.map((item) => [item.key, item]),
);
