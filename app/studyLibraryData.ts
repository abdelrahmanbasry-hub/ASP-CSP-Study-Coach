/**
 * Original study aids structured from the supplied ASP formula reference and
 * the chapter organization in W. David Yates' study guide. Explanatory text,
 * examples, and flashcards are newly written for this application.
 */

import { ADDITIONAL_FORMULA_ENTRIES } from "./formulaSupplementData.ts";

export type FormulaCategory =
  | "Conversions"
  | "Reference Constants"
  | "Mathematics & Logic"
  | "Mechanics"
  | "Electricity"
  | "Ventilation"
  | "Industrial Hygiene & Gases"
  | "Ergonomics"
  | "Heat Stress"
  | "Heat Transfer"
  | "Radiation"
  | "Engineering Economy"
  | "Reliability"
  | "Noise"
  | "Hydraulics"
  | "Statistics & Probability";

export interface FormulaEntry {
  id: string;
  category: FormulaCategory;
  name: string;
  /** Plain text/Unicode so the formula remains searchable and screen-reader friendly. */
  formula: string;
  variables: readonly string[];
  units: string;
  whenToUse: string;
  commonError: string;
  workedExample: string;
  /** Page in the supplied ASP Formula Sheet PDF, with Yates chapter context when useful. */
  sourcePage: string;
}

export type FlashcardDeck =
  | "Homework Review"
  | "Formula Essentials"
  | "Toxicology"
  | "Biological Hazards"
  | "Exam Strategy";

export interface StudyFlashcard {
  id: string;
  deck: FlashcardDeck;
  chapterId?: string;
  front: string;
  back: string;
  tags: readonly string[];
}

export interface StudyLibraryValidation {
  valid: boolean;
  errors: readonly string[];
}

