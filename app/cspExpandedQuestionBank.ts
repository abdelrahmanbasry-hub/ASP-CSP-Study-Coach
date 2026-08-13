import type {
  CspDomainId,
  CspQuestion,
  OptionIndex,
  QuestionDifficulty,
  ReferenceFramework,
} from "./questionBank";

/**
 * Deterministically generated, original CSP11-aligned practice material.
 *
 * Nito, Yates, and the ASP/CSP Exam Book are used only as structural lenses
 * for topic organization and common formula families. No source wording,
 * commercial-bank item, or examination item is reproduced.
 */

export type QuestionPool = "practice" | "mock-a" | "mock-b";
export type PooledCSPQuestion = CspQuestion & {
  pool: QuestionPool;
  /** Auditable item-pattern label; values are intentionally disjoint by pool. */
  scenarioFamily: string;
};

type Counts = Readonly<Record<CspDomainId, number>>;

interface Topic {
  competency: string;
  objective: string;
  referenceTopic: string;
  finding: string;
  hazard: string;
  correct: string;
  distractors: readonly [string, string, string];
  why: string;
  challenge: string;
}

interface Draft {
  scenarioFamily: string;
  competency: string;
  objective: string;
  referenceTopic: string;
  stem: string;
  correct: string;
  distractors: [string, string, string];
  why: string;
  challenge: string;
}

const DOMAIN_ORDER: readonly CspDomainId[] = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];

const PRACTICE_COUNTS: Counts = {
  D1: 150,
  D2: 150,
  D3: 90,
  D4: 54,
  D5: 36,
  D6: 60,
  D7: 60,
};

const MOCK_COUNTS: Counts = {
  D1: 50,
  D2: 50,
  D3: 30,
  D4: 18,
  D5: 12,
  D6: 20,
  D7: 20,
};

const frameworks: readonly ReferenceFramework[] = [
  "BCSP Blueprint",
  "Yates",
  "Nito",
  "ASP/CSP Exam Book",
];

const t = (
  competency: string,
  objective: string,
  referenceTopic: string,
  finding: string,
  hazard: string,
  correct: string,
  distractors: readonly [string, string, string],
  why: string,
  challenge: string,
): Topic => ({
  competency,
  objective,
  referenceTopic,
  finding,
  hazard,
  correct,
  distractors,
  why,
  challenge,
});

