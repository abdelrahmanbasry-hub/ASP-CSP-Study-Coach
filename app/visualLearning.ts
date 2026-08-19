export type VisualKind =
  | "ladder"
  | "scaffold"
  | "crane"
  | "excavation"
  | "electrical"
  | "machinery"
  | "exposure"
  | "biological"
  | "fire"
  | "ergonomics"
  | "traffic"
  | "decision";

export type VisualAnnotation = {
  number: number;
  label: string;
  detail: string;
  x: number;
  y: number;
};

export type QuestionVisual = {
  kind: VisualKind;
  title: string;
  prompt: string;
  caption: string;
  annotations: readonly VisualAnnotation[];
};

export type BodySystemId =
  | "brain"
  | "lungs"
  | "heart"
  | "liver"
  | "kidneys"
  | "digestive"
  | "skin"
  | "blood"
  | "systemic";

export type BodySystem = {
  id: BodySystemId;
  label: string;
  color: string;
  x: number;
  y: number;
};

export const BODY_SYSTEMS: readonly BodySystem[] = [
  { id: "brain", label: "Brain & nervous system", color: "#8857a6", x: 50, y: 18 },
  { id: "lungs", label: "Lungs & airways", color: "#438aa3", x: 40, y: 35 },
  { id: "heart", label: "Heart & circulation", color: "#d8655d", x: 60, y: 40 },
  { id: "liver", label: "Liver", color: "#b9863a", x: 60, y: 51 },
  { id: "kidneys", label: "Kidneys", color: "#4e789b", x: 42, y: 58 },
  { id: "digestive", label: "Digestive system", color: "#d17c56", x: 57, y: 63 },
  { id: "blood", label: "Blood & lymphatic system", color: "#b74e64", x: 50, y: 46 },
  { id: "skin", label: "Skin & mucosa", color: "#ce7f75", x: 26, y: 46 },
  { id: "systemic", label: "Whole-body / systemic", color: "#6a947b", x: 72, y: 72 },
] as const;

