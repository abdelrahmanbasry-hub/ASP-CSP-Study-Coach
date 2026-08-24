/**
 * Deterministically generated, original ASP11 practice and mock content.
 *
 * The public ASP11 domain map controls distribution. Yates, Nito, the
 * ASP/CSP Exam Book, and the BCSP Blueprint are used only as structural
 * topic/formula lenses; no source item wording is reproduced.
 */

import type { ASPQuestion } from "./aspQuestionBankA";
import { buildA1CalculationDraft } from "./aspMathQuestionCatalog.ts";

export type QuestionPool = "practice" | "mock-a" | "mock-b";
export type PooledASPQuestion = ASPQuestion & {
  pool: QuestionPool;
  scenarioFamily: string;
  /** Stable formula-library identity for generated mathematical-calculation items. */
  formulaId?: string;
  /** Stable formula-library category; unlike referenceTopic, this is not presentation text. */
  formulaCategory?: string;
  /** Stable scenario/formula family used to measure substantive breadth. */
  formulaFamily?: string;
  /** ASP11 Mathematical Calculations blueprint objective (A1.1 through A1.16). */
  blueprintObjective?: string;
};

type DomainId = ASPQuestion["domainId"];
type Difficulty = ASPQuestion["difficulty"];
type Framework = ASPQuestion["referenceFramework"];
type OptionIndex = ASPQuestion["correctIndex"];

type Answer = Readonly<{
  text: string;
  rationale: string;
}>;

type Draft = Readonly<{
  competency: string;
  objective: string;
  difficulty: Difficulty;
  stem: string;
  correct: Answer;
  distractors: readonly [Answer, Answer, Answer];
  referenceTopic: string;
  challengePrompt: string;
  referenceFramework?: Framework;
  formulaId?: string;
  formulaCategory?: string;
  formulaFamily?: string;
  blueprintObjective?: string;
}>;

const DOMAIN_ORDER = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"] as const;

const PRACTICE_COUNTS: Readonly<Record<DomainId, number>> = {
  A1: 60,
  A2: 150,
  A3: 48,
  A4: 72,
  A5: 60,
  A6: 72,
  A7: 42,
  A8: 66,
  A9: 30,
};

const MOCK_COUNTS: Readonly<Record<DomainId, number>> = {
  A1: 20,
  A2: 50,
  A3: 16,
  A4: 24,
  A5: 20,
  A6: 24,
  A7: 14,
  A8: 22,
  A9: 10,
};

const FRAMEWORKS = ["Yates", "Nito", "ASP/CSP Exam Book", "BCSP Blueprint"] as const satisfies readonly Framework[];

const SITES = {
  practice: [
    "the coached Meridian fabrication lab",
    "the Harborview maintenance workshop",
    "the Cedar Point utilities building",
    "the Summit packaging pilot line",
    "the Lakeside distribution training floor",
    "the Redstone materials demonstration plant",
    "the Pine Valley assembly school",
    "the Eastgate process-learning center",
  ],
  "mock-a": [
    "North River Components",
    "Atlas Cold Storage",
    "Beacon Specialty Metals",
    "Granite Ridge Foods",
    "Orion Transit Works",
    "Juniper Polymer Systems",
    "Keystone Medical Devices",
    "Westhaven Paper Products",
  ],
  "mock-b": [
    "Coastal Ridge Processing",
    "Blue Mesa Energy Services",
    "Ironwood Logistics",
    "Silver Creek Electronics",
    "Canyon Forge Equipment",
    "Prairie Star Nutrition",
    "Clearwater Composite Works",
    "Highland Research Manufacturing",
  ],
} as const;

const POOL_LEADS: Readonly<Record<QuestionPool, string>> = {
  practice: "During a guided analysis",
  "mock-a": "During an unannounced field assessment",
  "mock-b": "During a pre-startup assurance review",
};

const SUBJECTS: Readonly<Record<DomainId, readonly string[]>> = {
  A1: ["a pump station", "a lifting bay", "a sampling route", "a tank farm", "a ventilation branch", "a shielding enclosure", "a loading platform", "a reliability test stand"],
  A2: ["a transfer skid", "an automated press cell", "a contractor outage", "a robotic palletizer", "a solvent-cleaning line", "a mobile-equipment route", "a batch reactor", "a maintenance planning board"],
  A3: ["a packing bench", "a powered-tool station", "a manual-pick aisle", "a seated inspection cell", "a control console", "a lift-assist area", "a repetitive assembly task", "a rotating-shift workstation"],
  A4: ["a high-piled storage zone", "a flammable-liquid room", "a battery charging area", "a powder collector", "a rated corridor", "a fire-pump room", "a spray-finishing booth", "a cable service chase"],
  A5: ["an evacuation sector", "a chemical release boundary", "an emergency operations room", "a remote work camp", "a flood-exposed utility", "a shelter-in-place zone", "a response equipment cache", "a business recovery team"],
  A6: ["a mixing operator group", "a welding enclosure", "a coating booth", "a hot-process crew", "a laboratory sampling task", "a powder-bagging line", "a compressor room", "an outdoor maintenance crew"],
  A7: ["a wastewater treatment step", "a stormwater outfall", "a hazardous-waste area", "a coating material flow", "a bulk-oil transfer", "a supplier lifecycle review", "an air-emission source", "a recycling segregation point"],
  A8: ["an energy-control course", "a supervisor coaching program", "a multilingual orientation", "a simulator exercise", "a qualification matrix", "a field demonstration", "a microlearning module", "a train-the-trainer session"],
  A9: ["an incident evidence file", "a contractor agreement", "an exposure report", "a professional review", "a records-retention decision", "an ethics escalation", "a due-diligence inquiry", "a confidential worker restriction"],
};

const EVIDENCE_STATES = [
  "under degraded-barrier evidence",
  "with a changed-task boundary",
  "during representative peak exposure",
  "with an unresolved shared dependency",
  "after a nonroutine operating transition",
  "with field verification still pending",
  "under a credible single-failure condition",
  "with contractor and host interfaces active",
  "during a high-consequence low-frequency scenario",
  "with measurement uncertainty explicitly bounded",
  "after control performance has drifted",
  "with an accessibility constraint present",
  "under simultaneous operations",
] as const;

const REVIEW_PHASES = [
  "during pre-task authorization",
  "during routine assurance sampling",
  "before restart after maintenance",
  "during a change-control review",
  "during contractor mobilization",
  "after a leading-indicator trigger",
  "during annual program verification",
  "before a high-hazard task",
  "during corrective-action validation",
  "during a shift-handoff review",
  "after an equipment modification",
  "during field competency verification",
] as const;

const WRONG_EXTENSIONS_BY_DOMAIN: Readonly<Record<DomainId, readonly string[]>> = {
  A1: [
    "use a different denominator without changing the stated basis",
    "round an intermediate value before completing the calculation",
    "omit the unit conversion required by the prompt",
    "reverse the numerator and denominator in the stated relationship",
    "apply only one of the two stated correction factors",
    "treat a rate as though it were a total quantity",
  ],
  A2: [
    "use supervisor sign-off as the effectiveness evidence",
    "track completion counts instead of field performance",
    "retain the current method until the next scheduled outage",
    "rely on worker vigilance when operating conditions change",
    "use the latest favorable outcome as the decision basis",
    "wait for a recordable event before addressing the precursor",
    "apply the same response across unlike tasks",
    "close the action after the next toolbox talk",
    "leave host-contractor interface ownership undefined",
    "use vendor documentation instead of local verification",
    "transfer responsibility without changing the exposure",
    "treat a written procedure as proof of field implementation",
  ],
  A3: [
    "rotate workers without changing task demand",
    "treat one worker's preference as the full design basis",
    "use discomfort reports without exposure observation",
    "retain the reach and force while adding another reminder",
    "select the average user and omit accommodation at the tails",
    "treat task speed as proof of acceptable ergonomic demand",
    "move the load to a different body region without evaluating transfer",
    "delay redesign until an injury is recorded",
  ],
  A4: [
    "treat housekeeping completion as proof of explosion control",
    "rely on portable extinguishers as the primary prevention measure",
    "leave fuel and ignition pathways unchanged until the next audit",
    "credit detection without evaluating suppression or safe egress",
    "use ordinary burning behavior to dismiss a credible deflagration",
    "accept equipment listing without verifying the installation",
    "close the action when hardware is purchased rather than commissioned",
    "use one favorable inspection as permanent assurance",
  ],
  A5: [
    "treat plan approval as evidence that response capability works",
    "rely on a single communication channel during the emergency",
    "assume mutual-aid resources without testing access or compatibility",
    "use one protective action for every hazard scenario",
    "delay accountability until after responders enter the affected area",
    "treat a discussion exercise as proof of field deployment speed",
    "omit a transition trigger when conditions change",
    "leave recovery dependencies outside the exercise scope",
  ],
  A6: [
    "use one area sample as evidence for every worker and task",
    "rely on PPE without checking compatibility or program limits",
    "treat an acceptable average as proof that peaks are controlled",
    "ignore a material exposure route not captured by the selected sample",
    "retain the source while increasing medical screening alone",
    "apply a limit without confirming units, duration, or population",
    "use a normal initial reading as permanent authorization",
    "delay control while waiting for complete causal certainty",
  ],
  A7: [
    "close the action when the manifest is received",
    "use a facility-wide average without checking nearby receptors",
    "transfer waste to a vendor without downstream due diligence",
    "treat dilution as prevention of the release",
    "optimize one environmental metric while omitting burden transfer",
    "wait for a permit exceedance before controlling the pathway",
    "count recycling tonnage without verifying final disposition",
    "exclude change management from the aspect review",
  ],
  A8: [
    "use attendance as evidence of task competence",
    "rely on satisfaction scores as proof of workplace transfer",
    "show the correct response during every performance assessment",
    "repeat the same lecture without diagnosing the misconception",
    "use one delivery method for unlike learners and tasks",
    "treat course completion as permanent authorization",
    "measure recall immediately and omit delayed field performance",
    "lower the critical criterion instead of remediating the gap",
  ],
  A9: [
    "treat management approval as qualified legal advice",
    "retain all personal data without a defined purpose or limit",
    "transfer duty by contract without checking retained control",
    "replace original evidence with a polished summary",
    "wait for an injury before investigating the concern",
    "disclose confidential detail beyond operational need",
    "accept work outside professional competence without assistance",
    "use insurance as a substitute for controlling the hazard",
  ],
};

const CORRECT_EXTENSIONS_BY_DOMAIN: Readonly<Record<DomainId, readonly string[]>> = {
  A1: ["retain the stated units", "carry unrounded inputs to the final step", "check dimensional consistency"],
  A2: ["verify it at the point of work", "assign an accountable response to drift", "confirm the critical control in the field"],
  A3: ["confirm fit with representative users", "verify the changed task demand", "check for transferred ergonomic load"],
  A4: ["test the installed protection", "verify the credible design demand", "confirm impairment and restoration controls"],
  A5: ["retest the corrected capability", "verify accountability under realistic conditions", "confirm the transition trigger"],
  A6: ["verify the peak task", "confirm source-control performance", "retain the exposure basis and uncertainty"],
  A7: ["check for burden transfer", "verify final disposition", "confirm the pathway and affected receptor"],
  A8: ["confirm delayed field performance", "verify the critical task without prompting", "reassess after targeted remediation"],
  A9: ["preserve evidence and confidentiality", "document the competent decision basis", "retain independent professional judgment"],
};

function poolNumber(pool: QuestionPool): number {
  return pool === "practice" ? 0 : pool === "mock-a" ? 1 : 2;
}

function pick<T>(values: readonly T[], seed: number): T {
  return values[Math.abs(seed) % values.length];
}

function rounded(value: number, digits = 1): string {
  return Number(value.toFixed(digits)).toString();
}

function context(pool: QuestionPool, domainId: DomainId, index: number): string {
  const mode = poolNumber(pool);
  const site = pick(SITES[pool], index * 7 + mode * 3);
  const subject = pick(SUBJECTS[domainId], index * 11 + mode * 5);
  const shift = pick(["day shift", "evening shift", "night shift", "weekend coverage"], index + mode);
  const evidenceState = pick(EVIDENCE_STATES, index * 5 + mode);
  const reviewPhase = pick(REVIEW_PHASES, index * 13 + mode * 7 + Number(domainId.slice(1)));
  return `${POOL_LEADS[pool]} at ${site}, ${subject} is examined on ${shift} ${evidenceState} ${reviewPhase}`;
}

function answer(text: string, rationale: string): Answer {
  return { text, rationale };
}

const ANSWER_ORDERS = [
  [0, 1, 2, 3],
  [1, 0, 2, 3],
  [1, 2, 0, 3],
  [1, 2, 3, 0],
] as const;

function finalizeQuestion(
  pool: QuestionPool,
  domainId: DomainId,
  index: number,
  draft: Draft,
): PooledASPQuestion {
  const entries = [
    draft.correct,
    draft.distractors[0],
    draft.distractors[1],
    draft.distractors[2],
  ] as const;
  const position = (index * 3 + poolNumber(pool) + Number(domainId.slice(1))) % 4;
  const order = ANSWER_ORDERS[position];
  const correctIndex = order.indexOf(0) as OptionIndex;
  const baseOptions = entries.map((entry) => entry.text.trim().replace(/[.!?]+$/, "")) as [
    string,
    string,
    string,
    string,
  ];
  const numericChoiceSet = baseOptions.every(
    (value) => /[\d$%]/.test(value) && value.length < 120,
  );
  const compactAction = (value: string): string => {
    if (value.length <= 150) return value;
    const semicolonLead = value.split(";")[0]?.trim();
    return semicolonLead && semicolonLead.length >= 70 ? semicolonLead : value;
  };
  const rankPattern = (index + poolNumber(pool) + Number(domainId.slice(1))) % 4;
  const compactOptions = baseOptions.map((value) =>
    numericChoiceSet ? value : compactAction(value),
  ) as [string, string, string, string];
  const baseLength = Math.max(...compactOptions.map((value) => value.length));
  const targetOffsets = [
    [-12, 18, -24, 8],
    [18, -18, 24, -6],
    [-20, 10, -8, 24],
    [8, 24, -20, -4],
  ] as const;
  const completeOption = (entryIndex: number): string => {
    let value = compactOptions[entryIndex];
    if (numericChoiceSet) return `${value}.`;
    const target = Math.max(80, baseLength + targetOffsets[rankPattern][entryIndex]);
    if (entryIndex === 0) {
      for (let extensionIndex = 0; extensionIndex < 3 && value.length < target; extensionIndex += 1) {
        const extension = pick(
          CORRECT_EXTENSIONS_BY_DOMAIN[domainId],
          index * 5 + poolNumber(pool) * 3 + extensionIndex,
        );
        if (!value.includes(extension)) value = `${value}; ${extension}`;
      }
      return `${value}.`;
    }
    const selected: string[] = [];
    for (let extensionIndex = 0; extensionIndex < 3 && value.length < target; extensionIndex += 1) {
      const extension = pick(
        WRONG_EXTENSIONS_BY_DOMAIN[domainId],
        index * 7 + entryIndex * 5 + poolNumber(pool) * 3 +
          Number(domainId.slice(1)) + extensionIndex,
      );
      if (!selected.includes(extension)) selected.push(extension);
      const extensionList =
        selected.length === 1
          ? selected[0]
          : `${selected.slice(0, -1).join(", ")}, and ${selected.at(-1)}`;
      value = `${compactOptions[entryIndex]}; ${extensionList}`;
    }
    return `${value}.`;
  };
  const options: [string, string, string, string] = [
    completeOption(order[0]),
    completeOption(order[1]),
    completeOption(order[2]),
    completeOption(order[3]),
  ];
  const wrongRationales: [string, string, string, string] = [
    order[0] === 0 ? `Correct. ${entries[0].rationale}` : entries[order[0]].rationale,
    order[1] === 0 ? `Correct. ${entries[0].rationale}` : entries[order[1]].rationale,
    order[2] === 0 ? `Correct. ${entries[0].rationale}` : entries[order[2]].rationale,
    order[3] === 0 ? `Correct. ${entries[0].rationale}` : entries[order[3]].rationale,
  ];
  const prefix = pool === "practice" ? "ASP-P" : pool === "mock-a" ? "ASP-MA" : "ASP-MB";

  return {
    id: `${prefix}-${domainId}-${String(index).padStart(3, "0")}`,
    domainId,
    competency: draft.competency,
    objective: draft.objective,
    difficulty: draft.difficulty,
    stem: draft.stem,
    options,
    correctIndex,
    rationale: draft.correct.rationale,
    wrongRationales,
    referenceFramework: draft.referenceFramework ?? FRAMEWORKS[(index + poolNumber(pool) + Number(domainId.slice(1))) % FRAMEWORKS.length],
    referenceTopic: draft.referenceTopic,
    challengePrompt: draft.challengePrompt,
    pool,
    scenarioFamily: familyName(pool, domainId, draft.formulaFamily ?? draft.referenceTopic),
    formulaId: draft.formulaId,
    formulaCategory: draft.formulaCategory,
    formulaFamily: draft.formulaFamily,
    blueprintObjective: draft.blueprintObjective,
  };
}


