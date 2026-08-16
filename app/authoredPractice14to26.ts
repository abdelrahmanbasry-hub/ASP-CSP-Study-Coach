/**
 * Source-backed authored practice for course chapters 14-26.
 *
 * Drawn from W. David Yates, Safety Professional's Reference and Study Guide,
 * 4th ed., chapters 14-26. Each item is independently authored rather than
 * transformed from a homework stem.
 */
export type AuthoredPracticeQuestion = {
  readonly level: "foundation" | "homework-level" | "application";
  readonly stem: string;
  readonly options: readonly [string, string, string, string];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly explanation: string;
};

export const AUTHORED_PRACTICE_14_TO_26 = {
  "ch-14": [
    {
      level: "foundation",
      stem: "Before choosing eye, hand, or foot protection for a new maintenance task, what should the safety professional do first?",
      options: [
        "Issue the most protective equipment available to every worker.",
        "Ask employees which PPE brand they prefer.",
        "Wait for the first injury to identify the needed equipment.",
        "Complete a job hazard assessment to identify the task-specific hazards.",
      ],
      correctIndex: 3,
      explanation: "PPE selection begins with a thorough job hazard assessment. It identifies the hazards the equipment must address; selection is not based on preference or on a prior injury.",
    },
    {
      level: "homework-level",
      stem: "A worker could face incidental contact with an electrical source up to 13.8 kV. Which hard-hat classification from the chapter provides the greatest electrical protection?",
      options: [
        "Class C, because conductive helmets dissipate electrical energy.",
        "Class G, because it is rated to 2,200 V.",
        "Any class, because hard-hat classifications concern impact only.",
        "Class E, because it is rated to 20,000 V.",
      ],
      correctIndex: 3,
      explanation: "The chapter distinguishes Class E (20,000 V), Class G (2,200 V), and Class C (conductive and not intended for protection from electrical conductors).",
    },
    {
      level: "application",
      stem: "A team proposes gloves as the only response to recurring solvent splash at a filling station. Which concern best explains why this is incomplete control planning?",
      options: [
        "Gloves always eliminate the hazardous substance.",
        "Solvent work never requires a hazard assessment once gloves are issued.",
        "PPE should be selected before the task and exposure are understood.",
        "PPE leaves the source hazard in place and depends on correct fit, use, and maintenance.",
      ],
      correctIndex: 3,
      explanation: "PPE can be necessary, but it does not remove the source hazard. The chapter's hazard-assessment approach supports considering task and exposure controls before relying solely on PPE.",
    },
  ],

  "ch-15": [
    {
      level: "foundation",
      stem: "A department records 3, 5, 8, and 12 near misses in four consecutive months. What is the arithmetic mean?",
      options: ["6", "8", "28", "7"],
      correctIndex: 3,
      explanation: "Add the observations (28) and divide by four months. The mean, also called the arithmetic average, is 7.",
    },
    {
      level: "homework-level",
      stem: "Two independent components must both operate for a ventilation alarm to function. Their reliabilities are 0.96 and 0.90. What is the series-system reliability?",
      options: ["0.864", "0.940", "0.960", "0.996"],
      correctIndex: 0,
      explanation: "In a series system, failure of either component fails the system, so multiply the component reliabilities: 0.96 × 0.90 = 0.864.",
    },
    {
      level: "application",
      stem: "A report states that a result has p = 0.03. Which description best matches the chapter's definition of a p value?",
      options: [
        "The probability that the null hypothesis is certainly false.",
        "The percentage of data that must lie within one standard deviation.",
        "The probability of obtaining a result at least as extreme as observed if the null hypothesis is true.",
        "The reliability of the measurement instrument over its service life.",
      ],
      correctIndex: 2,
      explanation: "A p value is the probability of observing a result as extreme as the one obtained, assuming the null hypothesis is true.",
    },
  ],

  "ch-16": [
    {
      level: "foundation",
      stem: "A series circuit contains three components. Which statement about current is correct?",
      options: [
        "Current divides independently among the components.",
        "No current flows until a parallel branch is added.",
        "The same current flows through each component along the single path.",
        "Current is measured in volts at each component.",
      ],
      correctIndex: 2,
      explanation: "A series circuit has one path, so the same current passes through every component. Separate current paths characterize a parallel circuit.",
    },
    {
      level: "homework-level",
      stem: "What must an arc-flash risk assessment estimate in addition to identifying potential arc-flash hazards?",
      options: [
        "Only the equipment purchase price.",
        "Only the number of employees assigned to the area.",
        "The electrical utility's annual operating budget.",
        "The likelihood of injury or health damage and the severity of the potential consequence.",
      ],
      correctIndex: 3,
      explanation: "The source says the arc-flash assessment should identify the hazard and estimate both likelihood and severity so appropriate protective measures can be determined.",
    },
    {
      level: "application",
      stem: "A worker needs to enter the restricted approach boundary of exposed energized equipment. Which condition is required by the chapter's description?",
      options: [
        "The worker may enter if a coworker is nearby.",
        "The worker may enter without PPE if the task lasts less than one minute.",
        "The worker need only wear ordinary work gloves.",
        "The worker must be qualified, trained, use proper PPE, and have the required written permit.",
      ],
      correctIndex: 3,
      explanation: "The restricted approach boundary is closest to exposed live equipment. Entry requires a qualified worker with appropriate training and PPE, plus the written permit described in the chapter.",
    },
  ],

  "ch-17": [
    {
      level: "foundation",
      stem: "A 6 kg tool cart accelerates at 3 m/s² on a level path. Ignoring friction, what net force is required?",
      options: ["2 N", "9 N", "18 N", "54 N"],
      correctIndex: 2,
      explanation: "Newton's second law is F = ma. Multiplying 6 kg by 3 m/s² gives 18 N.",
    },
    {
      level: "homework-level",
      stem: "A 4 kg suspended load moves at 5 m/s. What is its kinetic energy?",
      options: ["10 J", "25 J", "50 J", "100 J"],
      correctIndex: 2,
      explanation: "Kinetic energy is energy of motion. KE = 1/2 mv² = 1/2 × 4 × 5² = 50 J.",
    },
    {
      level: "application",
      stem: "A forklift travels 12 m/s due east. Which term captures both the rate of motion and its direction?",
      options: ["Speed", "Velocity", "Mass", "Potential energy"],
      correctIndex: 1,
      explanation: "Speed is scalar and tells how fast an object moves. Velocity is a vector, so it includes both rate of movement and direction.",
    },
  ],

  "ch-18": [
    {
      level: "foundation",
      stem: "Which field studies fluids at rest?",
      options: ["Hydraulics", "Aerodynamics", "Thermodynamics", "Hydrostatics"],
      correctIndex: 3,
      explanation: "Hydrostatics is fluid statics: the study of fluids at rest. Hydraulics concerns fluids in motion.",
    },
    {
      level: "homework-level",
      stem: "A 300 lbf force acts uniformly on an area of 6 in². What pressure does it exert?",
      options: ["18 psi", "294 psi", "1,800 psi", "50 psi"],
      correctIndex: 3,
      explanation: "Pressure is force per unit area. Divide 300 lbf by 6 in² to obtain 50 psi.",
    },
    {
      level: "application",
      stem: "At two points along a horizontal, inviscid flow path, the fluid moves faster at Point B than at Point A. Under Bernoulli's principle, what change is expected at Point B?",
      options: [
        "Pressure increases because speed increases.",
        "Pressure must stay the same regardless of speed.",
        "Pressure decreases as speed increases.",
        "The fluid becomes static at the faster point.",
      ],
      correctIndex: 2,
      explanation: "For the inviscid-flow relationship stated in the chapter, an increase in fluid speed occurs with a decrease in pressure or potential energy.",
    },
  ],

  "ch-19": [
    {
      level: "foundation",
      stem: "Which design choice best respects a core adult-learning principle?",
      options: [
        "Connect instruction to realistic job goals and the learner's existing experience.",
        "Avoid allowing learners to ask questions.",
        "Use only abstract material with no workplace relevance.",
        "Treat all prior work experience as an obstacle to learning.",
      ],
      correctIndex: 0,
      explanation: "The chapter describes adult learners as self-directed, goal- and relevance-oriented, practical, experienced, and deserving of respect.",
    },
    {
      level: "homework-level",
      stem: "What is the first step in developing a safety training program according to the chapter?",
      options: [
        "Select a slide template.",
        "Conduct a training needs analysis.",
        "Administer a posttest.",
        "Choose the longest available course.",
      ],
      correctIndex: 1,
      explanation: "A training needs analysis is the first step. It establishes whether training is needed and what performance gap the program must address.",
    },
    {
      level: "application",
      stem: "A course's final assessment is intended to show whether participants can carry out its stated objectives. What type of assessment is it?",
      options: ["Pretest", "Review test", "Posttest", "Informal attendance record"],
      correctIndex: 2,
      explanation: "Pretests identify starting knowledge before instruction, review tests support longer courses, and posttests should determine whether participants can perform the learning objectives.",
    },
  ],

  "ch-20": [
    {
      level: "foundation",
      stem: "A safety project borrows $24,000 at simple interest of 5% per year for two years. What is the interest cost?",
      options: ["$1,200", "$2,400", "$12,000", "$26,400"],
      correctIndex: 1,
      explanation: "Use simple interest I = Pni: $24,000 × 2 × 0.05 = $2,400. This is interest only, not the total amount repaid.",
    },
    {
      level: "homework-level",
      stem: "An organization invests $10,000 at 4% annually for two years, compounded annually. Which future value is closest?",
      options: ["$10,400", "$10,800", "$10,816", "$11,600"],
      correctIndex: 2,
      explanation: "Use F = P(1 + i)^n: 10,000(1.04)^2 = $10,816. Compounding applies interest to the growing balance.",
    },
    {
      level: "application",
      stem: "Why should a safety professional not compare a dollar available today directly with the same nominal dollar available one year from now?",
      options: [
        "Money today has investment potential and must be adjusted for time value.",
        "All future expenditures are prohibited.",
        "Interest applies only to personal purchases, not safety projects.",
        "A dollar's purchasing power is permanently fixed.",
      ],
      correctIndex: 0,
      explanation: "The chapter's engineering-economics premise is that money generates money. Comparing present and future amounts requires accounting for investment potential or the cost of money.",
    },
  ],

  "ch-21": [
    {
      level: "foundation",
      stem: "Which sequence correctly orders Maslow's needs from lower to higher in the chapter?",
      options: [
        "Safety, physiological, esteem, belonging, self-actualization",
        "Physiological, belonging, safety, self-actualization, esteem",
        "Physiological, safety, belonging, esteem, self-actualization",
        "Belonging, esteem, physiological, safety, self-actualization",
      ],
      correctIndex: 2,
      explanation: "The chapter lists physiological, safety, belonging, esteem, and self-actualization. Maslow's theory treats lower unsatisfied needs as motivators before higher-level needs.",
    },
    {
      level: "homework-level",
      stem: "A supervisor assumes employees dislike work and will respond only to money and close control. Which McGregor view does this reflect?",
      options: ["Theory X", "Theory Y", "Herzberg's motivation factors", "The Deming cycle"],
      correctIndex: 0,
      explanation: "Theory X assumes employees do not want to work and are motivated only by money. Theory Y takes the contrasting view that people can enjoy work and seek responsibility when needs are met.",
    },
    {
      level: "application",
      stem: "After checking whether a new safety process achieved its target, a management team revises the process and begins the next improvement cycle. Which Deming step is it performing?",
      options: ["Plan", "Do", "Check", "Act"],
      correctIndex: 3,
      explanation: "PDCA is Plan, Do, Check, Act. Revising or standardizing after evaluation is the Act step, which feeds continuous improvement.",
    },
  ],

  "ch-22": [
    {
      level: "foundation",
      stem: "What is the primary purpose of an accident investigation?",
      options: [
        "Assign personal blame as quickly as possible.",
        "Prevent recurrence of the event.",
        "Determine the highest available insurance payment.",
        "Replace corrective action with a written report.",
      ],
      correctIndex: 1,
      explanation: "The chapter makes prevention of recurrence the primary purpose. Fact finding and analysis should support corrective action, not merely assign blame.",
    },
    {
      level: "homework-level",
      stem: "Which accident-causation theory portrays accidents in terms of energy and its transfer?",
      options: ["Systems Theory", "Behavior Theory", "Energy Release Theory", "Epidemiological Theory"],
      correctIndex: 2,
      explanation: "William Haddon developed the Energy Release Theory, which frames accidents in terms of energy and transference.",
    },
    {
      level: "application",
      stem: "A complex event has equipment, work-practice, and management contributors. The investigator intentionally uses useful parts of several causation models rather than forcing one model to explain everything. Which approach is being used?",
      options: [
        "The Combination Theory",
        "The Domino Theory only",
        "A pretest",
        "The hierarchy of needs",
      ],
      correctIndex: 0,
      explanation: "Combination Theory allows an investigator to use parts or all of available accident-causation theories to solve a problem.",
    },
  ],

  "ch-23": [
    {
      level: "foundation",
      stem: "Which set contains the four broad classifications of work-related injury described in the chapter?",
      options: [
        "Direct, indirect, acute, chronic",
        "Partial, total, temporary, permanent",
        "Recordable, reportable, restricted, first aid",
        "Physical, chemical, biological, ergonomic",
      ],
      correctIndex: 1,
      explanation: "The chapter classifies work-related injuries into partial, total, temporary, and permanent categories.",
    },
    {
      level: "homework-level",
      stem: "Which factor is explicitly part of the basis for workers' compensation insurance premiums in the chapter?",
      options: [
        "Dollars of payroll per $100 and an experience modification rate or factor",
        "The number of safety posters displayed",
        "The age of the organization's safety manual",
        "Only the price of employee uniforms",
      ],
      correctIndex: 0,
      explanation: "The source identifies payroll dollars per $100 and an EMR or EMF as the premium basis. The other items are not the stated premium factors.",
    },
    {
      level: "application",
      stem: "A company wants to reduce the duration and cost of covered injuries while returning employees to productive work within restrictions. Which program most directly supports that goal?",
      options: [
        "A written return-to-work/light-duty program",
        "A policy of delaying reports until the end of the year",
        "Eliminating communication with medical providers",
        "Requiring all injured workers to remain off work indefinitely",
      ],
      correctIndex: 0,
      explanation: "The chapter identifies return-to-work/light-duty programs as one of the most effective tools for reducing workers' compensation premiums and experience modification rates.",
    },
  ],

  "ch-24": [
    {
      level: "foundation",
      stem: "What does the recommended weight limit (RWL) represent for a defined lifting task?",
      options: [
        "The heaviest load any individual worker can lift once.",
        "The load nearly all healthy workers can perform for up to 8 hours without increased low-back-injury risk under those task conditions.",
        "A legal maximum weight for every workplace task.",
        "The worker's body weight plus the load weight.",
      ],
      correctIndex: 1,
      explanation: "RWL is task-specific. It describes a weight that nearly all healthy workers can handle over a substantial period, up to 8 hours, without increased risk of lifting-related low-back pain or injury.",
    },
    {
      level: "homework-level",
      stem: "A box weighs 36 lb and the calculated RWL for the task is 24 lb. What is the lifting index?",
      options: ["0.67", "1.00", "1.50", "12.0"],
      correctIndex: 2,
      explanation: "The lifting index is actual load divided by RWL: 36 ÷ 24 = 1.5. It estimates the relative physical stress of the manual lifting task.",
    },
    {
      level: "application",
      stem: "A worker must rotate the torso to place a container off to the side rather than directly in front. Which lifting variable describes this displacement from the midsagittal plane?",
      options: ["Coupling classification", "Asymmetry angle", "Vertical location", "Lifting duration"],
      correctIndex: 1,
      explanation: "Asymmetry angle measures how far the object is displaced from the front (midsagittal plane) of the body at the start or end of a lift.",
    },
  ],

  "ch-25": [
    {
      level: "foundation",
      stem: "Under the chapter's cave-in protection summary, a trench 5 ft deep requires what action?",
      options: [
        "Provide protection from cave-in.",
        "No protection because it is below 6 ft.",
        "Only issue hard hats.",
        "Wait until water enters the trench.",
      ],
      correctIndex: 0,
      explanation: "The source states that an excavation more than 4 ft deep must be protected from cave-in. A 5-ft trench is above that threshold.",
    },
    {
      level: "homework-level",
      stem: "A crane will work near a 70 kV overhead line. Using the chapter's clearance rule, what is the minimum clearance?",
      options: ["10 ft", "10 ft 8 in.", "11 ft 8 in.", "18 ft"],
      correctIndex: 1,
      explanation: "For voltage above 50 kV, add 0.4 in. for each kV over 50. The excess is 20 kV, so add 8 in. to 10 ft: 10 ft 8 in.",
    },
    {
      level: "application",
      stem: "Which statement distinguishes bonding from grounding?",
      options: [
        "Bonding connects conductive objects together; grounding connects conductive objects directly to earth.",
        "Bonding is limited to wood structures; grounding is limited to plastic equipment.",
        "Grounding joins two conductive objects, while bonding requires a ground rod only.",
        "They are identical terms with no practical distinction.",
      ],
      correctIndex: 0,
      explanation: "The chapter defines bonding as connecting conductive objects with a conductor. Grounding connects conductive objects directly to earth through a ground rod, cold pipe, or building steel.",
    },
  ],

  "ch-26": [
    {
      level: "foundation",
      stem: "Which sequence correctly orders the five basic risk-management steps described in the chapter?",
      options: [
        "Hazard assessment, implementation, hazard identification, supervision, decision-making",
        "Hazard identification, hazard assessment, development of controls and decision-making, implementation, supervision and evaluation",
        "Inspection, citation, abatement, appeal, closure",
        "Plan, purchase PPE, respond, recover, audit",
      ],
      correctIndex: 1,
      explanation: "The five steps begin with hazard identification and assessment, then controls/decision-making, implementation, and supervision/evaluation.",
    },
    {
      level: "homework-level",
      stem: "After controls are selected, residual risk remains unacceptably high for a high-hazard task. What is the most defensible decision?",
      options: [
        "Proceed because a control has been selected.",
        "Add controls, limit the high-risk scope, or discontinue the project after balancing risk and benefit.",
        "Remove the hazard from the written analysis so the risk is no longer documented.",
        "Transfer all responsibility to the worker performing the task.",
      ],
      correctIndex: 1,
      explanation: "Residual risk is the risk remaining after controls. If it is too high, leaders can add controls, limit the scope, or discontinue the project based on the risk-benefit decision.",
    },
    {
      level: "application",
      stem: "A control plan says only “use safe practices.” What essential implementation detail is missing?",
      options: [
        "A clear statement of who, what, when, where, and how the control will be used.",
        "A promise that residual risk is always zero.",
        "A requirement to use PPE for every hazard.",
        "A substitute for supervision and evaluation.",
      ],
      correctIndex: 0,
      explanation: "The chapter says control measures should specify who, what, when, where, and how they will be used. They must then be converted into simple instructions understood at all levels.",
    },
  ],
} as const satisfies Readonly<Record<string, readonly AuthoredPracticeQuestion[]>>;
