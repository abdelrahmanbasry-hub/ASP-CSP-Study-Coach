import { CHAPTERS, HOMEWORK_QUESTIONS, type HomeworkChapter } from "./homeworkData.ts";
import { KEY_INFORMATION } from "./keyInformationData.ts";
import { AUTHORED_PRACTICE_01_13 } from "./authoredPractice01to13.ts";
import { AUTHORED_PRACTICE_14_TO_26 } from "./authoredPractice14to26.ts";
import { AUTHORED_PRACTICE_27_TO_39 } from "./authoredPractice27to39.ts";

export type PracticeLevel = "foundation" | "homework-level" | "application";
export type PracticeQuestion = {
  id: string;
  chapterId: string;
  level: PracticeLevel;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

type Prompt = {
  answer: string;
  stem: string;
};

type AuthoredQuestion = Omit<PracticeQuestion, "chapterId" | "id">;

const AUTHORED_PRACTICE: Readonly<Record<string, readonly AuthoredQuestion[]>> = {
  ...AUTHORED_PRACTICE_01_13,
  ...AUTHORED_PRACTICE_14_TO_26,
  "ch-38": [
    {
      level: "foundation",
      stem: "What is the central safety purpose of a management-of-change (MoC) system?",
      options: [
        "To ensure changes do not introduce new hazards or increase existing risk.",
        "To require approval only for capital projects above a preset cost.",
        "To return every process to its pre-change condition after implementation.",
        "To replace all operating procedures with a single organization-wide rule.",
      ],
      correctIndex: 0,
      explanation: "Start with the purpose of MoC: a change can create a new hazard or worsen an existing one. MoC is the systematic process used to identify and control that risk before implementation.",
    },
    {
      level: "homework-level",
      stem: "A covered process will receive a different pump that has the same specifications and performs the same function as the current pump. Under OSHA PSM, how is this most directly treated?",
      options: [
        "As an automatic process change requiring a new hazard analysis.",
        "As a replacement in kind, which is the stated exception to the MoC change procedures.",
        "As an emergency change that may be implemented without documentation.",
        "As a change controlled only by EPA’s Risk Management Rule.",
      ],
      correctIndex: 1,
      explanation: "First determine whether the item is a replacement in kind. OSHA PSM 29 CFR 1910.119(l) requires written MoC procedures for covered changes, but specifically excepts replacements in kind.",
    },
    {
      level: "application",
      stem: "Before changing a production process, which action best establishes the working framework for the proposed change?",
      options: [
        "Let each department choose its own implementation date after the change is made.",
        "Limit communication so employees do not resist the change.",
        "Have key stakeholders develop a detailed action plan before implementation.",
        "Evaluate success only after a failure or near miss occurs.",
      ],
      correctIndex: 2,
      explanation: "The source calls for a team of key stakeholders to develop a detailed action plan before implementation. That plan establishes the framework, responsibilities, and controls for the proposed change.",
    },
    {
      level: "application",
      stem: "A company completed a technical change, but employees gradually returned to the old work method. Which MoC follow-up was missed?",
      options: [
        "Embedding the change and its value into the organization’s culture and practices.",
        "Classifying every change as a replacement in kind.",
        "Eliminating communication after implementation.",
        "Using only financial approval to determine the change level.",
      ],
      correctIndex: 0,
      explanation: "A change can revert when leaders do not reinforce it. MoC requires leaders to embed the change and its value in everyday culture and practice.",
    },
  ],
  "ch-39": [
    {
      level: "foundation",
      stem: "Which sequence names the core phases of an emergency management system?",
      options: [
        "Prevention, mitigation, preparedness, response, and recovery.",
        "Inspection, citation, abatement, appeal, and closure.",
        "Recognition, calibration, sampling, analysis, and reporting.",
        "Planning, procurement, production, marketing, and disposal.",
      ],
      correctIndex: 0,
      explanation: "Emergency management is broader than response alone. The source identifies five phases: prevention, mitigation, preparedness, response, and recovery.",
    },
    {
      level: "homework-level",
      stem: "A tornado watch has been issued for the county where a facility operates. What does that alert mean?",
      options: [
        "A tornado has been sighted locally and immediate shelter is required.",
        "Conditions exist in which tornadoes may strike; people should be prepared to take shelter.",
        "The facility’s Emergency Action Plan is no longer needed.",
        "Only emergency responders need to take action.",
      ],
      correctIndex: 1,
      explanation: "Distinguish a watch from a warning. A watch means conditions are favorable and people should be prepared; a warning means a tornado has been sighted and immediate shelter is required.",
    },
    {
      level: "application",
      stem: "During a telephone bomb threat, what is the safest source-supported first response?",
      options: [
        "End the call immediately and wait for law enforcement to obtain details.",
        "Argue with the caller to obtain a motive.",
        "Remain calm, keep the caller talking, and record details and background sounds.",
        "Announce the threat over the public-address system before gathering information.",
      ],
      correctIndex: 2,
      explanation: "Do not hang up. The source directs the recipient to remain calm, encourage the caller to talk, take detailed notes, and listen for background noises and identifying details.",
    },
    {
      level: "application",
      stem: "Which item is a required component of a business continuity plan, rather than merely an immediate evacuation action?",
      options: [
        "Backup systems and redundancies.",
        "A verbal instruction to leave the building.",
        "A monthly visual extinguisher inspection.",
        "A personal fall-arrest inspection.",
      ],
      correctIndex: 0,
      explanation: "Business continuity plans address the organization’s ability to continue or recover operations. The source lists backup systems and redundancies, disaster recovery, IT infrastructure, crisis management, and the EAP.",
    },
  ],
  ...AUTHORED_PRACTICE_27_TO_39,
};

const FALLBACK_DISTRACTORS: Record<PracticeLevel, readonly string[]> = {
  foundation: [
    "It is only a matter of personal preference, so no defined principle applies.",
    "It can always be ignored when the task seems routine.",
    "It is interchangeable with any related term, without checking the distinction.",
  ],
  "homework-level": [
    "Use the most convenient approach first; the governing condition does not matter.",
    "Treat one familiar fact as enough, without applying the chapter's stated criteria.",
    "Substitute a broad rule of thumb for the specific term or requirement being tested.",
  ],
  application: [
    "Wait for an incident to show that the requirement mattered before acting on it.",
    "Choose the option that is easiest to implement, even if it omits the controlling condition.",
    "Assume a similar-looking situation has the same answer without checking the chapter's qualifiers.",
  ],
};

function sourcePointsForChapter(chapter: HomeworkChapter): string[] {
  const source = KEY_INFORMATION.find((item) => item.chapter === chapter.yatesChapterNumber)?.points;
  if (source?.length) return [...source];

  const tags = HOMEWORK_QUESTIONS
    .filter((item) => item.chapterId === chapter.id)
    .flatMap((item) => item.tags)
    .filter((tag, index, all) => all.indexOf(tag) === index);

  return tags.length
    ? tags.map((tag) => "Apply the chapter concept of " + tag.replaceAll("-", " ") + " to the facts given.")
    : ["Apply the controlling safety principle for " + chapter.courseTitle + " to the facts given."];
}

function levelFor(index: number, count: number): PracticeLevel {
  if (index < Math.ceil(count / 3)) return "foundation";
  if (index < Math.ceil((count * 2) / 3)) return "homework-level";
  return "application";
}

function answerPosition(seed: string): number {
  return Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0) % 4;
}

