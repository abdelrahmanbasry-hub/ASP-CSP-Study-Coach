export type Confidence = "guess" | "lean" | "sure";
export type SessionMode = "daily" | "quick" | "timed" | "weakest" | "missed" | "custom" | "level" | "exam";
export type QuestionPool = "practice" | "mock-a" | "mock-b";
export type MockForm = "A" | "B";

export interface CoachDomain {
  id: string;
  name: string;
  short: string;
  color: string;
  /** Fractional blueprint weight. All domains for an exam must sum to 1. */
  weight: number;
}

export interface CoachQuestion {
  id: string;
  domainId: string;
  competency: string;
  objective?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  wrongRationales: readonly [string, string, string, string];
  referenceFramework: string;
  referenceTopic: string;
  challengePrompt: string;
  /** Existing seed questions omit this field and are treated as practice items. */
  pool?: QuestionPool;
  /** Optional independence metadata. Older authored items safely omit it. */
  scenarioFamily?: string;
}

export type StabilityEvidenceState =
  | "not-enough-current-evidence"
  | "qualified"
  | "below-threshold";

export interface DomainMastery {
  theta: number;
  correct: number;
  answered: number;
  recent: boolean[];
  stableBlocks: number;
  difficulty: number;
  /** Qualification result for the most recently completed block containing this domain. */
  lastBlockEvidence?: StabilityEvidenceState;
}

export interface Attempt {
  exam: "ASP" | "CSP";
  questionId: string;
  catalogId: number;
  domainId: string;
  competency: string;
  objective?: string;
  stem: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number;
  correct: boolean;
  confidence: Confidence;
  seconds: number;
  difficulty: number;
  rationale: string;
  wrongRationale: string;
  framework: string;
  referenceTopic: string;
  challengePrompt: string;
  timestamp: number;
  sessionId: string;
  pool?: QuestionPool;
  mockForm?: MockForm;
  firstExposure?: boolean;
  scenarioFamily?: string;
}

/**
 * Assessment trust thresholds are intentionally named and centralized. Readiness
 * requires a balanced 20-question body of evidence; individual domain percentages
 * require three responses. Stability is stricter and uses only the current block.
 */
export const ASSESSMENT_EVIDENCE_CONFIG = Object.freeze({
  readiness: Object.freeze({
    minimumIndependentQuestions: 20,
    minimumResponsesPerDomain: 1,
    minimumResponsesForDomainIndicator: 3,
  }),
  stability: Object.freeze({
    minimumCurrentBlockQuestions: 3,
    minimumIndependentItemFamilies: 2,
    accuracyThreshold: 0.8,
    requiredStableBlocks: 2,
  }),
});

export const READINESS_LABEL = "Practice Readiness Indicator";
export const READINESS_INSUFFICIENT_LABEL = "Insufficient evidence";
export const READINESS_INSUFFICIENT_EXPLANATION =
  "Complete the diagnostic or additional independent practice questions before a readiness indicator can be calculated.";
export const READINESS_DISCLAIMER =
  "This is a coaching estimate based on your practice activity. It is not a prediction of your BCSP examination result.";
export const PROVISIONAL_DIFFICULTY_NOTE =
  "Provisional authoring level. This item has not yet been empirically calibrated.";

export interface SessionQuestion extends CoachQuestion {
  catalogId: number;
  options: [string, string, string, string];
  wrongRationales: [string, string, string, string];
}

export function chooseMockForm(
  completed: readonly { mockForm?: MockForm; date: number }[],
): { form: MockForm; firstExposure: boolean } {
  const formA = completed.filter((session) => session.mockForm === "A");
  const formB = completed.filter((session) => session.mockForm === "B");
  if (!formA.length) return { form: "A", firstExposure: true };
  if (!formB.length) return { form: "B", firstExposure: true };
  const latestA = Math.max(...formA.map((session) => session.date));
  const latestB = Math.max(...formB.map((session) => session.date));
  return { form: latestA <= latestB ? "A" : "B", firstExposure: false };
}

export const defaultMastery = (domains: readonly CoachDomain[]): Record<string, DomainMastery> =>
  Object.fromEntries(
    domains.map((domain) => [
      domain.id,
      { theta: -0.35, correct: 0, answered: 0, recent: [], stableBlocks: 0, difficulty: 2 },
    ]),
  ) as unknown as Record<string, DomainMastery>;

function finiteNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Makes partial pre-patch mastery records safe without discarding valid history. */
export function normalizeDomainMastery(value?: Partial<DomainMastery> | null): DomainMastery {
  const answered = Math.max(0, Math.floor(finiteNumber(value?.answered, 0)));
  const correct = Math.max(0, Math.min(answered, Math.floor(finiteNumber(value?.correct, 0))));
  const recent = Array.isArray(value?.recent)
    ? value.recent.filter((entry): entry is boolean => typeof entry === "boolean").slice(-30)
    : [];
  const difficulty = Math.max(1, Math.min(5, Math.round(finiteNumber(value?.difficulty, 2))));
  const lastBlockEvidence =
    value?.lastBlockEvidence === "qualified" ||
    value?.lastBlockEvidence === "below-threshold" ||
    value?.lastBlockEvidence === "not-enough-current-evidence"
      ? value.lastBlockEvidence
      : undefined;
  return {
    theta: Math.max(-2.4, Math.min(2.4, finiteNumber(value?.theta, -0.35))),
    correct,
    answered,
    recent,
    stableBlocks: Math.max(0, Math.floor(finiteNumber(value?.stableBlocks, 0))),
    difficulty,
    ...(lastBlockEvidence ? { lastBlockEvidence } : {}),
  };
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function practiceIndicatorValue(mastery?: DomainMastery) {
  const safe = normalizeDomainMastery(mastery);
  if (!safe.answered) return 0;
  const observed = safe.correct / safe.answered;
  const recent = safe.recent.length
    ? safe.recent.filter(Boolean).length / safe.recent.length
    : observed;
  // This is a transparent coaching blend, not an IRT or pass-probability model.
  return Math.round(100 * (observed * 0.45 + recent * 0.55));
}

export function readinessScore(mastery?: DomainMastery): number | null {
  const safe = normalizeDomainMastery(mastery);
  if (safe.answered < ASSESSMENT_EVIDENCE_CONFIG.readiness.minimumResponsesForDomainIndicator) {
    return null;
  }
  return practiceIndicatorValue(safe);
}

export function overallReadiness(
  masteries: Record<string, DomainMastery>,
  domains: readonly CoachDomain[],
  independentQuestionCount?: number,
): number | null {
  const safeMasteries = domains.map((domain) => normalizeDomainMastery(masteries[domain.id]));
  const cumulativeResponses = safeMasteries.reduce((sum, mastery) => sum + mastery.answered, 0);
  // Cumulative responses are a compatibility fallback for older records that did
  // not persist unique-question evidence separately.
  const evidenceCount = independentQuestionCount ?? cumulativeResponses;
  const enoughCoverage = safeMasteries.every(
    (mastery) =>
      mastery.answered >= ASSESSMENT_EVIDENCE_CONFIG.readiness.minimumResponsesPerDomain,
  );
  if (
    evidenceCount < ASSESSMENT_EVIDENCE_CONFIG.readiness.minimumIndependentQuestions ||
    !enoughCoverage
  ) {
    return null;
  }
  return Math.round(
    domains.reduce(
      (sum, domain) => sum + practiceIndicatorValue(masteries[domain.id]) * domain.weight,
      0,
    ),
  );
}

export function difficultyLabel(value: number) {
  return `Provisional Level ${Math.max(1, Math.min(5, Math.round(value)))}`;
}

const readinessForPriority = (mastery?: DomainMastery) => readinessScore(mastery) ?? 0;

function blueprintQuotas(count: number, seed: number, domains: readonly CoachDomain[]) {
  const raw = domains.map((domain) => ({
    id: domain.id,
    exact: count * domain.weight,
    base: Math.floor(count * domain.weight),
  }));
  let remaining = count - raw.reduce((sum, entry) => sum + entry.base, 0);
  const random = mulberry32(seed);
  raw
    .map((entry) => ({ ...entry, remainder: entry.exact - entry.base, tie: random() }))
    .sort((a, b) => b.remainder - a.remainder || b.tie - a.tie)
    .forEach((entry) => {
      if (remaining > 0) {
        const original = raw.find((candidate) => candidate.id === entry.id);
        if (original) original.base += 1;
        remaining -= 1;
      }
    });
  return Object.fromEntries(raw.map((entry) => [entry.id, entry.base])) as Record<string, number>;
}

function adaptiveQuotas(
  count: number,
  masteries: Record<string, DomainMastery>,
  seed: number,
  domains: readonly CoachDomain[],
  selectedDomains?: string[],
) {
  const eligible = domains.filter(
    (domain) => !selectedDomains || selectedDomains.includes(domain.id),
  );
  const adjusted = eligible.map((domain) => {
    const score = readinessForPriority(masteries[domain.id]);
    const weakBoost = 1 + Math.max(0, 80 - score) / 32;
    const uncertaintyBoost = 1 + 5 / ((masteries[domain.id]?.answered ?? 0) + 8);
    return { id: domain.id, value: domain.weight * weakBoost * uncertaintyBoost };
  });
  const total = adjusted.reduce((sum, item) => sum + item.value, 0);
  const random = mulberry32(seed);
  const quotas = Object.fromEntries(domains.map((domain) => [domain.id, 0])) as Record<
    string,
    number
  >;
  if (!total) return quotas;
  const calculated = adjusted.map((item) => {
    const exact = (item.value / total) * count;
    return { ...item, exact, base: Math.floor(exact), tie: random() };
  });
  calculated.forEach((item) => (quotas[item.id] = item.base));
  let left = count - calculated.reduce((sum, item) => sum + item.base, 0);
  calculated
    .sort((a, b) => b.exact - b.base - (a.exact - a.base) || b.tie - a.tie)
    .forEach((item) => {
      if (left > 0) {
        quotas[item.id] += 1;
        left -= 1;
      }
    });
  return quotas;
}

function pickTargetDifficulty(mastery: DomainMastery | undefined, random: () => number) {
  const safe = normalizeDomainMastery(mastery);
  const recentRate = safe.recent.length
    ? safe.recent.filter(Boolean).length / safe.recent.length
    : safe.answered
      ? safe.correct / safe.answered
      : 0.4;
  const abilityBand = Math.round(1 + recentRate * 4);
  const exploration = random() < 0.18 ? (random() < 0.5 ? -1 : 1) : 0;
  return Math.max(1, Math.min(5, abilityBand + exploration));
}

function shuffledQuestion(
  base: CoachQuestion,
  catalogId: number,
  random: () => number,
): SessionQuestion {
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const options = order.map((index) => base.options[index]) as [string, string, string, string];
  const wrongRationales = order.map((index) => base.wrongRationales[index]) as [
    string,
    string,
    string,
    string,
  ];
  return {
    ...base,
    catalogId,
    options,
    wrongRationales,
    correctIndex: order.indexOf(base.correctIndex) as 0 | 1 | 2 | 3,
  };
}

export function generateSession(options: {
  mode: SessionMode;
  count: number;
  masteries: Record<string, DomainMastery>;
  domains: readonly CoachDomain[];
  questionBank: readonly CoachQuestion[];
  seed?: number;
  selectedDomains?: string[];
  missedIds?: string[];
  recentIds?: string[];
  seenQuestionIds?: string[];
  weakObjectiveKeys?: string[];
  recentIncorrectIds?: string[];
  highConfidenceIncorrectIds?: string[];
  dueForReviewIds?: string[];
}) {
  const seed = options.seed ?? Date.now();
  const random = mulberry32(seed);
  const recent = new Set(options.recentIds ?? []);
  const seen = new Set(options.seenQuestionIds ?? []);
  const missed = new Set(options.missedIds ?? []);
  const weakObjectives = new Set(options.weakObjectiveKeys ?? []);
  const recentIncorrect = new Set(options.recentIncorrectIds ?? []);
  const highConfidenceIncorrect = new Set(options.highConfidenceIncorrectIds ?? []);
  const dueForReview = new Set(options.dueForReviewIds ?? []);
  const bankByMode =
    options.mode === "missed" && missed.size
      ? options.questionBank.filter((question) => missed.has(question.id))
      : options.questionBank;
  const availableDomainIds = options.domains
    .filter((domain) => bankByMode.some((question) => question.domainId === domain.id))
    .map((domain) => domain.id);
  const selected = options.selectedDomains?.filter((domainId) => availableDomainIds.includes(domainId));
  const exactBlueprint = options.mode === "exam" || options.mode === "timed" || options.mode === "quick";
  let quotas = exactBlueprint
    ? blueprintQuotas(options.count, seed, options.domains)
    : adaptiveQuotas(
        options.count,
        options.masteries,
        seed,
        options.domains,
        selected?.length ? selected : availableDomainIds,
      );

  if (options.mode === "weakest") {
    const weakest = [...options.domains]
      .filter((domain) => availableDomainIds.includes(domain.id))
      .sort(
        (a, b) =>
          readinessForPriority(options.masteries[a.id]) -
          readinessForPriority(options.masteries[b.id]),
      )
      .slice(0, 2)
      .map((domain) => domain.id);
    quotas = adaptiveQuotas(options.count, options.masteries, seed, options.domains, weakest);
  }

  const result: SessionQuestion[] = [];

  options.domains.forEach((domain) => {
    const domainQuestions = bankByMode.filter((question) => question.domainId === domain.id);
    if (!domainQuestions.length) return;
    const selectedBaseIds = new Set<string>();
    const selectedFamilies = new Set<string>();
    for (let index = 0; index < (quotas[domain.id] ?? 0); index += 1) {
      const target = pickTargetDifficulty(options.masteries[domain.id], random);
      const unused = domainQuestions.filter((question) => !selectedBaseIds.has(question.id));
      const candidatePool = unused.length ? unused : domainQuestions;
      const ranked = candidatePool
        .map((question) => ({
          question,
          // Reliable practice evidence is compared lexicographically in the
          // documented order below. Provisional authoring difficulty is only the
          // final low-impact tie-breaker and can never outrank unseen/weak/error/
          // review/family-independence evidence.
          priority: [
            seen.has(question.id) ? 1 : 0,
            weakObjectives.has(`${question.domainId}::${question.objective ?? question.competency}`) ? 0 : 1,
            recentIncorrect.has(question.id) ? 0 : 1,
            highConfidenceIncorrect.has(question.id) ? 0 : 1,
            dueForReview.has(question.id) ? 0 : 1,
            question.scenarioFamily && selectedFamilies.has(question.scenarioFamily) ? 1 : 0,
            recent.has(question.id) ? 1 : 0,
            Math.abs(question.difficulty - target) * 0.01,
            random(),
          ],
        }))
        .sort((a, b) => {
          for (let priority = 0; priority < a.priority.length; priority += 1) {
            const difference = a.priority[priority] - b.priority[priority];
            if (difference) return difference;
          }
          return 0;
        });
      const base = ranked[0]?.question;
      if (!base) continue;
      selectedBaseIds.add(base.id);
      if (base.scenarioFamily) selectedFamilies.add(base.scenarioFamily);
      const catalogId = options.questionBank.findIndex((question) => question.id === base.id) + 1;
      result.push(shuffledQuestion(base, catalogId, random));
    }
  });

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, options.count);
}

