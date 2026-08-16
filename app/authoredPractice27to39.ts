export type AuthoredPracticeLevel = "foundation" | "homework-level" | "application";

export type AuthoredPracticeQuestion = {
  level: AuthoredPracticeLevel;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

const question = (
  level: AuthoredPracticeLevel,
  stem: string,
  options: AuthoredPracticeQuestion["options"],
  correctIndex: number,
  explanation: string,
): AuthoredPracticeQuestion => ({ level, stem, options, correctIndex, explanation });

/**
 * Source-grounded replacement practice sets for course chapters 27-39.
 */
export const AUTHORED_PRACTICE_27_TO_39: Readonly<Record<string, readonly AuthoredPracticeQuestion[]>> = {
  // Yates, 4th ed., ch. 27, pp. 633-634.
  "ch-27": [
    question(
      "foundation",
      "Before choosing worker protection for an abandoned hazardous-waste site, which activity provides the information needed to identify site hazards and select protection methods?",
      [
        "Site characterization using available off-site information, on-site surveys, and ongoing monitoring.",
        "Issuing the same respiratory protection to every worker before the hazards are known.",
        "Starting cleanup work and documenting exposures only after the first shift.",
        "Classifying the site solely by the number of waste containers present.",
      ],
      0,
      "Site characterization supplies the hazard information used to select protection. The book describes it as beginning before entry, continuing with restricted reconnaissance, and then ongoing monitoring.",
    ),
    question(
      "homework-level",
      "A facility generates 1,200 kg of ordinary hazardous waste in one month. Which generator category best fits the book's RCRA summary?",
      [
        "Conditionally exempt small quantity generator, because it produces less than 1,000 kg.",
        "Large quantity generator, because it produces more than 1,000 kg per month.",
        "Small quantity generator, because all monthly quantities below 6,000 kg are small quantity.",
        "Universal-waste generator, because the waste is produced at a facility.",
      ],
      1,
      "The source identifies a large quantity generator as producing more than 1,000 kg of ordinary hazardous waste per month. The 6,000 kg figure is a storage limit for small quantity generators, not their generation threshold.",
    ),
    question(
      "application",
      "Air monitoring at a cleanup site identifies an airborne solvent near a work zone. Which use of that result is most directly supported by the chapter?",
      [
        "It proves the waste can be disposed of without a manifest.",
        "It eliminates the need for a medical program at the site.",
        "It helps select PPE, mark areas needing protection, assess health effects, and decide whether medical monitoring is needed.",
        "It replaces the site safety and health plan.",
      ],
      2,
      "Air monitoring identifies and quantifies airborne contaminants. The chapter links those measurements to PPE selection, area delineation, health-effect assessment, and decisions about medical monitoring.",
    ),
  ],

  // Yates, 4th ed., ch. 28, pp. 654-655.
  "ch-28": [
    question(
      "foundation",
      "A training diagram shows a radiation particle made of two protons and two neutrons. Which type of radiation does it represent?",
      ["Beta radiation.", "Neutron radiation.", "Alpha radiation.", "Gamma radiation."],
      2,
      "An alpha particle is a helium nucleus, consisting of two protons and two neutrons. Beta particles are excess electrons, while gamma rays are electromagnetic radiation.",
    ),
    question(
      "homework-level",
      "A sealed source has an activity of 800 units. After one radiological half-life, what activity should remain?",
      ["200 units.", "400 units.", "600 units.", "800 units."],
      1,
      "Radiological half-life is the time required for one-half of the atoms to disintegrate into another nuclear form. One half-life leaves one-half of 800, or 400 units.",
    ),
    question(
      "application",
      "A technician must reduce dose during a brief job near an ionizing-radiation source. Which plan applies all three primary controls described in the chapter?",
      [
        "Minimize time near the source, maximize distance where practical, and place suitable shielding between the worker and source.",
        "Increase the time near the source, use a warning sign, and rely on a medical exam afterward.",
        "Wear hearing protection, reduce lighting, and take a longer route to the source.",
        "Use only a dosimeter and leave time, distance, and shielding unchanged.",
      ],
      0,
      "The three primary radiation controls are time, distance, and shielding. Less time reduces exposure, greater distance reduces dose, and shielding attenuates radiation.",
    ),
  ],

  // Yates, 4th ed., ch. 29, p. 680.
  "ch-29": [
    question(
      "foundation",
      "A straight extension ladder will bear against a wall 24 ft above its base. Using the 1:4 rule, how far from the wall should its base be placed?",
      ["3 ft.", "6 ft.", "12 ft.", "24 ft."],
      1,
      "The chapter gives the base distance as the vertical height divided by four. For a 24-ft height, the base should be 6 ft from the wall; the ladder must also extend at least 3 ft beyond its landing point.",
    ),
    question(
      "homework-level",
      "In a general-industry maintenance area, an employee can fall 5 ft to a lower level. What conclusion follows from the chapter's fall-protection threshold?",
      [
        "Fall protection is required because the general-industry threshold is 4 ft.",
        "Fall protection is not required until the potential fall is 6 ft.",
        "Only a warning sign is required below 10 ft.",
        "The threshold applies only to construction work.",
      ],
      0,
      "The source distinguishes the thresholds: 4 ft in general industry and 6 ft in construction. A 5-ft general-industry exposure exceeds the applicable threshold.",
    ),
    question(
      "application",
      "A crew wants to assemble a scaffold on a firm-looking but noticeably sloped surface. What is the best correction before work begins?",
      [
        "Add more workers so the scaffold is less likely to shift.",
        "Use a longer lanyard so workers can move around the platform.",
        "Place the scaffold on a level, solid foundation before it is used.",
        "Raise the platform to keep it clear of the sloped area.",
      ],
      2,
      "The chapter requires scaffolding to be placed on level and solid foundations. A visibly sloped base does not satisfy that condition merely because it appears firm.",
    ),
  ],

  // Yates, 4th ed., ch. 30, pp. 714-715.
  "ch-30": [
    question(
      "foundation",
      "A forklift is traveling down a ramp with a loaded pallet. Which travel direction keeps the load on the upgrade side as required by the chapter?",
      [
        "Drive forward with the forks pointed downhill.",
        "Drive in reverse with the load on the upgrade side.",
        "Turn sideways and travel across the grade.",
        "Drive forward with the forks raised above the operator's view.",
      ],
      1,
      "With a load, a forklift is driven forward uphill and in reverse downhill so the load remains on the upgrade side. The chapter also cautions never to turn a forklift on a grade.",
    ),
    question(
      "homework-level",
      "A licensed operator begins a shift on the same forklift used yesterday. What inspection responsibility remains before operation?",
      [
        "The operator must conduct a preoperational inspection before operating the equipment.",
        "No inspection is needed unless maintenance reported a defect.",
        "Only an annual inspection is required for experienced operators.",
        "The previous shift's operator is responsible for the next shift's inspection.",
      ],
      0,
      "The book states that each operator should conduct a preoperational inspection before operating the equipment. Experience and prior use do not remove that step.",
    ),
    question(
      "application",
      "Maintenance needs to repair a powered conveyor drive. What must occur before the maintenance work begins?",
      [
        "Increase conveyor speed to clear all remaining product.",
        "Assign a second operator to hold the emergency-stop button.",
        "Move the conveyor to a lower ergonomic height.",
        "Deenergize the power source and lock out the equipment.",
      ],
      3,
      "The source requires powered-conveyor energy to be deenergized and the equipment locked out before maintenance. A stop button or another operator is not an energy-isolation control.",
    ),
  ],

  // Yates, 4th ed., ch. 31, p. 730.
  "ch-31": [
    question(
      "foundation",
      "Within a safety management system, what does the safety policy most directly demonstrate?",
      [
        "That all hazards have already been eliminated.",
        "Management's commitment to the safety program and the SMS.",
        "That only the safety manager is responsible for worker safety.",
        "That the organization has selected a single audit checklist.",
      ],
      1,
      "The safety policy is the visible expression of management commitment to the safety program and the safety management system; it is not proof that every hazard has been controlled.",
    ),
    question(
      "homework-level",
      "A team has assessed a proposed machine guard and must decide whether a revised control is needed. Which SMS component is designed to guide that decision using acceptable-risk assessment?",
      [
        "Safety promotion.",
        "Document and record control.",
        "Safety Risk Management.",
        "Management review only after an incident.",
      ],
      2,
      "The Safety Risk Management component provides a detailed guide for determining the need for, and adequacy of, new or revised controls based on acceptable-risk assessment.",
    ),
    question(
      "application",
      "After checking whether a new safety procedure achieved its objective, a team changes the procedure to address the result. Which part of the PDCA cycle are they performing?",
      ["Act.", "Plan.", "Do.", "Check."],
      0,
      "PDCA is Plan-Do-Check-Act. Reviewing the result is the Check step; changing the procedure in response is the Act step.",
    ),
  ],

  // Yates, 4th ed., ch. 32, pp. 741-742.
  "ch-32": [
    question(
      "foundation",
      "A facility's 911 procedure is being revised. Which assignment best follows the source guidance?",
      [
        "Designate a position to meet emergency responders and direct them to the emergency location.",
        "Require responders to find the emergency by following the alarm sound.",
        "Assign all available employees to wait outside the main entrance.",
        "Tell visitors to provide directions because they are less involved in the event.",
      ],
      0,
      "The site-security guidance calls for a person designated by position to meet emergency responders and direct them to the specific emergency location.",
    ),
    question(
      "homework-level",
      "Which control should be included in a physical-security plan to support facility access control?",
      [
        "Removing all identification requirements for contractors after their first visit.",
        "Relying on an open gate when the site is busy.",
        "A means to identify visitors and contractors.",
        "Posting financial results near the main entrance.",
      ],
      2,
      "Facility access control is one of the most important elements of physical security. The chapter specifically calls for a means to identify visitors and contractors.",
    ),
    question(
      "application",
      "During an active-shooter emergency, an employee reaches responding law-enforcement officers. What should the employee do next?",
      [
        "Give officers an independent tactical plan before following directions.",
        "Follow all directions from law-enforcement personnel exactly.",
        "Return to the building to collect personal property.",
        "Use social media to coordinate the response.",
      ],
      1,
      "The source identifies run, hide, or fight as the immediate options and directs employees to follow law-enforcement directions exactly once officers are present.",
    ),
  ],

  // Yates, 4th ed., Behavior Theory in ch. 22, p. 523.
  "ch-33": [
    question(
      "foundation",
      "What is the most appropriate focus of a behavior-based safety program described in the book?",
      [
        "Identifying and defining observable safety behaviors so they can be measured and improved.",
        "Assigning blame to an employee whenever an injury occurs.",
        "Replacing hazard controls with disciplinary action.",
        "Tracking only injury costs after an incident.",
      ],
      0,
      "The behavior-theory section describes BBS as identifying target behaviors, defining them clearly enough to observe, collecting data, providing feedback, and reviewing results. It is not a blame-based program.",
    ),
    question(
      "homework-level",
      "Observers collect safety-sampling data on a repeated work behavior. What should a sound BBS process do next with that data?",
      [
        "Discard it unless someone was injured.",
        "Use it to decide how to proceed and to set reasonable improvement goals.",
        "Publish individual names without feedback.",
        "Treat it as proof that all hazards have been eliminated.",
      ],
      1,
      "The chapter identifies observational data collection as a BBS element and calls for decisions based on those data. The program then uses feedback and review to support improvement.",
    ),
    question(
      "application",
      "A supervisor observes workers consistently using a newly introduced guard correctly. Which response best reflects the book's BBS principles?",
      [
        "Remove the guard because the behavior has improved.",
        "Wait until an injury occurs before discussing the observation.",
        "Provide feedback and reinforce the positive safe behavior while continuing to review the data.",
        "Issue a warning to every worker to make the program appear strict.",
      ],
      2,
      "BBS emphasizes feedback and reinforcement of positive consequences for appropriate behavior. Continued observation and review help determine whether the improvement is sustained.",
    ),
  ],

  // Yates, 4th ed., ch. 36, pp. 816-817.
  "ch-34": [
    question(
      "foundation",
      "A manager claims that a lower total case incident rate this year proves that next year's incidents will be low. What limitation from the chapter best challenges that claim?",
      [
        "TCIR is a required leading indicator.",
        "TCIR measures only employee engagement.",
        "Traditional injury and illness measures have limited or no value for predicting future incidents.",
        "A lower TCIR means all safety goals have been met.",
      ],
      2,
      "TCIRs and similar injury/illness measures are lagging indicators. The source warns that they have limited or no value in predicting future incidents.",
    ),
    question(
      "homework-level",
      "Which objective is most consistent with the SMART criteria in the chapter?",
      [
        "Increase completion of documented corrective actions from 80% to 95% by December 31.",
        "Improve safety whenever possible.",
        "Make the workplace much safer soon.",
        "Ask leaders to try harder on safety.",
      ],
      0,
      "SMART goals are Specific, Measurable, Attainable, Realistic/Relevant, and Time-bound. The first objective identifies the measure, target, and deadline.",
    ),
    question(
      "application",
      "A performance review measures whether procedures are followed, whether the system is actually deployed, and whether it can achieve stated goals. Which three measurement dimensions is it using?",
      [
        "Cost, productivity, and morale.",
        "Policy, training, and equipment.",
        "Severity, probability, and exposure.",
        "Compliance, deployment, and capability.",
      ],
      3,
      "The chapter names compliance, deployment, and capability as the three dimensions needed to measure whether the system can achieve specific, measurable goals.",
    ),
  ],

  // Yates, 4th ed., ch. 37, pp. 857-858.
  "ch-35": [
    question(
      "foundation",
      "An audit team wants to use the three basic methods described in the chapter. Which set is complete?",
      [
        "Equipment calibration, financial analysis, and exit interviews.",
        "Document review or verification, employee interviews, and site inspections.",
        "Only injury-rate trending and workers' compensation costs.",
        "Supervisor opinions, social-media posts, and customer surveys.",
      ],
      1,
      "The chapter identifies three basic audit methods: document review/verification, employee interviews, and site inspections. A complete audit draws evidence from all three.",
    ),
    question(
      "homework-level",
      "Inspection records repeatedly show few serious hazards, yet injuries continue. What action does the source specifically suggest considering?",
      [
        "Train inspectors to look for different hazards.",
        "Stop inspections because the records show compliance.",
        "Replace all employee interviews with injury-rate calculations.",
        "Remove minor findings from the records.",
      ],
      0,
      "When serious hazards are not being found but accidents continue, the chapter says inspectors may need training to identify different hazards.",
    ),
    question(
      "application",
      "A company needs evidence about whether workers actually understand the training they received. Which audit method is most useful for that purpose?",
      [
        "Reviewing only equipment purchase orders.",
        "Measuring the number of parking spaces.",
        "Employee interviews.",
        "Counting the number of written policies.",
      ],
      2,
      "Employee interviews are described as especially useful for determining the quality of health and safety training, because they reveal whether the learning reached workers.",
    ),
  ],

  // Yates, 4th ed., ch. 34, pp. 778-779.
  "ch-36": [
    question(
      "foundation",
      "A federal agency proposes a major action that may significantly affect the environment. What does NEPA require the agency to prepare?",
      [
        "A detailed environmental impact statement that assesses impacts and alternatives.",
        "A workers' compensation claim.",
        "A product safety data sheet for every affected material.",
        "A forklift operator-training record.",
      ],
      0,
      "NEPA requires federal agencies to prepare detailed EISs for major federal actions significantly affecting the environment, including assessment of environmental impacts and alternatives.",
    ),
    question(
      "homework-level",
      "Which item is identified by the chapter as a universal waste rather than an example of a regulated air pollutant?",
      [
        "A nitrogen-oxide emission stack.",
        "A spent thermostat.",
        "A stormwater discharge permit.",
        "An asbestos-containing building material.",
      ],
      1,
      "The source lists batteries, agricultural pesticides, and thermostats as examples of universal waste. That classification is discussed under RCRA waste management.",
    ),
    question(
      "application",
      "A chemical manufacturer is told to submit chemical reports, retain records, conduct testing, and comply with restrictions on a mixture. Which law most directly supplies that EPA authority?",
      ["FIFRA.", "The Clean Air Act.", "TSCA.", "NEPA."],
      2,
      "TSCA gives EPA authority for reporting, recordkeeping, testing requirements, and restrictions related to chemical substances and mixtures. FIFRA instead addresses pesticide distribution, sale, and use.",
    ),
  ],

  // Yates, 4th ed., ch. 40, pp. 890-891.
  "ch-37": [
    question(
      "foundation",
      "A safety professional discovers an unacceptable risk that could harm people, property, or the environment. Which response is most consistent with the BCSP Code of Ethics?",
      [
        "Advise the appropriate parties of the danger and unacceptable risk.",
        "Withhold the finding until after the next performance review.",
        "Report it only if the organization can avoid a financial loss.",
        "Ignore it if the hazard is outside the professional's primary department.",
      ],
      0,
      "The Code directs certificants to hold safety, health, environmental protection, and property protection paramount and to advise appropriate parties of danger and unacceptable risks.",
    ),
    question(
      "homework-level",
      "Before issuing a public technical statement, what condition does the Code require?",
      [
        "The statement must be popular with the employer.",
        "It must be objective and truthful, founded on facts and the professional's competence in the subject.",
        "It must avoid all discussion of uncertainty.",
        "It must be approved by every employee who may be affected.",
      ],
      1,
      "The Code requires public statements to be objective and truthful and to rest on knowledge of the facts and competence in the subject matter.",
    ),
    question(
      "application",
      "A certificant is asked to lead a highly specialized assessment outside their education and experience. What is the ethical course?",
      [
        "Accept the assignment and rely on the title alone.",
        "Accept it only if the client does not ask technical questions.",
        "Undertake the assignment only when qualified by education or experience, while maintaining competence through continued development.",
        "Delegate the final report to an unqualified colleague.",
      ],
      2,
      "The Code says professionals should undertake assignments only when qualified in the specific technical field, and they are responsible for maintaining competence through education, experience, and training.",
    ),
  ],

  // Yates, 4th ed., ch. 38, pp. 868-869.
  "ch-38": [
    question(
      "foundation",
      "A covered process will receive an identical replacement part that performs the same function as the part removed. How does the OSHA PSM management-of-change exception characterize that situation?",
      [
        "It automatically requires a new process hazard analysis.",
        "It is a replacement in kind, which is excepted from the listed MoC change procedures.",
        "It is an emergency change that never requires documentation.",
        "It is controlled only by the EPA Risk Management Rule.",
      ],
      1,
      "OSHA PSM requires written procedures for covered changes but expressly excepts replacements in kind to process chemicals, technology, equipment, and procedures.",
    ),
    question(
      "homework-level",
      "Before a new process change is implemented, what should the key-stakeholder team's action plan include?",
      [
        "Only a projected cost and a final completion date.",
        "A list of employees who disagree with the change.",
        "Specific tasks, acceptable timelines, responsible roles, and needed training.",
        "A promise to evaluate the change only after an incident.",
      ],
      2,
      "The source describes a detailed action plan as the framework for a proposed change. It includes tasks, timelines, responsible parties and roles, and required training.",
    ),
    question(
      "application",
      "A technically sound change was installed, but employees slowly returned to the old process. Which MoC follow-through is most needed?",
      [
        "Embed the change and its value in policies, practices, communication, and monitoring.",
        "Classify every future modification as a replacement in kind.",
        "Stop communicating after the installation is complete.",
        "Avoid stakeholder input so procedures remain unchanged.",
      ],
      0,
      "The chapter warns that people can revert to the prior status quo. Leaders must embed the change and its value into culture and practices, supported by policies, communication, and monitoring.",
    ),
  ],

  // Yates, 4th ed., ch. 39, pp. 888-889.
  "ch-39": [
    question(
      "foundation",
      "Which sequence correctly identifies the five phases of emergency management presented in the chapter?",
      [
        "Prevention, mitigation, preparedness, response, and recovery.",
        "Recognition, calibration, sampling, analysis, and reporting.",
        "Inspection, citation, abatement, appeal, and closure.",
        "Plan, budget, purchase, operate, and dispose.",
      ],
      0,
      "Emergency management includes prevention, mitigation, preparedness, response, and recovery. It is a framework for reducing threats before, during, and after an emergency.",
    ),
    question(
      "homework-level",
      "A tornado warning is issued for the immediate area. What distinguishes it from a tornado watch in the book's description?",
      [
        "A warning indicates a tornado has been sighted and calls for immediate shelter.",
        "A warning means conditions are merely favorable and no immediate action is needed.",
        "A warning applies only to emergency responders.",
        "A warning replaces the facility's Emergency Action Plan.",
      ],
      0,
      "A watch means conditions exist in which tornadoes may strike. A warning is issued when a tornado has been sighted in an area and calls for immediate shelter.",
    ),
    question(
      "application",
      "An employee receives a telephone bomb threat. Which response best follows the source guidance while the caller is still connected?",
      [
        "Hang up immediately and wait for an investigator to call back.",
        "Challenge the caller and announce the threat over the public-address system.",
        "Remain calm, keep the caller talking, take detailed notes, and listen for background clues.",
        "Transfer the call to an untrained employee so more people can listen.",
      ],
      2,
      "The chapter says not to hang up. The caller should be encouraged to talk while the recipient records details and listens for background sounds, accents, and familiar geographic terms.",
    ),
  ],
};
