export type Credential = "ASP" | "CSP";
export type BlueprintVersion = "ASP11" | "CSP11";

export interface BlueprintDomain {
  id: string;
  credential: Credential;
  blueprintVersion: BlueprintVersion;
  number: number;
  appDomainId: string;
  name: string;
  weight: number;
  objectiveIds: readonly string[];
}

export interface BlueprintObjective {
  id: string;
  credential: Credential;
  blueprintVersion: BlueprintVersion;
  domainId: string;
  number: string;
  statement: string;
  parentObjectiveId: string | null;
}

export interface BlueprintRegistry {
  blueprintVersion: BlueprintVersion;
  credential: Credential;
  sourceVersion: "V.2024.04.24";
  effectiveDate: string | null;
  sourceUrl: string;
  domains: readonly BlueprintDomain[];
  objectives: readonly BlueprintObjective[];
}

type DomainDefinition = Readonly<{
  appDomainId: string;
  name: string;
  weight: number;
  objectives: readonly (readonly [number: string, statement: string, parentNumber?: string])[];
}>;

const ASP_SOURCE =
  "https://www.bcsp.org/hubfs/Website/Blueprints-References/ASP11-Blueprint.pdf?hsLang=en";
const CSP_SOURCE =
  "https://www.bcsp.org/hubfs/Website/Blueprints-References/CSP-Blueprint.pdf?hsLang=en";

function objectiveId(version: BlueprintVersion, appDomainId: string, number: string) {
  const [whole, suffix = ""] = number.split(/(?=[a-z]$)/i);
  return `${version}-${appDomainId}.${whole.padStart(2, "0")}${suffix}`;
}

function createRegistry(
  blueprintVersion: BlueprintVersion,
  credential: Credential,
  sourceUrl: string,
  effectiveDate: string | null,
  definitions: readonly DomainDefinition[],
): BlueprintRegistry {
  const objectives: BlueprintObjective[] = [];
  const domains = definitions.map((definition, index) => {
    const domainId = `${blueprintVersion}-${definition.appDomainId}`;
    const objectiveIds = definition.objectives.map(([number, statement, parentNumber]) => {
      const id = objectiveId(blueprintVersion, definition.appDomainId, number);
      objectives.push({
        id,
        credential,
        blueprintVersion,
        domainId,
        number,
        statement,
        parentObjectiveId: parentNumber
          ? objectiveId(blueprintVersion, definition.appDomainId, parentNumber)
          : null,
      });
      return id;
    });
    return {
      id: domainId,
      credential,
      blueprintVersion,
      number: index + 1,
      appDomainId: definition.appDomainId,
      name: definition.name,
      weight: definition.weight,
      objectiveIds,
    };
  });
  return {
    blueprintVersion,
    credential,
    sourceVersion: "V.2024.04.24",
    effectiveDate,
    sourceUrl,
    domains,
    objectives,
  };
}

