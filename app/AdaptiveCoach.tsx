"use client";

import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Coffee,
  Flame,
  Flag,
  Gauge,
  History,
  Library,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CSP_DOMAINS, QUESTION_BANK as CSP_QUESTION_BANK } from "./questionBank";
import { CSP_QUESTION_BANK_EXTRA } from "./cspQuestionBankExtra";
import { ASP_DOMAINS, ASP_QUESTION_BANK_A } from "./aspQuestionBankA";
import { ASP_QUESTION_BANK_B } from "./aspQuestionBankB";
import { ASP_QUESTION_BANK_EXTRA_A2 } from "./aspQuestionBankExtraA2";
import { ASP_QUESTION_BANK_EXTRA_SET1 } from "./aspQuestionBankExtraSet1";
import { ASP_QUESTION_BANK_EXTRA_SET2 } from "./aspQuestionBankExtraSet2";
import {
  ASP_MOCK_A,
  ASP_MOCK_B,
  ASP_PRACTICE_EXTRA,
} from "./aspExpandedQuestionBank";
import {
  CSP_MOCK_A,
  CSP_MOCK_B,
  CSP_PRACTICE_EXTRA,
} from "./cspExpandedQuestionBank";
import {
  chooseMockForm,
  defaultMastery,
  difficultyLabel,
  formatTime,
  generateSession,
  overallReadiness,
  readinessScore,
  updateDomainMastery,
  type Attempt,
  type Confidence,
  type CoachDomain,
  type CoachQuestion,
  type DomainMastery,
  type MockForm,
  type SessionMode,
  type SessionQuestion,
} from "./adaptiveEngine";
import HomeworkHub from "./HomeworkHub";
import KeyInformation from "./KeyInformation";
import StudyLibrary from "./StudyLibrary";
import {
  emptyLearningProgress,
  normalizeLearningProgress,
  type LearningProgress,
} from "./learningProgress";
import {
  CloudProgressRequestError,
  loadCloudProgress,
  saveCloudProgress,
} from "./cloudProgress";
import { getSupabaseBrowserClient } from "./supabase-client";
import type { Session } from "@supabase/supabase-js";

type MainView = "study" | "homework" | "key-information" | "library" | "stats" | "review";
type ActiveView = MainView | "quiz" | "results";
type ExamTrack = "ASP" | "CSP";
type DomainId = string;

const ALL_CSP_DOMAINS = CSP_DOMAINS as readonly CoachDomain[];
const ALL_ASP_DOMAINS = ASP_DOMAINS as readonly CoachDomain[];

interface ExamConfig {
  key: ExamTrack;
  name: string;
  credential: string;
  blueprint: string;
  domains: readonly CoachDomain[];
  practiceBank: readonly CoachQuestion[];
  mockForms: Record<MockForm, readonly CoachQuestion[]>;
  examSeconds: number;
  examTimeLabel: string;
  timedSeconds: number;
  paceSeconds: number;
}

const EXAM_CONFIGS: Record<ExamTrack, ExamConfig> = {
  ASP: {
    key: "ASP",
    name: "ASP",
    credential: "Associate Safety Professional",
    blueprint: "ASP11",
    domains: ALL_ASP_DOMAINS,
    practiceBank: [
      ...ASP_QUESTION_BANK_A,
      ...ASP_QUESTION_BANK_B,
      ...ASP_QUESTION_BANK_EXTRA_A2,
      ...ASP_QUESTION_BANK_EXTRA_SET1,
      ...ASP_QUESTION_BANK_EXTRA_SET2,
      ...ASP_PRACTICE_EXTRA,
    ] as readonly CoachQuestion[],
    mockForms: { A: ASP_MOCK_A, B: ASP_MOCK_B },
    examSeconds: 5 * 60 * 60,
    examTimeLabel: "5h",
    timedSeconds: 30 * 60,
    paceSeconds: 90,
  },
  CSP: {
    key: "CSP",
    name: "CSP",
    credential: "Certified Safety Professional",
    blueprint: "CSP11",
    domains: ALL_CSP_DOMAINS,
    practiceBank: [
      ...CSP_QUESTION_BANK,
      ...CSP_QUESTION_BANK_EXTRA,
      ...CSP_PRACTICE_EXTRA,
    ] as readonly CoachQuestion[],
    mockForms: { A: CSP_MOCK_A, B: CSP_MOCK_B },
    examSeconds: 5.5 * 60 * 60,
    examTimeLabel: "5h 30m",
    timedSeconds: 33 * 60,
    paceSeconds: 99,
  },
};

interface SessionSummary {
  exam: ExamTrack;
  id: string;
  date: number;
  mode: SessionMode;
  score: number;
  count: number;
  seconds: number;
  difficulty: number;
  mockForm?: MockForm;
  firstExposure?: boolean;
}

interface SavedState {
  mastery: Record<ExamTrack, Record<DomainId, DomainMastery>>;
  attempts: Attempt[];
  sessions: SessionSummary[];
  examDate: string;
  displayName: string;
  seenQuestionIds: Record<ExamTrack, string[]>;
  mockExposures: Record<ExamTrack, Partial<Record<MockForm, number>>>;
  learning: LearningProgress;
  activeExam: ExamTrack;
}

interface ActiveSessionSnapshot {
  questions: SessionQuestion[];
  sessionMode: SessionMode;
  sessionExam: ExamTrack;
  sessionId: string;
  startedAt: number;
  lastMovedAt?: number;
  current: number;
  answers: Record<number, number>;
  confidence: Record<number, Confidence>;
  secondsByQuestion: Record<number, number>;
  flagged: number[];
  sessionMockForm?: MockForm | null;
  sessionFirstExposure?: boolean;
}

const STORAGE_KEY = "asp-csp-coach-v2";
const ACTIVE_SESSION_KEY = "asp-csp-coach-active-session-v1";

const MODE_COPY: Record<SessionMode, { title: string; eyebrow: string; description: string }> = {
  daily: {
    title: "Today’s 60-minute session",
    eyebrow: "Coach prescribed",
    description: "A 20-item adaptive block, then targeted review and a corrective mini-lesson.",
  },
  quick: {
    title: "Blueprint 20",
    eyebrow: "Balanced drill",
    description: "Twenty randomized items weighted to the active official blueprint.",
  },
  timed: {
    title: "Exam-pace 20",
    eyebrow: "33-minute clock",
    description: "Train at the official 99-second-per-item pace with a hard countdown.",
  },
  weakest: {
    title: "Weak-domain attack",
    eyebrow: "No comfort questions",
    description: "Concentrates the block in your two lowest-stability domains.",
  },
  missed: {
    title: "Repair misses",
    eyebrow: "Error recovery",
    description: "Re-tests concepts you missed, with new ordering and delayed rationales.",
  },
  custom: {
    title: "Build a domain drill",
    eyebrow: "Choose the scope",
    description: "Select one or more blueprint domains. The engine handles difficulty and mix.",
  },
  level: {
    title: "Level up",
    eyebrow: "IRT progression",
    description: "Questions track your estimated ability and escalate toward exam-day stretch.",
  },
  exam: {
    title: "Full exam simulation",
    eyebrow: "200 questions · 5h 30m",
    description: "One uninterrupted 200-item block with exact blueprint weighting.",
  },
};

const emptySavedState = (): SavedState => ({
  mastery: { ASP: defaultMastery(ALL_ASP_DOMAINS), CSP: defaultMastery(ALL_CSP_DOMAINS) },
  attempts: [],
  sessions: [],
  examDate: "",
  displayName: "Safety Professional",
  seenQuestionIds: { ASP: [], CSP: [] },
  mockExposures: { ASP: {}, CSP: {} },
  learning: emptyLearningProgress(),
  activeExam: "CSP",
});

