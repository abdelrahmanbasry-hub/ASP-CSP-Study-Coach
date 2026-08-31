import type { Attempt, CoachQuestion } from "./adaptiveEngine";
import { CHAPTERS, HOMEWORK_QUESTIONS } from "./homeworkData";
import { HAZARD_LIBRARY_RECORDS } from "./hazardLibraryData";
import { HAZARD_CATEGORY_BY_ID, hazardSubcategoryName } from "./hazardCategories";
import { hazardSearchText } from "./hazardExplorer";
import { normalizeSearchText as normalize } from "./searchText";
import type { ResourceReferences } from "./hazardTypes";
import { KEY_INFORMATION } from "./keyInformationData";
import type { PracticeV2Question } from "./practiceV2";
import { FLASHCARDS, FORMULA_ENTRIES } from "./studyLibraryData";
import { OSHA_STANDARDS } from "./standardsData";

export type SearchKind =
  | "chapter"
  | "question"
  | "homework"
  | "formula"
  | "standard"
  | "hazard"
  | "flashcard"
  | "mistake"
  | "library";

export type SearchView = "study" | "homework" | "practice" | "key-information" | "library" | "hazards" | "stats" | "review" | "standards" | "notebook" | "mastery";

export type SearchTarget = ResourceReferences & {
  view: SearchView;
  query?: string;
  chapterId?: string;
  chapterNumber?: number;
  itemId?: string;
  libraryTab?: "flashcards" | "formulas" | "hazards";
  category?: string;
  deck?: string;
  formulaSet?: "all" | "frequent";
  reviewSource?: "adaptive" | "chapter" | "homework";
  practiceFocus?: "balanced" | "weak" | "unseen" | "mistakes" | "calculation" | "scenario";
};

export type SearchDocument = {
  id: string;
  kind: SearchKind;
  label: string;
  title: string;
  excerpt: string;
  meta: string;
  target: SearchTarget;
  searchText: string;
  titleText: string;
  keywordText: string;
};

export type SearchResult = SearchDocument & { score: number };

type BuildSearchIndexOptions = {
  examName: "ASP" | "CSP";
  practiceBank: readonly CoachQuestion[];
  chapterPractice: readonly PracticeV2Question[];
  attempts: readonly Attempt[];
};

