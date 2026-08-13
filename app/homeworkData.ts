/**
 * Original, paraphrased study items derived from the concepts covered by the
 * chapter-homework PDFs supplied by the learner. The wording and scenarios are
 * new; page references identify the source concept, not copied question text.
 */

export type HomeworkDifficulty = "foundation" | "applied" | "exam";
export type ChapterStatus = "ready" | "coming-later";
export type OptionIndex = 0 | 1 | 2 | 3;
export type TextTuple4 = readonly [string, string, string, string];

export type HomeworkChapter = {
  id: string;
  courseNumber: number;
  courseTitle: string;
  yatesChapterNumber: number;
  yatesChapterTitle: string;
  sourcePdf: string | null;
  sourcePages: readonly number[];
  status: ChapterStatus;
  homeworkCount: number;
  reviewCount: number;
};

export type HomeworkQuestion = {
  id: string;
  chapterId: string;
  sourcePage: number;
  stem: string;
  options: TextTuple4;
  correctIndex: OptionIndex;
  rationale: string;
  wrongRationales: TextTuple4;
  tags: readonly string[];
  difficulty: HomeworkDifficulty;
  sourceQuestionId?: string;
};

type ChapterDefinition = Omit<HomeworkChapter, "homeworkCount" | "reviewCount">;