const TOPICS: Readonly<Record<CspDomainId, readonly Topic[]>> = {
  D1: [
    t(
      "Prevention Through Design",
      "remove a recurring exposure through design",
      "Design risk reduction and lifecycle review",
      "operators must reach across a powered transfer point to clear rejected product several times per shift",
      "the normal task places hands near hazardous motion",
      "Redesign the transfer and rejection path so clearing occurs outside the danger zone, then validate new failure modes before release",
      [
        "Issue thicker gloves and keep the reach-in task unchanged",
        "Post a warning at the transfer point and rely on careful behavior",
        "Rotate operators so each person performs fewer reach-ins",
      ],
      "Eliminating the routine human-machine interaction is more reliable than distributing or warning about the exposure, and design validation checks for transferred risk.",
      "Identify two new hazards the redesigned rejection path could create and specify a validation test for each.",
    ),
    t(
      "Process safety",
      "govern temporary impairment of a critical safeguard",
      "Temporary change and protection-layer impairment",
      "maintenance proposes bypassing a high-pressure trip until a replacement transmitter arrives",
      "a short-duration change can defeat a protection layer during the exact scenario it controls",
      "Use documented change control to assess the scenario, authorize compensating safeguards, set an expiry, communicate status, and verify restoration",
      [
        "Treat the bypass as routine because it is planned for less than one shift",
        "Allow the bypass if an operator agrees to watch the pressure display",
        "Raise the alarm limit so the unit can continue without nuisance indications",
      ],
      "Duration does not remove safeguard significance; controlled authorization, compensating protection, communication, and verified restoration govern the full impairment lifecycle.",
      "State one condition that should make the temporary bypass unacceptable regardless of production cost.",
    ),
    t(
      "Machine safety",
      "control access to hazardous machine motion",
      "Safeguarding and control reliability",
      "a perimeter gate stops the robot only when opened slowly but intermittently fails during a forceful opening",
      "the protective function is unreliable under a foreseeable demand",
      "Remove the cell from exposure, diagnose and correct the safety function, and validate stopping performance across foreseeable gate demands before return",
      [
        "Tell employees to open the gate slowly until the next annual inspection",
        "Paint the gate red while leaving the intermittent interlock in service",
        "Use injury history to decide whether the failure is important",
      ],
      "A safety-related control that fails under foreseeable use cannot be replaced by warnings or absence of prior injury; its function must be restored and validated.",
      "Define a proof-test protocol that checks sensor, logic, actuator, stopping time, and defeat resistance.",
    ),
    t(
      "Electrical safety",
      "reduce arc and shock exposure before energized work",
      "Electrical risk assessment and hierarchy",
      "a troubleshooting plan assumes energized access although the fault can be reproduced on a de-energized test fixture",
      "the proposed method accepts avoidable electrical exposure",
      "Use the de-energized diagnostic method, establish and verify an electrically safe condition, and reserve energized work for a justified task with specific controls",
      [
        "Perform energized work because troubleshooting is always exempt from risk reduction",
        "Add a second observer but leave all energy exposed",
        "Rely on voltage-rated gloves without evaluating elimination or task necessity",
      ],
      "If the task can be accomplished without hazardous energy, elimination is the preferred decision; PPE and observers address residual risk rather than justify avoidable exposure.",
      "List the evidence required to justify energized work if the de-energized fixture cannot reproduce the fault.",
    ),
    t(
      "Fall protection",
      "select a system that prevents a fall and controls rescue risk",
      "Fall prevention, arrest, clearance, and rescue",
      "workers connect short-duration maintenance lanyards where available clearance is less than the stated arrest-system requirement",
      "a fall could produce contact before the system fully arrests the worker",
      "Use a prevention or restraint solution that keeps workers from the edge, or redesign the anchorage and system only after verified clearance and rescue review",
      [
        "Accept the arrangement because the maintenance task lasts only ten minutes",
        "Add a written warning that clearance may be insufficient",
        "Use the same arrest system and assume the worker can self-rescue",
      ],
      "Exposure duration does not create clearance; prevention or verified system redesign must address the fall path, while rescue capability remains part of system selection.",
      "Build a clearance calculation and name two dynamic allowances that a simple component sum can omit.",
    ),
    t(
      "Confined-space safety",
      "control changing atmospheric and engulfment hazards",
      "Entry systems and isolation",
      "a vessel tests acceptable at the opening, but residue can release vapor and an upstream line remains connected through one closed valve",
      "a point reading and single valve do not control changing atmosphere or material entry",
      "Isolate material and energy with a verified protective method, test representatively, ventilate as needed, monitor change, and maintain a capable rescue system",
      [
        "Enter because the first oxygen reading is normal",
        "Use the closed process valve as the only isolation and post an attendant",
        "Let the entrant hold a portable monitor without addressing connected material",
      ],
      "Safe entry depends on effective isolation, representative atmospheric assessment, continued control, defined roles, and rescue—not a single normal measurement.",
      "Explain how you would verify isolation and atmospheric stratification before authorizing entry.",
    ),
    t(
      "Fleet safety",
      "control high-risk driving using exposure and behavior data",
      "Journey management and fleet risk",
      "collision frequency rises on overnight routes after schedules are compressed and telematics show repeated harsh events near route completion",
      "fatigue and schedule pressure may be creating an exposure pattern",
      "Reassess route and schedule design, fatigue controls, supervision, and high-risk segments, then verify change with exposure-normalized leading and outcome data",
      [
        "Discipline every driver with one harsh-braking alert without validating context",
        "Measure only total collisions without considering miles, route, or time of day",
        "Issue a memo asking drivers to be more alert while preserving the compressed schedule",
      ],
      "The pattern calls for system-level journey and fatigue controls plus contextualized data; raw counts or automatic blame can hide the exposure mechanism.",
      "Design a dashboard that separates route risk, driving exposure, schedule pressure, and individual coaching needs.",
    ),
    t(
      "Materials handling",
      "control suspended-load and line-of-fire risk",
      "Lift planning and exclusion zones",
      "a nonroutine lift will pass over an occupied access route and the plan does not verify load weight or center of gravity",
      "unknown load properties and people beneath the path undermine lift control",
      "Verify load data and rigging capacity, engineer the lift path and exclusion zone, assign qualified roles, conduct a pre-lift review, and stop incompatible occupancy",
      [
        "Proceed slowly and ask pedestrians to watch the load",
        "Use the largest available crane without checking configuration or ground conditions",
        "Allow the lift because no similar load has fallen at the site",
      ],
      "A nonroutine lift needs verified inputs, capacity and stability review, competent execution, and physical separation of people from the line of fire.",
      "Name four changes that should invalidate the initial lift authorization and trigger replanning.",
    ),
    t(
      "Facility life safety",
      "preserve tenable egress during building change",
      "Egress, occupancy, and fire protection interfaces",
      "temporary storage narrows an exit route and blocks a fire door open during a production expansion",
      "the change compromises both movement to safety and smoke/fire compartmentation",
      "Remove the obstructions, restore the rated door function, assess changed occupancy and travel conditions, and verify the complete egress and protection system",
      [
        "Keep the arrangement because employees know an alternate route",
        "Add an exit sign above the narrowed path without restoring width or the door",
        "Assign a worker to close the blocked door only if smoke appears",
      ],
      "Life-safety features work as a system; familiarity and signage cannot substitute for usable egress and functioning compartmentation.",
      "Describe how occupant load, travel distance, emergency lighting, and door operation interact in the review.",
    ),
    t(
      "Contractor operational control",
      "coordinate simultaneous high-hazard work",
      "Contractor interfaces and simultaneous operations",
      "one contractor plans hot work above another opening a solvent-containing line, although each standalone permit appears complete",
      "the combined ignition-release scenario is absent from separate task reviews",
      "Stop incompatible work and conduct a coordinated interface review of sequence, isolation, permits, boundaries, communication, and stop-work authority",
      [
        "Accept both permits because each employer approved its own task",
        "Compare only the contractors' historical injury rates",
        "Buy additional insurance and allow both tasks to proceed",
      ],
      "Separate approvals can miss coactivity; the host and contractors must control the interacting scenario across organizational boundaries before work proceeds.",
      "Write an observable stop-work trigger that either crew can invoke without seeking new approval.",
    ),
  ],
  D2: [
    t(
      "Safety management systems",
      "prioritize a systemic gap by risk significance",
      "Management-system gap analysis",
      "an assessment finds cosmetic form errors, incomplete routine signatures, and no governance for bypassing safety-critical interlocks",
      "an uncontrolled bypass can defeat a major-event safeguard",
      "Prioritize the bypass-governance gap using consequence, exposure, safeguard importance, and systemic reach, then plan the remaining corrections",
      [
        "Rank the cosmetic form error first because it appears on the most pages",
        "Rank every finding equally because all are nonconforming",
        "Close the assessment after correcting the easiest findings",
      ],
      "Risk and system significance—not finding count or convenience—should drive prioritization, while lower-risk gaps remain tracked to closure.",
      "Create a scoring rule that prevents numerous cosmetic defects from outranking one critical-control failure.",
    ),
    t(
      "EHS culture",
      "interpret reporting change without confusing visibility with risk",
      "Culture, climate, and reporting trust",
      "near-miss reports triple after leaders introduce a credible nonretaliation process while injury counts remain statistically flat",
      "the reporting process changed the visibility of weak signals",
      "Examine participation breadth, report quality, response and closure, exposure, trust measures, and later outcomes before judging the intervention",
      [
        "Conclude that hazards tripled because the report count tripled",
        "End the campaign because injuries did not immediately decline",
        "Discard near-miss reports because they contain subjective observations",
      ],
      "Reporting volume reflects both occurrence and willingness to speak; triangulated leading, cultural, exposure, and outcome evidence is needed.",
      "Define one behavioral and one perception measure that could corroborate improved reporting trust.",
    ),
    t(
      "Performance measurement",
      "build a balanced critical-control measure set",
      "Leading, lagging, and effectiveness indicators",
      "leaders rely on days without injury while field reviews show inconsistent verification of hazardous-energy isolation",
      "a sparse lagging count masks current control weakness",
      "Track representative isolation verification, correction quality, exposure, and relevant events or credible precursors using defined denominators and decision rules",
      [
        "Keep days without injury as the sole measure because it is easy to communicate",
        "Count locks purchased as proof that hazardous energy is controlled",
        "Measure training attendance without observing task execution",
      ],
      "Balanced measures test whether the critical process works now and whether outcomes change, rather than confusing inputs or random injury absence with control health.",
      "Specify a sampling rule that prevents supervisors from selecting only simple isolations for verification.",
    ),
    t(
      "Incident investigation",
      "develop a system-level causal explanation",
      "Causal analysis and corrective action",
      "an employee selects the wrong valve amid duplicated labels, a truncated display, suspended independent checking, and restart incentives",
      "multiple latent conditions made the error plausible and allowed it through",
      "Explain the interacting identification, interface, verification, workload, and incentive conditions, then assign controls with effectiveness checks",
      [
        "Name worker inattention as the single root cause and close the review",
        "Retrain the employee without changing labels, interface, or verification",
        "Wait for an admission of negligence before identifying causes",
      ],
      "A prevention-oriented investigation explains why the action made sense locally and why defenses failed, producing stronger controls than blame or generic retraining.",
      "Propose one forcing function and one measure that would reveal whether it prevents recurrence.",
    ),
    t(
      "Auditing",
      "preserve audit independence and evidence quality",
      "Risk-based audit programs",
      "site leaders preselect only recently improved areas and ask auditors to omit sampling of overdue corrective actions",
      "management influence threatens scope, representativeness, and credibility",
      "Use a risk-based independent sampling plan, preserve contradictory evidence, document scope limits, and escalate interference through audit governance",
      [
        "Accept the preselected tour because local leaders know what auditors should see",
        "Delete unfavorable evidence to maintain a collaborative relationship",
        "Replace field verification with management interviews alone",
      ],
      "Audit value depends on competent, objective, evidence-based examination of material risk, including inconvenient and overdue controls.",
      "Design a sample that combines random, judgmental, and adverse-condition selections without overstating statistical confidence.",
    ),
    t(
      "Leadership and governance",
      "translate policy into accountable operational control",
      "Leadership accountability and governance",
      "a corporate policy promises serious-injury prevention but assigns no owners, resources, decision rights, or review cadence",
      "aspiration without governance cannot reliably change control performance",
      "Define accountable owners, critical decisions, resources, operating standards, escalation thresholds, and review evidence tied to serious-hazard controls",
      [
        "Publish the policy more often and assume implementation will follow",
        "Delegate all responsibility to the safety department",
        "Measure success only through annual injury totals",
      ],
      "Leadership intent becomes operational through roles, resources, standards, assurance, and response to bad news—not communication alone.",
      "Map one board-level question to the field evidence needed to answer it without relying on averaged injury rates.",
    ),
    t(
      "Business and financial principles",
      "build a risk-informed investment case",
      "Economic analysis and safety investment",
      "a proposed enclosure has measurable capital and maintenance costs while the current process carries high-consequence exposure and recurring downtime",
      "a purchase-price-only comparison omits avoided and residual consequences",
      "Compare lifecycle costs, expected and credible worst-case losses, productivity and reliability effects, uncertainty, and residual risk while treating intolerable risk as a constraint",
      [
        "Reject the enclosure because prevention has no value unless payback is under one year",
        "Approve it using only the most optimistic avoided-injury estimate",
        "Count insurance reimbursement as elimination of operational and reputation risk",
      ],
      "A defensible case makes assumptions and uncertainty visible, values operational effects, and does not use favorable arithmetic to accept an otherwise unacceptable risk.",
      "Run a sensitivity analysis for event frequency, consequence, downtime, and control effectiveness.",
    ),
    t(
      "Professional ethics",
      "communicate material risk accurately under pressure",
      "Ethics, confidentiality, and escalation",
      "an executive asks the CSP to remove validated high-exposure results from a governance report because the transaction team wants a clean average",
      "aggregation would materially hide a vulnerable group",
      "Preserve accurate analysis, explain the distortion, protect personal information, use authorized governance and ethics channels, and escalate if correction is refused",
      [
        "Comply because executives own every technical conclusion",
        "Publish identifiable medical and exposure records publicly",
        "Replace the measurements with a favorable unsupported estimate",
      ],
      "Professional integrity requires truthful material communication and evidence preservation while confidentiality and due process still govern disclosure.",
      "Draft a concise objection that separates confidential personal detail from risk information decision-makers need.",
    ),
    t(
      "Contractor program management",
      "verify contractor capability beyond injury rates",
      "Contractor prequalification and assurance",
      "a low-bid contractor reports a strong injury rate but cannot show competence, equipment inspection, or subcontractor-control evidence for the planned high-hazard work",
      "lagging history alone does not establish current task capability",
      "Evaluate task-specific competence, resources, systems, critical-control evidence, subcontracting, field performance, and improvement response before award and throughout work",
      [
        "Approve solely because the reported injury rate is below the host average",
        "Transfer all operational responsibility through one contract clause",
        "Evaluate only insurance limits and purchase price",
      ],
      "Prequalification must examine the capabilities and controls needed for the actual work, then field assurance must verify execution rather than trusting paperwork.",
      "Create four leading contractor indicators that are harder to manipulate than raw injury counts.",
    ),
    t(
      "Data and technology governance",
      "validate an automated safety decision system",
      "Analytics, privacy, bias, and model drift",
      "a camera model with strong vendor accuracy performs poorly under local glare and automatically triggers discipline without human review",
      "aggregate test accuracy does not establish local validity or fair consequential use",
      "Validate representative performance and subgroup error, define human review and appeal, minimize and protect data, monitor drift, and limit use until decision validity is demonstrated",
      [
        "Deploy immediately because any accuracy above ninety percent proves reliability",
        "Use every alert for discipline so workers take the model seriously",
        "Reject all safety technology without evaluating a controlled support use",
      ],
      "Responsible deployment requires local validity, error analysis, governance, privacy, human oversight, and ongoing monitoring proportionate to the consequence of a wrong decision.",
      "Define acceptance thresholds for false negatives, false positives, drift, and human-review consistency.",
    ),
  ],
  D3: [
    t(
      "Hazard identification",
      "identify hazards across normal, abnormal, and nonroutine work",
      "Comprehensive hazard identification",
      "a review covers routine production but omits startup, cleaning, maintenance, upset recovery, and contractor interfaces",
      "the omitted modes contain different energies and human interactions",
      "Expand the review by lifecycle phase, task variation, people, energy, material, environment, and credible deviation, then verify with field participants",
      [
        "Accept routine production as representative of every operating mode",
        "Add only injury-history hazards because uninjured scenarios are speculative",
        "Delegate identification solely to managers who do not perform the work",
      ],
      "Hazard identification must examine how work and controls vary beyond steady-state operation and use both technical and frontline knowledge.",
      "Build a work-phase map and identify one hazard that exists only during each transition.",
    ),
    t(
      "Risk assessment",
      "calibrate and use a risk matrix consistently",
      "Risk matrices and decision criteria",
      "teams assign different ratings to the same scenario because severity, likelihood, exposure, and control assumptions are undefined",
      "the matrix produces false precision without common definitions",
      "Define scenario boundaries, rating anchors, exposure and control assumptions, uncertainty rules, and escalation criteria, then calibrate assessors with common cases",
      [
        "Average every assessor's number without resolving different scenario assumptions",
        "Use color alone as proof that two risks are meaningfully different",
        "Change ratings until the project fits the available budget",
      ],
      "A matrix supports structured judgment only when assessors evaluate the same scenario using explicit anchors and decision rules while acknowledging uncertainty.",
      "Write behavioral anchors for two adjacent likelihood categories and test inter-rater agreement.",
    ),
    t(
      "Barrier analysis",
      "distinguish preventive, mitigative, and escalation controls",
      "Bow-tie and critical-control analysis",
      "a bow-tie lists training as every barrier but does not identify what prevents loss of containment or limits release consequences",
      "generic activities obscure barrier function and health",
      "Define the top event and pathways, identify independent preventive and mitigative controls, assign performance standards and owners, and monitor degradation factors",
      [
        "Add more copies of the same training barrier to both sides of the diagram",
        "Treat incident response as prevention of initial loss of containment",
        "Count every policy statement as an independent physical barrier",
      ],
      "Useful barrier analysis distinguishes control functions, independence, ownership, and verifiable performance instead of inflating barrier count with duplicated administration.",
      "Select one critical barrier and define its availability, functionality, survivability, and verification requirements.",
    ),
    t(
      "Failure-mode analysis",
      "prioritize failure modes without treating a score as truth",
      "FMEA and action prioritization",
      "an FMEA team multiplies ordinal ratings, then ignores a catastrophic single-point failure because another minor mode has a slightly larger product",
      "the ranking method masks consequence and weak detectability assumptions",
      "Review severity and critical single-point failures separately, test rating assumptions, use the score as one input, and prioritize controls by scenario significance and feasibility",
      [
        "Follow the numerical product mechanically because multiplication eliminates judgment",
        "Lower the catastrophic severity rating until it falls below the action line",
        "Act only on the most frequent nuisance failure regardless of consequence",
      ],
      "Ordinal products can create ties and reversals; explicit attention to catastrophic modes, uncertainty, and control architecture is necessary.",
      "Demonstrate how two different rating triples can produce the same product but imply different decisions.",
    ),
    t(
      "Process hazard analysis",
      "analyze deviations and safeguard adequacy",
      "HAZOP-style deviation analysis",
      "a process review documents normal flow but does not examine no flow, reverse flow, high pressure, contamination, or utility loss",
      "credible deviations and their causes, effects, and safeguards remain untested",
      "Use a structured multidisciplinary deviation review, document causes and consequences, challenge safeguard independence and effectiveness, and track recommendations",
      [
        "Approve the process because normal operating values are within design limits",
        "Review only deviations that have already caused a site incident",
        "Ask one designer to confirm from memory that safeguards are adequate",
      ],
      "Structured deviation analysis exposes how systems fail away from normal operation and tests whether safeguards address each credible path.",
      "Analyze a loss-of-cooling deviation through cause, consequence, detection, protection, and recovery.",
    ),
    t(
      "Job hazard analysis",
      "convert task observation into effective controls",
      "Task analysis and worker participation",
      "a JHA copies procedure headings but omits actual hand positions, stored energy, tool changes, variability, and recovery from jams",
      "the document does not represent work as performed",
      "Observe representative work with employees, break it into meaningful steps and variations, identify energy and error paths, select stronger controls, and verify field usability",
      [
        "Approve the JHA because its format has every required signature",
        "Add a general instruction to be careful at the end of each step",
        "Analyze only the ideal method demonstrated by the supervisor",
      ],
      "A useful JHA models real work and variation, then links specific hazards to controls; document completeness alone does not establish validity.",
      "Describe how you would include infrequent jam clearing without encouraging workers to demonstrate an unsafe act.",
    ),
    t(
      "Quantitative risk analysis",
      "test model assumptions and dependencies",
      "Event trees, fault trees, and uncertainty",
      "a model multiplies two safeguard failure probabilities as independent although both rely on the same power supply and sensor",
      "common-cause dependency makes the result artificially low",
      "Model the shared dependencies explicitly, validate demand and failure data, perform sensitivity analysis, and communicate uncertainty with the estimate",
      [
        "Keep multiplying because different safeguard names prove independence",
        "Round the result down to avoid alarming leadership",
        "Replace all probability analysis with a single risk-matrix color",
      ],
      "Quantitative precision is misleading when architecture and data assumptions omit common causes; sensitivity and transparent uncertainty are essential.",
      "Draw a fault-tree fragment that adds the common power-supply failure without double counting.",
    ),
    t(
      "Risk communication",
      "communicate uncertainty and decision relevance",
      "Risk characterization and stakeholder communication",
      "an assessment reports one expected-loss number without its scenario range, assumptions, affected groups, or control alternatives",
      "decision-makers may mistake a model estimate for certain and evenly distributed harm",
      "Present scenarios, consequence and likelihood ranges, key assumptions, uncertainty, distributional effects, control options, and explicit decision thresholds",
      [
        "Provide more decimal places so the estimate appears precise",
        "Report only the average because worst cases are emotionally difficult",
        "Hide assumptions to prevent nontechnical stakeholders from questioning the model",
      ],
      "Risk communication should support a decision by making material uncertainty, affected populations, and alternatives visible rather than manufacturing certainty.",
      "Create a one-page risk statement for an executive and a frontline audience without changing the underlying evidence.",
    ),
    t(
      "Emerging risk",
      "manage uncertainty before complete historical data exist",
      "Horizon scanning and precautionary controls",
      "a novel battery process has limited incident history but credible thermal-runaway pathways and rapidly changing supplier designs",
      "absence of site loss data does not establish low risk",
      "Use scenario-based assessment, conservative interim controls, supplier and test evidence, change tracking, monitoring, and staged authorization with stop criteria",
      [
        "Wait for several injuries because historical frequency is required before any control",
        "Assume the technology is safe because it is marketed as sustainable",
        "Copy controls from an unrelated mature process without validating differences",
      ],
      "Emerging risk calls for structured use of mechanisms, analogs, testing, uncertainty, and reversible staged decisions rather than waiting for harm.",
      "Define evidence gates for pilot, limited production, and full-scale authorization.",
    ),
    t(
      "Risk financing and transfer",
      "distinguish transferred loss from retained operational risk",
      "Insurance, contracts, and residual risk",
      "a contract and insurance policy cover portions of a hazardous delivery operation, and leaders claim the transport risk is transferred",
      "financial allocation does not prevent a crash or remove every duty and consequence",
      "Identify retained legal, operational, continuity, reputation, and uninsured consequences, then maintain carrier qualification, route controls, and performance assurance",
      [
        "Stop monitoring the carrier because indemnity eliminates host exposure",
        "Treat policy limits as proof that event likelihood is acceptable",
        "Allow the insurer to make the organization's operational risk-acceptance decision",
      ],
      "Risk transfer can finance specified consequences but does not control event probability or necessarily transfer duties and secondary impacts.",
      "Separate four preventive controls from four financial recovery provisions in the delivery arrangement.",
    ),
  ],
  D4: [
    t(
      "Emergency planning",
      "base plans on credible scenarios and capability",
      "All-hazards planning",
      "the emergency plan uses one generic evacuation instruction for toxic releases, severe weather, fire, and active violence",
      "different hazards require different protective actions and communication",
      "Develop scenario-specific decision criteria, roles, accessible warnings, protective actions, accountability, resources, and recovery interfaces within a common command framework",
      [
        "Keep one evacuation instruction because consistency is more important than hazard behavior",
        "Rely on employees to invent protective actions when an alarm sounds",
        "Plan only for the most recent emergency at the site",
      ],
      "An all-hazards framework should share command and communication foundations while preserving hazard-specific decisions and capabilities.",
      "Compare the protective-action logic for fire, tornado, and an outdoor toxic plume.",
    ),
    t(
      "Incident command",
      "establish clear and scalable command",
      "Incident command and unified coordination",
      "responders receive conflicting tasks from operations, security, and an outside agency during a release",
      "unclear authority creates duplicated work and responder exposure",
      "Establish one incident structure with clear supervisory lines, shared objectives, role-qualified functions, resource tracking, and unified coordination where authorities overlap",
      [
        "Let each responder choose the instruction they prefer",
        "Have every technical specialist command field teams independently",
        "Require the site president to direct every tactical action personally",
      ],
      "Clear command and coordination reduce conflict while allowing technical expertise and multiple authorities to contribute through defined roles.",
      "Distinguish unity of command from unified command in a joint public-private response.",
    ),
    t(
      "Exercises and drills",
      "evaluate capability and verify improvement",
      "Exercise design and after-action management",
      "a drill measures only total evacuation time and prebriefs every expected inject so no participant encounters uncertainty",
      "the exercise cannot reveal decision, communication, or accountability weaknesses",
      "Set capability objectives, use realistic controlled variation, observe critical actions, debrief, assign corrections, and retest effectiveness",
      [
        "Treat a fast total time as proof that every emergency capability works",
        "Hide all observed confusion so the exercise appears successful",
        "Repeat the same fully scripted drill without changing evaluation criteria",
      ],
      "Exercises should generate evidence against defined capabilities and close the improvement loop, not merely produce a favorable completion time.",
      "Write three observable criteria for a shelter-in-place exercise and one retest condition.",
    ),
    t(
      "Protective actions",
      "choose evacuation or sheltering from plume and route conditions",
      "Evacuation, shelter, and accountability",
      "an outdoor toxic plume crosses the normal evacuation route while the building can rapidly isolate outdoor air for a limited period",
      "immediate evacuation could create greater exposure than controlled sheltering",
      "Shelter initially, control air pathways, account and communicate, monitor conditions, and prepare a controlled transition when predefined criteria change",
      [
        "Evacuate everyone through the plume because evacuation is always safest",
        "Open exterior doors so indoor and outdoor air equalize",
        "Let occupants make independent choices without centralized information",
      ],
      "Protective action is dynamic and should minimize exposure using plume, route, building, duration, population, and monitoring evidence.",
      "Define four measurable triggers for moving from shelter to relocation.",
    ),
    t(
      "Business continuity",
      "align recovery objectives with dependencies",
      "Business impact analysis and continuity",
      "a four-hour recovery objective depends on information technology assigned twelve hours and backup power tested for only two hours",
      "upstream resources cannot support the stated process objective",
      "Map dependencies and minimum resources, reconcile recovery objectives and workarounds, and conduct an end-to-end test under realistic loss conditions",
      [
        "Keep the four-hour objective because an approved plan makes it achievable",
        "Let departments set recovery targets without sharing dependency assumptions",
        "Treat insurance coverage as proof that service will recover on time",
      ],
      "A recovery commitment is credible only when dependent technology, people, facilities, suppliers, and utilities can meet the sequence and duration.",
      "Build the minimum recovery sequence and identify its single points of failure.",
    ),
    t(
      "Crisis communication",
      "communicate verified information under uncertainty",
      "Emergency and stakeholder communication",
      "social media reports a chemical release before the incident team has confirmed source, boundary, or protective actions",
      "silence and speculation can both amplify harm",
      "Use a designated communication process to state verified facts, uncertainties, protective actions, update cadence, and correction channels while coordinating with command",
      [
        "Publish an unverified cause immediately to appear decisive",
        "Say nothing until every fact is known regardless of public exposure",
        "Allow each manager to release a different estimate",
      ],
      "Timely risk communication can acknowledge uncertainty without speculation and should remain consistent with operational command and affected-audience needs.",
      "Draft an initial holding statement that is useful without claiming an unverified cause.",
    ),
    t(
      "Medical emergency readiness",
      "match medical capability to credible injury scenarios",
      "First aid, AED, and emergency medical interfaces",
      "the site has rare high-energy trauma potential, a long ambulance response, and first-aid supplies selected only for minor cuts",
      "current capability is mismatched to consequence and response time",
      "Use a medical risk assessment to define trained coverage, equipment, communications, responder protection, transport interfaces, drills, maintenance, and post-event support",
      [
        "Keep the minor-injury kit because serious events are infrequent",
        "Ask untrained volunteers to improvise treatment when needed",
        "Rely on the posted emergency number without testing access and response",
      ],
      "Medical readiness should reflect credible harm, remoteness, workforce, hazards, and professional response time, with maintained and exercised capability.",
      "Define a drill that tests recognition, notification, access, handoff, and responder safety without simulating invasive care.",
    ),
    t(
      "Natural hazards",
      "convert hazard forecasts into operational triggers",
      "Severe-weather and natural-hazard preparedness",
      "the facility receives worsening flood forecasts but the plan says only to monitor conditions and does not define shutdown or relocation thresholds",
      "delay can strand people and prevent safe process isolation",
      "Establish forecast and site-condition triggers, decision authority, staged shutdown and relocation, critical-resource protection, redundant communication, and degraded-mode recovery",
      [
        "Wait until water enters occupied areas before making any decision",
        "Use employee commute decisions as the only site flood indicator",
        "Keep critical equipment operating until utility failure forces shutdown",
      ],
      "Predefined lead-time triggers support orderly protective action before access, utilities, and process control deteriorate.",
      "Create trigger levels for readiness, partial shutdown, full shutdown, and reentry.",
    ),
    t(
      "Mutual aid and external resources",
      "verify external response assumptions",
      "Mutual aid, public agencies, and resource coordination",
      "the plan assumes a neighboring team will provide specialized foam, but equipment compatibility, travel time, authority, and joint communications have never been confirmed",
      "an unverified external resource may not arrive or function when needed",
      "Formalize roles and activation, verify capability and compatibility, share hazard information, exercise communications and access, and define contingencies for delay or unavailability",
      [
        "List the neighbor's phone number and treat the capability as assured",
        "Purchase less on-site protection because mutual aid is geographically close",
        "Wait for an emergency to discover whether connections and command structures work",
      ],
      "Mutual aid becomes a credible barrier only through defined agreements, compatible resources, shared information, exercises, and backup planning.",
      "List five interface checks for the first joint exercise.",
    ),
    t(
      "Security and workplace violence",
      "apply evidence-based threat assessment",
      "Behavioral threat assessment and protective response",
      "reports show escalating fixation, grievance, boundary testing, and weapon access but no explicit time-specific threat",
      "a concerning behavior pathway may progress before a direct threat is stated",
      "Activate a trained multidisciplinary assessment, corroborate behavior and context, protect potential targets, select lawful proportionate interventions, and monitor change",
      [
        "Ignore the reports until an explicit threat includes a date and time",
        "Use demographic profiling as the primary prediction method",
        "Publicly diagnose and accuse the person before gathering facts",
      ],
      "Behavioral assessment considers pathway, capability, stressors, protective factors, and change while preserving privacy, fairness, and proportionate action.",
      "Distinguish concerning communication, intent, capability, and imminence in the response plan.",
    ),
  ],
  D5: [
    t(
      "Environmental aspects",
      "identify significant impacts across operating states",
      "Aspect-impact analysis",
      "the aspect register covers routine waste but omits startup emissions, emergency runoff, supplier activity, and end-of-life equipment",
      "material lifecycle and abnormal-condition pathways are outside the review",
      "Expand the aspect review across activities, products, services, lifecycle influence, normal and abnormal states, emergencies, obligations, and stakeholder concerns",
      [
        "Keep only impacts already associated with a penalty",
        "Exclude suppliers and product end of life because they occur off site",
        "Rate significance solely by annual mass without toxicity or pathway",
      ],
      "A defensible register considers impacts the organization controls or influences across conditions and lifecycle, then applies transparent significance criteria.",
      "Build significance criteria that combine scale, severity, likelihood, legal duty, stakeholder concern, and control.",
    ),
    t(
      "Pollution prevention",
      "prioritize source reduction over downstream handling",
      "Materials and waste hierarchy",
      "a process generates a recurring solvent waste stream and the team compares disposal and recovery without examining why the solvent is used",
      "downstream options overlook prevention at the source",
      "Evaluate process redesign and material substitution first, then reuse, recycling or recovery, treatment, and disposal with lifecycle tradeoffs",
      [
        "Dilute the waste so its concentration appears lower",
        "Store the waste indefinitely instead of changing the process",
        "Select disposal solely by the lowest immediate price",
      ],
      "Source reduction generally avoids material, exposure, and waste-management impacts before downstream controls become necessary.",
      "Identify two worker-safety and two lifecycle checks required before approving a substitute.",
    ),
    t(
      "Air emissions",
      "control and verify a variable emission source",
      "Air pathways and emission control",
      "odor complaints cluster during startup while annual average stack measurements appear acceptable",
      "short-duration operating modes and community pathways may be hidden by annual averaging",
      "Characterize startup conditions and receptors, verify capture and control performance by mode, investigate complaints systematically, and correct source and operating controls",
      [
        "Dismiss complaints because the annual average is low",
        "Increase stack-report decimal precision without new operating-mode data",
        "Use odor-masking chemicals before locating the release pathway",
      ],
      "Mode-specific source and pathway evidence is needed when short events are diluted by annual metrics; response should test both control performance and receptor experience.",
      "Design a monitoring plan that aligns process state, meteorology, control indicators, and complaint timing.",
    ),
    t(
      "Water protection",
      "interrupt a source-pathway-receptor chain",
      "Stormwater, wastewater, and surface-water protection",
      "outdoor chemical containers sit beside an uncovered storm drain that discharges to a creek",
      "a small leak has a direct transport route to a sensitive receptor",
      "Use compatible closed containers, inspected containment and weather protection, separate or isolate drainage, and maintain a tested spill response",
      [
        "Rely on rain to dilute any release",
        "Move containers closer to the drain for easier observation",
        "Wait to label the creek after a spill occurs",
      ],
      "The control package reduces source failure, contains releases, interrupts transport, and prepares response rather than accepting dilution.",
      "Map source, pathway, receptor, detection point, and response boundary for this storage area.",
    ),
    t(
      "Spill management",
      "size and govern spill controls for credible releases",
      "Containment and spill preparedness",
      "secondary containment is sized to nominal vessel volume but ignores displaced equipment, precipitation, drain status, and firewater",
      "usable capacity may be less than the credible liquid inflow",
      "Calculate usable containment for credible scenarios, control drainage and incompatibility, inspect integrity, define response limits, and manage accumulated water",
      [
        "Use geometric volume alone because precipitation is not a process liquid",
        "Leave the drain open so small leaks disappear quickly",
        "Assume responders can always stop inflow before containment fills",
      ],
      "Containment performance depends on actual free capacity, credible inflows, drainage configuration, material compatibility, and response—not nominal geometry alone.",
      "Build a capacity balance including largest release, displacement, rainfall, firewater, and freeboard assumptions.",
    ),
    t(
      "Environmental management systems",
      "connect significant aspects to measurable control",
      "Objectives, operational control, and assurance",
      "a significant solvent-loss aspect has an objective to raise awareness but no baseline, owner, target, control, or review method",
      "the objective cannot guide action or demonstrate performance change",
      "Set a normalized outcome target and baseline, assign ownership and resources, define operational controls and milestones, and monitor effectiveness",
      [
        "Count posters distributed as proof that solvent loss declined",
        "Keep the objective vague so no function is accountable",
        "Remove the aspect from the register because measurement is difficult",
      ],
      "A managed objective links significance to accountable action and measurable performance rather than activity counts or aspiration.",
      "Write one leading and one normalized outcome indicator for solvent loss.",
    ),
    t(
      "Lifecycle assessment",
      "avoid shifting burden through substitution",
      "Lifecycle thinking and change management",
      "a lower-emission coating needs more curing energy and creates a new contaminated wash-water stream",
      "improvement in one medium may transfer material impacts elsewhere",
      "Compare significant lifecycle tradeoffs and requirements, select controls, approve through change management, and monitor actual normalized performance",
      [
        "Approve automatically because direct air emissions decline",
        "Reject every substitution because tradeoffs always exist",
        "Exclude energy and water because other departments manage them",
      ],
      "Lifecycle thinking makes material burden transfers visible so the organization can choose and verify a net improvement rather than optimize one metric.",
      "Create a before-and-after boundary and scorecard that keeps worker risk and product quality visible.",
    ),
    t(
      "Environmental data and ESG",
      "validate a performance claim across boundaries",
      "Environmental metrics, boundaries, and assurance",
      "reported landfill waste falls after outsourcing, while supplier waste is excluded, methods change, and product returns rise",
      "the apparent reduction may be boundary transfer rather than real improvement",
      "Reconstruct comparable boundaries and methods, include material value-chain impacts, normalize activity, verify data controls, and qualify or restate the claim",
      [
        "Use the favorable percentage because external reports are promotional",
        "Exclude outsourced impacts automatically because they occur beyond the fence line",
        "Compare unnormalized totals even though output and returns changed",
      ],
      "Comparable scope, methods, denominators, value-chain relevance, and assurance are necessary for a defensible environmental claim.",
      "List evidence that distinguishes source reduction from transfer across the reporting boundary.",
    ),
    t(
      "Waste stewardship",
      "verify downstream waste disposition",
      "Waste lifecycle and vendor due diligence",
      "a contractor provides complete manifests but credible imagery and community reports suggest illegal dumping near its facility",
      "paperwork conflicts with evidence about physical disposition",
      "Preserve evidence, pause or restrict shipments as warranted, investigate through qualified due diligence and downstream traceability, and use verified alternatives",
      [
        "Continue shipments because signed manifests prove final disposition",
        "Ignore the concern because ownership always ends at pickup",
        "Delete community reports because they are not internal records",
      ],
      "Documents and contracts do not prove physical disposition or erase legal, environmental, continuity, and reputation exposure when contrary evidence is credible.",
      "Build a vendor scorecard that tests actual disposition rather than document presence alone.",
    ),
    t(
      "Climate and resilience",
      "integrate changing environmental conditions into risk control",
      "Physical climate risk and adaptive planning",
      "historical drainage design is repeatedly exceeded by recent extreme rainfall and critical chemicals remain in the flood path",
      "a stationary historical assumption no longer represents operating conditions",
      "Update hazard data and scenarios, protect or relocate critical materials, add layered drainage and shutdown controls, set triggers, and monitor adaptation performance",
      [
        "Keep the historical design basis until a regulatory number changes",
        "Rely only on insurance to address increasing physical exposure",
        "Treat every event as unpredictable and avoid planning thresholds",
      ],
      "Resilience planning revisits design assumptions using current evidence and uses layered adaptation, operational triggers, and learning rather than loss financing alone.",
      "Separate no-regret near-term controls from long-life capital decisions requiring scenario analysis.",
    ),
  ],
  D6: [
    t(
      "Industrial hygiene strategy",
      "design representative exposure assessment",
      "Anticipation, recognition, evaluation, and control",
      "limited samples come from volunteers on day shift although tasks, controls, materials, and shifts vary substantially",
      "convenience sampling may miss the highest and most uncertain exposure groups",
      "Define similar exposure groups, prioritize plausible worst cases and uncertainty, document selection, and iteratively refine sampling and controls",
      [
        "Apply the volunteer average to every worker without qualification",
        "Collect only outdoor background samples",
        "Sample managers because they can describe all production tasks",
      ],
      "Risk-based exposure groups and transparent selection use limited resources more representatively than convenience sampling.",
      "Explain what a tenfold spread within one proposed group implies for regrouping and follow-up.",
    ),
    t(
      "Toxicology",
      "integrate multiple routes and effect timing",
      "Dose, routes of entry, and health effects",
      "air results are low during solvent hand wiping, but the agent penetrates skin and gloves are reused beyond breakthrough guidance",
      "dermal uptake may materially increase systemic dose without visible injury",
      "Control the source and contact, select and manage compatible gloves from permeation data, improve hygiene, and evaluate inhalation and dermal contribution together",
      [
        "Conclude total exposure is low because the air concentration is low",
        "Use any glove material because all gloves permanently block solvent",
        "Wait for visible skin burns before treating dermal contact as important",
      ],
      "Total occupational dose can involve several routes; route-specific assessment and control are needed even when one measurement appears favorable.",
      "Build a glove-change rule from breakthrough, permeation, temperature, task contact, and reuse conditions.",
    ),
    t(
      "Ventilation",
      "verify source capture rather than a design-point reading",
      "Local exhaust ventilation",
      "hood face velocity meets a nominal value but the contaminant plume crosses the breathing zone before entering the hood",
      "source-receptor-hood geometry defeats effective capture",
      "Correct hood distance and orientation and cross-drafts, then verify plume path, airflow, and personal exposure under representative operation",
      [
        "Accept the control because one face-velocity measurement meets design",
        "Increase room temperature without changing capture geometry",
        "Rely on visible plume direction as the only exposure measurement",
      ],
      "Capture depends on plume behavior, distance, orientation, cross-drafts, and task conditions; a design-point velocity alone does not establish exposure control.",
      "Design a smoke visualization and personal-sampling test for the corrected hood.",
    ),
    t(
      "Noise",
      "prioritize source and path controls for noise",
      "Noise assessment and control",
      "operators exceed the site's dose criterion near a compressor for which an effective acoustic enclosure is technically feasible",
      "hearing conservation alone leaves avoidable sound energy at the receiver",
      "Install and maintain the engineered enclosure, verify exposure reduction, and manage residual risk through the hearing-conservation program",
      [
        "Rely only on annual audiograms to control exposure",
        "Post a loud-area sign without reducing sound",
        "Reduce rest breaks so the noisy work finishes sooner",
      ],
      "Engineering at source or path reduces exposure independent of perfect PPE behavior; surveillance and protection remain secondary layers for residual risk.",
      "Identify enclosure features that prevent thermal, access, and maintenance problems from undermining the control.",
    ),
    t(
      "Thermal stress",
      "manage heat strain from environment, work, clothing, and acclimatization",
      "Heat balance and physiological strain",
      "an employee returns to heavy outdoor work in impermeable clothing after an extended absence during hotter and more humid conditions",
      "workload, blocked evaporation, and reduced acclimatization interact",
      "Reassess heat stress and individual readiness, phase exposure, reduce workload or environmental heat, support recovery and hydration, and monitor strain",
      [
        "Use air temperature alone to declare the task acceptable",
        "Assume prior acclimatization remains permanent after time away",
        "Rely on thirst as the only early-warning and control method",
      ],
      "Heat strain reflects environmental, metabolic, clothing, and individual factors; acclimatization and controls must match current conditions.",
      "Create return-to-work exposure stages and measurable stop criteria without making medical diagnoses.",
    ),
    t(
      "Radiation",
      "apply time, distance, shielding, and verification",
      "Ionizing and nonionizing radiation control",
      "a task plan relies on shorter work time but does not evaluate increased distance, source shielding, interlocks, access control, or survey evidence",
      "administrative dose reduction is used before feasible source and path controls",
      "Optimize source control, shielding and distance, restrict access, minimize necessary time, and verify conditions with suitable calibrated instruments and dosimetry",
      [
        "Increase individual dose limits so the task can continue",
        "Use work rotation as proof that collective dose falls",
        "Assume distance has no effect when the source appears small",
      ],
      "Radiation protection combines engineered and administrative controls with measurement; redistributing dose does not necessarily reduce collective exposure.",
      "Explain when inverse-square estimates fail because of geometry, scatter, or shielding configuration.",
    ),
    t(
      "Ergonomics",
      "redesign a high-force repetitive task",
      "Ergonomic assessment and design",
      "workers repeatedly lift unstable loads from floor level while twisting to a conveyor at shoulder height",
      "force, posture, repetition, load coupling, and asymmetry combine",
      "Redesign load height, destination and orientation, reduce load demand, improve coupling or mechanize transfer, then verify worker and production outcomes",
      [
        "Train workers to lift carefully while preserving every physical demand",
        "Rotate workers without reducing total hazardous work",
        "Issue back belts as the primary source control",
      ],
      "Task redesign addresses interacting physical demands at source; training and rotation alone leave the hazardous system substantially unchanged.",
      "Select measures that detect both reduced biomechanical demand and unintended production or new-hazard effects.",
    ),
    t(
      "Epidemiology and statistics",
      "interpret a cluster without premature causal claims",
      "Occupational health data and study design",
      "a small department reports several similar symptoms after a process change, but exposure, baseline, case definition, participation, and comparison data are incomplete",
      "both a true work-related cluster and reporting or selection effects remain plausible",
      "Define cases and population, characterize timing and exposure, protect privacy, compare appropriate data, investigate controls, and communicate uncertainty without delaying prudent protection",
      [
        "Declare a proven causal association from the raw case count alone",
        "Dismiss the reports because the group is too small for perfect statistics",
        "Publish identifiable medical details so coworkers can judge the cases",
      ],
      "A disciplined cluster review builds exposure and denominator evidence while proportionate interim controls can proceed before causal certainty.",
      "Identify confounding, selection bias, information bias, and denominator problems in the initial report.",
    ),
    t(
      "Respiratory protection",
      "select protection for an unknown potentially IDLH atmosphere",
      "Respirator selection and program limits",
      "a vessel contains an unknown vapor and oxygen status cannot be established before proposed entry",
      "air-purifying performance cannot be assured in an unknown or oxygen-deficient atmosphere",
      "Treat the atmosphere conservatively and use a suitable positive-pressure atmosphere-supplying configuration within a complete entry and rescue system",
      [
        "Use a disposable particulate filtering facepiece",
        "Choose any organic-vapor cartridge without identifying the contaminant",
        "Allow brief entry while the worker holds their breath",
      ],
      "Unknown concentration and oxygen status require a protection and rescue approach suitable for the worst credible atmosphere until reliable characterization changes the basis.",
      "List every condition that must be known before an air-purifying respirator could be considered for later work.",
    ),
    t(
      "Worker well-being and fitness",
      "integrate work design, health support, privacy, and fairness",
      "Total Worker Health and fitness for duty",
      "night-driving incidents rise after mandatory overtime and leaders propose disclosing diagnoses and excluding anyone who reports fatigue",
      "a work-organization hazard is being shifted entirely to individuals",
      "Control schedules, workload, recovery and task risk; provide confidential qualified health support; share only necessary restrictions; and monitor safety and equitable outcomes",
      [
        "Treat fatigue solely as a personal lifestyle failure",
        "Use diagnosis disclosure and blanket exclusion as the only controls",
        "Stop collecting fatigue and incident information to avoid privacy concerns",
      ],
      "A comprehensive response addresses upstream work exposure and confidential individual support while preventing unnecessary disclosure and inequitable decisions.",
      "Define measures for fatigue risk, operational performance, privacy, accommodation, and unintended exclusion.",
    ),
  ],
  D7: [
    t(
      "Training needs assessment",
      "distinguish a capability gap from a work-system barrier",
      "Knowledge, skill, motivation, and environment analysis",
      "employees correctly demonstrate gas testing but skip it in the field because calibrated instruments are inaccessible on night shift",
      "resources and work design prevent execution despite demonstrated capability",
      "Correct instrument access and the work system first, then verify field performance and train only any remaining capability gap",
      [
        "Assign the same longer refresher course without changing access",
        "Lower the testing requirement to match current resources",
        "Assume poor motivation and begin discipline without investigating the barrier",
      ],
      "Training cannot supply missing equipment or opportunity; diagnosis should target the demonstrated cause and then confirm performance.",
      "Apply a knowledge-skill-motivation-environment diagnosis to a second safety behavior.",
    ),
    t(
      "Learning objectives",
      "write an observable criterion-based objective",
      "Conditions, behavior, and performance criteria",
      "a course objective says only that participants will understand emergency radio use",
      "the statement cannot guide authentic assessment",
      "Specify the equipment and scenario, the observable transmission behavior, required information and sequence, and an acceptable performance criterion",
      [
        "Replace understand with appreciate and leave the objective unchanged otherwise",
        "List the number of presentation slides as the criterion",
        "Use attendance as proof that the radio skill was achieved",
      ],
      "Observable conditions, behavior, and criteria align instruction, practice, and assessment to the task.",
      "Write the complete objective and add a delayed retention condition.",
    ),
    t(
      "Adult learning",
      "use relevant experience and active problem solving",
      "Andragogy and learner engagement",
      "experienced technicians attend a passive procedure lecture that prohibits questions and never uses their actual tasks",
      "delivery ignores relevance, prior knowledge, practice, and feedback",
      "Connect the change to real problems, elicit and test prior knowledge, use authentic decisions and practice, and provide timely feedback",
      [
        "Read every slide aloud more slowly and keep questions prohibited",
        "Require memorization of section numbers without application",
        "Replace practice with a signed acknowledgement",
      ],
      "Relevant problem-centered participation uses adult experience productively while authentic practice reveals outdated shortcuts or gaps.",
      "Describe how you would use expert experience without allowing informal unsafe norms to become the standard.",
    ),
    t(
      "Instructional methods",
      "match method to a procedural performance outcome",
      "Demonstration, deliberate practice, and feedback",
      "workers must inspect and don complex fall-protection equipment but receive only a poster and lecture",
      "passive exposure cannot demonstrate physical inspection and fitting skill",
      "Use expert demonstration, supervised hands-on practice across realistic variations, checklist-based feedback, and individual performance assessment",
      [
        "Use an attendance signature as the sole competence record",
        "Add more poster text without allowing equipment handling",
        "Assess only vocabulary definitions in a written quiz",
      ],
      "A procedural outcome requires modeled and observed performance, realistic practice, and corrective feedback aligned to critical task steps.",
      "Define one critical error that triggers immediate stop and remediation during assessment.",
    ),
    t(
      "Training evaluation",
      "measure learning transfer and operational effect",
      "Reaction, learning, transfer, and results",
      "participants rate a course highly and pass its quiz, but leaders claim field brief quality improved without observing any briefs",
      "reaction and knowledge do not establish workplace transfer",
      "Use repeated reliable field observations, coaching and barrier data, delayed retention checks, and relevant exposure or outcome trends",
      [
        "Use satisfaction scores alone as proof of behavior change",
        "Count presentation slides and instructor experience",
        "Treat certificates printed as the outcome measure",
      ],
      "Evaluation should progress from learning evidence to behavior in context and risk-relevant results while accounting for other influences.",
      "Write three observable brief-quality criteria that independent raters can score consistently.",
    ),
    t(
      "Competence and qualification",
      "govern role authorization with demonstrated evidence",
      "Competent and qualified roles",
      "an attendance record from a general awareness class is used to authorize every worker for a specialized high-hazard role",
      "presence does not establish role-specific knowledge, skill, judgment, or authority",
      "Define role criteria, prerequisites, authentic evaluation, designation authority, limits, records, supervision, and requalification triggers",
      [
        "Treat attendance as permanent qualification for every scenario",
        "Let workers self-designate after reading the procedure once",
        "Assume the instructor now owns all employer authorization duties",
      ],
      "Qualification is a governed role decision supported by defined and demonstrated criteria, not a synonym for course attendance.",
      "Build a role matrix separating awareness, competence, designation, limits, and refresher triggers.",
    ),
    t(
      "Safety communication and culture",
      "support speaking up with fair accountability",
      "Psychological safety and feedback",
      "new employees stop asking questions after a supervisor mocks one worker for reporting uncertainty",
      "leadership behavior suppresses weak signals and learning",
      "Set and model respectful response norms, address the conduct, create safe stop-and-ask routes, close the feedback loop, and preserve fair accountability",
      [
        "Tell employees to be tougher and leave supervisory behavior unchanged",
        "Promise that no reported action will ever be reviewed",
        "Require every urgent question to be anonymous",
      ],
      "Psychological safety supports questions and reporting without removing standards; leaders make the system credible through consistent response.",
      "Define a measure of silence or reporting quality that does not reward raw report volume.",
    ),
    t(
      "Accessible communication",
      "make critical instructions perceivable and actionable",
      "Multilingual and multimodal risk communication",
      "a critical alarm uses one spoken language although the workforce has varied language, literacy, and hearing needs",
      "foreseeable users may not perceive or understand the protective action",
      "Use tested redundant audible, visual and needed tactile cues, concise translated and pictorial instructions, drills, teach-back, and field verification",
      [
        "Rely on coworkers to improvise translation during the emergency",
        "Distribute one technical manual and treat signatures as understanding",
        "Use the management language only because it is the official language",
      ],
      "Critical communication must be perceivable, understandable, actionable, and reliable under real conditions using redundant channels and demonstrated comprehension.",
      "Test alarm perception, comprehension, decision, and action as separate drill measures.",
    ),
    t(
      "Adaptive learning",
      "govern an adaptive mastery decision",
      "Item response, coverage, and assessment validity",
      "a small question bank repeats until users memorize positions, then declares mastery from confidence and three correct answers",
      "item exposure and a weak stopping rule inflate scores without broad competence",
      "Map broad content, control repeat exposure, use calibrated novel forms and authentic tasks, require domain coverage and precision, and validate the rule against performance",
      [
        "Accept the result because adaptive sequencing automatically creates validity",
        "Randomize button colors while retaining the same exposed items",
        "Use self-reported confidence as the sole passing criterion",
      ],
      "Adaptivity does not guarantee content validity, item quality, coverage, security, calibration, or transfer; each needs evidence.",
      "Write a stopping rule that requires statistical precision and minimum novel coverage in every critical cluster.",
    ),
    t(
      "Retention and transfer",
      "strengthen durable retrieval and varied application",
      "Spacing, retrieval, interleaving, and transfer",
      "learners pass immediately after massed practice but fail to recognize the same hazard in a different task three months later",
      "short-term fluency has been mistaken for durable transferable learning",
      "Use spaced effortful retrieval, interleaved varied scenarios, prompt feedback, fading support, delayed tests, and workplace reinforcement",
      [
        "Repeat the same example many times in one sitting",
        "Show the answer before every attempt indefinitely",
        "Measure only immediate satisfaction after training",
      ],
      "Spacing, retrieval, varied context, and delayed evidence strengthen and test access beyond the original cues.",
      "Create a four-touch schedule and explain how support and contextual variation change at each touch.",
    ),
  ],
};

