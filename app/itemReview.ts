import type { Attempt, CoachQuestion, QuestionPool } from "./adaptiveEngine.ts";
import {
  BLUEPRINT_OBJECTIVE_BY_ID,
  type BlueprintVersion,
  type Credential,
} from "./blueprintRegistry.ts";
import {
  validateItemMapping,
  type ItemBlueprintMapping,
  type MappingOrigin,
  type MappingStatus,
} from "./blueprintMapping.ts";

export type ReviewWorkflowStatus =
  | "unreviewed"
  | "suggested"
  | "changes-required"
  | "reviewed"
  | "rejected"
  | "retired";
export type CognitiveLevel =
  | "unclassified"
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";
export type IssueFlag =
  | "incorrect-answer"
  | "weak-rationale"
  | "implausible-distractor"
  | "duplicate-family"
  | "dependent-family"
  | "source-gap"
  | "technical-gap";
export type OperationalStatus = "unreviewed" | "changes-required" | "operational" | "retired";

export interface ItemReviewRecord {
  questionId: string;
  itemVersion: number;
  credential: Credential;
  blueprintVersion: BlueprintVersion;
  domainId: string;
  bankPool: QuestionPool;
  primaryObjectiveId: string | null;
  secondaryObjectiveIds: readonly string[];
  mappingStatus: MappingStatus;
  mappingOrigin: MappingOrigin;
  itemFamilyId: string | null;
  itemFamilyReviewStatus: ReviewWorkflowStatus;
  cognitiveLevel: CognitiveLevel;
  sourceTitle: string | null;
  sourceOrganizationOrAuthor: string | null;
  sourceEditionOrVersion: string | null;
  sourceLocator: string | null;
  sourceEffectiveDate: string | null;
  sourceVerificationStatus: ReviewWorkflowStatus;
  keyedAnswerReviewStatus: ReviewWorkflowStatus;
  distractorReviewStatus: ReviewWorkflowStatus;
  calculationAndUnitsReviewStatus: ReviewWorkflowStatus;
  formulaReviewStatus: ReviewWorkflowStatus;
  unitReviewStatus: ReviewWorkflowStatus;
  roundingAssumptionReviewStatus: ReviewWorkflowStatus;
  technicalReviewStatus: ReviewWorkflowStatus;
  assessmentWritingReviewStatus: ReviewWorkflowStatus;
  familyIndependenceReviewStatus: ReviewWorkflowStatus;
  reviewerId: string | null;
  reviewDate: string | null;
  reviewNotes: string;
  issueStatus: ReviewWorkflowStatus;
  issueFlags: readonly IssueFlag[];
  operationalStatus: OperationalStatus;
  calculationItem: boolean;
  reviewedItemVersion: number | null;
  reviewedContentFingerprint: string | null;
}

export interface ItemContentSnapshot {
  stem: string;
  options: readonly string[];
  correctIndex: number;
  rationale: string;
  wrongRationales: readonly string[];
  objective: string | null;
  referenceFramework: string;
  referenceTopic: string;
  challengePrompt: string;
  formulaId: string | null;
  formulaCategory: string | null;
  formulaFamily: string | null;
  blueprintObjective: string | null;
}

export interface ItemVersionSnapshot {
  questionId: string;
  itemVersion: number;
  contentFingerprint: string;
  content: ItemContentSnapshot;
  reviewRecord: ItemReviewRecord;
}

export interface ItemVersionHistory {
  questionId: string;
  currentVersion: number;
  currentReview: ItemReviewRecord;
  versions: readonly ItemVersionSnapshot[];
}

export interface HumanReviewAction {
  reviewerId: string;
  reviewDate: string;
  confirmedHuman: true;
}

type ReviewQuestion = CoachQuestion & {
  formulaId?: unknown;
  formulaCategory?: unknown;
  formulaFamily?: unknown;
  blueprintObjective?: unknown;
};

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stableHash(value: unknown) {
  const text = JSON.stringify(value);
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193) >>> 0;
    second = Math.imul(second ^ code, 0x85ebca6b) >>> 0;
  }
  return `${first.toString(16).padStart(8, "0")}${second.toString(16).padStart(8, "0")}`;
}