function normalizeSavedState(parsed: Partial<SavedState>): SavedState {
  const base = emptySavedState();
  const candidate = parsed.mastery as unknown as Record<string, unknown> | undefined;
  const isDualTrack = Boolean(candidate && candidate.ASP && candidate.CSP);
  const mastery = isDualTrack
    ? {
        ASP: { ...base.mastery.ASP, ...(candidate?.ASP as Record<string, DomainMastery>) },
        CSP: { ...base.mastery.CSP, ...(candidate?.CSP as Record<string, DomainMastery>) },
      }
    : {
        ASP: base.mastery.ASP,
        CSP: { ...base.mastery.CSP, ...((candidate ?? {}) as Record<string, DomainMastery>) },
      };
  const attemptHistory = (parsed.attempts ?? []).map((attempt) => ({
    ...attempt,
    exam: attempt.exam ?? "CSP",
  }));
  const seenCandidate = parsed.seenQuestionIds as unknown;
  const seenQuestionIds =
    seenCandidate && !Array.isArray(seenCandidate)
      ? { ...base.seenQuestionIds, ...(seenCandidate as Record<ExamTrack, string[]>) }
      : {
          ASP: [...new Set(attemptHistory.filter((attempt) => attempt.exam === "ASP").map((attempt) => attempt.questionId))],
          CSP: [...new Set(attemptHistory.filter((attempt) => attempt.exam === "CSP").map((attempt) => attempt.questionId))],
        };
  const exposureCandidate = parsed.mockExposures as unknown;
  const mockExposures =
    exposureCandidate && typeof exposureCandidate === "object"
      ? {
          ASP: { ...base.mockExposures.ASP, ...((exposureCandidate as SavedState["mockExposures"]).ASP ?? {}) },
          CSP: { ...base.mockExposures.CSP, ...((exposureCandidate as SavedState["mockExposures"]).CSP ?? {}) },
        }
      : base.mockExposures;
  return {
    ...base,
    ...parsed,
    mastery,
    seenQuestionIds,
    mockExposures,
    learning: normalizeLearningProgress(parsed.learning),
    activeExam: parsed.activeExam === "ASP" ? "ASP" : "CSP",
    attempts: attemptHistory,
    sessions: (parsed.sessions ?? []).map((session) => ({ ...session, exam: session.exam ?? "CSP" })),
  };
}

function mockExposureEvents(exposures: Partial<Record<MockForm, number>>) {
  return (["A", "B"] as const)
    .filter((form) => Boolean(exposures[form]))
    .map((form) => ({ mockForm: form, date: exposures[form] as number }));
}

function cloudSafeState(state: SavedState): SavedState {
  return {
    ...state,
    // The full local review history can be large. Cloud sync keeps the most
    // recent correction evidence plus all mastery, exposure, and library data.
    attempts: state.attempts.slice(0, 60),
    sessions: state.sessions.slice(0, 100),
  };
}

function mergeSavedStates(local: SavedState, remote: SavedState): SavedState {
  const attempts = [...local.attempts, ...remote.attempts]
    .filter(
      (attempt, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.exam === attempt.exam &&
            candidate.sessionId === attempt.sessionId &&
            candidate.questionId === attempt.questionId,
        ) === index,
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 1200);
  const sessions = [...local.sessions, ...remote.sessions]
    .filter(
      (session, index, all) =>
        all.findIndex(
          (candidate) => candidate.exam === session.exam && candidate.id === session.id,
        ) === index,
    )
    .sort((a, b) => b.date - a.date)
    .slice(0, 200);
  const mastery = { ...local.mastery };
  (["ASP", "CSP"] as const).forEach((exam) => {
    mastery[exam] = Object.fromEntries(
      EXAM_CONFIGS[exam].domains.map((domain) => {
        const localDomain = local.mastery[exam][domain.id];
        const remoteDomain = remote.mastery[exam][domain.id];
        return [domain.id, (remoteDomain?.answered ?? 0) > (localDomain?.answered ?? 0) ? remoteDomain : localDomain];
      }),
    );
  });
  const chapterScores = { ...local.learning.chapterScores };
  Object.entries(remote.learning.chapterScores).forEach(([chapterId, remoteScore]) => {
    const localScore = chapterScores[chapterId];
    if (!localScore || remoteScore.completedAt > localScore.completedAt) {
      chapterScores[chapterId] = {
        ...remoteScore,
        bestScore: Math.max(remoteScore.bestScore, localScore?.bestScore ?? 0),
        attempts: Math.max(remoteScore.attempts, localScore?.attempts ?? 0),
      };
    } else {
      chapterScores[chapterId] = {
        ...localScore,
        bestScore: Math.max(localScore.bestScore, remoteScore.bestScore),
        attempts: Math.max(localScore.attempts, remoteScore.attempts),
      };
    }
  });
  const flashcards = { ...local.learning.flashcards };
  Object.entries(remote.learning.flashcards).forEach(([cardId, remoteCard]) => {
    const localCard = flashcards[cardId];
    if (!localCard || remoteCard.reviews > localCard.reviews || (remoteCard.reviews === localCard.reviews && remoteCard.dueAt > localCard.dueAt)) {
      flashcards[cardId] = remoteCard;
    }
  });
  const mockExposures = { ...local.mockExposures };
  (["ASP", "CSP"] as const).forEach((exam) => {
    mockExposures[exam] = { ...local.mockExposures[exam] };
    (["A", "B"] as const).forEach((form) => {
      const times = [local.mockExposures[exam][form], remote.mockExposures[exam][form]].filter(
        (value): value is number => typeof value === "number" && value > 0,
      );
      if (times.length) mockExposures[exam][form] = Math.min(...times);
    });
  });
  return {
    ...local,
    mastery,
    attempts,
    sessions,
    seenQuestionIds: {
      ASP: [...new Set([...local.seenQuestionIds.ASP, ...remote.seenQuestionIds.ASP])].slice(-800),
      CSP: [...new Set([...local.seenQuestionIds.CSP, ...remote.seenQuestionIds.CSP])].slice(-800),
    },
    mockExposures,
    learning: { chapterScores, flashcards },
    examDate: local.examDate || remote.examDate,
    displayName: local.displayName === "Safety Professional" ? remote.displayName : local.displayName,
  };
}