const SETTINGS: Readonly<Record<QuestionPool, readonly string[]>> = {
  practice: [
    "fabrication shop",
    "food-packaging line",
    "regional distribution center",
    "municipal water utility",
    "hospital central plant",
    "laboratory pilot line",
    "rail maintenance yard",
    "beverage facility",
    "solar construction project",
    "paper converting line",
    "cold-storage warehouse",
    "aircraft repair hangar",
    "aggregate processing site",
    "semiconductor plant",
    "data-center expansion",
  ],
  "mock-a": [
    "coastal refinery turnaround",
    "urban tower project",
    "bulk chemical terminal",
    "automated fulfillment campus",
    "pharmaceutical expansion",
    "mining maintenance outage",
    "aerospace composite plant",
    "natural-gas compressor station",
    "port crane modernization",
    "university research complex",
    "battery manufacturing line",
    "pulp-mill recovery area",
  ],
  "mock-b": [
    "multi-site energy portfolio",
    "international logistics group",
    "regional healthcare network",
    "diversified manufacturer",
    "public infrastructure program",
    "specialty-chemicals division",
    "food and beverage enterprise",
    "renewable construction fleet",
    "electronics supply network",
    "metals processing group",
    "national laboratory system",
    "municipal services authority",
  ],
};

const CONSTRAINTS: Readonly<Record<QuestionPool, readonly string[]>> = {
  practice: [
    "the condition is most pronounced on the night shift",
    "two contractor crews share the area",
    "the procedure was written before the last equipment change",
    "production demand is temporarily elevated",
    "a recent near miss exposed the weakness",
    "the responsible supervisor is newly assigned",
    "the work occurs only during weekly cleaning",
    "the existing indicator is a raw annual count",
    "workers have already raised the issue twice",
    "a temporary control has remained for three months",
    "the next planned outage is several weeks away",
  ],
  "mock-a": [
    "simultaneous operations narrow the available work window",
    "a temporary safeguard impairment affects the same scenario",
    "contractors and host employees use different procedures",
    "a weather change is expected before the next shift",
    "the only recent metric is favorable but lacks an exposure denominator",
    "startup authorization is requested before all actions are verified",
    "a vendor recommends relying on operator response",
    "the workforce is split across three languages and two shifts",
    "one barrier depends on the same utility as the initiating event",
    "management has approved production but not risk acceptance",
  ],
  "mock-b": [
    "an acquisition has changed reporting boundaries",
    "site incentives reward schedule and discourage escalation",
    "outsourcing has moved both work and data beyond the fence line",
    "leading and lagging indicators point in different directions",
    "capital is limited and leaders request a risk-ranked portfolio",
    "the board wants one number despite material uncertainty",
    "local procedures conflict with the enterprise standard",
    "assurance results vary sharply among business units",
    "the proposed metric can be improved without reducing exposure",
    "responsibility is divided among operations, procurement, and EHS",
  ],
};