const excerpt = (value: string, limit = 190) => {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1).trimEnd()}…` : clean;
};

function document(input: Omit<SearchDocument, "searchText" | "titleText" | "keywordText"> & { keywords?: string }) {
  const titleText = normalize(input.title);
  const keywordText = normalize(`${input.label} ${input.meta} ${input.keywords ?? ""}`);
  return {
    ...input,
    searchText: normalize(`${input.title} ${input.excerpt} ${input.meta} ${input.keywords ?? ""}`),
    titleText,
    keywordText,
  } satisfies SearchDocument;
}

export function buildGlobalSearchIndex({ examName, practiceBank, chapterPractice, attempts }: BuildSearchIndexOptions): SearchDocument[] {
  const documents: SearchDocument[] = [];

  CHAPTERS.forEach((chapter) => {
    documents.push(document({
      id: `chapter:${chapter.id}`,
      kind: "chapter",
      label: "Chapter",
      title: `Chapter ${chapter.courseNumber}: ${chapter.courseTitle}`,
      excerpt: `Yates chapter ${chapter.yatesChapterNumber}: ${chapter.yatesChapterTitle}. ${chapter.homeworkCount} homework questions and ${chapter.reviewCount} review questions.`,
      meta: chapter.status === "ready" ? "Homework ready" : "Source material pending",
      keywords: `${chapter.id} ${chapter.sourcePdf ?? ""}`,
      target: { view: "homework", chapterId: chapter.id },
    }));
  });

  chapterPractice.forEach((question) => {
    documents.push(document({
      id: `practice:${question.id}`,
      kind: "question",
      label: "Practice question",
      title: question.stem,
      excerpt: question.correctAnswerExplanation,
      meta: `${question.chapterTitle} · ${question.questionType} · ${question.cognitiveLevel}`,
      keywords: `${question.concept} ${question.formula ?? ""} ${question.units ?? ""} ${question.options.join(" ")}`,
      target: { view: "practice", chapterId: question.chapterId, itemId: question.id, query: question.concept },
    }));
  });

  practiceBank
    .filter((question) => (question.pool ?? "practice") === "practice")
    .forEach((question) => {
      documents.push(document({
        id: `exam-question:${examName}:${question.id}`,
        kind: "question",
        label: `${examName} exam practice`,
        title: question.stem,
        excerpt: question.rationale,
        meta: `${question.competency} · difficulty ${question.difficulty}`,
        keywords: `${question.objective ?? ""} ${question.referenceFramework} ${question.referenceTopic} ${question.options.join(" ")}`,
        target: { view: "study", query: question.competency, itemId: question.id },
      }));
    });

  HOMEWORK_QUESTIONS.forEach((question) => {
    const chapter = CHAPTERS.find((item) => item.id === question.chapterId);
    documents.push(document({
      id: `homework:${question.id}`,
      kind: "homework",
      label: "Homework question",
      title: question.stem,
      excerpt: question.rationale,
      meta: `${chapter?.courseTitle ?? question.chapterId} · ${question.difficulty}`,
      keywords: `${question.tags.join(" ")} ${question.options.join(" ")}`,
      target: { view: "homework", chapterId: question.chapterId, itemId: question.id },
    }));
  });

  FORMULA_ENTRIES.forEach((formula) => {
    documents.push(document({
      id: `formula:${formula.id}`,
      kind: "formula",
      label: "Formula",
      title: formula.name,
      excerpt: `${formula.formula} — ${formula.whenToUse}`,
      meta: `${formula.category} · ${formula.units}`,
      keywords: `${formula.variables.join(" ")} ${formula.commonError} ${formula.workedExample} ${formula.sourcePage}`,
      target: { view: "library", libraryTab: "formulas", itemId: formula.id, query: formula.name },
    }));
  });

  HAZARD_LIBRARY_RECORDS.forEach((hazard) => {
    documents.push(document({
      id: `hazard:${hazard.id}`,
      kind: "hazard",
      label: hazard.source.kind === "controlled-dataset" ? "Hazard" : hazard.source.status === "placeholder" ? "Hazard architecture reference" : hazard.categoryId === "occupational-health" ? "Occupational-health hazard" : "Hazard reference scene",
      title: hazard.name.en,
      excerpt: `${hazard.summary.en} ${hazard.consequences.map((effect) => effect.en).join(" ")}`,
      meta: `${HAZARD_CATEGORY_BY_ID[hazard.categoryId].name.en} · ${hazardSubcategoryName(hazard.categoryId, hazard.subcategoryId)?.en ?? ""}`,
      keywords: hazardSearchText(hazard),
      target: { view: "hazards", itemId: hazard.id, query: hazard.name.en },
    }));
  });

  FLASHCARDS.forEach((card) => {
    documents.push(document({
      id: `flashcard:${card.id}`,
      kind: "flashcard",
      label: "Flashcard",
      title: card.front,
      excerpt: card.back,
      meta: `${card.deck}${card.chapterId ? ` · ${card.chapterId.toUpperCase()}` : ""}`,
      keywords: card.tags.join(" "),
      target: { view: "library", libraryTab: "flashcards", itemId: card.id, query: card.front },
    }));
  });

  OSHA_STANDARDS.forEach((standard) => {
    documents.push(document({
      id: `osha-standard:${standard.id}`,
      kind: "standard",
      label: "OSHA standard",
      title: `${standard.citation} · ${standard.title}`,
      excerpt: standard.summary,
      meta: standard.keyNumbers.join(" · "),
      keywords: `${standard.topics.join(" ")} ${standard.definitions.join(" ")}`,
      target: { view: "standards", itemId: standard.id, query: standard.citation },
    }));
  });

  KEY_INFORMATION.forEach((chapter) => {
    documents.push(document({
      id: `key-info:${chapter.chapter}`,
      kind: "library",
      label: "Key information",
      title: chapter.title,
      excerpt: excerpt(chapter.points.join(" ")),
      meta: `Yates chapter ${chapter.chapter} · source pp. ${chapter.sourcePages?.join(", ") ?? "—"}`,
      keywords: chapter.points.join(" "),
      target: { view: "key-information", chapterNumber: chapter.chapter, query: chapter.title },
    }));
    chapter.points.forEach((point, index) => {
      if (!/\b(?:osha|29\s*cfr|1910\.|1904\.|general duty clause|standard)\b/i.test(point)) return;
      documents.push(document({
        id: `standard:${chapter.chapter}:${index}`,
        kind: "standard",
        label: "OSHA / Standard",
        title: excerpt(point, 115),
        excerpt: `${chapter.title} — ${point}`,
        meta: `Yates chapter ${chapter.chapter} · source pp. ${chapter.sourcePages?.join(", ") ?? "—"}`,
        keywords: `${chapter.title} chapter ${chapter.chapter}`,
        target: { view: "key-information", chapterNumber: chapter.chapter, query: excerpt(point, 80) },
      }));
    });
  });

  const latestIncorrect = new Map<string, Attempt>();
  attempts
    .filter((attempt) => !attempt.correct && (attempt.pool ?? "practice") === "practice")
    .forEach((attempt) => {
      const current = latestIncorrect.get(attempt.questionId);
      if (!current || attempt.timestamp > current.timestamp) latestIncorrect.set(attempt.questionId, attempt);
    });
  latestIncorrect.forEach((attempt) => {
    documents.push(document({
      id: `mistake:${examName}:${attempt.questionId}`,
      kind: "mistake",
      label: "Your past mistake",
      title: attempt.stem,
      excerpt: attempt.wrongRationale || attempt.rationale,
      meta: `${attempt.competency} · ${new Date(attempt.timestamp).toLocaleDateString()}`,
      keywords: `${attempt.referenceTopic} ${attempt.framework} ${attempt.objective ?? ""}`,
      target: { view: "review", query: attempt.stem },
    }));
  });

  return documents;
}

export function searchGlobalIndex(index: readonly SearchDocument[], query: string, limit = 36): SearchResult[] {
  const phrase = normalize(query);
  if (phrase.length < 2) return [];
  const tokens = [...new Set(phrase.split(" ").filter((token) => token.length > 1))];
  if (!tokens.length) return [];

  const ranked = index
    .map((item) => {
      if (!tokens.every((token) => item.searchText.includes(token))) return null;
      let score = 0;
      if (item.titleText === phrase) score += 120;
      else if (item.titleText.startsWith(phrase)) score += 70;
      else if (item.titleText.includes(phrase)) score += 44;
      if (item.keywordText.includes(phrase)) score += 24;
      if (item.searchText.includes(phrase)) score += 18;
      tokens.forEach((token) => {
        if (item.titleText.includes(token)) score += 12;
        if (item.keywordText.includes(token)) score += 6;
        score += Math.max(0, 3 - item.searchText.indexOf(token) / 250);
      });
      if (item.kind === "mistake") score += 5;
      return { ...item, score };
    })
    .filter((item): item is SearchResult => item !== null)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const kindCounts = new Map<SearchKind, number>();
  const diversified: SearchResult[] = [];
  for (const result of ranked) {
    const count = kindCounts.get(result.kind) ?? 0;
    if (count >= 8) continue;
    diversified.push(result);
    kindCounts.set(result.kind, count + 1);
    if (diversified.length >= Math.max(1, limit)) break;
  }
  return diversified;
}