function familyName(pool: QuestionPool, domainId: DomainId, topic: string): string {
  const form = pool === "practice" ? "coached-drill" : pool === "mock-a" ? "field-form" : "assurance-form";
  const topicSlug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${domainId.toLowerCase()}-${form}-${topicSlug}`;
}




function buildA2(pool: QuestionPool, index: number): Draft {
  const mode = poolNumber(pool);
  const family = (index - 1) % 5;
  const cycle = Math.floor((index - 1) / 5);
  const variant = (cycle + mode) % 2;
  const seed = index * 17 + mode * 31;
  const lead = context(pool, "A2", index);
  const hazard = pick([
    "airborne dust from dry cutting",
    "hand access to sharp press scrap",
    "vehicle-pedestrian conflict at a blind corner",
    "volatile solvent vapor from an open cleaning tray",
    "a suspended load crossing a routine work aisle",
    "pressurized sampling at an open connection",
    "repetitive entry into a machine danger zone",
    "manual handling of unstable stacked containers",
  ], seed);

  if (family === 0 && variant === 0) {
    const redesign = pick([
      "use wet or enclosed cutting with source capture",
      "route scrap into a guarded automatic collection bin",
      "physically separate travel paths with controlled crossings",
      "substitute a less volatile closed-loop cleaning process",
      "reroute the lift so suspended loads cannot pass over occupied aisles",
      "install a closed, depressurized sampling system",
      "automate clearing so routine access to the danger zone is removed",
      "use engineered racking and mechanical stabilization",
    ], seed);
    return {
      competency: "Hierarchy of controls",
      objective: "Prioritize a source-focused control over behavior-dependent measures.",
      difficulty: 1,
      stem: `${lead}. The recurring exposure is ${hazard}. Which proposal applies the strongest primary control?`,
      correct: answer(`Redesign the work to ${redesign}`, "The proposed design change removes or contains the hazardous interaction at its source and relies less on flawless repeated behavior."),
      distractors: [
        answer("Add a warning sign and repeat the rule at shift meetings", "Communication does not remove or isolate the recurring exposure."),
        answer("Rotate more employees through the exposure", "Rotation redistributes exposure without controlling its source."),
        answer("Record injuries monthly and intervene only if the count rises", "Lagging surveillance permits continued exposure and does not prevent the initiating event."),
      ],
      referenceTopic: "Hierarchy of risk controls",
      challengePrompt: "Identify one foreseeable hazard introduced by the redesign and a verification measure for its control.",
    };
  }

  if (family === 0) {
    const energy = pick(["a raised counterweight", "residual hydraulic pressure", "stored spring force", "thermal pressure", "gravity-fed material", "pneumatic accumulator pressure"], seed);
    return {
      competency: "Hazardous-energy recognition",
      objective: "Control all energy sources rather than only the obvious electrical source.",
      difficulty: 1,
      stem: `${lead}. Electrical power is locked off, but ${energy} can still move equipment while a worker is inside the danger zone. What must occur before work proceeds?`,
      correct: answer("Identify, isolate, dissipate or restrain every energy source, then verify the resulting zero-energy or safely controlled state", "Energy control must address the complete system and confirm that isolation or restraint is effective before exposure."),
      distractors: [
        answer("Proceed because the electrical disconnect is already locked", "Electrical isolation alone does not control the stated stored or potential energy."),
        answer("Ask a second worker to watch the equipment without isolating the remaining energy", "Observation cannot substitute for physical control of hazardous energy."),
        answer("Rely on the normal stop control while the worker enters", "A normal control is not an energy-isolating device and may fail or be actuated."),
      ],
      referenceTopic: "Comprehensive hazardous-energy control",
      challengePrompt: "Describe a try-test or other verification step appropriate to the stated non-electrical energy.",
    };
  }

  if (family === 1 && variant === 0) {
    const severityA = 7 + (seed % 3);
    const occurrenceA = 2 + (seed % 3);
    const detectionA = 2 + (seed % 4);
    const severityB = 4 + (seed % 3);
    const occurrenceB = 5 + (seed % 4);
    const detectionB = 4 + (seed % 3);
    const rpnA = severityA * occurrenceA * detectionA;
    const rpnB = severityB * occurrenceB * detectionB;
    const higher = rpnA > rpnB ? "A" : "B";
    const rankingUse = pick([
      "screening design alternatives before detailed analysis",
      "prioritizing preventive-maintenance review while a high-severity rule also applies",
      "selecting proof-test improvements without treating the product as absolute risk",
    ], cycle);
    return {
      competency: "Risk assessment and FMEA",
      objective: "Calculate failure-mode priority while preserving attention to high severity.",
      difficulty: 2,
      stem: `${lead}. The team is ${rankingUse}. Failure mode A is rated severity ${severityA}, occurrence ${occurrenceA}, detection ${detectionA}; mode B is ${severityB}, ${occurrenceB}, ${detectionB}. Using RPN = S x O x D, what is the best screening conclusion?`,
      correct: answer(`RPNs are ${rpnA} and ${rpnB}; screen mode ${higher} first by RPN while separately checking whether the higher-severity mode requires action regardless of rank`, "The products provide a useful ordering signal, but an RPN must not hide a scenario that triggers an independent severity criterion."),
      distractors: [
        answer(`Scores are ${severityA + occurrenceA + detectionA} and ${severityB + occurrenceB + detectionB}; accept both because the sums are low`, "The stated method multiplies the ratings, and acceptance does not follow from an arbitrary sum."),
        answer(`Only severity matters, so no occurrence or detection data should be considered`, "Severity may trigger a mandatory review, but the other dimensions remain relevant to prioritization and control design."),
        answer(`The lower RPN mode can be permanently ignored`, "A relative rank is not proof of acceptable risk or permission to omit treatment."),
      ],
      referenceTopic: "Failure modes, risk ranking, and RPN limitations",
      challengePrompt: "Explain how two failure modes with the same product can warrant different control decisions.",
    };
  }

  if (family === 1) {
    const document = pick(["isolation procedure", "confined-space checklist", "critical lift plan", "startup instruction", "chemical unloading standard", "mobile-equipment traffic map"], seed);
    return {
      competency: "Document and audit control",
      objective: "Restore safe work when field documents conflict with the controlled requirement.",
      difficulty: 2,
      stem: `${lead}. Workers are using a locally saved ${document} that omits a critical step found in the approved version. The supervisor says the local copy is faster. What is the best immediate system response?`,
      correct: answer("Control the affected work, replace the obsolete copy, verify the current requirement is usable and understood, determine distribution failure, and check similar locations", "The response protects current work, restores document integrity, and addresses the systemic pathway that allowed uncontrolled copies."),
      distractors: [
        answer("Let the team continue until the next annual document review", "A known critical omission requires timely risk control rather than calendar-based delay."),
        answer("Update only the footer date on the local copy", "Cosmetic revision does not restore the missing control or approved content."),
        answer("Discipline one employee and close the issue without checking distribution", "Individual blame does not correct the document-control and usability failures."),
      ],
      referenceTopic: "Controlled documents and audit response",
      challengePrompt: "Name one distribution control and one field verification that would detect recurrence.",
    };
  }

  if (family === 2 && variant === 0) {
    const change = pick([
      "replaces a night coordinator with software-generated work queues",
      "changes a cleaning chemical and doubles its operating temperature",
      "raises line speed while removing an inspection position",
      "moves alarm acknowledgement to a remote operations center",
      "uses a temporary hose in place of fixed transfer piping",
      "reconfigures robot logic for mixed-size loads",
    ], seed);
    return {
      competency: "Management of change",
      objective: "Review technical, organizational, and procedural change before implementation.",
      difficulty: 3,
      stem: `${lead}. Management ${change}. Production argues that a formal review is unnecessary because output will remain the same. What is the strongest response?`,
      correct: answer("Run a proportionate change review covering hazards, affected safeguards, human performance, procedures, competence, interfaces, authorization, and post-change verification", "Safety significance follows changed exposure and control pathways, not merely whether production output is unchanged."),
      distractors: [
        answer("Approve the change because only capital equipment changes require review", "Software, staffing, chemistry, temporary arrangements, and procedures can all alter risk."),
        answer("Wait for an incident to identify which impacts matter", "Change management is preventive and should identify credible effects before activation."),
        answer("Review only the project budget and implementation date", "Schedule and cost do not evaluate hazardous interactions or safeguard readiness."),
      ],
      referenceTopic: "Technical and organizational management of change",
      challengePrompt: "Identify three leading indicators to monitor during the first month after the change.",
    };
  }

  if (family === 2) {
    const task = pick(["breaking a seized flange", "clearing a bridged hopper", "recovering a disabled forklift", "opening a fouled filter", "testing an intermittent limit switch", "replacing a corroded roof panel"], seed);
    const surprise = pick(["unexpected stored pressure", "an unstable support", "simultaneous contractor work", "an unlisted chemical residue", "a hidden energy source", "rapidly changing weather"], seed + 3);
    return {
      competency: "Job hazard analysis and work planning",
      objective: "Reassess work when actual conditions depart from the approved plan.",
      difficulty: 3,
      stem: `${lead}. A crew begins ${task}, then discovers ${surprise} that the pre-job analysis did not address. What should the supervisor do?`,
      correct: answer("Pause the affected work, establish a safe condition, involve the people doing the job in reassessing hazards and controls, update authorization, and communicate the revised plan", "A material condition change invalidates assumptions in the original plan and requires controlled reassessment before exposure resumes."),
      distractors: [
        answer("Continue slowly because the original form is already signed", "A signature does not make an incomplete analysis valid under changed conditions."),
        answer("Ask the crew to remember the new hazard but leave controls unchanged", "Awareness alone does not establish effective control of the newly discovered condition."),
        answer("Finish the job first and update the analysis afterward", "Retrospective documentation does not protect workers during current exposure."),
      ],
      referenceTopic: "Dynamic job hazard analysis",
      challengePrompt: "Distinguish a minor field adjustment from a change that requires renewed work authorization.",
    };
  }

  if (family === 3 && variant === 0) {
    const action = pick(["opened the wrong valve", "entered an active vehicle lane", "bypassed a verification step", "released a suspended component", "selected an incompatible fitting", "reset an alarm without diagnosis"], seed);
    const latent = pick(["similar identifiers and a truncated display", "poor sight lines and production congestion", "an unusable procedure and time pressure", "unclear ownership and an absent interlock", "look-alike parts and weak receiving controls", "alarm flooding and conflicting priorities"], seed + 7);
    return {
      competency: "Incident investigation",
      objective: "Distinguish the final unsafe act from interacting system causes.",
      difficulty: 4,
      stem: `${lead}. A worker ${action}. Evidence shows ${latent}, and the normal independent check had drifted out of use. Which conclusion best supports prevention?`,
      correct: answer("The event arose from interacting task, design, organizational, and verification conditions that made the action plausible and allowed it to pass unchecked", "The conclusion explains both action shaping and safeguard failure, creating multiple stronger corrective pathways."),
      distractors: [
        answer("The worker's lack of attention is the single root cause", "Relabeling the final action does not explain the conditions or failed barriers."),
        answer("No cause can be found without an admission of negligence", "Physical, documentary, system, and interview evidence can support causal findings without a blame admission."),
        answer("The event was random because several factors were present", "Multiple interacting contributors can be analyzed and controlled; complexity does not make the event causeless."),
      ],
      referenceTopic: "Systems-based causal analysis",
      challengePrompt: "Propose one forcing-function correction and one measure of its field effectiveness.",
    };
  }

  if (family === 3) {
    const reportingChange = 2 + (seed % 4);
    const outcome = pick(["recordable injuries remain flat", "minor injury counts decline slightly", "hours worked rise substantially", "contractor exposure shifts into the site", "maintenance backlog also increases"], seed);
    const reportingEvidence = pick([
      "Report narratives now identify safeguards that were previously invisible to management.",
      "Participation expands from one department to nearly every shift and contractor group.",
      "Closure speed improves, but independent field verification is still limited.",
    ], cycle);
    return {
      competency: "Safety culture and performance indicators",
      objective: "Interpret reporting changes without equating report volume with underlying hazard frequency.",
      difficulty: 4,
      stem: `${lead}. After leaders introduce no-retaliation reporting, near-miss reports increase ${reportingChange}-fold while ${outcome}. ${reportingEvidence} Executives call the increase proof that risk worsened. What is the best interpretation?`,
      correct: answer("Reporting volume reflects both events and willingness to report; examine report quality, participation, exposure, response quality, control performance, and later outcomes before attributing the change", "Triangulation separates improved visibility from changing hazard rate and tests whether learning actions reduce risk."),
      distractors: [
        answer("The hazard rate must have increased by the same multiple", "Observed reports cannot isolate event occurrence from reporting probability."),
        answer("All near-miss data should be discarded because it is subjective", "Structured precursor information can reveal weak controls and culture when assessed with other evidence."),
        answer("The program is proven effective solely because report counts increased", "More reporting may indicate trust, but effectiveness also requires useful response and improved control performance."),
      ],
      referenceTopic: "Reporting culture and indicator interpretation",
      challengePrompt: "Design one survey measure and one observed behavior that could corroborate improved reporting trust.",
    };
  }

  if (family === 4 && variant === 0) {
    const technology = pick(["computer-vision PPE alerts", "wearable fatigue scores", "predictive maintenance risk rankings", "automated permit recommendations", "proximity-warning badges", "generative incident summaries"], seed);
    const concern = pick(["glare creates unequal false positives", "contractors were absent from validation", "the training data exclude rare severe failures", "supervisors plan automatic discipline", "location data can reveal sensitive movements", "generated causal claims are not evidence-linked"], seed + 5);
    return {
      competency: "Emerging safety technology",
      objective: "Validate technology performance, fairness, privacy, and human oversight before consequential use.",
      difficulty: 5,
      stem: `${lead}. A vendor proposes ${technology}; pilot review shows ${concern}. What governance is needed before operational reliance?`,
      correct: answer("Define the safety use case and failure consequences, validate on representative conditions, test subgroup and edge-case performance, set human review and appeal, protect data, monitor drift, and retain independent controls", "Technology assurance must connect accuracy and failure modes to real consequences while preserving privacy, oversight, and defense in depth."),
      distractors: [
        answer("Deploy immediately because vendor accuracy is a complete validity claim", "Aggregate vendor accuracy may not represent local conditions, rare events, groups, or consequential error costs."),
        answer("Use every alert as conclusive proof of misconduct", "A probabilistic signal without reviewed context is not conclusive evidence and can amplify bias."),
        answer("Reject all technology and remove existing safeguards", "The issue is governed, validated use; blanket rejection does not assess whether the tool can safely supplement controls."),
      ],
      referenceTopic: "AI, wearable, and automated-system assurance",
      challengePrompt: "Define one false-positive and one false-negative consequence that the validation plan must quantify.",
    };
  }

  const simultaneousWork = pick(["hot work above a solvent-line opening", "crane travel across an occupied scaffold", "electrical testing beside water-line flushing", "excavation beside energized underground service", "roof work above an active loading dock", "chemical cleaning beside instrument calibration"], seed);
  return {
    competency: "Contractor and process-interface management",
    objective: "Control emergent risk created by simultaneous activities and shared safeguards.",
    difficulty: 5,
    stem: `${lead}. Two qualified contractors have acceptable standalone plans, but the schedule creates ${simultaneousWork}. Each says the other owns coordination. What is the strongest site response?`,
    correct: answer("Stop incompatible work, establish a controlling coordination process, analyze combined hazards and safeguard dependencies, assign authorities and communication, revise permits and sequencing, and verify field readiness", "Individually adequate plans can become unsafe when activities interact; the host must govern shared interfaces and retained controls."),
    distractors: [
      answer("Allow both jobs because each contractor signed its own plan", "Separate approval does not address hazards created by interaction between the jobs."),
      answer("Let the contractors settle responsibility after work begins", "Unresolved authority and coordination are themselves risk factors that must be corrected before exposure."),
      answer("Transfer all risk by adding an indemnity clause to one purchase order", "Contract language does not physically control simultaneous work or erase operational coordination duties."),
    ],
    referenceTopic: "Simultaneous operations and contractor interfaces",
    challengePrompt: "Identify one shared safeguard whose status must be visible to both contractors in real time.",
  };
}

function buildA2MockA(index: number): Draft {
  const pool: QuestionPool = "mock-a";
  const family = (index - 1) % 5;
  const seed = index * 31 + 73;
  const lead = context(pool, "A2", index);

  if (family === 0) {
    const barrier = pick(["high-level shutdown", "vehicle proximity alarm", "guard-position switch", "gas detector trip", "overload limiter", "temperature interlock"], seed);
    return {
      competency: "Critical-control verification",
      objective: "Distinguish evidence of control availability from activity completion.",
      difficulty: 1,
      stem: `${lead}. A dashboard counts monthly checks of a ${barrier}, but reviewers cannot show that test conditions challenge the trip, that failures are corrected, or that bypasses are controlled. What improvement is most important?`,
      correct: answer("Define the control's required performance, test it under representative conditions, record failures and bypass status, correct defects, and trend verified availability", "A critical-control program must demonstrate that the safeguard performs its intended risk-reduction function, not merely that a checkbox was completed."),
      distractors: [
        answer("Increase the number of checkboxes without changing test content", "More activity counts do not establish functional performance."),
        answer("Replace failure records with the monthly completion percentage", "Completion hides whether the safeguard passed, remained bypassed, or was restored."),
        answer("Measure only injuries associated with the control", "Rare lagging outcomes provide weak and delayed evidence of current control availability."),
      ],
      referenceTopic: "Mock A critical-control performance assurance",
      challengePrompt: "Write one pass-fail criterion that tests the safeguard function rather than inspection attendance.",
    };
  }

  if (family === 1) {
    const space = pick(["mixing vessel", "utility vault", "railcar interior", "process pit", "storage silo", "underground valve chamber"], seed);
    const change = pick(["a new cleaning agent", "hot work added after entry begins", "loss of forced ventilation", "an upstream process startup", "a rising liquid level", "a rescue-team availability change"], seed + 4);
    return {
      competency: "Permit-space control",
      objective: "Reevaluate entry authorization after conditions materially change.",
      difficulty: 2,
      stem: `${lead}. Authorized entry into a ${space} is underway when ${change} occurs. The original permit does not address it. What is the best response?`,
      correct: answer("Stop or suspend entry, account for entrants, establish a safe condition, reassess hazards and controls, and reauthorize only when the revised plan and rescue capability are verified", "A material change invalidates assumptions supporting the original entry authorization."),
      distractors: [
        answer("Continue because initial atmospheric results were acceptable", "Initial results cannot validate conditions after a new source, task, or safeguard change."),
        answer("Have entrants verbally acknowledge the change without revising controls", "Awareness alone does not establish a safe entry system."),
        answer("Wait until permit expiration to reassess", "The new condition requires immediate control rather than administrative delay."),
      ],
      referenceTopic: "Mock A dynamic permit-space authorization",
      challengePrompt: "Identify one change that requires continuous monitoring data to be reinterpreted rather than merely recorded.",
    };
  }

  if (family === 2) {
    const defect = pick(["a damaged cord jacket", "a missing equipment ground path", "water around temporary connectors", "an improvised multi-plug adapter", "an unlabeled temporary panel", "a resettable protective device that repeatedly trips"], seed);
    return {
      competency: "Electrical risk management",
      objective: "Control temporary electrical hazards through de-energization, evaluation, and suitable equipment.",
      difficulty: 3,
      stem: `${lead}. Temporary power inspection finds ${defect} in a wet or conductive work area. The crew proposes wrapping the condition and continuing. What is the strongest response?`,
      correct: answer("Remove the affected equipment from service, control energy, have a qualified person determine cause and required repair or replacement, verify suitable protection and environmental rating, then inspect before return", "Temporary status does not lower the need for intact equipment, suitable protection, and qualified correction of an electrical hazard."),
      distractors: [
        answer("Continue because temporary equipment is exempt from electrical risk controls", "Temporary installations can present greater exposure and still require suitable protection."),
        answer("Cover the defect cosmetically without investigating repeated failure or suitability", "A superficial cover may hide damage and does not verify insulation, grounding, protection, or root cause."),
        answer("Ask workers to avoid touching the equipment while energized", "Behavioral caution is not a substitute for removing defective electrical equipment from service."),
      ],
      referenceTopic: "Mock A temporary-power defect response",
      challengePrompt: "Explain why repeated protective-device operation is a diagnostic signal rather than an inconvenience to bypass.",
    };
  }

  if (family === 3) {
    const route = pick(["a backing route with blind corners", "a long downhill haul", "a congested delivery yard", "a road segment with animal crossings", "a night route through construction", "a mixed pedestrian-forklift dock"], seed);
    const signal = pick(["near-miss reports rise while collisions remain flat", "minor property events cluster on one shift", "speed alerts increase after route timing is shortened", "fatigue alerts cluster late in the schedule", "camera events concentrate at one intersection", "maintenance faults correlate with braking complaints"], seed + 3);
    return {
      competency: "Fleet safety analytics",
      objective: "Translate mixed leading and lagging fleet data into targeted system controls.",
      difficulty: 4,
      stem: `${lead}. The operation uses ${route}; data show ${signal}. What is the most defensible next action?`,
      correct: answer("Validate exposure and data quality, analyze task and route contributors, involve drivers, apply engineering and scheduling controls to the pattern, and monitor both control performance and outcomes", "The response tests whether the signal is real, locates its system causes, and targets the exposure rather than defaulting to generic discipline."),
      distractors: [
        answer("Discipline every driver represented in an alert without contextual review", "Alerts can be biased or context-dependent and do not by themselves establish misconduct."),
        answer("Ignore leading signals until a serious collision occurs", "Waiting for harm discards useful precursor evidence."),
        answer("Compare only raw event counts and omit miles, trips, route, and time exposure", "Unnormalized counts can misstate performance when exposure patterns differ."),
      ],
      referenceTopic: "Mock A exposure-normalized fleet intervention",
      challengePrompt: "Name one denominator and one route-specific leading measure needed for a valid trend.",
    };
  }

  const bypass = pick(["high-pressure trip", "combustion safeguard", "reactor cooling interlock", "overfill shutdown", "dust-collector isolation valve", "toxic-gas shutdown"], seed);
  const reason = pick(["a failed sensor awaiting parts", "nuisance activation during startup", "a production target", "an incomplete proof test", "a software communication fault", "a temporary process experiment"], seed + 6);
  return {
    competency: "Process-safety barrier governance",
    objective: "Control temporary impairment of a high-consequence protective layer.",
    difficulty: 5,
    stem: `${lead}. Operations requests bypassing a ${bypass} because of ${reason}. The initiating hazard remains possible. What is the strongest decision process?`,
    correct: answer("Treat the bypass as a controlled change: define risk and duration, verify remaining independent layers, impose compensatory limits or stop operation if risk is unacceptable, authorize visibly, expedite restoration, and verify return to service", "A bypass changes the risk architecture and must be time-limited, visible, authorized, compensated, and closed with functional verification."),
    distractors: [
      answer("Allow an undocumented bypass because the operator will remember it", "Memory is not reliable governance for loss of a critical protective layer."),
      answer("Assume an alarm is equivalent to an automatic trip", "An alarm often depends on recognition and action and may not provide equivalent reliability or response time."),
      answer("Keep operating at normal limits because the bypass is temporary", "Temporary duration does not reduce consequence or ensure remaining layers are adequate."),
    ],
    referenceTopic: "Mock A temporary protective-layer impairment",
    challengePrompt: "Define one restoration test and one visible status control required before bypass closure.",
  };
}

function buildA2MockB(index: number): Draft {
  const pool: QuestionPool = "mock-b";
  const family = (index - 1) % 5;
  const seed = index * 37 + 89;
  const lead = context(pool, "A2", index);

  if (family === 0) {
    const machine = pick(["multi-mode robotic cell", "indexing press", "automatic wrapper", "powered roll line", "laser-cutting enclosure", "case-packing machine"], seed);
    const modeIssue = pick(["maintenance mode permits unexpected automatic motion", "a reset outside the sight line can restart motion", "a guard switch is easy to defeat", "jam clearing requires reaching around a fixed guard", "stored pneumatic force remains after stop", "teach mode speed exceeds the validated limit"], seed + 5);
    return {
      competency: "Machine safeguarding validation",
      objective: "Validate safeguards across operating, setup, clearing, and maintenance modes.",
      difficulty: 1,
      stem: `${lead}. A new ${machine} passes a normal production demonstration, but ${modeIssue}. What should acceptance testing require?`,
      correct: answer("Challenge safeguarding and energy controls in every credible mode and fault condition, verify reset and restart behavior, confirm safe task access, correct failures, and document validated acceptance criteria", "A production run does not test nonroutine modes, foreseeable defeat, stored energy, or failure response."),
      distractors: [
        answer("Accept the machine because it completed one automatic cycle", "One normal cycle provides no evidence for alternate modes or fault conditions."),
        answer("Rely on a warning label wherever access remains necessary", "A label does not prevent hazardous motion or ensure safe access."),
        answer("Delay safeguarding review until operators report a near miss", "Commissioning should identify and correct foreseeable hazards before exposure."),
      ],
      referenceTopic: "Mock B multimode safeguard acceptance",
      challengePrompt: "Write one test that verifies a reset cannot itself initiate hazardous motion.",
    };
  }

  if (family === 1) {
    const informationGap = pick(["a mixture identifier differs between the label and transfer screen", "secondary containers lack product identity", "a revised formulation changes incompatibilities", "contract workers cannot access hazard information", "an emergency number is obsolete", "pictograms are obscured by reusable sleeves"], seed);
    return {
      competency: "Hazard communication system integrity",
      objective: "Restore reliable chemical identity and usable hazard information across work interfaces.",
      difficulty: 2,
      stem: `${lead}. Review finds ${informationGap}. Production suggests relying on container color until the next inventory. What is the best response?`,
      correct: answer("Control affected use or transfer, reconcile identity with authoritative product and process records, correct labels and accessible information, communicate changed hazards, and check related containers and systems", "Chemical identity must remain traceable and usable at each work interface; color alone is neither unique nor controlled."),
      distractors: [
        answer("Use odor and appearance as the primary identification method", "Sensory identification can expose workers and cannot reliably establish chemical identity."),
        answer("Continue because experienced employees can recognize every product", "Experience does not repair inconsistent labels or protect temporary, emergency, and downstream users."),
        answer("Remove all labels so none conflict", "Eliminating information increases uncertainty and does not establish correct identity."),
      ],
      referenceTopic: "Mock B chemical-identity traceability",
      challengePrompt: "Identify two digital-to-physical interfaces where product identity can drift.",
    };
  }

  if (family === 2) {
    const system = pick(["cooling-water supply", "instrument-air header", "access-control network", "emergency generator fuel train", "central dust collection", "process control server"], seed);
    const commonCause = pick(["one shared power feed", "a common suction line", "one network switch", "a single maintenance procedure", "the same environmental enclosure", "one calibration reference"], seed + 4);
    return {
      competency: "System safety and common-cause analysis",
      objective: "Recognize when apparent redundancy does not provide independent protection.",
      difficulty: 3,
      stem: `${lead}. Two nominally redundant ${system} units both depend on ${commonCause}. A review credits them as fully independent safeguards. What is the principal flaw?`,
      correct: answer("The shared dependency can defeat both units in one event, so independence and claimed risk reduction must be reevaluated and the common cause controlled", "Redundancy improves reliability only to the extent that failure pathways are genuinely independent."),
      distractors: [
        answer("Two units are always independent because they have different serial numbers", "Equipment identity does not remove shared utilities, environment, maintenance, or control dependencies."),
        answer("Common causes matter only after both units have actually failed", "System analysis should identify shared failure paths prospectively."),
        answer("Adding more alarms makes the units independent", "Detection does not remove the shared dependency causing simultaneous loss."),
      ],
      referenceTopic: "Mock B shared-dependency reliability analysis",
      challengePrompt: "Draw one common-cause branch that belongs above both redundant units in a fault tree.",
    };
  }

  if (family === 3) {
    const project = pick(["machine enclosure retrofit", "pedestrian separation project", "ventilation upgrade", "fire-water reliability project", "noise-control enclosure", "chemical unloading redesign"], seed);
    const issue = pick(["design approval slips but installation dates remain fixed", "procurement selects an unreviewed substitute", "construction overlaps peak production", "commissioning tests are removed from the schedule", "a critical permit is on the longest dependency chain", "operators are not available for acceptance testing"], seed + 3);
    return {
      competency: "Safety project management",
      objective: "Protect risk-control scope, dependencies, and acceptance criteria during delivery pressure.",
      difficulty: 4,
      stem: `${lead}. A ${project} is underway when ${issue}. Leaders insist that the original completion date cannot move. What should the ASP do?`,
      correct: answer("Reassess critical dependencies and risk, preserve technical and acceptance requirements, evaluate controlled resequencing or interim safeguards, escalate unresolved risk, and update accountable milestones", "Schedule pressure must be managed transparently without silently deleting the functions that make the control effective."),
      distractors: [
        answer("Remove commissioning and verification because they do not create physical equipment", "Unverified installation may not perform its intended safety function."),
        answer("Accept substitutions solely on lower purchase price", "Cost does not establish equivalent hazard control, compatibility, or lifecycle performance."),
        answer("Hide the delay until the planned completion date", "Concealing dependency risk prevents informed governance and timely compensatory action."),
      ],
      referenceTopic: "Mock B risk-control project assurance",
      challengePrompt: "Define one hold point that must be passed before the control is credited as operational.",
    };
  }

  const pattern = pick(["minor leaks recur after rapid restarts", "near misses cluster after shift handovers", "guard defeats appear only on one product size", "wrong-part installations follow supplier substitutions", "loss-of-containment alarms cluster after cleaning", "mobile-equipment conflicts rise during dock congestion"], seed);
  const easyAction = pick(["retrain everyone", "discipline the last operator", "add a poster", "close each event separately", "buy more PPE", "raise the alarm volume"], seed + 4);
  return {
    competency: "Organizational learning and systemic corrective action",
    objective: "Convert recurring weak signals into cross-functional system improvement.",
    difficulty: 5,
    stem: `${lead}. Data across several months show ${pattern}. Management proposes to ${easyAction} after each case without aggregating evidence. What is the strongest alternative?`,
    correct: answer("Analyze the pattern across tasks, products, shifts, changes, and safeguards; identify shared causal mechanisms; implement higher-order cross-system actions; and verify recurrence and control performance over time", "Recurring distributed events often indicate a system condition that isolated case closure will miss."),
    distractors: [
      answer("Treat every event as unrelated because no single case caused a major injury", "Common patterns can reveal systemic risk before severe harm occurs."),
      answer("Use total event count without examining exposure or context", "Counts alone cannot locate the mechanism or account for changing opportunity."),
      answer("Stop collecting near-miss and defect data because it complicates analysis", "Removing precursor evidence weakens organizational learning."),
    ],
    referenceTopic: "Mock B cross-event learning synthesis",
    challengePrompt: "Specify one stratification variable and one recurrence measure that could test the hypothesized common cause.",
  };
}

function buildA3(pool: QuestionPool, index: number): Draft {
  const mode = poolNumber(pool);
  const family = (index - 1) % 5;
  const cycle = Math.floor((index - 1) / 5);
  const variant = (cycle + mode) % 2;
  const seed = index * 19 + mode * 37;
  const lead = context(pool, "A3", index);

  if (family === 0 && variant === 0) {
    const contact = pick(["the inside wrist against a sharp bench edge", "the forearm against an unpadded fixture", "the palm against a narrow tool-handle ridge", "the knee against a hard access-panel lip", "the thigh against a square desk edge"], seed);
    return {
      competency: "Ergonomic risk-factor recognition",
      objective: "Recognize localized contact stress and select a design correction.",
      difficulty: 1,
      stem: `${lead}. The worker repeatedly braces ${contact} for long task periods. Which response best addresses the primary risk factor?`,
      correct: answer("Remove or round the pressure point, add appropriate support or padding, and adjust the task so soft tissue is not used as a brace", "The redesign reduces concentrated external pressure at the worker-equipment interface."),
      distractors: [
        answer("Increase production pace so each contact lasts less time", "Higher pace may increase repetition and does not remove concentrated pressure."),
        answer("Classify the issue only as whole-body vibration", "No vibrating vehicle or platform exposure is described."),
        answer("Ask the worker to tolerate the edge until symptoms occur", "Waiting for symptoms leaves a known exposure uncontrolled."),
      ],
      referenceTopic: "Contact stress and interface design",
      challengePrompt: "Describe one observation that would verify the redesign did not simply move pressure to another body area.",
    };
  }

  if (family === 0) {
    const mismatch = pick(["sustained raised shoulders", "repeated wrist extension", "forward neck flexion", "long unsupported reaching", "trunk twisting between bins", "kneeling on a hard surface"], seed);
    const change = pick(["adjust work height", "reorient the tool and workpiece", "raise and angle the visual target", "bring materials into the normal reach zone", "place input and output in line", "provide a suitable platform or alternative work position"], seed);
    return {
      competency: "Workstation design",
      objective: "Correct a workstation-task mismatch to support neutral posture.",
      difficulty: 1,
      stem: `${lead}. Observation shows ${mismatch} throughout most cycles. Which intervention is strongest?`,
      correct: answer(`Redesign or adjust the station to ${change}, then verify posture during representative production`, "Changing the workstation-task relationship addresses the imposed posture at its source and field verification checks the real result."),
      distractors: [
        answer("Post a reminder to maintain neutral posture while leaving dimensions unchanged", "A reminder cannot overcome geometry that physically imposes the posture."),
        answer("Select only workers whose body size happens to fit the fixed station", "Worker selection excludes part of the population and does not create robust accommodation."),
        answer("Add an unrelated wellness lecture", "General wellness content does not correct the observed task-design mismatch."),
      ],
      referenceTopic: "Neutral posture and workstation fit",
      challengePrompt: "Name one worker-dimension and one task-demand measure needed to set an appropriate adjustment range.",
    };
  }

  if (family === 1 && variant === 0) {
    const design = pick(["doorway clearance", "under-bench leg clearance", "overhead guard height", "emergency passage width", "cab headroom"], seed);
    const reach = pick(["a frequently used control", "an emergency stop", "a parts bin", "a touch-screen target", "a hand tool"], seed + 2);
    return {
      competency: "Anthropometry",
      objective: "Select protective percentile directions for clearance and reach.",
      difficulty: 2,
      stem: `${lead}. The team must set ${design} and locate ${reach} for a diverse user population. Which general approach is appropriate?`,
      correct: answer("Use a large-user percentile for clearance and a small-user percentile for reach, then verify the actual population, clothing, posture, and adjustability", "Clearance must accommodate larger bodies while reach must remain accessible to smaller users; real task conditions refine the percentiles."),
      distractors: [
        answer("Use a small-user percentile for clearance and a large-user percentile for reach", "This reverses both protective design directions."),
        answer("Use the population mean for both because an average accommodates everyone", "A mean can exclude substantial portions of both distribution tails."),
        answer("Use the designer's body dimensions because they are directly available", "One person's dimensions do not represent the intended population."),
      ],
      referenceTopic: "Anthropometric design percentiles",
      challengePrompt: "Explain when adjustability is preferable to choosing one fixed percentile boundary.",
    };
  }

  if (family === 1) {
    const tool = pick(["grinder", "impact wrench", "needle scaler", "rotary sander", "demolition hammer", "powered chisel"], seed);
    return {
      competency: "Vibration exposure control",
      objective: "Manage hand-arm vibration through measurement and source-focused controls.",
      difficulty: 2,
      stem: `${lead}. Operators report tingling after extended use of an aging ${tool}; actual trigger time and accessory condition vary by shift. What is the strongest initial response?`,
      correct: answer("Characterize representative vibration and trigger duration, maintain or replace the tool and accessories, optimize the process and grip demand, limit exposure as needed, and evaluate symptoms", "The plan combines exposure assessment, source reduction, work design, and early health follow-up."),
      distractors: [
        answer("Tell workers to grip the tool as tightly as possible", "Excess grip can increase muscular demand and transmitted vibration."),
        answer("Issue ordinary gloves and assume exposure is controlled", "Gloves cannot be presumed to provide adequate vibration attenuation without evidence."),
        answer("Wait for permanent impairment before changing the task", "Early symptoms warrant timely assessment and control rather than delayed response."),
      ],
      referenceTopic: "Hand-arm vibration assessment and control",
      challengePrompt: "List three operating variables that can change vibration exposure from the same nominal tool.",
    };
  }

  if (family === 2 && variant === 0) {
    const rwl = 24 + (seed % 13);
    const load = rwl + 8 + (seed % 15);
    const li = load / rwl;
    return {
      competency: "Manual material handling",
      objective: "Calculate and interpret a lifting index from a stated recommended limit.",
      difficulty: 3,
      stem: `${lead}. A valid task model yields a recommended weight limit of ${rwl} lb; the actual two-handed load is ${load} lb. Using LI = load/RWL, what is the result and best interpretation?`,
      correct: answer(`LI ${rounded(li, 2)}; modeled demand exceeds the recommended limit and warrants task redesign`, `Dividing ${load} by ${rwl} gives ${rounded(li, 2)}. The index supports prioritization but does not diagnose a specific worker's injury.`),
      distractors: [
        answer(`LI ${rounded(rwl / load, 2)}; the reversed ratio proves the task is safe`, "This reverses the defined ratio, and no index proves universal safety."),
        answer(`LI ${load - rwl}; subtracting pounds gives a dimensionless risk index`, "Subtraction retains units and is not the stated lifting-index formula."),
        answer("LI 1.00 because every two-handed lift is normalized", "The actual load is greater than the modeled recommended limit."),
      ],
      referenceTopic: "Lifting index calculation and limits",
      challengePrompt: "Identify two geometry or frequency changes that could improve the modeled result.",
    };
  }

  if (family === 2) {
    const highRate = 5 + (seed % 4);
    const highMinutes = 20 + (seed % 3) * 5;
    const lowRate = 1.5 + (seed % 4) * 0.5;
    const lowMinutes = 60 - highMinutes;
    const average = (highRate * highMinutes + lowRate * lowMinutes) / 60;
    return {
      competency: "Metabolic workload",
      objective: "Calculate duration-weighted metabolic demand over a work-rest cycle.",
      difficulty: 3,
      stem: `${lead}. Each hour includes ${highMinutes} min at ${highRate} kcal/min and ${lowMinutes} min at ${rounded(lowRate, 1)} kcal/min. What is the time-weighted average metabolic rate?`,
      correct: answer(`${rounded(average, 2)} kcal/min`, `Total hourly energy divided by 60 min is [(${highRate} x ${highMinutes}) + (${rounded(lowRate, 1)} x ${lowMinutes})]/60 = ${rounded(average, 2)} kcal/min.`),
      distractors: [
        answer(`${rounded(highRate, 2)} kcal/min`, "This reports the higher task rate and ignores the lower-rate interval."),
        answer(`${rounded(highRate * highMinutes + lowRate * lowMinutes, 1)} kcal/min`, "This is total energy per hour expressed as though it were a per-minute rate."),
        answer(`${rounded(highRate * highMinutes / 60, 2)} kcal/min`, "This omits the metabolic demand during the lower-rate period."),
      ],
      referenceTopic: "Work-rest metabolic averaging",
      challengePrompt: "Explain why an average workload alone may not capture short periods of extreme demand.",
    };
  }

  if (family === 3 && variant === 0) {
    const load = 150 + (seed % 8) * 20;
    const oldArm = 0.35 + (seed % 4) * 0.05;
    const newArm = 0.15 + (seed % 3) * 0.03;
    const oldMoment = load * oldArm;
    const newMoment = load * newArm;
    const reduction = ((oldMoment - newMoment) / oldMoment) * 100;
    return {
      competency: "Biomechanics",
      objective: "Compare external moments before and after a reach-distance redesign.",
      difficulty: 4,
      stem: `${lead}. In a simplified model, a ${load} N load moves from ${rounded(oldArm, 2)} m to ${rounded(newArm, 2)} m horizontally from the low back. Ignoring other forces, what percent reduction in external moment results?`,
      correct: answer(`${rounded(reduction, 1)}%`, `Moments are ${rounded(oldMoment, 1)} and ${rounded(newMoment, 1)} N-m; their reduction relative to the original is ${rounded(reduction, 1)}%.`),
      distractors: [
        answer(`${rounded((newMoment / oldMoment) * 100, 1)}%`, "This is the percentage of original moment remaining, not the reduction."),
        answer(`${rounded(oldMoment - newMoment, 1)}%`, "This reports a moment difference numerically as though it were a percentage."),
        answer(`${rounded((oldArm - newArm) * 100, 1)}%`, "This converts an absolute distance difference into a percentage without dividing by the original distance."),
      ],
      referenceTopic: "Moment arms and external loading",
      challengePrompt: "State why this simplified external-moment comparison cannot predict individual injury by itself.",
    };
  }

  if (family === 3) {
    const alarmCount = 25 + (seed % 8) * 5;
    const condition = pick(["cooling loss", "pressure upset", "power disturbance", "feed interruption", "ventilation failure", "control-network interruption"], seed);
    return {
      competency: "Cognitive ergonomics",
      objective: "Redesign alarms to support attention, diagnosis, and action under high workload.",
      difficulty: 4,
      stem: `${lead}. A ${condition} produces ${alarmCount} nearly identical alarms in two minutes; operators silence the panel while searching for the initiating condition. What is the strongest redesign?`,
      correct: answer("Rationalize alarms by consequence and required action, suppress predictable cascades, use meaningful priorities and diagnostic context, then validate performance in realistic upset scenarios", "The redesign directs limited attention to actionable information and tests whether operators can detect, diagnose, and respond."),
      distractors: [
        answer("Make every alarm louder and use the same priority", "More intensity does not resolve ambiguity or competing signals."),
        answer("Add alarms for every intermediate variable without removing nuisance signals", "Additional undifferentiated alarms increase overload."),
        answer("Discipline operators for silencing alarms while leaving the interface unchanged", "Punishment does not repair the information-design failure that drives the behavior."),
      ],
      referenceTopic: "Alarm management and cognitive workload",
      challengePrompt: "Define one detection-time and one diagnosis-accuracy measure for scenario validation.",
    };
  }

  if (family === 4 && variant === 0) {
    const schedule = pick(["rapid backward rotation", "successive 14-hour duties", "unpredictable overnight call-backs", "short turnarounds between shifts", "extended commuting after night work", "critical troubleshooting near dawn"], seed);
    return {
      competency: "Fatigue risk management",
      objective: "Control fatigue through scheduling, work design, and operational safeguards.",
      difficulty: 5,
      stem: `${lead}. An outage plan depends on ${schedule}, and coffee is presented as the primary safeguard. What is the strongest response?`,
      correct: answer("Redesign staffing and duty timing to protect sleep and recovery, limit safety-critical work after extended duty or at circadian lows, use controlled breaks and handoffs, assess fitness and commute risk, and monitor precursors", "Fatigue control must address the organizational determinants of wakefulness and recovery rather than relying on stimulants."),
      distractors: [
        answer("Accept the schedule because caffeine restores the effects of lost sleep", "Caffeine may temporarily alter alertness but does not replace restorative sleep."),
        answer("Tell workers to sleep more without creating adequate off-duty opportunity", "Personal advice cannot overcome a schedule that removes recovery time."),
        answer("Evaluate only injuries after the outage", "Injuries are sparse and delayed and miss fatigue-related errors, microsleeps, and near misses."),
      ],
      referenceTopic: "Fatigue risk management systems",
      challengePrompt: "Propose two leading indicators that could reveal deterioration before an injury.",
    };
  }

  const device = pick(["passive shoulder exoskeleton", "wearable posture alert", "powered lift-assist arm", "sit-stand platform", "anti-fatigue mat", "new torque-reaction tool"], seed);
  const tradeoff = pick(["restricted emergency egress", "new trunk pressure", "interference with fall protection", "slower escape from a pinch zone", "greater lower-leg discomfort", "unexpected reaction forces"], seed + 4);
  return {
    competency: "Ergonomic intervention evaluation",
    objective: "Evaluate whole-system tradeoffs before scaling an ergonomic intervention.",
    difficulty: 5,
    stem: `${lead}. A pilot ${device} lowers one measured exposure, but users report ${tradeoff} and task time changes substantially. What should the ergonomics team do?`,
    correct: answer("Keep the pilot controlled, evaluate total biomechanical and operational effects across representative users and tasks, address compatibility and failure modes, compare source redesign alternatives, and scale only after net benefit is demonstrated", "Reducing one metric is not enough if exposure is transferred or emergency and task performance deteriorate."),
    distractors: [
      answer("Deploy immediately because one muscle or posture measure improved", "A single favorable measure can conceal transferred load and safety-critical incompatibility."),
      answer("Ignore worker reports because instrumentation is always more valid", "Measurements and user experience capture different, complementary aspects of performance and harm."),
      answer("Ban every assistive technology without further evaluation", "The evidence supports disciplined evaluation, not an unsupported categorical conclusion."),
    ],
    referenceTopic: "Ergonomic technology validation and risk transfer",
    challengePrompt: "Define one exposure, one usability, and one emergency-performance acceptance criterion for the pilot.",
  };
}