const REFERENCE_LENSES: Readonly<Record<QuestionPool, readonly string[]>> = {
  practice: [
    "source-control selection",
    "field diagnosis",
    "human-performance variation",
    "control verification",
    "change and residual risk",
  ],
  "mock-a": [
    "field release evidence",
    "degraded-mode operation",
    "simultaneous-work interface",
    "temporary-change authorization",
    "precursor response",
  ],
  "mock-b": [
    "enterprise assurance",
    "portfolio allocation",
    "metric governance",
    "boundary due diligence",
    "risk acceptance uncertainty",
  ],
};

const WINDOWS = ["one hour", "four hours", "one shift", "two days", "one week", "one month"] as const;

function withIndefiniteArticle(value: string): string {
  const normalized = value.trim().toLowerCase();
  const takesAn = /^(?:honest|hour|heir|herb)/.test(normalized)
    || (/^[aeiou]/.test(normalized) && !/^(?:uni(?:versity|form)|use|user|euro|one)/.test(normalized));
  return `${takesAn ? "an" : "a"} ${value}`;
}

function withoutTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?]+$/, "");
}

function lowerFirst(value: string): string {
  return value.length === 0 ? value : `${value[0].toLowerCase()}${value.slice(1)}`;
}

function adaptLeadingAction(value: string, pool: Exclude<QuestionPool, "practice">): string {
  const action = withoutTerminalPunctuation(value);
  const firstSpace = action.indexOf(" ");
  const leading = firstSpace < 0 ? action : action.slice(0, firstSpace);
  const remainder = firstSpace < 0 ? "" : action.slice(firstSpace);
  const replacements: Readonly<Record<Exclude<QuestionPool, "practice">, Readonly<Record<string, string>>>> = {
    "mock-a": {
      Activate: "Mobilize",
      Calculate: "Determine",
      Characterize: "Establish",
      Compare: "Evaluate",
      Connect: "Link",
      Control: "Manage",
      Correct: "Resolve",
      Define: "Set",
      Develop: "Create",
      Establish: "Set",
      Evaluate: "Assess",
      Examine: "Review",
      Expand: "Broaden",
      Explain: "Reconcile",
      Formalize: "Document",
      Identify: "Determine",
      Install: "Put in place",
      Isolate: "Separate",
      Map: "Trace",
      Measure: "Assess",
      Model: "Represent",
      Observe: "Inspect",
      Optimize: "Improve",
      Preserve: "Maintain",
      Present: "Provide",
      Prioritize: "Order",
      Rank: "Order",
      Reassess: "Reevaluate",
      Reconstruct: "Rebuild",
      Redesign: "Reconfigure",
      Remove: "Eliminate",
      Review: "Evaluate",
      Select: "Choose",
      Set: "Define",
      Shelter: "Keep personnel sheltered",
      Specify: "State",
      Stop: "Suspend",
      Treat: "Manage",
      Update: "Revise",
      Use: "Apply",
      Validate: "Confirm",
      Verify: "Confirm",
    },
    "mock-b": {
      Activate: "Mandate activation of",
      Calculate: "Standardize calculation of",
      Characterize: "Require characterization of",
      Compare: "Benchmark",
      Connect: "Align",
      Control: "Govern",
      Correct: "Mandate correction of",
      Define: "Standardize",
      Develop: "Adopt",
      Establish: "Standardize",
      Evaluate: "Compare",
      Examine: "Audit",
      Expand: "Extend",
      Explain: "Require reconciliation of",
      Formalize: "Govern",
      Identify: "Require identification of",
      Install: "Require installation of",
      Isolate: "Require isolation of",
      Map: "Document",
      Measure: "Benchmark",
      Model: "Require modeling of",
      Observe: "Sample",
      Optimize: "Standardize improvement of",
      Preserve: "Retain",
      Present: "Report",
      Prioritize: "Portfolio-rank",
      Rank: "Portfolio-rank",
      Reassess: "Commission a reassessment of",
      Reconstruct: "Require reconstruction of",
      Redesign: "Mandate an engineered redesign of",
      Remove: "Mandate removal of",
      Review: "Audit",
      Select: "Approve",
      Set: "Adopt",
      Shelter: "Standardize sheltering of personnel",
      Specify: "Standardize",
      Stop: "Prohibit",
      Treat: "Classify",
      Update: "Mandate updating of",
      Use: "Require",
      Validate: "Independently confirm",
      Verify: "Independently confirm",
    },
  };
  const replacement = replacements[pool][leading];
  if (replacement) {
    return `${replacement}${remainder}`;
  }
  return pool === "mock-a"
    ? `For the current release decision, ${lowerFirst(action)}`
    : `Across the enterprise, ${lowerFirst(action)}`;
}

