export type AuthoredPracticeQuestion = {
  level: "foundation" | "homework-level" | "application";
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

// Independently authored from the supplied 4th-edition reference. The
// question sets are intentionally separate from homework and study items.
export const AUTHORED_PRACTICE_01_13: Readonly<Record<string, readonly AuthoredPracticeQuestion[]>> = {
  "ch-01": [
    {
      level: "foundation",
      stem: "On a four-choice certification-exam item, a candidate can eliminate two clearly wrong options but is unsure between the other two. What is the sound next step?",
      options: [
        "Leave the item blank to avoid losing points.",
        "Select the more plausible remaining option after eliminating the implausible choices.",
        "Assume the item cannot be answered until a later item is solved.",
        "Mark every option that might be correct.",
      ],
      correctIndex: 1,
      explanation: "The book advises intelligent guessing when the answer is uncertain: eliminate choices known to be wrong or less plausible, then choose from those remaining. Wrong answers do not carry a penalty.",
    },
    {
      level: "homework-level",
      stem: "A candidate spends several minutes on the first difficult calculation while many later items are likely straightforward. Which testing strategy best uses the available examination time?",
      options: [
        "Continue until the first item is solved before viewing any later item.",
        "Skip every calculation because calculations consume too much time.",
        "Answer items that can be completed quickly first, then return to marked difficult items.",
        "Submit the examination after completing only the first pass.",
      ],
      correctIndex: 2,
      explanation: "The source recommends building the score efficiently by completing known or quick items first, then returning to difficult or time-consuming marked items.",
    },
    {
      level: "application",
      stem: "What calculator preparation is most consistent with the current test-center conditions described in the reference?",
      options: [
        "Practice with the on-screen TI-30XS-style calculator before the examination.",
        "Bring two personal scientific calculators as backups.",
        "Plan to borrow a calculator from the test center.",
        "Avoid using calculator functions because only handwritten computation is allowed.",
      ],
      correctIndex: 0,
      explanation: "The reference states that the test center provides an on-screen calculator that emulates a TI-30XS, while physical calculators are not permitted. Practicing with that tool prevents avoidable time loss.",
    },
  ],
  "ch-02": [
    {
      level: "foundation",
      stem: "A state legislature passes a workplace-safety reporting statute. What broad type of law is that enactment?",
      options: [
        "Administrative law",
        "Case law",
        "Statutory law",
        "Common-law tort doctrine",
      ],
      correctIndex: 2,
      explanation: "The book distinguishes statutory law as law created by federal or state legislators. Administrative agencies create administrative law, while judicial decisions create case law.",
    },
    {
      level: "homework-level",
      stem: "Two residents of different states dispute a $90,000 injury claim governed by state law. According to the jurisdiction overview, which fact can support federal-court jurisdiction even without a federal question?",
      options: [
        "The plaintiff prefers a federal judge.",
        "The parties are diverse and the amount in controversy exceeds $75,000.",
        "The case concerns a workplace rather than a home.",
        "The defendant has insurance coverage.",
      ],
      correctIndex: 1,
      explanation: "The source identifies a federal question or diversity of parties as routes to federal court; for diversity, it gives an amount-in-controversy threshold greater than $75,000.",
    },
    {
      level: "application",
      stem: "While traveling to meet a client, a sales employee makes a brief lunch detour and injures a pedestrian with the company vehicle. Which doctrine most directly explains why the employer may also face liability?",
      options: [
        "Assumption of risk",
        "Stare decisis",
        "Strict product liability",
        "Vicarious liability",
      ],
      correctIndex: 3,
      explanation: "Vicarious, or imputed, liability can hold an employer responsible for an employee's acts. The chapter specifically discusses a sales representative's slight deviation while traveling to a client.",
    },
  ],
  "ch-03": [
    {
      level: "foundation",
      stem: "A work-related fatality occurs at a manufacturing site. Which reporting deadline does the reference identify for notifying OSHA?",
      options: [
        "Within 8 hours",
        "Within 24 hours",
        "Within 3 calendar days",
        "At the end of the calendar year",
      ],
      correctIndex: 0,
      explanation: "The source states that work-related fatalities must be reported to OSHA within 8 hours. In-patient hospitalization, amputation, and loss of an eye have a separate 24-hour deadline.",
    },
    {
      level: "homework-level",
      stem: "An employee sustains a work-related cut from a sharp object contaminated with another person's blood. How should the employee's identity be handled on the OSHA 300 Log?",
      options: [
        "List the full name and diagnosis in the public annual summary.",
        "Omit the entire incident because it is confidential.",
        "Enter “privacy case” in place of the employee's name while retaining the required record.",
        "Record it only if the employee misses at least one workday.",
      ],
      correctIndex: 2,
      explanation: "The book identifies contaminated-needle and sharp-object injuries as privacy cases. The event is recorded, but “privacy case” replaces the employee's name on the OSHA 300 Log.",
    },
    {
      level: "application",
      stem: "A company is preparing its annual injury-and-illness summary. Which posting schedule follows the reference?",
      options: [
        "Post the OSHA 300A only during the first week of January.",
        "Post it no later than February 1 and keep it posted through April 30.",
        "Post it only after an OSHA inspection.",
        "Post it for five years in the payroll office.",
      ],
      correctIndex: 1,
      explanation: "The chapter states that the certified OSHA 300A annual summary is posted in a conspicuous location no later than February 1 and remains posted until April 30.",
    },
  ],
  "ch-04": [
    {
      level: "foundation",
      stem: "A safety manager cites the OSH Act provision requiring an employer to keep the workplace free from recognized serious hazards when no specific standard applies. Which provision is being used?",
      options: [
        "Section 6(b), the rulemaking clause",
        "Section 11(c), the retaliation clause",
        "29 CFR 1904, the recordkeeping rule",
        "Section 5(a)(1), the General Duty Clause",
      ],
      correctIndex: 3,
      explanation: "The reference identifies Section 5(a)(1) of the OSH Act as the General Duty Clause.",
    },
    {
      level: "homework-level",
      stem: "An employer receives an OSHA citation and corrects the cited condition the next day. What posting rule still applies to the citation?",
      options: [
        "Remove it as soon as the condition is corrected.",
        "Post it conspicuously for 3 days or until abatement, whichever is longer.",
        "Post it only if an employee asks to see it.",
        "Keep it confidential until the contest period expires.",
      ],
      correctIndex: 1,
      explanation: "The book states that an employer must post a received citation in a conspicuous location for 3 days or until the violation is abated, whichever is longer.",
    },
    {
      level: "application",
      stem: "A facility has a written respirable-crystalline-silica exposure-control plan. Which action is required to keep that plan current?",
      options: [
        "Review and evaluate its effectiveness at least annually, then update it as necessary.",
        "Replace it only after a citation is issued.",
        "Archive it after the first employee training session.",
        "Limit it to a list of personal protective equipment.",
      ],
      correctIndex: 0,
      explanation: "The source requires the written silica exposure-control plan to be reviewed and evaluated at least annually and updated when needed.",
    },
  ],
  "ch-05": [
    {
      level: "foundation",
      stem: "A concentration is written as 0.00072. Which scientific-notation form preserves its value?",
      options: [
        "7.2 × 10⁴",
        "7.2 × 10³",
        "7.2 × 10⁻⁴",
        "7.2 × 10⁻⁵",
      ],
      correctIndex: 2,
      explanation: "Moving the decimal four places to the right gives 7.2, so the original small quantity is 7.2 × 10⁻⁴.",
    },
    {
      level: "homework-level",
      stem: "An airflow equation is Q = VA, where Q is volumetric flow and V is air velocity. If Q and V are known, which rearrangement correctly solves for duct area A?",
      options: [
        "A = Q / V",
        "A = V / Q",
        "A = QV",
        "A = Q − V",
      ],
      correctIndex: 0,
      explanation: "Divide both sides of Q = VA by V to isolate area: A = Q/V. Formula transposition is a core purpose of the chapter.",
    },
    {
      level: "application",
      stem: "A diagonal brace spans a rectangular opening that is 9 ft high and 12 ft wide. Ignoring connection offsets, what minimum brace length is required?",
      options: [
        "3 ft",
        "10.5 ft",
        "14 ft",
        "15 ft",
      ],
      correctIndex: 3,
      explanation: "Apply the Pythagorean equation: √(9² + 12²) = √225 = 15 ft.",
    },
  ],
  "ch-06": [
    {
      level: "foundation",
      stem: "Two atoms of the same element have different numbers of neutrons. What property still identifies them as the same element?",
      options: [
        "Their atomic mass is identical.",
        "Their atomic number, or number of protons, is identical.",
        "They have the same number of valence electrons in every state.",
        "They must have the same molecular formula.",
      ],
      correctIndex: 1,
      explanation: "The chapter defines atomic number as the number of protons in the nucleus. Neutron differences produce isotopes, not a different element.",
    },
    {
      level: "homework-level",
      stem: "Which statement correctly distinguishes ionic from covalent bonding?",
      options: [
        "Both require neutrons to be shared.",
        "Ionic bonding occurs only between identical atoms.",
        "Ionic bonding transfers electrons; covalent bonding shares electrons.",
        "Covalent bonding transfers protons between nuclei.",
      ],
      correctIndex: 2,
      explanation: "The reference describes ionic bonding as electron transfer from one atom to another and covalent bonding as electron sharing.",
    },
    {
      level: "application",
      stem: "A fixed amount of gas is at 2 atm and 2 L. At constant temperature, it expands to 4 L. What pressure follows from Boyle's law?",
      options: [
        "1 atm",
        "2 atm",
        "4 atm",
        "8 atm",
      ],
      correctIndex: 0,
      explanation: "At constant temperature, P₁V₁ = P₂V₂. Thus P₂ = (2 atm × 2 L)/4 L = 1 atm.",
    },
  ],
  "ch-07": [
    {
      level: "foundation",
      stem: "A risk assessment considers both a solvent's ability to harm and the realistic worker exposure during a task. Which statement correctly separates hazard from risk?",
      options: [
        "Hazard is the final numerical probability, while risk is only a descriptive label.",
        "Risk exists only after a worker has developed illness.",
        "Risk is the chemical's inherent ability to harm an organism.",
        "Hazard is the potential for harm, while risk is a quantitative measurement or estimate of that hazard.",
      ],
      correctIndex: 3,
      explanation: "The book defines hazard as the potential for a substance to cause harm and risk as a quantitative measurement or estimate of a hazard. Exposure information is essential to a meaningful workplace-risk assessment.",
    },
    {
      level: "homework-level",
      stem: "Researchers classify workers by whether they were exposed to a process chemical and then follow them to compare disease occurrence. What study design is this?",
      options: [
        "Cross-sectional study",
        "Cohort study",
        "Case-control study",
        "Ames test",
      ],
      correctIndex: 1,
      explanation: "A cohort study follows groups defined by exposure status to compare later outcomes. The chapter contrasts it with case-control and cross-sectional approaches.",
    },
    {
      level: "application",
      stem: "Before investing in a more extensive toxicology program, a laboratory needs a screening test for whether a new chemical can cause mutations. Which test is most appropriate?",
      options: [
        "An audiogram",
        "A spirometry test",
        "An Ames test",
        "A time-weighted-average calculation",
      ],
      correctIndex: 2,
      explanation: "The chapter identifies Ames testing as a procedure used to determine whether a chemical is a mutagen.",
    },
  ],
  "ch-08": [
    {
      level: "foundation",
      stem: "An industrial hygienist attaches a calibrated sampler to a worker for the worker's normal full-shift duties. What sampling approach is being used?",
      options: [
        "Personal sampling",
        "Area sampling",
        "Grab sampling",
        "Blank sampling",
      ],
      correctIndex: 0,
      explanation: "Personal sampling places the air sampler on the employee during normal work. Area sampling uses a stationary device.",
    },
    {
      level: "homework-level",
      stem: "A pump is calibrated at 2.00 L/min before sampling and 2.12 L/min afterward. What should be done with the sample under the source's flow-rate criterion?",
      options: [
        "Accept it because any post-calibration change is normal.",
        "Correct the result by subtracting 0.12 L/min.",
        "Use it only as an area sample.",
        "Discard it because the post-sampling flow differs by more than ±5%.",
      ],
      correctIndex: 3,
      explanation: "The change is 6%. The chapter requires discarding samples when the post-sampling flow rate lies outside ±5% of the pre-sampling rate.",
    },
    {
      level: "application",
      stem: "A survey targets an airborne organic solvent vapor for laboratory analysis. Which collection medium is the source's primary match for gases and vapors?",
      options: [
        "A particulate filter cassette",
        "A sorbent tube",
        "A bare microscope slide",
        "A wet-bulb thermometer",
      ],
      correctIndex: 1,
      explanation: "The book identifies filter media primarily for particulates and sorbent tubes for sampling gases and vapors.",
    },
  ],
  "ch-09": [
    {
      level: "foundation",
      stem: "A bench operation releases a contaminant at one predictable point. Which ventilation approach best targets the contaminant before it disperses into the workroom?",
      options: [
        "Natural ventilation only",
        "General dilution ventilation only",
        "Local exhaust ventilation",
        "Respiratory protection as the sole permanent control",
      ],
      correctIndex: 2,
      explanation: "The source describes local ventilation as a way to remove contaminants at the source before they enter the workplace.",
    },
    {
      level: "homework-level",
      stem: "A plain round hood opening is 12 inches in diameter. According to the chapter's stated limitation, up to what distance is its capture-velocity equation intended to be accurate?",
      options: [
        "6 inches",
        "18 inches",
        "24 inches",
        "36 inches",
      ],
      correctIndex: 1,
      explanation: "The equation is accurate for a limited distance of 1.5 times the duct diameter or side length. For 12 inches, 1.5 × 12 = 18 inches.",
    },
    {
      level: "application",
      stem: "A technician compares static-pressure readings on an exhaust fan. Which pattern is expected by the reference?",
      options: [
        "Both sides of the fan are negative.",
        "Both sides of the fan are positive.",
        "The upstream side is positive and the downstream side is negative.",
        "The upstream side is negative and the downstream side is positive.",
      ],
      correctIndex: 3,
      explanation: "The book states that static pressure is negative upstream of the fan and positive downstream of it.",
    },
  ],
  "ch-10": [
    {
      level: "foundation",
      stem: "A worker's measured occupational noise exposure is 85 dBA. What hearing-conservation-program decision follows from the reference?",
      options: [
        "Include the worker in the program because exposure at or above 85 dBA meets the criterion.",
        "Exclude the worker unless exposure reaches 90 dBA.",
        "Wait until an audiogram shows hearing loss.",
        "Include the worker only if the job involves impulse noise.",
      ],
      correctIndex: 0,
      explanation: "The source states that employees with occupational exposure equal to or exceeding 85 dBA, or a 50% dose, must be included in the hearing conservation program.",
    },
    {
      level: "homework-level",
      stem: "Compared with baseline, a worker's hearing thresholds change by 13 dB at 2,000 Hz, 7 dB at 3,000 Hz, and 10 dB at 4,000 Hz in one ear. How should this be classified under the chapter's STS definition?",
      options: [
        "Not an STS because one frequency changed by less than 10 dB.",
        "Not an STS because the total change is less than 40 dB.",
        "An STS because the three-frequency average change is 10 dB.",
        "An STS only if both ears change by 10 dB.",
      ],
      correctIndex: 2,
      explanation: "The average change is (13 + 7 + 10)/3 = 10 dB. The source defines an STS as an average shift of 10 dB or more at 2,000, 3,000, and 4,000 Hz in either ear.",
    },
    {
      level: "application",
      stem: "Which instrument specification meets the chapter's minimum standard for determining employee noise exposure?",
      options: [
        "A Type 0 sound-level meter with ±5 dB accuracy",
        "A Type 2 sound-level meter with ±1 dB accuracy",
        "A smartphone microphone without field verification",
        "An octave-band analyzer used only to estimate total dose",
      ],
      correctIndex: 1,
      explanation: "The reference identifies a Type 2 sound-level meter as the minimum standard for determining employee exposure and gives its accuracy as ±1 dB.",
    },
  ],
  "ch-11": [
    {
      level: "foundation",
      stem: "A worker handles goat hair, wool, and hides and is being evaluated for an occupational biological hazard. Which etiological agent is specifically associated with anthrax in the chapter?",
      options: [
        "Y. pestis",
        "B. anthracis",
        "M. tuberculosis",
        "C. tetani",
      ],
      correctIndex: 1,
      explanation: "The book identifies B. anthracis as the etiological agent for anthrax and notes the occupational relevance of handling animal materials such as goat hair, wool, and hides.",
    },
    {
      level: "homework-level",
      stem: "A laboratory works with agents that may be transmitted by the respiratory route and can cause serious, potentially lethal infection. Which biosafety level is described for that work?",
      options: [
        "Biosafety Level I",
        "Biosafety Level II",
        "Biosafety Level IV only",
        "Biosafety Level III",
      ],
      correctIndex: 3,
      explanation: "The source describes Biosafety Level III for indigenous or exotic agents with potential respiratory transmission that may cause serious and potentially lethal infection, with controlled access and biological safety cabinets or enclosed equipment.",
    },
    {
      level: "application",
      stem: "A new biological-safety program funds only laboratory training and PPE. What additional control category must be included for the program to reflect the chapter's three primary preventive measures?",
      options: [
        "Facility construction and design",
        "Financial loss reserves",
        "Personal fitness testing only",
        "Noise exposure monitoring",
      ],
      correctIndex: 0,
      explanation: "The chapter groups primary biological-safety prevention into laboratory practices and techniques, safety equipment, and facility construction and design.",
    },
  ],
  "ch-12": [
    {
      level: "foundation",
      stem: "A worker standing near a hot furnace becomes warmer without touching the furnace or receiving a stream of hot air. Which heat-transfer mechanism is primarily involved?",
      options: [
        "Conduction",
        "Convection",
        "Radiation",
        "Evaporation",
      ],
      correctIndex: 2,
      explanation: "Radiation transfers thermal energy between bodies without direct contact. Conduction requires contact, while convection involves movement of a heated liquid or air.",
    },
    {
      level: "homework-level",
      stem: "A fire starts in a commercial deep fryer containing cooking oil. Which NFPA fire classification applies?",
      options: [
        "Class K",
        "Class A",
        "Class C",
        "Class D",
      ],
      correctIndex: 0,
      explanation: "The source identifies NFPA fire classifications A, B, C, D, and K. Class K applies to cooking-media fires such as commercial cooking oils and fats.",
    },
    {
      level: "application",
      stem: "A vapor concentration is measured below the substance's lower flammability limit. Which conclusion is supported?",
      options: [
        "The mixture is too rich to burn.",
        "The mixture is too lean to be flammable under the stated conditions.",
        "The mixture will ignite without an ignition source.",
        "The mixture is necessarily above its upper flammability limit.",
      ],
      correctIndex: 1,
      explanation: "The chapter defines the LFL or LEL as the leanest mixture that is still flammable or explosive. Below that concentration, the mixture is too lean to propagate flame.",
    },
  ],
  "ch-13": [
    {
      level: "foundation",
      stem: "A worker receives heat from molten metal across open space without direct contact. Which source of body heat is involved?",
      options: [
        "Metabolic heat",
        "Convection",
        "Conduction",
        "Radiation",
      ],
      correctIndex: 3,
      explanation: "Radiant heat is thermal radiation between objects and does not require direct contact. The chapter lists radiation, convection, conduction, and metabolism as sources of heat.",
    },
    {
      level: "homework-level",
      stem: "For indoor work with no solar load, which expression is the chapter's WBGT equation?",
      options: [
        "WBGT = 0.7 WB + 0.2 GT + 0.1 DB",
        "WBGT = 0.7 WB + 0.3 GT",
        "WBGT = WB + GT + DB",
        "WBGT = 0.3 WB + 0.7 DB",
      ],
      correctIndex: 1,
      explanation: "For indoor conditions without solar load, the reference gives WBGT = 0.7 WB + 0.3 GT. The outdoor solar-load equation also includes globe and dry-bulb weighting.",
    },
    {
      level: "application",
      stem: "Which group of measures best reflects the chapter's stated approach to preventing heat-related injuries?",
      options: [
        "A single annual medical exam and no exposure controls",
        "Only insulated clothing, regardless of the task",
        "Physical conditioning, fluid replacement, training, and an appropriate work/rest cycle",
        "Waiting for a heat illness before changing the job",
      ],
      correctIndex: 2,
      explanation: "The chapter identifies physical conditioning, fluid replacement, training, and adherence to a work/rest cycle as measures that prevent heat-related injuries.",
    },
  ],
};