const CORE_FORMULA_ENTRIES: readonly FormulaEntry[] = [
  {
    id: "formula-conv-temperature",
    category: "Conversions",
    name: "Fahrenheit and Celsius",
    formula: "°C = (°F − 32) / 1.8; °F = 1.8(°C) + 32",
    variables: ["°C = temperature in Celsius", "°F = temperature in Fahrenheit"],
    units: "°C or °F",
    whenToUse: "Convert temperatures before applying a formula that requires a specific scale.",
    commonError: "For gas-law ratios, Celsius and Fahrenheit are not absolute scales; use kelvin or rankine.",
    workedExample: "95°F becomes (95 − 32) / 1.8 = 35°C.",
    sourcePage: "2",
  },
  {
    id: "formula-conv-absolute-temperature",
    category: "Conversions",
    name: "Absolute temperature",
    formula: "K = °C + 273; °R = °F + 460",
    variables: ["K = kelvin", "°R = degrees rankine"],
    units: "K or °R",
    whenToUse: "Prepare temperature values for gas-law calculations and thermodynamic ratios.",
    commonError: "Do not insert °C or °F directly into a gas-law ratio. The sheet's +273 and +460 are exam approximations; precise offsets are 273.15 and 459.67.",
    workedExample: "27°C is approximately 300 K.",
    sourcePage: "2",
  },
  {
    id: "formula-conv-pressure",
    category: "Conversions",
    name: "Atmospheric pressure equivalents",
    formula: "1 atm = 14.7 psi = 760 mm Hg = 29.92 in. Hg = 33.90 ft H₂O = 760 torr = 101.3 kPa",
    variables: ["atm = atmosphere", "psi = pounds per square inch", "mm/in. Hg = mercury-column pressure", "ft H₂O = water-column pressure"],
    units: "atm, psi, mm/in. Hg, ft H₂O, torr, or kPa",
    whenToUse: "Place all pressure terms on a common basis before solving a gas or ventilation problem.",
    commonError: "Distinguish absolute pressure from gauge pressure; gas laws normally require absolute pressure.",
    workedExample: "2 atm equals 29.4 psi or 202.6 kPa.",
    sourcePage: "2",
  },
  {
    id: "formula-conv-radiation",
    category: "Conversions",
    name: "Radiation unit pairs",
    formula: "1 Gy = 100 rad; 1 Sv = 100 rem; 1 Ci = 3.7 × 10¹⁰ Bq; 1 Bq = 1 disintegration/s",
    variables: ["Gy = gray", "Sv = sievert", "Ci = curie", "Bq = becquerel (one nuclear disintegration per second)"],
    units: "Gy/rad, Sv/rem, or Ci/Bq",
    whenToUse: "Translate between SI and traditional radiation units before comparing values.",
    commonError: "Gray/rad describe absorbed dose, while sievert/rem account for biological weighting.",
    workedExample: "0.25 Gy equals 25 rad; 0.02 Sv equals 2 rem.",
    sourcePage: "2",
  },
  {
    id: "formula-mech-force-weight",
    category: "Mechanics",
    name: "Force and weight",
    formula: "F = ma; W = mg",
    variables: ["F = force", "W = weight", "m = mass", "a = acceleration", "g = gravitational acceleration"],
    units: "N in SI; lbf in US customary units",
    whenToUse: "Relate a load to acceleration or convert mass into gravitational force.",
    commonError: "Mass and weight are not interchangeable; keep the unit system consistent.",
    workedExample: "A 10 kg mass accelerating at 2 m/s² requires 20 N; its weight near Earth is about 98 N.",
    sourcePage: "3",
  },
  {
    id: "formula-mech-velocity",
    category: "Mechanics",
    name: "Constant-acceleration velocity",
    formula: "v = v₀ + at",
    variables: ["v = final velocity", "v₀ = initial velocity", "a = constant acceleration", "t = elapsed time"],
    units: "m/s or ft/s",
    whenToUse: "Find final velocity when acceleration remains constant over a known time.",
    commonError: "Assign signs by direction before substituting; deceleration is a negative acceleration in the chosen positive direction.",
    workedExample: "Starting at 2 m/s with 3 m/s² for 4 s gives v = 14 m/s.",
    sourcePage: "3",
  },
  {
    id: "formula-mech-energy-work",
    category: "Mechanics",
    name: "Kinetic energy and work",
    formula: "KE = mv² / 2; Work = Fs",
    variables: ["m = mass", "v = speed", "F = force parallel to travel", "s = displacement"],
    units: "J (N·m) or ft·lbf",
    whenToUse: "Compare motion energy with the work needed to stop or move an object.",
    commonError: "Velocity is squared in kinetic energy; doubling speed quadruples KE.",
    workedExample: "A 5 kg object at 4 m/s has KE = 5 × 4² / 2 = 40 J.",
    sourcePage: "3",
  },
  {
    id: "formula-mech-moment",
    category: "Mechanics",
    name: "Moment balance",
    formula: "F₁d₁ = F₂d₂",
    variables: ["F = force", "d = perpendicular distance from the pivot"],
    units: "N·m or ft·lbf",
    whenToUse: "Solve a static lever or balance problem around a pivot.",
    commonError: "Use the perpendicular moment arm, not automatically the full length of the member.",
    workedExample: "A 200 N load 0.5 m from a pivot is balanced by 100 N applied 1 m away.",
    sourcePage: "3",
  },
  {
    id: "formula-elec-ohm",
    category: "Electricity",
    name: "Ohm's law",
    formula: "V = IR",
    variables: ["V = voltage", "I = current", "R = resistance"],
    units: "V, A, Ω",
    whenToUse: "Solve for voltage, current, or resistance in a resistive circuit.",
    commonError: "Rearrange algebraically before inserting values; do not divide by the wrong term.",
    workedExample: "A 120 V source across 20 Ω produces I = 120 / 20 = 6 A.",
    sourcePage: "3",
  },
  {
    id: "formula-elec-power",
    category: "Electricity",
    name: "Electrical power",
    formula: "P = VI",
    variables: ["P = power", "V = voltage", "I = current"],
    units: "W, V, A",
    whenToUse: "Determine the rate of electrical energy use in a DC or unity-power-factor example.",
    commonError: "AC problems may require a power factor; do not assume P = VI covers every AC load.",
    workedExample: "120 V at 6 A uses 720 W.",
    sourcePage: "3",
  },
  {
    id: "formula-elec-series-resistance",
    category: "Electricity",
    name: "Resistors in series",
    formula: "Rₜ = R₁ + R₂ + … + Rₙ",
    variables: ["Rₜ = total resistance", "R₁…Rₙ = component resistances"],
    units: "Ω",
    whenToUse: "Combine resistors connected along a single current path.",
    commonError: "Do not apply the reciprocal rule used for parallel resistors.",
    workedExample: "2 Ω, 3 Ω, and 5 Ω in series total 10 Ω.",
    sourcePage: "3",
  },
  {
    id: "formula-elec-parallel-resistance",
    category: "Electricity",
    name: "Resistors in parallel",
    formula: "1/Rₜ = 1/R₁ + 1/R₂ + … + 1/Rₙ",
    variables: ["Rₜ = total resistance", "R₁…Rₙ = branch resistances"],
    units: "Ω",
    whenToUse: "Combine resistors connected across the same two nodes.",
    commonError: "The total must be less than the smallest branch resistance; otherwise recheck the reciprocal step.",
    workedExample: "6 Ω in parallel with 3 Ω gives 1/Rₜ = 1/6 + 1/3 = 1/2, so Rₜ = 2 Ω.",
    sourcePage: "3",
  },
  {
    id: "formula-vent-flow",
    category: "Ventilation",
    name: "Volumetric airflow",
    formula: "Q = AV",
    variables: ["Q = volumetric flow", "A = duct cross-sectional area", "V = average air velocity"],
    units: "cfm when A is ft² and V is fpm; m³/s in SI",
    whenToUse: "Convert measured duct velocity and area into airflow.",
    commonError: "Use consistent area units and an average velocity representative of the duct traverse.",
    workedExample: "12 ft² at 100 fpm carries Q = 1,200 cfm.",
    sourcePage: "18",
  },
  {
    id: "formula-vent-velocity-pressure",
    category: "Ventilation",
    name: "Velocity from velocity pressure",
    formula: "V = 4005√VP",
    variables: ["V = air velocity", "VP = velocity pressure in inches of water"],
    units: "fpm and in. H₂O at standard air density",
    whenToUse: "Estimate standard-air duct velocity from a velocity-pressure measurement.",
    commonError: "The constant assumes standard air; density corrections may be needed under nonstandard conditions.",
    workedExample: "VP = 0.25 in. H₂O gives V = 4005 × 0.5 ≈ 2,003 fpm.",
    sourcePage: "18",
  },
  {
    id: "formula-vent-capture",
    category: "Ventilation",
    name: "Plain-opening capture velocity",
    formula: "V = Q / (10x² + A), or Q = V(10x² + A)",
    variables: ["V = capture velocity", "Q = airflow", "x = distance from hood", "A = hood opening area"],
    units: "V in fpm, Q in cfm, x in ft, A in ft²",
    whenToUse: "Estimate flow for an unflanged plain opening under the assumptions of the reference equation.",
    commonError: "Distance is squared, so small increases in hood distance can sharply increase required flow.",
    workedExample: "For 150 fpm at x = 2 ft with A = 4 ft², Q = 150(40 + 4) = 6,600 cfm.",
    sourcePage: "19",
  },
  {
    id: "formula-vent-dilution",
    category: "Ventilation",
    name: "Steady-state dilution airflow",
    formula: "Q = G / C",
    variables: ["Q = required clean-air flow", "G = contaminant generation rate", "C = target volume fraction"],
    units: "Use matching volume/time units for Q and G; C is dimensionless",
    whenToUse: "Screen a well-mixed, steady generation problem where dilution ventilation is technically appropriate.",
    commonError: "Convert ppm to a decimal fraction and apply any needed safety or mixing factor separately.",
    workedExample: "G = 2 cfm and C = 0.001 require Q = 2,000 cfm before adjustment factors.",
    sourcePage: "19",
  },
  {
    id: "formula-ih-ideal-gas",
    category: "Industrial Hygiene & Gases",
    name: "Ideal gas law",
    formula: "PV = nRT",
    variables: ["P = absolute pressure", "V = volume", "n = amount in moles", "R = compatible gas constant", "T = absolute temperature"],
    units: "Depends on the selected R; one common set is atm, L, mol, and K",
    whenToUse: "Relate pressure, volume, temperature, and amount for an approximately ideal gas.",
    commonError: "Mixing an SI gas constant with litre-atmosphere inputs produces a wrong result.",
    workedExample: "At 1 atm and 298 K, 1 mol occupies V ≈ 0.08205 × 298 = 24.45 L.",
    sourcePage: "17",
  },
  {
    id: "formula-ih-combined-gas",
    category: "Industrial Hygiene & Gases",
    name: "Combined gas law",
    formula: "P₁V₁/T₁ = P₂V₂/T₂",
    variables: ["P = absolute pressure", "V = volume", "T = absolute temperature"],
    units: "Any consistent pressure and volume units; T in K or °R",
    whenToUse: "Compare two states of a fixed amount of gas.",
    commonError: "Gauge pressure and nonabsolute temperature cannot be substituted directly.",
    workedExample: "At constant pressure, 10 L at 300 K becomes 11 L at 330 K.",
    sourcePage: "17",
  },
  {
    id: "formula-ih-ppm",
    category: "Industrial Hygiene & Gases",
    name: "Gas and vapour concentration in ppm",
    formula: "ppm = (mg/m³ × 24.45) / MW; Cppm = (Pv/Pb) × 10⁶",
    variables: ["MW = molecular weight in g/mol", "24.45 = molar volume at 25°C and 1 atm", "Pv = vapour partial pressure", "Pb = absolute barometric pressure"],
    units: "mg/m³ and ppm; Pv and Pb in the same pressure unit",
    whenToUse: "Convert a gas or vapour concentration from mass concentration or a partial-pressure fraction into ppm.",
    commonError: "The 24.45 shortcut is for gases and vapours at 25°C and 1 atm—not aerosols. Use absolute, matching units in Pv/Pb.",
    workedExample: "100 mg/m³ with MW=50 gives 48.9 ppm; Pv=0.001 atm and Pb=1 atm give 1,000 ppm.",
    sourcePage: "ASP Formula Sheet pp. 6 and 23",
  },
  {
    id: "formula-ih-twa",
    category: "Industrial Hygiene & Gases",
    name: "Time-weighted average concentration",
    formula: "TWA = Σ(Cᵢtᵢ) / Σtᵢ",
    variables: ["Cᵢ = concentration during interval i", "tᵢ = duration of interval i"],
    units: "Same concentration unit as Cᵢ",
    whenToUse: "Combine changing concentrations over a defined averaging period.",
    commonError: "Include all intervals in the denominator, including time at zero exposure when the averaging period requires it.",
    workedExample: "2 h at 40 ppm and 6 h at 10 ppm gives (80 + 60)/8 = 17.5 ppm.",
    sourcePage: "Yates Ch. 4 supplemental formula (not printed in the supplied ASP sheet)",
  },
  {
    id: "formula-ergo-rwl",
    category: "Ergonomics",
    name: "Revised NIOSH recommended weight limit",
    formula: "RWL = LC × HM × VM × DM × AM × FM × CM",
    variables: ["LC = load constant", "HM/VM/DM = geometry multipliers", "AM = asymmetry multiplier", "FM = frequency multiplier", "CM = coupling multiplier"],
    units: "kg or lb, matching the load constant",
    whenToUse: "Screen a two-handed manual lifting task that fits the lifting-equation assumptions.",
    commonError: "Do not force the equation onto lifting conditions outside its applicability; evaluate those separately.",
    workedExample: "Using 51 lb and multipliers 0.80, 0.90, 0.95, 1.00, 0.85, and 0.90 gives RWL ≈ 26.7 lb.",
    sourcePage: "4",
  },
  {
    id: "formula-ergo-li",
    category: "Ergonomics",
    name: "Lifting index",
    formula: "LI = Load / RWL",
    variables: ["Load = actual lifted weight", "RWL = recommended weight limit"],
    units: "Dimensionless",
    whenToUse: "Compare the actual lift demand with the calculated recommended limit.",
    commonError: "LI is a screening value, not a prediction that a particular worker will or will not be injured.",
    workedExample: "A 40 lb load with RWL = 25 lb has LI = 1.6.",
    sourcePage: "4",
  },
  {
    id: "formula-heat-indoor-wbgt",
    category: "Heat Stress",
    name: "Indoor WBGT without solar load",
    formula: "WBGT = 0.7WB + 0.3GT",
    variables: ["WB = natural wet-bulb temperature", "GT = globe temperature"],
    units: "°C or °F, used consistently",
    whenToUse: "Estimate WBGT indoors or outdoors without a direct solar heat load.",
    commonError: "Do not substitute ordinary dry-bulb temperature for natural wet-bulb temperature.",
    workedExample: "WB = 78°F and GT = 88°F gives WBGT = 81°F.",
    sourcePage: "5",
  },
  {
    id: "formula-heat-outdoor-wbgt",
    category: "Heat Stress",
    name: "Outdoor WBGT with solar load",
    formula: "WBGT = 0.7WB + 0.2GT + 0.1DB",
    variables: ["WB = natural wet-bulb", "GT = globe", "DB = dry-bulb temperature"],
    units: "°C or °F, used consistently",
    whenToUse: "Estimate WBGT where direct solar radiation is present.",
    commonError: "Use the correct indoor/outdoor equation and do not omit the dry-bulb term outdoors with solar load.",
    workedExample: "WB = 78°F, GT = 90°F, and DB = 95°F gives WBGT = 82.1°F.",
    sourcePage: "5",
  },
  {
    id: "formula-rad-inverse-square",
    category: "Radiation",
    name: "Inverse-square law",
    formula: "I₂ = I₁(d₁/d₂)²",
    variables: ["I = intensity or dose rate", "d = distance from an approximately point source"],
    units: "Any consistent intensity and distance units",
    whenToUse: "Estimate intensity change with distance from a point-like radiation source in free space.",
    commonError: "The approximation weakens near large sources or where shielding and scattering dominate.",
    workedExample: "100 units/h at 1 m becomes 25 units/h at 2 m.",
    sourcePage: "ASP Formula Sheet pp. 7 and 19",
  },
  {
    id: "formula-rad-attenuation",
    category: "Radiation",
    name: "Exponential attenuation",
    formula: "I = I₀e^(−μx)",
    variables: ["I₀ = incident intensity", "I = transmitted intensity", "μ = linear attenuation coefficient", "x = shield thickness"],
    units: "μ and x must be reciprocal units",
    whenToUse: "Estimate narrow-beam attenuation through a uniform shield.",
    commonError: "Keep μ and thickness units compatible and recognize that buildup may matter in real shielding design.",
    workedExample: "I₀ = 100, μ = 0.5 cm⁻¹, and x = 2 cm gives I ≈ 36.8.",
    sourcePage: "7",
  },
  {
    id: "formula-rad-point-source",
    category: "Radiation",
    name: "Point-source exposure estimate",
    formula: "S ≈ 6CiEf",
    variables: ["S = approximate exposure rate at 1 ft", "Ci = source activity", "E = photon energy in MeV", "f = fractional yield"],
    units: "Approximate exposure rate in R/h at 1 ft for the source-sheet convention",
    whenToUse: "Apply the exam-reference shortcut for the stated point-source assumptions.",
    commonError: "Do not treat this screening relation as a substitute for isotope-specific shielding analysis.",
    workedExample: "For 2 Ci, E = 1 MeV, and f = 0.5, S ≈ 6 R/h at 1 ft under the sheet's approximation.",
    sourcePage: "ASP Formula Sheet pp. 7 and 20 (p. 20 supplies the explicit yield factor)",
  },
  {
    id: "formula-econ-future",
    category: "Engineering Economy",
    name: "Single-payment future value",
    formula: "F = P(1 + i)ⁿ",
    variables: ["F = future value", "P = present value", "i = interest per period", "n = number of periods"],
    units: "Currency",
    whenToUse: "Compound one present amount forward over equal interest periods.",
    commonError: "Enter 5% as 0.05 and match the interest period to n.",
    workedExample: "$1,000 at 5% for 3 years grows to about $1,157.63.",
    sourcePage: "22",
  },
  {
    id: "formula-econ-present",
    category: "Engineering Economy",
    name: "Single-payment present value",
    formula: "P = F(1 + i)⁻ⁿ",
    variables: ["P = present value", "F = future value", "i = interest per period", "n = number of periods"],
    units: "Currency",
    whenToUse: "Discount one future amount back to an equivalent value today.",
    commonError: "Discounting moves backward in time; multiplying by the compound factor moves the wrong direction.",
    workedExample: "$2,000 due in 2 years at 10% has present value ≈ $1,652.89.",
    sourcePage: "22",
  },
  {
    id: "formula-econ-sinking-fund",
    category: "Engineering Economy",
    name: "Uniform payment to reach a future amount",
    formula: "A = Fi / ((1 + i)ⁿ − 1)",
    variables: ["A = equal end-of-period payment", "F = target future value", "i = interest per period", "n = periods"],
    units: "Currency per period",
    whenToUse: "Find equal deposits needed to accumulate a future amount.",
    commonError: "This assumes end-of-period payments; beginning-of-period deposits require an adjustment.",
    workedExample: "To reach $10,000 in 5 years at 6%, deposit about $1,773.96 at each year-end.",
    sourcePage: "22",
  },
  {
    id: "formula-rel-failure",
    category: "Reliability",
    name: "Probability of failure",
    formula: "Pf = 1 − R(t) = 1 − Ps",
    variables: ["Pf = probability of failure", "R(t) or Ps = reliability/probability of success for the same mission"],
    units: "Probability from 0 to 1",
    whenToUse: "Convert between success reliability and failure probability for the same interval and conditions.",
    commonError: "Reliability must refer to the same mission time and environment as the desired failure probability.",
    workedExample: "If R = 0.98, probability of failure is 0.02 or 2%.",
    sourcePage: "7",
  },
  {
    id: "formula-rel-exponential",
    category: "Reliability",
    name: "Constant-failure-rate reliability",
    formula: "R(t) = e^(−λt)",
    variables: ["R(t) = reliability through time t", "λ = constant failure rate", "t = mission time"],
    units: "λ and t must be reciprocal units",
    whenToUse: "Model time-to-failure under the simplifying assumption of a constant failure rate.",
    commonError: "Do not apply a constant-rate model across strong infant-mortality or wear-out phases without justification.",
    workedExample: "λ = 0.001/h for 100 h gives R ≈ e⁻⁰·¹ = 0.9048.",
    sourcePage: "14",
  },
  {
    id: "formula-rel-systems",
    category: "Reliability",
    name: "Independent series and parallel systems",
    formula: "Rseries = ∏Rᵢ; Rparallel = 1 − ∏(1 − Rᵢ)",
    variables: ["Rᵢ = component reliability", "∏ = product across independent components"],
    units: "Probability from 0 to 1",
    whenToUse: "Combine independent components when all series elements must work or any parallel element can succeed.",
    commonError: "Common-cause failures violate the independence assumption and can erase apparent redundancy benefits.",
    workedExample: "R = 0.90 and 0.95 gives series R = 0.855; parallel R = 0.995.",
    sourcePage: "Yates Ch. 13 supplemental formula (not printed in the supplied ASP sheet)",
  },
  {
    id: "formula-noise-combine",
    category: "Noise",
    name: "Combine independent sound levels",
    formula: "Ltotal = 10 log₁₀(Σ10^(Lᵢ/10))",
    variables: ["Lᵢ = individual sound level", "Ltotal = combined sound level"],
    units: "dB",
    whenToUse: "Add sound levels from multiple independent sources on an energy basis.",
    commonError: "Decibels are logarithmic; arithmetic addition of dB values is invalid.",
    workedExample: "Two equal 90 dB sources combine to about 93.0 dB.",
    sourcePage: "7",
  },
  {
    id: "formula-noise-duration",
    category: "Noise",
    name: "Allowable duration at 5 dB exchange rate",
    formula: "T = 8 / 2^((L − 90)/5)",
    variables: ["T = allowable duration", "L = sound level"],
    units: "Hours and dBA",
    whenToUse: "Solve exam problems explicitly using the 90 dBA criterion and 5 dB exchange rate.",
    commonError: "Do not mix this relation with a 3 dB exchange-rate criterion.",
    workedExample: "At 95 dBA, T = 8/2 = 4 h.",
    sourcePage: "21",
  },
  {
    id: "formula-noise-dose-twa",
    category: "Noise",
    name: "Noise dose to 8-hour TWA",
    formula: "TWA = 16.61 log₁₀(D/100) + 90",
    variables: ["D = noise dose in percent", "TWA = 8-hour time-weighted level"],
    units: "% and dBA",
    whenToUse: "Convert dose percentage to TWA under the reference's 90 dBA/5 dB convention.",
    commonError: "Insert dose as D/100 inside the logarithm, not D alone.",
    workedExample: "D = 50% gives TWA ≈ 85.0 dBA.",
    sourcePage: "21",
  },
  {
    id: "formula-noise-distance",
    category: "Noise",
    name: "Free-field distance attenuation",
    formula: "L₂ = L₁ + 20 log₁₀(d₁/d₂)",
    variables: ["L = sound pressure level", "d = distance from a point source"],
    units: "dB and any consistent distance unit",
    whenToUse: "Estimate level change with distance from a point source in a free field.",
    commonError: "Reflective rooms, line sources, and near-field conditions may not follow the point-source rule.",
    workedExample: "100 dB at 1 m becomes approximately 94 dB at 2 m.",
    sourcePage: "7",
  },
  {
    id: "formula-hyd-velocity-pressure",
    category: "Hydraulics",
    name: "Water-stream velocity pressure",
    formula: "pᵥ = Q² / (891d⁴)",
    variables: ["pᵥ = velocity pressure", "Q = flow", "d = internal diameter"],
    units: "psi when Q is gpm and d is inches",
    whenToUse: "Estimate velocity pressure for water flow in a circular line using the reference units.",
    commonError: "Diameter is raised to the fourth power; using d² causes a large error.",
    workedExample: "Q = 500 gpm through d = 4 in gives pᵥ ≈ 1.10 psi.",
    sourcePage: "17",
  },
  {
    id: "formula-hyd-flow-pressure",
    category: "Hydraulics",
    name: "Flow-pressure square-root relation",
    formula: "Q₂ = Q₁√(P₂/P₁)",
    variables: ["Q = flow", "P = available pressure differential; in fire-flow problems P = static pressure − residual pressure"],
    units: "Any consistent flow and pressure units",
    whenToUse: "Scale flow when resistance conditions are unchanged and flow varies with the square root of pressure.",
    commonError: "Reverse the pressure ratio and the predicted direction of change will be wrong.",
    workedExample: "500 gpm at 64 psi scales to 500√(100/64) = 625 gpm at 100 psi.",
    sourcePage: "17",
  },
  {
    id: "formula-hyd-hazen-williams",
    category: "Hydraulics",
    name: "Hazen-Williams pressure drop",
    formula: "Pdrop = 4.52Q¹·⁸⁵ / (C¹·⁸⁵d⁴·⁸⁷)",
    variables: ["Pdrop = friction pressure loss per foot", "Q = flow", "C = roughness coefficient", "d = internal diameter"],
    units: "psi/ft when Q is gpm and d is inches",
    whenToUse: "Estimate water-line friction loss using the reference's US customary form.",
    commonError: "Keep the exponents attached to the correct terms and do not use the equation for incompatible fluids without validation.",
    workedExample: "Q = 100 gpm, C = 100, and d = 4 in gives Pdrop ≈ 0.0053 psi/ft.",
    sourcePage: "18",
  },
  {
    id: "formula-stat-sample-sd",
    category: "Statistics & Probability",
    name: "Sample standard deviation",
    formula: "s = √(Σ(xᵢ − x̄)² / (n − 1))",
    variables: ["xᵢ = observation", "x̄ = sample mean", "n = sample size"],
    units: "Same units as the observations",
    whenToUse: "Describe spread in a sample used to estimate a larger population.",
    commonError: "Use n − 1 for a sample; the population formula uses N.",
    workedExample: "For 2, 4, 6, x̄ = 4 and s = √(8/2) = 2.",
    sourcePage: "8",
  },
  {
    id: "formula-stat-z",
    category: "Statistics & Probability",
    name: "Z-score",
    formula: "z = (x − μ) / σ",
    variables: ["x = observation", "μ = population mean", "σ = population standard deviation"],
    units: "Dimensionless",
    whenToUse: "Express how many population standard deviations an observation lies from the mean.",
    commonError: "The sign matters: a negative z-score is below the mean.",
    workedExample: "x = 85, μ = 70, and σ = 10 gives z = 1.5.",
    sourcePage: "13",
  },
  {
    id: "formula-stat-t",
    category: "Statistics & Probability",
    name: "One-sample t statistic",
    formula: "t = (x̄ − μ) / (s/√n)",
    variables: ["x̄ = sample mean", "μ = hypothesized mean", "s = sample standard deviation", "n = sample size"],
    units: "Dimensionless",
    whenToUse: "Compare a sample mean with a hypothesized mean when population standard deviation is unknown.",
    commonError: "The denominator is the standard error s/√n, not s alone.",
    workedExample: "x̄ = 105, μ = 100, s = 10, and n = 25 gives t = 2.5.",
    sourcePage: "13",
  },
  {
    id: "formula-stat-poisson",
    category: "Statistics & Probability",
    name: "Poisson probability",
    formula: "P(r) = e^(−λt)(λt)ʳ / r!",
    variables: ["r = event count", "λ = average event rate", "t = exposure interval"],
    units: "Probability from 0 to 1; λt is dimensionless",
    whenToUse: "Model counts of independent events occurring at an approximately constant average rate.",
    commonError: "Use the expected count for the selected interval, λt, rather than a rate with mismatched time units.",
    workedExample: "If λt = 2, the probability of zero events is e⁻² ≈ 0.1353.",
    sourcePage: "13",
  },
];