const OPTION_IMPLEMENTATION: Readonly<Record<QuestionPool, readonly string[]>> = {
  practice: [
    "have the line supervisor observe the result during representative work",
    "compare the post-action condition with the stated task baseline",
    "record the operating owner and the next field-review date",
    "include affected workers when checking how the task actually changes",
    "use a task-level measure during the next representative work cycle",
    "check the result on the shift where the condition is most evident",
    "document who implements the action and who verifies it in the field",
    "review the result with the crew before closing the action",
  ],
  "mock-a": [
    "make the shift supervisor the go/no-go owner for the current operating period",
    "state the observable field condition that authorizes restart",
    "communicate the decision to host and contractor crews before work begins",
    "check the chosen condition during the degraded operating mode",
    "define the observable trigger for stopping the work again",
    "record the temporary decision owner and the end of its authorization",
    "confirm the field condition at handover before the next operating phase",
    "use the same release criterion for every crew entering the affected area",
  ],
  "mock-b": [
    "require business-unit leaders to report results against a common assurance protocol",
    "sample local performance before accepting the portfolio-level result",
    "retain scenario and exposure detail in the enterprise dashboard",
    "assign escalation and residual-risk decisions to an authorized owner",
    "compare site evidence before allocating the next control investment",
    "test implementation across high- and low-performing business units",
    "preserve local exceptions and uncertainty in the board-level summary",
    "use independent assurance before closing the enterprise action",
  ],
};

function composeDecisionAlternatives(
  pool: QuestionPool,
  correct: string,
  distractors: [string, string, string],
  setting: string,
  index: number,
): { correct: string; distractors: [string, string, string] } {
  const cores = [correct, ...distractors];
  const implementation = OPTION_IMPLEMENTATION[pool];
  const enriched = cores.map((core, optionIndex) => {
    const details = [
      implementation[(index * 3 + optionIndex * 5 + setting.length) % implementation.length],
      implementation[(index * 7 + optionIndex * 3 + setting.length + 1) % implementation.length],
      implementation[(index * 5 + optionIndex * 7 + setting.length + 2) % implementation.length],
    ];
    let option = withoutTerminalPunctuation(core);
    let detailIndex = 0;
    const targetLength = 205 + ((index + optionIndex * 2) % 4) * 18;
    while (option.length < targetLength && detailIndex < details.length) {
      option = `${option}; ${details[detailIndex]}`;
      detailIndex += 1;
    }
    return `${option}.`;
  }) as [string, string, string, string];
  return { correct: enriched[0], distractors: [enriched[1], enriched[2], enriched[3]] };
}

function rotateChoices(
  correct: string,
  distractors: [string, string, string],
  rotation: number,
): {
  options: [string, string, string, string];
  correctIndex: OptionIndex;
  wrongRationales: [string, string, string, string];
} {
  const canonical = [correct, ...distractors] as [string, string, string, string];
  const canonicalRationales = [
    "Correct. This option addresses the material mechanism and includes verification of control performance.",
    "This option leaves a material part of the stated scenario uncontrolled or relies on an unsupported assumption.",
    "This option substitutes a weak signal or administrative response for control of the identified risk pathway.",
    "This option delays, transfers, or obscures the risk instead of producing defensible control evidence.",
  ] as [string, string, string, string];
  const shift = rotation % 4;
  const options = [0, 1, 2, 3].map((position) => canonical[(position - shift + 4) % 4]) as [
    string,
    string,
    string,
    string,
  ];
  const wrongRationales = [0, 1, 2, 3].map(
    (position) => canonicalRationales[(position - shift + 4) % 4],
  ) as [string, string, string, string];
  return { options, correctIndex: shift as OptionIndex, wrongRationales };
}

function scenarioStem(
  pool: QuestionPool,
  topic: Topic,
  setting: string,
  constraint: string,
  index: number,
  difficulty: QuestionDifficulty,
): string {
  // The affected-population size is monotonic within a domain, so repeated
  // topic/settings still represent a distinct evidence base rather than an
  // item distinguished only by an opaque serial label.
  const people = 12 + index * 3 + difficulty;
  const findingRate = 6 + ((index * 13 + difficulty * 3) % 61);
  const window = WINDOWS[(index + difficulty) % WINDOWS.length];
  const pattern = index % 10;
  const site = withIndefiniteArticle(setting);
  const scenarioLens = REFERENCE_LENSES[pool][Math.floor(index / 10) % REFERENCE_LENSES[pool].length];

  if (pool === "practice") {
    const stems = [
      `At ${site}, a focused review involving ${people} potentially affected people finds that ${topic.finding}. In addition, ${constraint}; the latest representative check shows the condition in ${findingRate}% of sampled opportunities. Which response best addresses the decision before the next ${window} work cycle?`,
      `A CSP supporting operations at ${site} is asked to rank four responses after learning that ${topic.finding}. Because ${constraint} and ${people} people can encounter the condition, what should the CSP recommend within ${window}?`,
      `Field observation at ${site} shows that ${topic.finding}; ${findingRate}% of a ${people}-opportunity sample contains the same weakness. Given that ${constraint}, which option most directly interrupts the material risk pathway?`,
      `A procedure-performance comparison at ${site} reveals this gap: ${topic.finding}. The gap affects ${people} people, the decision is due in ${window}, and ${constraint}. Which action best converts the finding into verified control?`,
      `During a pre-task review at ${site}, employees challenge the current assumption because ${topic.finding}. A representative sample finds ${findingRate}% recurrence and ${constraint}. Which response applies the hierarchy and evidence most defensibly?`,
      `The owner of a control at ${site} reports completion, yet assurance sampling shows that ${topic.finding}. With ${people} people in scope and ${constraint}, what is the strongest next decision?`,
      `A change proposal at ${site} must be decided within ${window}. Baseline evidence shows that ${topic.finding}, the affected group is ${people}, and ${constraint}. Which option best manages the change and residual risk?`,
      `An incident precursor at ${site} exposes a familiar but unresolved issue: ${topic.finding}. The same mechanism appears in ${findingRate}% of follow-up observations, while ${constraint}. What should take priority?`,
      `Workers at ${site} ask why a documented activity has not reduced exposure. Reviewers find that ${topic.finding}; ${constraint}. Which response best distinguishes activity completion from control effectiveness?`,
      `A review of ${topic.referenceTopic} at ${site} must choose among elimination, weaker administrative action, risk transfer, and delay after confirming that ${topic.finding}. Considering ${people} affected people, a ${window} horizon, and ${topic.hazard}, which choice is strongest?`,
    ];
    return stems[pattern];
  }
  if (pool === "mock-a") {
    const stems = [
      `At ${site}, the operating team confirms that ${topic.finding} while ${constraint}. The decision window is ${window}, ${people} people may be affected, and ${topic.hazard}. Which action is the most defensible next step?`,
      `A shift handover at ${site} presents conflicting evidence: a favorable outcome metric but confirmation that ${topic.finding}. Given that ${constraint}, which ${topic.referenceTopic} field-verification gate should control continued operation under the ${scenarioLens} lens?`,
      `Startup authorization is requested at ${site} even though ${topic.finding}. The team has ${window} before the next operating phase and ${constraint}. What should the CSP require before release?`,
      `A degraded-mode decision at ${site} affects ${people} people. Reviewers establish that ${topic.finding}, and ${constraint}. Which response best defines a safe state and ${topic.referenceTopic} restart criterion within ${window}?`,
      `Two operating groups at ${site} disagree over responsibility after learning that ${topic.finding}. Because ${constraint}, which action best coordinates the interface and controls the immediate scenario?`,
      `An operator proposes monitoring instead of stopping work at ${site}, where ${topic.finding}. The proposal must address ${topic.hazard} for the next ${window}. Which decision is defensible?`,
      `A temporary change at ${site} has outlasted its original authorization. Current evidence shows that ${topic.finding}; ${constraint}. What information and action are required now?`,
      `A near miss at ${site} produces no injury but confirms that ${topic.finding}. With ${people} people potentially exposed and ${constraint}, which option uses precursor evidence correctly?`,
      `A contractor-host coordination meeting at ${site} reveals that ${topic.finding}. The work begins in ${window}, and ${constraint}. Which operational condition should govern authorization?`,
      `The field leader at ${site} asks for a simple go/no-go rule after reviewers find that ${topic.finding}. Given that ${constraint}, which response supplies the strongest ${topic.referenceTopic} release evidence under the ${scenarioLens} lens?`,
    ];
    return stems[pattern];
  }
  const stems = [
    `An enterprise assurance review of ${site} finds that ${topic.finding}. The pattern appears in ${findingRate}% of ${people} sampled control opportunities, and ${constraint}. Which recommendation best demonstrates CSP-level judgment while leadership sets priorities for the next ${window}?`,
    `A governance committee overseeing ${site} receives one favorable average while local evidence shows that ${topic.finding}. Because ${constraint}, which ${scenarioLens} recommendation best preserves ${topic.referenceTopic} scenario and exposure detail?`,
    `Capital allocation across ${site} must be completed within ${window}. One candidate risk is characterized by this finding: ${topic.finding}. Given that ${constraint}, how should leadership apply the ${scenarioLens} lens to the ${topic.referenceTopic} decision?`,
    `Due diligence for ${site} reports that ${topic.finding}, but ownership crosses several organizational boundaries and ${constraint}. Which ${scenarioLens} response best tests retained control and ${topic.referenceTopic} assumptions?`,
    `The board for ${site} asks for one risk number after reviewers determine that ${topic.finding}. Because ${constraint}, what should the CSP communicate before residual risk is accepted?`,
    `A cross-site benchmark at ${site} ranks units by a raw count even though ${topic.finding}. The sample covers ${people} control opportunities and ${constraint}. Which governance correction is strongest?`,
    `An enterprise standard at ${site} is marked complete at every site, but assurance evidence shows that ${topic.finding}. What ${topic.referenceTopic} recommendation best converts document adoption into performance accountability?`,
    `An outsourced activity within ${site} appears favorable in the host dashboard, yet reviewers learn that ${topic.finding}; ${constraint}. Which ${topic.referenceTopic} due-diligence response is most defensible?`,
    `Leaders of ${site} disagree because leading and lagging data conflict after ${topic.finding}. Which ${topic.referenceTopic} interpretation and assurance step best supports an authorized risk decision?`,
    `A portfolio review for ${site} must select a scalable control while local conditions differ. Evidence shows that ${topic.finding}, affecting ${findingRate}% of sampled opportunities. Which ${scenarioLens} enterprise action preserves ${topic.referenceTopic} validity?`,
  ];
  return stems[pattern];
}