export function isCalculationQuestion(question: ReviewQuestion) {
  if (question.domainId === "A1" || optionalText(question.formulaId)) return true;
  return /\b(calculate|computed?|determine the (?:rate|value|volume|dose|exposure|load|force|pressure|flow|capacity)|\d+(?:\.\d+)?\s*(?:%|dB|ppm|mg\/m3|cfm|ft|lb|kg|hours?|minutes?))\b/i.test(
    question.stem,
  );
}

export function snapshotItemContent(question: ReviewQuestion): ItemContentSnapshot {
  return {
    stem: question.stem,
    options: [...question.options],
    correctIndex: question.correctIndex,
    rationale: question.rationale,
    wrongRationales: [...question.wrongRationales],
    objective: question.objective ?? null,
    referenceFramework: question.referenceFramework,
    referenceTopic: question.referenceTopic,
    challengePrompt: question.challengePrompt,
    formulaId: optionalText(question.formulaId),
    formulaCategory: optionalText(question.formulaCategory),
    formulaFamily: optionalText(question.formulaFamily),
    blueprintObjective: optionalText(question.blueprintObjective),
  };
}

export function reviewContentFingerprint(
  question: ReviewQuestion,
  record: Pick<
    ItemReviewRecord,
    | "primaryObjectiveId"
    | "secondaryObjectiveIds"
    | "sourceTitle"
    | "sourceOrganizationOrAuthor"
    | "sourceEditionOrVersion"
    | "sourceLocator"
    | "sourceEffectiveDate"
  >,
) {
  return stableHash({
    content: snapshotItemContent(question),
    traceability: {
      primaryObjectiveId: record.primaryObjectiveId,
      secondaryObjectiveIds: record.secondaryObjectiveIds,
      sourceTitle: record.sourceTitle,
      sourceOrganizationOrAuthor: record.sourceOrganizationOrAuthor,
      sourceEditionOrVersion: record.sourceEditionOrVersion,
      sourceLocator: record.sourceLocator,
      sourceEffectiveDate: record.sourceEffectiveDate,
    },
  });
}

function snapshotReviewFingerprint(content: ItemContentSnapshot, record: ItemReviewRecord) {
  return stableHash({
    content,
    traceability: {
      primaryObjectiveId: record.primaryObjectiveId,
      secondaryObjectiveIds: record.secondaryObjectiveIds,
      sourceTitle: record.sourceTitle,
      sourceOrganizationOrAuthor: record.sourceOrganizationOrAuthor,
      sourceEditionOrVersion: record.sourceEditionOrVersion,
      sourceLocator: record.sourceLocator,
      sourceEffectiveDate: record.sourceEffectiveDate,
    },
  });
}

export function createInitialReviewRecord(
  question: ReviewQuestion,
  mapping: ItemBlueprintMapping,
  itemVersion = 1,
): ItemReviewRecord {
  const sourceTitle = optionalText(question.referenceFramework);
  const sourceLocator = optionalText(question.referenceTopic);
  const calculationItem = isCalculationQuestion(question);
  return {
    questionId: question.id,
    itemVersion,
    credential: mapping.credential,
    blueprintVersion: mapping.blueprintVersion,
    domainId: question.domainId,
    bankPool: question.pool ?? "practice",
    primaryObjectiveId: mapping.primaryObjectiveId,
    secondaryObjectiveIds: [...mapping.secondaryObjectiveIds],
    mappingStatus: mapping.mappingStatus,
    mappingOrigin: mapping.mappingOrigin,
    itemFamilyId: mapping.itemFamilyId,
    itemFamilyReviewStatus: mapping.itemFamilyId ? "suggested" : "unreviewed",
    cognitiveLevel: "unclassified",
    sourceTitle,
    sourceOrganizationOrAuthor: null,
    sourceEditionOrVersion: null,
    sourceLocator,
    sourceEffectiveDate: null,
    sourceVerificationStatus: sourceTitle || sourceLocator ? "suggested" : "unreviewed",
    keyedAnswerReviewStatus: "unreviewed",
    distractorReviewStatus: "unreviewed",
    calculationAndUnitsReviewStatus: "unreviewed",
    formulaReviewStatus: "unreviewed",
    unitReviewStatus: "unreviewed",
    roundingAssumptionReviewStatus: "unreviewed",
    technicalReviewStatus: "unreviewed",
    assessmentWritingReviewStatus: "unreviewed",
    familyIndependenceReviewStatus: "unreviewed",
    reviewerId: null,
    reviewDate: null,
    reviewNotes: "",
    issueStatus: "unreviewed",
    issueFlags: [],
    operationalStatus: "unreviewed",
    calculationItem,
    reviewedItemVersion: null,
    reviewedContentFingerprint: null,
  };
}