/** Complete, deduplicated formula-family library from the supplied 23-page sheet. */
export const FORMULA_ENTRIES: readonly FormulaEntry[] = [
  ...CORE_FORMULA_ENTRIES,
  ...ADDITIONAL_FORMULA_ENTRIES,
];

export const FLASHCARDS: readonly StudyFlashcard[] = [
  {
    id: "flash-hw-ch02-01",
    deck: "Homework Review",
    chapterId: "ch-02",
    front: "How do a horizontal OSHA standard and a vertical OSHA standard differ?",
    back: "A horizontal standard applies broadly across industries; a vertical standard is written for a particular industry or operation. Check the scope before choosing which requirement controls.",
    tags: ["regulations", "OSHA", "scope"],
  },
  {
    id: "flash-hw-ch02-02",
    deck: "Homework Review",
    chapterId: "ch-02",
    front: "What four ideas organize the General Duty Clause analysis?",
    back: "A workplace hazard exists, it is recognized, it can cause death or serious harm, and a feasible means of correction is available. It is not a substitute for a directly applicable specific standard.",
    tags: ["regulations", "general-duty", "recognized-hazard"],
  },
  {
    id: "flash-hw-ch02-03",
    deck: "Homework Review",
    chapterId: "ch-02",
    front: "What should a safety professional preserve during a regulatory inspection?",
    back: "Cooperation, factual accuracy, consistent escorts, copies or notes of requested evidence, protection of legitimate employee rights, and prompt correction of imminent hazards without altering evidence improperly.",
    tags: ["regulations", "inspection", "documentation"],
  },
  {
    id: "flash-hw-ch03-01",
    deck: "Homework Review",
    chapterId: "ch-03",
    front: "Why should you write an equation before entering numbers into a calculator?",
    back: "A symbolic setup exposes the required relationship, supports unit checking, and reduces keystroke-driven mistakes. Substitute only after isolating the unknown.",
    tags: ["math", "algebra", "exam-skill"],
  },
  {
    id: "flash-hw-ch03-02",
    deck: "Homework Review",
    chapterId: "ch-03",
    front: "What is the safe order of operations for a mixed calculation?",
    back: "Resolve grouping symbols, then exponents, then multiplication and division left to right, then addition and subtraction left to right.",
    tags: ["math", "PEMDAS", "calculator"],
  },
  {
    id: "flash-hw-ch03-03",
    deck: "Homework Review",
    chapterId: "ch-03",
    front: "How is scientific notation multiplied?",
    back: "Multiply the coefficients, add the powers of ten, then normalize so the coefficient is at least 1 and less than 10.",
    tags: ["math", "scientific-notation", "exponents"],
  },
  {
    id: "flash-hw-ch04-01",
    deck: "Homework Review",
    chapterId: "ch-04",
    front: "Why must gas-law temperature be absolute?",
    back: "Gas-law proportionality begins at absolute zero. Celsius and Fahrenheit offsets distort ratios, so use kelvin or rankine.",
    tags: ["gases", "temperature", "gas-laws"],
  },
  {
    id: "flash-hw-ch04-02",
    deck: "Homework Review",
    chapterId: "ch-04",
    front: "How do you calculate an exposure TWA across changing concentration periods?",
    back: "Multiply each concentration by its duration, add those exposure products, and divide by the full averaging time required by the criterion.",
    tags: ["industrial-hygiene", "TWA", "exposure"],
  },
  {
    id: "flash-hw-ch04-03",
    deck: "Homework Review",
    chapterId: "ch-04",
    front: "What screening rule is commonly used for additive effects from a chemical mixture?",
    back: "Add each exposure-to-limit ratio, Σ(Cᵢ/Lᵢ). A sum above 1 indicates the combined additive limit is exceeded, assuming the substances share an additive health effect.",
    tags: ["industrial-hygiene", "mixtures", "limits"],
  },
  {
    id: "flash-hw-ch05-01",
    deck: "Homework Review",
    chapterId: "ch-05",
    front: "What is the difference between dose and response?",
    back: "Dose is the amount reaching or interacting with the organism; response is the biological change that follows. Exposure concentration alone does not fully describe absorbed dose.",
    tags: ["toxicology", "dose-response", "exposure"],
  },
  {
    id: "flash-hw-ch05-02",
    deck: "Homework Review",
    chapterId: "ch-05",
    front: "What does ADME describe?",
    back: "Absorption, distribution, metabolism, and excretion: the sequence that determines how a chemical enters, moves through, changes within, and leaves the body.",
    tags: ["toxicology", "ADME", "toxicokinetics"],
  },
  {
    id: "flash-hw-ch05-03",
    deck: "Homework Review",
    chapterId: "ch-05",
    front: "How do acute and chronic toxicity differ?",
    back: "Acute toxicity follows short-term exposure and often rapid effects; chronic toxicity develops from repeated or long-duration exposure, frequently with delayed effects.",
    tags: ["toxicology", "acute", "chronic"],
  },
  {
    id: "flash-hw-ch06-01",
    deck: "Homework Review",
    chapterId: "ch-06",
    front: "When is personal air sampling preferred over area sampling?",
    back: "Use personal sampling when estimating a worker's breathing-zone exposure. Area samples help map sources or background conditions but do not automatically represent personal dose.",
    tags: ["air-sampling", "personal-sampling", "IH"],
  },
  {
    id: "flash-hw-ch06-02",
    deck: "Homework Review",
    chapterId: "ch-06",
    front: "Why calibrate a sampling pump before and after sampling?",
    back: "The two checks document the flow used to calculate volume and reveal drift. A large mismatch calls sample validity into question.",
    tags: ["air-sampling", "calibration", "quality-control"],
  },
  {
    id: "flash-hw-ch06-03",
    deck: "Homework Review",
    chapterId: "ch-06",
    front: "What does a field blank help detect?",
    back: "Contamination introduced by media, handling, shipping, or storage rather than workplace air. It travels with samples but is not intentionally exposed.",
    tags: ["air-sampling", "field-blank", "QA"],
  },
  {
    id: "flash-hw-ch07-01",
    deck: "Homework Review",
    chapterId: "ch-07",
    front: "When is local exhaust ventilation usually stronger than general dilution?",
    back: "When a contaminant can be captured near its source, especially if it is toxic, generated rapidly, or costly to dilute. Capture prevents dispersion through the breathing zone.",
    tags: ["ventilation", "LEV", "control-hierarchy"],
  },
  {
    id: "flash-hw-ch07-02",
    deck: "Homework Review",
    chapterId: "ch-07",
    front: "What relationship links duct area, average velocity, and airflow?",
    back: "Q = AV. For fixed flow, reducing cross-sectional area increases average velocity; increasing area decreases it.",
    tags: ["ventilation", "airflow", "QAV"],
  },
  {
    id: "flash-hw-ch07-03",
    deck: "Homework Review",
    chapterId: "ch-07",
    front: "How are total, static, and velocity pressure related in a duct?",
    back: "Total pressure equals static pressure plus velocity pressure. Keep the sign convention consistent when diagnosing system losses and fan performance.",
    tags: ["ventilation", "pressure", "ducts"],
  },
  {
    id: "flash-hw-ch10-01",
    deck: "Homework Review",
    chapterId: "ch-10",
    front: "What four elements make up the fire tetrahedron?",
    back: "Fuel, oxygen, heat, and a sustained chemical chain reaction. Fire control works by interrupting one or more of these elements.",
    tags: ["fire", "tetrahedron", "combustion"],
  },
  {
    id: "flash-hw-ch10-02",
    deck: "Homework Review",
    chapterId: "ch-10",
    front: "Why is extinguisher selection based on fire class?",
    back: "The fuel and energized conditions determine which agent can safely interrupt combustion. A wrong agent may spread fuel, conduct electricity, or react dangerously.",
    tags: ["fire", "extinguishers", "fire-class"],
  },
  {
    id: "flash-hw-ch10-03",
    deck: "Homework Review",
    chapterId: "ch-10",
    front: "How does flash point differ from fire point?",
    back: "At the flash point, vapour can ignite briefly; at the fire point, vapour generation is sufficient to sustain burning under the test conditions.",
    tags: ["fire", "flammable-liquids", "flash-point"],
  },
  {
    id: "flash-hw-ch11-01",
    deck: "Homework Review",
    chapterId: "ch-11",
    front: "Which heat illness is the emergency: heat exhaustion or heat stroke?",
    back: "Heat stroke is immediately life-threatening because thermoregulation fails and central nervous system changes may appear. Activate emergency response and begin rapid cooling.",
    tags: ["thermal-stress", "heat-stroke", "emergency"],
  },
  {
    id: "flash-hw-ch11-02",
    deck: "Homework Review",
    chapterId: "ch-11",
    front: "What does heat acclimatization change?",
    back: "Repeated controlled heat exposure improves sweating efficiency, cardiovascular stability, and heat tolerance. The adaptation develops progressively and can be lost after time away.",
    tags: ["thermal-stress", "acclimatization", "prevention"],
  },
  {
    id: "flash-hw-ch11-03",
    deck: "Homework Review",
    chapterId: "ch-11",
    front: "What does WBGT integrate that dry-bulb temperature alone misses?",
    back: "It combines evaporative potential through natural wet-bulb temperature and radiant load through globe temperature, with dry-bulb added for direct solar conditions.",
    tags: ["thermal-stress", "WBGT", "measurement"],
  },
  {
    id: "flash-hw-ch12-01",
    deck: "Homework Review",
    chapterId: "ch-12",
    front: "Why is PPE normally considered a last line of defense?",
    back: "The hazard remains present and protection depends on correct selection, fit, condition, and use. Elimination and engineering controls reduce dependence on human performance.",
    tags: ["PPE", "control-hierarchy", "hazard-assessment"],
  },
  {
    id: "flash-hw-ch12-02",
    deck: "Homework Review",
    chapterId: "ch-12",
    front: "What elements make respirator use a program rather than an equipment purchase?",
    back: "Hazard evaluation, selection, medical evaluation, fit testing, training, inspection, cleaning, maintenance, cartridge or cylinder management, and periodic program evaluation.",
    tags: ["PPE", "respiratory-protection", "program"],
  },
  {
    id: "flash-hw-ch12-03",
    deck: "Homework Review",
    chapterId: "ch-12",
    front: "What is the first question in glove selection?",
    back: "What hazard and task must the glove resist? Chemical compatibility, concentration, contact time, cut or heat hazards, dexterity, and breakthrough data should drive selection.",
    tags: ["PPE", "gloves", "selection"],
  },
  {
    id: "flash-hw-ch13-01",
    deck: "Homework Review",
    chapterId: "ch-13",
    front: "When is the median more informative than the mean?",
    back: "When data are skewed or contain extreme values. The median resists outliers, while the mean is pulled toward them.",
    tags: ["statistics", "median", "mean"],
  },
  {
    id: "flash-hw-ch13-02",
    deck: "Homework Review",
    chapterId: "ch-13",
    front: "What does a strong correlation fail to prove?",
    back: "It does not prove causation. Confounding, reverse direction, selection effects, or chance can produce association without a causal mechanism.",
    tags: ["statistics", "correlation", "causation"],
  },
  {
    id: "flash-hw-ch13-03",
    deck: "Homework Review",
    chapterId: "ch-13",
    front: "Why does adding a required component reduce series-system reliability?",
    back: "Every required component creates another path to system failure. Under independence, series reliability is the product of component reliabilities.",
    tags: ["statistics", "reliability", "series-system"],
  },
  {
    id: "flash-hw-ch15-01",
    deck: "Homework Review",
    chapterId: "ch-15",
    front: "What is the purpose of a free-body diagram?",
    back: "It isolates the object and shows external forces with directions and points of application, making force and moment equations less error-prone.",
    tags: ["mechanics", "free-body-diagram", "forces"],
  },
  {
    id: "flash-hw-ch15-02",
    deck: "Homework Review",
    chapterId: "ch-15",
    front: "What does the simple friction model F = μN mean?",
    back: "Friction capacity is modeled as the coefficient times the normal force. The model is an approximation and the correct static or kinetic coefficient must be used.",
    tags: ["mechanics", "friction", "normal-force"],
  },
  {
    id: "flash-hw-ch15-03",
    deck: "Homework Review",
    chapterId: "ch-15",
    front: "Why is speed especially important in collision energy?",
    back: "Kinetic energy varies with speed squared. A modest speed increase can create a much larger energy increase that controls stopping distance and consequence.",
    tags: ["mechanics", "kinetic-energy", "vehicle-safety"],
  },
  {
    id: "flash-hw-ch16-01",
    deck: "Homework Review",
    chapterId: "ch-16",
    front: "What determines hydrostatic pressure at a point in a liquid?",
    back: "Fluid weight density and vertical depth below the free surface. Container shape does not change pressure at the same depth in a static fluid.",
    tags: ["hydraulics", "hydrostatic-pressure", "head"],
  },
  {
    id: "flash-hw-ch16-02",
    deck: "Homework Review",
    chapterId: "ch-16",
    front: "What energy forms are balanced in Bernoulli's equation?",
    back: "Pressure head, velocity head, and elevation head, adjusted for added pump head and real losses where applicable.",
    tags: ["hydraulics", "Bernoulli", "energy"],
  },
  {
    id: "flash-hw-ch16-03",
    deck: "Homework Review",
    chapterId: "ch-16",
    front: "Why can a small diameter reduction greatly increase pipe friction loss?",
    back: "Common friction equations place diameter in the denominator with a large exponent. The same flow through a smaller area also requires higher velocity.",
    tags: ["hydraulics", "friction-loss", "diameter"],
  },
  {
    id: "flash-hw-ch17-01",
    deck: "Homework Review",
    chapterId: "ch-17",
    front: "What makes a training objective measurable?",
    back: "It identifies the learner, observable performance, relevant conditions, and an acceptable criterion instead of using vague verbs such as understand or know.",
    tags: ["training", "objectives", "evaluation"],
  },
  {
    id: "flash-hw-ch17-02",
    deck: "Homework Review",
    chapterId: "ch-17",
    front: "Why is passing a classroom quiz insufficient evidence of competence?",
    back: "Recall in class may not transfer to field performance. Verify the skill under representative conditions and check whether it persists on the job.",
    tags: ["training", "competence", "transfer"],
  },
  {
    id: "flash-hw-ch17-03",
    deck: "Homework Review",
    chapterId: "ch-17",
    front: "What four levels can be used to evaluate training?",
    back: "Learner reaction, learning gained, behavior transferred to work, and organizational results. Strong evaluation matches the level to the training objective.",
    tags: ["training", "evaluation", "Kirkpatrick"],
  },
  {
    id: "flash-hw-ch18-01",
    deck: "Homework Review",
    chapterId: "ch-18",
    front: "What does the time value of money mean?",
    back: "Money available now can earn a return, so amounts at different dates are not directly comparable until moved to a common point in time.",
    tags: ["economics", "time-value", "discounting"],
  },
  {
    id: "flash-hw-ch18-02",
    deck: "Homework Review",
    chapterId: "ch-18",
    front: "Which direction does compounding move value, and which direction does discounting move it?",
    back: "Compounding moves present value forward to a future date; discounting brings future value backward to present value.",
    tags: ["economics", "present-value", "future-value"],
  },
  {
    id: "flash-hw-ch18-03",
    deck: "Homework Review",
    chapterId: "ch-18",
    front: "What important information can simple payback period omit?",
    back: "Cash flows after payback, the time value of money, differing project lives, and risk. Use it as a screening measure, not a complete economic decision.",
    tags: ["economics", "payback", "decision-making"],
  },
  {
    id: "flash-hw-ch19-01",
    deck: "Homework Review",
    chapterId: "ch-19",
    front: "How do leading and lagging indicators differ?",
    back: "Leading indicators monitor conditions and activities intended to prevent loss; lagging indicators describe outcomes that have already occurred. A balanced system uses both.",
    tags: ["management", "leading-indicators", "lagging-indicators"],
  },
  {
    id: "flash-hw-ch19-02",
    deck: "Homework Review",
    chapterId: "ch-19",
    front: "What does systems thinking add to incident analysis?",
    back: "It examines interacting design, resources, incentives, procedures, interfaces, and feedback rather than stopping at the last person's action.",
    tags: ["management", "systems-thinking", "incident-analysis"],
  },
  {
    id: "flash-hw-ch19-03",
    deck: "Homework Review",
    chapterId: "ch-19",
    front: "What observable evidence suggests a healthy reporting culture?",
    back: "Workers report weak signals without retaliation, leaders respond consistently, actions address system conditions, feedback reaches reporters, and repeated issues decline.",
    tags: ["management", "culture", "reporting"],
  },
  {
    id: "flash-hw-ch23-01",
    deck: "Homework Review",
    chapterId: "ch-23",
    front: "What distinguishes a construction competent person?",
    back: "The person can identify existing and predictable hazards and has authority to take prompt corrective action. Knowledge without authority is insufficient.",
    tags: ["construction", "competent-person", "authority"],
  },
  {
    id: "flash-hw-ch23-02",
    deck: "Homework Review",
    chapterId: "ch-23",
    front: "What is the preferred sequence for controlling an excavation cave-in hazard?",
    back: "Keep people out until a protective system or permissible stable configuration is in place, then inspect conditions and maintain access, spoil setback, water control, and other required protections.",
    tags: ["construction", "excavation", "cave-in"],
  },
  {
    id: "flash-hw-ch23-03",
    deck: "Homework Review",
    chapterId: "ch-23",
    front: "What is stronger than relying only on a personal fall-arrest system?",
    back: "Designing out elevated exposure or using passive prevention such as guarded work platforms. Arrest systems reduce consequence after a fall begins and require rescue planning.",
    tags: ["construction", "fall-protection", "control-hierarchy"],
  },
  {
    id: "flash-formula-01",
    deck: "Formula Essentials",
    front: "What three checks should you make before solving any formula problem?",
    back: "Identify the requested variable, write the governing equation, and convert every input into a consistent unit system.",
    tags: ["formula", "workflow", "units"],
  },
  {
    id: "flash-formula-02",
    deck: "Formula Essentials",
    front: "When must temperature be converted to kelvin or rankine?",
    back: "Whenever temperature appears in a proportional ratio such as a gas law. A simple temperature difference can use Celsius or Fahrenheit if the equation permits it.",
    tags: ["formula", "temperature", "gas-laws"],
  },
  {
    id: "flash-formula-03",
    deck: "Formula Essentials",
    front: "What quick check validates a parallel-resistance result?",
    back: "Equivalent resistance must be lower than the smallest individual branch resistance.",
    tags: ["formula", "electricity", "reasonableness"],
  },
  {
    id: "flash-formula-04",
    deck: "Formula Essentials",
    front: "What happens to point-source intensity when distance doubles?",
    back: "It falls to one-quarter under inverse-square conditions because intensity varies with 1/d².",
    tags: ["formula", "radiation", "inverse-square"],
  },
  {
    id: "flash-formula-05",
    deck: "Formula Essentials",
    front: "Why can two 90 dB sources not be added as 180 dB?",
    back: "Decibels express a logarithmic ratio. Two equal independent sources add 3 dB, producing about 93 dB.",
    tags: ["formula", "noise", "logarithms"],
  },
  {
    id: "flash-formula-06",
    deck: "Formula Essentials",
    front: "How should lifting index be interpreted?",
    back: "It compares actual load with the recommended weight limit. Higher values indicate increasing task demand, but LI is a screening tool rather than an individual injury prediction.",
    tags: ["formula", "ergonomics", "lifting-index"],
  },
  {
    id: "flash-formula-07",
    deck: "Formula Essentials",
    front: "When is the 24.45 conversion factor appropriate for ppm and mg/m³?",
    back: "For an ideal gas or vapour at 25°C and 1 atm. Different conditions require correction, and particulate aerosols are not converted by molecular weight this way.",
    tags: ["formula", "industrial-hygiene", "ppm"],
  },
  {
    id: "flash-formula-08",
    deck: "Formula Essentials",
    front: "How do independent series and parallel reliability behave?",
    back: "Series reliability multiplies successes because every component must work; parallel reliability subtracts the probability that every redundant path fails from 1.",
    tags: ["formula", "reliability", "systems"],
  },
  {
    id: "flash-formula-09",
    deck: "Formula Essentials",
    front: "How is a percentage interest rate entered into engineering-economy equations?",
    back: "As a decimal per matching period: 6% per year becomes 0.06 with n measured in years.",
    tags: ["formula", "economics", "interest"],
  },
  {
    id: "flash-formula-10",
    deck: "Formula Essentials",
    front: "Why should diameter exponents receive special attention in hydraulic calculations?",
    back: "A large exponent means a small diameter error creates a large flow or pressure-loss error. Preserve the exponent and use internal diameter in the required units.",
    tags: ["formula", "hydraulics", "exponents"],
  },
  {
    id: "flash-formula-11",
    deck: "Formula Essentials",
    front: "What reasonableness check follows from Q = AV?",
    back: "For the same flow, smaller area requires greater velocity; for the same area, greater velocity produces proportionally greater flow.",
    tags: ["formula", "ventilation", "reasonableness"],
  },
  {
    id: "flash-formula-12",
    deck: "Formula Essentials",
    front: "When should you round a multistep calculation?",
    back: "Keep guard digits through intermediate steps and round the final answer to precision justified by the inputs and answer choices.",
    tags: ["formula", "rounding", "exam-skill"],
  },
  {
    id: "flash-tox-01",
    deck: "Toxicology",
    chapterId: "ch-05",
    front: "How does a local toxic effect differ from a systemic effect?",
    back: "A local effect occurs at the contact site; a systemic effect follows absorption and distribution to another target organ or system.",
    tags: ["toxicology", "local-effect", "systemic-effect"],
  },
  {
    id: "flash-tox-02",
    deck: "Toxicology",
    chapterId: "ch-05",
    front: "Why is target-organ information useful in exposure assessment?",
    back: "It links a chemical's toxic action to symptoms, medical surveillance, sampling priorities, and controls, while reminding the assessor that one agent can affect more than one system.",
    tags: ["toxicology", "target-organ", "surveillance"],
  },
  {
    id: "flash-tox-03",
    deck: "Toxicology",
    chapterId: "ch-05",
    front: "What is latency?",
    back: "The interval between exposure and a detectable adverse effect. Long latency can hide causation and makes prevention and exposure records especially important.",
    tags: ["toxicology", "latency", "chronic-disease"],
  },
  {
    id: "flash-tox-04",
    deck: "Toxicology",
    chapterId: "ch-05",
    front: "What is a synergistic chemical interaction?",
    back: "The combined effect is greater than the sum expected from each agent acting alone. Do not assume mixture effects are always merely additive.",
    tags: ["toxicology", "synergism", "mixtures"],
  },
  {
    id: "flash-tox-05",
    deck: "Toxicology",
    chapterId: "ch-05",
    front: "What does an LD50 or LC50 fail to tell you by itself?",
    back: "It does not fully describe chronic toxicity, target organs, irritation, sensitization, carcinogenicity, susceptible groups, or safe workplace exposure.",
    tags: ["toxicology", "LD50", "dose-response"],
  },
  {
    id: "flash-tox-06",
    deck: "Toxicology",
    chapterId: "ch-05",
    front: "How should exposure route influence control selection?",
    back: "Match controls to inhalation, skin, ingestion, or injection pathways, while first reducing the hazard at its source. Air limits alone do not address significant skin absorption.",
    tags: ["toxicology", "route", "controls"],
  },
  {
    id: "flash-bio-01",
    deck: "Biological Hazards",
    chapterId: "ch-09",
    front: "What links form the chain of infection?",
    back: "Infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Breaking any link can prevent transmission.",
    tags: ["biological", "infection-chain", "transmission"],
  },
  {
    id: "flash-bio-02",
    deck: "Biological Hazards",
    chapterId: "ch-09",
    front: "How do contact, droplet, and airborne transmission differ?",
    back: "Contact involves direct touch or contaminated surfaces; droplets travel short distances from respiratory events; airborne particles remain suspended and can travel beyond close contact.",
    tags: ["biological", "transmission", "infection-control"],
  },
  {
    id: "flash-bio-03",
    deck: "Biological Hazards",
    chapterId: "ch-09",
    front: "What is a zoonosis?",
    back: "An infection naturally transmitted between vertebrate animals and humans. Animal contact, vectors, tissues, fluids, and contaminated environments can create occupational routes.",
    tags: ["biological", "zoonosis", "occupational-health"],
  },
  {
    id: "flash-bio-04",
    deck: "Biological Hazards",
    chapterId: "ch-09",
    front: "What is the first response to an occupational needlestick?",
    back: "Immediately perform appropriate first aid, report the exposure, obtain prompt confidential medical evaluation, document source and route, and begin indicated post-exposure management without delay.",
    tags: ["biological", "bloodborne", "post-exposure"],
  },
  {
    id: "flash-bio-05",
    deck: "Biological Hazards",
    chapterId: "ch-09",
    front: "What does a biosafety level represent?",
    back: "A coordinated set of practices, safety equipment, and facility features matched to organism and procedure risk. It is more than a room label.",
    tags: ["biological", "biosafety-level", "laboratory"],
  },
  {
    id: "flash-bio-06",
    deck: "Biological Hazards",
    chapterId: "ch-09",
    front: "What is the strongest starting point for biological-hazard control?",
    back: "Assess the agent, task, route, dose potential, and susceptible workers, then prevent release or contact through process design, containment, safe work methods, hygiene, vaccination where appropriate, and PPE.",
    tags: ["biological", "risk-assessment", "controls"],
  },
  {
    id: "flash-exam-01",
    deck: "Exam Strategy",
    front: "What words in a question stem deserve deliberate attention?",
    back: "Qualifiers such as first, best, most effective, immediate, except, and not. They change the task even when several options are factually true.",
    tags: ["exam", "stem", "qualifiers"],
  },
  {
    id: "flash-exam-02",
    deck: "Exam Strategy",
    front: "How should you treat answer choices using absolute words?",
    back: "Test them carefully against the facts; words such as always or never are often too broad, but do not reject an option solely because it is absolute.",
    tags: ["exam", "distractors", "reasoning"],
  },
  {
    id: "flash-exam-03",
    deck: "Exam Strategy",
    front: "What is the fastest way to catch many quantitative distractors?",
    back: "Write the expected units beside the unknown and cancel units through the calculation. A dimensionally wrong result cannot be rescued by plausible arithmetic.",
    tags: ["exam", "math", "units"],
  },
  {
    id: "flash-exam-04",
    deck: "Exam Strategy",
    front: "How should confidence be used after practice questions?",
    back: "Separate knowledge from guessing: a correct low-confidence response still needs review, while an incorrect high-confidence response signals a misconception needing priority correction.",
    tags: ["exam", "confidence", "metacognition"],
  },
  {
    id: "flash-exam-05",
    deck: "Exam Strategy",
    front: "What should you do when a question is consuming too much time?",
    back: "Eliminate what you can, select the best remaining answer, flag it if the system allows, and continue. Protect time for questions you can solve reliably.",
    tags: ["exam", "time-management", "decision"],
  },
  {
    id: "flash-exam-06",
    deck: "Exam Strategy",
    front: "What is the best way to study a missed question?",
    back: "State why the chosen option fails, why the keyed option fits the stem, and what rule will distinguish the two next time. Rereading alone is weak retrieval practice.",
    tags: ["exam", "rationale", "retrieval"],
  },
  {
    id: "flash-exam-07",
    deck: "Exam Strategy",
    front: "When several controls are possible, what usually distinguishes the best answer?",
    back: "It addresses the stated risk at the highest feasible level of the hierarchy, fits the scenario, and includes verification rather than relying only on reminders or PPE.",
    tags: ["exam", "controls", "hierarchy"],
  },
  {
    id: "flash-exam-08",
    deck: "Exam Strategy",
    front: "When is a weak domain considered stable rather than temporarily improved?",
    back: "After performance stays above the target across multiple spaced blocks, at mixed difficulty, without heavy guessing or repeated-item dependence.",
    tags: ["exam", "mastery", "adaptive-learning"],
  },
];

