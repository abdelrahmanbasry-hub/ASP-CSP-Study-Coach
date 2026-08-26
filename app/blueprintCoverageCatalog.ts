import type { CoachQuestion } from "./adaptiveEngine.ts";
import { ASP_DOMAINS, ASP_QUESTION_BANK_A } from "./aspQuestionBankA.ts";
import { ASP_QUESTION_BANK_B } from "./aspQuestionBankB.ts";
import { ASP_QUESTION_BANK_EXTRA_A2 } from "./aspQuestionBankExtraA2.ts";
import { ASP_QUESTION_BANK_EXTRA_SET1 } from "./aspQuestionBankExtraSet1.ts";
import { ASP_QUESTION_BANK_EXTRA_SET2 } from "./aspQuestionBankExtraSet2.ts";
import { ASP_MOCK_A, ASP_MOCK_B, ASP_PRACTICE_EXTRA } from "./aspExpandedQuestionBank.ts";
import { CSP_DOMAINS, QUESTION_BANK as CSP_QUESTION_BANK } from "./questionBank.ts";
import { CSP_QUESTION_BANK_EXTRA } from "./cspQuestionBankExtra.ts";
import { CSP_MOCK_A, CSP_MOCK_B, CSP_PRACTICE_EXTRA } from "./cspExpandedQuestionBank.ts";
import { BLUEPRINT_REGISTRIES } from "./blueprintRegistry.ts";
import {
  createInitialItemMapping,
  validateItemMapping,
  type ItemBlueprintMapping,
  type MappingStatus,
} from "./blueprintMapping.ts";

export const ASP_COVERAGE_QUESTIONS = [
  ...ASP_QUESTION_BANK_A,
  ...ASP_QUESTION_BANK_B,
  ...ASP_QUESTION_BANK_EXTRA_A2,
  ...ASP_QUESTION_BANK_EXTRA_SET1,
  ...ASP_QUESTION_BANK_EXTRA_SET2,
  ...ASP_PRACTICE_EXTRA,
  ...ASP_MOCK_A,
  ...ASP_MOCK_B,
] as readonly CoachQuestion[];

export const CSP_COVERAGE_QUESTIONS = [
  ...CSP_QUESTION_BANK,
  ...CSP_QUESTION_BANK_EXTRA,
  ...CSP_PRACTICE_EXTRA,
  ...CSP_MOCK_A,
  ...CSP_MOCK_B,
] as readonly CoachQuestion[];

export const ITEM_BLUEPRINT_MAPPINGS: readonly ItemBlueprintMapping[] = [
  ...ASP_COVERAGE_QUESTIONS.map((question) => createInitialItemMapping(question, "ASP")),
  ...CSP_COVERAGE_QUESTIONS.map((question) => createInitialItemMapping(question, "CSP")),
];

export interface ObjectiveCoverage {
  objectiveId: string;
  domainId: string;
  statement: string;
  totalItems: number;
  reviewedItems: number;
  suggestedItems: number;
}

export interface RepeatedItemFamily {
  credential: "ASP" | "CSP";
  itemFamilyId: string;
  itemIds: readonly string[];
  count: number;
}

export interface BlueprintCoverageReport {
  schemaVersion: 1;
  registryVersions: readonly {
    blueprintVersion: "ASP11" | "CSP11";
    sourceVersion: "V.2024.04.24";
  }[];
  inventory: {
    totalItems: number;
    aspItems: number;
    cspItems: number;
    reviewedItems: number;
    suggestedItems: number;
    rejectedItems: number;
    unmappedItems: number;
  };
  itemMappings: readonly ItemBlueprintMapping[];
  objectives: readonly ObjectiveCoverage[];
  unmapped: readonly { credential: "ASP" | "CSP"; itemId: string }[];
  objectivesWithNoReviewedItems: readonly string[];
  repeatedItemFamilies: readonly RepeatedItemFamily[];
  invalidMappings: readonly { itemId: string; errors: readonly string[] }[];
}

