import type { CoachQuestion } from "./adaptiveEngine.ts";
import {
  BLUEPRINT_OBJECTIVE_BY_ID,
  BLUEPRINT_REGISTRY_BY_VERSION,
  aspA1ObjectiveId,
  type BlueprintVersion,
  type Credential,
} from "./blueprintRegistry.ts";

export type MappingStatus = "unmapped" | "suggested" | "reviewed" | "rejected";
export type ReviewStatus = "unreviewed" | "reviewed" | "rejected";
export type MappingOrigin = "none" | "automated" | "human";

export interface ItemBlueprintMapping {
  questionId: string;
  domainId: string;
  credential: Credential;
  blueprintVersion: BlueprintVersion;
  primaryObjectiveId: string | null;
  secondaryObjectiveIds: readonly string[];
  mappingStatus: MappingStatus;
  itemFamilyId: string | null;
  sourceReviewStatus: ReviewStatus;
  technicalReviewStatus: ReviewStatus;
  mappingOrigin: MappingOrigin;
}

type QuestionWithMappingHint = CoachQuestion & { blueprintObjective?: unknown };

export function createInitialItemMapping(
  question: QuestionWithMappingHint,
  credential: Credential,
): ItemBlueprintMapping {
  const blueprintVersion: BlueprintVersion = credential === "ASP" ? "ASP11" : "CSP11";
  const legacyHint =
    credential === "ASP" && typeof question.blueprintObjective === "string"
      ? aspA1ObjectiveId(question.blueprintObjective)
      : null;
  const suggestedObjective =
    legacyHint && BLUEPRINT_OBJECTIVE_BY_ID.has(legacyHint) ? legacyHint : null;
  return {
    questionId: question.id,
    domainId: question.domainId,
    credential,
    blueprintVersion,
    primaryObjectiveId: suggestedObjective,
    secondaryObjectiveIds: [],
    mappingStatus: suggestedObjective ? "suggested" : "unmapped",
    itemFamilyId: question.scenarioFamily?.trim() || null,
    sourceReviewStatus: "unreviewed",
    technicalReviewStatus: "unreviewed",
    mappingOrigin: suggestedObjective ? "automated" : "none",
  };
}

export function validateItemMapping(mapping: ItemBlueprintMapping): string[] {
  const errors: string[] = [];
  const registry = BLUEPRINT_REGISTRY_BY_VERSION.get(mapping.blueprintVersion);
  if (!registry || registry.credential !== mapping.credential) {
    errors.push("credential does not own blueprint version");
  }

  const objectiveIds = [mapping.primaryObjectiveId, ...mapping.secondaryObjectiveIds].filter(
    (id): id is string => Boolean(id),
  );
  if (new Set(objectiveIds).size !== objectiveIds.length) {
    errors.push("objective IDs must be unique within an item mapping");
  }
  for (const id of objectiveIds) {
    const objective = BLUEPRINT_OBJECTIVE_BY_ID.get(id);
    if (!objective) {
      errors.push(`unknown objective ID: ${id}`);
      continue;
    }
    if (
      objective.credential !== mapping.credential ||
      objective.blueprintVersion !== mapping.blueprintVersion
    ) {
      errors.push(`objective does not belong to ${mapping.blueprintVersion}: ${id}`);
    }
  }

  if (mapping.primaryObjectiveId) {
    const primary = BLUEPRINT_OBJECTIVE_BY_ID.get(mapping.primaryObjectiveId);
    const domain = registry?.domains.find((candidate) => candidate.id === primary?.domainId);
    if (domain && domain.appDomainId !== mapping.domainId) {
      errors.push("primary objective does not belong to the question domain");
    }
  }

  if (mapping.mappingStatus === "unmapped" && objectiveIds.length) {
    errors.push("unmapped items cannot claim objectives");
  }
  if (
    (mapping.mappingStatus === "suggested" || mapping.mappingStatus === "reviewed") &&
    !mapping.primaryObjectiveId
  ) {
    errors.push(`${mapping.mappingStatus} items require a primary objective`);
  }
  if (mapping.mappingOrigin === "automated" && mapping.mappingStatus !== "suggested") {
    errors.push("automated mappings must remain suggested");
  }
  if (mapping.mappingStatus === "reviewed") {
    if (mapping.mappingOrigin !== "human") {
      errors.push("reviewed mappings require human provenance");
    }
    if (
      mapping.sourceReviewStatus !== "reviewed" ||
      mapping.technicalReviewStatus !== "reviewed"
    ) {
      errors.push("reviewed mappings require completed source and technical reviews");
    }
  }
  if (mapping.mappingStatus === "unmapped" && mapping.mappingOrigin !== "none") {
    errors.push("unmapped items must use none mapping provenance");
  }
  return errors;
}

/** Only human-reviewed mappings may contribute to proven objective coverage. */
export function reviewedObjectiveIds(mapping: ItemBlueprintMapping): readonly string[] {
  if (mapping.mappingStatus !== "reviewed" || validateItemMapping(mapping).length) return [];
  return [mapping.primaryObjectiveId, ...mapping.secondaryObjectiveIds].filter(
    (id): id is string => Boolean(id),
  );
}