const VISUALS: Record<VisualKind, QuestionVisual> = {
  ladder: {
    kind: "ladder",
    title: "Working at height",
    prompt: "Before choosing, scan the setup from the ground upward. What could make access or landing unsafe?",
    caption: "Conceptual access diagram — inspect the base, climbing path, landing, and nearby hazards before deciding.",
    annotations: [
      { number: 1, label: "Base and footing", detail: "Start with ground condition, stability, and clearance at the feet.", x: 25, y: 78 },
      { number: 2, label: "Climbing path", detail: "Look for a clear, protected route with controlled hand and foot placement.", x: 47, y: 49 },
      { number: 3, label: "Landing / transition", detail: "Check the transition point and whether a worker can step on or off safely.", x: 70, y: 24 },
      { number: 4, label: "Overhead / side hazards", detail: "Scan surrounding space; access is not safe in isolation from the work area.", x: 82, y: 44 },
    ],
  },
  scaffold: {
    kind: "scaffold",
    title: "Scaffold observation",
    prompt: "Pause on the structure. Which parts control falls, access, and stability?",
    caption: "Conceptual scaffold diagram — use it to organize observation, then apply the specific site and regulatory requirements.",
    annotations: [
      { number: 1, label: "Edge protection", detail: "Observe guardrail coverage at open sides and ends.", x: 67, y: 26 },
      { number: 2, label: "Platform condition", detail: "Check the work surface, openings, and whether materials create a trip or overload concern.", x: 53, y: 50 },
      { number: 3, label: "Access route", detail: "Separate safe access from climbing the scaffold frame.", x: 28, y: 62 },
      { number: 4, label: "Base and ties", detail: "Stability depends on the whole support system, not only the visible platform.", x: 72, y: 82 },
    ],
  },
  crane: {
    kind: "crane",
    title: "Lift-zone observation",
    prompt: "Trace the load path. Who or what could enter it, and what must be controlled before movement?",
    caption: "Conceptual lifting diagram — assess the load path, rigging, communication, and exclusion area for the actual lift plan.",
    annotations: [
      { number: 1, label: "Boom and clearance", detail: "Observe clearance and the planned movement path before the lift starts.", x: 44, y: 25 },
      { number: 2, label: "Rigging connection", detail: "The connection is a critical visual check point; verify the approved rigging plan.", x: 57, y: 52 },
      { number: 3, label: "Suspended load", detail: "A moving or suspended load creates a dynamic struck-by and crush exposure.", x: 57, y: 72 },
      { number: 4, label: "Exclusion zone", detail: "Keep people out of the load path rather than relying on last-second avoidance.", x: 82, y: 78 },
    ],
  },
  excavation: {
    kind: "excavation",
    title: "Excavation observation",
    prompt: "Read the edge before the trench: what adds load, what protects the worker, and how is entry controlled?",
    caption: "Conceptual excavation diagram — assess soil, protective systems, spoil placement, equipment, and access with a competent person.",
    annotations: [
      { number: 1, label: "Edge loading", detail: "Spoil, materials, and equipment at the edge can add collapse and struck-by risk.", x: 24, y: 42 },
      { number: 2, label: "Protective system", detail: "Observe the protective approach and whether it matches the actual conditions.", x: 49, y: 67 },
      { number: 3, label: "Safe entry / exit", detail: "Identify how a worker gets in and out without creating a new fall exposure.", x: 71, y: 56 },
      { number: 4, label: "Surface hazards", detail: "Scan for mobile equipment, water, and changing conditions around the excavation.", x: 83, y: 37 },
    ],
  },
  electrical: {
    kind: "electrical",
    title: "Electrical energy boundary",
    prompt: "Find the source, the exposed energy, and the control that keeps people outside the hazard area.",
    caption: "Conceptual electrical diagram — identify energy isolation, boundaries, and verified controls for the actual task.",
    annotations: [
      { number: 1, label: "Energy source", detail: "Start at the equipment or source that can release hazardous electrical energy.", x: 35, y: 44 },
      { number: 2, label: "Exposure boundary", detail: "Notice the controlled space around energized or potentially energized parts.", x: 58, y: 42 },
      { number: 3, label: "Worker position", detail: "Body position and approach route can change the exposure.", x: 70, y: 68 },
      { number: 4, label: "Control point", detail: "Look for the verified control — not merely a label or assumption.", x: 24, y: 76 },
    ],
  },
  machinery: {
    kind: "machinery",
    title: "Machine-guarding scan",
    prompt: "Locate the motion, the point of operation, and the boundary that keeps hands and clothing clear.",
    caption: "Conceptual machinery diagram — map moving parts, stored energy, guarding, and the task sequence before acting.",
    annotations: [
      { number: 1, label: "Point of operation", detail: "Identify where the work and the machine motion meet.", x: 53, y: 46 },
      { number: 2, label: "In-running nip / pinch area", detail: "Look for places where rotating or moving parts draw material in.", x: 70, y: 63 },
      { number: 3, label: "Guard / separation", detail: "The important question is whether the guard prevents access during normal operation.", x: 33, y: 36 },
      { number: 4, label: "Energy-control step", detail: "For servicing, look beyond a stop button to the energy-control procedure.", x: 24, y: 79 },
    ],
  },
  exposure: {
    kind: "exposure",
    title: "Chemical exposure pathways",
    prompt: "Trace the material from source to person. Which route changes the control decision?",
    caption: "Conceptual exposure diagram — use the task, material, route, and source controls to structure the assessment.",
    annotations: [
      { number: 1, label: "Source", detail: "Find where the material is generated, released, or disturbed.", x: 27, y: 60 },
      { number: 2, label: "Air / breathing zone", detail: "Airborne material can move through the worker’s breathing zone before dilution helps.", x: 55, y: 36 },
      { number: 3, label: "Skin / surface route", detail: "Skin contact and contaminated surfaces may require controls beyond air sampling.", x: 66, y: 65 },
      { number: 4, label: "Control at source", detail: "First look for substitution, isolation, or capture before relying on individual protection.", x: 38, y: 26 },
    ],
  },
  biological: {
    kind: "biological",
    title: "Biological exposure pathway",
    prompt: "What is the agent, how can it reach the person, and where can the chain be broken?",
    caption: "Conceptual biological-exposure diagram — connect the source, route of entry, work practice, and containment measure.",
    annotations: [
      { number: 1, label: "Source / reservoir", detail: "Start with the material, person, animal, surface, or process that carries the agent.", x: 25, y: 56 },
      { number: 2, label: "Route of entry", detail: "Inhalation, mucous-membrane, skin, sharps, and ingestion routes have different controls.", x: 58, y: 38 },
      { number: 3, label: "Barrier or containment", detail: "Observe the engineered or work-practice step that breaks transmission.", x: 44, y: 25 },
      { number: 4, label: "Decontamination step", detail: "A safe process includes what happens before leaving the exposure area.", x: 77, y: 74 },
    ],
  },
  fire: {
    kind: "fire",
    title: "Fire and energy release",
    prompt: "Identify what can fuel the event, what can ignite it, and how people are kept out of the path of harm.",
    caption: "Conceptual fire-energy diagram — use the actual material, process, and emergency plan to determine controls.",
    annotations: [
      { number: 1, label: "Fuel / material", detail: "Know the material and its condition before assuming the risk is the same in every task.", x: 32, y: 67 },
      { number: 2, label: "Ignition source", detail: "Hot work, static, electrical faults, and friction can change the hazard picture.", x: 51, y: 38 },
      { number: 3, label: "Release path", detail: "Look for where heat, pressure, smoke, or debris can travel.", x: 68, y: 53 },
      { number: 4, label: "Separation / escape", detail: "Good controls create distance, containment, and a usable way out.", x: 84, y: 78 },
    ],
  },
  ergonomics: {
    kind: "ergonomics",
    title: "Task posture and force",
    prompt: "Observe the load, the reach, and the body position before deciding what reduces strain.",
    caption: "Conceptual ergonomics diagram — compare force, posture, repetition, duration, and task design rather than only the worker’s effort.",
    annotations: [
      { number: 1, label: "Load and grip", detail: "Weight alone is not the whole picture; grip, shape, and handling frequency matter.", x: 34, y: 64 },
      { number: 2, label: "Reach distance", detail: "A load held farther from the body increases the physical demand.", x: 55, y: 51 },
      { number: 3, label: "Posture", detail: "Look at the combined posture of back, shoulders, knees, and wrists.", x: 67, y: 67 },
      { number: 4, label: "Task redesign", detail: "The strongest controls change the task, height, route, or aid — not just the worker’s behavior.", x: 82, y: 33 },
    ],
  },
  traffic: {
    kind: "traffic",
    title: "Vehicle-pedestrian interface",
    prompt: "Follow the vehicle path and the pedestrian path. Where do they cross, and what separates them?",
    caption: "Conceptual traffic diagram — assess routes, sight lines, speed, loading activity, and separation for the actual worksite.",
    annotations: [
      { number: 1, label: "Vehicle route", detail: "The route needs a predictable, controlled path rather than improvised movement.", x: 39, y: 66 },
      { number: 2, label: "Pedestrian route", detail: "Look for a path that avoids relying on eye contact or reaction time alone.", x: 70, y: 50 },
      { number: 3, label: "Blind spot / crossing", detail: "At crossings, sight lines and communication become critical.", x: 55, y: 37 },
      { number: 4, label: "Physical separation", detail: "Barriers and route design reduce the chance that two paths conflict.", x: 83, y: 75 },
    ],
  },
  decision: {
    kind: "decision",
    title: "Decision map",
    prompt: "Turn the written scenario into a scene: condition → hazard → exposure → control → evidence.",
    caption: "Concept map for non-visual questions — use it to organize the facts in the stem before selecting an answer.",
    annotations: [
      { number: 1, label: "Condition", detail: "What fact in the scenario starts the decision?", x: 25, y: 35 },
      { number: 2, label: "Hazard", detail: "What can cause harm or loss in this situation?", x: 50, y: 55 },
      { number: 3, label: "Control", detail: "Which action changes the exposure at the right level?", x: 74, y: 35 },
      { number: 4, label: "Evidence", detail: "What fact makes one option more defensible than the others?", x: 75, y: 77 },
    ],
  },
};