type ScenarioSpec = Readonly<{
  difficulty: Difficulty;
  competency: string;
  objective: string;
  details: readonly string[];
  prompts: readonly string[];
  correct: Answer;
  distractors: readonly [Answer, Answer, Answer];
  topics: readonly string[];
  challengePrompt: string;
}>;

function spec(
  difficulty: Difficulty,
  competency: string,
  objective: string,
  details: readonly string[],
  prompts: readonly string[],
  correct: readonly [string, string],
  wrong: readonly [readonly [string, string], readonly [string, string], readonly [string, string]],
  topics: readonly string[],
  challengePrompt: string,
): ScenarioSpec {
  return {
    difficulty,
    competency,
    objective,
    details,
    prompts,
    correct: answer(correct[0], correct[1]),
    distractors: [answer(wrong[0][0], wrong[0][1]), answer(wrong[1][0], wrong[1][1]), answer(wrong[2][0], wrong[2][1])],
    topics,
    challengePrompt,
  };
}

function buildCatalogDraft(
  pool: QuestionPool,
  domainId: DomainId,
  index: number,
  catalog: readonly ScenarioSpec[],
): Draft {
  const specIndex = (index - 1) % catalog.length;
  const cycle = Math.floor((index - 1) / catalog.length);
  const spec = catalog[specIndex];
  const variant = cycle + poolNumber(pool) * 3 + specIndex;
  const detail = spec.details[(cycle + specIndex + poolNumber(pool)) % spec.details.length];
  const prompt = spec.prompts[(cycle * 2 + specIndex + poolNumber(pool)) % spec.prompts.length];
  const referenceTopic = spec.topics[variant % spec.topics.length];
  const correct = answer(spec.correct.text, spec.correct.rationale);
  const distractors: readonly [Answer, Answer, Answer] = [
    answer(spec.distractors[0].text, spec.distractors[0].rationale),
    answer(spec.distractors[1].text, spec.distractors[1].rationale),
    answer(spec.distractors[2].text, spec.distractors[2].rationale),
  ];
  return {
    competency: spec.competency,
    objective: spec.objective,
    difficulty: spec.difficulty,
    stem: `${context(pool, domainId, index)}. ${detail} ${prompt}`,
    correct,
    distractors,
    referenceTopic,
    challengePrompt: spec.challengePrompt,
  };
}