const READY_CHAPTERS: readonly ChapterDefinition[] = [
  { id: "ch-02", courseNumber: 2, courseTitle: "Legal Aspects", yatesChapterNumber: 2, yatesChapterTitle: "Regulations", sourcePdf: "Ch-2 & Ch-04 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7], status: "ready" },
  { id: "ch-03", courseNumber: 3, courseTitle: "Recordkeeping", yatesChapterNumber: 2, yatesChapterTitle: "Regulations", sourcePdf: "Ch-03 & Ch-23 Homework Answers.pdf", sourcePages: [2, 3], status: "ready" },
  { id: "ch-04", courseNumber: 4, courseTitle: "OSHA Regulations", yatesChapterNumber: 2, yatesChapterTitle: "Regulations", sourcePdf: "Ch-2 & Ch-04 Homework Answers.pdf", sourcePages: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], status: "ready" },
  { id: "ch-05", courseNumber: 5, courseTitle: "Math Review", yatesChapterNumber: 3, yatesChapterTitle: "Math Review", sourcePdf: "Ch-05 Homework Answers.pdf", sourcePages: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], status: "ready" },
  { id: "ch-06", courseNumber: 6, courseTitle: "Particles and Gases", yatesChapterNumber: 4, yatesChapterTitle: "Particulates and Gases", sourcePdf: "Ch-06 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10], status: "ready" },
  { id: "ch-07", courseNumber: 7, courseTitle: "Toxicology", yatesChapterNumber: 5, yatesChapterTitle: "Toxicology", sourcePdf: "Ch-07 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8], status: "ready" },
  { id: "ch-10", courseNumber: 10, courseTitle: "Noise", yatesChapterNumber: 8, yatesChapterTitle: "Noise and OSHA's Hearing Conservation Program", sourcePdf: "Ch-10 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
  { id: "ch-11", courseNumber: 11, courseTitle: "Biological Hazards", yatesChapterNumber: 9, yatesChapterTitle: "Biological Hazards", sourcePdf: "Ch-11 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
  { id: "ch-12", courseNumber: 12, courseTitle: "Fire Prevention and Protection", yatesChapterNumber: 10, yatesChapterTitle: "Fire Protection and Prevention", sourcePdf: "Ch-12 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
  { id: "ch-13", courseNumber: 13, courseTitle: "Thermal Stressors", yatesChapterNumber: 11, yatesChapterTitle: "Thermal Stressors", sourcePdf: "Ch-13 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
  { id: "ch-15", courseNumber: 15, courseTitle: "Statistics for Safety Professionals", yatesChapterNumber: 13, yatesChapterTitle: "Statistics for the Safety Professional", sourcePdf: "Ch-15 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], status: "ready" },
  { id: "ch-16", courseNumber: 16, courseTitle: "Electrical Safety", yatesChapterNumber: 14, yatesChapterTitle: "Electrical Safety", sourcePdf: "Ch-16 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
  { id: "ch-17", courseNumber: 17, courseTitle: "Mechanics", yatesChapterNumber: 15, yatesChapterTitle: "Mechanics", sourcePdf: "Ch-17&18 Homework Answers.pdf", sourcePages: [2, 3, 5, 6, 7, 9, 10, 11], status: "ready" },
  { id: "ch-18", courseNumber: 18, courseTitle: "Hydraulics", yatesChapterNumber: 16, yatesChapterTitle: "Hydrostatics and Hydraulics", sourcePdf: "Ch-17&18 Homework Answers.pdf", sourcePages: [4, 8, 12], status: "ready" },
  { id: "ch-19", courseNumber: 19, courseTitle: "Safety Training", yatesChapterNumber: 17, yatesChapterTitle: "Training", sourcePdf: "Ch-19 Homework Answers.pdf", sourcePages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
  { id: "ch-23", courseNumber: 23, courseTitle: "Workers' Compensation", yatesChapterNumber: 21, yatesChapterTitle: "Workers' Compensation", sourcePdf: "Ch-03 & Ch-23 Homework Answers.pdf", sourcePages: [4, 5, 6, 7, 8, 9, 10, 11], status: "ready" },
] as const;

const COMING_LATER_CHAPTERS: readonly ChapterDefinition[] = [
  [1, "The Safety Profession and Exam Preparation", 1, "The Safety Profession and Preparing for the ASP/CSP Exam"],
  [8, "Industrial Hygiene Air Sampling", 6, "Industrial Hygiene Air Sampling"],
  [9, "Ventilation", 7, "Ventilation"],
  [14, "Personal Protective Equipment", 12, "Personal Protective Equipment"],
  [20, "Engineering Economics", 18, "Engineering Economics"],
  [21, "Management Theories", 19, "Management Theories"],
  [22, "Accident Causation and Investigation", 20, "Accident Causation and Investigation Techniques"],
  [24, "Ergonomics", 22, "Ergonomics"],
  [25, "Construction Safety", 23, "Construction Safety"],
  [26, "Risk Assessment and Management", 24, "Risk Assessment and Management"],
  [27, "Hazardous Materials Management", 25, "Hazardous Materials Management"],
  [28, "Radiation Safety", 26, "Radiation Safety"],
  [29, "Walking and Working Surfaces", 27, "Walking and Working Surfaces"],
  [30, "Materials Handling and Storage", 28, "Materials Handling and Storage"],
  [31, "Safety Management Systems", 29, "Safety Management System"],
  [32, "Site Security", 30, "Site Security"],
  [33, "Behavior-Based Safety", 31, "Behavior-Based Safety"],
  [34, "Measuring Health and Safety Performance", 32, "Measuring Health and Safety Performance"],
  [35, "Safety Program Auditing", 33, "Safety Program Auditing Techniques and Checklist"],
  [36, "Environmental Management", 34, "Environmental Management"],
  [37, "BCSP Code of Ethics", 35, "BCSP Code of Ethics"],
].map(([courseNumber, courseTitle, yatesChapterNumber, yatesChapterTitle]) => ({
  id: `ch-${String(courseNumber).padStart(2, "0")}`,
  courseNumber: courseNumber as number,
  courseTitle: courseTitle as string,
  yatesChapterNumber: yatesChapterNumber as number,
  yatesChapterTitle: yatesChapterTitle as string,
  sourcePdf: null,
  sourcePages: [],
  status: "coming-later" as const,
}));

function makeQuestion(
  id: string,
  chapterId: string,
  sourcePage: number,
  stem: string,
  options: TextTuple4,
  correctIndex: OptionIndex,
  rationale: string,
  tags: readonly string[],
  difficulty: HomeworkDifficulty,
  sourceQuestionId?: string,
): HomeworkQuestion {
  // Rotate each authored option set by a stable ID-derived offset so answer
  // positions are balanced without introducing runtime randomness.
  const rotation = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4;
  const rotatedOptions = [
    options[(4 - rotation) % 4],
    options[(5 - rotation) % 4],
    options[(6 - rotation) % 4],
    options[(7 - rotation) % 4],
  ] as TextTuple4;
  const rotatedCorrectIndex = ((correctIndex + rotation) % 4) as OptionIndex;
  const feedback = (index: OptionIndex): string => index === rotatedCorrectIndex
    ? `Correct: ${rationale}`
    : `Incorrect: "${rotatedOptions[index]}" does not fit the controlling facts. ${rationale}`;

  return {
    id,
    chapterId,
    sourcePage,
    stem,
    options: rotatedOptions,
    correctIndex: rotatedCorrectIndex,
    rationale,
    wrongRationales: [feedback(0), feedback(1), feedback(2), feedback(3)],
    tags,
    difficulty,
    ...(sourceQuestionId ? { sourceQuestionId } : {}),
  };
}

const q = makeQuestion;

const CH02_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH02-01", "ch-02", 2, "A fabrication company is planning a new process. Which action best reflects the employer's core legal duty to workers?", ["Charge workers for replacement PPE", "Provide a workplace reasonably free from recognized serious hazards", "Require one employee to perform every high-risk task alone", "Buy insurance instead of correcting hazards"], 1, "An employer's central duty is to provide safe work and address recognized hazards; insurance and cost shifting do not replace prevention.", ["employer-duty", "recognized-hazards"], "foundation"),
  q("HW-CH02-02", "ch-02", 3, "Which item completes the common four-part list of civil liability theories: intent, recklessness, negligence, and ____?", ["Strict liability", "Poor supervision", "Ignorance", "Criminal prosecution"], 0, "Strict liability can impose civil responsibility without proof of negligent conduct when its legal elements are met.", ["liability", "strict-liability"], "foundation"),
  q("HW-CH02-03", "ch-02", 4, "Which dispute is ordinarily a contract claim rather than a tort?", ["An intentional harmful touching", "A threat that creates reasonable fear of immediate harm", "Failure to use reasonable care", "Failure to deliver services promised in a signed agreement"], 3, "A failure to perform a contractual promise is generally a breach-of-contract issue; battery, assault, and negligence are tort concepts.", ["tort", "contract"], "applied"),
  q("HW-CH02-04", "ch-02", 5, "A safety manager is sorting organizational legal exposure into its broadest conventional categories. Which grouping is most appropriate?", ["Contracts, torts, and criminal law", "Reputation, insurance, and arbitration", "Intent, discovery, and damages", "Negligence, productivity, and ethics"], 0, "Business legal exposure is commonly organized around contractual liability, civil wrongs (torts), and criminal liability.", ["legal-categories", "liability"], "foundation"),
  q("HW-CH02-05", "ch-02", 6, "In an ordinary civil product-injury case, which filing normally begins the lawsuit?", ["A discovery request", "A complaint", "A trial verdict", "A settlement agreement"], 1, "The plaintiff initiates the civil action by filing a complaint; discovery, trial, and settlement occur later if the case proceeds.", ["civil-procedure", "product-liability"], "foundation"),
  q("HW-CH02-06", "ch-02", 7, "A power tool reaches the user with a manufacturing defect and causes injury during foreseeable use. Which theory may permit recovery without proving that the manufacturer acted negligently?", ["Strict product liability", "Workers' compensation exclusivity", "Criminal intent", "Assumption that every warning eliminates liability"], 0, "Strict product liability focuses on a qualifying product defect and resulting harm, rather than requiring proof of the manufacturer's negligence.", ["product-liability", "defects"], "applied"),
];

const CH03_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH03-01", "ch-03", 2, "A site recorded 7 cases involving days away from work during 130,000 employee-hours. What is its days-away case incidence rate per 200,000 hours?", ["6.15", "10.77", "13.85", "16.92"], 1, "The rate is (7 x 200,000) / 130,000 = 10.77 cases per 200,000 hours.", ["recordkeeping", "incidence-rate", "calculation"], "applied"),
  q("HW-CH03-02", "ch-03", 3, "A company logged 5 OSHA-recordable cases across 425,500 work hours. What is the total recordable incident rate?", ["1.18", "2.35", "5.25", "10.63"], 1, "TRIR = (5 x 200,000) / 425,500 = 2.35, rounded to two decimal places.", ["recordkeeping", "trir", "calculation"], "applied"),
];

const CH04_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH04-01", "ch-04", 8, "Under OSHA's bloodborne-pathogens requirements, what must an employer do for an employee with occupational exposure to blood?", ["Require the employee to accept every vaccine", "Offer the hepatitis B vaccination series at no cost after required training", "Offer only a tetanus booster", "Wait until an exposure incident occurs"], 1, "The employer must make hepatitis B vaccination available at no cost to an occupationally exposed employee; the employee may decline after being informed.", ["bloodborne-pathogens", "hepatitis-b", "vaccination"], "applied"),
  q("HW-CH04-02", "ch-04", 9, "What is the essential first field step when establishing a permit-required confined-space program?", ["Buy retrieval equipment for every room", "Survey the workplace and identify confined spaces", "Issue entry permits before identifying hazards", "Review only the previous year's injury log"], 1, "The employer must first identify confined spaces and evaluate them so permit-required spaces and their hazards can be determined.", ["confined-space", "hazard-identification"], "foundation"),
  q("HW-CH04-03", "ch-04", 10, "Which activity is specifically required as part of an energy-control program for lockout/tagout?", ["Periodic inspection of each energy-control procedure", "A process hazard analysis for every machine", "A management-of-change study before each lockout", "Replacement of all locks every year"], 0, "The energy-control standard requires periodic inspection of the procedure, generally at least annually, to correct deviations and verify employee responsibilities.", ["lockout-tagout", "periodic-inspection"], "applied"),
  q("HW-CH04-04", "ch-04", 11, "A platform guardrail protects employees from a fall, while tools could fall onto workers below. Which combination addresses both hazards?", ["Top edge and midrail only", "Toe board only", "Top edge, midrail or equivalent protection, plus falling-object protection such as a toe board", "A warning sign without a physical barrier"], 2, "The guardrail prevents the employee fall, and a toe board or equivalent is added where falling objects could strike people below.", ["fall-protection", "guardrails", "falling-objects"], "applied"),
  q("HW-CH04-05", "ch-04", 12, "An OSHA rule written specifically for shipyards is best described as what type of standard?", ["Horizontal", "Vertical", "Consensus-only", "Performance-measurement"], 1, "A vertical standard is directed to a particular industry, whereas a horizontal standard applies across industries.", ["osha-standards", "vertical-standard"], "foundation"),
  q("HW-CH04-06", "ch-04", 13, "Which statement is NOT an employee right under the OSH Act framework?", ["Request an OSHA inspection when qualifying hazards are believed to exist", "Review certain exposure and injury records", "Participate through authorized representatives during an inspection", "Personally set the final text of an OSHA standard"], 3, "Employees have participation, complaint, and information rights, but no individual employee has authority to dictate the final regulatory text.", ["employee-rights", "osha"], "applied"),
  q("HW-CH04-07", "ch-04", 14, "Before servicing a machine, which energy must the authorized employee control?", ["Only electrical energy", "Only energy that is currently moving", "Every hazardous energy source, including stored and residual energy", "Only hydraulic and pneumatic energy"], 2, "Lockout/tagout requires isolation and control of all hazardous energy forms, including electrical, mechanical, hydraulic, pneumatic, chemical, thermal, stored, and residual energy.", ["lockout-tagout", "hazardous-energy"], "foundation"),
  q("HW-CH04-08", "ch-04", 15, "Which pair correctly describes the broad categories of fall protection?", ["Active and passive", "Retractable and fixed", "Net and lanyard", "Positioning and warning"], 0, "Active systems require worker participation, such as a personal fall-arrest system; passive systems protect without that action, such as guardrails.", ["fall-protection", "hierarchy"], "foundation"),
  q("HW-CH04-09", "ch-04", 16, "For a chemical placed into commerce, who generally performs the initial hazard classification required for the safety data sheet and label?", ["The exposed employee", "The chemical manufacturer or importer", "The receiving site's safety committee only", "The equipment vendor"], 1, "Hazard Communication places initial classification duties on chemical manufacturers and importers; downstream employers then maintain and communicate the information.", ["hazcom", "hazard-classification", "sds"], "applied"),
  q("HW-CH04-10", "ch-04", 17, "Employees believe an OSHA citation allows too much time to correct a hazard. Which statement best describes their role?", ["They may use the employee-contest process to challenge the reasonableness of the abatement date", "They alone select the replacement abatement date", "They have no connection to an abatement date", "They must negotiate the date directly with the employer"], 0, "Affected employees or their representatives may contest the reasonableness of the abatement period through the prescribed process; they do not unilaterally set the date.", ["osha-citation", "abatement", "employee-rights"], "exam"),
];

const CH05_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH05-01", "ch-05", 3, "Air moves at 2,500 ft/min through a round duct 18 inches in diameter. Approximately what is the volumetric flow?", ["2,210 cfm", "4,420 cfm", "35,300 cfm", "63,600 cfm"], 1, "The radius is 0.75 ft, so area = pi(0.75)^2 = 1.767 ft2 and Q = VA = 2,500 x 1.767 = about 4,420 cfm.", ["airflow", "circle-area", "calculation"], "applied"),
  q("HW-CH05-02", "ch-05", 4, "Evaluate 3 + 4(2 + 6 / 3)^2 using the standard order of operations.", ["35", "67", "83", "147"], 1, "Divide first: 6/3 = 2. Then (2+2)^2 = 16; 4 x 16 = 64; and 64 + 3 = 67.", ["pemdas", "calculation"], "foundation"),
  q("HW-CH05-03", "ch-05", 5, "A quantity of 1,000 grows by 4.3% annually for three years. What is 1,000(1.043)^3, rounded to the nearest whole number?", ["1,043", "1,129", "1,135", "1,430"], 2, "Compound growth gives 1,000 x 1.043^3 = 1,134.7, which rounds to 1,135.", ["exponents", "compound-growth", "calculation"], "applied"),
  q("HW-CH05-04", "ch-05", 6, "What is the value of 5^3?", ["15", "25", "125", "625"], 2, "An exponent of 3 means 5 x 5 x 5, which equals 125.", ["exponents", "calculation"], "foundation"),
  q("HW-CH05-05", "ch-05", 7, "Solve 60 = 4x for x.", ["2.95", "15", "19.1", "240"], 1, "Divide both sides by 4: x = 60/4 = 15.", ["algebra", "transposition"], "foundation"),
  q("HW-CH05-06", "ch-05", 8, "Two vertical tanks, each 8 ft in diameter, stand inside a circular dike 20 ft in diameter. The dike must hold 110% of one 4,000-gallon tank. Ignoring wall thickness, what minimum dike height is required?", ["18 inches", "24 inches", "30 inches", "33 inches"], 3, "Required volume is 4,400 gal = 588.2 ft3. Active floor area is pi(10^2) - 2pi(4^2) = 213.6 ft2. Height = 588.2/213.6 = 2.754 ft, or about 33.0 inches. This corrects the source-era worksheet's 32-inch rounding.", ["secondary-containment", "geometry", "unit-conversion"], "exam"),
];

const CH06_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH06-01", "ch-06", 2, "Which exposure metric averages airborne concentration across the duration of a work shift?", ["Ceiling limit", "Time-weighted average", "Lower flammable limit", "Immediately dangerous to life or health value"], 1, "A time-weighted average weights each measured concentration by its exposure duration and divides by the total averaging time.", ["twa", "exposure-limits"], "foundation"),
  q("HW-CH06-02", "ch-06", 3, "A mixture contains 100 mL of hydrogen in a total volume of 1.00 m3. What is the hydrogen concentration by volume?", ["1 ppm", "10 ppm", "100 ppm", "1,000 ppm"], 2, "One cubic meter is 1,000,000 mL, so the fraction is 100/1,000,000; multiplying by 10^6 gives 100 ppm.", ["ppm", "volume-concentration", "calculation"], "applied"),
  q("HW-CH06-03", "ch-06", 4, "At about 25 degrees C and 1 atm, a benzene result is 223 mg/m3. Using molecular weight 78.11 and ppm = mg/m3 x 24.45 / MW, what is the result?", ["50 ppm", "70 ppm", "90 ppm", "110 ppm"], 1, "The conversion is 223 x 24.45 / 78.11 = 69.8 ppm, which rounds to 70 ppm under the stated conditions.", ["mg-m3", "ppm", "gas-conversion"], "applied"),
  q("HW-CH06-04", "ch-06", 5, "A worker is exposed to 22 ppm for 2.5 h, 12 ppm for 2 h, and 2 ppm for 3.5 h. What is the 8-hour TWA?", ["10.75 ppm", "12.0 ppm", "17.0 ppm", "22.0 ppm"], 0, "The concentration-time sum is (22 x 2.5) + (12 x 2) + (2 x 3.5) = 86 ppm-hours; 86/8 = 10.75 ppm.", ["twa", "calculation", "sampling"], "applied"),
  q("HW-CH06-05", "ch-06", 6, "OSHA's 8-hour airborne limit for asbestos is expressed as what type of occupational exposure limit?", ["STEL only", "Permissible exposure limit", "Recommended exposure limit", "Lower explosive limit"], 1, "An enforceable OSHA 8-hour limit is a permissible exposure limit (PEL); a STEL covers a shorter averaging period and a REL is a NIOSH recommendation.", ["asbestos", "pel", "exposure-limits"], "foundation"),
  q("HW-CH06-06", "ch-06", 7, "A 4.0-ft3 gas cylinder drops by 15 psi while its temperature remains stable. Approximately what free-gas volume is released at 14.7 psia?", ["0.04 ft3", "0.41 ft3", "4.1 ft3", "41 ft3"], 2, "For the released increment, P1V1 = P2V2 gives V2 = (15 psi x 4.0 ft3)/14.7 psi = about 4.1 ft3. Consistent pressure bases are essential.", ["boyles-law", "compressed-gas", "calculation"], "exam"),
  q("HW-CH06-07", "ch-06", 8, "Dust samples cover 120 min at 12.05 mg/m3, 240 min at 5.65 mg/m3, and 120 min at 18.40 mg/m3. Compared with a stated 15 mg/m3 8-hour limit, what is the correct conclusion?", ["The TWA is about 10.44 mg/m3, so it is below the stated limit", "The TWA is 36.10 mg/m3 and exceeds the limit", "Only the highest reading may be used", "A TWA cannot be calculated from segment data"], 0, "The 480-minute TWA is [(12.05 x 120) + (5.65 x 240) + (18.40 x 120)]/480 = 10.44 mg/m3, below the stated 15 mg/m3 comparison value.", ["dust", "twa", "limit-comparison"], "exam"),
];

const CH07_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH07-01", "ch-07", 2, "Which description best characterizes an acute toxic exposure?", ["Repeated low doses accumulated over decades", "A dose absorbed over a short period with effects that may appear rapidly", "Any exposure to a carcinogen", "A low dose that can never cause symptoms"], 1, "Acute exposure refers to a relatively short exposure period; acute effects often develop promptly, although timing depends on the toxicant and dose.", ["acute-exposure", "dose-response"], "foundation"),
  q("HW-CH07-02", "ch-07", 3, "Which co-exposure is the classic example of a synergistic increase in lung-cancer risk among asbestos-exposed workers?", ["Drinking water", "Tobacco smoke", "Low humidity", "Visible nuisance dust"], 1, "Asbestos exposure and cigarette smoking interact to produce a lung-cancer risk greater than would be expected from simply adding their separate risks.", ["synergism", "asbestos", "smoking"], "foundation"),
  q("HW-CH07-03", "ch-07", 4, "Which exposure is least associated with classic metal fume fever?", ["Fresh zinc oxide fume", "Magnesium oxide fume", "Fume from welding galvanized metal", "Thorium oxide dust"], 3, "Metal fume fever is classically linked to freshly formed metal oxides, especially zinc oxide; thorium oxide is not a classic cause.", ["metal-fume-fever", "toxicants"], "applied"),
  q("HW-CH07-04", "ch-07", 5, "What is the interval between a causal exposure and the first detectable manifestation of disease called?", ["Latency period", "Etiologic dose", "Metastatic interval", "Clearance half-life"], 0, "Latency is the elapsed time between exposure or disease initiation and the appearance or detection of the resulting condition.", ["latency", "occupational-disease"], "foundation"),
  q("HW-CH07-05", "ch-07", 6, "Chemical A has no toxic effect on an organ at the dose present, but it greatly increases Chemical B's toxicity. What interaction is this?", ["Antagonism", "Additivity", "Potentiation", "Independent action"], 2, "Potentiation occurs when a substance without the relevant toxic effect increases the toxicity of another substance.", ["potentiation", "chemical-interactions"], "applied"),
  q("HW-CH07-06", "ch-07", 7, "Which organ system commonly shows an early chronic effect from occupational cadmium exposure?", ["Kidneys, particularly renal tubules", "Middle-ear ossicles", "Lens of the eye only", "Appendix"], 0, "Chronic cadmium exposure is strongly associated with renal tubular injury and impaired kidney function.", ["cadmium", "target-organ", "kidney"], "foundation"),
  q("HW-CH07-07", "ch-07", 8, "A substance has an oral LD50 of 15 mg/kg in rats. What administered dose corresponds to that LD50 for a 2.0-kg rat?", ["7.5 mg", "15 mg", "30 mg", "30 kg"], 2, "Dose equals 15 mg/kg x 2.0 kg = 30 mg. LD50 is a population statistic, not a prediction that a particular animal will die.", ["ld50", "dose", "calculation"], "applied"),
];

const CH10_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH10-01", "ch-10", 2, "Which instrument is least likely to be the primary tool for a routine occupational-noise survey?", ["Integrating sound level meter", "Personal noise dosimeter", "Octave-band analyzer", "General-purpose oscilloscope"], 3, "Sound level meters, dosimeters, and frequency analyzers are standard industrial-hygiene tools; an oscilloscope is not normally the primary instrument for routine workplace-noise exposure assessment.", ["noise-instruments", "measurement"], "foundation"),
  q("HW-CH10-02", "ch-10", 3, "What information does an octave-band analyzer add to an overall sound-level reading?", ["The distribution of sound energy by frequency band", "The worker's blood pressure", "The sound source's electrical resistance", "The exact future hearing threshold shift"], 0, "Octave-band analysis separates sound into frequency ranges, which helps identify dominant frequencies and select engineering controls.", ["octave-band", "frequency"], "foundation"),
  q("HW-CH10-03", "ch-10", 4, "Long-term excessive workplace noise most commonly produces which type of hearing loss?", ["Conductive loss from blocked transmission", "Sensorineural loss involving the inner ear", "Presbycusis caused only by aging", "A temporary outer-ear deformity"], 1, "Occupational noise-induced hearing loss is generally sensorineural because excessive sound damages cochlear sensory structures.", ["hearing-loss", "sensorineural"], "foundation"),
  q("HW-CH10-04", "ch-10", 5, "A delivery driver moves among changing noise sources throughout a 10-hour route. Which instrument best estimates the driver's accumulated personal exposure?", ["Personal noise dosimeter", "Area thermometer", "Single spot reading taken before departure", "Octave-band analyzer fixed in the garage"], 0, "A personal dosimeter travels with the worker and integrates varying levels over time, making it suitable for mobile, variable exposure.", ["dosimeter", "personal-exposure"], "applied"),
  q("HW-CH10-05", "ch-10", 6, "Which three bones transmit vibration through the middle ear?", ["Malleus, incus, and stapes", "Cochlea, pinna, and canal", "Tibia, fibula, and patella", "Hammer, cochlea, and eustachian tube"], 0, "The middle-ear ossicles are the malleus, incus, and stapes, commonly called the hammer, anvil, and stirrup.", ["ear-anatomy", "ossicles"], "foundation"),
  q("HW-CH10-06", "ch-10", 7, "What is the approximate frequency range of hearing for a healthy young person?", ["2 to 200 Hz", "20 to 2,000 Hz", "20 to 20,000 Hz", "200 to 200,000 Hz"], 2, "The commonly cited nominal range is about 20 Hz to 20 kHz, although sensitivity and upper-frequency hearing vary with age and individual factors.", ["hearing-range", "frequency"], "foundation"),
  q("HW-CH10-07", "ch-10", 8, "Using OSHA's source-era 5-dB exchange table, a worker receives 95 dBA for 2 h, 90 dBA for 4 h, and 85 dBA for 2 h. What dose results?", ["62.5%", "87.5%", "100%", "112.5%"], 3, "Dose = 100[(2/4) + (4/8) + (2/16)] = 112.5%, so the combined exposure exceeds 100% under the stated OSHA method.", ["noise-dose", "osha", "calculation", "source-era"], "exam"),
  q("HW-CH10-08", "ch-10", 9, "One machine produces 95 dB and another produces 99 dB at the same point. What combined level is expected?", ["97.0 dB", "99.0 dB", "100.5 dB", "194 dB"], 2, "Logarithmic addition gives 10 log10(10^(95/10) + 10^(99/10)) = about 100.46 dB, or 100.5 dB.", ["decibel-addition", "calculation"], "exam"),
  q("HW-CH10-09", "ch-10", 10, "A fire alarm measures 115 dBA at 3 ft in a free field. Ignoring reflections, what level is estimated at 20 ft?", ["98.5 dBA", "105.0 dBA", "114.0 dBA", "135.0 dBA"], 0, "Lp2 = 115 + 20 log10(3/20) = 98.52 dBA. The inverse-square estimate applies only when free-field assumptions are reasonable.", ["inverse-square", "distance", "calculation"], "exam"),
  q("HW-CH10-10", "ch-10", 11, "A small server's fan creates an excessive continuous level at a nearby desk. What should be evaluated before relying on hearing protectors?", ["Relocating or acoustically isolating the source", "Adding a radio to mask the sound", "Extending the employee's shift", "Selecting protectors without measuring exposure"], 0, "Engineering controls such as relocation, enclosure, isolation, or quieter equipment address the source or path and should be considered before depending on PPE.", ["noise-control", "hierarchy-of-controls"], "applied"),
];

const CH11_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH11-01", "ch-11", 2, "Which indoor-air contaminant can quickly become fatal when combustion occurs in a poorly ventilated room?", ["Carbon monoxide", "Pollen", "Common skin bacteria", "Water vapor"], 0, "Carbon monoxide binds hemoglobin and can cause severe hypoxia without reliable warning from odor or irritation.", ["indoor-air", "carbon-monoxide"], "applied"),
  q("HW-CH11-02", "ch-11", 3, "Tuberculosis is caused by what kind of biological agent?", ["Virus", "Bacterium", "Protozoan", "Fungus"], 1, "Tuberculosis is caused by bacteria in the Mycobacterium tuberculosis complex.", ["tuberculosis", "bacteria"], "foundation"),
  q("HW-CH11-03", "ch-11", 4, "Which statement about latent tuberculosis infection is most accurate?", ["It always causes a productive cough", "A person may have no symptoms and is generally not contagious while infection remains latent", "It cannot produce a positive TB test", "It always progresses to active disease within a week"], 1, "Latent TB infection is asymptomatic and not infectious; it can later progress to active TB, particularly when immunity is weakened.", ["tuberculosis", "latent-infection", "transmission"], "applied"),
  q("HW-CH11-04", "ch-11", 5, "Which statement best defines disinfection?", ["Destruction of all microbial life including bacterial spores", "Reduction or inactivation of many pathogenic microorganisms on inanimate objects", "Use of an antimicrobial only on living skin", "A process that merely stops growth without reducing organisms"], 1, "Disinfection treats inanimate surfaces and eliminates many or all pathogenic microorganisms, but it does not necessarily destroy bacterial spores.", ["disinfection", "infection-control"], "foundation"),
  q("HW-CH11-05", "ch-11", 6, "A laboratory employee has reasonably anticipated contact with blood. Which preventive measure must the employer make available at no cost?", ["Hepatitis B vaccination", "An HIV vaccine", "A vaccine against every bloodborne disease", "Only a tetanus vaccination after an incident"], 0, "For occupational blood exposure, the employer must offer the hepatitis B vaccination series under the bloodborne-pathogens program.", ["hepatitis-b", "bloodborne-pathogens", "vaccination"], "applied"),
  q("HW-CH11-06", "ch-11", 7, "Which approach should workers use when contact with blood or other potentially infectious material may occur?", ["Standard precautions", "Quarantine every exposed coworker", "Rely on vaccination instead of barriers", "Handle only visibly bloody material as infectious"], 0, "Standard precautions treat blood and specified body fluids as potentially infectious and combine hand hygiene, barriers, sharps safety, and other controls.", ["standard-precautions", "bloodborne-pathogens"], "foundation"),
  q("HW-CH11-07", "ch-11", 8, "Which technology is commonly used in a biological safety cabinet to remove airborne particles from exhaust air?", ["HEPA filtration", "A household carbon filter only", "Simple dilution with room air", "Visible-light exposure"], 0, "HEPA filters remove at least the specified high fraction of challenge-size particles and are central to many biosafety-cabinet containment designs.", ["biosafety-cabinet", "hepa", "containment"], "foundation"),
  q("HW-CH11-08", "ch-11", 9, "Routine diagnostic work with human blood of unknown infection status generally begins with which biosafety level and bloodborne-pathogen precautions?", ["BSL-1", "BSL-2", "BSL-3 for every specimen", "BSL-4"], 1, "BSL-2 practices, facility features, and exposure controls are generally appropriate for routine work with human blood; risk assessment may require additional controls.", ["biosafety-level", "blood"], "applied"),
  q("HW-CH11-09", "ch-11", 10, "Which list contains recognized occupational routes for biological-agent entry?", ["Inhalation, ingestion, mucous-membrane or skin contact, and inoculation", "Hearing and vibration only", "Radiation and magnetic fields only", "Temperature change only"], 0, "Biological agents may enter through inhalation, ingestion, contact with vulnerable skin or mucous membranes, or percutaneous inoculation such as a needlestick.", ["transmission", "routes-of-entry"], "foundation"),
  q("HW-CH11-10", "ch-11", 11, "In biosafety, what does containment mean?", ["A coordinated use of practices, safety equipment, and facility design to limit exposure and release", "Only placing a warning label on a sample", "Relying solely on employee immunity", "Destroying every organism before work begins"], 0, "Containment integrates work practices, primary barriers or safety equipment, and secondary facility features according to risk.", ["containment", "biosafety", "controls"], "applied"),
];

