import { BLUEPRINT_OBJECTIVE_BY_ID, type BlueprintVersion, type Credential } from "./blueprintRegistry.ts";

export const PRACTICE_V2_SCHEMA_VERSION = 2 as const;
export const PRACTICE_V2_PROGRESS_KEY = "asp-csp-practice-v2-progress-v1";
export const PRACTICE_V2_COUNTS = [10, 15, 20, 25] as const;

export type PracticeV2ReviewStatus =
  | "demo"
  | "draft"
  | "ready"
  | "rejected"
  | "retired";
export type PracticeV2VerificationStatus = "unverified" | "source-checked" | "human-reviewed";
export type PracticeV2AuthoringOrigin = "human-authored" | "ai-assisted" | "imported";
export type PracticeV2GateStatus = "pending" | "passed" | "failed";
export type PracticeV2QuestionType = "single-best-answer" | "scenario" | "calculation";
export type PracticeV2CognitiveLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate";

export interface PracticeV2Question {
  id: string;
  version: number;
  credential: Credential;
  blueprintVersion: BlueprintVersion;
  chapterId: string;
  chapterTitle: string;
  primaryObjectiveId: string;
  secondaryObjectiveIds: string[];
  concept: string;
  itemFamilyId: string;
  questionType: PracticeV2QuestionType;
  cognitiveLevel: PracticeV2CognitiveLevel;
  stem: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  correctAnswerExplanation: string;
  incorrectOptionExplanations: [string | null, string | null, string | null, string | null];
  sourceTitle: string | null;
  sourceLocation: string | null;
  formula: string | null;
  units: string | null;
  reviewStatus: PracticeV2ReviewStatus;
  verificationStatus: PracticeV2VerificationStatus;
  authoringOrigin: PracticeV2AuthoringOrigin;
  contentValidationStatus: PracticeV2GateStatus;
  duplicateSimilarityCheckStatus: PracticeV2GateStatus;
}

export interface PracticeV2QuestionPack {
  schemaVersion: typeof PRACTICE_V2_SCHEMA_VERSION;
  packId: string;
  packStatus: "demo" | "content";
  questions: PracticeV2Question[];
}

export interface PracticeV2ValidationIssue {
  path: string;
  code: string;
  message: string;
  questionId?: string;
}