const A3_MOCK_A: readonly ScenarioSpec[] = [
  spec(1, "Cumulative manual-handling exposure", "Commission material flow against both peak and accumulated handling demand.",
    ["A kitting change lowers the heaviest case weight but doubles lifts per shift.", "Partial pallets require repeated low-level handling across several aisles.", "A smaller tote reduces peak load yet adds long carries and more transfers.", "Relief workers inherit the highest-volume handling period without mechanical assistance."],
    ["What evidence and redesign best support acceptance?", "How should the handling system be commissioned?"],
    ["Measure load, frequency, carry distance, posture, and recovery across the full cycle, redesign flow and container size, provide suitable handling assistance, and verify peak and cumulative demand with representative workers", "A lower single lift does not establish acceptable total demand when frequency, distance, posture, or recovery changes."],
    [["Approve from maximum case weight alone", "Peak weight omits cumulative frequency, travel, and posture."], ["Rotate workers through the unchanged demand", "Rotation distributes exposure but does not reduce system demand."], ["Use soreness reports as the sole acceptance test", "Symptoms are delayed and cannot replace task measurement and design verification."]],
    ["Mock A cumulative handling commissioning", "Mock A material-flow demand validation"], "Define one peak-demand and one cumulative-demand acceptance measure."),
  spec(2, "Push-pull system commissioning", "Calculate force reduction and validate carts under representative route conditions.",
    ["A wheel-and-floor correction lowers measured startup force from 60 N to 40 N.", "A caster change lowers measured startup force from 72 N to 48 N.", "A route repair lowers measured startup force from 90 N to 60 N.", "A bearing repair lowers measured startup force from 45 N to 30 N."],
    ["Using reduction = (original - corrected)/original, what result and follow-up are strongest?", "What percentage reduction was achieved, and what still requires verification?"],
    ["33.3% reduction; confirm initial and sustained forces at credible loads, route conditions, and maneuvers", "Each stated pair reduces force by one third; field acceptance must still cover the loaded route and maneuvering demand."],
    [["66.7% reduction; treat the remaining-force percentage as the reduction", "The corrected force is 66.7% of original, so the reduction is 33.3%."], ["20% reduction; subtract force values without dividing by the original", "A force difference in newtons is not a percentage until normalized to the original."], ["150% reduction; divide original force by corrected force", "The original-to-corrected ratio is not the fractional reduction."]],
    ["Mock A cart-force field validation", "Mock A route-and-caster commissioning"], "Name the worst credible cart load and route segment for the acceptance trial."),
  spec(3, "Hand-tool reaction control", "Control torque and grip demand through tool-fixture design and abnormal-condition testing.",
    ["A fastening tool twists the wrist when a bolt suddenly seats.", "A right-angle drill binds intermittently in layered material.", "An impact tool requires high pinch force because its suspension is poorly placed.", "A powered cutter produces an unexpected reaction when the blade jams."],
    ["What engineering response should be validated?", "Which design basis best controls the observed exposure?"],
    ["Capture reaction at the tool or fixture, support tool weight, provide neutral and appropriately sized grips, control trigger demand, and test normal operation, stalls, jams, and foreseeable misalignment", "Source and interface design can reduce both routine muscular demand and transient reaction forces that coaching cannot reliably overcome."],
    [["Teach operators to resist every reaction with greater grip force", "Greater grip can increase fatigue and does not control stall or jam torque."], ["Judge the tool only while free-running", "Free-running tests omit the high-demand contact and fault conditions."], ["Issue thicker gloves without checking trigger and grip effects", "Gloves can change dexterity and required force and are not a source control."]],
    ["Mock A torque-reaction verification", "Mock A powered-tool interface acceptance"], "Specify one normal and one fault-condition measure for the tool trial."),
  spec(4, "Seated whole-body vibration", "Calculate seat transmissibility and interpret it within a multi-axis field evaluation.",
    ["Representative vertical acceleration is 0.80 m/s2 at the floor and 0.60 m/s2 at the seat.", "Representative vertical acceleration is 1.20 m/s2 at the floor and 0.90 m/s2 at the seat.", "Representative vertical acceleration is 0.60 m/s2 at the floor and 0.45 m/s2 at the seat.", "Representative vertical acceleration is 1.60 m/s2 at the floor and 1.20 m/s2 at the seat."],
    ["Using transmissibility = seat/floor, what result and interpretation are defensible?", "What is the measured transmissibility, and what does it establish?"],
    ["0.75; the seat reduces this measured axis by 25%, while other axes, shocks, route, speed, and duration still require evaluation", "For every pair, seat acceleration divided by floor acceleration is 0.75; that result applies only to the measured condition and axis."],
    [["1.33; reverse the floor and seat terms", "This is the reciprocal of the defined seat-to-floor relationship."], ["0.20; treat an acceleration difference as a dimensionless ratio", "Subtraction retains acceleration units and is not transmissibility."], ["75% reduction; interpret transmissibility itself as the fraction removed", "A transmissibility of 0.75 means 75% remains and 25% is reduced for that measurement."]],
    ["Mock A seat-transmissibility commissioning", "Mock A mobile-route vibration validation"], "Identify the seat and chassis measurements needed to calculate transmissibility."),
  spec(5, "Visual-task ergonomics", "Correct luminance, contrast, glare, and viewing geometry for the actual inspection task.",
    ["Inspectors tilt polished parts to escape reflections from overhead luminaires.", "A bright window washes out a low-contrast display during the day shift.", "Fine defects are missed when operators alternate between a dark enclosure and a bright screen.", "A magnifier improves detail but forces sustained neck flexion and a short working distance."],
    ["Which commissioning response best addresses performance and strain?", "What should be measured and redesigned before acceptance?"],
    ["Characterize task contrast, luminance, glare, adaptation, and viewing distance, then reposition or shield sources and targets, provide controllable task lighting, and verify detection accuracy and posture", "Visual performance and posture are linked to the light-source, surface, target, and viewing geometry under representative conditions."],
    [["Increase general illumination to the maximum setting", "More light can worsen reflected glare and adaptation without improving target contrast."], ["Tell inspectors to lean closer whenever detail is uncertain", "Closer viewing can transfer the problem into sustained neck and visual demand."], ["Use comfort ratings without checking defect detection", "Comfort alone does not demonstrate required visual task performance."]],
    ["Mock A glare-and-contrast commissioning", "Mock A visual-inspection performance validation"], "Define one visual-performance and one posture criterion for the trial."),
  spec(3, "Control-display compatibility", "Validate mapping and feedback for both routine and upset operation.",
    ["Two adjacent valves use identical controls but opposite movement conventions.", "A touch screen relocates an emergency function between operating modes.", "Remote and local displays use different equipment names for the same pump.", "A speed control gives delayed feedback and operators routinely overshoot the target."],
    ["What design and validation approach is strongest?", "How should the interface be commissioned?"],
    ["Apply consistent control-display mapping, clear discrimination and state feedback, protect critical actions from mode error, and test detection, selection, recovery, and response time in representative scenarios", "Compatible mapping and timely feedback reduce predictable selection and mode errors while scenario testing demonstrates operational performance."],
    [["Rely on operator memory to resolve inconsistent mappings", "Memory is a weak control for a predictable interface incompatibility."], ["Add more colors without checking discrimination or meaning", "Additional coding can create ambiguity and accessibility problems."], ["Validate only the most common automatic mode", "Rare transitions and upset modes often contain the critical interaction demands."]],
    ["Mock A control-display mapping trial", "Mock A mode-error interface commissioning"], "Write one scenario that challenges mode awareness without coaching."),
  spec(2, "Reach and clearance commissioning", "Demonstrate access and clearance across the intended population and work conditions.",
    ["A guarded reset is reachable by the median user but not a short user in required PPE.", "A maintenance access opening fits standing users but excludes a seated technician.", "A control is within static reach yet requires trunk twisting during repeated cycles.", "A tall user's knee clearance interferes with a foot-operated emergency control."],
    ["Which acceptance method is most defensible?", "How should accommodation be demonstrated?"],
    ["Define the intended user and task population, set protective reach and clearance boundaries, provide adjustment or alternate access, and test posture, force, visibility, and PPE effects with boundary users", "Commissioning must demonstrate the complete interaction at relevant population boundaries rather than rely on an average dimension."],
    [["Approve from the population mean", "An average can exclude users at both ends of the distribution."], ["Test reach without the required clothing and equipment", "PPE and tools can materially change reach, clearance, force, and visibility."], ["Assign the task permanently to whoever fits the prototype", "Worker selection does not establish an inclusive and sustainable design."]],
    ["Mock A boundary-user accommodation test", "Mock A adjustable-access commissioning"], "Identify the two user-task boundaries most likely to govern acceptance."),
  spec(4, "Work-recovery cycle validation", "Evaluate whether task design and recovery support sustained performance across the shift.",
    ["A paced assembly cell adds brief pauses but increases peak hand force.", "A scanning task alternates rapidly yet repeats the same wrist and visual demands.", "A recovery station is available but production flow prevents workers from using it.", "Output remains stable while force errors and grip substitutions rise late in the shift."],
    ["What evidence should drive redesign?", "Which intervention best supports durable performance?"],
    ["Measure force, repetition, posture, error, and recovery opportunity across the shift, reduce the dominant task demand and pacing constraint, then verify that recovery is usable and performance remains stable", "Nominal pauses or task variety do not create recovery when exposure continues or production constraints prevent effective use."],
    [["Count scheduled pauses without observing whether they occur", "A planned recovery period is not effective if work organization prevents its use."], ["Rotate between tasks that load the same tissues", "Rotation offers little recovery when the underlying demands are similar."], ["Wait for injury counts to confirm fatigue", "Injuries are delayed and insensitive to deteriorating force, posture, and error precursors."]],
    ["Mock A work-recovery performance test", "Mock A paced-task endurance commissioning"], "Select one exposure and one performance trend to follow across the shift."),
];

const A3_MOCK_B: readonly ScenarioSpec[] = [
  spec(5, "Assist-device failure and escape", "Evaluate ergonomic assistance against credible failure and emergency demands.",
    ["A powered shoulder assist locks high when emergency egress begins.", "A lift-assist battery depletion leaves a suspended load and constrained operator.", "A wearable frame catches on a ladder transition used for evacuation.", "A passive support reduces exertion but slows release from a pinch-zone approach."],
    ["What assurance decision is required before deployment?", "Which whole-system evidence should govern scale-up?"],
    ["Analyze loss of power, unintended motion, entanglement, release, rescue, and egress, add fail-safe and rapid-doffing features, and validate assisted and failed states in representative emergency tasks", "An assist device is acceptable only when its normal benefit does not create intolerable failure, escape, or rescue consequences."],
    [["Scale up because the normal-cycle exertion measure improved", "A routine exposure benefit does not resolve emergency and failure-state risk."], ["Treat battery state as the user's responsibility", "Design and operating controls must manage predictable energy loss and status awareness."], ["Exclude emergency movement from the ergonomic evaluation", "Emergency compatibility is part of the worker-system performance boundary."]],
    ["Mock B assist-device fail-safe assurance", "Mock B exosystem emergency compatibility"], "Define the failed-state scenario most likely to reject the device."),
  spec(5, "Circadian-critical work design", "Protect critical decisions from schedule, circadian, and handoff degradation.",
    ["A complex startup is scheduled near dawn after an extended outage shift.", "Backward-rotating shifts place a safety-critical alignment after short recovery.", "On-call troubleshooting follows a full day shift and a long commute.", "A night crew inherits unresolved alarms through an abbreviated handoff."],
    ["Which assurance strategy best controls the risk?", "How should staffing and timing be redesigned?"],
    ["Move critical work away from circadian lows and extended duty where feasible, provide sufficient staffing and recovery, formalize handoffs and cross-checks, set fitness limits, and monitor fatigue precursors", "Fatigue assurance addresses schedule design, critical-task timing, recovery opportunity, and error trapping instead of relying on individual alertness."],
    [["Use caffeine as the primary readiness criterion", "A stimulant cannot replace sleep, sound scheduling, or independent verification."], ["Ask each worker to self-manage an unchanged roster", "Individual advice cannot correct a roster that systematically removes recovery."], ["Review only injuries after the schedule ends", "Lagging outcomes miss fatigue-related errors, microsleeps, and degraded decisions."]],
    ["Mock B circadian task-timing assurance", "Mock B fatigue-sensitive handoff design"], "State one schedule trigger that should defer a critical task."),
  spec(4, "Interruption-resilient maintenance", "Design placekeeping and verification for interrupted safety-critical procedures.",
    ["A technician resumes a long isolation sequence after an emergency call.", "Two crews alternate steps in a calibration without a shared state display.", "A checklist resets to its first screen after a device battery change.", "A verbal interruption occurs just before an independent verification step."],
    ["What system design most strongly prevents omission or repetition?", "Which control should govern resumption?"],
    ["Make task state externally visible, use positive placekeeping and controlled handoff, require a defined safe restart point and independent verification for critical steps, and test interruption recovery", "Reliable resumption depends on preserved state and designed recovery rather than unaided prospective memory."],
    [["Tell technicians to concentrate harder after interruptions", "Attention advice does not preserve task state or reveal an omitted step."], ["Restart wherever the worker believes the task stopped", "Memory-based resumption can omit or repeat safety-critical actions."], ["Remove all documentation to reduce clutter", "Eliminating state records worsens coordination and verification."]],
    ["Mock B interrupted-task placekeeping", "Mock B maintenance-resumption assurance"], "Design one observation that tests recovery from a realistic interruption."),
  spec(4, "Remote-control latency and feedback", "Assure teleoperation when delay, dropout, and viewpoint affect control.",
    ["A remote manipulator continues moving briefly after the video freezes.", "Network delay varies during a precision lift near occupied equipment.", "The camera view hides contact force as a tool begins to bind.", "Operators cannot distinguish a delayed command from a failed actuator."],
    ["What validation and control architecture is strongest?", "Which evidence must be established before remote operation?"],
    ["Bound latency, jitter, dropout, and field-of-view limits, provide unambiguous command and equipment-state feedback, establish fail-safe motion behavior, and validate workload and recovery under degraded communications", "Teleoperation is safe only when information and control delays, loss modes, feedback, and human workload are explicitly designed and tested."],
    [["Use average network speed as the sole acceptance measure", "Averages hide delay variation and dropouts that drive control error."], ["Assume a sent command proves equipment response", "Command transmission and physical execution are different states."], ["Train operators to predict an unbounded delay", "Training cannot compensate for uncontrolled latency and ambiguous feedback."]],
    ["Mock B teleoperation degraded-mode assurance", "Mock B remote-feedback latency validation"], "Set one degraded-communication condition that the system must enter safely."),
  spec(3, "Exposure-transfer assurance", "Compare complete task demand before and after a material-flow redesign.",
    ["A conveyor removes lifting but creates continuous shoulder-level reaching.", "Smaller containers reduce load weight but triple handling frequency.", "A turntable reduces twisting yet adds high push force when fully loaded.", "A lift table improves posture but blocks access and lengthens carrying distance."],
    ["How should net ergonomic benefit be demonstrated?", "What comparison is required before scale-up?"],
    ["Compare force, frequency, posture, duration, travel, recovery, and variability across the complete old and new workflows, correct transferred demand, and require improvement in representative peak and cumulative conditions", "A redesign is successful only when it lowers total relevant exposure instead of shifting demand to another tissue, task phase, or worker."],
    [["Approve from the single metric that improved", "One measure can conceal increased demand elsewhere in the workflow."], ["Count the number of redesigned components", "Component completion does not demonstrate worker exposure reduction."], ["Ignore downstream handling because it occurs in another department", "Exposure transfer across task and organizational boundaries remains part of system impact."]],
    ["Mock B whole-workflow exposure comparison", "Mock B ergonomic burden-transfer assurance"], "Identify one downstream task that must be included in the before-and-after comparison."),
  spec(2, "Rotation and shared exposure", "Distinguish true recovery from redistribution of the same ergonomic demand.",
    ["Workers rotate among three jobs that all require forceful pinch grip.", "A rotation schedule alternates standing tasks with the same overhead reach.", "A high-repetition station is divided among more employees without redesign.", "Two nominally different jobs load the same shoulder through different motions."],
    ["Which analysis and control decision is most defensible?", "How should the rotation proposal be evaluated?"],
    ["Quantify the tissue-specific force, posture, repetition, duration, and recovery for each assignment, redesign the common source of demand, and use rotation only when it creates demonstrated recovery without spreading harm", "Job labels do not establish exposure diversity; effective rotation must change the relevant demand and support recovery."],
    [["Approve whenever job titles differ", "Different titles can contain the same tissue and recovery demands."], ["Use rotation to avoid changing the workstation", "Redistribution is not a substitute for feasible source reduction."], ["Judge success from equal time at each station", "Equal duration does not mean equivalent demand or adequate recovery."]],
    ["Mock B tissue-demand rotation assurance", "Mock B shared-exposure work design"], "Map the dominant tissue demand across all proposed rotation jobs."),
  spec(3, "Wearable-feedback governance", "Use wearable data without substituting alerts for source control or valid assessment.",
    ["A posture wearable alarms during safe reaching but misses high-force neutral work.", "Supervisors rank employees from a device that has not been validated for the task.", "Workers change natural movement to suppress nuisance vibration alerts.", "A dashboard stores individual movement traces without a defined safety purpose."],
    ["What governance should precede continued reliance?", "Which validation and use boundary is required?"],
    ["Define the safety purpose, validate signals against relevant exposure and task outcomes, control false alerts and behavior adaptation, protect worker data, retain source-focused redesign, and monitor subgroup performance", "Wearable feedback can support learning or assessment only within a validated purpose and cannot replace control of force, task, or workstation design."],
    [["Treat every alert as proof of unsafe behavior", "An unvalidated alert may reflect normal movement, sensor error, or an incomplete exposure model."], ["Use the device ranking for discipline without review", "Opaque and unvalidated scoring creates fairness and validity risks."], ["Stop evaluating the physical task once sensors are installed", "Instrumentation does not remove the underlying ergonomic exposure."]],
    ["Mock B wearable-validity governance", "Mock B ergonomic-data purpose control"], "Specify one false-positive and one subgroup-performance check."),
  spec(2, "Emergency-control accessibility", "Assure recognition, reach, force, and operation under emergency and PPE conditions.",
    ["A gloved operator cannot distinguish adjacent emergency controls by touch.", "A stop control is visible but unreachable from the recovery position after a jam.", "Required respiratory equipment blocks the sightline to a shutdown indicator.", "A low-force control becomes difficult to operate when contamination covers its surface."],
    ["What assurance test should govern the design?", "Which accessibility evidence is required?"],
    ["Test recognition, reach, clearance, operating force, feedback, and error recovery with boundary users in required PPE and credible body positions, then redesign location, coding, guarding, or actuation where performance fails", "Emergency accessibility depends on the full user-control interaction under real clothing, visibility, posture, and time pressure."],
    [["Approve because the control meets a drawing dimension", "A nominal dimension does not demonstrate recognition and operation in the use condition."], ["Remove control guarding without evaluating inadvertent activation", "Reach improvement cannot create a new accidental-operation hazard."], ["Test only an unencumbered average user", "Average-user testing without PPE omits foreseeable accommodation boundaries."]],
    ["Mock B emergency-control usability assurance", "Mock B PPE-accessible actuation test"], "Define one boundary-user and one degraded-visibility trial."),
];