const CH12_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH12-01", "ch-12", 2, "Which action does NOT describe a valid fire-extinguishment principle?", ["Remove heat", "Separate fuel", "Limit oxygen where appropriate", "Add energy to sustain the chain reaction"], 3, "A fire is controlled by interrupting heat, fuel, oxygen, or the chemical chain reaction; adding energy supports combustion.", ["fire-tetrahedron", "extinguishment"], "foundation"),
  q("HW-CH12-02", "ch-12", 3, "A fire crew cuts a wide strip of vegetation ahead of a wildfire. Which extinguishment mechanism is primarily being used?", ["Cooling", "Fuel removal", "Oxygen enrichment", "Pressure increase"], 1, "A firebreak interrupts the continuity of combustible material and therefore controls the fire by separating or removing fuel.", ["firebreak", "fuel-removal"], "applied"),
  q("HW-CH12-03", "ch-12", 4, "What property is described by a liquid's tendency to produce vapor?", ["Volatility", "Viscosity only", "Specific heat", "Corrosivity"], 0, "Volatility describes how readily a substance vaporizes under stated conditions; it is related to, but not identical with, flammability.", ["volatility", "flammable-liquids"], "foundation"),
  q("HW-CH12-04", "ch-12", 5, "Which property is the lowest liquid temperature at which enough vapor forms to ignite momentarily when an ignition source is applied?", ["Boiling point", "Flash point", "Autoignition temperature", "Upper flammable limit"], 1, "Flash point is an empirical measure of the minimum temperature at which a liquid gives off sufficient vapor to form an ignitable mixture near its surface.", ["flash-point", "fire-properties"], "foundation"),
  q("HW-CH12-05", "ch-12", 6, "Why can a small flammable-liquid spill threaten a low point or drain some distance away?", ["Many common solvent vapors are denser than air and can travel near the floor", "Every vapor rises directly to the ceiling", "Liquid flash point prevents vapor movement", "Only the liquid surface can burn"], 0, "Many hydrocarbon and solvent vapors are heavier than air, so they can migrate to low areas and reach remote ignition sources.", ["vapor-density", "flammable-vapors"], "applied"),
  q("HW-CH12-06", "ch-12", 7, "Using the source-era NFPA 30 class terminology, a liquid with flash point below 73 degrees F and boiling point below 100 degrees F is which class?", ["Class IA", "Class IB", "Class IC", "Class II"], 0, "Under that classification scheme, Class IA combines a flash point below 73 degrees F with a boiling point below 100 degrees F. Always apply the edition adopted by the authority having jurisdiction.", ["flammable-liquid-class", "nfpa", "source-era"], "applied"),
  q("HW-CH12-07", "ch-12", 8, "What is the lowest vapor concentration in air that can propagate flame called?", ["Upper flammable limit", "Lower flammable limit", "Vapor pressure", "Flash point"], 1, "Below the lower flammable limit, the mixture is too lean to propagate flame under the test conditions.", ["lfl", "flammable-range"], "foundation"),
  q("HW-CH12-08", "ch-12", 9, "What does a substance's flammable range represent?", ["Temperatures between freezing and boiling", "Concentrations between the lower and upper flammable limits", "Pressures that prevent evaporation", "Any concentration above the upper limit"], 1, "A gas or vapor can support flame propagation when its concentration lies between its lower and upper flammable limits, assuming the other test conditions are met.", ["flammable-range", "lfl", "ufl"], "foundation"),
  q("HW-CH12-09", "ch-12", 10, "For an ordinary Class A solid-fuel fire, what is water's principal extinguishing action?", ["Cooling the fuel below the temperature needed to sustain combustion", "Increasing vapor pressure", "Adding combustible material", "Raising the fuel's surface temperature"], 0, "Water's high heat capacity and heat of vaporization remove heat effectively from many ordinary-combustible fires; it is not suitable for every fire class.", ["water", "cooling", "class-a-fire"], "foundation"),
  q("HW-CH12-10", "ch-12", 11, "Which practice is appropriate when flammable liquids are stored indoors?", ["Use approved containers or cabinets and maintain required aisles, ventilation, and quantity controls", "Store open containers beside ignition sources", "Block exits to increase storage space", "Assume all quantities may be stored together without compatibility review"], 0, "Indoor storage must use approved equipment and comply with applicable quantity, separation, ventilation, ignition-control, and egress requirements.", ["flammable-storage", "fire-prevention"], "applied"),
];