export const FORMULA_CATEGORIES: readonly FormulaCategory[] = [
  "Conversions",
  "Reference Constants",
  "Mathematics & Logic",
  "Mechanics",
  "Electricity",
  "Ventilation",
  "Industrial Hygiene & Gases",
  "Ergonomics",
  "Heat Stress",
  "Heat Transfer",
  "Radiation",
  "Engineering Economy",
  "Reliability",
  "Noise",
  "Hydraulics",
  "Statistics & Probability",
];

const FLASHCARD_DECKS: readonly FlashcardDeck[] = [
  "Homework Review",
  "Formula Essentials",
  "Toxicology",
  "Biological Hazards",
  "Exam Strategy",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isNonEmptyStringArray = (value: unknown): value is readonly string[] =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);

export const isFormulaEntry = (value: unknown): value is FormulaEntry => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.category) &&
    FORMULA_CATEGORIES.includes(value.category as FormulaCategory) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.formula) &&
    isNonEmptyStringArray(value.variables) &&
    isNonEmptyString(value.units) &&
    isNonEmptyString(value.whenToUse) &&
    isNonEmptyString(value.commonError) &&
    isNonEmptyString(value.workedExample) &&
    isNonEmptyString(value.sourcePage)
  );
};

export const isStudyFlashcard = (value: unknown): value is StudyFlashcard => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.deck) &&
    FLASHCARD_DECKS.includes(value.deck as FlashcardDeck) &&
    (value.chapterId === undefined || isNonEmptyString(value.chapterId)) &&
    isNonEmptyString(value.front) &&
    isNonEmptyString(value.back) &&
    isNonEmptyStringArray(value.tags)
  );
};