export interface PracticeV2Progress {
  schemaVersion: 1;
  seenQuestionIds: string[];
  incorrectQuestionIds: string[];
  highConfidenceIncorrectQuestionIds: string[];
  attempts: Record<string, { attempts: number; correct: number; lastAnsweredAt: string }>;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const REVIEW_STATUSES = new Set<PracticeV2ReviewStatus>(["demo", "draft", "ready", "rejected", "retired"]);
const VERIFICATION_STATUSES = new Set<PracticeV2VerificationStatus>(["unverified", "source-checked", "human-reviewed"]);
const AUTHORING_ORIGINS = new Set<PracticeV2AuthoringOrigin>(["human-authored", "ai-assisted", "imported"]);
const GATE_STATUSES = new Set<PracticeV2GateStatus>(["pending", "passed", "failed"]);
const QUESTION_TYPES = new Set<PracticeV2QuestionType>(["single-best-answer", "scenario", "calculation"]);
const COGNITIVE_LEVELS = new Set<PracticeV2CognitiveLevel>(["remember", "understand", "apply", "analyze", "evaluate"]);

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const EXACT_SOURCE_LOCATION = /(?:\b(?:chapter|ch\.?|page|p{1,2}\.?|section|sec\.?|regulation|standard|cfr)\b|§)/i;

export function validatePracticeV2Pack(value: unknown): PracticeV2ValidationIssue[] {
  const issues: PracticeV2ValidationIssue[] = [];
  const add = (path: string, code: string, message: string, questionId?: string) => issues.push({ path, code, message, questionId });
  if (!object(value)) return [{ path: "$", code: "invalid-pack", message: "Question file must contain a JSON object." }];
  if (value.schemaVersion !== PRACTICE_V2_SCHEMA_VERSION) add("schemaVersion", "invalid-schema-version", "schemaVersion must be 2.");
  if (!nonempty(value.packId)) add("packId", "missing-pack-id", "packId is required.");
  if (value.packStatus !== "demo" && value.packStatus !== "content") add("packStatus", "invalid-pack-status", "packStatus must be demo or content.");
  if (!Array.isArray(value.questions)) {
    add("questions", "invalid-questions", "questions must be an array.");
    return issues;
  }

  const seen = new Set<string>();
  value.questions.forEach((candidate, index) => {
    const path = `questions[${index}]`;
    if (!object(candidate)) {
      add(path, "invalid-question", "Question must be an object.");
      return;
    }
    const id = nonempty(candidate.id) ? candidate.id : undefined;
    if (!id) add(`${path}.id`, "missing-id", "Question ID is required.");
    else if (seen.has(id)) add(`${path}.id`, "duplicate-id", `Duplicate question ID: ${id}.`, id);
    else seen.add(id);
    if (!Number.isInteger(candidate.version) || (candidate.version as number) < 1) add(`${path}.version`, "invalid-version", "version must be a positive integer.", id);
    if (candidate.credential !== "ASP" && candidate.credential !== "CSP") add(`${path}.credential`, "invalid-credential", "credential must be ASP or CSP.", id);
    const expectedVersion = candidate.credential === "ASP" ? "ASP11" : candidate.credential === "CSP" ? "CSP11" : null;
    if (candidate.blueprintVersion !== expectedVersion) add(`${path}.blueprintVersion`, "invalid-blueprint-version", "blueprintVersion must match the credential.", id);
    if (!nonempty(candidate.chapterId)) add(`${path}.chapterId`, "missing-chapter-id", "chapterId is required.", id);
    if (!nonempty(candidate.chapterTitle)) add(`${path}.chapterTitle`, "missing-chapter-title", "chapterTitle is required.", id);

    const primary = nonempty(candidate.primaryObjectiveId) ? BLUEPRINT_OBJECTIVE_BY_ID.get(candidate.primaryObjectiveId) : undefined;
    if (!primary || primary.credential !== candidate.credential || primary.blueprintVersion !== candidate.blueprintVersion) {
      add(`${path}.primaryObjectiveId`, "invalid-objective", "primaryObjectiveId must exist in the selected credential blueprint.", id);
    }
    if (!Array.isArray(candidate.secondaryObjectiveIds)) add(`${path}.secondaryObjectiveIds`, "invalid-secondary-objectives", "secondaryObjectiveIds must be an array.", id);
    else {
      const secondary = candidate.secondaryObjectiveIds;
      if (new Set(secondary).size !== secondary.length) add(`${path}.secondaryObjectiveIds`, "duplicate-secondary-objective", "secondaryObjectiveIds must be unique.", id);
      for (const [secondaryIndex, objectiveId] of secondary.entries()) {
        const objective = typeof objectiveId === "string" ? BLUEPRINT_OBJECTIVE_BY_ID.get(objectiveId) : undefined;
        if (!objective || objective.credential !== candidate.credential || objective.blueprintVersion !== candidate.blueprintVersion || objectiveId === candidate.primaryObjectiveId) {
          add(`${path}.secondaryObjectiveIds[${secondaryIndex}]`, "invalid-objective", "Secondary objective must be a distinct objective in the selected credential blueprint.", id);
        }
      }
    }
    for (const field of ["concept", "itemFamilyId", "stem", "correctAnswerExplanation"] as const) {
      if (!nonempty(candidate[field])) add(`${path}.${field}`, `missing-${field}`, `${field} is required.`, id);
    }
    if (!QUESTION_TYPES.has(candidate.questionType as PracticeV2QuestionType)) add(`${path}.questionType`, "invalid-question-type", "questionType is invalid.", id);
    if (!COGNITIVE_LEVELS.has(candidate.cognitiveLevel as PracticeV2CognitiveLevel)) add(`${path}.cognitiveLevel`, "invalid-cognitive-level", "cognitiveLevel is invalid.", id);
    if (!Array.isArray(candidate.options) || candidate.options.length !== 4) add(`${path}.options`, "invalid-option-count", "A question must have exactly four options.", id);
    else {
      if (candidate.options.some((option) => !nonempty(option))) add(`${path}.options`, "empty-option", "Every option must be a non-empty string.", id);
      if (new Set(candidate.options).size !== 4) add(`${path}.options`, "duplicate-options", "All four options must be unique.", id);
    }
    const correctIndex = candidate.correctOptionIndex;
    if (!Number.isInteger(correctIndex) || (correctIndex as number) < 0 || (correctIndex as number) > 3) add(`${path}.correctOptionIndex`, "invalid-correct-index", "correctOptionIndex must be an integer from 0 through 3.", id);
    if (!Array.isArray(candidate.incorrectOptionExplanations) || candidate.incorrectOptionExplanations.length !== 4) {
      add(`${path}.incorrectOptionExplanations`, "invalid-explanation-count", "incorrectOptionExplanations must contain exactly four slots.", id);
    } else if (Number.isInteger(correctIndex) && (correctIndex as number) >= 0 && (correctIndex as number) <= 3) {
      candidate.incorrectOptionExplanations.forEach((explanation, optionIndex) => {
        if (optionIndex === correctIndex && explanation !== null) add(`${path}.incorrectOptionExplanations[${optionIndex}]`, "correct-explanation-slot", "The correct option explanation slot must be null.", id);
        if (optionIndex !== correctIndex && !nonempty(explanation)) add(`${path}.incorrectOptionExplanations[${optionIndex}]`, "missing-option-explanation", "Every incorrect option requires an explanation.", id);
      });
    }
    if (!REVIEW_STATUSES.has(candidate.reviewStatus as PracticeV2ReviewStatus)) add(`${path}.reviewStatus`, "invalid-review-status", "reviewStatus is invalid.", id);
    if (!VERIFICATION_STATUSES.has(candidate.verificationStatus as PracticeV2VerificationStatus)) add(`${path}.verificationStatus`, "invalid-verification-status", "verificationStatus is invalid.", id);
    if (!AUTHORING_ORIGINS.has(candidate.authoringOrigin as PracticeV2AuthoringOrigin)) add(`${path}.authoringOrigin`, "invalid-authoring-origin", "authoringOrigin is invalid.", id);
    if (!GATE_STATUSES.has(candidate.contentValidationStatus as PracticeV2GateStatus)) add(`${path}.contentValidationStatus`, "invalid-content-validation-status", "contentValidationStatus is invalid.", id);
    if (!GATE_STATUSES.has(candidate.duplicateSimilarityCheckStatus as PracticeV2GateStatus)) add(`${path}.duplicateSimilarityCheckStatus`, "invalid-similarity-status", "duplicateSimilarityCheckStatus is invalid.", id);
    if (value.packStatus === "demo" && (candidate.reviewStatus !== "demo" || candidate.verificationStatus !== "unverified")) add(`${path}.reviewStatus`, "pack-status-mismatch", "Demo packs may contain only unverified demo questions.", id);
    if (value.packStatus === "content" && candidate.reviewStatus === "demo") add(`${path}.reviewStatus`, "pack-status-mismatch", "Content packs cannot contain demo questions.", id);
    if (candidate.verificationStatus === "source-checked" && candidate.authoringOrigin !== "ai-assisted") add(`${path}.authoringOrigin`, "source-checked-origin", "Source-checked production items must be identified as AI-assisted.", id);
    if (candidate.verificationStatus === "human-reviewed" && candidate.authoringOrigin !== "human-authored") add(`${path}.authoringOrigin`, "human-reviewed-origin", "Only human-authored items may use the human-reviewed label.", id);
    if (candidate.verificationStatus !== "unverified") {
      if (candidate.reviewStatus !== "ready") add(`${path}.reviewStatus`, "verified-item-not-ready", "Verified items must have reviewStatus ready.", id);
      if (!nonempty(candidate.sourceTitle)) add(`${path}.sourceTitle`, "missing-verified-source-title", "Verified questions require an exact source title.", id);
      if (!nonempty(candidate.sourceLocation) || !EXACT_SOURCE_LOCATION.test(candidate.sourceLocation)) add(`${path}.sourceLocation`, "missing-exact-source-location", "Verified questions require an exact chapter, page, section, or regulation location.", id);
      if (candidate.contentValidationStatus !== "passed") add(`${path}.contentValidationStatus`, "content-validation-not-passed", "Verified questions require a passed content validation check.", id);
      if (candidate.duplicateSimilarityCheckStatus !== "passed") add(`${path}.duplicateSimilarityCheckStatus`, "similarity-check-not-passed", "Verified questions require a passed duplicate and similarity check.", id);
    }
    if (candidate.questionType === "calculation" && (!nonempty(candidate.formula) || !nonempty(candidate.units))) add(`${path}.formula`, "missing-calculation-metadata", "Calculation questions require formula and units information.", id);
    for (const field of ["sourceTitle", "sourceLocation", "formula", "units"] as const) {
      if (candidate[field] !== null && typeof candidate[field] !== "string") add(`${path}.${field}`, `invalid-${field}`, `${field} must be a string or null.`, id);
    }
  });
  return issues;
}

export function isPracticeV2ProductionEligible(question: PracticeV2Question) {
  if (question.verificationStatus !== "source-checked" && question.verificationStatus !== "human-reviewed") return false;
  return validatePracticeV2Pack({ schemaVersion: PRACTICE_V2_SCHEMA_VERSION, packId: "production-eligibility-check", packStatus: "content", questions: [question] }).length === 0;
}

export function practiceV2VerificationBadge(question: PracticeV2Question) {
  if (question.verificationStatus === "source-checked") return "Source-checked · AI-assisted";
  if (question.verificationStatus === "human-reviewed") return "Human-reviewed";
  return question.reviewStatus === "demo" ? "Unverified · Demo only" : "Unverified";
}

export function emptyPracticeV2Progress(): PracticeV2Progress {
  return { schemaVersion: 1, seenQuestionIds: [], incorrectQuestionIds: [], highConfidenceIncorrectQuestionIds: [], attempts: {} };
}

export function loadPracticeV2Progress(storage: StorageLike): PracticeV2Progress {
  try {
    const parsed = JSON.parse(storage.getItem(PRACTICE_V2_PROGRESS_KEY) ?? "null") as Partial<PracticeV2Progress> | null;
    if (!parsed || parsed.schemaVersion !== 1) return emptyPracticeV2Progress();
    return {
      schemaVersion: 1,
      seenQuestionIds: Array.isArray(parsed.seenQuestionIds) ? parsed.seenQuestionIds.filter((id): id is string => typeof id === "string") : [],
      incorrectQuestionIds: Array.isArray(parsed.incorrectQuestionIds) ? parsed.incorrectQuestionIds.filter((id): id is string => typeof id === "string") : [],
      highConfidenceIncorrectQuestionIds: Array.isArray(parsed.highConfidenceIncorrectQuestionIds) ? parsed.highConfidenceIncorrectQuestionIds.filter((id): id is string => typeof id === "string") : [],
      attempts: object(parsed.attempts) ? parsed.attempts as PracticeV2Progress["attempts"] : {},
    };
  } catch {
    return emptyPracticeV2Progress();
  }
}

export function savePracticeV2Progress(storage: StorageLike, progress: PracticeV2Progress) {
  storage.setItem(PRACTICE_V2_PROGRESS_KEY, JSON.stringify(progress));
}

export function recordPracticeV2Answer(progress: PracticeV2Progress, questionId: string, correct: boolean, highConfidence: boolean, answeredAt = new Date().toISOString()): PracticeV2Progress {
  const prior = progress.attempts[questionId] ?? { attempts: 0, correct: 0, lastAnsweredAt: answeredAt };
  const unique = (values: string[]) => [...new Set(values)];
  return {
    ...progress,
    seenQuestionIds: unique([...progress.seenQuestionIds, questionId]),
    incorrectQuestionIds: correct ? progress.incorrectQuestionIds.filter((id) => id !== questionId) : unique([...progress.incorrectQuestionIds, questionId]),
    highConfidenceIncorrectQuestionIds: correct ? progress.highConfidenceIncorrectQuestionIds.filter((id) => id !== questionId) : highConfidence ? unique([...progress.highConfidenceIncorrectQuestionIds, questionId]) : progress.highConfidenceIncorrectQuestionIds,
    attempts: { ...progress.attempts, [questionId]: { attempts: prior.attempts + 1, correct: prior.correct + (correct ? 1 : 0), lastAnsweredAt: answeredAt } },
  };
}

export function filterPracticeV2Questions(questions: readonly PracticeV2Question[], credential: Credential, chapterIds: readonly string[]) {
  const chapters = new Set(chapterIds);
  return questions.filter((question) => question.credential === credential && chapters.has(question.chapterId));
}

function seededRank(id: string, seed: string) {
  let hash = 2166136261;
  for (const char of `${seed}:${id}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

export function selectPracticeV2Questions(options: {
  questions: readonly PracticeV2Question[];
  credential: Credential;
  chapterIds: readonly string[];
  count: number;
  progress: PracticeV2Progress;
  mode?: "practice" | "mistakes";
  seed?: string;
}) {
  const seen = new Set(options.progress.seenQuestionIds);
  const mistakes = new Set(options.progress.incorrectQuestionIds);
  const seed = options.seed ?? "practice-v2";
  const eligible = filterPracticeV2Questions(options.questions, options.credential, options.chapterIds)
    .filter((question) => options.mode !== "mistakes" || mistakes.has(question.id))
    .sort((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)) || seededRank(a.id, seed) - seededRank(b.id, seed));
  const families = new Set<string>();
  const selected: PracticeV2Question[] = [];
  for (const question of eligible) {
    if (families.has(question.itemFamilyId)) continue;
    selected.push(question);
    families.add(question.itemFamilyId);
    if (selected.length === options.count) break;
  }
  return selected;
}