const CH13_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH13-01", "ch-13", 2, "In a hot environment, which process usually provides the greatest potential for body-heat loss when air temperature approaches skin temperature?", ["Evaporation of sweat", "Eating carbohydrates", "Increasing clothing insulation", "Reducing skin blood flow"], 0, "As convection and radiation become less effective in high heat, evaporation of sweat becomes the main avenue for heat loss, provided the environment and clothing allow evaporation.", ["heat-stress", "evaporation"], "foundation"),
  q("HW-CH13-02", "ch-13", 3, "Outdoors in direct sun, natural wet-bulb is 82 degrees F, globe is 105 degrees F, and dry-bulb is 94 degrees F. What is WBGT using 0.7WB + 0.2GT + 0.1DB?", ["82.0 degrees F", "87.8 degrees F", "94.0 degrees F", "98.4 degrees F"], 1, "WBGT = (0.7 x 82) + (0.2 x 105) + (0.1 x 94) = 57.4 + 21 + 9.4 = 87.8 degrees F.", ["wbgt", "heat-stress", "calculation"], "applied"),
  q("HW-CH13-03", "ch-13", 4, "Which is a sound element of a heat-illness prevention program?", ["Scheduled hydration and recovery, acclimatization, monitoring, and emergency response", "Tell workers to self-limit without supervision", "Withhold water until a break", "Use dark impermeable clothing for every task"], 0, "Effective programs combine engineering and administrative controls, acclimatization, hydration, monitoring, training, and rapid response rather than relying only on worker self-pacing.", ["heat-controls", "prevention"], "applied"),
  q("HW-CH13-04", "ch-13", 5, "What does the heat-stress index traditionally compare?", ["Required evaporative heat loss with the maximum evaporation the environment permits", "Wet-bulb temperature with wind speed only", "Salt intake with water intake", "Core temperature with air pressure"], 0, "The heat-stress index expresses required evaporation as a fraction or percentage of the environment's maximum evaporative capacity.", ["heat-stress-index", "evaporation"], "exam"),
  q("HW-CH13-05", "ch-13", 6, "A worker in extreme heat becomes confused, collapses, and has very high body temperature. What is the best response?", ["Treat as heat stroke: activate emergency care and begin rapid cooling", "Ask the worker to finish the shift", "Wait for sweating to stop before acting", "Give salt tablets and send the worker back alone"], 0, "Central nervous system dysfunction with severe hyperthermia indicates heat stroke, a medical emergency requiring immediate cooling and emergency medical services.", ["heat-stroke", "emergency-response"], "applied"),
  q("HW-CH13-06", "ch-13", 7, "How should a new worker generally be acclimatized to a hot job?", ["Increase heat exposure gradually over about 7 to 14 days while monitoring the worker", "Assign a full workload immediately", "Use one two-hour exposure and assume acclimatization is complete", "Acclimatize only after heat illness occurs"], 0, "Heat acclimatization develops progressively; a staged exposure and workload over roughly one to two weeks is safer than immediate full exposure.", ["acclimatization", "heat-controls"], "applied"),
  q("HW-CH13-07", "ch-13", 8, "A core body temperature near which value signals severe hypothermia risk and urgent danger if cooling continues?", ["98.6 degrees F", "95.0 degrees F", "91.4 degrees F", "85.8 degrees F"], 3, "A core temperature near 30 degrees C (85.8 degrees F) represents severe hypothermia with major cardiac and neurologic risk; action is required well before this point.", ["hypothermia", "cold-stress"], "foundation"),
  q("HW-CH13-08", "ch-13", 9, "Which statement defines hypothermia?", ["The body gains heat faster than it can lose it", "The body loses heat faster than it can produce heat", "Blood pressure rises after exercise", "Sweat evaporation becomes perfectly efficient"], 1, "Hypothermia develops when net heat loss exceeds metabolic and external heat gain, causing core temperature to fall.", ["hypothermia", "definition"], "foundation"),
  q("HW-CH13-09", "ch-13", 10, "Which index is especially useful for evaluating exposed skin and cold stress in wind?", ["Wind chill", "Heat index", "Air-quality index", "Body-mass index"], 0, "Wind chill combines air temperature and wind speed to estimate cooling effects on exposed skin; it complements, rather than replaces, a complete cold-stress assessment.", ["wind-chill", "cold-stress"], "foundation"),
  q("HW-CH13-10", "ch-13", 11, "A welder in a hot, humid enclosed area develops heavy sweating, pallor, nausea, headache, rapid pulse, and weakness but remains mentally coherent. What is most likely?", ["Heat exhaustion", "Heat rash", "Metal fume fever", "Arc-eye injury"], 0, "Heavy sweating, weakness, nausea, headache, pallor, and tachycardia are typical of heat exhaustion; any mental-status change would raise concern for heat stroke.", ["heat-exhaustion", "symptoms"], "applied"),
];

const CH15_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH15-01", "ch-15", 2, "Twelve practice-exam scores are 76, 88, 94, 55, 75, 85, 88, 64, 82, 73, 72, and 70. What is their arithmetic mean?", ["67.0", "76.8", "82.0", "92.0"], 1, "The scores total 922; 922/12 = 76.83, which rounds to 76.8.", ["mean", "descriptive-statistics", "calculation"], "applied"),
  q("HW-CH15-02", "ch-15", 3, "For the sample 7, 12, 18, 5, 6, 6, 14, 11, and 19, what is the sample standard deviation?", ["4.3", "5.0", "5.3", "10.9"], 2, "Using n-1 in the denominator, the sample standard deviation is approximately 5.302, or 5.3.", ["standard-deviation", "sample", "calculation"], "exam"),
  q("HW-CH15-03", "ch-15", 4, "Four development phases contain 0.768, 0.504, 0.371, and 0.337 errors per 100 instructions. What is the combined average rate?", ["About 1 error per 50 instructions", "About 1 error per 200 instructions", "About 1 error per 1,000 instructions", "About 2 errors per instruction"], 1, "The expected errors total 1.98 across 400 instructions, a rate of 0.00495 per instruction, or about one error per 202 instructions.", ["mean-rate", "calculation"], "exam"),
  q("HW-CH15-04", "ch-15", 5, "Annual incidents are approximately normal with mean 28 and standard deviation 12. What is the approximate probability of more than 16 incidents?", ["16%", "50%", "68%", "84%"], 3, "For 16, z = (16-28)/12 = -1. The area above z = -1 is approximately 0.8413, or 84%.", ["normal-distribution", "z-score", "probability"], "exam"),
  q("HW-CH15-05", "ch-15", 6, "What general term describes how widely observations spread around a central value?", ["Dispersion", "Correlation", "Skew direction", "Sample identity"], 0, "Dispersion describes variability or spread and is summarized with measures such as range, variance, and standard deviation.", ["dispersion", "descriptive-statistics"], "foundation"),
  q("HW-CH15-06", "ch-15", 7, "Approximately 99% of a normal distribution lies within how many standard deviations of its mean?", ["1.00", "1.96", "2.58", "4.40"], 2, "A two-sided central area of about 99% corresponds to z values near plus or minus 2.576, commonly rounded to 2.58.", ["normal-distribution", "standard-deviation"], "foundation"),
  q("HW-CH15-07", "ch-15", 8, "Which statistic expresses how far a value is above or below the mean in standard-deviation units?", ["Z-score", "Median", "Range", "Quartile width"], 0, "A z-score standardizes a value as z = (x - mean)/standard deviation.", ["z-score", "standardization"], "foundation"),
  q("HW-CH15-08", "ch-15", 9, "Which value represents the strongest valid positive Pearson correlation?", ["0.05", "0.50", "0.92", "1.006"], 2, "Pearson r ranges from -1 to +1. Of the valid values, +0.92 is closest to +1 and therefore indicates the strongest positive linear association.", ["correlation", "pearson-r"], "foundation"),
  q("HW-CH15-09", "ch-15", 10, "A sample finds 3 defective wafers among 100. If that rate continues, how many defects are expected among 2,500 wafers?", ["30", "75", "100", "150"], 1, "The estimated defect proportion is 0.03; 0.03 x 2,500 = 75 expected defects.", ["proportion", "expected-count", "calculation"], "applied"),
  q("HW-CH15-10", "ch-15", 11, "A system has independent components in series, and every component must operate. How is system reliability calculated?", ["Add all component reliabilities", "Multiply all component reliabilities", "Subtract each reliability from one and add", "Use only the least reliable component as the exact answer"], 1, "For independent series components, the success probabilities multiply: Rsystem = R1 x R2 x ... x Rn.", ["reliability", "series-system"], "foundation"),
  q("HW-CH15-11", "ch-15", 12, "A switch operates twice daily and experiences one failure after 10 years. What is the estimated failure probability per operation?", ["1.4 x 10^-4", "2.7 x 10^-6", "1.8 x 10^-5", "1.4 x 10^-2"], 0, "There were about 2 x 365 x 10 = 7,300 operations. One failure divided by 7,300 operations is 1.37 x 10^-4 per operation.", ["failure-rate", "calculation"], "applied"),
  q("HW-CH15-12", "ch-15", 13, "Five independent series components each have failure probability 0.30 for the mission. What is the system reliability?", ["0.00243", "0.150", "0.168", "1.50"], 2, "Each component reliability is 1 - 0.30 = 0.70. The series reliability is 0.70^5 = 0.16807.", ["reliability", "series-system", "calculation"], "exam"),
];

const CH16_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH16-01", "ch-16", 2, "Which combination most directly determines the physiological severity of an electric shock?", ["Conductor color, age, and length", "Current magnitude, path through the body, duration, and frequency", "Circuit label and equipment brand", "Ambient light and room size"], 1, "Shock outcome depends strongly on current magnitude, its path through the body, contact duration, and current frequency, along with skin and contact conditions.", ["electric-shock", "physiological-effects"], "foundation"),
  q("HW-CH16-02", "ch-16", 3, "A 100-W lamp operates continuously for 365 days. At $0.102 per kWh, what is the annual energy cost?", ["$10.20", "$24.22", "$52.56", "$89.35"], 3, "Energy = 0.100 kW x 24 h/day x 365 days = 876 kWh. Cost = 876 x $0.102 = $89.35.", ["electrical-power", "energy-cost", "calculation"], "applied"),
  q("HW-CH16-03", "ch-16", 4, "Contact with 60-Hz current in roughly the 5-to-25 mA range may cause which dangerous response?", ["Inability to release the conductor because of muscle tetany", "Guaranteed harmless exposure", "Instantaneous vaporization of the conductor", "Only a visual afterimage"], 0, "Currents in this range can produce painful contraction and a 'let-go' hazard; actual effects vary, so any energized contact must be prevented.", ["electric-shock", "let-go-current"], "applied"),
  q("HW-CH16-04", "ch-16", 5, "What condition causes a Class A ground-fault circuit interrupter to trip?", ["A small difference between current on the ungrounded and grounded conductors", "A rise in room humidity alone", "Normal equal current in hot and neutral", "A change in conductor color"], 0, "A GFCI compares outgoing and returning current and rapidly opens the circuit when an imbalance indicates leakage, typically to ground.", ["gfci", "ground-fault", "current-imbalance"], "foundation"),
  q("HW-CH16-05", "ch-16", 6, "Rigid metal conduit is unexpectedly hot. What is the safest initial conclusion?", ["The warmth proves the installation is normal", "Abnormal current or a poor electrical connection may be producing heat; de-energize and investigate", "The conduit should be cooled with water while energized", "Aluminum conductors are always the sole cause"], 1, "Unexpected heating may indicate excessive or objectionable current, overload, or high-resistance connections and calls for qualified electrical investigation after safe isolation.", ["electrical-heating", "abnormal-condition"], "applied"),
  q("HW-CH16-06", "ch-16", 7, "What is the primary focus of NFPA 70E?", ["Safe work practices for electrical hazards in workplaces", "Residential wire color selection only", "Utility rate setting", "Financial licensing of electrical contractors"], 0, "NFPA 70E addresses workplace practices intended to reduce electrical shock, arc-flash, and related risks during work involving electrical energy.", ["nfpa-70e", "electrical-safety"], "foundation"),
  q("HW-CH16-07", "ch-16", 8, "Resistors of 500 ohms, 1,000 ohms, and 1,500 ohms are connected in parallel. What is equivalent resistance?", ["0.00367 ohm", "273 ohms", "1,000 ohms", "3,000 ohms"], 1, "1/Rt = 1/500 + 1/1000 + 1/1500 = 0.003667, so Rt = 272.7 ohms, approximately 273 ohms.", ["parallel-resistance", "ohms-law", "calculation"], "exam"),
  q("HW-CH16-08", "ch-16", 9, "A welding machine operates at 400 V and draws 70 A. Ignoring power factor, what power is delivered?", ["5.72 kW", "28 kW", "2,800 kW", "28,000 kW"], 1, "P = VI = 400 x 70 = 28,000 W = 28 kW.", ["electrical-power", "calculation"], "applied"),
  q("HW-CH16-09", "ch-16", 10, "During a GFCI test, 8.000 A leaves on the ungrounded conductor and 7.994 A returns on the grounded conductor. What does the device detect?", ["A 6-mA imbalance consistent with leakage", "Perfectly balanced current", "A 14-A overload", "A 0.006-V voltage drop"], 0, "The differential is 8.000 - 7.994 = 0.006 A, or 6 mA. A Class A GFCI is designed to interrupt a small ground-fault imbalance in this range.", ["gfci", "current-imbalance", "calculation"], "applied"),
  q("HW-CH16-10", "ch-16", 11, "Why can a sustained circuit overload progress into a fire?", ["Excess current creates heat that can degrade insulation and initiate arcing or ignition", "An overload always lowers conductor temperature", "Circuit breakers are designed to increase the overload", "Voltage labels become unreadable"], 0, "I2R heating rises with current; prolonged overheating can damage insulation and connections, enabling faults, arcing, and ignition.", ["overload", "electrical-fire", "i2r-heating"], "applied"),
];

