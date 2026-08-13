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
}

export interface DomainMastery {
  theta: number;
  correct: number;
  answered: number;
  recent: boolean[];
  stableBlocks: number;
  difficulty: number;
}

export interface Attempt {
  exam: "ASP" | "CSP";
  questionId: string;
  catalogId: number;
  domainId: string;
  competency: string;
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
}

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

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function readinessScore(mastery?: DomainMastery) {
  if (!mastery) return 43;
  const observed = mastery.answered ? mastery.correct / mastery.answered : 0.5;
  const recent = mastery.recent.length
    ? mastery.recent.filter(Boolean).length / mastery.recent.length
    : 0.5;
  const ability = 1 / (1 + Math.exp(-1.25 * mastery.theta));
  return Math.round(100 * (observed * 0.25 + recent * 0.45 + ability * 0.3));
}

export function overallReadiness(
  masteries: Record<string, DomainMastery>,
  domains: readonly CoachDomain[],
) {
  return Math.round(
    domains.reduce(
      (sum, domain) => sum + readinessScore(masteries[domain.id]) * domain.weight,
      0,
    ),
  );
}

export function difficultyLabel(value: number) {
  if (value <= 1) return "Foundation";
  if (value === 2) return "Core recall";
  if (value === 3) return "Applied";
  if (value === 4) return "Exam level";
  return "Exam-day stretch";
}

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
    const score = readinessScore(masteries[domain.id]);
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
  const abilityBand = Math.round(2.7 + (mastery?.theta ?? -0.35) * 0.95);
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
}) {
  const seed = options.seed ?? Date.now();
  const random = mulberry32(seed);
  const recent = new Set(options.recentIds ?? []);
  const seen = new Set(options.seenQuestionIds ?? []);
  const missed = new Set(options.missedIds ?? []);
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
          readinessScore(options.masteries[a.id]) - readinessScore(options.masteries[b.id]),
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
    for (let index = 0; index < (quotas[domain.id] ?? 0); index += 1) {
      const target = pickTargetDifficulty(options.masteries[domain.id], random);
      const unused = domainQuestions.filter((question) => !selectedBaseIds.has(question.id));
      const candidatePool = unused.length ? unused : domainQuestions;
      const ranked = candidatePool
        .map((question) => ({
          question,
          penalty:
            Math.abs(question.difficulty - target) * 4 +
            (seen.has(question.id) ? 18 : 0) +
            (recent.has(question.id) ? 24 : 0) +
            random(),
        }))
        .sort((a, b) => a.penalty - b.penalty);
      const base = ranked[0]?.question;
      if (!base) continue;
      selectedBaseIds.add(base.id);
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
  difficulty: number,
  correct: boolean,
  confidence: Confidence,
  seconds: number,
) {
  const difficultyTheta = [-1.6, -0.8, 0, 0.75, 1.45][difficulty - 1];
  const probability = 1 / (1 + Math.exp(-1.2 * (current.theta - difficultyTheta)));
  const confidenceFactor = confidence === "sure" ? 1.12 : confidence === "guess" ? 0.82 : 1;
  const paceFactor = seconds > 150 ? 0.9 : seconds < 35 ? 1.04 : 1;
  const theta = Math.max(
    -2.4,
    Math.min(
      2.4,
      current.theta +
        0.48 * (Number(correct) - probability) * confidenceFactor * paceFactor,
    ),
  );
  const recent = [...current.recent, correct].slice(-30);
  const nextDifficulty = Math.max(1, Math.min(5, Math.round(2.7 + theta * 0.95)));
  return {
    theta,
    correct: current.correct + Number(correct),
    answered: current.answered + 1,
    recent,
    stableBlocks: current.stableBlocks,
    difficulty: nextDifficulty,
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