function getModeCopy(mode: SessionMode, config: ExamConfig) {
  const base = MODE_COPY[mode];
  if (mode === "quick") {
    return { ...base, description: `Twenty randomized items weighted to the official ${config.blueprint} blueprint.` };
  }
  if (mode === "timed") {
    return {
      ...base,
      eyebrow: `${Math.round(config.timedSeconds / 60)}-minute clock`,
      description: `Train at the official ${config.paceSeconds}-second-per-item pace with a hard countdown.`,
    };
  }
  if (mode === "custom") {
    return { ...base, description: `Select one or more ${config.blueprint} domains. The engine handles difficulty and mix.` };
  }
  if (mode === "exam") {
    return { ...base, title: `Full ${config.name} simulation`, eyebrow: `200 questions · ${config.examTimeLabel}` };
  }
  return base;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function ModeIcon({ mode, size }: { mode: SessionMode; size?: number }) {
  const props = { size };
  if (mode === "daily") return <Sparkles {...props} />;
  if (mode === "quick") return <Zap {...props} />;
  if (mode === "timed") return <AlarmClock {...props} />;
  if (mode === "weakest") return <Target {...props} />;
  if (mode === "missed") return <History {...props} />;
  if (mode === "custom") return <Settings2 {...props} />;
  if (mode === "level") return <TrendingUp {...props} />;
  return <ShieldCheck {...props} />;
}

function masteryStatus(score: number, stableBlocks: number) {
  if (score >= 80 && stableBlocks >= 2) return { label: "Stable", tone: "good" };
  if (score >= 70) return { label: "Building", tone: "warn" };
  return { label: "Priority", tone: "bad" };
}

export default function AdaptiveCoach() {
  const [saved, setSaved] = useState<SavedState>(emptySavedState);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"local" | "loading" | "synced" | "saving" | "conflict" | "offline">("loading");
  const [view, setView] = useState<ActiveView>("study");
  const [navOpen, setNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [setupMode, setSetupMode] = useState<SessionMode | null>(null);
  const [customDomains, setCustomDomains] = useState<DomainId[]>(ALL_CSP_DOMAINS.map((domain) => domain.id));
  const [questions, setQuestions] = useState<SessionQuestion[]>([]);
  const [sessionMode, setSessionMode] = useState<SessionMode>("daily");
  const [sessionExam, setSessionExam] = useState<ExamTrack>("CSP");
  const [sessionMockForm, setSessionMockForm] = useState<MockForm | null>(null);
  const [sessionFirstExposure, setSessionFirstExposure] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [confidence, setConfidence] = useState<Record<number, Confidence>>({});
  const [secondsByQuestion, setSecondsByQuestion] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState(0);
  const [resultAttempts, setResultAttempts] = useState<Attempt[]>([]);
  const [resultFilter, setResultFilter] = useState<"all" | "incorrect">("incorrect");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewDomain, setReviewDomain] = useState<DomainId | "all">("all");
  const [reviewType, setReviewType] = useState<"all" | "correct" | "incorrect">("all");
  const [showFormulaNote, setShowFormulaNote] = useState(false);
  const lastMoveAt = useRef(Date.now());
  const savedRef = useRef(saved);
  const cloudRevisionRef = useRef<number | null>(null);
  const lastCloudPayloadRef = useRef<string | null>(null);
  const activeConfig = EXAM_CONFIGS[saved.activeExam];
  const activeMastery = saved.mastery[saved.activeExam];
  const activeAttempts = saved.attempts.filter((attempt) => attempt.exam === saved.activeExam);
  const activeSessions = saved.sessions.filter((session) => session.exam === saved.activeExam);

  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedState>;
        // Local persistence is an external system; hydration completes before we restore it.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSaved(normalizeSavedState(parsed));
      }
      const activeRaw = window.localStorage.getItem(ACTIVE_SESSION_KEY);
      if (activeRaw) {
        const active = JSON.parse(activeRaw) as ActiveSessionSnapshot;
        if (
          Array.isArray(active.questions) &&
          active.questions.length > 0 &&
          (active.sessionExam === "ASP" || active.sessionExam === "CSP") &&
          active.startedAt > 0
        ) {
          setQuestions(active.questions);
          setSessionMode(active.sessionMode);
          setSessionExam(active.sessionExam);
          setSessionMockForm(active.sessionMockForm ?? null);
          setSessionFirstExposure(Boolean(active.sessionFirstExposure));
          setSessionId(active.sessionId);
          setSessionStartedAt(active.startedAt);
          setCurrent(Math.max(0, Math.min(active.current, active.questions.length - 1)));
          setAnswers(active.answers ?? {});
          setConfidence(active.confidence ?? {});
          const resumedSeconds = { ...(active.secondsByQuestion ?? {}) };
          if (active.lastMovedAt && active.current >= 0 && active.current < active.questions.length) {
            resumedSeconds[active.current] =
              (resumedSeconds[active.current] ?? 0) +
              Math.max(1, Math.round((Date.now() - active.lastMovedAt) / 1000));
          }
          setSecondsByQuestion(resumedSeconds);
          setFlagged(active.flagged ?? []);
          setElapsed(Math.max(0, Math.floor((Date.now() - active.startedAt) / 1000)));
          setView("quiz");
          lastMoveAt.current = Date.now();
          if (active.sessionMockForm) {
            const resumedExam = active.sessionExam;
            const resumedForm = active.sessionMockForm;
            setSaved((currentSaved) => ({
              ...currentSaved,
              mockExposures: {
                ...currentSaved.mockExposures,
                [resumedExam]: {
                  ...currentSaved.mockExposures[resumedExam],
                  [resumedForm]:
                    currentSaved.mockExposures[resumedExam][resumedForm] ?? active.startedAt,
                },
              },
            }));
          }
        }
      }
    } catch {
      // A damaged local record should never block a study session.
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      queueMicrotask(() => {
        setAuthReady(true);
        setCloudStatus("local");
        setCloudReady(true);
      });
      return;
    }
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSupabaseSession(data.session);
      setAuthReady(true);
    }).catch(() => {
      if (!active) return;
      setSupabaseSession(null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
      setAuthReady(true);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !authReady) return;
    const accessToken = supabaseSession?.access_token;
    if (!accessToken) {
      cloudRevisionRef.current = null;
      lastCloudPayloadRef.current = null;
      queueMicrotask(() => {
        setCloudStatus("local");
        setCloudReady(true);
      });
      return;
    }
    const controller = new AbortController();
    void (async () => {
      setCloudReady(false);
      try {
        const snapshot = await loadCloudProgress<SavedState>(accessToken, controller.signal);
        if (snapshot) {
          const cloudState = normalizeSavedState(snapshot.state);
          const merged = mergeSavedStates(savedRef.current, cloudState);
          lastCloudPayloadRef.current = JSON.stringify(cloudSafeState(cloudState));
          setSaved(merged);
          cloudRevisionRef.current = snapshot.revision;
        } else {
          cloudRevisionRef.current = 0;
        }
        setCloudStatus("synced");
        setCloudReady(true);
      } catch {
        setCloudStatus("offline");
        setCloudReady(true);
      }
    })();
    return () => controller.abort();
  }, [mounted, authReady, supabaseSession?.access_token]);

  useEffect(() => {
    const accessToken = supabaseSession?.access_token;
    if (!mounted || !cloudReady || !accessToken || cloudRevisionRef.current === null) return;
    const cloudState = cloudSafeState(saved);
    const serialized = JSON.stringify(cloudState);
    if (serialized === lastCloudPayloadRef.current) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setCloudStatus("saving");
      const expectedRevision = cloudRevisionRef.current;
      if (expectedRevision === null) return;
      void saveCloudProgress(cloudState, expectedRevision, { accessToken, signal: controller.signal })
        .then((snapshot) => {
          lastCloudPayloadRef.current = serialized;
          cloudRevisionRef.current = snapshot.revision;
          setCloudStatus("synced");
        })
        .catch((error: unknown) => {
          if (error instanceof CloudProgressRequestError && error.status === 409 && error.current) {
            const remoteState = normalizeSavedState(error.current.state as Partial<SavedState>);
            lastCloudPayloadRef.current = JSON.stringify(cloudSafeState(remoteState));
            cloudRevisionRef.current = error.current.revision;
            setCloudStatus("conflict");
            setSaved((currentSaved) => mergeSavedStates(currentSaved, remoteState));
          } else if (!controller.signal.aborted) {
            setCloudStatus("offline");
          }
        });
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [saved, mounted, cloudReady, supabaseSession?.access_token]);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      const reduced = { ...saved, attempts: saved.attempts.slice(0, 400), sessions: saved.sessions.slice(0, 80) };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
      } catch {
        // The live session remains usable even when browser storage is unavailable.
      }
    }
  }, [saved, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (view === "quiz" && questions.length && sessionStartedAt) {
        const snapshot: ActiveSessionSnapshot = {
          questions,
          sessionMode,
          sessionExam,
          sessionId,
          startedAt: sessionStartedAt,
          lastMovedAt: lastMoveAt.current,
          current,
          answers,
          confidence,
          secondsByQuestion,
          flagged,
          sessionMockForm,
          sessionFirstExposure,
        };
        window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(snapshot));
      } else if (view !== "quiz") {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch {
      // Storage failure should not interrupt an active exam.
    }
  }, [
    mounted,
    view,
    questions,
    sessionStartedAt,
    sessionMode,
    sessionExam,
    sessionId,
    current,
    answers,
    confidence,
    secondsByQuestion,
    flagged,
    sessionMockForm,
    sessionFirstExposure,
  ]);

  useEffect(() => {
    if (view !== "quiz" || !sessionStartedAt) return;
    const syncElapsed = () => setElapsed(Math.max(0, Math.floor((Date.now() - sessionStartedAt) / 1000)));
    syncElapsed();
    const timer = window.setInterval(syncElapsed, 1000);
    return () => window.clearInterval(timer);
  }, [view, sessionStartedAt]);

  const overall = overallReadiness(activeMastery, activeConfig.domains);
  const sortedDomains = useMemo(
    () => [...activeConfig.domains].sort((a, b) => readinessScore(activeMastery[a.id]) - readinessScore(activeMastery[b.id])),
    [activeConfig.domains, activeMastery],
  );
  const weakest = sortedDomains[0];
  const recentIncorrectIds = activeAttempts
    .filter((attempt) => !attempt.correct && (attempt.pool ?? "practice") === "practice")
    .map((attempt) => attempt.questionId);
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[current];
  const sessionConfig = EXAM_CONFIGS[sessionExam];
  const sessionLimit = sessionMode === "exam" ? sessionConfig.examSeconds : sessionMode === "timed" ? sessionConfig.timedSeconds : 60 * 60;
  const remaining = Math.max(0, sessionLimit - elapsed);

  useEffect(() => {
    if (view === "quiz" && remaining === 0 && questions.length) finishSession();
    // finishSession is intentionally driven only by the terminal timer transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, view, questions.length]);

  function recordCurrentSeconds() {
    const addition = Math.max(1, Math.round((Date.now() - lastMoveAt.current) / 1000));
    setSecondsByQuestion((existing) => ({ ...existing, [current]: (existing[current] ?? 0) + addition }));
    lastMoveAt.current = Date.now();
  }

  function startSession(mode: SessionMode) {
    const count = mode === "exam" ? 200 : 20;
    const seed = Date.now();
    const mockChoice =
      mode === "exam"
        ? chooseMockForm(mockExposureEvents(saved.mockExposures[saved.activeExam]))
        : null;
    const sessionBank = mockChoice
      ? activeConfig.mockForms[mockChoice.form]
      : activeConfig.practiceBank;
    const nextQuestions = generateSession({
      mode,
      count,
      masteries: activeMastery,
      domains: activeConfig.domains,
      questionBank: sessionBank,
      seed,
      selectedDomains: mode === "custom" ? customDomains : undefined,
      missedIds: recentIncorrectIds,
      recentIds: activeAttempts.slice(0, 100).map((attempt) => attempt.questionId),
      seenQuestionIds: saved.seenQuestionIds[saved.activeExam],
    });
    if (!nextQuestions.length) return;
    if (mockChoice) {
      const savedWithExposure: SavedState = {
        ...saved,
        mockExposures: {
          ...saved.mockExposures,
          [saved.activeExam]: {
            ...saved.mockExposures[saved.activeExam],
            [mockChoice.form]: seed,
          },
        },
      };
      setSaved(savedWithExposure);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWithExposure));
      } catch {
        // Starting the mock remains possible even if durable browser storage is unavailable.
      }
    }
    setQuestions(nextQuestions);
    setSessionMode(mode);
    setSessionExam(saved.activeExam);
    setSessionMockForm(mockChoice?.form ?? null);
    setSessionFirstExposure(mockChoice?.firstExposure ?? false);
    setSessionId(`${seed}-${mode}`);
    setAnswers({});
    setConfidence({});
    setSecondsByQuestion({});
    setFlagged([]);
    setElapsed(0);
    setSessionStartedAt(seed);
    setCurrent(0);
    setSetupMode(null);
    setView("quiz");
    lastMoveAt.current = Date.now();
  }

  function chooseAnswer(index: number) {
    setAnswers((existing) => ({ ...existing, [current]: index }));
    if (!confidence[current]) setConfidence((existing) => ({ ...existing, [current]: "lean" }));
  }

  function moveTo(index: number) {
    recordCurrentSeconds();
    setCurrent(Math.max(0, Math.min(questions.length - 1, index)));
  }

  function finishSession() {
    if (!questions.length) return;
    const now = Date.now();
    const currentAddition = Math.max(0, Math.round((now - lastMoveAt.current) / 1000));
    const finalSecondsByQuestion = {
      ...secondsByQuestion,
      [current]: (secondsByQuestion[current] ?? 0) + currentAddition,
    };
    setSecondsByQuestion(finalSecondsByQuestion);
    lastMoveAt.current = now;
    const finalElapsed = sessionStartedAt
      ? Math.max(elapsed, Math.floor((now - sessionStartedAt) / 1000))
      : elapsed;
    const measuredTotal = Object.values(finalSecondsByQuestion).reduce((sum, seconds) => sum + seconds, 0);
    const unassignedSeconds = Math.max(0, finalElapsed - measuredTotal);
    const unansweredTimingCount = Math.max(
      1,
      questions.filter((_, index) => finalSecondsByQuestion[index] === undefined).length,
    );
    let nextMastery = { ...saved.mastery[sessionExam] };
    const nextAttempts = questions.map((question, index): Attempt => {
      const selectedIndex = answers[index] ?? -1;
      const isCorrect = selectedIndex === question.correctIndex;
      const itemConfidence = confidence[index] ?? "guess";
      const itemSeconds =
        finalSecondsByQuestion[index] ??
        Math.max(0, Math.round(unassignedSeconds / unansweredTimingCount));
      nextMastery = {
        ...nextMastery,
        [question.domainId]: updateDomainMastery(
          nextMastery[question.domainId],
          question.difficulty,
          isCorrect,
          itemConfidence,
          itemSeconds,
        ),
      };
      return {
        exam: sessionExam,
        questionId: question.id,
        catalogId: question.catalogId,
        domainId: question.domainId,
        competency: question.competency,
        stem: question.stem,
        options: question.options,
        correctIndex: question.correctIndex,
        selectedIndex,
        correct: isCorrect,
        confidence: itemConfidence,
        seconds: itemSeconds,
        difficulty: question.difficulty,
        rationale: question.rationale,
        wrongRationale: question.wrongRationales[selectedIndex] ?? "No response was recorded. An unanswered item is treated as a knowledge gap, not a neutral result.",
        framework: question.referenceFramework,
        referenceTopic: question.referenceTopic,
        challengePrompt: question.challengePrompt,
        timestamp: now,
        sessionId,
        pool: question.pool ?? "practice",
        mockForm: sessionMockForm ?? undefined,
        firstExposure: sessionMockForm ? sessionFirstExposure : undefined,
      };
    });
    const correct = nextAttempts.filter((attempt) => attempt.correct).length;
    const domainsInBlock = new Set(nextAttempts.map((attempt) => attempt.domainId));
    domainsInBlock.forEach((domainId) => {
      const domainState = nextMastery[domainId];
      const recentRate = domainState.recent.length
        ? domainState.recent.filter(Boolean).length / domainState.recent.length
        : 0;
      nextMastery = {
        ...nextMastery,
        [domainId]: {
          ...domainState,
          stableBlocks:
            domainState.recent.length >= 20 && recentRate >= 0.8
              ? domainState.stableBlocks + 1
              : 0,
        },
      };
    });
    const averageDifficulty = nextAttempts.reduce((sum, attempt) => sum + attempt.difficulty, 0) / nextAttempts.length;
    const summary: SessionSummary = {
      exam: sessionExam,
      id: sessionId,
      date: now,
      mode: sessionMode,
      score: correct,
      count: nextAttempts.length,
      seconds: finalElapsed,
      difficulty: averageDifficulty,
      mockForm: sessionMockForm ?? undefined,
      firstExposure: sessionMockForm ? sessionFirstExposure : undefined,
    };
    const practiceQuestionIds = questions
      .filter((question) => (question.pool ?? "practice") === "practice")
      .map((question) => question.id);
    setSaved((currentSaved) => ({
      ...currentSaved,
      mastery: { ...currentSaved.mastery, [sessionExam]: nextMastery },
      attempts: [...nextAttempts, ...currentSaved.attempts].slice(0, 1200),
      sessions: [summary, ...currentSaved.sessions].slice(0, 200),
      seenQuestionIds: {
        ...currentSaved.seenQuestionIds,
        [sessionExam]: [
          ...new Set([
            ...currentSaved.seenQuestionIds[sessionExam],
            ...practiceQuestionIds,
          ]),
        ].slice(-800),
      },
    }));
    setResultAttempts(nextAttempts);
    setSessionStartedAt(0);
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    setResultFilter(nextAttempts.some((attempt) => !attempt.correct) ? "incorrect" : "all");
    setView("results");
  }

  function quitSession() {
    if (answeredCount && !window.confirm("End this block? Unsubmitted answers will not update your readiness.")) return;
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    setSessionStartedAt(0);
    setQuestions([]);
    setView("study");
  }

  function navigate(next: MainView) {
    setView(next);
    setNavOpen(false);
  }

  function changeExam(exam: ExamTrack) {
    setSaved((currentSaved) => ({ ...currentSaved, activeExam: exam }));
    setCustomDomains(EXAM_CONFIGS[exam].domains.map((domain) => domain.id));
    setReviewDomain("all");
    setSetupMode(null);
    setView("study");
  }

  async function signInWithGoogle() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setCloudStatus("offline");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setCloudStatus("offline");
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setCloudStatus("offline");
  }

  if (!mounted) return <div className="app-loading"><BrainCircuit size={26} /> Calibrating your coach…</div>;

  if (view === "quiz" && currentQuestion) {
    return (
      <QuizRunner
        config={sessionConfig}
        question={currentQuestion}
        mockForm={sessionMockForm}
        index={current}
        total={questions.length}
        selected={answers[current]}
        confidence={confidence[current] ?? "lean"}
        answeredCount={answeredCount}
        flagged={flagged.includes(current)}
        remaining={remaining}
        onSelect={chooseAnswer}
        onConfidence={(value) => setConfidence((existing) => ({ ...existing, [current]: value }))}
        onMove={moveTo}
        onFlag={() => setFlagged((existing) => (existing.includes(current) ? existing.filter((value) => value !== current) : [...existing, current]))}
        onFinish={finishSession}
        onQuit={quitSession}
        onFormula={() => setShowFormulaNote(true)}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-zone">
          <button className="brand" onClick={() => navigate("study")} aria-label="ASP and CSP Coach home">
            <span className="brand-mark"><ShieldCheck size={22} /></span>
            <span><strong>{saved.activeExam}</strong><em>{"// COACH"}</em></span>
          </button>
          <label className="exam-switcher">
            <span>Preparing for</span>
            <select value={saved.activeExam} onChange={(event) => changeExam(event.target.value as ExamTrack)}>
              <option value="ASP">BCSP ASP®</option>
              <option value="CSP">BCSP CSP®</option>
            </select>
          </label>
        </div>
        <nav className={navOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          <button className={view === "study" ? "active" : ""} onClick={() => navigate("study")}><LayoutDashboard size={17} /> Study</button>
          <button className={view === "homework" ? "active" : ""} onClick={() => navigate("homework")}><BookOpenCheck size={17} /> Homework</button>
          <button className={view === "key-information" ? "active" : ""} onClick={() => navigate("key-information")}><BookOpenCheck size={17} /> Key Info</button>
          <button className={view === "library" ? "active" : ""} onClick={() => navigate("library")}><Library size={17} /> Library</button>
          <button className={view === "stats" ? "active" : ""} onClick={() => navigate("stats")}><BarChart3 size={17} /> Analytics</button>
          <button className={view === "review" ? "active" : ""} onClick={() => navigate("review")}><BookOpenCheck size={17} /> Review</button>
        </nav>
        <div className="topbar-meta">
          <span className="catalog-chip"><BrainCircuit size={15} /> {saved.seenQuestionIds[saved.activeExam].length.toLocaleString()} / 800 practice seen</span>
          {supabaseSession?.user ? (
            <div className="profile-control" title={`${typeof supabaseSession.user.user_metadata?.full_name === "string" ? supabaseSession.user.user_metadata.full_name : supabaseSession.user.email ?? "Google user"} · ${cloudStatus}`}><span>{(typeof supabaseSession.user.user_metadata?.full_name === "string" ? supabaseSession.user.user_metadata.full_name : supabaseSession.user.email ?? "GU").slice(0, 2).toUpperCase()}</span><small>{cloudStatus === "saving" ? "Saving" : cloudStatus === "synced" ? "Synced" : cloudStatus === "offline" ? "Local" : "Cloud"}</small><button type="button" onClick={() => void signOut()}>Sign out</button></div>
          ) : (
            <button type="button" className="signin-control" onClick={() => void signInWithGoogle()}><span>Sign in</span><small>Sync progress</small></button>
          )}
          <button className="menu-button" onClick={() => setNavOpen((open) => !open)} aria-label="Toggle menu"><Menu /></button>
        </div>
      </header>

      {view === "study" && (
        <StudyDashboard
          saved={saved}
          config={activeConfig}
          mastery={activeMastery}
          sessions={activeSessions}
          overall={overall}
          weakest={weakest}
          onMode={(mode) => (mode === "exam" ? startSession("exam") : setSetupMode(mode))}
          onStart={() => startSession("daily")}
          onStats={() => navigate("stats")}
        />
      )}
      {view === "stats" && <Analytics config={activeConfig} mastery={activeMastery} attempts={activeAttempts} sessions={activeSessions} mockExposures={saved.mockExposures[saved.activeExam]} overall={overall} onStudy={() => navigate("study")} />}
      {view === "homework" && <HomeworkHub progress={saved.learning} onProgress={(learning) => setSaved((currentSaved) => ({ ...currentSaved, learning }))} />}
      {view === "key-information" && <KeyInformation />}
      {view === "library" && <StudyLibrary progress={saved.learning} onProgress={(learning) => setSaved((currentSaved) => ({ ...currentSaved, learning }))} />}
      {view === "review" && (
        <Review
          attempts={activeAttempts}
          config={activeConfig}
          search={reviewSearch}
          domain={reviewDomain}
          type={reviewType}
          onSearch={setReviewSearch}
          onDomain={setReviewDomain}
          onType={setReviewType}
          onStudy={() => navigate("study")}
        />
      )}
      {view === "results" && (
        <Results
          attempts={resultAttempts}
          mode={sessionMode}
          config={sessionConfig}
          seconds={elapsed}
          filter={resultFilter}
          mastery={saved.mastery[sessionExam]}
          onFilter={setResultFilter}
          onHome={() => navigate("study")}
          onRetry={() => startSession("weakest")}
        />
      )}

      {setupMode && (
        <SessionSetup
          mode={setupMode}
          config={activeConfig}
          customDomains={customDomains}
          attempts={activeAttempts}
          mastery={activeMastery}
          onDomains={setCustomDomains}
          onClose={() => setSetupMode(null)}
          onStart={() => startSession(setupMode)}
        />
      )}
      {showFormulaNote && (
        <div className="modal-backdrop">
          <div className="modal formula-note" role="dialog" aria-modal="true">
            <button className="icon-button modal-close" onClick={() => setShowFormulaNote(false)} aria-label="Close"><X /></button>
            <span className="modal-icon"><CircleHelp /></span>
            <p className="eyebrow">Exam convention</p>
            <h2>Formula support</h2>
            <p>The official exam provides a formula when recall of the formula itself is not the objective. This coach follows the same principle: calculate from the information in the item, and flag anything you need to revisit.</p>
            <button className="primary-button full" onClick={() => setShowFormulaNote(false)}>Return to the block</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StudyDashboard({
  saved,
  config,
  mastery,
  sessions,
  overall,
  weakest,
  onMode,
  onStart,
  onStats,
}: {
  saved: SavedState;
  config: ExamConfig;
  mastery: Record<DomainId, DomainMastery>;
  sessions: SessionSummary[];
  overall: number;
  weakest: CoachDomain;
  onMode: (mode: SessionMode) => void;
  onStart: () => void;
  onStats: () => void;
}) {
  const completedToday = sessions.some((session) => new Date(session.date).toDateString() === new Date().toDateString());
  const weakestScore = readinessScore(mastery[weakest.id]);
  const level = Math.max(...config.domains.map((domain) => mastery[domain.id]?.difficulty ?? 2));
  const examLevel = level >= 4;
  const modes: SessionMode[] = ["quick", "timed", "weakest", "missed", "custom", "level", "exam"];
  const recent = sessions.slice(0, 3);
  const activeAttempts = saved.attempts.filter((attempt) => attempt.exam === config.key);
  const mockExposures = mockExposureEvents(saved.mockExposures[config.key]);
  const nextMock = chooseMockForm(mockExposures);
  const mockAUsed = mockExposures.some((session) => session.mockForm === "A");
  const mockBUsed = mockExposures.some((session) => session.mockForm === "B");
  return (
    <main>
      <section className="dashboard-hero">
        <div className="hero-inner">
          <div className="welcome-copy">
            <p className="eyebrow"><CalendarDays size={15} /> {new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</p>
            <h1>{greeting()}, <span>{saved.displayName}.</span></h1>
            <p className="hero-sub">Your weakest domain still controls today’s work. Comfort is not the objective; stable recall under pressure is.</p>
            <div className="streak-row">
              <span><Flame size={17} /> {completedToday ? "Today complete" : "Session due"}</span>
              <span><BrainCircuit size={17} /> Level {level} · {difficultyLabel(level)}</span>
              {examLevel && <span className="exam-reached"><Trophy size={17} /> {config.name} exam level reached</span>}
            </div>
          </div>
          <div className="readiness-dial" style={{ "--score": `${overall * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{overall}%</strong><span>weighted readiness</span></div>
          </div>
        </div>
      </section>

      <div className="content-grid dashboard-content">
        <section className="daily-card">
          <div className="daily-header">
            <div>
              <p className="eyebrow"><Sparkles size={15} /> Today’s prescription</p>
              <h2>One focused hour. Twenty consequential decisions.</h2>
            </div>
            <span className="duration-pill"><Clock3 size={15} /> 60 min</span>
          </div>
          <div className="session-route">
            <div><span>01</span><strong>Calibrate</strong><small>7 min · retrieval warm-up</small></div>
            <div className="route-line" />
            <div><span>02</span><strong>Pressure block</strong><small>{Math.round(config.timedSeconds / 60)} min · 20 questions</small></div>
            <div className="route-line" />
            <div><span>03</span><strong>Correct</strong><small>{60 - 7 - Math.round(config.timedSeconds / 60)} min · rationales + teach-back</small></div>
          </div>
          <div className="coach-callout">
            <div className="callout-icon"><Target size={21} /></div>
            <div>
              <span>Coach’s call</span>
              <p><strong>{weakest.name}</strong> is at {weakestScore}%. Until it clears 80% across two stable blocks, it receives extra exposure.</p>
            </div>
          </div>
          <button className="primary-button start-button" onClick={onStart}>Start adaptive session <ArrowRight size={18} /></button>
        </section>

        <aside className="readiness-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Readiness map</p><h3>{config.domains.length} {config.blueprint} domains</h3></div>
            <button className="text-button" onClick={onStats}>Full analytics</button>
          </div>
          <div className="domain-mini-list">
            {[...config.domains]
              .sort((a, b) => readinessScore(mastery[a.id]) - readinessScore(mastery[b.id]))
              .map((domain) => {
                const score = readinessScore(mastery[domain.id]);
                const status = masteryStatus(score, mastery[domain.id]?.stableBlocks ?? 0);
                return (
                  <div className="domain-mini" key={domain.id}>
                    <span className="domain-code">{domain.short}</span>
                    <div className="domain-progress"><div><strong>{domain.name}</strong><small>{Math.round(domain.weight * 100)}% blueprint</small></div><div className="meter"><i style={{ width: `${score}%` }} /></div></div>
                    <span className={`status ${status.tone}`}>{score}%</span>
                  </div>
                );
              })}
          </div>
          <div className="threshold-note"><LockKeyhole size={16} /><span><strong>Stability rule:</strong> ≥80% across two qualifying blocks, not a one-off spike.</span></div>
        </aside>
      </div>

      <section className="mode-section page-width">
        <div className="section-heading">
          <div><p className="eyebrow">Drill room</p><h2>Choose the kind of pressure</h2></div>
          <p>Rationales stay locked until every block is submitted.</p>
        </div>
        <div className="mode-grid">
          {modes.map((mode) => {
            const disabled =
              mode === "missed" &&
              !activeAttempts.some(
                (attempt) => !attempt.correct && (attempt.pool ?? "practice") === "practice",
              );
            const copy = getModeCopy(mode, config);
            const description =
              mode === "exam"
                ? nextMock.firstExposure
                  ? `Sealed Mock Form ${nextMock.form} is ready. Its questions never appear in practice drills.`
                  : `Both sealed forms have been used. Starting now repeats Form ${nextMock.form} and is no longer a clean exposure.`
                : copy.description;
            return (
              <button className={`mode-card ${mode === "exam" ? "exam-card" : ""}`} key={mode} onClick={() => !disabled && onMode(mode)} disabled={disabled}>
                <span className="mode-icon"><ModeIcon mode={mode} size={21} /></span>
                <span className="mode-copy"><small>{copy.eyebrow}</small><strong>{copy.title}</strong><em>{disabled ? "Complete a block first to unlock your error queue." : description}</em></span>
                <ArrowRight size={18} className="card-arrow" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="page-width evidence-strip">
        <div><BrainCircuit /><strong>Item-response logic</strong><span>Ability × difficulty updates after every response</span></div>
        <div><Gauge /><strong>1,200-item credential bank</strong><span>800 practice · Form A {mockAUsed ? "used" : "unseen"} · Form B {mockBUsed ? "used" : "unseen"}</span></div>
        <div><BookOpenCheck /><strong>Three reference lenses</strong><span>Yates depth · Nito drills · exam-book reasoning</span></div>
        <div><ShieldCheck /><strong>{config.blueprint} governed</strong><span>Current official domain weights, not legacy chapters</span></div>
      </section>

      {recent.length > 0 && (
        <section className="page-width recent-section">
          <div className="section-heading"><div><p className="eyebrow">Recent work</p><h2>Blocks on record</h2></div></div>
          <div className="recent-grid">
            {recent.map((session) => (
              <div className="recent-card" key={session.id}><span>{getModeCopy(session.mode, config).title}</span><strong>{Math.round((session.score / session.count) * 100)}%</strong><small>{new Date(session.date).toLocaleDateString()} · {formatTime(session.seconds)} · {difficultyLabel(Math.round(session.difficulty))}</small></div>
            ))}
          </div>
        </section>
      )}
      <Disclaimer config={config} />
    </main>
  );
}

function SessionSetup({
  mode,
  config,
  customDomains,
  attempts,
  mastery,
  onDomains,
  onClose,
  onStart,
}: {
  mode: SessionMode;
  config: ExamConfig;
  customDomains: DomainId[];
  attempts: Attempt[];
  mastery: Record<DomainId, DomainMastery>;
  onDomains: (domains: DomainId[]) => void;
  onClose: () => void;
  onStart: () => void;
}) {
  const count = mode === "exam" ? 200 : 20;
  const time = mode === "exam" ? config.examTimeLabel : mode === "timed" ? `${Math.round(config.timedSeconds / 60)} minutes` : "up to 60 minutes";
  const canStart = mode !== "custom" || customDomains.length > 0;
  const weak = [...config.domains].sort((a, b) => readinessScore(mastery[a.id]) - readinessScore(mastery[b.id])).slice(0, 2);
  const copy = getModeCopy(mode, config);
  return (
    <div className="modal-backdrop">
      <div className={`modal setup-modal ${mode === "exam" ? "wide-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="setup-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X /></button>
        <span className="modal-icon"><ModeIcon mode={mode} /></span>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="setup-title">{copy.title}</h2>
        <p className="modal-lead">{copy.description}</p>
        <div className="setup-stats">
          <div><strong>{count}</strong><span>questions</span></div>
          <div><strong>{time}</strong><span>time allowance</span></div>
          <div><strong>End only</strong><span>rationales</span></div>
        </div>
        {mode === "custom" && (
          <div className="domain-picker">
            <strong>Select domains</strong>
            {config.domains.map((domain) => {
              const checked = customDomains.includes(domain.id);
              return <label key={domain.id} aria-label={domain.name}><input aria-label={domain.name} type="checkbox" checked={checked} onChange={() => onDomains(checked ? customDomains.filter((id) => id !== domain.id) : [...customDomains, domain.id])} /><span><i>{checked && <Check size={14} />}</i><b>{domain.name}</b><small>{Math.round(domain.weight * 100)}%</small></span></label>;
            })}
          </div>
        )}
        {mode === "weakest" && (
          <div className="setup-note"><Target size={18} /><span>Your block will concentrate on <strong>{weak[0].name}</strong> and <strong>{weak[1].name}</strong>.</span></div>
        )}
        {mode === "missed" && <div className="setup-note"><History size={18} /><span>{attempts.filter((attempt) => !attempt.correct && (attempt.pool ?? "practice") === "practice").length} practice miss{attempts.filter((attempt) => !attempt.correct && (attempt.pool ?? "practice") === "practice").length === 1 ? "" : "es"} available for repair. Sealed mock items stay outside drills.</span></div>}
        {mode === "exam" && (
          <div className="exam-warning">
            <strong>This is one 200-question block.</strong>
            <p>Exact allocation: {config.domains.map((domain) => `${Math.round(domain.weight * 200)} ${domain.name}`).join(" · ")}. The clock continues during breaks.</p>
          </div>
        )}
        <div className="rationale-lock"><LockKeyhole size={17} /><span>Answers and explanations remain suppressed until submission.</span></div>
        <button className="primary-button full" disabled={!canStart} onClick={onStart}>Begin block <ArrowRight size={18} /></button>
      </div>
    </div>
  );
}

function QuizRunner({
  config,
  question,
  mockForm,
  index,
  total,
  selected,
  confidence,
  answeredCount,
  flagged,
  remaining,
  onSelect,
  onConfidence,
  onMove,
  onFlag,
  onFinish,
  onQuit,
  onFormula,
}: {
  config: ExamConfig;
  question: SessionQuestion;
  mockForm: MockForm | null;
  index: number;
  total: number;
  selected?: number;
  confidence: Confidence;
  answeredCount: number;
  flagged: boolean;
  remaining: number;
  onSelect: (index: number) => void;
  onConfidence: (value: Confidence) => void;
  onMove: (index: number) => void;
  onFlag: () => void;
  onFinish: () => void;
  onQuit: () => void;
  onFormula: () => void;
}) {
  const domain = config.domains.find((candidate) => candidate.id === question.domainId)!;
  const last = index === total - 1;
  return (
    <div className="quiz-shell">
      <header className="quiz-header">
        <button className="brand quiz-brand" onClick={onQuit}><span className="brand-mark"><ShieldCheck size={22} /></span><span><strong>{config.name}</strong><em>{"// COACH"}</em></span></button>
        <div className="quiz-progress-wrap"><div className="quiz-progress"><i style={{ width: `${((index + 1) / total) * 100}%` }} /></div><span>{answeredCount} answered · {total - answeredCount} open</span></div>
        <div className="quiz-tools"><span className={remaining < 300 ? "timer urgent" : "timer"}><Clock3 size={17} /> {formatTime(remaining)}</span><button className="quit-button" onClick={onQuit}>End block</button></div>
      </header>
      <main className="quiz-main">
        <section className="question-card">
          <div className="question-meta">
            <span className="question-number">{mockForm ? `Mock Form ${mockForm} · ` : ""}Question {index + 1} <i>/ {total}</i></span>
            <span className="domain-tag">{domain.short} · {domain.name}</span>
            <span className={`difficulty-chip d${question.difficulty}`}>{difficultyLabel(question.difficulty)}</span>
          </div>
          <h1>{question.stem}</h1>
          <div className="answers" role="radiogroup" aria-label="Answer choices">
            {question.options.map((option, optionIndex) => (
              <button key={option} role="radio" aria-checked={selected === optionIndex} className={selected === optionIndex ? "answer selected" : "answer"} onClick={() => onSelect(optionIndex)}>
                <span>{String.fromCharCode(65 + optionIndex)}</span><strong>{option}</strong>{selected === optionIndex && <Check size={18} />}
              </button>
            ))}
          </div>
          <div className="confidence-row">
            <span>Confidence</span>
            {(["guess", "lean", "sure"] as Confidence[]).map((value) => <button className={confidence === value ? "active" : ""} key={value} onClick={() => onConfidence(value)}>{value === "guess" ? "Guessing" : value === "lean" ? "Leaning" : "Certain"}</button>)}
          </div>
          <div className="suppressed-note"><LockKeyhole size={15} /> Rationale locked until the {total}-question block is submitted.</div>
        </section>
      </main>
      <footer className="quiz-footer">
        <div className="quiz-footer-left"><button className={flagged ? "tool-button flagged" : "tool-button"} onClick={onFlag}><Flag size={17} /> {flagged ? "Flagged" : "Flag"}</button><button className="tool-button" onClick={onFormula}><CircleHelp size={17} /> Formula rule</button><span className="catalog-id">Item {question.id}</span></div>
        <div className="quiz-nav"><button className="secondary-button" disabled={index === 0} onClick={() => onMove(index - 1)}><ArrowLeft size={18} /> Previous</button>{last ? <button className="primary-button" onClick={onFinish}>Submit block <Check size={18} /></button> : <button className="primary-button" onClick={() => onMove(index + 1)}>Next <ArrowRight size={18} /></button>}</div>
      </footer>
    </div>
  );
}

function Results({
  attempts,
  mode,
  config,
  seconds,
  filter,
  mastery,
  onFilter,
  onHome,
  onRetry,
}: {
  attempts: Attempt[];
  mode: SessionMode;
  config: ExamConfig;
  seconds: number;
  filter: "all" | "incorrect";
  mastery: Record<DomainId, DomainMastery>;
  onFilter: (filter: "all" | "incorrect") => void;
  onHome: () => void;
  onRetry: () => void;
}) {
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const percent = Math.round((correct / Math.max(1, attempts.length)) * 100);
  const avgSeconds = Math.round(attempts.reduce((sum, attempt) => sum + attempt.seconds, 0) / Math.max(1, attempts.length));
  const certainErrors = attempts.filter((attempt) => !attempt.correct && attempt.confidence === "sure").length;
  const examLevel = attempts.some((attempt) => attempt.difficulty >= 4);
  const mockForm = attempts[0]?.mockForm;
  const firstExposure = attempts[0]?.firstExposure;
  const shown = filter === "incorrect" ? attempts.filter((attempt) => !attempt.correct) : attempts;
  const byDomain = config.domains.map((domain) => {
    const items = attempts.filter((attempt) => attempt.domainId === domain.id);
    const score = items.length ? Math.round((items.filter((attempt) => attempt.correct).length / items.length) * 100) : 0;
    const actual = items.length / Math.max(1, attempts.length);
    return { ...domain, items, score, drift: Math.round((actual - domain.weight) * 100) };
  }).filter((domain) => domain.items.length);
  return (
    <main className="results-page">
      <section className="results-hero">
        <div className="results-title"><p className="eyebrow"><BookOpenCheck size={15} /> Block complete · rationales unlocked</p><h1>{percent >= 80 ? "Strong block. Now prove it is stable." : "The score is data. The gaps are the assignment."}</h1><p>{getModeCopy(mode, config).title}{mockForm ? ` · Mock Form ${mockForm} · ${firstExposure ? "first exposure" : "repeat exposure"}` : ""} · {attempts.length} items · {formatTime(seconds)}</p></div>
        <div className={`score-orb ${percent >= 80 ? "pass" : "needs-work"}`}><strong>{percent}%</strong><span>{correct} / {attempts.length} correct</span></div>
      </section>
      {mode === "exam" && mockForm && !firstExposure && <section className="pushback page-width"><div><strong>Mock integrity warning</strong><h2>Form {mockForm} is no longer a clean readiness measure.</h2><p>You have seen this sealed form before. Use the result for learning, but do not compare it with a first-exposure mock score.</p></div><LockKeyhole size={42} /></section>}
      <section className="result-metrics page-width">
        <div><Clock3 /><span>Average pace</span><strong>{avgSeconds}s</strong><small>Target: {config.paceSeconds}s or less</small></div>
        <div><BrainCircuit /><span>Difficulty reached</span><strong>{difficultyLabel(Math.max(...attempts.map((attempt) => attempt.difficulty)))}</strong><small>{examLevel ? `${config.name} exam-level items were active` : "Keep building toward level 4"}</small></div>
        <div className={certainErrors ? "metric-alert" : ""}><Target /><span>Confident errors</span><strong>{certainErrors}</strong><small>{certainErrors ? "High-priority misconceptions" : "No false certainty detected"}</small></div>
        <div><Gauge /><span>Weighted readiness</span><strong>{overallReadiness(mastery, config.domains)}%</strong><small>80% stability target</small></div>
      </section>
      {certainErrors > 0 && <section className="pushback page-width"><div><strong>Coach pushback</strong><h2>You were certain and wrong {certainErrors} time{certainErrors === 1 ? "" : "s"}.</h2><p>That is not a careless miss; it is a false model. Do not memorize the keyed choice. Explain why each distractor fails before you retest.</p></div><BrainCircuit size={42} /></section>}
      <section className="page-width domain-results">
        <div className="section-heading"><div><p className="eyebrow">Post-assessment analytics</p><h2>Performance and domain drift</h2></div><p>Drift compares this block’s share with the official blueprint.</p></div>
        <div className="domain-result-table">
          <div className="table-head"><span>Domain</span><span>Score</span><span>Items</span><span>Drift</span><span>Readiness</span></div>
          {byDomain.map((domain) => <div className="table-row" key={domain.id}><span><i>{domain.short}</i><strong>{domain.name}</strong></span><span className={domain.score >= 80 ? "positive" : "negative"}>{domain.score}%</span><span>{domain.items.length}</span><span className={Math.abs(domain.drift) <= 2 ? "neutral" : domain.drift > 0 ? "positive" : "negative"}>{domain.drift > 0 ? "+" : ""}{domain.drift} pp</span><span>{readinessScore(mastery[domain.id])}%</span></div>)}
        </div>
      </section>
      <section className="page-width rationale-section">
        <div className="section-heading rationale-heading"><div><p className="eyebrow">Rationale block</p><h2>Interrogate every miss</h2></div><div className="segmented"><button className={filter === "incorrect" ? "active" : ""} onClick={() => onFilter("incorrect")}>Incorrect ({attempts.length - correct})</button><button className={filter === "all" ? "active" : ""} onClick={() => onFilter("all")}>All ({attempts.length})</button></div></div>
        {shown.length === 0 ? <div className="empty-state"><Trophy /><h3>No incorrect responses in this block.</h3><p>Do not coast: repeat at a higher difficulty and preserve accuracy.</p></div> : <div className="rationale-list">{shown.map((attempt, index) => <RationaleCard key={`${attempt.questionId}-${index}`} attempt={attempt} index={attempts.indexOf(attempt) + 1} domains={config.domains} />)}</div>}
      </section>
      <div className="results-actions page-width"><button className="secondary-button" onClick={onHome}>Return to dashboard</button><button className="primary-button" onClick={onRetry}>Attack weakest domains <ArrowRight size={18} /></button></div>
      <Disclaimer config={config} />
    </main>
  );
}

function RationaleCard({ attempt, index, domains }: { attempt: Attempt; index: number; domains: readonly CoachDomain[] }) {
  const [open, setOpen] = useState(!attempt.correct);
  const domain = domains.find((candidate) => candidate.id === attempt.domainId)!;
  return (
    <article className={`rationale-card ${attempt.correct ? "correct" : "incorrect"}`}>
      <button className="rationale-summary" onClick={() => setOpen((value) => !value)}>
        <span className="result-marker">{attempt.correct ? <Check /> : <X />}</span>
        <span><small>Question {index} · {domain.short} · Level {attempt.difficulty}</small><strong>{attempt.stem}</strong></span>
        <span className="answer-summary"><small>Your answer</small><b>{attempt.selectedIndex >= 0 ? String.fromCharCode(65 + attempt.selectedIndex) : "—"}</b></span>
        <ChevronDown className={open ? "rotated" : ""} />
      </button>
      {open && <div className="rationale-body">
        <div className="answer-comparison"><div className={attempt.correct ? "answer-box right" : "answer-box wrong"}><span>You chose {attempt.selectedIndex >= 0 ? String.fromCharCode(65 + attempt.selectedIndex) : "no answer"}</span><strong>{attempt.selectedIndex >= 0 ? attempt.options[attempt.selectedIndex] : "Unanswered"}</strong></div><div className="answer-box right"><span>Best answer {String.fromCharCode(65 + attempt.correctIndex)}</span><strong>{attempt.options[attempt.correctIndex]}</strong></div></div>
        {!attempt.correct && <div className="why-wrong"><strong>Why your response fails</strong><p>{attempt.wrongRationale}</p></div>}
        <div className="why-right"><strong>Decision rationale</strong><p>{attempt.rationale}</p></div>
        {!attempt.correct && <div className="teachback"><BrainCircuit size={19} /><div><strong>Earn the correction</strong><p>{attempt.challengePrompt}</p></div></div>}
        <div className="reference-line"><BookOpenCheck size={15} /><span><strong>{attempt.framework}</strong> framework · {attempt.referenceTopic}</span><span>{difficultyLabel(attempt.difficulty)}</span></div>
      </div>}
    </article>
  );
}

function Analytics({ config, mastery, attempts, sessions, mockExposures, overall, onStudy }: { config: ExamConfig; mastery: Record<DomainId, DomainMastery>; attempts: Attempt[]; sessions: SessionSummary[]; mockExposures: Partial<Record<MockForm, number>>; overall: number; onStudy: () => void }) {
  const total = attempts.length;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const avg = total ? Math.round((correct / total) * 100) : 0;
  const avgPace = total ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.seconds, 0) / total) : 0;
  const stable = config.domains.filter((domain) => readinessScore(mastery[domain.id]) >= 80 && (mastery[domain.id]?.stableBlocks ?? 0) >= 2).length;
  const recentSessions = [...sessions].slice(0, 8).reverse();
  const mockAStatus = mockExposures.A ? "used" : "unseen";
  const mockBStatus = mockExposures.B ? "used" : "unseen";
  const chartMax = Math.max(1, ...recentSessions.map((session) => Math.round((session.score / session.count) * 100)));
  return (
    <main className="analytics-page">
      <section className="page-title page-width"><div><p className="eyebrow"><BarChart3 size={15} /> {config.name} readiness intelligence</p><h1>Evidence, not optimism.</h1><p>Performance is weighted to {config.blueprint} and stability requires repeated success above 80%.</p></div><button className="primary-button" onClick={onStudy}>Start today’s session <ArrowRight size={18} /></button></section>
      <section className="analytics-kpis page-width">
        <div className="hero-kpi"><span>Weighted readiness</span><strong>{overall}%</strong><div className="meter large"><i style={{ width: `${overall}%` }} /></div><small>{overall >= 80 && stable === config.domains.length ? "Exam-day threshold met" : `${config.domains.length - stable} domain${config.domains.length - stable === 1 ? "" : "s"} still need stable evidence`}</small></div>
        <div><span>Answered</span><strong>{total.toLocaleString()}</strong><small>across {sessions.length} blocks</small></div>
        <div><span>Raw accuracy</span><strong>{avg}%</strong><small>IRT adjusts for difficulty</small></div>
        <div><span>Average pace</span><strong>{avgPace || "—"}{avgPace ? "s" : ""}</strong><small>{config.paceSeconds}s exam target</small></div>
        <div><span>Stable domains</span><strong>{stable} / {config.domains.length}</strong><small>two qualifying blocks each</small></div>
      </section>
      <section className="analytics-layout page-width">
        <div className="analytics-card domain-detail-card">
          <div className="panel-heading"><div><p className="eyebrow">Domain control</p><h2>{config.blueprint} readiness matrix</h2></div><span className="subtle">80% threshold</span></div>
          <div className="domain-detail-list">
            {config.domains.map((domain) => {
              const state = mastery[domain.id];
              const score = readinessScore(state);
              const status = masteryStatus(score, state.stableBlocks);
              return <div className="domain-detail" key={domain.id}><span className="domain-code">{domain.short}</span><div><strong>{domain.name}</strong><small>{state.answered} answered · {state.correct} correct · target level {state.difficulty}</small><div className="meter threshold-meter"><i style={{ width: `${score}%` }} /><b /></div></div><span className={`status ${status.tone}`}>{status.label}</span><b>{score}%</b></div>;
            })}
          </div>
        </div>
        <div className="analytics-card trend-card">
          <div className="panel-heading"><div><p className="eyebrow">Trend</p><h2>Recent block scores</h2></div></div>
          {recentSessions.length ? <div className="bar-chart">{recentSessions.map((session) => { const value = Math.round((session.score / session.count) * 100); return <div className="bar-column" key={session.id}><span>{value}%</span><i style={{ height: `${Math.max(8, (value / chartMax) * 150)}px` }} /><small>{new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</small></div>; })}<div className="target-line"><span>80%</span></div></div> : <div className="empty-small"><BarChart3 /><p>Your score trend appears after the first block.</p></div>}
          <div className="analytics-rule"><BrainCircuit size={18} /><p><strong>IRT logic:</strong> a difficult correct answer moves ability more than an easy one. A confident miss exposes a misconception and receives priority.</p></div>
        </div>
      </section>
      <section className="page-width blueprint-card">
        <div><p className="eyebrow">Simulation governor</p><h2>Official 200-item allocation</h2><p>{config.blueprint} has {config.domains.length} domains. “11” is the blueprint version, not the number of competencies. Sealed forms: A {mockAStatus} · B {mockBStatus}.</p></div>
        <div className="allocation-bar">{config.domains.map((domain) => <span key={domain.id} style={{ width: `${domain.weight * 100}%`, background: domain.color }} title={`${domain.name}: ${domain.weight * 100}%`}><i>{Math.round(domain.weight * 200)}</i></span>)}</div>
        <div className="allocation-legend">{config.domains.map((domain) => <span key={domain.id}><i style={{ background: domain.color }} />{domain.short} {Math.round(domain.weight * 100)}%</span>)}</div>
      </section>
      <Disclaimer config={config} />
    </main>
  );
}

function Review({
  attempts,
  config,
  search,
  domain,
  type,
  onSearch,
  onDomain,
  onType,
  onStudy,
}: {
  attempts: Attempt[];
  config: ExamConfig;
  search: string;
  domain: DomainId | "all";
  type: "all" | "correct" | "incorrect";
  onSearch: (value: string) => void;
  onDomain: (value: DomainId | "all") => void;
  onType: (value: "all" | "correct" | "incorrect") => void;
  onStudy: () => void;
}) {
  const filtered = attempts.filter((attempt) => {
    if (domain !== "all" && attempt.domainId !== domain) return false;
    if (type === "correct" && !attempt.correct) return false;
    if (type === "incorrect" && attempt.correct) return false;
    return !search || `${attempt.stem} ${attempt.competency}`.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <main className="review-page">
      <section className="page-title page-width"><div><p className="eyebrow"><BookOpenCheck size={15} /> Evidence archive</p><h1>Review what you actually decided.</h1><p>Search every submitted response. Rationales remain tied to the exact answer and confidence you recorded.</p></div><button className="primary-button" onClick={onStudy}>New adaptive block <ArrowRight size={18} /></button></section>
      <section className="review-counts page-width"><button className={type === "all" ? "active" : ""} onClick={() => onType("all")}><strong>{attempts.length}</strong><span>All attempts</span></button><button className={type === "incorrect" ? "active" : ""} onClick={() => onType("incorrect")}><strong>{attempts.filter((attempt) => !attempt.correct).length}</strong><span>Incorrect</span></button><button className={type === "correct" ? "active" : ""} onClick={() => onType("correct")}><strong>{attempts.filter((attempt) => attempt.correct).length}</strong><span>Correct</span></button></section>
      <section className="review-tools page-width"><label><Search size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search question or competency" /></label><select value={domain} onChange={(event) => onDomain(event.target.value as DomainId | "all")} aria-label="Filter by domain"><option value="all">All {config.blueprint} domains</option>{config.domains.map((item) => <option key={item.id} value={item.id}>{item.short} · {item.name}</option>)}</select></section>
      <section className="page-width review-list">
        {filtered.length ? filtered.map((attempt, index) => <RationaleCard key={`${attempt.sessionId}-${attempt.questionId}-${index}`} attempt={attempt} index={attempts.indexOf(attempt) + 1} domains={config.domains} />) : <div className="empty-state"><Search /><h3>No matching attempts.</h3><p>Adjust the filters or complete a study block to build your evidence archive.</p></div>}
      </section>
      <Disclaimer config={config} />
    </main>
  );
}

function Disclaimer({ config }: { config: ExamConfig }) {
  return (
    <footer className="disclaimer page-width">
      <div className="disclaimer-copy">
        <ShieldCheck size={17} />
        <p><strong>Original, unofficial practice.</strong> Built around the public {config.blueprint} blueprint and the supplied reference frameworks. Not affiliated with, endorsed by, or composed from BCSP or Pocket Prep exam items; these items are not psychometrically calibrated. The 80% mark is this coach’s conservative readiness standard, not BCSP’s passing score.</p>
      </div>
      <div className="creator-credit">
        <span>Created by <strong>Abdelrahman Basry</strong></span>
        <a
          className="coffee-link"
          href="https://ipn.eg/S/abdelrahmanbasryyyy/instapay/3mEaA3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buy Abdelrahman Basry a coffee using InstaPay"
        >
          <Coffee size={16} />
          <span>Buy me a coffee</span>
          <small>via InstaPay</small>
        </a>
      </div>
    </footer>
  );
}
