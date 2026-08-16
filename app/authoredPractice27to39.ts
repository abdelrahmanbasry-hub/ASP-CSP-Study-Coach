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
    question(
      "foundation",
      "Which material fits the chapter's definition of a hazardous material?",
      [
        "A liquid that can harm people, property, or the environment.",
        "Only a substance formally listed as hazardous waste.",
        "Any material that is stored in a metal container.",
        "Only a gas that can cause an immediate fire.",
      ],
      0,
      "A hazardous material can be a solid, liquid, or gas that can harm people, other living organisms, property, or the environment. Hazardous waste is a more specific regulatory category.",
    ),
    question(
      "foundation",
      "A worker gets a chemical on intact skin without swallowing it or suffering a puncture. Which route of entry is most directly involved?",
      [
        "Inhalation.",
        "Absorption.",
        "Ingestion.",
        "Intravenous injection.",
      ],
      1,
      "The chapter identifies inhalation, ingestion, absorption, and percutaneous or intravenous injection as routes of entry. Contact through intact skin is absorption.",
    ),
    question(
      "homework-level",
      "A generator produces 80 kg of ordinary hazardous waste and no acute hazardous waste in a month. Which category in the chapter's RCRA summary best fits that quantity?",
      [
        "Large quantity generator.",
        "Small quantity generator.",
        "Conditionally exempt small quantity generator.",
        "Treatment, storage, and disposal facility.",
      ],
      2,
      "The source describes a conditionally exempt small quantity generator as generating no more than 100 kg of ordinary waste and no more than 1 kg of acute hazardous waste per month.",
    ),
    question(
      "homework-level",
      "A shipment of hazardous waste leaves a plant for a treatment facility. Which record is used to follow the waste from its generation through disposal?",
      [
        "A safety data sheet.",
        "A hazardous-waste manifest.",
        "A pre-use equipment inspection.",
        "An employee exposure questionnaire.",
      ],
      1,
      "Under the chapter's RCRA discussion, the manifest is the shipping and tracking record that follows hazardous waste from generation through disposal.",
    ),
    question(
      "application",
      "A cleanup contractor has identified contaminants but has not yet set work zones or controlled entry. Which site-control objective should guide the next step?",
      [
        "Minimize worker contamination, protect the public from site hazards, and prevent vandalism.",
        "Eliminate all medical surveillance because the contaminants are now known.",
        "Allow unrestricted access so employees can choose their own work zone.",
        "Replace decontamination with a single end-of-project inspection.",
      ],
      0,
      "Site control is intended to minimize potential worker contamination, protect the public from site hazards, and prevent vandalism. It complements, rather than replaces, planning, PPE, and decontamination.",
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
    question(
      "foundation",
      "What makes radiation ionizing rather than nonionizing?",
      [
        "It has enough energy to detach electrons from atoms or molecules.",
        "It can be detected only with a personal dosimeter.",
        "It is always produced by a radioactive material.",
        "It consists only of visible-light waves.",
      ],
      0,
      "Ionizing radiation has enough energy to detach electrons from atoms or molecules, causing ionization. The chapter distinguishes this from nonionizing radiation such as visible light, infrared, and radiofrequency energy.",
    ),
    question(
      "foundation",
      "Which particle radiation consists of free neutrons and is classified in the chapter as indirect ionizing radiation?",
      [
        "Alpha radiation.",
        "Beta radiation.",
        "Neutron radiation.",
        "Gamma radiation.",
      ],
      2,
      "Neutron radiation consists of free neutrons and is described as indirect ionizing radiation. Alpha particles are helium nuclei, while beta particles are excess electrons.",
    ),
    question(
      "homework-level",
      "At 2 m from a point source, a worker receives a dose rate of 90 units. Ignoring shielding, what dose rate is expected at 6 m using the inverse-square relationship?",
      [
        "10 units.",
        "30 units.",
        "45 units.",
        "270 units.",
      ],
      0,
      "Dose from a point source varies inversely with the square of distance. Tripling distance from 2 m to 6 m reduces the dose rate by 3², so 90 divided by 9 equals 10 units.",
    ),
    question(
      "homework-level",
      "Which annual occupational exposure limit is stated in the chapter for ionizing radiation?",
      [
        "0.5 rem per year.",
        "1.25 rem per year.",
        "5 rem per year.",
        "50 rem per year.",
      ],
      2,
      "The chapter gives OSHA's ionizing-radiation exposure limit as 5 rem per year and 1.25 rem per quarter.",
    ),
    question(
      "application",
      "A technician works intermittently near a source over several weeks. Which instrument is most appropriate for tracking that individual's accumulated radiation dose?",
      [
        "A personal dosimeter.",
        "A sound-level meter.",
        "A combustible-gas indicator.",
        "A pitot tube.",
      ],
      0,
      "Personal dosimetry is used to track an individual's accumulated dose. It supports, but does not replace, exposure control through time, distance, and shielding.",
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
    question(
      "foundation",
      "Before an employee uses a portable ladder, what condition must the employer ensure?",
      [
        "The ladder is maintained in proper working condition and inspected before use.",
        "The ladder has been painted in the site's designated color.",
        "The employee has used the same model of ladder before.",
        "The ladder is stored outdoors between shifts.",
      ],
      0,
      "The source requires ladders to be kept in proper working condition, inspected before each use, and removed from service when they do not meet the applicable requirements.",
    ),
    question(
      "foundation",
      "How far should an extension ladder extend beyond its landing point?",
      [
        "At least 1 ft.",
        "At least 3 ft.",
        "At least 6 ft.",
        "Exactly one ladder section.",
      ],
      1,
      "The chapter states that an extension ladder should extend at least 3 ft beyond the landing point. This is a separate requirement from the 1:4 setup ratio.",
    ),
    question(
      "homework-level",
      "A personal fall-arrest system is being selected for one worker. What anchor-system force rating is stated in the chapter?",
      [
        "500 lb per person.",
        "1,000 lb per person.",
        "3,600 lb per person.",
        "5,000 lb per person.",
      ],
      3,
      "The chapter states that the harness, connecting devices, lanyard, and anchor points in a personal fall-arrest system must be rated to withstand 5,000 lb of force per person.",
    ),
    question(
      "homework-level",
      "When may an employee first be permitted to work where fall hazards are present?",
      [
        "After the employee receives the required fall-hazard training.",
        "After the employee watches another worker use fall protection.",
        "Only after a supervisor experiences the task personally.",
        "After the first fall incident has been investigated.",
      ],
      0,
      "Employees must be trained before they are permitted to be exposed to fall hazards. Observation or post-incident review is not a substitute for that preparation.",
    ),
    question(
      "application",
      "A competent person sees excavated spoil piled directly at the lip of an open excavation, with a loader parked alongside it. Which correction best reduces the edge hazard?",
      [
        "Move spoil piles and heavy equipment away from the excavation edge.",
        "Ask workers to stand closer to the edge so they can watch for movement.",
        "Place a warning sign on the spoil pile and leave the loader in place.",
        "Increase the depth of the excavation before moving the equipment.",
      ],
      0,
      "The chapter's excavation guidance calls for heavy equipment and spoil piles to be kept away from the excavation edge. Their weight can contribute to collapse and creates an added struck-by hazard.",
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
    question(
      "foundation",
      "Which action best reduces manual-material-handling risk before a lift begins?",
      [
        "Reduce the package's weight or size when feasible.",
        "Increase the package size so it is easier to see.",
        "Require workers to lift overhead whenever possible.",
        "Encourage workers to twist at the waist to change direction quickly.",
      ],
      0,
      "The chapter identifies reducing the weight and size of packages as a key manual-lifting principle. It also calls for assistance when needed, lifting with the legs, keeping the back straight, and avoiding twisting and overhead lifting.",
    ),
    question(
      "foundation",
      "Which hazard is especially common when employees use dollies and hand trucks?",
      [
        "Pinch points.",
        "Ionizing-radiation exposure.",
        "Oxygen-deficient atmospheres.",
        "Hearing loss from ultrasound.",
      ],
      0,
      "Pinch points are identified as very common hazards associated with dollies and hand trucks. The control plan should address hand placement, route conditions, load stability, and communication.",
    ),
    question(
      "homework-level",
      "A forklift operator has been assigned to a different type of truck. What training action does the chapter require?",
      [
        "Refresher training before continued operation of the new assignment.",
        "No action if the operator has more than one year of experience.",
        "A written warning only if an accident occurs.",
        "A replacement of the truck's data plate.",
      ],
      0,
      "The source lists assignment to drive a different truck as a trigger for refresher training. Other triggers include unsafe operation, an accident or near miss, an unsafe evaluation, and workplace changes that affect safe operation.",
    ),
    question(
      "homework-level",
      "Which power source is generally preferred for an indoor warehouse forklift operation when feasible?",
      [
        "Electric power.",
        "An uncontrolled gasoline engine.",
        "A diesel engine with no emission assessment.",
        "Any fuel source, because indoor air quality is unrelated to forklift selection.",
      ],
      0,
      "The chapter's materials-handling guidance identifies electric power as the preferred choice for indoor warehouse operation when feasible, helping avoid combustion-emission concerns.",
    ),
    question(
      "application",
      "A warehouse is setting up a battery-charging area for powered industrial trucks. Which combination is most appropriate?",
      [
        "Ventilation, eyewash capability, and a means to neutralize electrolyte.",
        "A closed room with no ventilation and only a fire extinguisher.",
        "A carpeted area with drinking water but no emergency eyewash.",
        "A loading dock area that relies solely on open forklift doors.",
      ],
      0,
      "Battery charging can create electrolyte and gas hazards. The chapter calls for ventilation, eyewash capability, and electrolyte-neutralization capability in the charging area.",
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
    question(
      "foundation",
      "What common end goal do safety management systems share, regardless of the specific framework an organization selects?",
      [
        "Systematically decrease employee injuries while improving safety management.",
        "Eliminate the need for employee participation.",
        "Use injury rates as the only source of safety information.",
        "Transfer all safety responsibilities to an outside auditor.",
      ],
      0,
      "The chapter describes the common end goal of safety management systems as decreasing employee injuries and improving an organization's safety management in a systematic fashion.",
    ),
    question(
      "homework-level",
      "Why is worker participation essential in a functioning safety management system?",
      [
        "It supplies the operational knowledge and involvement needed to make the system work in practice.",
        "It replaces management accountability for safety performance.",
        "It makes written policies unnecessary.",
        "It permits employees to choose whether hazards are controlled.",
      ],
      0,
      "Employee participation is a core SMS principle. The system must use the knowledge and involvement of the people performing the work; it does not remove management's responsibility for resources, decisions, and accountability.",
    ),
    question(
      "application",
      "A company already uses compatible quality and environmental management systems. What is the most useful SMS implementation approach?",
      [
        "Align the safety-management processes with the compatible existing systems where appropriate.",
        "Keep safety entirely separate so common controls cannot be shared.",
        "Replace every existing management process with injury-rate reporting.",
        "Delay safety management until an external audit finds a problem.",
      ],
      0,
      "The course objective emphasizes integrating safety management with compatible quality and environmental systems. Alignment can make planning, documentation, review, and improvement more coherent without erasing safety-specific responsibilities.",
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
    question(
      "foundation",
      "Which item belongs in the basic information section of a site-security plan?",
      [
        "The facility's physical address and emergency contact numbers.",
        "Only the annual injury rate for the facility.",
        "A list of employees' personal passwords.",
        "A guarantee that no security incident can occur.",
      ],
      0,
      "The chapter says the plan should include basic site information such as the name, physical address, contact numbers, products or services, employee count, operating hours, site description, neighborhood description, and high-risk concerns.",
    ),
    question(
      "foundation",
      "What management commitment is necessary to implement a site-security plan successfully?",
      [
        "Provide the necessary human and financial resources.",
        "Rely only on volunteers during an emergency.",
        "Remove all access controls after operating hours.",
        "Limit the plan to a single posted sign.",
      ],
      0,
      "A site-security plan requires management commitment to supply the human and financial resources needed for implementation. A written plan without resources is not an effective security program.",
    ),
    question(
      "homework-level",
      "Which set best represents layered access-control measures for a facility?",
      [
        "Fencing, lighting, and cameras.",
        "A single unlocked entrance and a visitor suggestion box.",
        "Hearing protectors, respirators, and safety shoes.",
        "Only a written policy with no physical controls.",
      ],
      0,
      "The course objectives identify layered access control, including fencing, lighting, and cameras. These controls supplement, rather than replace, visitor identification and security procedures.",
    ),
    question(
      "homework-level",
      "An employee observes an incident of workplace violence or a credible warning sign. What response is most consistent with the chapter?",
      [
        "Report it immediately through the established channels.",
        "Wait to see whether the situation becomes physical.",
        "Discuss it only on social media after the shift.",
        "Assume site security is responsible even if no one is told.",
      ],
      0,
      "Employees should be trained to observe and report workplace-violence incidents immediately. Prompt reporting helps the employer evaluate and prevent potential threats.",
    ),
    question(
      "application",
      "A preparedness exercise is being designed for a large facility. Which scope best reflects the course's disaster-preparedness objectives?",
      [
        "Evacuation, medical response, spill control, and crisis communication.",
        "Only a post-event press release.",
        "Only a financial budget review.",
        "Only an annual visitor sign-in audit.",
      ],
      0,
      "The chapter objectives include evacuation, medical response, spill control, and crisis communication as elements of disaster preparedness. A credible plan coordinates these functions before an event occurs.",
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
    question(
      "foundation",
      "According to Heinrich's law as presented in the chapter, which relationship is stated for one major injury?",
      [
        "29 minor injuries and 300 accidents with no injuries.",
        "1 minor injury and 29 accidents with no injuries.",
        "300 major injuries and 29 minor injuries.",
        "No relationship can be observed among injuries and accidents.",
      ],
      0,
      "The chapter presents Heinrich's law as a ratio of 1 major injury to 29 minor injuries and 300 accidents with no injuries. It is used here as the book's stated safety-performance model.",
    ),
    question(
      "homework-level",
      "Why should target safety behaviors be defined precisely in a behavior-based safety program?",
      [
        "So observers can measure the behaviors reliably.",
        "So any injury can automatically be assigned to one worker.",
        "So feedback can be withheld until an incident occurs.",
        "So hazard controls no longer need to be evaluated.",
      ],
      0,
      "BBS requires target behaviors to be defined precisely enough that they can be measured reliably. Reliable observation is necessary before the organization can set goals, provide feedback, and evaluate progress.",
    ),
    question(
      "application",
      "A team has collected observation data but never tells workers what the data show or recognizes progress. Which BBS element is missing?",
      [
        "Feedback and reinforcement of progress.",
        "A recordable-injury calculation.",
        "A replacement-in-kind determination.",
        "A hazardous-waste manifest.",
      ],
      0,
      "The source lists feedback and reinforcement of progress as BBS elements. Observation data should support learning and improvement, not simply be collected without communication.",
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
    question(
      "foundation",
      "Which item is one of OSHA's stated elements of an effective accountability system?",
      [
        "Established standards.",
        "A promise that no incident will ever occur.",
        "A single annual injury-rate calculation.",
        "An optional safety policy with no resources.",
      ],
      0,
      "The chapter lists established standards, resources, a measurement system, consequences, and application as elements of an effective accountability system.",
    ),
    question(
      "homework-level",
      "Which measure is the best example of a leading indicator for a safety program?",
      [
        "The percentage of scheduled corrective actions completed on time.",
        "The prior year's workers' compensation cost.",
        "The number of recordable injuries from last year.",
        "The total days lost from injuries that already occurred.",
      ],
      0,
      "Leading indicators measure proactive activity or system conditions, such as whether corrective actions are completed. Injury costs and recordable cases describe historical outcomes and are lagging indicators.",
    ),
    question(
      "application",
      "A safety manager wants a measurement system that helps the organization see whether it is progressing toward its goals. What design feature is most important?",
      [
        "Measure the current state and reassess periodically against the desired state.",
        "Collect one injury-rate figure and never revisit it.",
        "Measure only events that result in lost time.",
        "Use goals without a defined measure or review date.",
      ],
      0,
      "An effective measurement system indicates where the organization currently is and measures periodically toward where it wants to be. That supports continuous improvement rather than a one-time report.",
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
    question(
      "foundation",
      "What continuous-evaluation method is identified as especially useful for managers and supervisors?",
      [
        "Management by Walking Around.",
        "Waiting for an annual insurance renewal.",
        "Reviewing only the most recent injury cost.",
        "Eliminating employee contact during inspections.",
      ],
      0,
      "The chapter identifies Management by Walking Around as one of the best methods managers and supervisors can use to continuously evaluate health and safety program effectiveness.",
    ),
    question(
      "homework-level",
      "What is the purpose of worksite analysis in an effective health and safety program?",
      [
        "Analyze worksite conditions to identify and eliminate existing or potential hazards.",
        "Rank individual managers by their personal popularity.",
        "Replace all training with a document review.",
        "Focus only on injuries that have already occurred.",
      ],
      0,
      "Worksite analysis involves managers and employees analyzing conditions to identify and eliminate existing or potential hazards. It is a proactive program element, not merely a review of past injuries.",
    ),
    question(
      "application",
      "A team needs a structured way to analyze a job before work begins and identify its hazards and controls. Which commonly used technique should it select?",
      [
        "A job hazard analysis form.",
        "A hazardous-waste manifest.",
        "A workers' compensation claim form.",
        "A daily production forecast.",
      ],
      0,
      "The chapter identifies the job hazard analysis (JHA) form as one of the most commonly used techniques for conducting hazard analysis. It helps the team examine work steps, hazards, and controls before exposure.",
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
    question(
      "foundation",
      "Which body is established by NEPA to oversee the law's provisions?",
      [
        "The National Transportation Safety Board.",
        "The Council on Environmental Quality.",
        "The Occupational Safety and Health Review Commission.",
        "The Chemical Safety and Hazard Investigation Board.",
      ],
      1,
      "The chapter states that NEPA establishes the Council on Environmental Quality (CEQ), which is appointed to oversee NEPA's provisions.",
    ),
    question(
      "foundation",
      "Which statement best describes RCRA's central role in environmental management?",
      [
        "It is the primary U.S. policy governing disposal of solid and hazardous waste.",
        "It regulates only pesticide distribution and use.",
        "It applies only to federal actions requiring environmental impact statements.",
        "It establishes professional ethics for safety certificants.",
      ],
      0,
      "The Resource Conservation and Recovery Act is the primary U.S. policy governing disposal of solid and hazardous wastes. The chapter also identifies its coverage of universal waste, used-oil management, and underground storage tanks.",
    ),
    question(
      "homework-level",
      "A company is planning the sale and use of an agricultural pesticide. Which federal law is most directly concerned with that activity?",
      [
        "NEPA.",
        "RCRA.",
        "FIFRA.",
        "TSCA.",
      ],
      2,
      "FIFRA provides federal control of pesticide distribution, sale, and use. TSCA concerns reporting, testing, and restrictions for chemical substances and mixtures more broadly.",
    ),
    question(
      "homework-level",
      "Which environmental problem is one of the three major threats the Clean Air Act of 1990 was designed to curb, according to the chapter?",
      [
        "Noise-induced hearing loss.",
        "Falls from elevated work surfaces.",
        "Lead-acid battery exposure.",
        "Acid rain.",
      ],
      3,
      "The chapter identifies acid rain, urban air pollution, and toxic air emissions as the three major threats addressed by the Clean Air Act of 1990.",
    ),
    question(
      "application",
      "A wastewater-treatment facility generates discarded sludge. For RCRA purposes, which conclusion is most accurate?",
      [
        "It cannot be solid waste because it is not a dry solid.",
        "It is automatically universal waste, regardless of its characteristics.",
        "It can fall within the solid-waste definition even though the material is sludge.",
        "It is regulated only if it is stored in an underground tank.",
      ],
      2,
      "The chapter's definition of solid waste includes sludge from wastewater-treatment, water-supply-treatment, and air-pollution-control facilities, along with other discarded solid, liquid, semisolid, or contained gaseous material.",
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
    question(
      "foundation",
      "Which interests must a BCSP certificant hold paramount when performing professional duties?",
      [
        "Only the employer's short-term financial interests.",
        "Safety and health of people, protection of the environment, and protection of property.",
        "The popularity of the recommended control.",
        "The preferences of a single department.",
      ],
      1,
      "The Code directs certificants to hold the safety and health of people, environmental protection, and property protection paramount while carrying out professional duties.",
    ),
    question(
      "homework-level",
      "A consultant's résumé claims responsibility for a project the consultant only observed. Which ethical requirement is violated?",
      [
        "Avoid deceptive acts that falsify or misrepresent qualifications or prior responsibility.",
        "Use the PDCA cycle for safety management.",
        "Maintain a written fire-prevention plan.",
        "Classify the project as a replacement in kind.",
      ],
      0,
      "The Code prohibits deceptive acts, including falsifying or misrepresenting academic or professional qualifications and exaggerating responsibility for prior assignments.",
    ),
    question(
      "application",
      "A professional's financial interest could influence a recommendation about a safety control. What should guide the professional's conduct?",
      [
        "Let the financial interest determine the recommendation.",
        "Avoid compromise of professional judgment by conflicts of interest.",
        "Withhold all technical information from the client.",
        "Delegate the decision to someone without relevant competence.",
      ],
      1,
      "The Code requires professional relations to be conducted with the highest integrity and directs certificants to avoid compromising professional judgment because of conflicts of interest.",
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
    question(
      "foundation",
      "Which set of ISO management-system standards is identified as requiring certified organizations to implement and maintain management-of-change systems?",
      [
        "ISO 9001, ISO 14001, and ISO 45001.",
        "ISO 17025, ISO 22000, and ISO 31000.",
        "ISO 50001, ISO 55001, and ISO 26000.",
        "No ISO certification standard addresses management of change.",
      ],
      0,
      "The chapter states that ISO 9001, ISO 14001, and ISO 45001 require certified organizations to implement and maintain MoC systems as part of embedding a safety culture in operations.",
    ),
    question(
      "homework-level",
      "What risk is the EPA Risk Management Rule primarily designed to manage?",
      [
        "Risks to workers' hearing from occupational noise.",
        "Risks to the surrounding community from certain hazardous-substance facilities.",
        "Risks from inaccurate workers' compensation claims.",
        "Risks from using an improper ladder angle.",
      ],
      1,
      "The source explains that EPA's Risk Management Rule is designed to manage risks to the surrounding community and is required under Section 112(r) of the Clean Air Act Amendments.",
    ),
    question(
      "homework-level",
      "What is described as a cornerstone element of any effective MoC program?",
      [
        "Keeping the proposed change confidential until after implementation.",
        "Using only a final financial approval.",
        "Effective communication.",
        "Avoiding input from affected employees.",
      ],
      2,
      "Effective communication is identified as a cornerstone of MoC. It helps affected people understand the change, its risks, the required controls, and their responsibilities.",
    ),
    question(
      "application",
      "A company is designing its MoC process for the first time. Before applying the workflow, what organization-specific decision must it make?",
      [
        "Which types and levels of changes are covered under its processes.",
        "Whether every change should automatically be treated as a replacement in kind.",
        "Whether employees should be informed only after implementation.",
        "Whether the change should be reviewed only if an incident occurs.",
      ],
      0,
      "Each organization is responsible for determining the types and levels of changes that are covered by its processes. That scope decision is necessary before consistent screening and control can occur.",
    ),
    question(
      "application",
      "A team uses a management-of-change model that plans a change, implements it, evaluates results, and improves the system. Which framework underlies the models described in the chapter?",
      [
        "The hierarchy of controls.",
        "The emergency-management cycle.",
        "The incident-command system.",
        "Deming's Plan-Do-Check-Act model.",
      ],
      3,
      "The chapter says that, regardless of the MoC model used, they are based on Deming's PDCA model: Plan, Do, Check, and Act.",
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
    question(
      "foundation",
      "Which event best fits the chapter's definition of a workplace emergency?",
      [
        "A scheduled annual performance review.",
        "An unplanned event that could threaten the safety, health, or well-being of individuals or an organization.",
        "A routine delivery that arrives at its scheduled time.",
        "A planned equipment inspection with no emergency condition.",
      ],
      1,
      "The chapter defines a workplace emergency as an unplanned or unforeseen event that could threaten the safety, health, or well-being of individuals and organizations.",
    ),
    question(
      "foundation",
      "What is the main purpose of an Emergency Action Plan (EAP)?",
      [
        "Organize management and employee actions during a workplace emergency.",
        "Replace all fire-prevention measures with evacuation drills.",
        "Record only the financial cost of an emergency.",
        "Provide a post-incident disciplinary process.",
      ],
      0,
      "An EAP, sometimes called an Emergency Response Plan, is a pre-prepared plan intended to organize management and employee actions during a workplace emergency.",
    ),
    question(
      "homework-level",
      "Which statement correctly reflects the chapter's requirement for a fire-prevention plan under 29 CFR 1910.39?",
      [
        "It is optional if a facility has portable fire extinguishers.",
        "It may be kept only by the safety manager and withheld from employees.",
        "It must be written, maintained in the workplace, and available to employees for review.",
        "It is required only after a fire has occurred.",
      ],
      2,
      "The chapter states that OSHA requires a fire-prevention plan to be written, maintained in the workplace, and made available to employees for review under 29 CFR 1910.39.",
    ),
    question(
      "application",
      "A manufacturer is building a business-continuity plan following a severe storm. What should be the plan's first analytical step?",
      [
        "Select a spokesperson after the event ends.",
        "Wait for a disruption before identifying what could threaten operations.",
        "Focus only on employee evacuation and omit operational recovery.",
        "Identify potential threats to the organization and develop response steps.",
      ],
      3,
      "Like an EAP, a business-continuity plan begins by identifying potential threats to the organization and then developing steps to respond to them. It addresses continuity and recovery, not only immediate evacuation.",
    ),
    question(
      "application",
      "A cyberattack has significant security, financial, strategic, and reputational consequences for an organization. Which capability is most directly concerned with managing that incident?",
      [
        "Crisis management.",
        "A preoperational forklift inspection.",
        "A job hazard analysis for a lifting task.",
        "An extension-ladder setup calculation.",
      ],
      0,
      "The chapter defines crisis management as the ability of an organization to manage incidents that can have significant security, financial, strategic, or reputational impacts.",
    ),
  ],
};