const ASP_DEFINITIONS = [
  {
    appDomainId: "A1",
    name: "Mathematical Calculations",
    weight: 0.1,
    objectives: [
      ["1", "Calculate storage capacity"],
      ["2", "Perform rigging and load calculations"],
      ["3", "Calculate flow rates (e.g., ventilation, hydraulic, pneumatic)"],
      ["4", "Calculate slope angle and depth ratio for trenching and excavation"],
      ["5", "Calculate noise hazards (e.g., Time-Weighted Average [TWA], dual machinery, noise reduction rates)"],
      ["6", "Calculate climate and environmental conditions (e.g., ambient temperature, wind chill, heat index)"],
      ["7", "Calculate fall protection parameters (e.g., free-fall distance, maximum arresting force, force of impact, total fall distance, clearance)"],
      ["8", "Calculate lagging indicators (e.g., incidence rates, lost time, direct costs of incidents)"],
      ["9", "Calculate manual lift parameters (i.e., NIOSH lifting equation)"],
      ["10", "Perform general physics calculations (e.g., force, acceleration, velocity, momentum, friction)"],
      ["11", "Calculate descriptive statistics (e.g., central tendency, variability, probability, standard deviation)"],
      ["12", "Calculate probability of failure mode"],
      ["13", "Calculate financial indicators (e.g., cost-benefit analysis, cost of risk, life cycle cost, return on investment, effects of losses)"],
      ["14", "Conduct exposure assessments (e.g., biological, chemical, Threshold Limit Value [TLV], Short-Term Exposure Limits [STEL], Time-Weighted Average [TWA])"],
      ["15", "Calculate radiation exposure (e.g., shielding, half-life, dosage)"],
      ["16", "Perform unit conversions (e.g., metric/imperial units)"],
    ],
  },
  {
    appDomainId: "A2",
    name: "Safety Programs and Concepts",
    weight: 0.25,
    objectives: [
      ["1", "Understand safety management systems for development of programs (e.g., ISO 45001, ANSI Z10.0)"],
      ["2", "Apply the hierarchy of hazard controls"],
      ["3", "Apply appropriate hazard and risk analysis methods (e.g., hazard analysis, failure modes and effects analysis, fault tree analysis, fishbone, what-if and checklist analysis, change analysis)"],
      ["4", "Apply risk matrix methodology for ranking and mitigation of risks"],
      ["5", "Implement the Globally Harmonized System of Classification and Labelling of Chemicals (GHS)"],
      ["6", "Implement hazardous energy control programs (e.g., electrical, hydraulic, thermal, kinetic, mechanical, magnetic)"],
      ["7", "Understand general electrical principles (e.g., Ohm’s Law, power, impedance, energy, resistance, circuits)"],
      ["8", "Understand the key safety fundamentals of:"],
      ["8a", "Trenching and excavations", "8"],
      ["8b", "Working at heights", "8"],
      ["8c", "Slips, trips, and falls", "8"],
      ["8d", "Machine guarding", "8"],
      ["8e", "Powered industrial trucks", "8"],
      ["8f", "Hoisting and rigging", "8"],
      ["8g", "Scaffolding", "8"],
      ["8h", "Process safety", "8"],
      ["8i", "Confined spaces", "8"],
      ["8j", "Fleet and driver safety", "8"],
      ["8k", "Personal protective equipment (PPE)", "8"],
      ["8l", "Compressed gasses/pressure vessels", "8"],
      ["9", "Facilitate incident investigations (e.g., root causes, contributing factors, data collection, analysis, chain of custody, high risk incidents)"],
      ["10", "Understand key concepts regarding management of change"],
      ["11", "Interpret leading and lagging indicators"],
      ["12", "Have awareness of emerging technologies (e.g., data mining, robotics, drones, artificial intelligence)"],
    ],
  },
  {
    appDomainId: "A3",
    name: "Ergonomics",
    weight: 0.08,
    objectives: [
      ["1", "Understand elements of an ergonomics program"],
      ["2", "Identify ergonomic risk factors"],
      ["2a", "Repetition", "2"],
      ["2b", "Force", "2"],
      ["2c", "Awkward/static postures", "2"],
      ["2d", "Other stressors (e.g., contact, vibration, lighting, temperature conditions)", "2"],
      ["3", "Define work-related musculoskeletal ergonomic injuries"],
      ["4", "Apply ergonomic principles for workspace design (e.g., in-office, remote, field, assembly station, bench/hood)"],
      ["5", "Apply ergonomic principles to manual material handling (e.g., safe lifting)"],
      ["6", "Identify ergonomic work practice controls (e.g., exoskeleton, job rotation, early symptom intervention)"],
      ["7", "Identify ergonomic qualitative and quantitative analysis methods (e.g., NIOSH Lifting Equation, anthropometry, Rapid Entire Body Assessment [REBA], Rapid Upper Limb Assessment [RULA])"],
    ],
  },
  {
    appDomainId: "A4",
    name: "Fire Prevention and Protection",
    weight: 0.12,
    objectives: [
      ["1", "Understand the fundamentals of fire science (e.g., classification, fire pentagon/tetrahedron, upper and lower explosive/flammable limits)"],
      ["2", "Understand flammable and combustible materials (e.g., chemical and physical properties, handling, compatibility)"],
      ["3", "Understand electrical hazards and applicable hazard controls:"],
      ["3a", "Electrostatic discharge", "3"],
      ["3b", "Overcurrent protection", "3"],
      ["3c", "Arc flash", "3"],
      ["3d", "Ground fault circuit interrupter", "3"],
      ["3e", "Grounding and bonding", "3"],
      ["3f", "Hazardous area classifications (e.g., NFPA classifications, non-intrinsically safe)", "3"],
      ["4", "Understand hazards during hot work operations"],
      ["5", "Identify combustible dust hazards (e.g., conflagration, sources of ignition)"],
      ["6", "Understand fire detection systems"],
      ["7", "Understand fire suppression systems"],
      ["8", "Identify fire extinguisher types, use, and requirements"],
      ["9", "Understand segregation and separation (e.g., flammable materials storage and ventilation)"],
      ["10", "Apply effective housekeeping practices (e.g., dust control, disposal of combustibles)"],
      ["11", "Select appropriate fire prevention signs and labels"],
    ],
  },
  {
    appDomainId: "A5",
    name: "Emergency Preparedness and Response",
    weight: 0.1,
    objectives: [
      ["1", "Understand the elements of an emergency response plan"],
      ["2", "Identify the risks associated with the following sources of emergencies and disasters:"],
      ["2a", "Natural", "2"],
      ["2b", "Human", "2"],
      ["2c", "Biological (e.g., pandemic, bioterrorism)", "2"],
      ["3", "Understand the key elements of preparing for an emergency (e.g., drills, worksite security, evacuation routes, life safety, medical/first aid)"],
      ["4", "Identify the elements of disaster response and recovery (e.g., incident command, business continuity)"],
      ["5", "Identify the key elements of a workplace violence prevention program"],
      ["6", "Understand safety considerations for lone workers"],
    ],
  },
  {
    appDomainId: "A6",
    name: "Industrial Hygiene and Occupational Health",
    weight: 0.12,
    objectives: [
      ["1", "Understand fundamental requirements of industrial hygiene programs (e.g., hearing conservation, respiratory protection, medical surveillance)"],
      ["2", "Understand general chemistry concepts (e.g., classification, composition, nomenclature, neutralization, reactions, ideal gas law, pH levels)"],
      ["3", "Understand general human anatomy and physiology related to occupational exposures"],
      ["4", "Identify and assess the sources, sampling, control strategies, symptoms, and target organs related to exposure hazards:"],
      ["4a", "Physical (e.g., noise, ionizing radiation, non-ionizing radiation, heat/cold stress, vibration, light, respirable dust, nanoscale)", "4"],
      ["4b", "Chemical (e.g., asphyxiants, corrosives, reactive, irritants, sensitizers, carcinogens, mutagens, teratogens)", "4"],
      ["4c", "Biological (e.g., viral, bacterial, parasitic, fungus, mold)", "4"],
      ["5", "Understand and differentiate among the types of occupational exposure limits (e.g., Short-Term Exposure Limits [STEL], Time-Weighted Average [TWA], Immediately Dangerous to Life or Health [IDLH], Ceiling)"],
      ["6", "Understand the routes of entry for hazardous substances"],
      ["7", "Understand and differentiate between acute and chronic exposures"],
      ["8", "Apply universal precautions for the control of pathogens (e.g., bloodborne, viral, bacterial)"],
      ["9", "Understand general ionizing radiation principles (e.g., decay, half-life, source strength, concentration, inverse square law)"],
      ["10", "Understand requirements for fitness for duty and return to work"],
      ["11", "Define key aspects of Total Worker Health®"],
    ],
  },
  {
    appDomainId: "A7",
    name: "Environmental Management",
    weight: 0.07,
    objectives: [
      ["1", "Understand environmental hazards (e.g., biological, chemical, waste, radon)"],
      ["2", "Understand environmental impacts and best practices (e.g., spill/release, conservation), related to:"],
      ["2a", "Water (e.g., drainage, waste)", "2"],
      ["2b", "Air (e.g., quality, carbon footprint)", "2"],
      ["2c", "Land (e.g., solid waste, recycling, soil)", "2"],
      ["3", "Understand the hierarchy of conservation (e.g., reduce/reuse/recycle, waste energy)"],
      ["4", "Understand environmental management system standards for development of programs (e.g., ISO 14001)"],
      ["5", "Understand waste removal, treatment, classification, labeling, certification, and disposal"],
      ["6", "Understand the EHS role in environmental, social, and governance (ESG)"],
    ],
  },
  {
    appDomainId: "A8",
    name: "Training, Education, and Communication",
    weight: 0.11,
    objectives: [
      ["1", "Apply appropriate learning theory and techniques"],
      ["2", "Use appropriate training tools (e.g., instructor-led, computer-based, group meeting, virtual)"],
      ["3", "Understand how to create a positive safety culture (e.g., open feedback, effective communication, psychological safety, emotional intelligence)"],
      ["4", "Facilitate data collection, needs analysis, gap analysis, and feedback"],
      ["5", "Define baseline competency to determine training needs"],
      ["6", "Assess training effectiveness and knowledge retention"],
      ["7", "Understand and identify human risk factors affecting performance (e.g., behavior, decision making, situation awareness, workload management, risk perception, stress)"],
      ["8", "Understand the requirements for and differences between competent and qualified persons"],
    ],
  },
  {
    appDomainId: "A9",
    name: "Legal",
    weight: 0.05,
    objectives: [
      ["1", "Understand compliance requirements and legal liability of safety professional practices (e.g., audits, sampling, reporting, procedural review)"],
      ["2", "Understand legal liability regarding contractor management and multi-employer worksites"],
      ["3", "Understand contract terminology and contract management lifecycle"],
      ["4", "Understand records control (e.g., retention, chain-of-custody, worker privacy)"],
      ["5", "Determine appropriate actions based on knowledge and scope limitations (e.g., cybersecurity, insurance, legal)"],
      ["6", "Understand the principles of risk transfer (e.g., outsourcing, insurance)"],
      ["7", "Understand liabilities relating to worker impairment (e.g., drugs, alcohol, fatigue, stress)"],
    ],
  },
] as const satisfies readonly DomainDefinition[];