const A4_PRACTICE: readonly ScenarioSpec[] = [
  {
    difficulty: 1,
    competency: "Combustion and suppression fundamentals",
    objective: "Match a suppression action to the fire-tetrahedron element it controls.",
    details: [
      "A deep-seated ordinary-combustible fire continues glowing beneath surface flame.",
      "A small solvent flame is fed by a valve that can be closed remotely.",
      "A cooking-media fire remains hot enough to reignite after visible flame disappears.",
      "A reactive flame front persists until a suitable agent interrupts flame chemistry.",
    ],
    prompts: ["Which control principle should drive agent and tactic selection?", "What is the best conceptual basis for selecting the primary extinguishing action?"],
    correct: answer("Target the sustaining element that can be safely and effectively removed: heat, fuel, oxygen availability, or chain reaction", "Suppression succeeds by interrupting one or more required combustion elements, with tactics matched to fuel and conditions."),
    distractors: [
      answer("Select solely by flame color", "Flame appearance does not establish agent compatibility or the controlling combustion mechanism."),
      answer("Use the greatest possible pressure regardless of fuel", "Application force can spread fuels and does not determine extinguishing compatibility."),
      answer("Assume every fire is controlled most safely with water", "Water can be ineffective or hazardous for some fuels, energies, and reactions."),
    ],
    topics: ["Practice combustion-element control selection", "Practice fuel-specific suppression mechanism"],
    challengePrompt: "Give one example in which removing heat is effective and one in which fuel isolation is the safer priority.",
  },
  {
    difficulty: 1,
    competency: "Means of egress and compartmentation",
    objective: "Preserve unobstructed egress and rated separation functions.",
    details: [
      "A rated corridor door is wedged open beside temporary pallet storage.",
      "A cable penetration through an exit enclosure is packed with ordinary foam.",
      "A delivery blocks part of the only available exit path during occupied hours.",
      "An automatic-closing smoke door is disconnected because it slows material movement.",
    ],
    prompts: ["What is the strongest immediate response?", "Which action best restores the intended life-safety function?"],
    correct: answer("Control occupancy or work as needed, restore the clear exit and rated barrier function with approved components, and correct the management condition that allowed defeat", "Egress continuity and compartmentation must work when an emergency occurs; warnings do not substitute for their physical functions."),
    distractors: [
      answer("Add a warning sign and leave the condition unchanged", "A sign neither clears the route nor restores fire and smoke resistance."),
      answer("Wait for the next scheduled annual inspection", "Emergency need is unpredictable, so known life-safety impairment requires timely action."),
      answer("Rely on smoke detection as a replacement for the barrier", "Detection warns but does not contain fire or maintain a tenable route."),
    ],
    topics: ["Practice exit-route continuity", "Practice rated-opening integrity"],
    challengePrompt: "Identify one inspection point that verifies both physical condition and day-to-day management of the feature.",
  },
  {
    difficulty: 2,
    competency: "Detection and notification",
    objective: "Match detection and notification design to fire signature and occupant needs.",
    details: [
      "A dusty process creates nuisance smoke alarms but can develop rapid heat release.",
      "A clean office has a credible slow-smoldering cable fire before significant heat develops.",
      "A noisy production area prevents some workers from hearing the existing alarm.",
      "A cold high-bay space delays ceiling-level signatures and has tall storage obstructions.",
    ],
    prompts: ["What design approach is strongest?", "How should the protection team resolve the mismatch?"],
    correct: answer("Select and place detection for the credible fire signature and environment, use accessible redundant notification, and validate response under representative conditions", "Detection technology and notification must be matched to how the event develops and how occupants actually receive and act on warning."),
    distractors: [
      answer("Use the same detector and audible tone everywhere", "Uniform devices can perform poorly where signatures, nuisance sources, acoustics, and occupant needs differ."),
      answer("Raise alarm volume without checking audibility, visibility, or intelligibility", "Loudness alone does not assure accessible, understandable warning."),
      answer("Disable troublesome devices without compensatory protection", "Removing detection reduces protection and does not solve selection or placement problems."),
    ],
    topics: ["Practice fire-signature detector matching", "Practice accessible occupant notification"],
    challengePrompt: "Define one acceptance test using a representative environmental or occupant condition.",
  },
  {
    difficulty: 2,
    competency: "Flammable-liquid and vapor control",
    objective: "Prevent ignition by controlling vapor release, charge, and ignition sources.",
    details: [
      "A dense solvent vapor can migrate from an open transfer toward a floor drain.",
      "Two conductive containers are connected during splash filling but neither is referenced to earth.",
      "A low-flash-point liquid is heated near an unclassified electrical fan.",
      "A transfer hose replacement has unknown electrical continuity and chemical compatibility.",
    ],
    prompts: ["Which control strategy best addresses the credible ignition pathway?", "What should be verified before transfer proceeds?"],
    correct: answer("Use closed or captured transfer, compatible conductive equipment, bonding and grounding as applicable, suitable electrical equipment, vapor monitoring, and controlled operating limits", "The controls limit vapor formation and migration while preventing static and electrical ignition sources."),
    distractors: [
      answer("Depend on odor to determine when vapor is safe", "Odor is variable, can cause exposure, and does not establish flammability."),
      answer("Dilute any spill into a drain with water", "Water can spread immiscible liquid and transfer fire and environmental risk."),
      answer("Use any fan as long as airflow feels strong", "Unsuitable electrical equipment can ignite the vapor it is intended to move."),
    ],
    topics: ["Practice static-control transfer design", "Practice dense-vapor ignition prevention"],
    challengePrompt: "Explain the distinct functions of bonding and grounding during conductive-container transfer.",
  },
  {
    difficulty: 3,
    competency: "Water-based fire protection",
    objective: "Interpret system demand and field evidence without relying on one nominal value.",
    details: [
      "A remote-area review omits hose demand and elevation loss from the supply comparison.",
      "A sprinkler test shows acceptable static pressure but a steep pressure collapse under flow.",
      "A storage change increases commodity challenge while the hydraulic basis remains unchanged.",
      "A tank's gross volume includes an unusable heel below reliable pump suction.",
    ],
    prompts: ["What is the most important analytical correction?", "Which conclusion best protects the design basis?"],
    correct: answer("Reconstruct the simultaneous flow-duration-pressure demand at the credible remote condition, use usable supply and verified curves, and reassess changed storage or impairment assumptions", "Adequacy depends on the complete demand and the supply available under flow, not static pressure or gross capacity alone."),
    distractors: [
      answer("Use static pressure as proof that all remote discharge demand is met", "Static pressure does not reveal friction and supply limitations under flow."),
      answer("Compare gross tank volume with one minute of sprinkler flow", "Usable duration and all simultaneous demands must be included."),
      answer("Assume protection remains adequate because piping has not changed", "Commodity, arrangement, demand, and water-supply conditions can change adequacy without pipe modification."),
    ],
    topics: ["Practice hydraulic demand-basis review", "Practice usable fire-water supply analysis"],
    challengePrompt: "List the demand components and supply evidence needed for one defensible comparison point.",
  },
  {
    difficulty: 3,
    competency: "Fire-protection impairment management",
    objective: "Control risk while an automatic protective feature is unavailable.",
    details: [
      "A damaged sprinkler main removes protection from high-piled storage for one shift.",
      "A fire pump is unavailable while hot work and deliveries remain scheduled.",
      "An alarm communication path fails during occupied night work.",
      "A rated fire door cannot close while replacement hardware is obtained.",
    ],
    prompts: ["What is the strongest impairment response?", "How should operations be governed until restoration?"],
    correct: answer("Identify affected functions, notify accountable parties, restrict ignition and fuel activities, provide suitable compensatory protection or stop work, expedite repair, and functionally verify restoration", "Impairment governance makes loss of protection visible and scales operations to the remaining defensible safeguards."),
    distractors: [
      answer("Continue normally because the impairment is temporary", "Duration does not remove the increased fire risk."),
      answer("Rely on employee awareness without formal controls", "Informal awareness does not establish accountability, compensation, or restoration verification."),
      answer("Close the impairment when repair work ends without testing", "Completed labor does not prove the protective function has been restored."),
    ],
    topics: ["Practice suppression-impairment governance", "Practice alarm-and-barrier compensatory control"],
    challengePrompt: "Write two objective restoration criteria that must be met before closing the impairment.",
  },
  {
    difficulty: 4,
    competency: "Combustible-dust hazard control",
    objective: "Prevent dust-cloud ignition and secondary propagation through layered controls.",
    details: [
      "Fine organic dust accumulates on elevated beams above an enclosed process.",
      "A collector connects several machines indoors without explosion isolation.",
      "Compressed-air cleaning routinely suspends settled metal powder.",
      "A product change creates finer particles but the dust-hazard basis is not reviewed.",
    ],
    prompts: ["Which program response is strongest?", "What system-level correction is needed?"],
    correct: answer("Confirm explosibility and process data, minimize release and deposits, use safe capture and housekeeping, control ignition, provide suitable explosion protection and isolation, and manage changes", "Dust safety requires simultaneous control of fuel accumulation, cloud formation, ignition, pressure, and propagation."),
    distractors: [
      answer("Use compressed air more often to move dust out of sight", "Compressed air can create an ignitable cloud and spread deposits."),
      answer("Rely only on portable extinguishers after ignition", "Portable response does not prevent rapid pressure development or secondary explosions."),
      answer("Treat ordinary burning behavior as proof that an explosion is impossible", "A material that burns can form an explosible cloud under suitable dispersion and confinement."),
    ],
    topics: ["Practice dust-cloud prevention and housekeeping", "Practice explosion isolation and propagation control"],
    challengePrompt: "Explain why elevated deposits can dominate consequence even when the initiating explosion is small.",
  },
  {
    difficulty: 5,
    competency: "Emerging fire hazards and integrated protection",
    objective: "Develop hazard-specific protection for complex energy and hot-work scenarios.",
    details: [
      "A large indoor battery installation can produce heat, flammable gas, propagation, and re-ignition.",
      "Hot work is proposed beside combustible sandwich panels during a suppression outage.",
      "Automated charging equipment parks damaged energy-storage units beside occupied space.",
      "A high-energy test enclosure vents toward an egress path and critical control room intake.",
    ],
    prompts: ["What is the strongest protection strategy?", "Which assurance approach is required before operation?"],
    correct: answer("Use a hazard-specific design basis integrating separation, source control, early warning, compatible fixed protection or cooling, isolation, emergency tactics, damaged-unit handling, and representative validation", "Complex fire behavior requires tested layers matched to credible propagation, gas, exposure, and re-ignition pathways."),
    distractors: [
      answer("Use ordinary smoke detection and portable extinguishers as the entire strategy", "Generic warning and portable response may not control propagation, gas, or prolonged heat release."),
      answer("Concentrate all hazardous units together without engineered separation", "Greater concentration can increase propagation and consequence."),
      answer("Assume the vendor warranty establishes fire-system adequacy", "Commercial warranty is not a site-specific hazard analysis or protection validation."),
    ],
    topics: ["Practice energy-storage propagation protection", "Practice high-energy hot-work integration"],
    challengePrompt: "Define one performance test for propagation control and one for safe emergency isolation.",
  },
];

const A4_MOCK_A: readonly ScenarioSpec[] = [
  {
    difficulty: 1,
    competency: "Fire-pump performance",
    objective: "Interpret pump test evidence across the operating curve.",
    details: ["Churn pressure is normal but rated-flow pressure has declined since the last accepted test.", "A pump starts automatically, yet suction pressure becomes unstable at high flow.", "A replacement impeller meets shutoff pressure but not the remote demand point."],
    prompts: ["What is the best conclusion?", "Which next step is most defensible?"],
    correct: answer("Evaluate the complete flow-pressure-suction performance against the accepted demand and investigate degradation before crediting the pump", "One operating point cannot demonstrate adequate pump performance across the required curve."),
    distractors: [answer("Accept the pump because it starts", "Starting does not establish flow and pressure capability."), answer("Use churn pressure alone", "Churn omits performance under fire flow."), answer("Raise alarm setpoints", "Alarm settings do not restore hydraulic capability.")],
    topics: ["Mock A fire-pump curve degradation", "Mock A suction-limited pump performance"],
    challengePrompt: "Name two physical causes of adequate churn pressure but deficient flow performance.",
  },
  {
    difficulty: 2,
    competency: "Smoke movement and tenability",
    objective: "Protect egress from smoke migration and pressure imbalance.",
    details: ["A stair pressurization fan drives smoke through an unsealed door gap on one level.", "A smoke-control zone loses makeup air when an exterior door opens.", "An atrium exhaust test produces untenable smoke at an upper bridge."],
    prompts: ["What should acceptance focus on?", "How should the design be corrected?"],
    correct: answer("Test pressure, flow, door forces, leakage, and tenability under credible configurations, then balance and seal the system as needed", "Smoke control is a whole-building airflow problem whose success is measured at occupied and egress locations."),
    distractors: [answer("Increase every fan to maximum speed", "Unbalanced flow can worsen leakage and door forces."), answer("Judge by fan rotation only", "Fan operation does not prove tenable conditions."), answer("Ignore open-door conditions", "Doors predictably open during evacuation and can change pressure balance.")],
    topics: ["Mock A smoke-control pressure balance", "Mock A egress-tenability commissioning"],
    challengePrompt: "Define one tenability and one door-operability acceptance measure.",
  },
  {
    difficulty: 3,
    competency: "Storage fire challenge",
    objective: "Reassess protection after commodity or arrangement changes.",
    details: ["Plastic content increases while storage height and aisle width also change.", "Open-top containers capture sprinkler water and shield lower levels.", "Solid shelving is added inside racks without hydraulic review."],
    prompts: ["What should occur before the arrangement is approved?", "Which analysis best addresses the changed challenge?"],
    correct: answer("Reclassify the commodity and arrangement, evaluate storage geometry and water obstruction, and verify detection, suppression, supply, and separation against the new design basis", "Fire challenge depends on material, packaging, height, geometry, and water access, not merely floor area."),
    distractors: [answer("Approve because the building footprint is unchanged", "Storage arrangement can change fire growth and sprinkler demand without changing footprint."), answer("Add portable extinguishers only", "Portable equipment cannot substitute for automatic protection of a growing storage fire."), answer("Use the former commodity classification", "Changed material and packaging require renewed classification.")],
    topics: ["Mock A commodity-change protection", "Mock A rack-obstruction fire challenge"],
    challengePrompt: "List three storage attributes that can change sprinkler effectiveness.",
  },
  {
    difficulty: 4,
    competency: "Special-agent compatibility",
    objective: "Select extinguishing media from fuel behavior and system limitations.",
    details: ["A water-reactive material shares drainage with a water-suppressed area.", "A polar solvent is introduced into a foam-protected process.", "A clean-agent enclosure gains unsealed cable penetrations."],
    prompts: ["What is the strongest management response?", "Which design-basis question must be resolved?"],
    correct: answer("Reevaluate agent compatibility, required concentration or application, containment, drainage, exposure, and testing before relying on the existing system", "Special protection depends on chemistry, enclosure and application conditions that can be invalidated by change."),
    distractors: [answer("Assume all foams work on all flammable liquids", "Fuel chemistry materially affects foam performance."), answer("Use more water regardless of reactivity", "Water can intensify some reactions."), answer("Credit nominal agent quantity despite leakage", "Loss of enclosure integrity can prevent design concentration.")],
    topics: ["Mock A special-agent chemical compatibility", "Mock A enclosure-integrity agent retention"],
    challengePrompt: "Identify one representative acceptance test for the changed protection basis.",
  },
  {
    difficulty: 5,
    competency: "Explosion protection",
    objective: "Coordinate venting, suppression, and isolation with safe discharge and connected equipment.",
    details: ["An explosion vent discharges toward an occupied walkway.", "A duct connects a protected vessel to an unprotected upstream machine.", "A suppression system is added without reviewing process pressure or detection time."],
    prompts: ["What is the principal system concern?", "Which assurance action is required?"],
    correct: answer("Analyze pressure development, detection and actuation, safe vent discharge, equipment strength, and flame-pressure propagation through every connection, then validate the integrated design", "Local protection can transfer lethal effects or allow propagation unless the complete connected system is evaluated."),
    distractors: [answer("Credit any vent panel regardless of discharge location", "Vented flame and pressure can endanger people and adjacent assets."), answer("Assume duct length guarantees isolation", "Flame and pressure can propagate through ducts."), answer("Select suppression only by vessel volume", "Reaction rate, detection, pressure limits, and distribution also matter.")],
    topics: ["Mock A explosion-vent discharge safety", "Mock A connected-equipment explosion isolation"],
    challengePrompt: "Explain why protecting one vessel can increase risk elsewhere if isolation is absent.",
  },
];

const A4_MOCK_B: readonly ScenarioSpec[] = [
  {
    difficulty: 1,
    competency: "Performance-based fire design",
    objective: "Define credible scenarios and measurable acceptance criteria.",
    details: ["A design claims equivalent safety without stating occupant assumptions.", "A model excludes the fire location closest to the only accessible exit.", "Sensitivity analysis omits door-open and suppression-failure conditions."],
    prompts: ["What is the most important correction?", "What must be established before accepting the analysis?"],
    correct: answer("Define credible scenarios, occupant and system assumptions, uncertainty and sensitivity cases, and measurable tenability and egress criteria, then independently review the evidence", "Performance claims are only as defensible as their scenarios, inputs, acceptance criteria, and treatment of uncertainty."),
    distractors: [answer("Accept the model because it produces detailed graphics", "Presentation quality is not validation."), answer("Use only the most favorable scenario", "A design must address credible adverse scenarios."), answer("Treat model outputs as exact", "Fire and occupant models contain material uncertainty.")],
    topics: ["Mock B fire-scenario adequacy", "Mock B model uncertainty and acceptance"],
    challengePrompt: "Name one sensitivity input and one tenability output that should be bounded.",
  },
  {
    difficulty: 2,
    competency: "Off-gas and propagation warning",
    objective: "Use early signatures and response logic for energy-storage events.",
    details: ["Off-gas detection alarms before visible smoke but operators lack response criteria.", "One module heats while adjacent modules remain below alarm thresholds.", "Ventilation can either dilute gas or spread it toward an ignition source."],
    prompts: ["What is the best control response?", "Which operating logic should be established?"],
    correct: answer("Link validated early signatures to isolation, shutdown, evacuation, ventilation mode, responder notification, and propagation-control actions with clear thresholds", "Early detection creates value only when its reliability and action logic are defined and rehearsed."),
    distractors: [answer("Wait for visible flame before acting", "Delay forfeits the purpose of early warning."), answer("Use ventilation in one fixed mode for every event", "Airflow can help or worsen migration depending on design and event phase."), answer("Depend on odor", "Odor is unreliable and may expose personnel.")],
    topics: ["Mock B off-gas action thresholds", "Mock B thermal-propagation response logic"],
    challengePrompt: "Define one false-alarm safeguard that does not delay action during a credible event.",
  },
  {
    difficulty: 3,
    competency: "Construction-phase fire safety",
    objective: "Maintain temporary protection as building hazards and egress change.",
    details: ["Combustible finish accumulates before permanent sprinklers are active.", "Temporary stairs change while hot work continues on upper floors.", "A standpipe segment is isolated without updating responder access."],
    prompts: ["What is the strongest project control?", "How should changing construction risk be governed?"],
    correct: answer("Use phase-specific fire plans, temporary detection and suppression, controlled hot work and housekeeping, maintained egress and responder access, impairment visibility, and frequent field verification", "Construction changes fuel, ignition, access, and protection faster than a static occupancy plan can track."),
    distractors: [answer("Wait for permanent systems before managing fire risk", "The construction phase itself can present severe fire hazards."), answer("Use the completed-building evacuation map", "Routes and access change during construction."), answer("Rely only on contractor insurance", "Financial transfer does not control ignition, fuel, or egress.")],
    topics: ["Mock B phased-construction fire controls", "Mock B temporary responder-access assurance"],
    challengePrompt: "Name two triggers that require immediate revision of the construction fire plan.",
  },
  {
    difficulty: 4,
    competency: "Exterior exposure and wildland interface",
    objective: "Reduce structure ignition from embers, radiant heat, and limited response access.",
    details: ["Combustible debris accumulates beside exterior air intakes.", "An adjacent yard stores combustible pallets against the wall.", "Seasonal vegetation and one access road constrain fire-service approach."],
    prompts: ["Which layered strategy is strongest?", "What should the exposure review prioritize?"],
    correct: answer("Control exterior fuel and storage, harden openings and vulnerable construction, manage ember entry and air systems, maintain water and access, and establish monitored shutdown and evacuation triggers", "Exterior fire risk involves both ignition exposure and the facility's ability to resist, detect, respond, and evacuate."),
    distractors: [answer("Focus only on interior extinguishers", "Interior portable equipment does not prevent exterior ignition or ember entry."), answer("Assume masonry walls eliminate all exposure", "Openings, roofs, intakes, and stored fuels remain pathways."), answer("Wait for visible flame at the wall", "Embers and radiant exposure can establish hidden ignition earlier.")],
    topics: ["Mock B ember-entry resilience", "Mock B exterior fuel and access control"],
    challengePrompt: "Identify one building opening and one operational exposure that should be inspected before fire season.",
  },
  {
    difficulty: 5,
    competency: "Evacuation capacity and human behavior",
    objective: "Validate egress under blocked routes, accessibility needs, and counterflow.",
    details: ["One exit becomes unavailable while responders enter through another.", "A refuge strategy lacks two-way communication and assisted-transfer roles.", "Turnstiles release but create counterflow at the assembly route."],
    prompts: ["What is the best validation approach?", "Which evidence is needed before claiming adequate egress?"],
    correct: answer("Test credible exit loss, occupant distribution, mobility and assistance needs, flow restrictions, responder counterflow, communication, accountability, and behavioral uncertainty against tenability time", "Egress adequacy is a system comparison between available safe time and realistic movement and decision performance."),
    distractors: [answer("Use average walking speed and assume every exit remains available", "Averages and perfect availability hide critical constraints."), answer("Count doors without evaluating where occupants and hazards are", "Nominal exit count does not establish usable capacity or tenability."), answer("Exclude people needing assistance from the calculation", "Accessible evacuation is part of life-safety performance.")],
    topics: ["Mock B degraded-egress capacity", "Mock B accessible evacuation and counterflow"],
    challengePrompt: "Define one conservative assumption for pre-movement time and one for exit availability.",
  },
];

const A5_PRACTICE: readonly ScenarioSpec[] = [
  spec(1, "Hazard vulnerability analysis", "Base planning priorities on credible hazards, vulnerabilities, consequences, and capabilities.",
    ["The plan covers last year's alarm but omits flood loss of utilities.", "A neighboring release can cross the normal evacuation route.", "A remote crew has limited communications and medical access.", "One supplier supports every emergency generator."],
    ["What should drive the next planning revision?", "Which analysis best establishes preparedness priorities?"],
    ["Rank credible scenarios using exposure, vulnerability, consequence, dependencies, and response capability, then close the most material gaps", "A site-specific vulnerability analysis captures rare events and capability gaps that history alone misses."],
    [["Plan only for events already experienced", "Past events do not bound credible future emergencies."], ["Select scenarios by ease of drilling", "Convenience does not establish risk significance."], ["Copy an unrelated site's plan", "Generic content omits local hazards and resources."]],
    ["Practice hazard-vulnerability prioritization", "Practice emergency capability-gap analysis"], "Name one low-frequency scenario that deserves planning despite no local history."),
  spec(1, "Warning and accountability", "Provide accessible warning and reliable accounting across worker populations.",
    ["A noisy area cannot hear the alarm.", "Visitors are not tied to any assembly roster.", "A multilingual night crew receives text-only instructions.", "A remote worker misses the all-clear after sheltering."],
    ["What is the strongest corrective design?", "Which system change most directly improves life safety?"],
    ["Use tested redundant accessible warning, role-based rosters and check-ins, translated or pictorial instructions, and a controlled all-clear process", "Warning and accountability must reach and track everyone under realistic conditions."],
    [["Rely on one audible tone everywhere", "One channel can fail in noisy, remote, or accessibility contexts."], ["Use memory to account for visitors", "Informal recall is incomplete under stress."], ["Treat alarm activation as proof everyone received it", "System output does not prove human reception or action."]],
    ["Practice accessible emergency notification", "Practice personnel-accountability architecture"], "Define one drill measure for warning reach and one for accounting accuracy."),
  spec(2, "Incident command", "Establish scalable authority, objectives, communications, and resource accountability.",
    ["Operations and security issue conflicting radio directions.", "A senior executive bypasses the incident commander to direct tactics.", "Command transfers at shift change without a briefing.", "Multiple agencies arrive with different priorities."],
    ["What organizational correction is needed first?", "Which action best restores coordinated response?"],
    ["Establish or reinforce incident command or unified command, shared objectives, role boundaries, a communication plan, resource tracking, and a documented transfer process", "Common command aligns authority and information while preserving qualified tactical roles."],
    [["Let every department retain independent command", "Independent direction can create incompatible tactics."], ["Route every field decision through a remote executive", "This delays qualified incident action."], ["Stop maintaining incident logs", "Logs support accountability, handoff, and recovery."]],
    ["Practice incident-command role clarity", "Practice command-transfer continuity"], "List the minimum information needed for a safe transfer-of-command briefing."),
  spec(3, "Protective-action decisions", "Choose evacuation or sheltering from plume, route, time, and building conditions.",
    ["The normal evacuation route crosses a toxic plume.", "Flooding may isolate the site while outdoor air is contaminated.", "A fire threatens the sheltering HVAC shutdown system.", "A wind shift moves vapor toward the primary assembly area."],
    ["What is the strongest immediate decision approach?", "How should protective action be selected and updated?"],
    ["Use current hazard and route information to select a monitored protective action, define transition triggers, maintain communication and accountability, and change actions as conditions evolve", "Evacuation and sheltering are conditional strategies, not universal defaults."],
    [["Always evacuate regardless of route exposure", "Movement can increase exposure when routes cross the hazard."], ["Wait for perfect information", "Delay can forfeit the protective window."], ["Let each person choose independently", "Uncoordinated action undermines routing and accountability."]],
    ["Practice evacuation-shelter transition logic", "Practice plume-aware protective action"], "Write three observable triggers for changing from sheltering to evacuation."),
  spec(4, "Response resources and rescue", "Match trained people, equipment, medical support, and rescue time to the scenario.",
    ["The rescue team is available only after the planned entry ends.", "Respirator cylinders do not support travel and task duration.", "Mutual-aid equipment cannot connect to site fittings.", "A remote medical response exceeds the expected survivability window."],
    ["What should the readiness review conclude?", "Which pre-incident correction is strongest?"],
    ["Do not authorize reliance on the capability until staffing, equipment compatibility, duration, access, communications, and response-time performance are demonstrated", "A nominal resource is not a usable capability unless it can perform in the actual scenario."],
    [["List the resource in the plan because it exists somewhere", "Availability on paper does not prove timely performance."], ["Assume mutual aid knows the site", "Interfaces and access require joint planning and testing."], ["Use drill attendance as the sole competence test", "Attendance does not demonstrate rescue performance."]],
    ["Practice emergency-resource capability validation", "Practice rescue-time and equipment-interface assurance"], "Define one time-based and one equipment-based acceptance test."),
  spec(5, "Continuity and exercise improvement", "Validate recovery priorities and convert exercise gaps into verified improvements.",
    ["The backup restores data but not authentication services.", "A drill meets average time while one visitor is unaccounted for.", "The alternate site cannot support a critical supplier interface.", "Controllers prompt responders through key decisions."],
    ["What is the most defensible readiness conclusion?", "Which improvement cycle is required?"],
    ["Treat dependencies, unaccounted people, and prompted decisions as capability gaps; assign causal actions, interim controls, and repeatable tests before declaring readiness", "A favorable average or partial restoration can hide critical failure and overstated independent capability."],
    [["Pass because the average target was met", "Critical failures cannot be averaged away."], ["Count controller prompts as independent performance", "Prompted action overstates readiness."], ["Test each application without dependencies", "Recovery fails when required identity, network, supplier, or utility services are absent."]],
    ["Practice continuity-dependency testing", "Practice after-action corrective verification"], "Write one pass-fail criterion that cannot be masked by a favorable average."),
];