function conceptualDraft(
  pool: QuestionPool,
  domainId: CspDomainId,
  index: number,
  difficulty: QuestionDifficulty,
): Draft {
  const topics = TOPICS[domainId];
  const topic = topics[(index * 7 + difficulty) % topics.length];
  const settings = SETTINGS[pool];
  const constraints = CONSTRAINTS[pool];
  const setting = settings[(index * 5 + Number(domainId[1])) % settings.length];
  const constraint = constraints[(index * 7 + difficulty + Number(domainId[1])) % constraints.length];
  const referenceLens = REFERENCE_LENSES[pool][Math.floor(index / topics.length) % REFERENCE_LENSES[pool].length];
  if (pool === "practice") {
    const practiceFamilies = [
      "practice/source-control-selection",
      "practice/field-defect-diagnosis",
      "practice/hierarchy-comparison",
      "practice/procedure-to-performance",
      "practice/evidence-interpretation",
    ] as const;
    const practiceSynthesis = [
      `Verify performance under the stated constraint before closing the ${referenceLens} review at the ${setting}`,
      `Compare baseline and post-control evidence at the ${setting}, then define a response if the control misses its criterion`,
      `Include affected workers in a ${referenceLens} validation of the changed task at the ${setting}`,
      `Assign an operational owner and test the selected control against an observable criterion at the ${setting}`,
      `Document the residual scenario and escalation threshold after the ${referenceLens} review at the ${setting}`,
    ][index % 5];
    const distractors: [string, string, string] = [
      `${topic.distractors[0]}. Track completion at the ${setting}, but do not test the source or pathway control under the stated constraint.`,
      `${topic.distractors[1]}. Use the next lagging outcome as the only effectiveness check and leave the current control assumption unchanged.`,
      `${topic.distractors[2]}. Assign follow-up to EHS, although operations retains the unresolved hazard and control authority at the ${setting}.`,
    ];
    const correct = `${withoutTerminalPunctuation(topic.correct)}; ${lowerFirst(practiceSynthesis)}.`;
    const balanced = composeDecisionAlternatives(pool, correct, distractors, setting, index);
    return {
      scenarioFamily: `${practiceFamilies[index % practiceFamilies.length]}/${domainId.toLowerCase()}`,
      competency: topic.competency,
      objective: topic.objective,
      referenceTopic: `${topic.referenceTopic} — ${referenceLens}`,
      stem: scenarioStem(pool, topic, setting, constraint, index, difficulty),
      correct: balanced.correct,
      distractors: balanced.distractors,
      why: topic.why,
      challenge: `${topic.challenge} Rework the answer if the decision window changes from ${WINDOWS[(index + difficulty) % WINDOWS.length]} to ${WINDOWS[(index + difficulty + 3) % WINDOWS.length]}.`,
    };
  }

  if (pool === "mock-a") {
    const operationalFamilies = [
      "mock-a/field-verification-gate",
      "mock-a/degraded-control-release",
      "mock-a/conflicting-indicator-response",
      "mock-a/simultaneous-operations-priority",
      "mock-a/change-authorization-evidence",
    ] as const;
    const pattern = index % operationalFamilies.length;
    const synthesis = [
      `Verify the selected control against a field release criterion at the ${setting}`,
      `Hold a safe state until the degraded control is restored and tested at the ${setting}`,
      `Reconcile the conflicting indicators at scenario and exposure level before acting at the ${setting}`,
      `Set one decision owner and observable stop-work and restart criteria for the ${setting}`,
      `Use authorized change control to verify compensating protection and post-change performance at the ${setting}`,
    ][pattern];
    const correct = `${adaptLeadingAction(topic.correct, pool)}; ${lowerFirst(synthesis)}.`;
    const distractors: [string, string, string] = [
      `${adaptLeadingAction(topic.distractors[0], pool)}; use it for the current ${referenceLens} decision`,
      `${adaptLeadingAction(topic.distractors[1], pool)}; make the shift supervisor the release-decision owner`,
      `${adaptLeadingAction(topic.distractors[2], pool)}; adopt it as the temporary response at the ${setting}`,
    ];
    const balanced = composeDecisionAlternatives(pool, correct, distractors, setting, index);
    return {
      scenarioFamily: `${operationalFamilies[pattern]}/${domainId.toLowerCase()}`,
      competency: topic.competency,
      objective: `make an operational ${topic.objective} decision from imperfect field evidence`,
      referenceTopic: `${topic.referenceTopic} — ${referenceLens}`,
      stem: scenarioStem(pool, topic, setting, constraint, index, difficulty),
      correct: balanced.correct,
      distractors: balanced.distractors,
      why: `${topic.why} In this operational pattern, the decision must also establish a field release criterion rather than treating a plan or favorable history as proof.`,
      challenge: `Define the minimum field evidence and stop-work threshold for ${topic.hazard}.`,
    };
  }

  const assuranceFamilies = [
    "mock-b/enterprise-assurance-design",
    "mock-b/portfolio-resource-allocation",
    "mock-b/governance-metric-challenge",
    "mock-b/due-diligence-boundary-test",
    "mock-b/risk-acceptance-uncertainty",
  ] as const;
  const pattern = index % assuranceFamilies.length;
  const governanceSynthesis = [
    `Set accountable enterprise expectations and independently test how the ${setting} implements and escalates the control`,
    `Rank risks across ${setting} by consequence, exposure, control weakness, and uncertainty`,
    `Replace the easy aggregate with scenario, exposure, and critical-control measures for the ${setting}`,
    `Extend due diligence across the ${setting} boundary and verify retained control and monitoring`,
    `Present ranges, assumptions, affected groups, and alternatives to the authorized risk owner for the ${setting}`,
  ][pattern];
  const correct = `${adaptLeadingAction(topic.correct, pool)}; ${lowerFirst(governanceSynthesis)}.`;
  const distractors: [string, string, string] = [
    `${adaptLeadingAction(topic.distractors[0], pool)}; apply it across business units using the common ${referenceLens} protocol`,
    `${adaptLeadingAction(topic.distractors[1], pool)}; use it as the enterprise standard for the ${setting}`,
    `${adaptLeadingAction(topic.distractors[2], pool)}; deploy it throughout the portfolio before the next governance review`,
  ];
  const balanced = composeDecisionAlternatives(pool, correct, distractors, setting, index);
  return {
    scenarioFamily: `${assuranceFamilies[pattern]}/${domainId.toLowerCase()}`,
    competency: topic.competency,
    objective: `govern enterprise ${topic.objective} decisions across variable sites`,
    referenceTopic: `${topic.referenceTopic} — ${referenceLens}`,
    stem: scenarioStem(pool, topic, setting, constraint, index, difficulty),
    correct: balanced.correct,
    distractors: balanced.distractors,
    why: `${topic.why} At enterprise level, governance must preserve scenario detail, accountable ownership, resources, assurance, and authorized residual-risk decisions.`,
    challenge: `Design a cross-site assurance sample and escalation threshold for ${topic.hazard}.`,
  };
}

function mockACalculationDraft(domainId: CspDomainId, index: number, setting: string): Draft {
  const site = withIndefiniteArticle(setting);
  if (domainId === "D1") {
    const connector = 4 + (index % 4) + Math.floor(index / 10) * 0.1;
    const deceleration = 2.5 + (index % 4) * 0.5;
    const harness = 1 + (index % 2) * 0.5;
    const margin = 1.5 + (index % 3) * 0.5;
    const total = connector + deceleration + harness + margin;
    return {
      scenarioFamily: "mock-a/quant-fall-clearance-release/d1",
      competency: "Applied safety calculations",
      objective: "calculate fall-arrest clearance for an operational release decision",
      referenceTopic: "Fall clearance — operational authorization",
      stem: `During a work-at-height authorization at ${site}, the stated clearance components are ${connector.toFixed(1)} ft for the connector, ${deceleration.toFixed(1)} ft for deceleration, ${harness.toFixed(1)} ft for harness/D-ring movement, and ${margin.toFixed(1)} ft for a safety margin. What minimum clearance follows from the stated simplified model?`,
      correct: `${total.toFixed(1)} ft`,
      distractors: [
        `${(total - margin).toFixed(1)} ft`,
        `${(total - harness).toFixed(1)} ft`,
        `${(total + margin).toFixed(1)} ft`,
      ],
      why: `Adding every stated component gives ${connector.toFixed(1)} + ${deceleration.toFixed(1)} + ${harness.toFixed(1)} + ${margin.toFixed(1)} = ${total.toFixed(1)} ft. Anchorage geometry, swing, equipment instructions, and worker position still require validation.`,
      challenge: "Identify two dynamic or geometric factors that can invalidate a simple component sum.",
    };
  }
  if (domainId === "D2") {
    const cost = 80000 + (index % 8) * 12500;
    const benefit = 110000 + (index % 9) * 17000;
    const ratio = benefit / cost;
    return {
      scenarioFamily: "mock-a/quant-benefit-cost-gate/d2",
      competency: "Business and financial principles",
      objective: "calculate a benefit-cost ratio without treating it as the sole risk criterion",
      referenceTopic: "Benefit-cost analysis — field investment gate",
      stem: `At ${site}, a proposed control has a first-year lifecycle cost of $${cost.toLocaleString("en-US")} and a quantified first-year benefit of $${benefit.toLocaleString("en-US")}. Using benefit divided by cost, what is the benefit-cost ratio rounded to two decimals?`,
      correct: ratio.toFixed(2),
      distractors: [
        (cost / benefit).toFixed(2),
        ((benefit - cost) / cost).toFixed(2),
        (benefit - cost).toLocaleString("en-US"),
      ],
      why: `$${benefit.toLocaleString("en-US")} / $${cost.toLocaleString("en-US")} = ${ratio.toFixed(2)}. The ratio informs resource choice but does not authorize intolerable residual risk or validate assumptions.`,
      challenge: "Test the decision against lower benefit, higher maintenance cost, and a nonfinancial catastrophic scenario.",
    };
  }
  if (domainId === "D3") {
    const initial = 0.01 + (index % 5) * 0.005;
    const residual = initial / (5 + (index % 6));
    const displayedInitial = Number(initial.toFixed(4));
    const displayedResidual = Number(residual.toFixed(4));
    const factor = displayedInitial / displayedResidual;
    return {
      scenarioFamily: "mock-a/quant-risk-reduction-gate/d3",
      competency: "Risk treatment",
      objective: "calculate a modeled risk-reduction factor",
      referenceTopic: "Risk reduction — operational decision",
      stem: `At ${site}, modeled annual scenario probability falls from ${displayedInitial.toFixed(4)} to ${displayedResidual.toFixed(4)} after a proposed control. What risk-reduction factor is represented by initial probability divided by residual probability?`,
      correct: `${factor.toFixed(1)} times`,
      distractors: [
        `${(displayedInitial - displayedResidual).toFixed(4)} times`,
        `${((1 - displayedResidual / displayedInitial) * 100).toFixed(1)} times`,
        `${(displayedResidual / displayedInitial).toFixed(2)} times`,
      ],
      why: `${displayedInitial.toFixed(4)} / ${displayedResidual.toFixed(4)} = ${factor.toFixed(1)}. The modeled factor remains conditional on control effectiveness, dependencies, and data quality.`,
      challenge: "Explain why a modeled reduction factor is not proof that field risk fell by the same amount.",
    };
  }
  if (domainId === "D4") {
    const roster = 120 + (index % 8) * 17;
    const absent = 5 + (index % 7);
    const accounted = roster - absent - (3 + (index % 9));
    const unresolved = roster - absent - accounted;
    return {
      scenarioFamily: "mock-a/quant-accountability-gap/d4",
      competency: "Evacuation and accountability",
      objective: "calculate unresolved personnel status",
      referenceTopic: "Emergency accountability — operational reconciliation",
      stem: `Following an evacuation at ${site}, the roster lists ${roster} people, ${absent} are independently confirmed off site, and ${accounted} are verified at safe locations. How many people have unresolved status?`,
      correct: `${unresolved} people`,
      distractors: [`${roster - accounted} people, incorrectly retaining confirmed absences`, `${absent + unresolved} people, combining two different statuses`, `${accounted - absent} people, subtracting from the wrong group`],
      why: `Unresolved status is ${roster} - ${absent} confirmed absent - ${accounted} verified safe = ${unresolved}. The result informs command; it does not authorize untrained reentry.`,
      challenge: "Describe how duplicate badge records and visitors should be reconciled before assigning search priorities.",
    };
  }
  if (domainId === "D5") {
    const volume = 600 + (index % 9) * 125;
    const minutes = 12 + (index % 8) * 3;
    const rate = volume / minutes;
    return {
      scenarioFamily: "mock-a/quant-spill-inflow-response/d5",
      competency: "Spill response",
      objective: "calculate average spill inflow for containment decision making",
      referenceTopic: "Release rate — operational response",
      stem: `At ${site}, ${volume} gallons enter containment over ${minutes} minutes before isolation. What is the average inflow rate, rounded to one decimal gallon per minute?`,
      correct: `${rate.toFixed(1)} gal/min`,
      distractors: [
        `${(minutes / volume).toFixed(1)} gal/min`,
        `${(volume * minutes).toFixed(1)} gal/min`,
        `${(volume / (minutes * 2)).toFixed(1)} gal/min`,
      ],
      why: `Average inflow is ${volume} gallons / ${minutes} minutes = ${rate.toFixed(1)} gal/min. Peak rate and continued inflow still matter for response and containment adequacy.`,
      challenge: "Estimate required free volume if isolation could take twice as long and firewater adds a second inflow.",
    };
  }
  if (domainId === "D6") {
    const c1 = 12 + (index % 9) * 3;
    const l1 = 30 + (index % 4) * 10;
    const c2 = 8 + (index % 7) * 2;
    const l2 = 20 + (index % 5) * 10;
    const additive = c1 / l1 + c2 / l2;
    return {
      scenarioFamily: "mock-a/quant-additive-exposure-gate/d6",
      competency: "Exposure assessment",
      objective: "calculate an additive mixture index",
      referenceTopic: "Additive exposure — operational interpretation",
      stem: `At ${site}, two agents with the same stated additive health endpoint are measured at ${c1} and ${c2} ppm; their matching limits are ${l1} and ${l2} ppm. Using C1/L1 + C2/L2, what is the additive index?`,
      correct: additive.toFixed(2),
      distractors: [
        ((c1 + c2) / (l1 + l2)).toFixed(2),
        (c1 / l1).toFixed(2),
        (c2 / l2).toFixed(2),
      ],
      why: `${c1}/${l1} + ${c2}/${l2} = ${additive.toFixed(2)}. Applicability depends on compatible health endpoints, limits, and sampling periods.`,
      challenge: "State two conditions that would make this simple additive model inappropriate.",
    };
  }
  const eligible = 40 + (index % 9) * 7;
  const observed = 20 + (index % Math.max(10, eligible - 20));
  const successful = Math.max(1, observed - (4 + (index % 8)));
  const rate = (successful / observed) * 100;
  return {
    scenarioFamily: "mock-a/quant-training-transfer-sample/d7",
    competency: "Training evaluation",
    objective: "calculate observed transfer while keeping coverage visible",
    referenceTopic: "Transfer rate — field sample",
    stem: `At ${site}, ${eligible} trained workers were eligible for observation; ${observed} were sampled and ${successful} met every critical field criterion. What was the success rate among those observed?`,
    correct: `${rate.toFixed(1)}%`,
    distractors: [
      `${((successful / eligible) * 100).toFixed(1)}%`,
      `${((observed / eligible) * 100).toFixed(1)}%`,
      `${(((observed - successful) / observed) * 100).toFixed(1)}%`,
    ],
    why: `${successful}/${observed} x 100 = ${rate.toFixed(1)}% among observed workers. The ${observed}/${eligible} sampling coverage and selection method determine generalizability.`,
    challenge: "Explain how convenience selection could inflate the observed success rate even when the arithmetic is correct.",
  };
}