const CH17_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH17-01", "ch-17", 2, "A 250-lb crate rests on a level floor with coefficient of friction 0.62. What horizontal force is needed to overcome friction at the stated coefficient?", ["38.8 lbf", "155 lbf", "250 lbf", "403 lbf"], 1, "On a level floor the normal force is 250 lbf, so friction = mu N = 0.62 x 250 = 155 lbf; contact area is not part of this ideal model.", ["friction", "mechanics", "calculation"], "applied"),
  q("HW-CH17-02", "ch-17", 3, "What is the kinetic energy of a 6-kg object moving at 6 m/s?", ["18 J", "36 J", "54 J", "108 J"], 3, "KE = one-half mv^2 = 0.5 x 6 x 6^2 = 108 J.", ["kinetic-energy", "calculation"], "foundation"),
  q("HW-CH17-03", "ch-17", 5, "An ideal block-and-tackle has four supporting rope parts and lifts 2,000 lbf. Ignoring friction, what input force is required?", ["300 lbf", "400 lbf", "500 lbf", "600 lbf"], 2, "Ideal mechanical advantage equals four, so input force = 2,000/4 = 500 lbf.", ["mechanical-advantage", "block-and-tackle"], "applied"),
  q("HW-CH17-04", "ch-17", 6, "A wheelbarrow carries 216 lbf whose center of gravity is 1.5 ft from the axle. The handles are 4 ft from the axle. What upward handle force balances the moment?", ["27 lbf", "54 lbf", "81 lbf", "108 lbf"], 2, "Balance moments about the axle: 216 x 1.5 = F x 4, so F = 81 lbf.", ["moment", "lever", "calculation"], "applied"),
  q("HW-CH17-05", "ch-17", 7, "A vehicle moving 55 mph decelerates uniformly at 5 mph each second. How long does it take to stop?", ["0.09 s", "5 s", "11 s", "60 s"], 2, "Time = change in speed/deceleration = 55/(5 per second) = 11 seconds.", ["deceleration", "kinematics"], "foundation"),
  q("HW-CH17-06", "ch-17", 9, "A 20-ft by 300-ft wall experiences uniform wind pressure of 0.011 psi. What total force acts on the wall?", ["95 lbf", "190 lbf", "9,500 lbf", "66,000 lbf"], 2, "Area = 6,000 ft2 x 144 = 864,000 in2. Force = pressure x area = 0.011 x 864,000 = 9,504 lbf, about 9,500 lbf.", ["pressure", "force", "wind-load"], "exam"),
  q("HW-CH17-07", "ch-17", 10, "How much work is required to lift 300 gal of water weighing 8.34 lb/gal through 400 ft, ignoring losses?", ["100,080 ft-lbf", "250,200 ft-lbf", "1,000,800 ft-lbf", "3,336,000 ft-lbf"], 2, "Water weight = 300 x 8.34 = 2,502 lbf. Work = force x distance = 2,502 x 400 = 1,000,800 ft-lbf.", ["work", "water-weight", "calculation"], "applied"),
  q("HW-CH17-08", "ch-17", 11, "A car accelerates uniformly from 10 m/s to 30 m/s over 10 s. How far does it travel?", ["100 m", "200 m", "300 m", "400 m"], 1, "For constant acceleration, average velocity is (10+30)/2 = 20 m/s; distance = 20 x 10 = 200 m.", ["kinematics", "distance", "calculation"], "applied"),
];

const CH18_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH18-01", "ch-18", 4, "A pitot reading is 65 psi water pressure. With 1 psi = 2.31 ft of water and g = 32.2 ft/s2, what ideal flow velocity follows from v = sqrt(2gh)?", ["49 ft/s", "98 ft/s", "150 ft/s", "209 ft/s"], 1, "Head h = 65 x 2.31 = 150.15 ft. Velocity = sqrt(2 x 32.2 x 150.15) = 98.3 ft/s.", ["pitot", "velocity-head", "calculation"], "exam"),
  q("HW-CH18-02", "ch-18", 8, "A sprinkler has discharge coefficient K = 3.6 and pressure 60 psi. Using Q = K sqrt(P), what flow is expected?", ["27.9 gpm", "32.7 gpm", "36.2 gpm", "216 gpm"], 0, "Q = 3.6 x sqrt(60) = 27.89 gpm, approximately 27.9 gpm.", ["sprinkler-flow", "hydraulics", "calculation"], "applied"),
  q("HW-CH18-03", "ch-18", 12, "Water starts 46 ft below grade and must reach an outlet 21 ft above grade. Ignoring losses, what static head must the pump overcome?", ["21 ft", "25 ft", "46 ft", "67 ft"], 3, "The total elevation difference is 46 + 21 = 67 ft. Real pump selection would also account for friction and other dynamic losses.", ["pump-head", "elevation", "calculation"], "applied"),
];

const CH19_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH19-01", "ch-19", 2, "What is a defensible benefit of a short quiz at the end of a safety lesson?", ["It guarantees every objective was achieved", "It provides retrieval practice and evidence about learning", "It proves long-term behavior change by itself", "It measures attitude without asking attitude questions"], 1, "A well-aligned quiz reinforces retrieval and checks learning, but it cannot by itself guarantee competence, behavior change, or transfer to the job.", ["assessment", "retrieval-practice"], "foundation"),
  q("HW-CH19-02", "ch-19", 3, "Which training objective is written in measurable performance terms?", ["Participants will understand respirators", "Participants will appreciate chemical safety", "Given a paint and its SDS, participants will select the required respirator with 100% accuracy", "Participants will be familiar with PPE"], 2, "A measurable objective names the conditions, observable performance, and acceptable criterion rather than using vague internal verbs.", ["learning-objective", "performance"], "applied"),
  q("HW-CH19-03", "ch-19", 4, "Which learning activity provides the least direct practice of a physical lockout skill?", ["Listening to an uninterrupted lecture", "Performing a supervised lockout", "Teaching back the isolation sequence", "Correcting errors during a simulation"], 0, "Passive listening can introduce information, but supervised performance, feedback, and teach-back provide more direct evidence and practice of a physical skill.", ["adult-learning", "practice"], "applied"),
  q("HW-CH19-04", "ch-19", 5, "An employee knows the procedure, but a machine has an accessible unguarded point of operation. What is the preferred primary remedy?", ["Repeat the same lecture", "Install an effective machine guard", "Issue a memo asking for extra care", "Require the employee to sign a warning"], 1, "The performance barrier is a physical hazard, not a knowledge gap; engineering protection is needed rather than treating training as the primary fix.", ["training-needs", "machine-guarding", "non-training-solution"], "applied"),
  q("HW-CH19-05", "ch-19", 6, "A CEO will brief 400 employees on company performance. Which delivery plan is most suitable?", ["A structured presentation with clear high-level visuals, concise stories, accessibility, and a managed question period", "Dense spreadsheets projected in tiny type", "No visual support regardless of content", "Unmoderated small-group equipment practice for the entire address"], 0, "For a large audience, a well-structured presentation with legible visuals and controlled interaction supports clarity and attention.", ["delivery-method", "large-audience"], "applied"),
  q("HW-CH19-06", "ch-19", 7, "What question should lead a training-needs analysis?", ["Will training address the verified cause of the performance gap?", "Which slide theme looks newest?", "Can the longest course be scheduled?", "How can every problem be labeled a training issue?"], 0, "Needs analysis first determines whether a knowledge or skill gap exists and whether training can reasonably resolve the underlying need.", ["needs-analysis", "performance-gap"], "foundation"),
  q("HW-CH19-07", "ch-19", 8, "Which method can collect workers' self-reported needs and prior knowledge before course design?", ["A targeted questionnaire", "A fire extinguisher inspection tag", "An electrical one-line diagram alone", "A purchase order"], 0, "Questionnaires can efficiently gather learner information, although good analysis triangulates them with observation, records, interviews, and performance data.", ["needs-analysis", "questionnaire"], "foundation"),
  q("HW-CH19-08", "ch-19", 9, "Which statement about computer-based training is most accurate?", ["It is automatically suitable for every topic", "It is never suitable for frontline workers", "Its suitability depends on objectives, learners, access, practice needs, and evaluation", "Low delivery cost proves effectiveness"], 2, "Delivery technology should follow the needs and objectives; hands-on skills may require coached practice even when online content is useful.", ["cbt", "delivery-method"], "applied"),
  q("HW-CH19-09", "ch-19", 10, "In ADDIE, what comes immediately after analysis?", ["Design", "Implementation", "Evaluation only", "Archiving"], 0, "The conventional sequence is Analysis, Design, Development, Implementation, and Evaluation, with iteration as evidence warrants.", ["addie", "instructional-design"], "foundation"),
  q("HW-CH19-10", "ch-19", 11, "What is the strongest reason to use comparable pre- and post-assessments?", ["Estimate learning gain against the stated objectives", "Guarantee zero future incidents", "Replace observation of job performance", "Rank instructors by popularity only"], 0, "Comparable assessments can estimate change in knowledge or skill attributable to the learning period, but transfer and workplace outcomes need additional measures.", ["pretest", "posttest", "evaluation"], "applied"),
];

const CH23_HOMEWORK: readonly HomeworkQuestion[] = [
  q("HW-CH23-01", "ch-23", 4, "Which long-term action gives an employer the most direct control over workers' compensation cost?", ["Prevent losses and manage claims and return-to-work effectively", "Select the insurance plan with the most complicated name", "Delay every report", "Assume the experience modifier cannot change"], 0, "Prevention reduces claim frequency and severity, while prompt case management and suitable return-to-work can reduce duration and cost, which can improve experience over time.", ["workers-compensation", "cost-control", "emr"], "applied"),
  q("HW-CH23-02", "ch-23", 5, "In the United States, workers' compensation benefits and procedures are primarily established by what authority?", ["State law", "A single uniform federal benefits law for all workers", "Labor unions alone", "Life-insurance underwriters"], 0, "Workers' compensation systems are principally creatures of state law, with important jurisdiction-specific rules and some federal programs for particular worker groups.", ["workers-compensation", "state-law"], "foundation"),
  q("HW-CH23-03", "ch-23", 6, "What does the no-fault principle generally mean in workers' compensation?", ["Eligible benefits do not depend on proving employer negligence", "Every injury receives unlimited damages", "The employee chooses the benefit amount", "The employer can never dispute work-relatedness"], 0, "The system generally provides defined benefits for covered work injuries without requiring the employee to prove negligence, subject to eligibility and jurisdictional rules.", ["no-fault", "workers-compensation"], "foundation"),
  q("HW-CH23-04", "ch-23", 7, "Which loss is least likely to be paid in full as a standard workers' compensation benefit?", ["Reasonable medical treatment for the covered injury", "Covered rehabilitation services", "Emergency transport related to the injury", "100% of all lost wages including overtime"], 3, "Wage-replacement benefits are usually a statutory fraction subject to limits; they do not ordinarily replace every dollar of wages and overtime.", ["workers-compensation", "benefits", "wage-replacement"], "applied"),
  q("HW-CH23-05", "ch-23", 8, "Which description best summarizes the basic benefit design of workers' compensation?", ["Covered medical care plus statutory wage-replacement and other defined benefits", "Lifetime employment after any injury", "Only a one-time settlement", "Medical care only, with no disability benefits in any jurisdiction"], 0, "Covered systems generally provide medical benefits and defined disability or wage-replacement benefits, with details set by the governing jurisdiction.", ["workers-compensation", "benefits"], "foundation"),
  q("HW-CH23-06", "ch-23", 9, "How does workers' compensation generally benefit an employer?", ["It channels covered claims into a defined benefit system and limits tort exposure, subject to exceptions", "It creates absolute immunity from every lawsuit", "It pays every category of damage without limit", "It eliminates the need for hazard control"], 0, "Exclusive-remedy provisions commonly limit civil exposure for covered injuries, but exceptions and third-party claims mean the protection is not absolute.", ["exclusive-remedy", "employer-benefit"], "applied"),
  q("HW-CH23-07", "ch-23", 10, "A company's experience modification rate is 1.05. What does that generally indicate?", ["Its loss experience is about 5% more adverse than the rating benchmark", "Its losses are exactly 5% below the benchmark", "Its premium must decrease by 5%", "The modifier uses only one year of data"], 0, "A modifier above 1.00 generally signals worse-than-expected loss experience for the rating basis and tends to increase the experience-rated portion of premium.", ["emr", "workers-compensation", "insurance"], "applied"),
  q("HW-CH23-08", "ch-23", 11, "A worker receives a minor cut, cleans it, and applies a simple bandage, then returns to normal work. No other treatment is needed. How is it generally classified for OSHA recordkeeping?", ["A days-away case", "A restricted-work case", "A medical-treatment recordable case", "A first-aid case that is not recordable solely on those facts"], 3, "Cleaning a minor wound and using a simple bandage are on OSHA's first-aid list; without another recording criterion, the case is not recordable.", ["first-aid", "osha-recordkeeping", "workers-compensation"], "applied"),
];

export const HOMEWORK_QUESTIONS: readonly HomeworkQuestion[] = [
  ...CH02_HOMEWORK,
  ...CH03_HOMEWORK,
  ...CH04_HOMEWORK,
  ...CH05_HOMEWORK,
  ...CH06_HOMEWORK,
  ...CH07_HOMEWORK,
  ...CH10_HOMEWORK,
  ...CH11_HOMEWORK,
  ...CH12_HOMEWORK,
  ...CH13_HOMEWORK,
  ...CH15_HOMEWORK,
  ...CH16_HOMEWORK,
  ...CH17_HOMEWORK,
  ...CH18_HOMEWORK,
  ...CH19_HOMEWORK,
  ...CH23_HOMEWORK,
];