const duplicateIds = (values: readonly { id: string }[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  values.forEach(({ id }) => {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  });
  return [...duplicates];
};

export const validateFormulaEntries = (
  entries: readonly unknown[] = FORMULA_ENTRIES,
): StudyLibraryValidation => {
  const errors: string[] = [];
  if (entries.length !== 106) {
    errors.push(`Complete formula library must contain 106 entries; found ${entries.length}.`);
  }

  entries.forEach((entry, index) => {
    if (!isFormulaEntry(entry)) errors.push(`Formula entry at index ${index} is invalid.`);
  });

  const validEntries = entries.filter(isFormulaEntry);
  const ids = duplicateIds(validEntries);
  if (ids.length > 0) errors.push(`Duplicate formula IDs: ${ids.join(", ")}.`);

  FORMULA_CATEGORIES.forEach((category) => {
    if (!validEntries.some((entry) => entry.category === category)) {
      errors.push(`Formula category has no entries: ${category}.`);
    }
  });

  return { valid: errors.length === 0, errors };
};

export const validateFlashcards = (
  cards: readonly unknown[] = FLASHCARDS,
): StudyLibraryValidation => {
  const errors: string[] = [];
  if (cards.length < 75 || cards.length > 90) {
    errors.push(`Flashcard library should contain about 80 cards; found ${cards.length}.`);
  }

  cards.forEach((card, index) => {
    if (!isStudyFlashcard(card)) errors.push(`Flashcard at index ${index} is invalid.`);
  });

  const validCards = cards.filter(isStudyFlashcard);
  const ids = duplicateIds(validCards);
  if (ids.length > 0) errors.push(`Duplicate flashcard IDs: ${ids.join(", ")}.`);

  FLASHCARD_DECKS.forEach((deck) => {
    if (!validCards.some((card) => card.deck === deck)) {
      errors.push(`Flashcard deck has no cards: ${deck}.`);
    }
  });

  const homeworkChapters = [
    "ch-02",
    "ch-03",
    "ch-04",
    "ch-05",
    "ch-06",
    "ch-07",
    "ch-10",
    "ch-11",
    "ch-12",
    "ch-13",
    "ch-15",
    "ch-16",
    "ch-17",
    "ch-18",
    "ch-19",
    "ch-23",
  ];
  homeworkChapters.forEach((chapterId) => {
    if (!validCards.some((card) => card.deck === "Homework Review" && card.chapterId === chapterId)) {
      errors.push(`Homework flashcards are missing for ${chapterId}.`);
    }
  });

  return { valid: errors.length === 0, errors };
};

export const validateStudyLibrary = (): StudyLibraryValidation => {
  const formulaValidation = validateFormulaEntries();
  const flashcardValidation = validateFlashcards();
  const errors = [...formulaValidation.errors, ...flashcardValidation.errors];
  return { valid: errors.length === 0, errors };
};

export const STUDY_LIBRARY_VALIDATION = validateStudyLibrary();