function requireHuman(action: HumanReviewAction) {
  if (
    action.confirmedHuman !== true ||
    !action.reviewerId.trim() ||
    !/^\d{4}-\d{2}-\d{2}/.test(action.reviewDate)
  ) {
    throw new Error("A confirmed human reviewer ID and ISO review date are required");
  }
}

export function approveObjectiveMapping(
  record: ItemReviewRecord,
  primaryObjectiveId: string,
  secondaryObjectiveIds: readonly string[],
  action: HumanReviewAction,
): ItemReviewRecord {
  requireHuman(action);
  const ids = [primaryObjectiveId, ...secondaryObjectiveIds];
  if (
    primaryObjectiveId !== record.primaryObjectiveId ||
    JSON.stringify(secondaryObjectiveIds) !== JSON.stringify(record.secondaryObjectiveIds)
  ) {
    throw new Error("Changing objective IDs requires a new item version");
  }
  if (new Set(ids).size !== ids.length) throw new Error("Objective IDs must be unique");
  for (const id of ids) {
    const objective = BLUEPRINT_OBJECTIVE_BY_ID.get(id);
    if (
      !objective ||
      objective.credential !== record.credential ||
      objective.blueprintVersion !== record.blueprintVersion
    ) {
      throw new Error(`Objective ${id} does not belong to ${record.blueprintVersion}`);
    }
  }
  return {
    ...record,
    primaryObjectiveId,
    secondaryObjectiveIds: [...secondaryObjectiveIds],
    mappingStatus: "reviewed",
    mappingOrigin: "human",
    reviewerId: action.reviewerId.trim(),
    reviewDate: action.reviewDate,
  };
}

export function rejectObjectiveMapping(
  record: ItemReviewRecord,
  action: HumanReviewAction,
): ItemReviewRecord {
  requireHuman(action);
  return {
    ...record,
    mappingStatus: "rejected",
    mappingOrigin: "human",
    reviewerId: action.reviewerId.trim(),
    reviewDate: action.reviewDate,
    operationalStatus: "changes-required",
  };
}

export function applyHumanReviewPatch(
  record: ItemReviewRecord,
  patch: Partial<ItemReviewRecord>,
  action: HumanReviewAction,
): ItemReviewRecord {
  requireHuman(action);
  if (patch.operationalStatus === "operational") {
    throw new Error("Operational status must be assigned through the validated operational gate");
  }
  if (
    "mappingStatus" in patch ||
    "mappingOrigin" in patch ||
    "reviewedItemVersion" in patch ||
    "reviewedContentFingerprint" in patch
  ) {
    throw new Error("Mapping and item-version approvals require their dedicated human-review actions");
  }
  const controlledKeys = [
    "primaryObjectiveId",
    "secondaryObjectiveIds",
    "itemFamilyId",
    "sourceTitle",
    "sourceOrganizationOrAuthor",
    "sourceEditionOrVersion",
    "sourceLocator",
    "sourceEffectiveDate",
  ] as const;
  for (const key of controlledKeys) {
    if (key in patch && JSON.stringify(patch[key]) !== JSON.stringify(record[key])) {
      throw new Error(`Changing ${key} requires a new item version`);
    }
  }
  return {
    ...record,
    ...patch,
    questionId: record.questionId,
    itemVersion: record.itemVersion,
    credential: record.credential,
    blueprintVersion: record.blueprintVersion,
    reviewerId: action.reviewerId.trim(),
    reviewDate: action.reviewDate,
  };
}