function mockBCalculationDraft(domainId: CspDomainId, index: number, setting: string): Draft {
  const site = withIndefiniteArticle(setting);
  if (domainId === "D1") {
    const r1 = 0.9 + (index % 100) / 1000;
    const r2 = 0.88 + ((index * 3) % 100) / 1000;
    const displayedR1 = Number(r1.toFixed(2));
    const displayedR2 = Number(r2.toFixed(2));
    const series = displayedR1 * displayedR2;
    return {
      scenarioFamily: "mock-b/quant-series-reliability-assurance/d1",
      competency: "Control-system reliability",
      objective: "calculate series reliability for two required functions",
      referenceTopic: "Reliability — enterprise assurance",
      stem: `An assurance model for ${site} requires two independent functions to succeed in series, with stated reliabilities ${displayedR1.toFixed(2)} and ${displayedR2.toFixed(2)} per demand. Under those assumptions, what is combined success probability?`,
      correct: series.toFixed(4),
      distractors: [
        (displayedR1 + displayedR2).toFixed(4),
        (1 - (1 - displayedR1) * (1 - displayedR2)).toFixed(4),
        ((displayedR1 + displayedR2) / 2).toFixed(4),
      ],
      why: `For two required independent functions, combined success is ${displayedR1.toFixed(2)} x ${displayedR2.toFixed(2)} = ${series.toFixed(4)}. Independence and demand data require separate assurance.`,
      challenge: "Explain how a shared sensor or power supply changes the architecture assumption.",
    };
  }
  if (domainId === "D2") {
    const annual = 70000 + (index % 9) * 15000;
    const years = 3 + (index % 4);
    const capital = 150000 + (index % 7) * 20000;
    const net = annual * years - capital;
    return {
      scenarioFamily: "mock-b/quant-lifecycle-net-value/d2",
      competency: "Business and financial principles",
      objective: "calculate an undiscounted lifecycle net value and state its limits",
      referenceTopic: "Lifecycle value — portfolio governance",
      stem: `For ${site}, a control is expected to produce $${annual.toLocaleString("en-US")} in annual quantified benefit for ${years} years against $${capital.toLocaleString("en-US")} initial capital cost. Ignoring discounting and recurring cost, what is the simple net value?`,
      correct: `$${net.toLocaleString("en-US")}`,
      distractors: [
        `$${(annual * years).toLocaleString("en-US")}`,
        `$${(capital - annual).toLocaleString("en-US")} using one-year cost difference`,
        `$${Math.round(capital / years).toLocaleString("en-US")}`,
      ],
      why: `${years} x $${annual.toLocaleString("en-US")} - $${capital.toLocaleString("en-US")} = $${net.toLocaleString("en-US")}. Governance still needs timing, uncertainty, maintenance, residual risk, and nonfinancial consequences.`,
      challenge: "Identify assumptions that a discounted cash-flow and risk sensitivity analysis should test.",
    };
  }
  if (domainId === "D3") {
    const probability = 0.002 + (index % 8) * 0.001;
    const consequence = 500000 + (index % 9) * 250000;
    const expected = probability * consequence;
    return {
      scenarioFamily: "mock-b/quant-expected-loss-portfolio/d3",
      competency: "Quantitative risk analysis",
      objective: "calculate expected annual loss without hiding tail consequence",
      referenceTopic: "Expected value — portfolio risk",
      stem: `A scenario at ${site} has modeled annual probability ${probability.toFixed(3)} and financial consequence $${consequence.toLocaleString("en-US")} per event. What is the expected annual financial loss?`,
      correct: `$${expected.toLocaleString("en-US")}`,
      distractors: [
        `$${(consequence / probability).toLocaleString("en-US")}`,
        `$${(probability * 100).toFixed(1)}`,
        `$${(consequence * (1 - probability)).toLocaleString("en-US")}`,
      ],
      why: `${probability.toFixed(3)} x $${consequence.toLocaleString("en-US")} = $${expected.toLocaleString("en-US")} per year. Expected value must not conceal catastrophic severity or distribution.`,
      challenge: "Explain why two scenarios with equal expected loss can justify different controls and acceptance authority.",
    };
  }
  if (domainId === "D4") {
    const target = 4 + (index % 6);
    const technology = 6 + (index % 9);
    const utility = 3 + ((index * 2) % 8);
    const critical = Math.max(technology, utility);
    const gap = critical - target;
    return {
      scenarioFamily: "mock-b/quant-recovery-dependency-gap/d4",
      competency: "Business continuity",
      objective: "compare a process recovery target with its slowest required dependency",
      referenceTopic: "Recovery dependencies — enterprise assurance",
      stem: `At ${site}, leaders set a ${target}-hour recovery target for a service that cannot restart before technology recovers in ${technology} hours and its required utility in ${utility} hours. Assuming parallel recovery, what minimum dependency time governs and what is the gap to target?`,
      correct: `${critical} hours, ${Math.abs(gap)} hours ${gap > 0 ? "later than" : gap < 0 ? "earlier than" : "equal to"} target`,
      distractors: [
        `${technology + utility} hours, the dependency times must always be added`,
        `${Math.min(technology, utility)} hours, the faster dependency governs`,
        `${target} hours, an approved target overrides dependency capability`,
      ],
      why: `With parallel recovery and both resources required, restart waits for the slower dependency: max(${technology}, ${utility}) = ${critical} hours, compared with the ${target}-hour target.`,
      challenge: "Rework the dependency model if utility recovery must finish before technology recovery can begin.",
    };
  }
  if (domainId === "D5") {
    const oldMass = 1000 + (index % 8) * 150;
    const oldOutput = 100 + (index % 6) * 20;
    const newMass = oldMass - (100 + (index % 5) * 40);
    const newOutput = oldOutput + (20 + (index % 4) * 10);
    const oldIntensity = oldMass / oldOutput;
    const newIntensity = newMass / newOutput;
    const change = ((newIntensity - oldIntensity) / oldIntensity) * 100;
    return {
      scenarioFamily: "mock-b/quant-environmental-intensity/d5",
      competency: "Environmental performance",
      objective: "calculate normalized environmental-intensity change",
      referenceTopic: "Environmental intensity — enterprise reporting",
      stem: `At ${site}, performance changes from ${oldMass} kg impact at ${oldOutput} production units to ${newMass} kg at ${newOutput} units. What is the percentage change in impact intensity, using kg per production unit?`,
      correct: `${Math.abs(change).toFixed(1)}% ${change < 0 ? "decrease" : "increase"}`,
      distractors: [
        `${Math.abs(((newMass - oldMass) / oldMass) * 100).toFixed(1)}% based only on mass`,
        `${Math.abs(((newOutput - oldOutput) / oldOutput) * 100).toFixed(1)}% based only on output`,
        `${Math.abs(newIntensity - oldIntensity).toFixed(1)}% using an unscaled intensity difference`,
      ],
      why: `Intensity changes from ${oldIntensity.toFixed(2)} to ${newIntensity.toFixed(2)} kg/unit; (${newIntensity.toFixed(2)} - ${oldIntensity.toFixed(2)})/${oldIntensity.toFixed(2)} x 100 = ${change.toFixed(1)}%.`,
      challenge: "State when an intensity improvement can coexist with a worse absolute environmental impact.",
    };
  }
  if (domainId === "D6") {
    const level = 82 + (index % 10);
    const sources = [2, 4, 8][index % 3];
    const combined = level + 10 * Math.log10(sources);
    return {
      scenarioFamily: "mock-b/quant-equal-source-noise/d6",
      competency: "Noise exposure",
      objective: "combine equal independent sound levels logarithmically",
      referenceTopic: "Sound-level addition — enterprise model",
      stem: `At ${site}, an analyst models ${sources} independent equal sources, each producing ${level} dB at a receiver. Using Ltotal = Lsingle + 10 log10(N), what combined level is expected to the nearest 0.1 dB?`,
      correct: `${combined.toFixed(1)} dB`,
      distractors: [
        `${(level * sources).toFixed(1)} dB`,
        `${(level + sources).toFixed(1)} dB`,
        `${(level + 3).toFixed(1)} dB using a one-doubling shortcut regardless of source count`,
      ],
      why: `${level} + 10 log10(${sources}) = ${combined.toFixed(1)} dB. Decibels represent a logarithmic energy relationship and are not arithmetically added.`,
      challenge: "Explain why the three-decibel shortcut works only for each doubling of equal independent sources.",
    };
  }
  const total = 30 + (index % 9) * 5;
  const agreements = total - (3 + (index % 8));
  const agreement = (agreements / total) * 100;
  return {
    scenarioFamily: "mock-b/quant-rater-agreement-assurance/d7",
    competency: "Assessment reliability",
    objective: "calculate raw inter-rater agreement and recognize its limits",
    referenceTopic: "Assessment reliability — enterprise assurance",
    stem: `Two assessors evaluating the same ${total} training performances agree on pass/fail classification in ${agreements} cases. What is raw agreement?`,
    correct: `${agreement.toFixed(1)}%`,
    distractors: [
      `${(((total - agreements) / total) * 100).toFixed(1)}%`,
      `${((agreements / (total * 2)) * 100).toFixed(1)}%`,
      `${agreements.toFixed(1)}%`,
    ],
    why: `${agreements}/${total} x 100 = ${agreement.toFixed(1)}%. Raw agreement does not adjust for chance or reveal which rubric criteria caused disagreement.`,
    challenge: "Describe how prevalence and chance agreement can make raw agreement look stronger than assessment consistency really is.",
  };
}