const A5_MOCK_A: readonly ScenarioSpec[] = [
  spec(1, "Hazardous-material zones and decontamination", "Prevent contaminant spread while preserving responder support.",
    ["Ambulance access crosses the contaminated corridor.", "Runoff from decontamination enters a storm drain.", "Clean replacement cylinders are stored inside the reduction zone.", "Victims reach triage before gross contamination is removed."],
    ["What site-layout correction is required?", "Which control best prevents secondary exposure?"],
    ["Establish hazard-based control zones, controlled entry and exit, compatible decontamination, runoff management, clean logistics, and protected medical transfer", "Zoning and decontamination keep contamination from migrating to responders, victims, and the environment."],
    [["Use one unrestricted staging area", "Mixed clean and contaminated functions spread exposure."], ["Skip decontamination to save time in every case", "Uncontrolled transfer can injure rescuers and receiving facilities."], ["Place clean supplies beside the source", "Clean resources require protected logistics."]],
    ["Mock A contamination-zone architecture", "Mock A decontamination-medical interface"], "Draw the direction of people, equipment, and waste flow through the zones."),
  spec(2, "Mutual aid and unified command", "Integrate external organizations before and during complex response.",
    ["Fire service maps use different valve names than the facility.", "Two agencies use incompatible radio channels.", "Mutual aid expects a water source that is under repair.", "Security delays external responders at the gate."],
    ["What is the strongest preparedness action?", "Which coordination gap must be closed before relying on mutual aid?"],
    ["Jointly reconcile terminology, access, communications, resources, command, and hazards through preplans and exercises, then maintain current shared information", "External capability becomes reliable only when site interfaces are explicit and tested."],
    [["Assume professional responders can improvise every interface", "Unfamiliar access and systems consume critical time."], ["Send the plan only after an incident starts", "Pre-incident coordination is necessary."], ["Let each agency use separate objectives", "Conflicting objectives undermine unified response."]],
    ["Mock A mutual-aid interface validation", "Mock A unified-command preplanning"], "Define one joint drill inject that tests a known interface failure."),
  spec(4, "Cyber-physical emergency response", "Maintain safe control when digital and physical safeguards fail together.",
    ["A ransomware event disables access badges and process displays.", "A false alarm flood hides a real high-level signal.", "Remote shutdown commands cannot be authenticated.", "Backup communications share the compromised network."],
    ["What response architecture is strongest?", "Which first principles should guide the combined incident?"],
    ["Prioritize safe process state and life safety, use independent trusted communications and manual controls, establish joint cyber-operations command, preserve evidence, and verify recovery before reconnecting", "Cyber compromise can alter safety information and controls, so independent pathways and disciplined restoration are essential."],
    [["Trust every screen until IT confirms malware", "Compromised displays may be unreliable."], ["Reconnect systems immediately after files restore", "Functional and integrity validation must precede reconnection."], ["Treat cyber and safety teams as separate incidents", "Physical consequences require integrated command."]],
    ["Mock A cyber-physical safe-state response", "Mock A trusted recovery and reconnection"], "Identify one independent manual indication and one restoration test."),
  spec(5, "Mass-casualty resource allocation", "Use transparent triage, surge, and transport coordination under scarcity.",
    ["Patient numbers exceed on-site medical capacity.", "The nearest hospital cannot accept chemically contaminated victims.", "Transport routes are partly blocked.", "Responder heat strain reduces available teams."],
    ["What management approach is most defensible?", "How should scarce response capability be coordinated?"],
    ["Use trained triage and incident command, protect responders, coordinate receiving capability and transport routes, track patients and resources, and reassess as conditions change", "Structured allocation improves survival and accountability while preventing responder collapse and secondary contamination."],
    [["Send all victims to the nearest facility without coordination", "Receiving capability and contamination constraints matter."], ["Use arrival order as the only priority", "Triage considers clinical urgency and resource effectiveness."], ["Ignore responder exposure until all victims move", "Disabled responders reduce overall rescue capacity."]],
    ["Mock A casualty-surge coordination", "Mock A medical-transport capacity management"], "Name one resource status that must be updated continuously during triage."),
];

const A5_MOCK_B: readonly ScenarioSpec[] = [
  spec(1, "Compound weather emergency", "Sequence protective action when weather, utilities, and access deteriorate together.",
    ["A tornado warning begins during a flammable release.", "Floodwater threatens backup power while evacuation roads close.", "Extreme cold disables exterior assembly and water supply.", "Wildfire smoke arrives as the site prepares to shut down."],
    ["What is the strongest command approach?", "How should competing protective actions be resolved?"],
    ["Use unified situational assessment to identify the immediate dominant hazard, choose time-phased protective actions, preserve accountability and critical utilities, and define transition triggers", "Compound events require sequencing rather than following one hazard plan in isolation."],
    [["Execute every standalone plan simultaneously", "Independent actions can conflict."], ["Choose the historically most common hazard", "Current consequence and timing govern."], ["Delay until every forecast agrees", "Uncertainty does not eliminate urgent protective windows."]],
    ["Mock B compound-hazard action sequencing", "Mock B deteriorating-access protective strategy"], "Build a two-stage decision trigger for one compound scenario."),
  spec(2, "Workplace violence response", "Integrate prevention, reporting, threat assessment, and emergency action without stereotyping.",
    ["A worker reports escalating threats and access to the site.", "A domestic conflict may follow an employee to work.", "Anonymous messages target a specific shift.", "Supervisors dismiss concerning behavior as personality."],
    ["What is the strongest organizational response?", "Which action best balances safety, fairness, and urgency?"],
    ["Use a trained multidisciplinary threat-assessment process, protect reporters, evaluate behavior and access, coordinate support and security actions, communicate need-to-know measures, and set escalation triggers", "Structured behavioral assessment supports proportionate action without relying on stereotypes or rumor."],
    [["Diagnose dangerousness from one demographic trait", "Stereotyping is unreliable and unfair."], ["Wait for physical violence", "Credible escalating signals warrant preventive assessment."], ["Broadcast confidential details to all employees", "Communication should protect safety while limiting unnecessary disclosure."]],
    ["Mock B behavioral threat assessment", "Mock B domestic-violence workplace planning"], "Identify one urgent trigger and one due-process safeguard."),
  spec(4, "Transportation emergency interface", "Coordinate carrier, public response, site information, and community protection.",
    ["A tanker release occurs just outside the gate.", "Shipping papers conflict with the placard.", "A railcar fire threatens a process intake.", "A damaged package enters a public drainage channel."],
    ["What should incident command prioritize?", "Which information and control interfaces are essential?"],
    ["Establish safe isolation and identification, use carrier and technical resources, coordinate public command and protective action, control site intakes and ignition, and protect drainage without exposing untrained personnel", "Off-site transportation events cross organizational and jurisdictional boundaries and require verified identity and unified control."],
    [["Send untrained employees to identify the leak up close", "Close approach can create severe exposure."], ["Assume one label source is infallible", "Conflicting identity requires controlled verification."], ["Treat the gate as a boundary that ends site risk", "Plume, fire, and runoff can affect the facility and community."]],
    ["Mock B carrier-public command interface", "Mock B transport-release site protection"], "Name two independent information sources for material identification."),
  spec(5, "Public-health continuity", "Maintain essential work while disease transmission and staffing uncertainty evolve.",
    ["Absence affects one critical control-room team.", "A screening program produces unequal false exclusions.", "Shared transport creates a transmission cluster.", "Supplier interruption threatens protective supplies."],
    ["What is the strongest continuity strategy?", "How should controls adapt as evidence changes?"],
    ["Prioritize essential functions, layer evidence-based exposure controls, cross-train and separate critical teams, protect privacy and leave access, monitor effectiveness and equity, and update plans with current health guidance", "Resilient continuity combines transmission control, staffing redundancy, fairness, and adaptive evidence review."],
    [["Rely on one screening question as complete control", "Screening alone misses transmission and can create bias."], ["Require symptomatic workers to hide illness", "This increases exposure and undermines reporting."], ["Share individual medical details widely", "Operational restrictions can be implemented without unnecessary disclosure."]],
    ["Mock B essential-function health continuity", "Mock B equitable outbreak control"], "Define one transmission and one staffing resilience indicator."),
];

const A6_PRACTICE: readonly ScenarioSpec[] = [
  spec(1, "Routes and health effects", "Connect route, timing, and target-organ effects to exposure controls.",
    ["A liquid can cross intact skin without causing immediate irritation.", "A sensitizer produces delayed symptoms after repeated contact.", "A corrosive aerosol injures the upper airway rapidly.", "A swallowed contaminant results from hand-to-mouth transfer."],
    ["Which assessment principle is most important?", "What should control selection recognize?"],
    ["Evaluate the credible route, dose timing, local and systemic effects, and susceptibility, then control the route at source and interface", "Ambient concentration alone can miss dermal, ingestion, peak, and sensitization pathways."],
    [["Use odor as the dose measure", "Odor is not a quantitative dose metric."], ["Assume no irritation means no absorption", "Systemic absorption may occur without local warning."], ["Evaluate inhalation only", "The scenario identifies other credible routes."]],
    ["Practice route-specific exposure recognition", "Practice acute-chronic health-effect interpretation"], "Name one control and one sampling approach for a non-inhalation route."),
  spec(1, "Exposure grouping and sampling", "Build representative similar-exposure groups and a risk-based sampling plan.",
    ["One office sample is proposed for three solvent-mixing shifts.", "Only the most experienced operator is sampled during a low-rate run.", "Contractors perform the highest-exposure task but are excluded.", "A new process lacks baseline and task data."],
    ["What sampling strategy is strongest?", "How should representativeness be restored?"],
    ["Define groups by agent, task, controls, duration, and variability; sample representative and worst-credible conditions; include all exposed populations; and document uncertainty", "Employment category or location alone does not create equivalent exposure."],
    [["Treat any facility worker as representative", "Exposure determinants differ by task and control."], ["Use an outdoor area sample only", "Area background does not measure personal task exposure."], ["Rely solely on complaints", "Symptoms and reporting are not a representative quantitative strategy."]],
    ["Practice similar-exposure-group design", "Practice risk-based personal sampling"], "Describe a worker-selection rule that avoids convenience sampling."),
  spec(2, "Exposure-limit strategy", "Match sampling duration and interpretation to the type of health limit.",
    ["A ceiling hazard arises during a two-minute line opening.", "Short solvent peaks occur during batch charging.", "A full-shift average may hide a brief severe irritant release.", "Variable extended shifts change the averaging context."],
    ["Which evaluation approach is best aligned?", "What is the key sampling-design correction?"],
    ["Match method response and sample duration to ceiling, short-term, and full-shift concerns; capture peak tasks and interpret all applicable limits with schedule and uncertainty", "A full-shift sample can dilute brief peaks that drive acute harm."],
    [["Use one long sample for every exposure limit", "One duration cannot resolve every limit type."], ["Sample only between tasks", "This misses the peak-generating activity."], ["Declare safety from an acceptable average alone", "Ceiling and short-term criteria can still be exceeded."]],
    ["Practice ceiling-and-peak sampling", "Practice multi-duration exposure-limit interpretation"], "Design a paired task and full-shift sampling strategy."),
  spec(2, "Industrial ventilation", "Diagnose source capture using flow, hood, makeup-air, and worker-position evidence.",
    ["Room air changes are high but smoke escapes the hood into the breathing zone.", "A closed door starves makeup air and reverses hood flow.", "Flexible duct damage reduces branch flow while fan speed remains normal.", "Cross-drafts carry contaminant past the worker before capture."],
    ["What is the strongest troubleshooting approach?", "Which evidence should determine correction?"],
    ["Measure capture and branch performance under representative makeup-air and cross-draft conditions, inspect the system, correct source geometry and balance, then verify breathing-zone control", "Room ACH or fan operation alone does not prove source capture."],
    [["Use fan sound as proof of adequate flow", "Sound does not quantify capture."], ["Increase general dilution without checking plume path", "Dilution may not intercept the source before exposure."], ["Move the worker closer to the emission", "This can increase breathing-zone exposure."]],
    ["Practice local-exhaust capture diagnostics", "Practice makeup-air and cross-draft control"], "Name one visualization and one quantitative measurement for hood verification."),
  spec(3, "Occupational noise", "Separate source, path, duration, and hearing-protection contributions.",
    ["Dosimetry is high only during compressed-air cleaning.", "Two equal machines operate together in a reflective room.", "Workers remove protectors for communication.", "A quiet booth has a poorly sealed service opening."],
    ["What control sequence is strongest?", "Which interpretation best guides action?"],
    ["Identify dominant tasks and frequency content, reduce noise at source and path, redesign communication and duration, then select and verify usable protection for residual exposure", "Noise control is strongest when measurement locates the energy source and controls do not depend solely on perfect wear."],
    [["Buy the highest labeled protector without fit evidence", "Nominal attenuation may not be achieved in use."], ["Average all areas and ignore task peaks", "Task contribution can dominate dose."], ["Treat equal decibel sources as arithmetic sums", "Decibels combine logarithmically."]],
    ["Practice task-based noise control", "Practice hearing-protection usability and fit"], "Define one source-control and one field-fit effectiveness measure."),
  spec(3, "Heat and cold stress", "Integrate environment, workload, clothing, acclimatization, and individual state.",
    ["New workers perform heavy outdoor work in impermeable suits.", "Radiant heat is high despite moderate air temperature.", "Cold wet gloves reduce dexterity during emergency work.", "A work-rest plan ignores metabolic rate and recovery conditions."],
    ["What is the strongest prevention plan?", "Which assessment correction is needed?"],
    ["Assess the full thermal burden and task demand, account for clothing and acclimatization, engineer recovery conditions, schedule work and hydration, monitor workers, and define symptom response", "Thermal strain depends on interacting environmental, metabolic, clothing, and personal factors."],
    [["Use air temperature alone", "It omits humidity, radiation, air movement, workload, and clothing."], ["Rely on thirst or discomfort only", "Subjective warning may lag harmful strain."], ["Increase pace to finish sooner", "Higher metabolic demand can worsen strain."]],
    ["Practice heat-burden integration", "Practice cold-dexterity and recovery control"], "Explain why protective clothing can invalidate an ambient-index-only plan."),
  spec(4, "Epidemiology and surveillance", "Interpret associations with denominators, bias, confounding, and case definition.",
    ["Symptoms appear higher on one shift that also has older workers.", "Screening participation is greatest among concerned employees.", "A case definition changes midway through the trend.", "Contractor outcomes are omitted as employee exposure falls."],
    ["What is the best analytical response?", "Why is a causal claim premature?"],
    ["Reconstruct comparable populations, exposure denominators, case definitions, timing, confounders, and selection processes before estimating association and causal plausibility", "Observed differences can arise from exposure or from who is measured, how cases are defined, and what covariates differ."],
    [["Use raw case counts as causal proof", "Counts omit population and bias structure."], ["Discard all observational evidence", "Careful observational analysis can identify useful associations."], ["Adjust only for variables measured after the outcome", "Post-outcome variables may not address baseline confounding."]],
    ["Practice occupational-surveillance bias control", "Practice confounding and denominator reconstruction"], "Name one plausible confounder and how stratification could test it."),
  spec(5, "Radiation protection", "Apply time, distance, shielding, source control, and dose verification as a system.",
    ["A source is moved farther away but scattering surfaces are added.", "Shielding has penetrations aligned with an occupied station.", "A worker's electronic dosimeter alarms but the task continues.", "A temporary source location is absent from the survey map."],
    ["What is the strongest control response?", "Which assurance principle should govern the task?"],
    ["Control the source and access, minimize time, maximize justified distance, design shielding for geometry and scatter, survey representative locations, and investigate dose alarms before resumption", "Ideal calculations require field verification of geometry, leakage, scatter, occupancy, and actual dose."],
    [["Use distance calculations as proof no survey is needed", "Real geometry and scatter can invalidate ideal assumptions."], ["Ignore dosimeter alarms below a yearly total", "An alarm signals a condition requiring prompt evaluation."], ["Add shielding mass without checking penetrations", "Streaming can dominate through openings."]],
    ["Practice radiation geometry verification", "Practice dosimetry-alarm response and access control"], "Identify one survey point likely to detect streaming that an average area reading could miss."),
];

const A6_MOCK_A: readonly ScenarioSpec[] = [
  spec(1, "Mixture exposure", "Evaluate additive health effects across contaminants.",
    ["Three solvents affect the same target organ.", "Two irritants peak during the same task.", "One component lacks a full-shift sample.", "Controls reduce one agent while another rises."],
    ["What is the strongest interpretation?", "Which analytical gap matters most?"],
    ["Evaluate each agent and justified additive or interactive effects using aligned task data, toxicology, and uncertainty before declaring control", "Separate low ratios can combine into material shared-effect exposure."],
    [["Judge each agent independently in every case", "Shared effects may require combined evaluation."], ["Add concentrations with different units", "A dimensionless normalized approach is needed."], ["Assume interactions are always zero", "Toxicology must support that assumption."]],
    ["Mock A additive-mixture interpretation", "Mock A co-exposure data alignment"], "Describe when summing normalized exposure ratios is defensible."),
  spec(2, "Dermal exposure", "Assess permeation, surface contamination, and work-practice pathways.",
    ["Breakthrough occurs before the glove-change interval.", "Contaminated cuffs touch skin during doffing.", "A solvent carries another chemical through the glove.", "Surface wipes find contamination outside the process boundary."],
    ["What is the strongest correction?", "Which exposure pathway should be controlled?"],
    ["Use chemical-specific permeation and task data, control contamination at source, redesign donning and doffing, select compatible protection, and verify surfaces and skin-risk pathways", "Dermal protection depends on material, mixture, duration, movement, contamination, and removal technique."],
    [["Choose gloves only by thickness", "Thickness alone does not establish compatibility."], ["Reuse contaminated gloves indefinitely", "Contamination and breakthrough can increase dose."], ["Evaluate air samples only", "Air data miss direct skin and surface pathways."]],
    ["Mock A glove-breakthrough control", "Mock A surface-to-skin transfer prevention"], "Name one field observation and one laboratory datum needed for glove selection."),
  spec(3, "Biological monitoring", "Interpret biomarkers with timing, specificity, background, and privacy.",
    ["A metabolite also comes from diet.", "Samples are collected outside the biomarker half-life.", "A result reflects all exposure routes but not the source.", "Supervisors request individual diagnoses."],
    ["What is the best program response?", "How should the result be interpreted?"],
    ["Use validated timing and reference information, account for nonoccupational sources and kinetics, integrate environmental data, protect confidentiality, and provide appropriate medical interpretation", "A biomarker can integrate dose yet remain nonspecific and time-sensitive."],
    [["Treat one result as proof of workplace cause", "Specificity and timing may not support causation."], ["Publish individual results to all supervisors", "Medical confidentiality and need-to-know limits apply."], ["Discard environmental measurements", "Source control requires environmental and task evidence."]],
    ["Mock A biomarker timing and specificity", "Mock A confidential biological-surveillance use"], "Explain why a biomarker may be useful even when it cannot identify the source alone."),
  spec(4, "Ventilation system interactions", "Diagnose competing hoods, pressure zones, and recirculation.",
    ["Opening one damper collapses capture at another hood.", "Exhaust discharge reenters a nearby intake.", "Building negative pressure backdrafts combustion equipment.", "A filter loads and changes branch balance."],
    ["What is the strongest systems response?", "Which test best reveals the interaction?"],
    ["Measure simultaneous branch and building pressures under credible configurations, correct balance and makeup air, prevent reentry and combustion effects, and verify capture after filter loading", "Ventilation components interact through shared pressure and airflow networks."],
    [["Tune each hood in isolation", "Isolated tests miss simultaneous-system effects."], ["Add exhaust without makeup-air review", "This can worsen negative pressure."], ["Locate discharge beside the intake", "Reentry returns contaminants indoors."]],
    ["Mock A multi-hood pressure interaction", "Mock A exhaust-reentry prevention"], "Define one worst-case operating configuration for commissioning."),
  spec(5, "Epidemiologic causal inference", "Separate healthy-worker, recall, and exposure-classification effects from association.",
    ["Long-tenure workers appear healthier than recent hires.", "Cases remember past exposure more completely than controls.", "Job titles poorly represent actual task exposure.", "Workers with symptoms transfer out of the high-exposure job."],
    ["Which bias is most important to investigate?", "What analysis would strengthen inference?"],
    ["Evaluate selection, recall, time-varying employment, and exposure misclassification with better task histories, appropriate comparison groups, and sensitivity analysis", "Employment and information processes can distort the observed exposure-outcome relationship."],
    [["Assume employment duration cannot bias results", "Survivor and transfer effects can matter."], ["Use current job title as complete history", "Current title may misclassify cumulative exposure."], ["Treat stronger recall among cases as objective exposure", "Differential recall can inflate association."]],
    ["Mock A healthy-worker effect", "Mock A exposure-misclassification sensitivity"], "Propose one data source that improves retrospective task exposure classification."),
];