export function flagReviewIssue(
  record: ItemReviewRecord,
  flag: IssueFlag,
  note: string,
  action: HumanReviewAction,
): ItemReviewRecord {
  requireHuman(action);
  return {
    ...record,
    issueFlags: [...new Set([...record.issueFlags, flag])],
    issueStatus: "changes-required",
    operationalStatus: "changes-required",
    reviewerId: action.reviewerId.trim(),
    reviewDate: action.reviewDate,
    reviewNotes: [record.reviewNotes, note.trim()].filter(Boolean).join("\n"),
  };
}

function hasExactSource(record: ItemReviewRecord) {
  return Boolean(
    record.sourceTitle?.trim() &&
      record.sourceOrganizationOrAuthor?.trim() &&
      record.sourceEditionOrVersion?.trim() &&
      record.sourceLocator?.trim(),
  );
}

export function operationalEligibilityErrors(
  record: ItemReviewRecord,
  currentVersion: ItemVersionSnapshot,
): string[] {
  const errors: string[] = [];
  if (record.mappingStatus !== "reviewed" || record.mappingOrigin !== "human") {
    errors.push("objective mapping must be human-reviewed");
  }
  if (!hasExactSource(record)) errors.push("an exact source citation is required");
  if (record.sourceVerificationStatus !== "reviewed") errors.push("source verification is required");
  if (record.keyedAnswerReviewStatus !== "reviewed") errors.push("keyed-answer review is required");
  if (record.technicalReviewStatus !== "reviewed") errors.push("technical review is required");
  if (record.assessmentWritingReviewStatus !== "reviewed") {
    errors.push("assessment-writing review is required");
  }
  if (
    record.reviewedItemVersion !== currentVersion.itemVersion ||
    record.reviewedContentFingerprint !== currentVersion.contentFingerprint
  ) {
    errors.push("the current item version requires approval");
  }
  if (snapshotReviewFingerprint(currentVersion.content, record) !== currentVersion.contentFingerprint) {
    errors.push("controlled item data changed without a new item version");
  }
  if (record.calculationItem) {
    if (record.formulaReviewStatus !== "reviewed") errors.push("formula review is required");
    if (record.unitReviewStatus !== "reviewed") errors.push("unit review is required");
    if (record.roundingAssumptionReviewStatus !== "reviewed") {
      errors.push("rounding and assumption review is required");
    }
    if (record.calculationAndUnitsReviewStatus !== "reviewed") {
      errors.push("calculation and units review is required");
    }
  }
  if (record.bankPool !== "practice") {
    if (record.familyIndependenceReviewStatus !== "reviewed") {
      errors.push("mock item-family independence review is required");
    }
    if (record.distractorReviewStatus !== "reviewed") {
      errors.push("mock distractor-quality review is required");
    }
  }
  if (record.issueStatus === "changes-required" || record.issueFlags.length) {
    errors.push("open review issues must be resolved");
  }
  return errors;
}

export function approveCurrentItemVersion(
  record: ItemReviewRecord,
  currentVersion: ItemVersionSnapshot,
  action: HumanReviewAction,
): ItemReviewRecord {
  requireHuman(action);
  if (record.itemVersion !== currentVersion.itemVersion) {
    throw new Error("Review record does not match the current item version");
  }
  if (snapshotReviewFingerprint(currentVersion.content, record) !== currentVersion.contentFingerprint) {
    throw new Error("Controlled item data changed without a new item version");
  }
  return {
    ...record,
    reviewedItemVersion: currentVersion.itemVersion,
    reviewedContentFingerprint: currentVersion.contentFingerprint,
    reviewerId: action.reviewerId.trim(),
    reviewDate: action.reviewDate,
  };
}

