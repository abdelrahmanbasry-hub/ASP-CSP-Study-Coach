import demoPackJson from "../practice-v2/demo/demo-questions.json";
import { validatePracticeV2Pack, type PracticeV2Question, type PracticeV2QuestionPack } from "./practiceV2.ts";

const importedModules = import.meta.glob("../practice-v2/imported/*.json", { eager: true, import: "default" }) as Record<string, unknown>;

function validPack(candidate: unknown): candidate is PracticeV2QuestionPack {
  return validatePracticeV2Pack(candidate).length === 0;
}

const importedPacks = Object.values(importedModules).filter(validPack);
const reviewedImportedQuestions = importedPacks
  .flatMap((pack) => pack.questions)
  .filter((question) => question.reviewStatus === "reviewed");
const demoPack = demoPackJson as unknown;
const demoQuestions = validPack(demoPack) ? demoPack.questions.filter((question) => question.reviewStatus === "demo") : [];

export const PRACTICE_V2_HAS_REVIEWED_CONTENT = reviewedImportedQuestions.length > 0;
export const PRACTICE_V2_QUESTIONS: readonly PracticeV2Question[] = process.env.NODE_ENV === "production"
  ? reviewedImportedQuestions
  : [...reviewedImportedQuestions, ...demoQuestions];