const CH02_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH02-01", "ch-02", 2, "A supervisor knows a press lacks required guarding but keeps it operating because the company has liability insurance. Which principle is most important?", ["Insurance transfers the duty to provide safe work", "The employer must still correct the recognized serious hazard", "Workers assume every known hazard", "Only a customer can request correction"], 1, "Insurance does not discharge the employer's prevention duty; the recognized machine hazard must be controlled.", ["employer-duty", "machine-guarding"], "applied", "HW-CH02-01"),
  q("RV-CH02-02", "ch-02", 4, "A manager intentionally steps toward a worker with a raised wrench, creating a reasonable fear of immediate harmful contact, but never touches the worker. Which tort concept best fits?", ["Assault", "Battery", "Breach of contract", "Strict product liability"], 0, "Assault concerns apprehension of imminent harmful or offensive contact; battery generally requires the contact itself.", ["tort", "assault"], "applied", "HW-CH02-03"),
  q("RV-CH02-03", "ch-02", 7, "A respirator is sold with an express promise that it protects against a named contaminant, but testing shows it does not. Which legal theory most directly concerns the broken product promise?", ["Breach of warranty", "Criminal trespass", "Workers' compensation", "Assault"], 0, "An express representation about product performance can create a warranty; failure to conform may support a breach-of-warranty claim.", ["warranty", "product-liability"], "exam", "HW-CH02-06"),
  q("RV-CH02-04", "ch-02", 6, "After a product-injury complaint is filed and answered, the parties exchange documents and take depositions. What stage is this?", ["Discovery", "Pleading the initial complaint", "Jury verdict", "Appellate mandate"], 0, "Discovery is the pretrial process used to obtain documents, testimony, and other information relevant to the claims and defenses.", ["civil-procedure", "discovery"], "applied", "HW-CH02-05"),
  q("RV-CH02-05", "ch-02", 3, "Why is strict liability distinct from negligence?", ["Strict liability may apply without proof that the defendant failed to use reasonable care", "Strict liability is always a criminal charge", "Negligence requires an intentional injury", "Strict liability eliminates the need to prove causation"], 0, "Strict liability may dispense with proof of careless conduct, but the claimant still must establish the other required elements, including causation and harm.", ["strict-liability", "negligence"], "exam", "HW-CH02-02"),
];

const CH03_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH03-01", "ch-03", 2, "A facility has 4 days-away or restricted/transfer cases during 250,000 work hours. What is its DART rate?", ["1.6", "3.2", "4.0", "8.0"], 1, "DART = (4 x 200,000)/250,000 = 3.2.", ["dart", "incidence-rate"], "applied", "HW-CH03-01"),
  q("RV-CH03-02", "ch-03", 3, "Six recordable cases occur during 600,000 hours. What is TRIR?", ["1.0", "2.0", "3.0", "12.0"], 1, "TRIR = (6 x 200,000)/600,000 = 2.0.", ["trir", "calculation"], "applied", "HW-CH03-02"),
  q("RV-CH03-03", "ch-03", 3, "A workplace reports zero recordable cases across 180,000 hours. What TRIR should be reported for those data?", ["0", "0.9", "1.1", "Cannot be below 1"], 0, "With a zero numerator, (0 x 200,000)/180,000 equals zero.", ["trir", "zero-cases"], "foundation", "HW-CH03-02"),
  q("RV-CH03-04", "ch-03", 3, "A company worked 500,000 hours and reports TRIR 4.0. How many recordable cases does that represent?", ["4", "8", "10", "20"], 2, "Cases = TRIR x hours / 200,000 = 4.0 x 500,000 / 200,000 = 10.", ["trir", "algebra"], "exam", "HW-CH03-02"),
  q("RV-CH03-05", "ch-03", 2, "Which hours belong in the denominator of an OSHA incidence-rate calculation?", ["Actual employee hours worked, including overtime", "Scheduled hours plus vacation and sick leave", "Only supervisor hours", "A fixed 200,000 regardless of company records"], 0, "The denominator is actual employee hours worked; the 200,000 factor standardizes the result to 100 full-time-equivalent workers.", ["recordkeeping", "hours-worked"], "applied", "HW-CH03-01"),
];

const CH04_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH04-01", "ch-04", 10, "An annual LOTO inspection finds an authorized worker skipping stored-pressure verification. What should happen?", ["Document the deviation, correct it, and retrain as appropriate", "Ignore it because a lock was attached", "Wait five years for the next inspection", "Replace the energy-control procedure with a warning sign"], 0, "Periodic inspection must identify and correct deviations or inadequacies and verify employee responsibilities.", ["lockout-tagout", "inspection"], "exam", "HW-CH04-03"),
  q("RV-CH04-02", "ch-04", 9, "A tank has limited entry, is not designed for continuous occupancy, and could contain a toxic atmosphere. What program decision follows?", ["Evaluate and control it as a permit-required confined space", "Treat it as an ordinary office", "Allow entry because the tank is empty now", "Use a permit only after an injury"], 0, "The space meets confined-space criteria and has a potential atmospheric hazard, so permit-space requirements must be evaluated and implemented before entry.", ["confined-space", "permit-space"], "applied", "HW-CH04-02"),
  q("RV-CH04-03", "ch-04", 16, "A distributor receives a properly labeled chemical and ships it without changing composition. Who was responsible for the original hazard classification?", ["The manufacturer or importer", "The first exposed employee", "The fire department", "The distributor's customer"], 0, "Manufacturers and importers classify the chemical; distributors transmit the resulting hazard information through the supply chain.", ["hazcom", "classification"], "applied", "HW-CH04-09"),
  q("RV-CH04-04", "ch-04", 11, "A guardrail prevents falls, but bolts could be kicked from the edge onto people below. What additional control is directly indicated?", ["Toe board, screen, or equivalent falling-object protection", "Remove the top rail", "Paint the bolts a bright color", "Increase platform height"], 0, "Where objects can fall, toe boards, screens, canopies, barricades, or other effective controls supplement the employee fall-protection system.", ["falling-objects", "toe-board"], "applied", "HW-CH04-04"),
  q("RV-CH04-05", "ch-04", 17, "Who may challenge whether a cited hazard's abatement period is reasonable on behalf of affected employees?", ["Affected employees or their authorized representative through the prescribed contest process", "Only the equipment manufacturer", "No one after the citation is issued", "Any customer using an informal phone call"], 0, "The OSH Act process permits affected employees or their representatives to contest the reasonableness of the abatement period.", ["abatement", "employee-rights"], "exam", "HW-CH04-10"),
];

const CH05_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH05-01", "ch-05", 3, "A 12-inch round duct carries air at 1,800 ft/min. Approximately what flow results?", ["785 cfm", "1,414 cfm", "1,800 cfm", "5,655 cfm"], 1, "Radius is 0.5 ft, area is pi(0.5)^2 = 0.785 ft2, and Q = 1,800 x 0.785 = about 1,414 cfm.", ["airflow", "geometry"], "applied", "HW-CH05-01"),
  q("RV-CH05-02", "ch-05", 4, "Evaluate 2 + 3(5 - 1)^2.", ["50", "38", "29", "14"], 0, "Parentheses first give 4, then exponent gives 16, multiplication gives 48, and addition gives 50.", ["pemdas", "calculation"], "foundation", "HW-CH05-02"),
  q("RV-CH05-03", "ch-05", 5, "An investment of $2,000 grows by 5% for two years. What is its future value?", ["$2,100", "$2,200", "$2,205", "$2,500"], 2, "Future value is 2,000(1.05)^2 = $2,205.", ["compound-growth", "exponents"], "applied", "HW-CH05-03"),
  q("RV-CH05-04", "ch-05", 7, "Rearrange Q = VA to solve for velocity V.", ["V = Q/A", "V = QA", "V = A/Q", "V = Q + A"], 0, "Dividing both sides by area isolates velocity: V = Q/A.", ["algebra", "formula-transposition"], "foundation", "HW-CH05-05"),
  q("RV-CH05-05", "ch-05", 8, "A rectangular containment area has 240 ft2 of active floor area and must hold 600 ft3. What wall height is required before freeboard?", ["1.5 ft", "2.0 ft", "2.5 ft", "4.0 ft"], 2, "Height = volume/area = 600/240 = 2.5 ft.", ["secondary-containment", "geometry"], "applied", "HW-CH05-06"),
];

const CH06_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH06-01", "ch-06", 3, "A gas occupies 250 mL in a 2.00-m3 room. What is its concentration by volume?", ["12.5 ppm", "125 ppm", "250 ppm", "2,000 ppm"], 1, "Two cubic meters equal 2,000,000 mL; 250/2,000,000 x 10^6 = 125 ppm.", ["ppm", "volume-concentration"], "applied", "HW-CH06-02"),
  q("RV-CH06-02", "ch-06", 5, "Exposure is 40 ppm for 1 h, 10 ppm for 3 h, and zero for 4 h. What is the 8-hour TWA?", ["5 ppm", "8.75 ppm", "12.5 ppm", "50 ppm"], 1, "The dose sum is 40 + 30 = 70 ppm-hours; 70/8 = 8.75 ppm.", ["twa", "calculation"], "applied", "HW-CH06-04"),
  q("RV-CH06-03", "ch-06", 4, "At 25 degrees C and 1 atm, 49.0 mg/m3 of a vapor with molecular weight 98 corresponds to approximately what ppm?", ["4.9 ppm", "12.2 ppm", "49 ppm", "196 ppm"], 1, "ppm = 49.0 x 24.45/98 = 12.23 ppm.", ["mg-m3", "ppm"], "exam", "HW-CH06-03"),
  q("RV-CH06-04", "ch-06", 7, "Why must gauge and absolute pressure be handled carefully in a gas-law calculation?", ["Gas laws use absolute pressure for state comparisons", "Gauge pressure is always larger by 100 psi", "Temperature eliminates pressure units", "Pressure has no effect on gas volume"], 0, "State equations require an absolute pressure reference; mixing gauge and absolute values can produce a materially wrong volume.", ["gas-law", "absolute-pressure", "compressed-gas"], "exam", "HW-CH06-06"),
  q("RV-CH06-05", "ch-06", 6, "Which agency term identifies an enforceable federal OSHA airborne exposure limit?", ["PEL", "REL", "TLV", "IDLH"], 0, "PEL means permissible exposure limit and is OSHA's enforceable limit; REL, TLV, and IDLH values come from other organizations and serve different purposes.", ["pel", "exposure-limits"], "foundation", "HW-CH06-05"),
];

const CH07_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH07-01", "ch-07", 6, "Two solvents each cause a toxicity score of 2 alone and a score of about 4 together. Which interaction is illustrated?", ["Additivity", "Synergism", "Potentiation", "Antagonism"], 0, "An additive effect equals the sum of the separate effects: 2 + 2 = 4.", ["additivity", "chemical-interactions"], "applied", "HW-CH07-05"),
  q("RV-CH07-02", "ch-07", 5, "A cancer becomes detectable 20 years after a causal occupational exposure. The 20-year interval is what?", ["Latency", "Half-life", "Dose ceiling", "Potentiation"], 0, "Latency is the interval between the causal event and detectable disease manifestation.", ["latency", "occupational-disease"], "applied", "HW-CH07-04"),
  q("RV-CH07-03", "ch-07", 8, "A dose is 8 mg/kg for a 75-kg worker. What total mass does that dose represent?", ["9.4 mg", "83 mg", "600 mg", "6,000 mg"], 2, "Total mass = 8 mg/kg x 75 kg = 600 mg.", ["dose", "calculation"], "applied", "HW-CH07-07"),
  q("RV-CH07-04", "ch-07", 2, "A worker becomes dizzy shortly after a ten-minute high solvent exposure during spill response. How is the exposure pattern best classified?", ["Acute", "Chronic", "A latency period", "Antagonistic"], 0, "A high exposure over minutes with prompt effects is an acute exposure pattern, even though some acute exposures can also have delayed consequences.", ["acute-exposure", "dose-response"], "applied", "HW-CH07-01"),
  q("RV-CH07-05", "ch-07", 7, "Protein in urine after chronic cadmium exposure most strongly points to injury in which target organ?", ["Kidney", "Middle ear", "Thyroid only", "Spleen only"], 0, "Cadmium can damage renal tubules, leading to low-molecular-weight proteinuria and declining kidney function.", ["cadmium", "kidney"], "applied", "HW-CH07-06"),
];

const CH10_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH10-01", "ch-10", 9, "Two identical independent sources each produce 90 dB at a point. What is the combined level?", ["90 dB", "93 dB", "100 dB", "180 dB"], 1, "Doubling equal sound energy adds about 3 dB, so two 90-dB sources combine to about 93 dB.", ["decibel-addition", "noise"], "applied", "HW-CH10-08"),
  q("RV-CH10-02", "ch-10", 8, "Under a 5-dB exchange method, what happens to allowable exposure time when level rises by 5 dB?", ["It doubles", "It is halved", "It is unchanged", "It becomes zero"], 1, "An exchange rate of 5 dB means each 5-dB increase halves allowable duration for the same dose.", ["exchange-rate", "noise-dose"], "foundation", "HW-CH10-07"),
  q("RV-CH10-03", "ch-10", 5, "A maintenance worker visits many noisy areas for irregular periods. Which device best captures the full-shift dose?", ["Personal dosimeter", "Fixed area microphone in one room", "Thermometer", "Tachometer"], 0, "A dosimeter follows the worker and integrates the changing exposure over the shift.", ["dosimeter", "personal-exposure"], "applied", "HW-CH10-04"),
  q("RV-CH10-04", "ch-10", 10, "In a free field, a worker doubles distance from a point source. Approximately how much does sound level change?", ["It increases 6 dB", "It decreases 3 dB", "It decreases 6 dB", "It decreases 20 dB"], 2, "Doubling distance produces an approximate 6-dB decrease for a point source in a free field.", ["inverse-square", "distance"], "applied", "HW-CH10-09"),
  q("RV-CH10-05", "ch-10", 11, "Which intervention acts on the noise-transmission path?", ["Installing an acoustic barrier between source and worker", "Scheduling an audiogram", "Posting the measured level", "Selecting a different recordkeeping code"], 0, "A barrier interrupts the path between source and receiver; it is an engineering control when properly designed.", ["noise-control", "path-control"], "applied", "HW-CH10-10"),
];