const A6_MOCK_B: readonly ScenarioSpec[] = [
  spec(1, "Aerosol behavior and respiratory control", "Match sampling and protection to particle size and deposition.",
    ["Grinding creates coarse and respirable fractions.", "A process change produces ultrafine condensation aerosol.", "Face-seal hair compromises negative-pressure protection.", "A filter change affects breathing resistance."],
    ["What is the strongest evaluation?", "Which control decision is best supported?"],
    ["Characterize relevant size fractions and task peaks, control generation and capture, select and fit suitable respiratory protection for residual exposure, and verify use conditions", "Particle behavior, sampler convention, filter performance, and fit all affect dose control."],
    [["Use total dust as a substitute for every size fraction", "Health-relevant deposition fractions differ."], ["Select a respirator without fit evaluation", "Nominal filter performance does not ensure face-seal protection."], ["Ignore source capture", "Respirators should not replace feasible source control."]],
    ["Mock B aerosol-size exposure strategy", "Mock B respiratory fit and resistance control"], "Explain how an aerosol can have low mass but high particle number."),
  spec(2, "Oxygen-deficient atmospheres", "Recognize displacement, enrichment, and instrument limitations.",
    ["Nitrogen purging lowers oxygen without warning odor.", "A sensor is calibrated in air but used in a dense-vapor layer.", "Oxygen enrichment increases material ignitability.", "Remote sampling tubing delays the reading."],
    ["What is the strongest atmospheric-control plan?", "Which measurement limitation must be managed?"],
    ["Prevent uncontrolled purge exposure, ventilate and isolate, sample representative locations with suitable calibrated instruments and response time, and control both deficiency and enrichment", "Oxygen hazards may be invisible and spatially variable, while sampling systems can delay or bias detection."],
    [["Use odor to detect nitrogen", "Nitrogen provides no reliable odor warning."], ["Measure one location once", "Atmospheres can stratify and change."], ["Treat oxygen enrichment as harmless", "Enrichment accelerates ignition and combustion."]],
    ["Mock B inert-gas displacement control", "Mock B atmospheric-sampling response lag"], "Calculate tubing delay from a stated volume and pump flow, then explain why it matters."),
  spec(3, "Acoustic control design", "Use frequency, path, and enclosure integrity to select controls.",
    ["Low-frequency noise bypasses a light barrier.", "A small enclosure opening dominates leakage.", "Structure-borne vibration radiates from a connected panel.", "Absorptive treatment is proposed outdoors without a reflecting field."],
    ["What is the best engineering response?", "Which diagnosis should precede control selection?"],
    ["Measure frequency and transmission paths, treat source and structure, design mass, isolation, absorption, and seals for the dominant path, and verify insertion loss", "Control effectiveness depends on frequency and whether energy travels through air, structure, or openings."],
    [["Choose control only by overall dB", "Overall level can hide frequency and path."], ["Leave service gaps untreated", "Small openings can dominate enclosure leakage."], ["Add absorption where transmission mass is needed", "Absorption and barrier transmission solve different problems."]],
    ["Mock B frequency-specific noise engineering", "Mock B enclosure-leakage and structure path"], "Define insertion loss and one condition needed for a fair before-after test."),
  spec(4, "Physiologic heat strain", "Integrate environmental index with clothing, workload, and observed strain.",
    ["Core temperature rises despite acceptable ambient screening.", "Impermeable clothing prevents evaporative cooling.", "A worker's heart-rate recovery worsens across cycles.", "Medication and dehydration alter individual response."],
    ["What is the strongest management response?", "How should environmental and physiologic data be combined?"],
    ["Stop or modify exposure based on response criteria, reassess clothing and metabolic corrections, engineer cooler recovery, support acclimatization and hydration, and obtain appropriate medical evaluation", "Observed strain can reveal that a generic environmental limit understates the individual's actual burden."],
    [["Ignore physiologic signs if air temperature is moderate", "Actual strain can be high because of clothing and workload."], ["Increase work rate to finish", "This raises metabolic heat."], ["Use one schedule for every worker and task", "Acclimatization, clothing, health, and workload differ."]],
    ["Mock B physiologic heat-strain triggers", "Mock B impermeable-clothing correction"], "Write one objective stop-work and one recovery criterion."),
  spec(5, "Radiation dose reconstruction", "Reconstruct uncertain time-location-shielding histories conservatively.",
    ["A dosimeter was worn outside shielding for part of a task.", "Source dwell time differs from the work log.", "A survey meter saturated near the source.", "Several workers shared locations without individual timing."],
    ["What is the strongest reconstruction approach?", "Which evidence hierarchy should guide the estimate?"],
    ["Preserve records, validate instrument limits, reconstruct source, geometry, shielding, time, and occupancy from independent evidence, bound uncertainty conservatively, and obtain qualified review", "Dose reconstruction must reconcile measurement limitations and uncertain histories rather than select the most favorable assumption."],
    [["Use the lowest plausible time for every gap", "Systematic favorable assumptions understate dose."], ["Treat a saturated reading as an exact maximum", "Saturation means the actual field may be higher."], ["Assign one group average without location history", "Individual time and geometry can differ materially."]],
    ["Mock B uncertain-dose reconstruction", "Mock B instrument-saturation interpretation"], "Name two independent records that could corroborate worker location and source time."),
];

const A7_PRACTICE: readonly ScenarioSpec[] = [
  spec(1, "Pollution prevention", "Prefer source reduction and material efficiency over downstream handling.",
    ["Transfer overspray consumes coating and creates hazardous waste.", "A cut pattern creates avoidable metal scrap.", "Single-pass rinse water remains clean enough for countercurrent reuse.", "Packaging arrives with unnecessary mixed material."],
    ["Which option generally ranks highest?", "What should the improvement team evaluate first?"],
    ["Redesign the product or process to avoid material use and pollutant generation before considering reuse, recycling, treatment, or disposal", "Source prevention reduces raw-material loss, exposure, waste, and downstream burden together."],
    [["Dilute the waste", "Dilution does not reduce pollutant mass."], ["Increase disposal capacity", "This manages waste after generation."], ["Recycle without checking prevention", "Recycling is useful but generally follows feasible source reduction."]],
    ["Practice source-reduction hierarchy", "Practice material-efficiency pollution prevention"], "Define one mass-based and one production-normalized measure."),
  spec(2, "Waste characterization and compatibility", "Establish identity, properties, and compatibility before consolidation or shipment.",
    ["Two unlabeled drums have similar color and odor.", "A formulation change invalidates prior rinse-water classification.", "A waste profile omits a newly added metal catalyst.", "Process knowledge conflicts with a laboratory result."],
    ["What is the strongest next action?", "How should the uncertainty be resolved?"],
    ["Segregate and control the material, reconcile process knowledge with representative analysis, restore traceable identity, assess compatibility, and update downstream handling information", "Unknown or changed waste must be characterized before mixing, transport, or treatment."],
    [["Mix a small amount informally", "An uncontrolled test can trigger reaction or release."], ["Use odor as identification", "Odor is unsafe and unreliable."], ["Keep the old profile because it is convenient", "Changed inputs can change waste properties."]],
    ["Practice waste-identity reconstruction", "Practice incompatible-waste segregation"], "Explain how process knowledge and analysis complement each other."),
  spec(3, "Spill and water protection", "Stop source and migration while protecting responders and drainage.",
    ["Oil moves across pavement toward a storm drain.", "A soluble chemical enters an unlined containment joint.", "Firewater runoff threatens a nearby stream.", "A transfer hose leaks beside an uncovered soil area."],
    ["What response priority is strongest?", "Which layered action best limits environmental consequence?"],
    ["Protect people, stop the source if safe, block migration and drains, contain and recover compatibly, notify under the plan, and assess affected soil or water", "Early source and pathway control prevents a local release from becoming a larger environmental impact."],
    [["Wash the material into the drain", "This transfers contamination to water."], ["Wait for laboratory results before containment", "Immediate safe pathway control should not be delayed."], ["Cover the stain after it dries", "Appearance does not establish recovery or impact control."]],
    ["Practice stormwater spill interception", "Practice contaminated-firewater containment"], "Name one upstream and one downstream monitoring location."),
  spec(4, "Environmental management systems", "Convert significant aspects into owned, measurable, verified controls and objectives.",
    ["A significant solvent loss has only an awareness objective.", "Legal and operational obligations are stored in separate unlinked lists.", "An audit closes actions when equipment arrives rather than when performance is verified.", "A process change bypasses the aspect review."],
    ["What system improvement is strongest?", "Which management-system gap should be corrected?"],
    ["Link significant aspects and obligations to operational controls, owners, resources, measurable targets, change review, monitoring, corrective action, and effectiveness verification", "An EMS becomes useful when identified impacts drive controlled and measurable action."],
    [["Count posters as the outcome", "Communication activity is not environmental performance."], ["Close actions at purchase", "Procurement does not prove installation or effect."], ["Review aspects only after an incident", "Change and planning reviews should be preventive."]],
    ["Practice aspect-to-control traceability", "Practice environmental corrective-action effectiveness"], "Write one leading and one outcome measure for a significant aspect."),
  spec(5, "Lifecycle and environmental due diligence", "Prevent burden shifting across suppliers, use, community, and end of life.",
    ["A lower-VOC cleaner uses more energy and contains an aquatic toxicant.", "A recycler has complete paperwork but credible dumping complaints.", "A product is lighter but fails twice as often.", "A supplier shifts emissions into a water-stressed community."],
    ["What is the strongest evaluation?", "Which decision boundary is needed?"],
    ["Compare equivalent function across sourcing, worker and community exposure, use, durability, energy, releases, logistics, and end of life; verify high-risk suppliers and make tradeoffs explicit", "Lifecycle thinking and due diligence reveal transferred impacts hidden by one site metric or contract."],
    [["Choose solely by purchase price", "Price omits material health and environmental effects."], ["Treat manifests as proof of final disposition", "Documents should be corroborated when credible risk signals exist."], ["Approve from one favorable impact category", "A local improvement can shift burden elsewhere."]],
    ["Practice functional-unit lifecycle comparison", "Practice downstream environmental due diligence"], "Define a functional unit that makes two alternatives genuinely comparable."),
];

const A7_MOCK_A: readonly ScenarioSpec[] = [
  spec(2, "Air-emission upset management", "Control and quantify abnormal emissions using defensible data.",
    ["A control device bypass opens during startup.", "A monitor drifts while visible emissions increase.", "Production data conflict with stack measurements.", "A capture fan fails intermittently."],
    ["What is the strongest response?", "How should release magnitude and control be established?"],
    ["Stabilize or stop the source as needed, restore control, preserve monitor and process data, estimate emissions with bounded methods, notify through the plan, and verify correction", "Abnormal release management requires both immediate control and transparent reconstruction of uncertain emissions."],
    [["Delete suspect monitor data", "Questionable data should be preserved and qualified."], ["Use the lowest estimate", "Uncertainty should be bounded, not biased downward."], ["Continue unchanged until a complaint", "Visible or control evidence warrants action."]],
    ["Mock A abnormal-air-release reconstruction", "Mock A emission-control bypass response"], "Name two independent data streams for estimating release mass."),
  spec(4, "Wastewater process control", "Diagnose loading, toxicity, and treatment interactions before discharge.",
    ["Flow is stable but effluent concentration rises after a batch dump.", "pH correction masks a toxic shock to biology.", "Equalization is bypassed during peak production.", "Storm inflow reduces residence time."],
    ["Which analysis best guides correction?", "What should the environmental team do first?"],
    ["Control the source, evaluate mass loading and toxicity over time, restore equalization and treatment conditions, protect receiving pathways, and verify recovery with process and effluent data", "Concentration alone can hide flow, toxicity, and process-dynamics causes."],
    [["Dilute the discharge", "Dilution does not remove pollutant mass or toxicity."], ["Judge from one grab sample", "Transient loading needs time-resolved evidence."], ["Raise flow to shorten treatment", "Reduced residence can worsen performance."]],
    ["Mock A toxic-loading treatment upset", "Mock A equalization and residence-time control"], "Distinguish concentration reduction from mass-load reduction."),
  spec(5, "Contaminated-site decision making", "Build a risk-based investigation from source, pathway, receptor, and uncertainty.",
    ["Vapor may migrate from soil toward an occupied building.", "Groundwater data end at the property line.", "Historic fill contains heterogeneous hot spots.", "A cap is damaged by new utility work."],
    ["What is the strongest next step?", "Which conceptual-site-model gap matters most?"],
    ["Update the source-pathway-receptor model, target data to decision uncertainty, apply interim exposure controls, evaluate migration and remedy performance, and communicate with affected parties", "Investigation should answer risk and remedy decisions rather than collect undirected data."],
    [["Average all soil results and ignore hot spots", "Heterogeneity and pathways can make averages misleading."], ["Wait for confirmed illness", "Exposure pathways should be controlled prospectively."], ["Assume the property boundary stops migration", "Air and groundwater can cross boundaries."]],
    ["Mock A vapor-intrusion pathway review", "Mock A remedy-integrity and migration assessment"], "State one data-quality objective tied to a specific remedy decision."),
];

const A7_MOCK_B: readonly ScenarioSpec[] = [
  spec(2, "Climate resilience", "Evaluate changing physical hazards and dependencies over asset life.",
    ["Historic rainfall no longer bounds drainage demand.", "Heat reduces backup-generator output during peak need.", "Wildfire smoke disables outside-air cooling.", "Drought constrains emergency and process water."],
    ["What is the strongest planning response?", "How should adaptation be prioritized?"],
    ["Use forward-looking scenarios and asset life, map critical dependencies and thresholds, prioritize no-regret and staged adaptations, and monitor trigger conditions", "Resilience planning must address nonstationary hazards and cascading dependencies."],
    [["Use historic averages as fixed limits", "Changing conditions can invalidate stationarity."], ["Harden one asset without dependencies", "Upstream utilities and access can dominate."], ["Wait for asset failure", "Adaptation is preventive."]],
    ["Mock B forward-looking physical-risk analysis", "Mock B climate-dependency adaptation"], "Define one monitored trigger for advancing a staged adaptation."),
  spec(4, "Circularity and material risk", "Evaluate reuse and recycling without recirculating hazardous constituents.",
    ["Recycled feed concentrates a persistent metal.", "Reusable packaging needs a solvent-intensive wash.", "A byproduct market disappears seasonally.", "Recovered material weakens product durability."],
    ["Which decision framework is strongest?", "What must be verified before claiming circular benefit?"],
    ["Use a functional lifecycle and material-flow assessment, set contaminant and quality limits, verify stable end use, include cleaning and transport burdens, and retain safe fallback management", "Circular flow is beneficial only when it preserves function and does not recirculate hazard or create unstable disposal."],
    [["Count recycled mass alone", "Mass diversion can hide toxicity and quality loss."], ["Assume any reuse is preferable", "Cleaning, failure, and exposure burdens matter."], ["Ignore market stability", "Loss of end use can create stockpiles and disposal risk."]],
    ["Mock B circular-material contaminant control", "Mock B durable reuse functional assessment"], "Name one quality and one hazard acceptance criterion for recycled feed."),
  spec(5, "Community impact and environmental equity", "Assess distribution of burden, vulnerability, and meaningful participation.",
    ["Truck traffic and noise concentrate near one neighborhood.", "Emergency communication excludes a common local language.", "A water withdrawal affects households during drought.", "Monitoring locations omit the nearest receptors."],
    ["What is the strongest impact-management approach?", "Which evidence and engagement correction is needed?"],
    ["Map burden and vulnerability at relevant scale, collect representative receptor data, engage affected people early and accessibly, evaluate alternatives and cumulative impacts, and track commitments", "Aggregate regional averages can conceal concentrated burden and barriers to participation."],
    [["Use facility-wide averages only", "Averages can hide spatial concentration."], ["Engage after the final decision", "Late engagement cannot meaningfully shape alternatives."], ["Treat translation as optional", "Accessible participation requires understandable communication."]],
    ["Mock B cumulative community-burden analysis", "Mock B accessible environmental participation"], "Define one receptor-based measure that a facility average could miss."),
];

const A8_PRACTICE: readonly ScenarioSpec[] = [
  spec(1, "Training needs assessment", "Distinguish knowledge, skill, motivation, equipment, and work-system gaps.",
    ["Workers demonstrate the task but lack a calibrated instrument.", "Quiz scores are high while field sequencing fails.", "A new procedure changes one critical decision.", "Supervisors reward skipping the trained check."],
    ["What should the needs analysis conclude?", "Which intervention matches the diagnosed gap?"],
    ["Diagnose the specific performance cause before selecting training, then correct system, resource, reinforcement, or competence gaps and verify field performance", "Training cannot solve missing equipment or conflicting incentives and must target an actual learning gap."],
    [["Retrain everyone automatically", "Generic repetition may miss the cause."], ["Lengthen the course", "Duration does not ensure relevance."], ["Lower the field standard", "This hides rather than solves the gap."]],
    ["Practice performance-gap diagnosis", "Practice training-versus-system intervention"], "Classify one example under knowledge, skill, motivation, and environment."),
  spec(1, "Learning objectives", "Write observable conditions, behavior, and criteria.",
    ["The objective says only understand lockout.", "A rescue objective lacks a time or accuracy criterion.", "A communication objective measures attendance.", "A simulator objective omits the abnormal cue."],
    ["What revision is strongest?", "Which objective feature is missing?"],
    ["State the job-relevant conditions, observable action, and safe performance criterion that the learner must demonstrate", "A measurable objective aligns practice and assessment with required work behavior."],
    [["Use appreciate as the main verb", "Appreciation is not directly observable task performance."], ["Count course completion", "Attendance is not competence."], ["List instructor activities", "Objectives describe learner performance."]],
    ["Practice criterion-based objective writing", "Practice task-condition assessment alignment"], "Rewrite one vague objective with condition, behavior, and criterion."),
  spec(2, "Adult learning and methods", "Use relevant experience, active practice, feedback, and realistic decisions.",
    ["Experienced mechanics must unlearn an obsolete permit shortcut.", "New operators need a rare upset response without live risk.", "A mixed-experience class disengages from a long lecture.", "Learners can recite steps but cannot diagnose cues."],
    ["Which design is strongest?", "What method best matches the target performance?"],
    ["Use realistic problems and demonstrations, draw on experience while surfacing obsolete habits, provide deliberate practice and feedback, and progressively test independent performance", "Active task alignment builds application rather than recognition alone."],
    [["Lecture only", "Passive delivery is weak for complex skill."], ["Match each learner to one fixed style", "Fixed style labels should not deny task-required practice."], ["Use vocabulary recall as the sole test", "Recall does not demonstrate decisions or actions."]],
    ["Practice scenario-based adult learning", "Practice misconception-focused deliberate practice"], "Design one scenario that makes an obsolete habit fail safely in training."),
  spec(2, "Accessible risk communication", "Make urgent instructions understandable across language, literacy, sensory, and shift differences.",
    ["Temporary workers receive one-language text.", "A noisy area misses verbal warnings.", "Pictograms conflict with local work practice.", "Night shift has no route to ask questions."],
    ["What communication plan is strongest?", "How should understanding be verified?"],
    ["Use concise translated and visual content, demonstrations and practice, redundant accessible channels, teach-back, trusted question routes, and field checks across shifts", "Communication effectiveness is demonstrated by correct action, not distribution or signatures."],
    [["Email a technical document only", "Access and comprehension are not assured."], ["Use signatures as sole proof", "Acknowledgment is not understanding."], ["Ask bilingual workers to improvise critical translations", "The organization must provide controlled accurate communication."]],
    ["Practice multilingual teach-back", "Practice multimodal warning comprehension"], "Write a teach-back prompt that requires the learner to act, not say yes."),
  spec(3, "Assessment quality", "Use representative, reliable, unbiased assessment tied to objectives.",
    ["Answer wording cues the correct choice.", "Two evaluators score the same demonstration differently.", "The test samples only easy objectives.", "A passing quiz omits a critical hands-on step."],
    ["What should be corrected first?", "Which validity threat is most important?"],
    ["Map assessment to objectives and consequences, remove cueing, standardize rubrics and raters, sample adequate breadth and difficulty, and include authentic performance", "A score supports competence only when content, scoring, and task representation are defensible."],
    [["Add unrelated hard questions", "Difficulty without relevance lowers validity."], ["Use learner confidence as the key", "Confidence can be miscalibrated."], ["Keep inconsistent scoring", "Low rater reliability obscures competence."]],
    ["Practice content-valid assessment design", "Practice rater reliability and cue control"], "Define one rubric behavior that two observers can score consistently."),
  spec(4, "Transfer and effectiveness", "Verify durable workplace behavior and outcomes beyond reaction and recall.",
    ["Learners like a course but field briefs remain weak.", "Skill demonstration is good immediately but decays in three months.", "Supervisors block use of the trained method.", "Audit quality improves only when the instructor is present."],
    ["What evidence and follow-up are strongest?", "Which evaluation level is missing?"],
    ["Observe the target behavior reliably over time, remove workplace barriers, coach and refresh based on decay, and triangulate control performance and relevant outcomes", "Reaction and immediate learning do not prove transfer, persistence, or result."],
    [["Use satisfaction ratings alone", "Reaction is not behavior."], ["Count slides and hours", "Inputs do not establish effect."], ["Assume one immediate pass lasts indefinitely", "Retention and context can change performance."]],
    ["Practice training-transfer verification", "Practice retention and reinforcement evaluation"], "Choose one transfer and one outcome measure for a specific course."),
  spec(5, "Qualification and adaptive learning", "Govern reauthorization and adaptivity with calibrated evidence of broad competence.",
    ["Attendance marks a worker qualified despite a failed critical step.", "Adaptive software stops after three narrow correct answers.", "High-confidence guesses receive the largest score increase.", "Item explanations are generated without expert review."],
    ["What governance is required?", "Which competence claim is defensible?"],
    ["Restrict work when necessary, diagnose and remediate the gap, require authentic re-demonstration, map and review adaptive items, calibrate scoring and stopping across objectives, and verify transfer", "Qualification requires current demonstrated performance; adaptivity does not create validity by itself."],
    [["Use attendance as permanent competence", "Exposure to training is not durable skill."], ["Pass from confidence alone", "Confidence may be wrong."], ["Let mastery in one topic mask untested domains", "Stopping must preserve coverage."]],
    ["Practice performance-based requalification", "Practice adaptive-testing validity governance"], "Write a stopping rule that preserves minimum coverage of every critical objective."),
];