function clozePrompt(point: string, chapter: Pick<HomeworkChapter, "courseTitle">, level: PracticeLevel, index: number): Prompt {
  const words = point.replace(/\.$/, "").split(/\s+/);
  const splitAt = Math.max(2, Math.min(words.length - 1, Math.ceil(words.length * 0.45)));
  const lead = words.slice(0, splitAt).join(" ");
  const completion = words.slice(splitAt).join(" ");
  const stems = level === "foundation"
    ? ["Complete this chapter statement: " + lead + " …", "Which completion preserves the source meaning of: " + lead + " …"]
    : level === "homework-level"
      ? ["A problem in " + chapter.courseTitle + " depends on this point. Complete it accurately: " + lead + " …", "Which completion retains the required qualifier in: " + lead + " …"]
      : ["A decision depends on the complete statement, not a shortcut. Select the supported completion: " + lead + " …", "In a " + chapter.courseTitle + " review, which completion preserves this requirement: " + lead + " …"];

  return { answer: completion, stem: stems[index % stems.length] };
}

function promptForPoint(point: string, chapter: Pick<HomeworkChapter, "courseTitle">, level: PracticeLevel, index: number): Prompt {
  const cause = point.match(/^(.+?) (can cause|causes|can lead to (?:the )?development of) (.+?)\.?$/i);
  if (cause) {
    const subject = cause[1];
    const outcome = cause[3];
    const stems = level === "foundation"
      ? ["Which health outcome is associated with " + subject + "?", "Exposure to " + subject + " is a concern for which health outcome?"]
      : level === "homework-level"
        ? ["A worker may be exposed to " + subject + ". Which outcome should be considered?", "During a hazard review, which outcome should be considered for exposure to " + subject + "?"]
        : ["A control plan is being prepared for " + subject + ". Which potential health outcome belongs in the risk assessment?", "A crew may encounter " + subject + ". Which health effect belongs in its exposure assessment?"];
    return { answer: outcome, stem: stems[index % stems.length] };
  }

  const equation = point.match(/^(.+?)\s*=\s*(.+?)\.?$/);
  if (equation) {
    return {
      answer: equation[2],
      stem: "Which value or expression correctly completes " + equation[1] + " = ___?",
    };
  }

  const definition = point.match(/^(.+?) (is|are|means|involves|uses|has|refers to) (.+?)\.?$/i);
  if (definition) {
    const subject = definition[1];
    const predicate = definition[2] + " " + definition[3];
    const stems = [
      "Which statement correctly completes this description: " + subject + " ...?",
      "A learner is defining " + subject + ". Which completion is accurate?",
      "Which chapter-supported description applies to " + subject + "?",
    ];
    return { answer: predicate, stem: stems[index % stems.length] };
  }

  return clozePrompt(point, chapter, level, index);
}