const CH11_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH11-01", "ch-11", 4, "A worker has a positive TB test but no symptoms and no evidence of active pulmonary disease. Which statement is best?", ["This is consistent with latent infection, which is not itself contagious", "The worker must be coughing infectious droplets", "The test proves active disease", "Latent TB cannot be treated"], 0, "A positive test can indicate latent infection; active disease requires further clinical evaluation, and latent infection is not contagious.", ["tuberculosis", "latent-infection"], "applied", "HW-CH11-03"),
  q("RV-CH11-02", "ch-11", 5, "An autoclave cycle destroys all viable microorganisms, including resistant spores. Which term best fits?", ["Sterilization", "Disinfection", "Sanitizing only", "Antisepsis only"], 0, "Sterilization is the process intended to eliminate all forms of microbial life, including bacterial spores.", ["sterilization", "infection-control"], "applied", "HW-CH11-04"),
  q("RV-CH11-03", "ch-11", 9, "A procedure may generate aerosols from a human blood specimen. Which control is most directly indicated?", ["Perform the aerosol-generating step in an appropriate certified biological safety cabinet", "Perform it on an open desk", "Rely only on room odor", "Downgrade the work to BSL-1 automatically"], 0, "An appropriate biological safety cabinet provides primary containment for aerosol-generating work, combined with BSL-2 practices and task-specific PPE.", ["biosafety-cabinet", "aerosol", "blood", "biosafety-level"], "exam", "HW-CH11-08"),
  q("RV-CH11-04", "ch-11", 7, "A blood specimen has no visible blood on the outside of its tube. How should it be handled?", ["Using standard precautions because appearance does not establish absence of infection", "As noninfectious based on appearance", "Without hand hygiene", "Only after an HIV result is available"], 0, "Standard precautions do not rely on visible contamination or known diagnosis; the controls are applied based on the anticipated task exposure.", ["standard-precautions", "blood"], "applied", "HW-CH11-06"),
  q("RV-CH11-05", "ch-11", 11, "Which pair correctly distinguishes primary and secondary containment?", ["A safety cabinet is primary; controlled laboratory design is secondary", "A warning label is primary; vaccination is secondary", "Room ventilation is primary; gloves are secondary", "There is no distinction"], 0, "Primary containment protects people and the immediate environment through practices and equipment; secondary containment is provided by facility design and operation.", ["containment", "biosafety"], "exam", "HW-CH11-10"),
];

const CH12_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH12-01", "ch-12", 5, "Two liquids are at the same room temperature. Liquid A has a substantially lower flash point than Liquid B. What does that imply under comparable test conditions?", ["Liquid A can form an ignitable vapor mixture at a lower temperature", "Liquid A cannot evaporate", "Liquid B must be noncombustible", "Flash point is the same as boiling point"], 0, "A lower flash point means the liquid can produce enough vapor for momentary ignition at a lower temperature.", ["flash-point", "flammable-liquids"], "applied", "HW-CH12-04"),
  q("RV-CH12-02", "ch-12", 2, "A clean-agent system stops flame propagation mainly by disrupting the combustion chain reaction. Which element of the fire tetrahedron is targeted?", ["Chemical chain reaction", "Fuel geometry only", "Gravity", "Atmospheric pressure"], 0, "The tetrahedron adds the sustaining chemical chain reaction to heat, fuel, and oxidizer; interrupting that reaction can extinguish flame.", ["fire-tetrahedron", "chain-reaction"], "applied", "HW-CH12-01"),
  q("RV-CH12-03", "ch-12", 9, "A vapor concentration is above its upper flammable limit. Which statement is accurate?", ["It is too rich to propagate flame under those conditions but may become ignitable when diluted", "It is permanently safe", "It is below the lower limit", "No oxygen concentration could matter"], 0, "A mixture above the UFL is too fuel-rich at that moment, but mixing with air can move it into the flammable range.", ["ufl", "flammable-range"], "exam", "HW-CH12-08"),
  q("RV-CH12-04", "ch-12", 10, "Why is water usually effective on a deep-seated ordinary-combustible fire?", ["It absorbs heat and can cool material below its sustaining temperature", "It always excludes every molecule of oxygen", "It raises the fuel vapor pressure", "It is safe on energized equipment in all circumstances"], 0, "Water absorbs substantial sensible and latent heat, but agent selection must still account for electrical and reactive-material hazards.", ["water", "cooling"], "applied", "HW-CH12-09"),
  q("RV-CH12-05", "ch-12", 6, "Solvent vapor migrates along the floor to a distant pilot flame. Which property most directly explains the travel pattern?", ["Vapor density greater than air", "High electrical conductivity", "Low liquid specific gravity only", "High surface tension"], 0, "A vapor denser than air tends to accumulate and move through low areas, allowing flashback from a remote ignition source.", ["vapor-density", "flashback"], "applied", "HW-CH12-05"),
];

const CH13_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH13-01", "ch-13", 3, "Indoors without solar load, natural wet-bulb is 78 degrees F and globe temperature is 96 degrees F. Using WBGT = 0.7WB + 0.3GT, what is WBGT?", ["78.0 degrees F", "83.4 degrees F", "87.0 degrees F", "96.0 degrees F"], 1, "WBGT = 0.7(78) + 0.3(96) = 54.6 + 28.8 = 83.4 degrees F.", ["wbgt", "calculation"], "applied", "HW-CH13-02"),
  q("RV-CH13-02", "ch-13", 7, "A returning worker has been away from the hot job for three weeks. What is prudent?", ["Use a staged reacclimatization schedule", "Assume acclimatization is fully retained", "Begin with mandatory overtime", "Remove all recovery breaks"], 0, "Heat acclimatization is partly lost during extended absence, so workload and exposure should again increase progressively.", ["acclimatization", "return-to-work"], "applied", "HW-CH13-06"),
  q("RV-CH13-03", "ch-13", 6, "Which finding most clearly separates heat stroke from uncomplicated heat exhaustion?", ["Altered mental status", "Thirst", "Sweating", "Fatigue"], 0, "Confusion, seizures, collapse with neurologic dysfunction, or other altered mental status is a defining emergency sign of heat stroke.", ["heat-stroke", "differential"], "exam", "HW-CH13-05"),
  q("RV-CH13-04", "ch-13", 10, "A worker in cold wind develops numb, pale skin on the fingers. What is the immediate concern?", ["Localized cold injury such as frostbite", "Heat rash", "Metal fume fever", "Decompression sickness"], 0, "Numbness and pale or waxy skin after cold exposure are warning signs of frostbite and require prompt protection and medical evaluation according to severity.", ["cold-stress", "frostbite", "wind-chill"], "applied", "HW-CH13-09"),
  q("RV-CH13-05", "ch-13", 2, "Why does high humidity increase heat strain during heavy work?", ["It reduces the vapor-pressure gradient and limits sweat evaporation", "It always lowers metabolic heat", "It guarantees more convective cooling", "It prevents the body from producing sweat"], 0, "High ambient moisture reduces the capacity for sweat to evaporate, so sweating may continue without providing adequate cooling.", ["humidity", "evaporation"], "exam", "HW-CH13-01"),
];

const CH15_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH15-01", "ch-15", 8, "A result is 70, the mean is 50, and the standard deviation is 10. What is the z-score?", ["-2", "0.5", "2", "7"], 2, "z = (70-50)/10 = 2.", ["z-score", "calculation"], "applied", "HW-CH15-07"),
  q("RV-CH15-02", "ch-15", 2, "What is the mean of 4, 6, 8, and 10?", ["6", "7", "8", "28"], 1, "The sum is 28 and 28/4 = 7.", ["mean", "calculation"], "foundation", "HW-CH15-01"),
  q("RV-CH15-03", "ch-15", 9, "A study reports r = -0.88. Which interpretation is best?", ["A strong negative linear association", "No relationship", "An impossible correlation", "Proof that one variable causes the other"], 0, "The magnitude 0.88 indicates a strong linear association and the negative sign indicates opposite direction; correlation alone does not prove causation.", ["correlation", "interpretation"], "exam", "HW-CH15-08"),
  q("RV-CH15-04", "ch-15", 11, "Three independent series components have reliabilities 0.98, 0.95, and 0.90. What is system reliability?", ["0.838", "0.900", "0.943", "2.83"], 0, "Series reliability = 0.98 x 0.95 x 0.90 = 0.8379, approximately 0.838.", ["series-reliability", "reliability", "calculation"], "exam", "HW-CH15-10"),
  q("RV-CH15-05", "ch-15", 10, "A defect rate is 2.5%. How many defects are expected in 1,200 units if the rate remains stable?", ["3", "12", "30", "48"], 2, "Expected defects = 0.025 x 1,200 = 30.", ["expected-count", "proportion"], "applied", "HW-CH15-09"),
];

const CH16_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH16-01", "ch-16", 3, "A 1.5-kW heater runs for 8 hours at $0.12 per kWh. What does it cost?", ["$0.18", "$0.96", "$1.44", "$14.40"], 2, "Energy = 1.5 x 8 = 12 kWh; cost = 12 x $0.12 = $1.44.", ["energy-cost", "calculation"], "applied", "HW-CH16-02"),
  q("RV-CH16-02", "ch-16", 5, "A tool has 5.003 A on the hot conductor and 4.997 A returning on neutral. What leakage imbalance exists?", ["0.006 A", "0.060 A", "5.000 A", "10.000 A"], 0, "The difference is 0.006 A, or 6 mA, which is in the range a Class A GFCI is intended to detect and interrupt.", ["gfci", "current-imbalance"], "applied", "HW-CH16-04"),
  q("RV-CH16-03", "ch-16", 9, "A single-phase resistive load draws 12 A at 240 V. What power does it use?", ["0.05 kW", "2.88 kW", "20 kW", "28.8 kW"], 1, "P = VI = 240 x 12 = 2,880 W = 2.88 kW.", ["electrical-power", "calculation"], "applied", "HW-CH16-08"),
  q("RV-CH16-04", "ch-16", 8, "Two 100-ohm resistors are connected in parallel. What is equivalent resistance?", ["25 ohms", "50 ohms", "100 ohms", "200 ohms"], 1, "For two equal parallel resistors, equivalent resistance is half either value: 50 ohms.", ["parallel-resistance", "calculation"], "applied", "HW-CH16-07"),
  q("RV-CH16-05", "ch-16", 11, "An overloaded extension cord is coiled under combustible material. Which mechanism creates the immediate fire concern?", ["I2R heating can overheat insulation and nearby fuel", "Current makes the cord colder", "The coil eliminates resistance", "The combustible material lowers current to zero"], 0, "Overcurrent increases resistive heating; poor heat dissipation and nearby fuel increase the likelihood of insulation failure and ignition.", ["overload", "i2r-heating"], "exam", "HW-CH16-10"),
];

const CH17_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH17-01", "ch-17", 2, "A 400-lbf load on a level surface has coefficient of friction 0.25. What ideal horizontal force is required at the friction limit?", ["25 lbf", "100 lbf", "160 lbf", "400 lbf"], 1, "F = mu N = 0.25 x 400 = 100 lbf.", ["friction", "calculation"], "applied", "HW-CH17-01"),
  q("RV-CH17-02", "ch-17", 6, "A 300-lbf load acts 2 ft from a pivot. At what force 5 ft from the pivot will the moment balance?", ["60 lbf", "120 lbf", "300 lbf", "750 lbf"], 1, "Set moments equal: 300 x 2 = F x 5, giving F = 120 lbf.", ["moment", "lever"], "applied", "HW-CH17-04"),
  q("RV-CH17-03", "ch-17", 3, "A 10-kg object moves at 4 m/s. What is its kinetic energy?", ["20 J", "40 J", "80 J", "160 J"], 2, "KE = 0.5 x 10 x 4^2 = 80 J.", ["kinetic-energy", "calculation"], "applied", "HW-CH17-02"),
  q("RV-CH17-04", "ch-17", 7, "A cart moving 18 m/s decelerates uniformly at 3 m/s2. How long does it take to stop?", ["3 s", "6 s", "9 s", "54 s"], 1, "Stopping time = 18/3 = 6 seconds.", ["deceleration", "kinematics"], "applied", "HW-CH17-05"),
  q("RV-CH17-05", "ch-17", 9, "Uniform pressure of 0.02 psi acts on a 10-ft by 20-ft panel. What force results?", ["4 lbf", "400 lbf", "576 lbf", "28,800 lbf"], 2, "Area = 200 ft2 x 144 = 28,800 in2; force = 0.02 x 28,800 = 576 lbf.", ["pressure", "force"], "exam", "HW-CH17-06"),
];