export function buildBlueprintCoverageReport(
  mappings: readonly ItemBlueprintMapping[] = ITEM_BLUEPRINT_MAPPINGS,
): BlueprintCoverageReport {
  const statusCount = (status: MappingStatus) =>
    mappings.filter((mapping) => mapping.mappingStatus === status).length;
  const objectiveCounts = new Map<
    string,
    { totalItems: Set<string>; reviewedItems: Set<string>; suggestedItems: Set<string> }
  >();
  for (const registry of BLUEPRINT_REGISTRIES) {
    for (const objective of registry.objectives) {
      objectiveCounts.set(objective.id, {
        totalItems: new Set(),
        reviewedItems: new Set(),
        suggestedItems: new Set(),
      });
    }
  }

  for (const mapping of mappings) {
    if (mapping.mappingStatus !== "reviewed" && mapping.mappingStatus !== "suggested") continue;
    const itemKey = `${mapping.credential}:${mapping.questionId}`;
    for (const objectiveId of [mapping.primaryObjectiveId, ...mapping.secondaryObjectiveIds]) {
      if (!objectiveId) continue;
      const counts = objectiveCounts.get(objectiveId);
      if (!counts) continue;
      counts.totalItems.add(itemKey);
      counts[`${mapping.mappingStatus}Items`].add(itemKey);
    }
  }

  const objectives = BLUEPRINT_REGISTRIES.flatMap((registry) =>
    registry.objectives.map((objective) => {
      const counts = objectiveCounts.get(objective.id);
      return {
        objectiveId: objective.id,
        domainId: objective.domainId,
        statement: objective.statement,
        totalItems: counts?.totalItems.size ?? 0,
        reviewedItems: counts?.reviewedItems.size ?? 0,
        suggestedItems: counts?.suggestedItems.size ?? 0,
      };
    }),
  );

  const familyItems = new Map<string, ItemBlueprintMapping[]>();
  for (const mapping of mappings) {
    if (!mapping.itemFamilyId) continue;
    const key = `${mapping.credential}:${mapping.itemFamilyId}`;
    familyItems.set(key, [...(familyItems.get(key) ?? []), mapping]);
  }
  const repeatedItemFamilies = [...familyItems.values()]
    .filter((family) => family.length > 1)
    .map((family) => ({
      credential: family[0].credential,
      itemFamilyId: family[0].itemFamilyId ?? "",
      itemIds: family.map((mapping) => mapping.questionId).sort(),
      count: family.length,
    }))
    .sort(
      (a, b) =>
        a.credential.localeCompare(b.credential) || a.itemFamilyId.localeCompare(b.itemFamilyId),
    );

  const unmapped = mappings
    .filter((mapping) => mapping.mappingStatus === "unmapped")
    .map((mapping) => ({ credential: mapping.credential, itemId: mapping.questionId }));
  return {
    schemaVersion: 1,
    registryVersions: BLUEPRINT_REGISTRIES.map((registry) => ({
      blueprintVersion: registry.blueprintVersion,
      sourceVersion: registry.sourceVersion,
    })),
    inventory: {
      totalItems: mappings.length,
      aspItems: mappings.filter((mapping) => mapping.credential === "ASP").length,
      cspItems: mappings.filter((mapping) => mapping.credential === "CSP").length,
      reviewedItems: statusCount("reviewed"),
      suggestedItems: statusCount("suggested"),
      rejectedItems: statusCount("rejected"),
      unmappedItems: statusCount("unmapped"),
    },
    itemMappings: mappings,
    objectives,
    unmapped,
    objectivesWithNoReviewedItems: objectives
      .filter((objective) => objective.reviewedItems === 0)
      .map((objective) => objective.objectiveId),
    repeatedItemFamilies,
    invalidMappings: mappings
      .map((mapping) => ({ itemId: mapping.questionId, errors: validateItemMapping(mapping) }))
      .filter((result) => result.errors.length > 0),
  };
}

export const BLUEPRINT_COVERAGE_REPORT = buildBlueprintCoverageReport();

export const COVERAGE_DOMAIN_COUNTS = {
  ASP: ASP_DOMAINS.length,
  CSP: CSP_DOMAINS.length,
} as const;