const EXACT_VISUALS: Record<string, VisualKind> = {
  "HW-CH07-02": "exposure",
  "HW-CH07-06": "exposure",
  "HW-CH11-07": "biological",
  "HW-CH11-09": "biological",
  "HW-CH11-10": "biological",
  "D1-012": "excavation",
  "D1-015": "ladder",
  "D1-016": "crane",
  "D1-030": "ladder",
  "D1-036": "crane",
};

const MATCHERS: readonly [VisualKind, RegExp][] = [
  ["ladder", /\bladder\b|working at height|fall protection|three-point contact/i],
  ["scaffold", /\bscaffold|guardrail|toe board/i],
  ["crane", /\bcrane\b|\brigging\b|\bhoist\b|\bsling\b|suspended load|load path/i],
  ["excavation", /\bexcavat|\btrench\b|\bshoring\b|spoil pile|cave-?in/i],
  ["electrical", /\belectri|arc[- ]flash|energized|lockout|tagout/i],
  ["machinery", /\bmachine|\bconveyor|pinch point|guarding|point of operation/i],
  ["biological", /biological|bloodborne|biosafety|bacteria|virus|zoono|infection|pathogen|hepa/i],
  ["exposure", /toxic|chemical|solvent|asbestos|silica|cadmium|lead|mercury|arsenic|fume|respirat|inhalation|pesticide/i],
  ["fire", /fire|flammab|combust|explosion|ignition|hot work/i],
  ["ergonomics", /ergonom|manual handling|lift(?:ing)?\b|musculoskeletal|repetitive/i],
  ["traffic", /forklift|vehicle|traffic|struck[- ]by|backing/i],
];