function isUsablePoint(point: string): boolean {
  const cause = point.match(/^(.+?) (can cause|causes|can lead to (?:the )?development of) (.+?)\.?$/i);
  return !cause || !cause[1].toLowerCase().includes(cause[3].toLowerCase());
}

function distractorsFor(points: readonly string[], index: number, level: PracticeLevel, prompt: Prompt): string[] {
  const alternatives = points
    .map((point, candidateIndex) => ({ prompt: promptForPoint(point, { courseTitle: "" }, level, candidateIndex), candidateIndex }))
    .filter((candidate) => candidate.candidateIndex !== index && candidate.prompt.answer !== prompt.answer)
    .sort((left, right) => ((left.candidateIndex - index + points.length) % points.length) - ((right.candidateIndex - index + points.length) % points.length))
    .map((candidate) => candidate.prompt.answer);

  return [...alternatives, ...FALLBACK_DISTRACTORS[level]].filter((option, optionIndex, all) => all.indexOf(option) === optionIndex).slice(0, 3);
}

function explanation(chapter: HomeworkChapter, point: string, level: PracticeLevel): string {
  if (level === "foundation") {
    return "Begin by recalling the defined concept or fact from " + chapter.courseTitle + ". The source-backed point is: " + point;
  }
  if (level === "homework-level") {
    return "First identify the controlling term, condition, or relationship in the problem. Then compare the choices against the chapter material. The applicable point is: " + point;
  }
  return "Treat the situation as an application of the chapter's actual qualifiers, not a general preference. The decision should be grounded in: " + point;
}

function makeQuestions(chapter: HomeworkChapter): PracticeQuestion[] {
  const authored = AUTHORED_PRACTICE[chapter.id];
  if (!authored) return [];
  return authored.map((question, index) => ({
    ...question,
    id: "PQ-" + chapter.id.toUpperCase() + "-" + String(index + 1).padStart(2, "0"),
    chapterId: chapter.id,
  }));
}

// These former generator helpers remain isolated during the authored-content
// migration and are deliberately not invoked by the practice catalog.
void [sourcePointsForChapter, levelFor, answerPosition, isUsablePoint, distractorsFor, explanation];

function stableIdHash(value: string): number {
  return Array.from(value).reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7);
}

function balanceAnswerPositions(questions: readonly PracticeQuestion[]): readonly PracticeQuestion[] {
  const targetPosition = new Map(
    [...questions]
      .sort((left, right) => stableIdHash(left.id) - stableIdHash(right.id))
      .map((question, index) => [question.id, index % 4]),
  );

  return questions.map((question) => {
    const correctPosition = targetPosition.get(question.id);
    if (correctPosition === undefined || correctPosition === question.correctIndex) return question;
    const options = [...question.options];
    const [correctAnswer] = options.splice(question.correctIndex, 1);
    options.splice(correctPosition, 0, correctAnswer);
    return { ...question, options: options as [string, string, string, string], correctIndex: correctPosition };
  });
}

export const PRACTICE_QUESTIONS: readonly PracticeQuestion[] = balanceAnswerPositions(CHAPTERS.flatMap(makeQuestions));

export function practiceQuestionsForChapter(chapterId: string): readonly PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((question) => question.chapterId === chapterId);
}

function validatePracticeQuestions(): void {
  const ids = new Set<string>();
  for (const [chapterId] of Object.entries(AUTHORED_PRACTICE)) {
    const questions = practiceQuestionsForChapter(chapterId);
    if (!questions.length) throw new Error(chapterId + " must have practice questions.");
    if (new Set(questions.map((question) => question.stem + question.options[question.correctIndex])).size !== questions.length) {
      throw new Error(chapterId + " contains duplicate practice questions.");
    }
  }
  for (const question of PRACTICE_QUESTIONS) {
    if (ids.has(question.id) || new Set(question.options).size !== 4 || !question.explanation.trim()) {
      throw new Error("Invalid practice question " + question.id);
    }
    ids.add(question.id);
  }
}
validatePracticeQuestions();