function calculationDraft(
  pool: QuestionPool,
  domainId: CspDomainId,
  index: number,
): Draft {
  const setting = SETTINGS[pool][(index * 5 + Number(domainId[1])) % SETTINGS[pool].length];
  const site = withIndefiniteArticle(setting);
  const family = pool === "practice" ? "screening exercise" : pool === "mock-a" ? "operational decision" : "assurance challenge";

  if (pool === "mock-a") {
    return mockACalculationDraft(domainId, index, setting);
  }
  if (pool === "mock-b") {
    return mockBCalculationDraft(domainId, index, setting);
  }

  if (domainId === "D1") {
    const angles = [30, 45, 60] as const;
    const angle = angles[index % angles.length];
    const load = 2400 + index * 137;
    const tension = Math.round(load / (2 * Math.sin((angle * Math.PI) / 180)));
    return {
      scenarioFamily: "practice/quant-sling-mechanics/d1",
      competency: "Applied safety calculations",
      objective: "calculate two-leg sling tension and recognize model limits",
      referenceTopic: "Sling-angle mechanics",
      stem: `For a ${family} at ${site}, a symmetrical two-leg sling supports ${load.toLocaleString("en-US")} lb, and each leg is ${angle} degrees above horizontal. Ignoring dynamics and sling weight, what is the approximate tension in each leg using T = W/[2 sin(theta)]?`,
      correct: `${tension.toLocaleString("en-US")} lb per leg`,
      distractors: [
        `${Math.round(load / 2).toLocaleString("en-US")} lb per leg`,
        `${Math.round(load / Math.sin((angle * Math.PI) / 180)).toLocaleString("en-US")} lb per leg`,
        `${Math.round(load * Math.sin((angle * Math.PI) / 180)).toLocaleString("en-US")} lb per leg`,
      ],
      why: `The stated relationship gives ${load}/[2 sin(${angle} degrees)] = approximately ${tension} lb per leg; field approval still requires capacity, geometry, dynamics, hardware, and load-control checks.`,
      challenge: "Recalculate at the next lower sling angle and explain why flatter legs increase tension.",
    };
  }

  if (domainId === "D2") {
    const events = 2 + (index % 7);
    const hours = 240000 + index * 37000;
    const rate = (events * 200000) / hours;
    return {
      scenarioFamily: "practice/quant-incident-rate/d2",
      competency: "Performance measurement",
      objective: "calculate and interpret an exposure-normalized incident rate",
      referenceTopic: "Rates, denominators, and trend interpretation",
      stem: `In a ${family} at ${site}, the record contains ${events} qualifying cases over ${hours.toLocaleString("en-US")} work hours. Using rate = cases x 200,000 / hours, what is the rate rounded to two decimals?`,
      correct: rate.toFixed(2),
      distractors: [
        ((events * 100000) / hours).toFixed(2),
        ((events * 200000) / (hours / 2)).toFixed(2),
        (events / (hours / 1000)).toFixed(2),
      ],
      why: `${events} x 200,000 / ${hours} = ${rate.toFixed(2)}. The standardized rate supports exposure comparison but does not by itself establish causal performance or future risk.`,
      challenge: "State how contractor hours, case classification, and small-number variation could distort comparison.",
    };
  }

  if (domainId === "D3") {
    const initiating = 0.005 + index * 0.0001;
    const p1 = [0.05, 0.08, 0.1, 0.12][(index * 3) % 4];
    const p2 = [0.02, 0.04, 0.06, 0.08][(index * 5) % 4];
    const path = initiating * p1 * p2;
    return {
      scenarioFamily: "practice/quant-event-path-probability/d3",
      competency: "Quantitative risk analysis",
      objective: "calculate an event-path probability under an explicit independence assumption",
      referenceTopic: "Conditional probability and barrier dependence",
      stem: `For a ${family} at ${site}, an initiating event has annual probability ${initiating.toFixed(4)}. Harm occurs only if two stated-independent barriers fail on demand with probabilities ${p1.toFixed(2)} and ${p2.toFixed(2)}. Under that assumption, what is the annual path probability?`,
      correct: path.toFixed(6),
      distractors: [
        (p1 * p2).toFixed(6),
        (initiating * (p1 + p2)).toFixed(6),
        (initiating + p1 + p2).toFixed(6),
      ],
      why: `The AND path is ${initiating.toFixed(4)} x ${p1.toFixed(2)} x ${p2.toFixed(2)} = ${path.toFixed(6)} per year, conditional on valid data and genuine independence.`,
      challenge: "Add one common-cause dependency and explain why simple multiplication would then understate risk.",
    };
  }

  if (domainId === "D4") {
    const inventory = 900 + index * 173;
    const demand = 55 + ((index * 19) % 90);
    const hours = inventory / demand;
    const target = 8 + (index % 9);
    const gap = hours - target;
    const halfHours = inventory / (demand * 2);
    const halfGap = halfHours - target;
    return {
      scenarioFamily: "practice/quant-resource-endurance/d4",
      competency: "Emergency resource planning",
      objective: "calculate resource endurance and compare it with a planning target",
      referenceTopic: "Emergency resource endurance",
      stem: `For a ${family} at ${site}, a critical emergency resource has ${inventory.toLocaleString("en-US")} usable units and is consumed at ${demand} units per hour. The planning target is ${target} hours. Ignoring resupply, what is the approximate endurance and planning margin?`,
      correct: `${hours.toFixed(1)} hours, with ${Math.abs(gap).toFixed(1)} hours of ${gap >= 0 ? "surplus" : "deficit"}`,
      distractors: [
        `${(demand / inventory).toFixed(1)} hours, a ${target.toFixed(1)}-hour deficit`,
        `${halfHours.toFixed(1)} hours, with ${Math.abs(halfGap).toFixed(1)} hours of ${halfGap >= 0 ? "surplus" : "deficit"}`,
        `${(inventory + demand).toFixed(1)} hours, an unsupported surplus`,
      ],
      why: `Endurance is inventory divided by consumption: ${inventory}/${demand} = ${hours.toFixed(1)} hours; comparison with ${target} hours gives the stated ${Math.abs(gap).toFixed(1)}-hour ${gap >= 0 ? "surplus" : "deficit"}.`,
      challenge: "Recalculate with a twenty-percent unusable reserve and a consumption rate that rises fifteen percent under peak response.",
    };
  }

  if (domainId === "D5") {
    const length = 12 + index;
    const width = 8 + ((index * 3) % 9);
    const depth = [0.5, 0.75, 1][index % 3];
    const displacement = 10 + ((index * 7) % 31);
    const gallons = (length * width * depth - displacement) * 7.48;
    return {
      scenarioFamily: "practice/quant-containment-capacity/d5",
      competency: "Environmental release control",
      objective: "calculate usable containment volume after displacement",
      referenceTopic: "Containment geometry and capacity",
      stem: `For a ${family} at ${site}, a rectangular containment area is ${length} ft by ${width} ft with ${depth.toFixed(2)} ft usable depth. Equipment displaces ${displacement} ft3. Using 7.48 gal/ft3 and ignoring rainfall and freeboard, what is the remaining liquid capacity?`,
      correct: `${Math.round(gallons).toLocaleString("en-US")} gal`,
      distractors: [
        `${Math.round(length * width * depth).toLocaleString("en-US")} gal`,
        `${Math.round((length * width * depth) * 7.48).toLocaleString("en-US")} gal`,
        `${Math.round(displacement * 7.48).toLocaleString("en-US")} gal`,
      ],
      why: `Geometric volume is ${length} x ${width} x ${depth.toFixed(2)} ft3; subtracting ${displacement} ft3 and multiplying by 7.48 gives approximately ${Math.round(gallons)} gal.`,
      challenge: "Add rainfall, largest credible inflow, firewater, and freeboard to determine whether nominal capacity is adequate.",
    };
  }

  if (domainId === "D6") {
    const c1 = 20 + index;
    const c2 = 5 + ((index * 11) % 36);
    const t1 = 2 + (index % 3);
    const t2 = 2 + ((index * 2) % (7 - t1));
    const twa = (c1 * t1 + c2 * t2) / 8;
    return {
      scenarioFamily: "practice/quant-time-weighted-exposure/d6",
      competency: "Exposure calculations",
      objective: "calculate an eight-hour time-weighted average",
      referenceTopic: "Time-weighted exposure",
      stem: `For a ${family} at ${site}, exposure is ${c1} ppm for ${t1} hours, ${c2} ppm for ${t2} hours, and zero for the remainder of an eight-hour averaging period. What is the eight-hour TWA?`,
      correct: `${twa.toFixed(1)} ppm`,
      distractors: [
        `${((c1 + c2) / 2).toFixed(1)} ppm`,
        `${((c1 * t1 + c2 * t2) / (t1 + t2)).toFixed(1)} ppm`,
        `${(c1 * t1 + c2 * t2).toFixed(1)} ppm`,
      ],
      why: `The concentration-time sum is (${c1} x ${t1}) + (${c2} x ${t2}); dividing by the full eight-hour period gives ${twa.toFixed(1)} ppm.`,
      challenge: "Explain why dividing only by hours with nonzero exposure answers a different question.",
    };
  }

  const correct = 14 + ((index * 9) % 51);
  const baseline = 45 + ((index * 7) % 31);
  const followup = baseline + correct;
  return {
    scenarioFamily: "practice/quant-percentage-point-change/d7",
    competency: "Training evaluation",
    objective: "calculate percentage-point change and avoid a relative-change error",
    referenceTopic: "Learning metrics and denominators",
    stem: `For a ${family} at ${site}, representative correct performance rises from ${baseline}% at baseline to ${followup}% at follow-up. What is the percentage-point improvement?`,
    correct: `${correct} percentage points`,
    distractors: [
      `${((correct / baseline) * 100).toFixed(1)} percentage points`,
      `${followup} percentage points`,
      `${Math.abs(100 - followup)} percentage points`,
    ],
    why: `Percentage-point change is ${followup}% minus ${baseline}% = ${correct} points; relative percentage improvement would use a different denominator and label.`,
    challenge: "Calculate the relative percentage improvement and explain which measure is clearer for governance reporting.",
  };
}

function buildQuestion(
  pool: QuestionPool,
  domainId: CspDomainId,
  domainIndex: number,
  globalIndex: number,
): PooledCSPQuestion {
  const difficulty = ((domainIndex + Number(domainId[1]) + (pool === "mock-b" ? 2 : pool === "mock-a" ? 1 : 0)) % 5 + 1) as QuestionDifficulty;
  const useCalculation = domainIndex % 9 === 8;
  const baseDraft = useCalculation
    ? calculationDraft(pool, domainId, domainIndex + (pool === "mock-a" ? 101 : pool === "mock-b" ? 211 : 0))
    : conceptualDraft(pool, domainId, domainIndex, difficulty);
  const calculationLenses: Readonly<Record<QuestionPool, readonly string[]>> = {
    practice: ["input-validation", "unit-check", "sensitivity-test", "feasibility-screen"],
    "mock-a": ["release-threshold", "conservative-margin", "field-verification"],
    "mock-b": ["portfolio-comparability", "uncertainty-bound", "assurance-sampling"],
  };
  const calculationLens = calculationLenses[pool][Math.floor(domainIndex / 9) % calculationLenses[pool].length];
  const calculationInstruction: Readonly<Record<string, string>> = {
    "input-validation": "Use the result as an input-validation check before selecting a control.",
    "unit-check": "Use dimensional consistency to test whether the proposed result is plausible.",
    "sensitivity-test": "Identify the variable whose uncertainty most changes the safety decision.",
    "feasibility-screen": "Compare the computed value with the physical feasibility of the proposed control.",
    "release-threshold": "Use the value to set an observable go/no-go threshold for this work authorization.",
    "conservative-margin": "Decide whether a conservative margin is needed before the field release.",
    "field-verification": "Specify the field measurement that must corroborate the calculation before work continues.",
    "portfolio-comparability": "State the common denominator needed before comparing the value across business units.",
    "uncertainty-bound": "Show how a material uncertainty range could change the governance decision.",
    "assurance-sampling": "Identify the independent sample needed to test whether the modeled value represents operations.",
  };
  const draft = useCalculation
    ? {
        ...baseDraft,
        scenarioFamily: `${baseDraft.scenarioFamily}/${calculationLens}`,
        referenceTopic: `${baseDraft.referenceTopic} — ${calculationLens}`,
        stem: `${baseDraft.stem} ${calculationInstruction[calculationLens]}`,
      }
    : baseDraft;
  const { options, correctIndex, wrongRationales } = rotateChoices(
    draft.correct,
    draft.distractors,
    globalIndex + difficulty + Number(domainId[1]) + (pool === "mock-a" ? 1 : pool === "mock-b" ? 3 : 0),
  );
  const prefix = pool === "practice" ? "CSP-P" : pool === "mock-a" ? "CSP-MA" : "CSP-MB";
  const sequence = String(globalIndex + 1).padStart(4, "0");

  return {
    id: `${prefix}-${domainId}-${sequence}`,
    pool,
    scenarioFamily: draft.scenarioFamily,
    domainId,
    competency: draft.competency,
    objective: draft.objective,
    difficulty,
    stem: draft.stem,
    options,
    correctIndex,
    rationale: draft.why,
    wrongRationales,
    referenceFramework: frameworks[(globalIndex + difficulty) % frameworks.length],
    referenceTopic: draft.referenceTopic,
    challengePrompt: draft.challenge,
  };
}

function buildPool(pool: QuestionPool, counts: Counts): PooledCSPQuestion[] {
  const questions: PooledCSPQuestion[] = [];
  for (const domainId of DOMAIN_ORDER) {
    for (let domainIndex = 0; domainIndex < counts[domainId]; domainIndex += 1) {
      questions.push(buildQuestion(pool, domainId, domainIndex, questions.length));
    }
  }
  return questions;
}

function validatePool(pool: QuestionPool, questions: readonly PooledCSPQuestion[], counts: Counts): void {
  const expectedTotal = DOMAIN_ORDER.reduce((sum, domainId) => sum + counts[domainId], 0);
  if (questions.length !== expectedTotal) {
    throw new Error(`${pool}: expected ${expectedTotal} questions; received ${questions.length}`);
  }
  const ids = new Set<string>();
  const stems = new Set<string>();
  const prefix = pool === "practice" ? "CSP-P-" : pool === "mock-a" ? "CSP-MA-" : "CSP-MB-";

  for (const domainId of DOMAIN_ORDER) {
    const actual = questions.filter((question) => question.domainId === domainId).length;
    if (actual !== counts[domainId]) {
      throw new Error(`${pool}/${domainId}: expected ${counts[domainId]}; received ${actual}`);
    }
  }

  for (const question of questions) {
    if (!question.id.startsWith(prefix) || ids.has(question.id)) {
      throw new Error(`${pool}: invalid or duplicate id ${question.id}`);
    }
    ids.add(question.id);
    const normalizedStem = question.stem.trim().toLowerCase();
    if (stems.has(normalizedStem)) {
      throw new Error(`${pool}: duplicate stem ${question.id}`);
    }
    stems.add(normalizedStem);
    if (question.options.length !== 4 || new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) {
      throw new Error(`${question.id}: options must be four unique values`);
    }
    if (question.wrongRationales.length !== 4 || !question.wrongRationales[question.correctIndex].startsWith("Correct.")) {
      throw new Error(`${question.id}: rationales are not aligned with the keyed option`);
    }
    if (question.difficulty < 1 || question.difficulty > 5) {
      throw new Error(`${question.id}: invalid difficulty`);
    }
    if (!question.scenarioFamily.startsWith(`${pool}/`)) {
      throw new Error(`${question.id}: scenario family is not isolated to ${pool}`);
    }
    if (!question.competency || !question.objective || !question.rationale || !question.referenceTopic || !question.challengePrompt) {
      throw new Error(`${question.id}: incomplete metadata`);
    }
  }
}

export const CSP_PRACTICE_EXTRA = buildPool("practice", PRACTICE_COUNTS);
export const CSP_MOCK_A = buildPool("mock-a", MOCK_COUNTS);
export const CSP_MOCK_B = buildPool("mock-b", MOCK_COUNTS);

validatePool("practice", CSP_PRACTICE_EXTRA, PRACTICE_COUNTS);
validatePool("mock-a", CSP_MOCK_A, MOCK_COUNTS);
validatePool("mock-b", CSP_MOCK_B, MOCK_COUNTS);

const allExpandedQuestions = [...CSP_PRACTICE_EXTRA, ...CSP_MOCK_A, ...CSP_MOCK_B];
if (new Set(allExpandedQuestions.map((question) => question.id)).size !== allExpandedQuestions.length) {
  throw new Error("Expanded CSP pools contain duplicate ids");
}
if (new Set(allExpandedQuestions.map((question) => question.stem.trim().toLowerCase())).size !== allExpandedQuestions.length) {
  throw new Error("Expanded CSP pools contain duplicate stems");
}
const familyOwners = new Map<string, QuestionPool>();
for (const question of allExpandedQuestions) {
  const existingOwner = familyOwners.get(question.scenarioFamily);
  if (existingOwner && existingOwner !== question.pool) {
    throw new Error(`Scenario family ${question.scenarioFamily} is shared by ${existingOwner} and ${question.pool}`);
  }
  familyOwners.set(question.scenarioFamily, question.pool);
}