const CSP_DEFINITIONS = [
  {
    appDomainId: "D1",
    name: "Advanced Application of Safety Principles",
    weight: 0.25,
    objectives: [
      ["1", "Describe the principles of minimizing hazards using Prevention-Through-Design (e.g., avoidance, elimination, substitution, safety design criteria for workplace facilities, machines, and practices)"],
      ["2", "Apply the principles of process safety (e.g., pressure relief systems, chemical compatibility, management of change, materials of construction, process flow diagrams)"],
      ["3", "Evaluate common workplace hazards (e.g., electrical, falls, confined spaces, lockout/tagout, working around water, caught in, struck by, excavation)"],
      ["4", "Evaluate facility life safety features (e.g., public space safety, floor loading, occupancy loads)"],
      ["5", "Describe fleet safety principles (e.g., driver and equipment safety, maintenance, surveillance equipment, GPS monitoring, telematics, hybrid vehicles, fuel systems, driving under the influence, fatigue)"],
      ["6", "Evaluate materials handling methods and controls (e.g., forklifts, aerial lifts, and other powered industrial trucks; cranes, hand trucks, hoists, rigging, manual handling, drones)"],
      ["7", "Evaluate the use of tools, machines, and equipment (e.g., hand tools, power tools, ladders, grinders, hydraulics, robotics)"],
    ],
  },
  {
    appDomainId: "D2",
    name: "Program Management",
    weight: 0.25,
    objectives: [
      ["1", "Compare performance against established benchmarks (e.g., gap analysis)"],
      ["2", "Analyze performance standards to determine plan of action"],
      ["3", "Determine how to measure, analyze, and improve EHS culture"],
      ["4", "Determine appropriate incident investigation techniques (root causes) and apply corrective actions"],
      ["5", "Describe the Management of Change process (prior, during, after)"],
      ["6", "Describe system safety analysis techniques (e.g., fault tree analysis, failure modes and effects analysis [FMEA], Safety Case approach, risk summation)"],
      ["7", "Evaluate leading and lagging indicators"],
      ["8", "Recognize safety, health, and environmental management and audit systems (e.g., ISO 14000 series, 45001, 19011, ANSI Z10)"],
      ["9", "Describe required components for plans, systems, and policies (e.g., safety, health, and environmental regulations and standards)"],
      ["10", "Utilize document retention or management principles (e.g., incident investigation, training records, exposure records, maintenance records, environmental management system, audit results, privacy, trade secrets, personal information)"],
      ["11", "Apply budgeting, finance, and economic analysis techniques and principles (e.g., timelines, budget development, resourcing, return on investment, cost/benefit analysis, role in procurement process)"],
      ["12", "Differentiate management leadership techniques (e.g., management theories, leadership theories, motivation, discipline, authority, responsibility, accountability, communication styles)"],
      ["13", "Apply project management principles and techniques (e.g., RACI charts, project timelines)"],
      ["14", "Analyze and/or interpret data (e.g., exposure, release concentrations, sampling data, mean, median, mode, confidence intervals, probabilities, Pareto analysis)"],
    ],
  },
  {
    appDomainId: "D3",
    name: "Risk Management",
    weight: 0.15,
    objectives: [
      ["1", "Apply general principles of the safety risk evaluation process (i.e., identifying, analyzing, evaluating, monitoring, and communicating risk affecting an organization)"],
      ["2", "Apply risk management strategies to identify and mitigate EHS hazards (e.g., risk analysis, job hazard analysis, process hazard analysis, hierarchy of controls)"],
      ["3", "Differentiate financial risk mitigation strategies as they relate to risk avoidance, risk retention, risk sharing, risk transfer, loss prevention and reduction"],
      ["4", "Apply risk analysis process of identifying, ranking, and monitoring (e.g., disasters/emergency preparedness, fire prevention, occupational health, hazardous materials management/environmental compliance)"],
    ],
  },
  {
    appDomainId: "D4",
    name: "Emergency Management",
    weight: 0.09,
    objectives: [
      ["1", "Create, employ, and maintain an Emergency Response Plan (e.g., fire, severe weather, nuclear incidents, natural disasters, terrorist attacks, chemical spills, utilities systems, cyber security)"],
      ["2", "Describe the elements in disaster response and recovery (e.g., incident command, business continuity, contingency plans)"],
      ["3", "Identify key components of fire prevention, protection, and suppression systems"],
      ["4", "Prepare procedures for the safe transportation and security of hazardous materials"],
      ["5", "Implement a workplace violence prevention program"],
    ],
  },
  {
    appDomainId: "D5",
    name: "Environmental Management",
    weight: 0.06,
    objectives: [
      ["1", "Describe environmental protection and pollution prevention programs (e.g., spill containment, abatement, best practices)"],
      ["2", "Identify procedures used to manage hazardous materials (e.g., GHS classification system, storage and handling, policy, security, hazardous waste storage and disposal)"],
      ["3", "Identify procedures used to manage waste (e.g., universal, recycling, spill clean-up, labeling, remediation)"],
      ["4", "Determine sustainability principles and practices (e.g., supply chain; reduce, reuse, recycle)"],
      ["5", "Describe the impact of environmental issues (e.g., aging infrastructure, asbestos, air pollution, climate change, environmental, social, and governance)"],
    ],
  },
  {
    appDomainId: "D6",
    name: "Occupational Health and Applied Science",
    weight: 0.1,
    objectives: [
      ["1", "Anticipate, recognize, evaluate, and control occupational exposures by implementing techniques for measurement, sampling, and analysis (e.g., hazardous chemicals, SDS, radiation, noise, biological hazards, heat/cold, indoor air quality, ventilation, nanoparticles, combustible dust, heat systems, high pressure, silica, powder and spray applications, blasting, molten metals, hot work, cold and heat stress, laser)"],
      ["2", "Understand principles of public health as applicable (i.e., fundamentals of epidemiology, infectious disease, risk factors, statistics to interpret data)"],
      ["3", "Apply toxicology principles to create exposure control plans and develop risk mitigation plans (e.g., using sampling equipment, symptoms of an exposure, LD50, LC50, mutagens, carcinogens, teratogens, ototoxins)"],
      ["4", "Evaluate principles related to ergonomics and human factors (e.g., visual acuity, body mechanics, lifting, vibration, anthropometrics, fatigue management)"],
      ["5", "Apply chemistry principles to calculate required containment volumes and hazardous materials storage requirements"],
      ["6", "Apply core concepts in physics (e.g., forms of energy, weights, forces, stresses)"],
    ],
  },
  {
    appDomainId: "D7",
    name: "Training",
    weight: 0.1,
    objectives: [
      ["1", "Describe the needs assessment process to determine worker training, competencies, and qualifications"],
      ["2", "Develop training programs with training materials to address various learning styles (e.g., presentation methods and tools)"],
      ["3", "Describe how to implement training programs utilizing the Continuous Improvement model"],
      ["4", "Determine the effectiveness of training programs (e.g., surveys, on-the-job compliance, feedback, assessments, demonstrations, quizzes)"],
      ["5", "Demonstrate working knowledge of education and training methods and techniques (e.g., classroom, online, simulation, computer-based, Artificial Intelligence, coaching, on-the-job training)"],
      ["6", "Understand adult learning principles (e.g., visual, auditory, reading and writing, kinesthetic)"],
    ],
  },
] as const satisfies readonly DomainDefinition[];