const A8_MOCK_A: readonly ScenarioSpec[] = [
  spec(2, "Simulation fidelity", "Select fidelity elements that affect target decisions and teamwork.",
    ["Visual realism is high but process cues are delayed incorrectly.", "Teams practice roles without communication failure.", "The simulator cannot represent escalation after a wrong choice.", "Debrief focuses on personality rather than decisions."],
    ["What improvement is most important?", "Which fidelity dimension should drive design?"],
    ["Prioritize accurate decision cues, consequences, timing, roles, communication, feedback, and repeat practice over cosmetic realism", "Functional fidelity to target performance matters more than expensive appearance."],
    [["Maximize graphics only", "Visual detail may not improve decisions."], ["Prevent all trainee errors", "Safe errors and consequences support learning."], ["Skip structured debrief", "Reflection and feedback consolidate learning."]],
    ["Mock A functional simulation fidelity", "Mock A branching-team scenario design"], "Name one expensive realism feature that may add little learning value."),
  spec(3, "Evaluator reliability", "Standardize performance judgments without suppressing relevant evidence.",
    ["Raters disagree on an isolation demonstration.", "One evaluator prompts before scoring.", "A rubric uses vague terms such as adequate.", "Raters know employee disciplinary history."],
    ["What is the strongest correction?", "How should scoring quality be demonstrated?"],
    ["Use observable anchored criteria, train and calibrate raters on common samples, prevent unscored prompting and irrelevant bias, and monitor agreement", "Reliable assessment requires shared behavioral meaning and controlled administration."],
    [["Average disagreement without investigation", "A mean can hide invalid criteria."], ["Let every rater use personal judgment", "Unanchored discretion lowers reliability."], ["Count prompts as independent success", "Prompted performance is not independent competence."]],
    ["Mock A behaviorally anchored scoring", "Mock A assessor-calibration control"], "Define an agreement statistic or practical check for rater calibration."),
  spec(4, "Crisis communication competence", "Train leaders to communicate uncertainty, action, and updates under pressure.",
    ["Leaders overpromise that no risk exists.", "Messages conflict across channels.", "Rumor spreads before the scheduled briefing.", "Technical detail obscures the protective action."],
    ["What capability should training build?", "Which communication structure is strongest?"],
    ["State what is known and uncertain, give concise actions and rationale, use one coordinated source with accessible channels, correct misinformation, and commit to update times", "Trust grows from actionable candor and consistency, not false certainty."],
    [["Wait for complete certainty", "Delay allows harmful information gaps."], ["Use dense technical language", "Urgent action can be lost."], ["Promise zero risk", "Unsupported certainty damages credibility."]],
    ["Mock A uncertainty-aware crisis messaging", "Mock A coordinated rumor correction"], "Draft a three-sentence initial message with an explicit update commitment."),
  spec(5, "Learning analytics", "Use training data without proxy bias, surveillance harm, or invalid causation.",
    ["Completion time is used as a proxy for competence.", "A model flags non-native speakers as low performers.", "Supervisors use click data for discipline.", "Dashboard gains vanish after job assignment changes."],
    ["What governance is strongest?", "Which causal caution is needed?"],
    ["Define valid outcomes, test subgroup error and alternative explanations, minimize data, separate coaching from discipline where appropriate, provide review and appeal, and confirm job performance", "Digital traces can be biased proxies and should not become consequential labels without validity and safeguards."],
    [["Treat speed as competence", "Fast completion can reflect guessing."], ["Assume correlation proves training effect", "Assignment and exposure changes can confound results."], ["Collect every available datum", "Data minimization reduces privacy and misuse risk."]],
    ["Mock A fair learning-analytics use", "Mock A training-effect causal attribution"], "Identify one proxy measure and the real performance construct it fails to establish."),
];

const A8_MOCK_B: readonly ScenarioSpec[] = [
  spec(2, "Train-the-trainer quality", "Qualify instructors in content, facilitation, assessment, and feedback.",
    ["A subject expert cannot coach practice safely.", "Instructors deliver different critical steps.", "A trainer answers outside professional scope.", "No one observes instructor performance."],
    ["What is the strongest program design?", "Which trainer qualification evidence is needed?"],
    ["Standardize critical content while qualifying instructors through observed delivery, facilitation, assessment, feedback, scope awareness, and periodic recalibration", "Subject knowledge alone does not establish instructional or assessment competence."],
    [["Use seniority as the sole qualification", "Experience does not prove teaching performance."], ["Allow critical content to vary", "Learners need consistent safety requirements."], ["Skip instructor observation", "Attendance cannot verify delivery skill."]],
    ["Mock B instructor-performance qualification", "Mock B trainer-content calibration"], "Write one observation criterion for instructor feedback quality."),
  spec(3, "Remedial learning", "Diagnose specific misconceptions and rebuild performance without generic repetition.",
    ["A learner repeatedly reverses test sequence.", "An expert performs correctly but cannot explain abnormal cues.", "One language term causes a consistent error.", "An anxious learner passes slowly after guided practice."],
    ["What remediation is strongest?", "How should reauthorization be decided?"],
    ["Identify the error mechanism, provide targeted explanation and deliberate practice with fading support, then require independent criterion performance in realistic conditions", "Focused remediation addresses the actual gap while preserving a valid standard."],
    [["Repeat the entire course unchanged", "Generic repetition may preserve the misconception."], ["Lower the critical criterion", "This weakens competence protection."], ["Pass from effort alone", "Effort does not demonstrate safe performance."]],
    ["Mock B misconception-targeted remediation", "Mock B scaffold-fading reauthorization"], "Design one practice step that reveals rather than cues the misconception."),
  spec(4, "Microlearning and retrieval", "Use short learning events as reinforcement without fragmenting complex competence.",
    ["A five-minute module replaces hands-on rescue practice.", "Spaced retrieval improves rule recall but not diagnosis.", "Notifications arrive during safety-critical work.", "Learners receive isolated facts with no task context."],
    ["What is the best use of microlearning?", "Which limitation must be addressed?"],
    ["Use brief spaced retrieval and job cues to reinforce defined knowledge, schedule safely, and retain integrated practice and assessment for complex skills and decisions", "Microlearning can strengthen retention but cannot substitute for whole-task performance where integration matters."],
    [["Replace all simulations with flash cards", "Recall prompts do not build team response."], ["Interrupt hazardous work for notifications", "Delivery timing can create risk."], ["Fragment every procedure into unrelated facts", "Decontextualization weakens application."]],
    ["Mock B spaced-retrieval reinforcement", "Mock B microlearning whole-task boundaries"], "Choose one objective suitable for microlearning and one that is not."),
  spec(5, "Competence-system governance", "Maintain role-based authorization through change, expiry, and evidence quality.",
    ["A matrix ignores changed equipment.", "Contractor credentials cannot be verified.", "Expired qualifications remain active in scheduling software.", "One evaluator both trains and waives every failed step."],
    ["What governance correction is strongest?", "Which evidence chain supports authorization?"],
    ["Map role-critical competence to current tasks, verify source and expiry, separate appropriate assessment authority, block invalid assignment, and require refreshed demonstration after change or failure", "Authorization depends on current trustworthy evidence linked to actual work."],
    [["Treat a certificate as permanent", "Documents can expire or become task-inapplicable."], ["Let scheduling override qualification", "Production systems should enforce authorization status."], ["Waive critical steps informally", "Uncontrolled waivers erode competence assurance."]],
    ["Mock B digital qualification integrity", "Mock B role-change competence governance"], "Distinguish attendance, qualification, and authorization in one sentence each."),
];

const A9_PRACTICE: readonly ScenarioSpec[] = [
  spec(1, "Sources of obligation", "Distinguish governing law, adopted standards, contracts, and professional guidance.",
    ["A consensus standard is not automatically adopted in every jurisdiction.", "A contract requires a practice beyond the regulatory minimum.", "An internal rule is more protective than a local minimum.", "A corporate site operates across several jurisdictions."],
    ["Which interpretation is most defensible?", "What should the ASP verify before advising?"],
    ["Identify the applicable jurisdiction and adoption, incorporation, contract, and internal requirements; use recognized practice as technical evidence without claiming universal legal status", "The effect of a source depends on how and where it applies, while more protective commitments may still govern the organization."],
    [["Every consensus standard is law everywhere", "Adoption and jurisdiction differ."], ["Voluntary guidance is never relevant", "It can inform feasibility, contracts, and recognized practice."], ["A private document automatically overrides law", "Private requirements do not categorically displace governing law."]],
    ["Practice hierarchy of legal and contractual duties", "Practice consensus-standard applicability"], "List three ways a nominally voluntary standard can become consequential."),
  spec(2, "Civil liability concepts", "Recognize duty, breach, causation, and harm without overclaiming from one fact.",
    ["A rule was breached but the injury arose from an unrelated event.", "A foreseeable hazard was known but no reasonable control was evaluated.", "An injury occurred despite evidence of reasonable care.", "Several parties controlled different parts of the work."],
    ["Which analytical structure is strongest?", "Why is one fact alone insufficient?"],
    ["Evaluate duty and applicable standard of care, breach, factual and legal causation, damages, control, and defenses using jurisdiction-specific advice", "Negligence generally requires a connected set of elements, not merely injury or rule breach."],
    [["Injury alone proves negligence", "Harm does not by itself establish duty, breach, or causation."], ["Any breached rule proves causation", "The breach must connect to the harm."], ["Insurance eliminates duty", "Risk financing does not remove underlying conduct duties."]],
    ["Practice negligence-element reasoning", "Practice control-and-causation analysis"], "Explain how a breached requirement may be relevant yet not causally sufficient."),
  spec(3, "Records and evidence", "Preserve authentic relevant records with controlled access and traceability.",
    ["Routine deletion is scheduled after a serious incident.", "A sample arrives unsealed with mismatched identifiers.", "Exposure and medical records share an open supervisor folder.", "A working spreadsheet overwrites original inspection metadata."],
    ["What is the strongest records response?", "Which evidence-control principle was compromised?"],
    ["Preserve relevant material under authorized scope, suspend conflicting disposition, protect originals and metadata, document custody, classify access, and investigate gaps", "Integrity, authenticity, confidentiality, and traceability determine whether records remain useful and defensible."],
    [["Delete unfavorable duplicates first", "Selective destruction is unethical and damaging."], ["Let everyone edit the original", "Uncontrolled editing destroys provenance."], ["Give all supervisors complete medical detail", "Access should be limited to legitimate need."]],
    ["Practice legal-hold and metadata preservation", "Practice chain-of-custody and confidential access"], "Distinguish an evidentiary original from an ordinary working copy."),
  spec(5, "Professional ethics", "Maintain competence, candor, confidentiality, and authorized escalation under pressure.",
    ["An executive asks the ASP to hide a highly exposed group in an average.", "A client requests a certification outside the ASP's expertise.", "A personal financial interest is undisclosed during vendor selection.", "Public disclosure could reveal individual medical information."],
    ["What is the strongest ethical response?", "How should competing duties be balanced?"],
    ["Communicate material risk accurately, disclose conflicts and limits, protect confidential detail, preserve evidence, obtain qualified help, and use authorized escalation when misleading action persists", "Professional integrity requires truthful competent work while respecting confidentiality and due process."],
    [["Comply because management owns every conclusion", "Authority does not justify misleading professional work."], ["Publish every confidential record", "Uncontrolled disclosure can harm people and violate duties."], ["Invent a favorable estimate", "Fabrication compounds the ethical breach."]],
    ["Practice truthful risk-reporting escalation", "Practice scope-conflict-confidentiality ethics"], "Draft one sentence that discloses a scope limit without abandoning the safety issue."),
];

const A9_MOCK_A: readonly ScenarioSpec[] = [
  spec(2, "Contractor control and duty", "Manage retained control and shared hazards despite contractual allocation.",
    ["The host controls isolations while the contractor controls craft methods.", "A contract assigns safety to the contractor but the host knows of an active-process conflict.", "Two contractors create an interface not covered by either scope.", "The host begins directing specialized means and methods without expertise."],
    ["What is the most defensible host response?", "Which control boundary should be maintained?"],
    ["Coordinate known shared hazards and retained controls, provide process information, verify interfaces, stop unacceptable work, document action, and avoid unnecessary takeover of specialized methods", "Contract language does not physically control hazards or erase duties arising from knowledge and control."],
    [["Ignore known conflict because of indemnity", "Private allocation does not control the exposure."], ["Direct every technical detail", "Unnecessary control can blur roles and exceed competence."], ["Wait for injury", "Known interface risk requires preventive action."]],
    ["Mock A retained-control contractor duty", "Mock A multiemployer interface boundaries"], "Identify two facts relevant to determining retained control."),
  spec(4, "Investigation and disclosure", "Coordinate factual investigation, legal advice, and required reporting without suppressing evidence.",
    ["Counsel involvement is used as a label on every routine record.", "An incident report mixes facts with unsupported blame.", "A reporting deadline may apply but facts remain incomplete.", "Interview notes are rewritten without retaining originals."],
    ["What is the strongest process?", "Which action best protects accuracy and legal review?"],
    ["Preserve facts and originals, separate evidence from inference, involve qualified legal advice for applicability and privilege, meet required reporting with transparent updates, and document decisions", "Legal coordination should improve accuracy and compliance, not become a device for concealment or destroyed provenance."],
    [["Mark every record privileged automatically", "A label alone does not create privilege."], ["Delay all reporting until certainty is perfect", "Applicable duties may require timely preliminary reporting."], ["Replace originals with polished summaries", "This destroys provenance and may omit evidence."]],
    ["Mock A factual-legal investigation boundary", "Mock A timely uncertain-event disclosure"], "Give one example of a fact, an inference, and a legal conclusion."),
  spec(5, "Professional scope and escalation", "Remain engaged while obtaining expertise beyond one's competence.",
    ["A cyber event changes safety-controller logic.", "A structural crack requires engineering judgment.", "A medical restriction raises diagnosis questions.", "A regulator requests a legal interpretation."],
    ["What should the ASP do?", "Which response best respects professional limits?"],
    ["Control immediate risk within competence, state limitations, preserve relevant evidence, engage qualified specialists, coordinate interfaces, and avoid unsupported certification or conclusions", "Scope limits require qualified collaboration, not abandonment or overreach."],
    [["Certify conclusions outside expertise", "Unsupported certification is unsafe and unethical."], ["Ignore the issue entirely", "The ASP can still control immediate risk and coordinate help."], ["Alter specialist evidence to fit management preference", "Evidence integrity must be preserved."]],
    ["Mock A specialist-referral duty", "Mock A cyber-structural-medical scope limits"], "Define what the ASP can safely do before the specialist arrives."),
];

const A9_MOCK_B: readonly ScenarioSpec[] = [
  spec(2, "Retaliation and reporting", "Protect good-faith reporting and investigate concerns fairly.",
    ["A worker loses overtime after raising an exposure concern.", "A supervisor identifies an anonymous reporter through schedule data.", "A complaint is dismissed because no injury occurred.", "A contractor fears removal for reporting a near miss."],
    ["What is the strongest organizational response?", "Which governance control is needed?"],
    ["Protect against retaliation, preserve confidentiality where possible, investigate the safety concern and adverse action independently, provide accessible reporting and appeal, and correct substantiated issues", "Reporting systems fail when people reasonably fear harm for raising concerns."],
    [["Reveal the reporter to discourage rumors", "Unnecessary disclosure can enable retaliation."], ["Investigate only after injury", "Good-faith hazard concerns deserve preventive review."], ["Treat contractor reporters as unprotected outsiders", "A safe reporting culture must cover all exposed workers."]],
    ["Mock B anti-retaliation system", "Mock B confidential concern investigation"], "Name one leading indicator of reporting-system trust."),
  spec(4, "Conflict of interest", "Disclose and manage interests that could impair objective judgment.",
    ["The ASP owns stock in a vendor being evaluated.", "A consultant is paid only if no major findings remain.", "A family member bids on monitoring work.", "A gift is offered before a recommendation."],
    ["What is the strongest ethical action?", "How should independence be protected?"],
    ["Disclose the interest promptly, follow organizational and professional requirements, recuse or add independent review as appropriate, and document an objective selection process", "Transparency and structural safeguards protect decisions from actual or perceived bias."],
    [["Hide the interest if the preferred vendor is competent", "Competence does not remove conflict."], ["Accept gifts as normal data", "Personal benefit can impair or appear to impair judgment."], ["Let contingent payment determine findings", "Findings must follow evidence, not compensation outcome."]],
    ["Mock B procurement conflict management", "Mock B audit-independence safeguards"], "Distinguish disclosure, recusal, and independent review."),
  spec(5, "Privacy and proportional disclosure", "Use minimum necessary personal information while enabling safety controls.",
    ["A supervisor requests a diagnosis instead of work restrictions.", "Wearable location data is retained indefinitely.", "A dashboard exposes individual biomonitoring results.", "Cross-border teams share unclassified medical records."],
    ["What is the strongest information design?", "Which disclosure principle should govern?"],
    ["Classify data by purpose and sensitivity, provide minimum necessary operational restrictions, apply role-based access and retention, secure transfer, preserve auditability, and obtain qualified privacy advice", "Safety decisions often need functional limitations, not diagnoses or unlimited surveillance data."],
    [["Give every manager complete access", "Authority does not create universal need to know."], ["Delete identity from every record", "Some legitimate linkage and traceability may be required."], ["Retain all data forever", "Indefinite retention increases harm without purpose."]],
    ["Mock B minimum-necessary safety disclosure", "Mock B sensitive-data lifecycle governance"], "Define the minimum information needed to implement one work restriction."),
];

const CATALOGS: Readonly<Partial<Record<QuestionPool, Partial<Record<DomainId, readonly ScenarioSpec[]>>>>> = {
  practice: { A4: A4_PRACTICE, A5: A5_PRACTICE, A6: A6_PRACTICE, A7: A7_PRACTICE, A8: A8_PRACTICE, A9: A9_PRACTICE },
  "mock-a": { A3: A3_MOCK_A, A4: A4_MOCK_A, A5: A5_MOCK_A, A6: A6_MOCK_A, A7: A7_MOCK_A, A8: A8_MOCK_A, A9: A9_MOCK_A },
  "mock-b": { A3: A3_MOCK_B, A4: A4_MOCK_B, A5: A5_MOCK_B, A6: A6_MOCK_B, A7: A7_MOCK_B, A8: A8_MOCK_B, A9: A9_MOCK_B },
};

function buildCatalogDomain(pool: QuestionPool, domainId: DomainId, index: number): Draft {
  const catalog = CATALOGS[pool]?.[domainId];
  if (!catalog || catalog.length === 0) {
    throw new Error(`Missing expanded ASP catalog for ${pool}/${domainId}`);
  }
  return buildCatalogDraft(pool, domainId, index, catalog);
}

function buildDraft(pool: QuestionPool, domainId: DomainId, index: number): Draft {
  if (domainId === "A1") {
    return buildA1CalculationDraft(pool, index);
  }
  if (domainId === "A2") {
    return pool === "practice" ? buildA2(pool, index) : pool === "mock-a" ? buildA2MockA(index) : buildA2MockB(index);
  }
  if (domainId === "A3") {
    return pool === "practice" ? buildA3(pool, index) : buildCatalogDomain(pool, domainId, index);
  }
  return buildCatalogDomain(pool, domainId, index);
}

function enrichReferenceTopic(pool: QuestionPool, domainId: DomainId, index: number, draft: Draft): Draft {
  if (domainId === "A1") return draft;

  const minimumVariants: Readonly<Record<QuestionPool, Readonly<Record<DomainId, number>>>> = {
    practice: { A1: 15, A2: 30, A3: 16, A4: 18, A5: 15, A6: 18, A7: 12, A8: 16, A9: 10 },
    "mock-a": { A1: 10, A2: 17, A3: 8, A4: 10, A5: 10, A6: 10, A7: 7, A8: 9, A9: 5 },
    "mock-b": { A1: 10, A2: 17, A3: 8, A4: 10, A5: 10, A6: 10, A7: 7, A8: 9, A9: 5 },
  };
  const lens = [
    "source and pathway",
    "task and interface",
    "control performance",
    "human reliability",
    "change and degradation",
    "verification evidence",
    "uncertainty and limits",
    "emergency consequence",
    "system dependency",
    "lifecycle assurance",
  ];
  const target = minimumVariants[pool][domainId];
  const ordinal = (index - 1) % target;
  return {
    ...draft,
    difficulty: (((index - 1) % 5) + 1) as Difficulty,
    referenceTopic: `${draft.referenceTopic} — ${lens[ordinal % lens.length]} lens ${ordinal + 1}`,
  };
}

function buildPool(pool: QuestionPool, counts: Readonly<Record<DomainId, number>>): readonly PooledASPQuestion[] {
  const questions: PooledASPQuestion[] = [];
  for (const domainId of DOMAIN_ORDER) {
    for (let index = 1; index <= counts[domainId]; index += 1) {
      questions.push(finalizeQuestion(pool, domainId, index, enrichReferenceTopic(pool, domainId, index, buildDraft(pool, domainId, index))));
    }
  }
  return questions;
}

export const ASP_PRACTICE_EXTRA: readonly PooledASPQuestion[] = buildPool("practice", PRACTICE_COUNTS);
export const ASP_MOCK_A: readonly PooledASPQuestion[] = buildPool("mock-a", MOCK_COUNTS);
export const ASP_MOCK_B: readonly PooledASPQuestion[] = buildPool("mock-b", MOCK_COUNTS);