export function updateDomainMastery(
  current: DomainMastery,
  provisionalDifficulty: number,
  correct: boolean,
  _confidence: Confidence,
  _seconds: number,
) {
  void provisionalDifficulty;
  void _confidence;
  void _seconds;
  const safe = normalizeDomainMastery(current);
  const recent = [...safe.recent, correct].slice(-30);
  const nextCorrect = safe.correct + Number(correct);
  const nextAnswered = safe.answered + 1;
  const observed = nextCorrect / nextAnswered;
  const recentRate = recent.filter(Boolean).length / recent.length;
  const coachingRate = observed * 0.45 + recentRate * 0.55;
  const theta = Math.max(-2.4, Math.min(2.4, (coachingRate - 0.5) * 4.8));
  const nextDifficulty = Math.max(1, Math.min(5, Math.round(1 + coachingRate * 4)));
  return {
    theta,
    correct: nextCorrect,
    answered: nextAnswered,
    recent,
    stableBlocks: safe.stableBlocks,
    difficulty: nextDifficulty,
    ...(safe.lastBlockEvidence ? { lastBlockEvidence: safe.lastBlockEvidence } : {}),
  };
}

export function applyDomainStabilityForBlock(
  current: DomainMastery,
  evidence: readonly { questionId: string; correct: boolean; itemFamily?: string }[],
): DomainMastery {
  const safe = normalizeDomainMastery(current);
  const independentItems = [
    ...new Map(evidence.map((item) => [item.questionId, item])).values(),
  ];
  const families = independentItems
    .map((item) => item.itemFamily?.trim())
    .filter((family): family is string => Boolean(family));
  const insufficientQuestions =
    independentItems.length < ASSESSMENT_EVIDENCE_CONFIG.stability.minimumCurrentBlockQuestions;
  const insufficientFamilies =
    families.length > 0 &&
    new Set(families).size <
      ASSESSMENT_EVIDENCE_CONFIG.stability.minimumIndependentItemFamilies;
  if (insufficientQuestions || insufficientFamilies) {
    return { ...safe, lastBlockEvidence: "not-enough-current-evidence" };
  }
  const accuracy =
    independentItems.filter((item) => item.correct).length / independentItems.length;
  if (accuracy < ASSESSMENT_EVIDENCE_CONFIG.stability.accuracyThreshold) {
    return { ...safe, stableBlocks: 0, lastBlockEvidence: "below-threshold" };
  }
  return {
    ...safe,
    stableBlocks: safe.stableBlocks + 1,
    lastBlockEvidence: "qualified",
  };
}

export function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}