const CH18_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH18-01", "ch-18", 12, "A pump draws from 30 ft below grade and discharges 45 ft above grade. What static head is required before losses?", ["15 ft", "30 ft", "45 ft", "75 ft"], 3, "The elevation rise is 30 + 45 = 75 ft.", ["pump-head", "elevation"], "applied", "HW-CH18-03"),
  q("RV-CH18-02", "ch-18", 8, "A nozzle has K = 5.6 at 25 psi. Using Q = K sqrt(P), what is flow?", ["11.2 gpm", "28 gpm", "30.6 gpm", "140 gpm"], 1, "Q = 5.6 x sqrt(25) = 5.6 x 5 = 28 gpm.", ["sprinkler-flow", "calculation"], "applied", "HW-CH18-02"),
  q("RV-CH18-03", "ch-18", 4, "A water pressure of 30 psi corresponds to approximately how much water head using 2.31 ft/psi?", ["13.0 ft", "30.0 ft", "69.3 ft", "96.6 ft"], 2, "Head = 30 x 2.31 = 69.3 ft of water.", ["pressure-head", "calculation"], "applied", "HW-CH18-01"),
  q("RV-CH18-04", "ch-18", 12, "Why is actual pump total dynamic head usually greater than the simple elevation difference?", ["Pipe, fitting, and equipment friction add head loss", "Water has no weight", "Static head is always negative", "Pressure units eliminate friction"], 0, "Real systems require the pump to overcome both static elevation and dynamic losses through piping, fittings, valves, and equipment.", ["pump-head", "friction-loss"], "exam", "HW-CH18-03"),
  q("RV-CH18-05", "ch-18", 4, "If velocity head increases by a factor of four, ideal flow velocity changes by what factor?", ["One-half", "Two", "Four", "Sixteen"], 1, "Because v = sqrt(2gh), velocity varies with the square root of head; sqrt(4) = 2.", ["velocity-head", "square-root"], "exam", "HW-CH18-01"),
];

const CH19_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH19-01", "ch-19", 3, "Which objective is observable and testable?", ["Workers will know fall protection", "Workers will value safety", "Given four anchors, workers will identify the approved anchor with no errors", "Workers will understand height"], 2, "The objective specifies conditions, observable action, and criterion, making performance measurable.", ["learning-objective", "assessment"], "applied", "HW-CH19-02"),
  q("RV-CH19-02", "ch-19", 7, "A procedure is clear and workers can demonstrate it, but production incentives reward skipping steps. What is the primary intervention?", ["Correct the incentive and accountability system", "Repeat the same knowledge lecture", "Add more slides", "Shorten the test"], 0, "The cause is organizational reinforcement, not lack of knowledge or skill, so the performance system must be corrected.", ["needs-analysis", "non-training-solution"], "exam", "HW-CH19-06"),
  q("RV-CH19-03", "ch-19", 5, "Which gap is most suitable for training?", ["A new employee does not know the required inspection sequence", "A guard is physically missing", "A valve is mechanically defective", "The written procedure specifies the wrong limit"], 0, "A verified knowledge or skill gap is suitable for training; equipment and process-design defects require other controls.", ["training-needs", "performance-gap"], "applied", "HW-CH19-04"),
  q("RV-CH19-04", "ch-19", 11, "Posttest scores rise, but field observation shows no change in work practice. What conclusion is justified?", ["Learning may have occurred, but transfer to the job has not been demonstrated", "The program is fully effective", "The posttest proves incident reduction", "Observation should be ignored"], 0, "Knowledge gain is one evaluation level; application and operational results require separate evidence.", ["evaluation", "transfer"], "exam", "HW-CH19-10"),
  q("RV-CH19-05", "ch-19", 9, "A virtual module teaches concepts, followed by coached hands-on practice. Why is this blend defensible?", ["The media are matched to knowledge and performance objectives", "Computer delivery proves competence", "Hands-on practice is unnecessary", "Cost alone determines method"], 0, "Concept instruction can be delivered digitally, while coached practice and feedback support performance-based objectives.", ["blended-learning", "delivery-method"], "applied", "HW-CH19-08"),
];

const CH23_REVIEW: readonly HomeworkQuestion[] = [
  q("RV-CH23-01", "ch-23", 10, "How should an experience modifier of 0.82 generally be interpreted?", ["Loss experience is about 18% more favorable than the rating benchmark", "Loss experience is 82% worse", "Premium must equal 82 dollars", "No loss history was used"], 0, "A modifier below 1.00 generally indicates better-than-expected experience and tends to reduce the experience-rated premium component.", ["emr", "interpretation"], "applied", "HW-CH23-07"),
  q("RV-CH23-02", "ch-23", 6, "An employee has a covered work injury but cannot show anyone was careless. What workers' compensation principle remains relevant?", ["No-fault benefit eligibility", "Strict requirement to prove negligence", "Automatic punitive damages", "No medical benefit can be paid"], 0, "Workers' compensation generally does not require proof of employer negligence for a covered work-related injury.", ["no-fault", "benefits"], "applied", "HW-CH23-03"),
  q("RV-CH23-03", "ch-23", 7, "Why should a safety professional avoid promising that wage replacement equals the worker's full paycheck?", ["Benefits are usually a statutory fraction and may be capped", "Benefits always exceed wages", "Medical care replaces wage benefits", "Overtime is doubled automatically"], 0, "The governing jurisdiction defines the wage-replacement percentage, waiting periods, duration, and caps.", ["wage-replacement", "jurisdiction"], "applied", "HW-CH23-04"),
  q("RV-CH23-04", "ch-23", 11, "A splinter is removed with tweezers and the wound is covered with a simple bandage. No other criterion applies. What is the OSHA recordkeeping result?", ["First aid only, so not recordable on those facts", "Automatically a days-away case", "Automatically restricted work", "Always medical treatment beyond first aid"], 0, "Removing a splinter by simple means and using a non-rigid wound covering are first aid; absent another criterion, the case is not recordable.", ["first-aid", "recordkeeping"], "applied", "HW-CH23-08"),
  q("RV-CH23-05", "ch-23", 5, "Why must a multistate employer check the jurisdiction for each workers' compensation claim?", ["Benefit and procedure rules are primarily state-specific", "A single global policy controls every claim", "Only federal criminal law applies", "Insurance terms never vary"], 0, "State workers' compensation statutes and administrative systems differ in coverage, benefits, procedure, and exceptions.", ["state-law", "workers-compensation"], "applied", "HW-CH23-02"),
];

export const REVIEW_QUESTIONS: readonly HomeworkQuestion[] = [
  ...CH02_REVIEW,
  ...CH03_REVIEW,
  ...CH04_REVIEW,
  ...CH05_REVIEW,
  ...CH06_REVIEW,
  ...CH07_REVIEW,
  ...CH10_REVIEW,
  ...CH11_REVIEW,
  ...CH12_REVIEW,
  ...CH13_REVIEW,
  ...CH15_REVIEW,
  ...CH16_REVIEW,
  ...CH17_REVIEW,
  ...CH18_REVIEW,
  ...CH19_REVIEW,
  ...CH23_REVIEW,
];

const EXPECTED_HOMEWORK_COUNTS = {
  "ch-02": 6,
  "ch-03": 2,
  "ch-04": 10,
  "ch-05": 6,
  "ch-06": 7,
  "ch-07": 7,
  "ch-10": 10,
  "ch-11": 10,
  "ch-12": 10,
  "ch-13": 10,
  "ch-15": 12,
  "ch-16": 10,
  "ch-17": 8,
  "ch-18": 3,
  "ch-19": 10,
  "ch-23": 8,
} as const;

const homeworkCountByChapter = Object.fromEntries(
  Object.keys(EXPECTED_HOMEWORK_COUNTS).map((chapterId) => [
    chapterId,
    HOMEWORK_QUESTIONS.filter((question) => question.chapterId === chapterId).length,
  ]),
) as Record<keyof typeof EXPECTED_HOMEWORK_COUNTS, number>;

const reviewCountByChapter = Object.fromEntries(
  Object.keys(EXPECTED_HOMEWORK_COUNTS).map((chapterId) => [
    chapterId,
    REVIEW_QUESTIONS.filter((question) => question.chapterId === chapterId).length,
  ]),
) as Record<keyof typeof EXPECTED_HOMEWORK_COUNTS, number>;

export const CHAPTERS: readonly HomeworkChapter[] = [
  ...READY_CHAPTERS.map((chapter) => ({
    ...chapter,
    homeworkCount: homeworkCountByChapter[chapter.id as keyof typeof EXPECTED_HOMEWORK_COUNTS],
    reviewCount: reviewCountByChapter[chapter.id as keyof typeof EXPECTED_HOMEWORK_COUNTS],
  })),
  ...COMING_LATER_CHAPTERS.map((chapter) => ({ ...chapter, homeworkCount: 0, reviewCount: 0 })),
].sort((a, b) => a.courseNumber - b.courseNumber);

export const HOMEWORK_COUNTS = Object.freeze({
  readyChapters: READY_CHAPTERS.length,
  comingLaterChapters: COMING_LATER_CHAPTERS.length,
  totalChapters: CHAPTERS.length,
  homework: HOMEWORK_QUESTIONS.length,
  review: REVIEW_QUESTIONS.length,
  totalQuestions: HOMEWORK_QUESTIONS.length + REVIEW_QUESTIONS.length,
  homeworkByChapter: Object.freeze({ ...homeworkCountByChapter }),
  reviewByChapter: Object.freeze({ ...reviewCountByChapter }),
});

function validateHomeworkData(): void {
  const chaptersById = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));
  const homeworkById = new Map(HOMEWORK_QUESTIONS.map((question) => [question.id, question]));
  const allQuestions = [...HOMEWORK_QUESTIONS, ...REVIEW_QUESTIONS];
  const ids = new Set<string>();
  const stems = new Set<string>();

  if (HOMEWORK_QUESTIONS.length !== 129 || REVIEW_QUESTIONS.length !== 80) {
    throw new Error(`Homework data count mismatch: ${HOMEWORK_QUESTIONS.length} homework and ${REVIEW_QUESTIONS.length} review items.`);
  }

  for (const [chapterId, expected] of Object.entries(EXPECTED_HOMEWORK_COUNTS)) {
    if (homeworkCountByChapter[chapterId as keyof typeof EXPECTED_HOMEWORK_COUNTS] !== expected) {
      throw new Error(`Expected ${expected} homework items for ${chapterId}.`);
    }
    if (reviewCountByChapter[chapterId as keyof typeof EXPECTED_HOMEWORK_COUNTS] !== 5) {
      throw new Error(`Expected five review items for ${chapterId}.`);
    }
  }

  for (const chapter of CHAPTERS) {
    if (chapter.status === "ready" && (!chapter.sourcePdf || chapter.sourcePages.length === 0)) {
      throw new Error(`Ready chapter ${chapter.id} is missing source metadata.`);
    }
    if (chapter.status === "coming-later" && (chapter.homeworkCount !== 0 || chapter.reviewCount !== 0)) {
      throw new Error(`Coming-later chapter ${chapter.id} cannot contain questions.`);
    }
  }

  for (const question of allQuestions) {
    const chapter = chaptersById.get(question.chapterId);
    if (!chapter || chapter.status !== "ready") {
      throw new Error(`Question ${question.id} points to an unavailable chapter.`);
    }
    if (!chapter.sourcePages.includes(question.sourcePage)) {
      throw new Error(`Question ${question.id} has source page ${question.sourcePage} outside its chapter manifest.`);
    }
    if (ids.has(question.id)) throw new Error(`Duplicate homework question id: ${question.id}`);
    ids.add(question.id);
    const normalizedStem = question.stem.trim().toLowerCase();
    if (stems.has(normalizedStem)) throw new Error(`Duplicate homework stem: ${question.id}`);
    stems.add(normalizedStem);
    if (question.options.length !== 4 || new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) {
      throw new Error(`Question ${question.id} must have four distinct options.`);
    }
    if (question.tags.length === 0 || !question.rationale.trim()) {
      throw new Error(`Question ${question.id} is missing tags or rationale.`);
    }
    question.wrongRationales.forEach((feedback, index) => {
      const shouldBeCorrect = index === question.correctIndex;
      if (shouldBeCorrect !== feedback.startsWith("Correct:")) {
        throw new Error(`Question ${question.id} has a misaligned correctness marker at option ${index}.`);
      }
      if (!shouldBeCorrect && !feedback.startsWith("Incorrect:")) {
        throw new Error(`Question ${question.id} is missing an incorrect-response explanation at option ${index}.`);
      }
    });
  }

  for (const review of REVIEW_QUESTIONS) {
    if (!review.sourceQuestionId) throw new Error(`Review item ${review.id} is missing sourceQuestionId.`);
    const source = homeworkById.get(review.sourceQuestionId);
    if (!source || source.chapterId !== review.chapterId) {
      throw new Error(`Review item ${review.id} has invalid source provenance.`);
    }
    if (!review.tags.some((tag) => source.tags.includes(tag))) {
      throw new Error(`Review item ${review.id} does not retain tag provenance from ${source.id}.`);
    }
  }
}

validateHomeworkData();