export const ASP11_REGISTRY = createRegistry(
  "ASP11",
  "ASP",
  ASP_SOURCE,
  "2025-09-01",
  ASP_DEFINITIONS,
);

export const CSP11_REGISTRY = createRegistry(
  "CSP11",
  "CSP",
  CSP_SOURCE,
  null,
  CSP_DEFINITIONS,
);

export const BLUEPRINT_REGISTRIES = [ASP11_REGISTRY, CSP11_REGISTRY] as const;

export const BLUEPRINT_REGISTRY_BY_VERSION = new Map(
  BLUEPRINT_REGISTRIES.map((registry) => [registry.blueprintVersion, registry]),
);

export const BLUEPRINT_OBJECTIVE_BY_ID = new Map(
  BLUEPRINT_REGISTRIES.flatMap((registry) => registry.objectives).map((objective) => [objective.id, objective]),
);

export function findBlueprintDomain(version: BlueprintVersion, appDomainId: string) {
  return BLUEPRINT_REGISTRY_BY_VERSION.get(version)?.domains.find(
    (domain) => domain.appDomainId === appDomainId,
  );
}

export function aspA1ObjectiveId(legacyObjective: string) {
  const match = /^A1\.(\d{1,2})$/.exec(legacyObjective);
  return match ? objectiveId("ASP11", "A1", match[1]) : null;
}