export function getQuestionVisual({
  id,
  stem,
  topic = "",
}: {
  id?: string;
  stem: string;
  topic?: string;
}): QuestionVisual {
  const exact = id ? EXACT_VISUALS[id] : undefined;
  if (exact) return VISUALS[exact];
  const source = `${stem} ${topic}`;
  const match = MATCHERS.find(([, pattern]) => pattern.test(source));
  return VISUALS[match?.[0] ?? "decision"];
}

export const HAZARD_BODY_SYSTEMS: Readonly<Record<string, readonly BodySystemId[]>> = {
  "bio-anthrax": ["lungs", "skin"],
  "bio-brucellosis": ["systemic"],
  "bio-leptospirosis": ["kidneys", "liver"],
  "bio-plague": ["systemic"],
  "bio-tetanus": ["brain"],
  "bio-tuberculosis": ["lungs"],
  "bio-tularemia": ["systemic", "lungs"],
  "bio-cat-scratch-disease": ["blood"],
  "bio-hepatitis-a": ["liver"],
  "bio-hepatitis-b": ["liver", "blood"],
  "bio-orf": ["skin"],
  "bio-rabies": ["brain"],
  "bio-psittacosis": ["lungs"],
  "bio-rocky-mountain-spotted-fever": ["systemic", "skin"],
  "bio-q-fever": ["systemic", "lungs", "liver", "heart"],
  "bio-aspergillosis": ["lungs"],
  "bio-candidiasis": ["skin"],
  "bio-coccidioidomycosis": ["lungs"],
  "bio-histoplasmosis": ["lungs"],
  "tox-asbestos": ["lungs"],
  "tox-benzene": ["blood"],
  "tox-cotton-dust": ["lungs"],
  "tox-arsenic": ["skin", "brain", "liver"],
  "tox-beryllium": ["lungs"],
  "tox-cadmium": ["kidneys", "lungs"],
  "tox-hexavalent-chromium": ["skin", "lungs"],
  "tox-coal-dust": ["lungs"],
  "tox-cobalt": ["lungs", "skin"],
  "tox-formaldehyde": ["lungs", "skin"],
  "tox-lead": ["brain", "kidneys", "blood"],
  "tox-mercury": ["brain"],
  "tox-manganese": ["brain"],
  "tox-silica": ["lungs"],
  "tox-zinc-fumes": ["lungs"],
  "tox-aluminum-dust": ["lungs"],
  "tox-antimony": ["lungs", "heart", "digestive"],
  "tox-organophosphate-carbamate-pesticides": ["brain", "lungs", "digestive"],
};

export function getHazardBodySystems(hazardId: string): readonly BodySystemId[] {
  return HAZARD_BODY_SYSTEMS[hazardId] ?? ["systemic"];
}