export function markItemOperational(
  record: ItemReviewRecord,
  currentVersion: ItemVersionSnapshot,
  action: HumanReviewAction,
): ItemReviewRecord {
  requireHuman(action);
  const errors = operationalEligibilityErrors(record, currentVersion);
  if (errors.length) throw new Error(errors.join("; "));
  return {
    ...record,
    operationalStatus: "operational",
    reviewerId: action.reviewerId.trim(),
    reviewDate: action.reviewDate,
  };
}

function createVersionSnapshot(question: ReviewQuestion, record: ItemReviewRecord): ItemVersionSnapshot {
  return {
    questionId: question.id,
    itemVersion: record.itemVersion,
    contentFingerprint: reviewContentFingerprint(question, record),
    content: snapshotItemContent(question),
    reviewRecord: structuredClone(record),
  };
}

export function createInitialVersionHistory(
  question: ReviewQuestion,
  mapping: ItemBlueprintMapping,
): ItemVersionHistory {
  const currentReview = createInitialReviewRecord(question, mapping);
  const version = createVersionSnapshot(question, currentReview);
  return { questionId: question.id, currentVersion: 1, currentReview, versions: [version] };
}

export function createNextItemVersion(
  history: ItemVersionHistory,
  nextQuestion: ReviewQuestion,
  nextMapping: ItemBlueprintMapping,
  sourcePatch: Partial<
    Pick<
      ItemReviewRecord,
      | "sourceTitle"
      | "sourceOrganizationOrAuthor"
      | "sourceEditionOrVersion"
      | "sourceLocator"
      | "sourceEffectiveDate"
    >
  > = {},
): ItemVersionHistory {
  if (nextQuestion.id !== history.questionId || nextMapping.questionId !== history.questionId) {
    throw new Error("A new version must retain the original question ID");
  }
  const itemVersion = history.currentVersion + 1;
  const resetMapping: ItemBlueprintMapping = {
    ...nextMapping,
    mappingStatus: nextMapping.primaryObjectiveId ? "suggested" : "unmapped",
    mappingOrigin: nextMapping.primaryObjectiveId
      ? nextMapping.mappingOrigin === "human" ? "human" : "automated"
      : "none",
    sourceReviewStatus: "unreviewed",
    technicalReviewStatus: "unreviewed",
  };
  const mappingErrors = validateItemMapping(resetMapping);
  if (mappingErrors.length) throw new Error(mappingErrors.join("; "));
  const currentReview = {
    ...createInitialReviewRecord(nextQuestion, resetMapping, itemVersion),
    ...sourcePatch,
    sourceVerificationStatus: "unreviewed" as const,
    issueStatus: "changes-required" as const,
    operationalStatus: "changes-required" as const,
    reviewNotes: `Version ${itemVersion} requires review because controlled item data changed.`,
  };
  const nextSnapshot = createVersionSnapshot(nextQuestion, currentReview);
  const priorVersions = history.versions.map((version) =>
    version.itemVersion === history.currentVersion
      ? { ...version, reviewRecord: structuredClone(history.currentReview) }
      : version,
  );
  if (priorVersions.at(-1)?.contentFingerprint === nextSnapshot.contentFingerprint) {
    throw new Error("No controlled content, source, formula, unit, or mapping change was detected");
  }
  return {
    questionId: history.questionId,
    currentVersion: itemVersion,
    currentReview,
    versions: [...priorVersions, nextSnapshot],
  };
}

export function resolveItemVersion(history: ItemVersionHistory, itemVersion = 1) {
  return history.versions.find((version) => version.itemVersion === itemVersion) ?? null;
}

export function resolveAttemptVersion(history: ItemVersionHistory, attempt: Pick<Attempt, "itemVersion">) {
  return resolveItemVersion(history, attempt.itemVersion ?? 1);
}
