/**
 * Original ASP mathematical-calculation scenarios mapped to the equation
 * families used by the in-app formula library and the Yates chapter sequence.
 *
 * This module intentionally does not import studyLibraryData.ts. Keeping the
 * small coverage manifest local prevents the adaptive question bank from
 * pulling the full flashcard/formula payload into its runtime bundle.
 */

export type A1CalculationPool = "practice" | "mock-a" | "mock-b";

export type A1FormulaCategory =
  | "Conversions"
  | "Mathematics & Logic"
  | "Statistics & Probability"
  | "Reliability"
  | "Mechanics"
  | "Electricity"
  | "Industrial Hygiene & Gases"
  | "Ergonomics"
  | "Heat Stress"
  | "Radiation"
  | "Engineering Economy"
  | "Noise"
  | "Hydraulics"
  | "Ventilation";

export type A1Difficulty = 1 | 2 | 3 | 4 | 5;

export type A1CalculationAnswer = Readonly<{
  text: string;
  rationale: string;
}>;

export type A1CalculationDraft = Readonly<{
  competency: string;
  objective: string;
  difficulty: A1Difficulty;
  stem: string;
  correct: A1CalculationAnswer;
  distractors: readonly [A1CalculationAnswer, A1CalculationAnswer, A1CalculationAnswer];
  referenceFramework: "Yates" | "BCSP Blueprint" | "NWS";
  referenceTopic: string;
  challengePrompt: string;
  formulaId: string;
  formulaCategory: A1FormulaCategory;
  formulaFamily: string;
  blueprintObjective: string;
}>;

type FormulaCoverage = Readonly<{
  formulaId: string;
  formulaCategory: A1FormulaCategory;
  formulaFamily: string;
  competency: string;
  objective: string;
  difficulty: A1Difficulty;
  referenceTopic: string;
  referenceFramework: "Yates" | "BCSP Blueprint" | "NWS";
  blueprintObjective: string;
}>;

export type A1CalculationProblem = Readonly<{
  stem: string;
  correct: A1CalculationAnswer;
  distractors: readonly [A1CalculationAnswer, A1CalculationAnswer, A1CalculationAnswer];
  challengePrompt: string;
}>;

export const A1_BLUEPRINT_CORE_FORMULA_IDS = [
  "formula-math-right-triangle",
  "formula-stat-sample-sd",
  "formula-stat-z",
  "formula-stat-population-sd",
  "formula-rel-failure",
  "formula-rel-exponential",
  "formula-mech-momentum",
  "formula-mech-velocity",
  "formula-mech-displacement",
  "formula-mech-velocity-distance",
  "formula-mech-energy-work",
  "formula-mech-force-weight",
  "formula-vent-evaporation-dilution",
  "formula-hyd-bernoulli-loss",
  "formula-noise-absorption-change",
  "nws-heat-wind-chill-index",
  "formula-ih-ideal-gas",
  "formula-ih-mixture-tlv",
  "formula-hyd-velocity-pressure",
  "formula-hyd-static-residual-flow",
  "formula-hyd-flow-pressure",
  "formula-hyd-hazen-williams",
  "formula-vent-transient-clearance",
  "formula-vent-velocity-pressure",
  "formula-vent-hood-entry",
  "formula-vent-total-pressure",
  "formula-vent-fan-static-pressure",
  "formula-vent-capture",
  "formula-vent-dilution",
  "formula-rad-inverse-square",
  "formula-rad-point-source",
  "formula-noise-sound-power-level",
  "formula-noise-sound-pressure-level",
  "formula-noise-duration",
  "formula-noise-dose-twa",
  "formula-econ-future",
  "formula-econ-present",
  "formula-econ-annuity-future",
  "formula-econ-sinking-fund",
  "formula-econ-annuity-present",
  "formula-econ-capital-recovery",
  "formula-heat-indoor-wbgt",
  "formula-heat-outdoor-wbgt",
  "formula-ih-ppm",
] as const;

export const A1_YATES_SUPPLEMENTAL_FORMULA_IDS = [
  "yates-math-pemdas",
  "yates-math-signed-absolute-values",
  "yates-math-exponents-scientific-notation",
  "yates-math-engineering-notation",
  "yates-math-common-logarithms",
  "yates-math-equation-transposition",
  "yates-math-factorials",
  "yates-math-common-geometry",
  "yates-math-trig-inverse-trig",
  "yates-math-quadratic-equation",
  "formula-ergo-rwl",
  "formula-ergo-li",
  "yates-math-eulers-number",
  "yates-rad-radioactive-decay-half-life",
  "formula-rad-nonionizing-far-field",
  "formula-mech-friction",
] as const;

const FAMILY_CATALOG = [
  ["formula-math-right-triangle", "Mathematics & Logic", "Right-triangle ratios", "Applied trigonometry", "Solve a right triangle from two known sides.", 2, "Yates Ch. 3 — Right-triangle relationships"],
  ["formula-stat-sample-sd", "Statistics & Probability", "Sample standard deviation", "Descriptive statistics", "Calculate sample standard deviation using the n-1 denominator.", 3, "Yates Ch. 13 — Sample standard deviation"],
  ["formula-stat-z", "Statistics & Probability", "Standard score", "Descriptive statistics", "Standardize a measurement against a population mean and deviation.", 2, "Yates Ch. 13 — Z-scores"],
  ["formula-stat-population-sd", "Statistics & Probability", "Population standard deviation", "Descriptive statistics", "Calculate population standard deviation using the N denominator.", 3, "Yates Ch. 13 — Population standard deviation"],
  ["formula-rel-failure", "Reliability", "Failure-probability complement", "Reliability calculations", "Convert mission reliability to probability of failure.", 1, "Yates Ch. 13 — Reliability and failure complements"],
  ["formula-rel-exponential", "Reliability", "Constant-rate reliability", "Reliability calculations", "Calculate reliability under a constant failure-rate model.", 3, "Yates Ch. 13 — Exponential reliability"],
  ["formula-mech-momentum", "Mechanics", "Linear momentum", "Motion mechanics", "Calculate the signed momentum of a moving load.", 2, "Yates Ch. 15 — Linear momentum"],
  ["formula-mech-velocity", "Mechanics", "Constant-acceleration velocity", "Kinematics", "Calculate final velocity under constant acceleration.", 1, "Yates Ch. 15 — Velocity and acceleration"],
  ["formula-mech-displacement", "Mechanics", "Constant-acceleration displacement", "Kinematics", "Calculate displacement from initial speed, acceleration, and time.", 2, "Yates Ch. 15 — Displacement under acceleration"],
  ["formula-mech-velocity-distance", "Mechanics", "Velocity-distance relation", "Kinematics", "Relate speed, acceleration, and stopping distance without time.", 3, "Yates Ch. 15 — Velocity and stopping distance"],
  ["formula-mech-energy-work", "Mechanics", "Kinetic energy and work", "Energy mechanics", "Calculate kinetic energy or equivalent stopping work.", 2, "Yates Ch. 15 — Kinetic energy and work"],
  ["formula-mech-force-weight", "Mechanics", "Force and weight", "Force mechanics", "Convert mass to weight under stated gravitational acceleration.", 1, "Yates Ch. 15 — Force, mass, and weight"],
  ["formula-vent-evaporation-dilution", "Ventilation", "Liquid-evaporation dilution airflow", "Exposure-control calculations", "Calculate dilution airflow from a liquid evaporation rate and target concentration.", 4, "Yates Ch. 7 — Evaporation-source dilution ventilation"],
  ["formula-hyd-bernoulli-loss", "Hydraulics", "Bernoulli equation with head loss", "Fluid-flow calculations", "Solve an energy balance that includes elevation and head loss.", 4, "Yates Ch. 16 — Bernoulli equation with head loss"],
  ["formula-noise-absorption-change", "Noise", "Room-absorption noise reduction", "Noise-control calculations", "Calculate level reduction from a change in total room absorption.", 3, "Yates Ch. 8 — Absorption and noise reduction"],
  ["nws-heat-wind-chill-index", "Heat Stress", "Wind chill index", "Cold-stress calculations", "Calculate wind chill from air temperature and wind speed.", 3, "NWS Fahrenheit wind-chill equation — Yates Ch. 11 cold-stress application"],
  ["formula-ih-ideal-gas", "Industrial Hygiene & Gases", "Ideal-gas relationship", "Gas-law calculations", "Apply PV = nRT with absolute temperature.", 3, "Yates Ch. 4 — Ideal gas law"],
  ["formula-ih-mixture-tlv", "Industrial Hygiene & Gases", "Equivalent vapor-mixture limit", "Mixture exposure calculations", "Calculate the equivalent exposure limit for a vapor mixture.", 4, "Yates Ch. 4 — Mixture exposure limits"],
  ["formula-hyd-velocity-pressure", "Hydraulics", "Water-stream velocity pressure", "Fire-hydraulic calculations", "Calculate stream velocity pressure from flow and diameter.", 3, "Yates Ch. 16 — Velocity pressure"],
  ["formula-hyd-static-residual-flow", "Hydraulics", "Static-residual fire-flow extrapolation", "Fire-hydraulic calculations", "Extrapolate fire flow between residual-pressure conditions.", 5, "Yates Ch. 16 — Static and residual fire flow"],
  ["formula-hyd-flow-pressure", "Hydraulics", "Square-root flow-pressure scaling", "Fire-hydraulic calculations", "Scale flow when discharge pressure changes.", 2, "Yates Ch. 16 — Flow and pressure scaling"],
  ["formula-hyd-hazen-williams", "Hydraulics", "Hazen-Williams pressure drop", "Pipe-flow calculations", "Estimate pressure drop from flow, pipe, and roughness data.", 5, "Yates Ch. 16 — Hazen-Williams equation"],
  ["formula-vent-transient-clearance", "Ventilation", "Well-mixed purge clearance", "Ventilation calculations", "Calculate clearance time for a well-mixed purge between two concentrations.", 4, "Yates Ch. 7 — Transient ventilation clearance"],
  ["formula-vent-velocity-pressure", "Ventilation", "Air velocity from velocity pressure", "Ventilation calculations", "Calculate duct velocity from velocity pressure.", 2, "Yates Ch. 7 — Velocity pressure"],
  ["formula-vent-hood-entry", "Ventilation", "Hood entry coefficient", "Ventilation calculations", "Use hood entry coefficient and static pressure to estimate velocity.", 4, "Yates Ch. 7 — Hood entry loss"],
  ["formula-vent-total-pressure", "Ventilation", "Duct total pressure", "Ventilation calculations", "Combine static and velocity pressure algebraically.", 2, "Yates Ch. 7 — Total, static, and velocity pressure"],
  ["formula-vent-fan-static-pressure", "Ventilation", "Fan static pressure", "Ventilation calculations", "Calculate fan static pressure from inlet and outlet measurements.", 3, "Yates Ch. 7 — Fan static pressure"],
  ["formula-vent-capture", "Ventilation", "Plain-opening capture flow", "Ventilation calculations", "Calculate required flow for a plain opening at a stated distance.", 3, "Yates Ch. 7 — Capture velocity"],
  ["formula-vent-dilution", "Ventilation", "Steady-state dilution airflow", "Ventilation calculations", "Calculate ideal dilution airflow from generation and target concentration.", 4, "Yates Ch. 7 — Dilution ventilation"],
  ["formula-rad-inverse-square", "Radiation", "Inverse-square radiation scaling", "Radiation calculations", "Scale point-source intensity with distance.", 2, "Yates Ch. 26 — Inverse-square law"],
  ["formula-rad-point-source", "Radiation", "Gamma point-source estimate", "Radiation calculations", "Estimate exposure rate from activity, energy, and yield.", 3, "Yates Ch. 26 — Point-source exposure estimate"],
  ["formula-noise-sound-power-level", "Noise", "Sound power level", "Noise calculations", "Convert acoustic power to a logarithmic power level.", 3, "Yates Ch. 8 — Sound power level"],
  ["formula-noise-sound-pressure-level", "Noise", "Sound pressure level", "Noise calculations", "Convert RMS pressure to sound-pressure level.", 3, "Yates Ch. 8 — Sound pressure level"],
  ["formula-noise-duration", "Noise", "Allowable duration at 5-dB exchange", "Noise-dose calculations", "Calculate allowable duration from sound level.", 2, "Yates Ch. 8 — OSHA 5-dB exchange duration"],
  ["formula-noise-dose-twa", "Noise", "Noise dose to TWA", "Noise-dose calculations", "Convert criterion dose to an equivalent 8-hour TWA.", 3, "Yates Ch. 8 — Noise dose and TWA"],
  ["formula-econ-future", "Engineering Economy", "Single-payment future value", "Engineering-economy calculations", "Calculate compounded future value of a present amount.", 2, "Yates Ch. 18 — Future value"],
  ["formula-econ-present", "Engineering Economy", "Single-payment present value", "Engineering-economy calculations", "Discount a future amount to present value.", 2, "Yates Ch. 18 — Present value"],
  ["formula-econ-annuity-future", "Engineering Economy", "Uniform-series future worth", "Engineering-economy calculations", "Calculate future worth of equal end-of-period payments.", 4, "Yates Ch. 18 — Uniform-series future worth"],
  ["formula-econ-sinking-fund", "Engineering Economy", "Sinking-fund payment", "Engineering-economy calculations", "Calculate the uniform deposit needed to reach a future amount.", 4, "Yates Ch. 18 — Sinking-fund factor"],
  ["formula-econ-annuity-present", "Engineering Economy", "Uniform-series present worth", "Engineering-economy calculations", "Calculate present worth of equal future payments.", 4, "Yates Ch. 18 — Uniform-series present worth"],
  ["formula-econ-capital-recovery", "Engineering Economy", "Capital-recovery payment", "Engineering-economy calculations", "Calculate an equivalent uniform payment from present cost.", 4, "Yates Ch. 18 — Capital-recovery factor"],
  ["formula-heat-indoor-wbgt", "Heat Stress", "Indoor WBGT", "Thermal-stressor calculations", "Calculate WBGT indoors or without solar load.", 1, "Yates Ch. 11 — Indoor WBGT"],
  ["formula-heat-outdoor-wbgt", "Heat Stress", "Outdoor WBGT", "Thermal-stressor calculations", "Calculate WBGT outdoors with solar load.", 2, "Yates Ch. 11 — Outdoor WBGT"],
  ["formula-ih-ppm", "Industrial Hygiene & Gases", "Gas concentration in ppm", "Air-sampling calculations", "Convert vapor mass concentration to ppm at reference conditions.", 3, "Yates Ch. 4 — Vapor concentration conversion"],
  ["yates-math-pemdas", "Mathematics & Logic", "PEMDAS and order of operations", "Math review", "Evaluate a multistep expression in the correct order.", 1, "Yates Ch. 3 — PEMDAS"],
  ["yates-math-signed-absolute-values", "Mathematics & Logic", "Signed and absolute values", "Math review", "Evaluate signed quantities and absolute values.", 1, "Yates Ch. 3 — Signed and absolute values"],
  ["yates-math-exponents-scientific-notation", "Mathematics & Logic", "Exponents and scientific notation", "Math review", "Multiply quantities expressed with powers of ten.", 2, "Yates Ch. 3 — Exponents and scientific notation"],
  ["yates-math-engineering-notation", "Mathematics & Logic", "Engineering notation", "Math review", "Express a measured quantity with an exponent divisible by three.", 1, "Yates Ch. 3 — Engineering notation"],
  ["yates-math-common-logarithms", "Mathematics & Logic", "Common logarithms", "Math review", "Evaluate a base-10 logarithm and interpret its order of magnitude.", 2, "Yates Ch. 3 — Common logarithms"],
  ["yates-math-equation-transposition", "Mathematics & Logic", "Equation transposition", "Math review", "Rearrange an equation and solve for the requested variable.", 2, "Yates Ch. 3 — Equation transposition"],
  ["yates-math-factorials", "Mathematics & Logic", "Factorials", "Math review", "Calculate the factorial used to count ordered arrangements.", 2, "Yates Ch. 3 — Factorials"],
  ["yates-math-common-geometry", "Mathematics & Logic", "Common plane and solid geometry", "Math review", "Calculate the volume of a common geometric solid.", 2, "Yates Ch. 3 — Common geometry"],
  ["yates-math-trig-inverse-trig", "Mathematics & Logic", "Trigonometry and inverse trigonometry", "Math review", "Use an inverse trigonometric function to find an angle.", 3, "Yates Ch. 3 — Trigonometry and inverse trigonometry"],
  ["yates-math-quadratic-equation", "Mathematics & Logic", "Quadratic equation", "Math review", "Solve a quadratic and select the physically meaningful root.", 4, "Yates Ch. 3 — Quadratic equation"],
  ["formula-ergo-rwl", "Ergonomics", "NIOSH recommended weight limit", "Ergonomic calculations", "Calculate RWL from the load constant and task multipliers.", 4, "Yates Ch. 22 — Revised NIOSH lifting equation"],
  ["formula-ergo-li", "Ergonomics", "NIOSH lifting index", "Ergonomic calculations", "Calculate lifting index from load and RWL.", 2, "Yates Ch. 22 — Lifting index"],
  ["yates-math-eulers-number", "Mathematics & Logic", "Euler's number", "Math review", "Evaluate a calculation using Euler's number as the exponential base.", 2, "Yates Ch. 3 — Euler's number"],
  ["yates-rad-radioactive-decay-half-life", "Radiation", "Radioactive decay by half-life", "Radiation calculations", "Calculate remaining activity after elapsed half-lives.", 2, "Yates Ch. 26 — Radioactive decay and half-life"],
  ["formula-rad-nonionizing-far-field", "Radiation", "Far-field RF power density", "Nonionizing-radiation calculations", "Calculate far-field power density from gain, power, and distance.", 4, "Yates Ch. 26 — Nonionizing radiation"],
  ["formula-mech-friction", "Mechanics", "Friction force", "Force mechanics", "Calculate limiting friction from coefficient and normal force.", 1, "Yates Ch. 15 — Friction"],
] as const satisfies readonly (readonly [string, A1FormulaCategory, string, string, string, A1Difficulty, string])[];

const A1_PRACTICE_BLUEPRINT_OBJECTIVES = [
  "A1.4", "A1.11", "A1.11", "A1.11", "A1.12", "A1.12",
  "A1.10", "A1.10", "A1.7", "A1.7", "A1.10", "A1.2",
  "A1.14", "A1.3", "A1.5", "A1.6", "A1.14", "A1.14",
  "A1.3", "A1.3", "A1.3", "A1.3", "A1.14", "A1.3",
  "A1.3", "A1.3", "A1.3", "A1.3", "A1.14", "A1.15",
  "A1.15", "A1.5", "A1.5", "A1.5", "A1.5", "A1.13",
  "A1.13", "A1.13", "A1.13", "A1.13", "A1.13", "A1.6",
  "A1.6", "A1.16", "A1.1", "A1.8", "A1.16", "A1.16",
  "A1.5", "A1.8", "A1.11", "A1.1", "A1.4", "A1.7",
  "A1.9", "A1.9", "A1.12", "A1.15", "A1.15", "A1.10",
] as const;

const REQUIRED_FAMILY_SLUG_BY_ID: Readonly<Record<string, string>> = {
  "formula-math-right-triangle": "right-triangle-trigonometry",
  "yates-math-pemdas": "order-of-operations",
  "yates-math-signed-absolute-values": "signed-and-absolute-values",
  "yates-math-exponents-scientific-notation": "scientific-notation",
  "yates-math-engineering-notation": "engineering-notation",
  "yates-math-common-logarithms": "logarithms",
  "yates-math-equation-transposition": "equation-transposition",
  "yates-math-factorials": "factorials",
  "yates-math-common-geometry": "common-geometry",
  "yates-math-quadratic-equation": "quadratic-equation",
  "yates-math-eulers-number": "eulers-number",
};

const stableFamilySlug = (formulaId: string, family: string): string =>
  REQUIRED_FAMILY_SLUG_BY_ID[formulaId] ?? family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const A1_PRACTICE_COVERAGE: readonly FormulaCoverage[] = FAMILY_CATALOG.map(
  ([formulaId, formulaCategory, formulaFamily, competency, objective, difficulty, referenceTopic], index) => ({
    formulaId,
    formulaCategory,
    formulaFamily: stableFamilySlug(formulaId, formulaFamily),
    competency,
    objective,
    difficulty,
    referenceTopic,
    referenceFramework: formulaId === "nws-heat-wind-chill-index" ? "NWS" : "Yates",
    blueprintObjective: A1_PRACTICE_BLUEPRINT_OBJECTIVES[index],
  }),
);

export const A1_MOCK_A_FORMULA_IDS = [
  "yates-math-common-geometry",             // A1.1 storage capacity
  "formula-mech-force-weight",              // A1.2 rigging and load
  "formula-hyd-flow-pressure",              // A1.3 flow rates
  "formula-math-right-triangle",            // A1.4 trench slope geometry
  "formula-noise-duration",                 // A1.5 noise
  "formula-heat-outdoor-wbgt",              // A1.6 climate
  "formula-mech-displacement",              // A1.7 fall distance
  "yates-math-equation-transposition",      // A1.8 lagging rates
  "formula-ergo-rwl",                       // A1.9 manual lift
  "formula-mech-energy-work",               // A1.10 physics
  "formula-stat-sample-sd",                 // A1.11 descriptive statistics
  "formula-rel-exponential",                // A1.12 failure
  "formula-econ-present",                   // A1.13 finance
  "formula-vent-dilution",                  // A1.14 exposure
  "yates-rad-radioactive-decay-half-life",  // A1.15 radiation
  "formula-ih-ppm",                         // A1.16 conversion
  "formula-hyd-hazen-williams",             // extra flow
  "formula-noise-sound-power-level",        // extra noise
  "formula-mech-friction",                  // extra physics
  "formula-ih-ideal-gas",                   // extra exposure
] as const;

export const A1_MOCK_B_FORMULA_IDS = [
  "yates-math-common-geometry",              // A1.1 storage capacity
  "formula-mech-force-weight",              // A1.2 rigging and load
  "formula-hyd-static-residual-flow",       // A1.3 flow rates
  "yates-math-trig-inverse-trig",           // A1.4 trench slope geometry
  "formula-noise-sound-pressure-level",     // A1.5 noise
  "formula-heat-indoor-wbgt",               // A1.6 climate
  "formula-mech-displacement",              // A1.7 fall parameters
  "yates-math-equation-transposition",      // A1.8 lagging rates
  "formula-ergo-li",                        // A1.9 manual lift
  "formula-mech-velocity",                  // A1.10 physics
  "formula-stat-population-sd",             // A1.11 descriptive statistics
  "formula-rel-failure",                    // A1.12 failure
  "formula-econ-future",                    // A1.13 finance
  "formula-ih-mixture-tlv",                 // A1.14 exposure control
  "formula-rad-point-source",               // A1.15 radiation
  "formula-ih-ppm",                         // A1.16 concentration conversion
  "formula-mech-momentum",                  // extra physics
  "formula-mech-velocity-distance",         // extra fall
  "yates-math-factorials",                  // extra statistics
  "formula-rad-inverse-square",             // extra radiation
] as const;

const answer = (text: string, rationale: string): A1CalculationAnswer => ({ text, rationale });

const rounded = (value: number, digits = 2): string =>
  Number(value.toFixed(digits)).toLocaleString("en-US", { maximumFractionDigits: digits });

const dollars = (value: number): string =>
  `$${Math.round(value).toLocaleString("en-US")}`;

const factorial = (value: number): number => {
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
};

const problem = (
  stem: string,
  correctText: string,
  correctRationale: string,
  wrong: readonly [readonly [string, string], readonly [string, string], readonly [string, string]],
  challengePrompt: string,
): A1CalculationProblem => ({
  stem,
  correct: answer(correctText, correctRationale),
  distractors: [answer(...wrong[0]), answer(...wrong[1]), answer(...wrong[2])],
  challengePrompt,
});

export function buildA1CalculationProblem(formulaId: string, seed: number): A1CalculationProblem {
  const variant = Math.abs(seed) % 3;

  switch (formulaId) {
    case "formula-math-right-triangle": {
      const legs = [[6, 8], [9, 12], [12, 16]][variant];
      const [horizontal, vertical] = legs;
      const slopedFace = Math.sqrt(horizontal ** 2 + vertical ** 2);
      return problem(
        `A preliminary trench side has ${vertical} ft vertical depth and ${horizontal} ft horizontal run. Treating the cross-section as a right triangle, what is the sloped face length before any soil-classification decision?`,
        `${rounded(slopedFace, 1)} ft`,
        `The sloped face is the hypotenuse, so c = sqrt(${horizontal}^2 + ${vertical}^2) = ${rounded(slopedFace, 1)} ft.`,
        [
          [`${horizontal + vertical} ft`, "This adds the legs instead of applying the Pythagorean relationship."],
          [`${Math.abs(vertical - horizontal)} ft`, "This subtracts the two offsets and cannot represent the sloped face."],
          [`${horizontal ** 2 + vertical ** 2} ft`, "This omits the final square root and reports a squared quantity as length."],
        ],
        "Determine the slope angle above horizontal, express the run-to-depth ratio, and explain why soil rules still control the design.",
      );
    }

    case "formula-stat-sample-sd": {
      const samples = [[12, 14, 16], [18, 21, 24, 27], [5, 7, 8, 10, 15]] as const;
      const sample = samples[variant];
      const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
      const squaredDeviationSum = sample.reduce((sum, value) => sum + (value - mean) ** 2, 0);
      const sampleSd = Math.sqrt(squaredDeviationSum / (sample.length - 1));
      return problem(
        `A sample of exposure-monitor readings is ${sample.join(", ")} ppm. What sample standard deviation follows from s = sqrt[sum(xi-x-bar)^2/(n-1)]?`,
        `${rounded(sampleSd, 2)} ppm`,
        `The mean is ${rounded(mean, 2)} ppm and the squared-deviation sum is ${rounded(squaredDeviationSum, 2)}; sqrt(${rounded(squaredDeviationSum, 2)}/${sample.length - 1}) = ${rounded(sampleSd, 2)} ppm.`,
        [
          [`${rounded(Math.sqrt(squaredDeviationSum / sample.length), 2)} ppm`, "This divides by n and calculates a population standard deviation instead of the requested sample statistic."],
          [`${rounded(squaredDeviationSum / (sample.length - 1), 2)} ppm`, "This reports sample variance without taking the square root."],
          [`${rounded(Math.sqrt(squaredDeviationSum), 2)} ppm`, "This takes the square root before dividing by the degrees of freedom."],
        ],
        "Calculate the population standard deviation for the same numbers and explain why the denominators differ.",
      );
    }

    case "formula-stat-z": {
      const means = [42, 55, 70];
      const sigmas = [4, 5, 6];
      const offsets = [8, -10, 12];
      const mean = means[variant];
      const sigma = sigmas[variant];
      const value = mean + offsets[variant];
      const z = (value - mean) / sigma;
      return problem(
        `A calibrated exposure instrument normally reads with population mean ${mean} and standard deviation ${sigma} under a stable check atmosphere. Today's check result is ${value}. What is its z-score?`,
        `${rounded(z, 2)}`,
        `Standardizing gives z = (${value} - ${mean})/${sigma} = ${rounded(z, 2)}, with the sign showing the direction from the mean.`,
        [
          [`${rounded(value / sigma, 2)}`, "This divides the raw reading by the deviation without centering it on the mean."],
          [`${rounded((mean - value) / sigma, 2)}`, "This reverses the subtraction and therefore gives the wrong direction from the mean."],
          [`${rounded((value - mean) / sigma ** 2, 2)}`, "This divides by variance even though a z-score uses standard deviation."],
        ],
        "Explain why a large absolute z-score prompts investigation but does not by itself identify the cause of drift.",
      );
    }

    case "formula-stat-population-sd": {
      const populations = [[20, 22, 24, 26], [6, 9, 12], [11, 13, 14, 17, 20]] as const;
      const population = populations[variant];
      const mean = population.reduce((sum, value) => sum + value, 0) / population.length;
      const squaredDeviationSum = population.reduce((sum, value) => sum + (value - mean) ** 2, 0);
      const populationSd = Math.sqrt(squaredDeviationSum / population.length);
      return problem(
        `The complete population of readings from a defined calibration cycle is ${population.join(", ")} ppm. What population standard deviation follows from sigma = sqrt[sum(xi-mu)^2/N]?`,
        `${rounded(populationSd, 2)} ppm`,
        `The population mean is ${rounded(mean, 2)} ppm and the squared-deviation sum is ${rounded(squaredDeviationSum, 2)}; sqrt(${rounded(squaredDeviationSum, 2)}/${population.length}) = ${rounded(populationSd, 2)} ppm.`,
        [
          [`${rounded(Math.sqrt(squaredDeviationSum / (population.length - 1)), 2)} ppm`, "This applies the n-1 sample correction even though the data are the complete defined population."],
          [`${rounded(squaredDeviationSum / population.length, 2)} ppm`, "This reports population variance without taking the square root."],
          [`${rounded(Math.sqrt(squaredDeviationSum), 2)} ppm`, "This takes the square root without first dividing by the population size."],
        ],
        "Explain when these same readings would instead be treated as a sample requiring the n-1 denominator.",
      );
    }

    case "formula-rel-failure": {
      const reliabilities = [0.97, 0.985, 0.992];
      const reliability = reliabilities[variant];
      const failure = 1 - reliability;
      return problem(
        `A guard-interlock channel has demonstrated mission success probability ${rounded(reliability, 3)} for the defined test interval. For the same interval, what probability of failure corresponds to that reliability?`,
        `${rounded(failure, 3)} (${rounded(failure * 100, 1)}%)`,
        `Success and failure are complementary for the same mission, so Pf = 1 - ${rounded(reliability, 3)} = ${rounded(failure, 3)}.`,
        [
          [`${rounded(reliability, 3)} (${rounded(reliability * 100, 1)}%)`, "This repeats success reliability rather than calculating its failure complement."],
          [`${rounded(1 / reliability, 3)}`, "Taking the reciprocal does not convert a probability of success to failure."],
          [`${rounded((1 - reliability) ** 2, 4)}`, "Squaring the complement would represent two independent failures, which are not described."],
        ],
        "Explain why this complement is valid only when success and failure use the same mission definition and time interval.",
      );
    }

    case "formula-rel-exponential": {
      const rates = [0.001, 0.0015, 0.002];
      const times = [200, 160, 125];
      const rate = rates[variant];
      const time = times[variant];
      const reliability = Math.exp(-rate * time);
      return problem(
        `A portable gas detector is modeled with a constant dangerous-failure rate of ${rate} per operating hour. Under that simplifying model, what is the probability it survives a ${time}-hour deployment without that failure?`,
        `${rounded(reliability, 4)}`,
        `Constant-rate reliability is R(t) = e^(-lambda t) = e^(-${rate} x ${time}) = ${rounded(reliability, 4)}.`,
        [
          [`${rounded(rate * time, 4)}`, "This is the cumulative rate parameter, not the exponential survival probability."],
          [`${rounded(1 - rate * time, 4)}`, "This linear approximation is not the specified exponential reliability model."],
          [`${rounded(1 - reliability, 4)}`, "This is the modeled probability of failure, the complement of requested survival."],
        ],
        "Identify the lifecycle periods in which a constant failure rate may be an unrealistic assumption.",
      );
    }

    case "formula-mech-momentum": {
      const masses = [84, 96, 125];
      const westwardSpeeds = [3.5, 4.25, 2.8];
      const mass = masses[variant];
      const speed = westwardSpeeds[variant];
      const velocity = -speed;
      const momentum = mass * velocity;
      return problem(
        `Plant coordinates define east as positive. A powered material tug with total mass ${mass} kg travels west at ${speed} m/s. What is its signed linear momentum?`,
        `${rounded(momentum, 1)} kg-m/s`,
        `Westward velocity is -${speed} m/s, so p = mv = ${mass}(-${speed}) = ${rounded(momentum, 1)} kg-m/s.`,
        [
          [`${rounded(mass * speed, 1)} kg-m/s`, "This calculates the magnitude but drops the negative sign required for westward motion."],
          [`${rounded(0.5 * mass * speed ** 2, 1)} kg-m/s`, "This uses the kinetic-energy equation and then labels the result as momentum."],
          [`${rounded(-mass / speed, 2)} kg-m/s`, "This divides mass by speed even though linear momentum is their product."],
        ],
        "Explain how the sign and magnitude change if the tug reverses direction at the same speed.",
      );
    }

    case "formula-mech-velocity": {
      const initial = [1.5, 2, 3][variant];
      const acceleration = [0.8, 1.2, 1.5][variant];
      const time = [5, 4, 6][variant];
      const final = initial + acceleration * time;
      return problem(
        `A powered cart begins a straight test run at ${initial} m/s and accelerates uniformly at ${acceleration} m/s2 for ${time} s. What speed does it reach at the end of the interval?`,
        `${rounded(final, 1)} m/s`,
        `For constant acceleration, v = v0 + at = ${initial} + (${acceleration} x ${time}) = ${rounded(final, 1)} m/s.`,
        [
          [`${rounded(acceleration * time, 1)} m/s`, "This is only the change in speed and omits the cart's initial velocity."],
          [`${rounded(initial * time + acceleration, 1)} m/s`, "This combines terms with incompatible units and does not use the velocity equation."],
          [`${rounded(initial + acceleration / time, 1)} m/s`, "Acceleration must be multiplied by elapsed time, not divided by it."],
        ],
        "Recalculate the result if the stated acceleration acts opposite the initial direction.",
      );
    }

    case "formula-mech-displacement": {
      const initial = [0.5, 0.8, 1][variant];
      const acceleration = 9.81;
      const time = [0.4, 0.5, 0.6][variant];
      const distance = initial * time + 0.5 * acceleration * time ** 2;
      return problem(
        `In an idealized fall-clearance exercise, a test mass begins downward at ${initial} m/s and accelerates uniformly at ${acceleration} m/s2 for ${time} s before the modeled arrest phase. What free-fall distance does the simplified motion equation predict?`,
        `${rounded(distance, 1)} m`,
        `Displacement is v0t + one-half at^2 = (${initial} x ${time}) + 0.5(${acceleration})(${time}^2) = ${rounded(distance, 1)} m.`,
        [
          [`${rounded(initial * time + acceleration * time ** 2, 1)} m`, "This omits the one-half factor on the acceleration contribution."],
          [`${rounded(initial + acceleration * time, 1)} m`, "This calculates final speed and labels it as travel distance."],
          [`${rounded(0.5 * acceleration * time ** 2, 1)} m`, "This omits the distance traveled because of the initial velocity."],
        ],
        "Explain why an actual fall-clearance check must also include deceleration, system elongation, worker geometry, and safety margin.",
      );
    }

    case "formula-mech-velocity-distance": {
      const speeds = [3, 4, 5];
      const decelerations = [5, 7, 9];
      const speed = speeds[variant];
      const deceleration = decelerations[variant];
      const stoppingDistance = speed ** 2 / (2 * deceleration);
      return problem(
        `An idealized fall-arrest test mass enters its deceleration phase at ${speed} m/s and slows uniformly at ${deceleration} m/s2. What deceleration distance follows from v^2 = v0^2 + 2as?`,
        `${rounded(stoppingDistance, 1)} m`,
        `Set final speed to zero and a = -${deceleration}: s = ${speed}^2/(2 x ${deceleration}) = ${rounded(stoppingDistance, 1)} m.`,
        [
          [`${rounded(speed / deceleration, 1)} m`, "This produces stopping time, not stopping distance."],
          [`${rounded(speed ** 2 / deceleration, 1)} m`, "This omits the factor of two in the velocity-distance relationship."],
          [`${rounded(2 * deceleration / speed ** 2, 3)} m`, "This inverts the stopping-distance relationship."],
        ],
        "Explain why actual fall clearance must also include free-fall distance, system elongation, worker geometry, and safety margin.",
      );
    }

    case "formula-mech-energy-work": {
      const masses = [600, 800, 1_000];
      const speeds = [4, 5, 6];
      const mass = masses[variant];
      const speed = speeds[variant];
      const energy = 0.5 * mass * speed ** 2;
      return problem(
        `A material cart with total mass ${mass} kg is moving at ${speed} m/s before an emergency stop. What kinetic energy must the braking system dissipate, ignoring rotation and grade?`,
        `${rounded(energy / 1_000, 1)} kJ`,
        `KE = one-half mv^2 = 0.5(${mass})(${speed}^2) = ${rounded(energy, 0)} J, or ${rounded(energy / 1_000, 1)} kJ.`,
        [
          [`${rounded(mass * speed / 1_000, 1)} kJ`, "This uses momentum-like multiplication and omits both one-half and squared speed."],
          [`${rounded(mass * speed ** 2 / 1_000, 1)} kJ`, "This omits the one-half factor and doubles the kinetic energy."],
          [`${rounded(0.5 * mass * speed / 1_000, 1)} kJ`, "This fails to square velocity, understating the effect of speed."],
        ],
        "Calculate the average stopping force if that energy is dissipated uniformly over a specified stopping distance.",
      );
    }

    case "formula-mech-force-weight": {
      const masses = [35, 50, 75];
      const mass = masses[variant];
      const weight = mass * 9.81;
      return problem(
        `A removable machine component has mass ${mass} kg. Using g = 9.81 m/s2, what gravitational force must a lifting aid support before applying any design factor?`,
        `${rounded(weight, 1)} N`,
        `Weight is W = mg = ${mass} kg x 9.81 m/s2 = ${rounded(weight, 1)} N.`,
        [
          [`${mass} N`, "This treats the numerical mass in kilograms as though it were force in newtons."],
          [`${rounded(mass / 9.81, 2)} N`, "This divides by gravitational acceleration instead of multiplying by it."],
          [`${rounded(weight / 1_000, 3)} N`, "This converts to kilonewtons numerically but incorrectly retains newtons as the unit."],
        ],
        "Explain how the required rated capacity changes when dynamic loading and sling geometry are introduced.",
      );
    }

    case "formula-vent-evaporation-dilution": {
      const specificGravities = [0.79, 0.87, 1.05];
      const evaporationPtHr = [0.3, 0.18, 0.24];
      const mixingFactors = [2, 3, 2.5];
      const molecularWeights = [58, 86, 100];
      const targetConcentrations = [500, 300, 400];
      const specificGravity = specificGravities[variant];
      const evaporationPerHour = evaporationPtHr[variant];
      const mixingFactor = mixingFactors[variant];
      const molecularWeight = molecularWeights[variant];
      const targetPpm = targetConcentrations[variant];
      const evaporationPerMinute = evaporationPerHour / 60;
      const flow = 403e6 * specificGravity * evaporationPerMinute * mixingFactor / (molecularWeight * targetPpm);
      return problem(
        `A liquid evaporates at ${evaporationPerHour} pint/h. For the supplied US-unit shortcut Q = 403 x 10^6(SG)(ER)(K)/(MW C), ER must be in pint/min. If SG = ${specificGravity}, K = ${mixingFactor}, MW = ${molecularWeight}, and C = ${targetPpm} ppm, what ideal dilution airflow results?`,
        `${rounded(flow, 1)} cfm`,
        `ER = ${evaporationPerHour}/60 = ${rounded(evaporationPerMinute, 4)} pint/min; substitution gives Q = ${rounded(flow, 1)} cfm.`,
        [
          [`${rounded(flow * 60, 1)} cfm`, "This uses pints per hour directly instead of converting evaporation rate to pints per minute."],
          [`${rounded(flow / mixingFactor, 1)} cfm`, "This omits the stated mixing factor from the numerator."],
          [`${rounded(flow / specificGravity ** 2, 1)} cfm`, "This divides by specific gravity even though the supplied shortcut multiplies by it."],
        ],
        "Identify the unit limitations, perfect-mixing assumption, and source-control alternatives that must be checked before design use.",
      );
    }

    case "formula-hyd-bernoulli-loss": {
      const elevationDrops = [18, 24, 30];
      const headLosses = [3, 5, 7];
      const elevationDrop = elevationDrops[variant];
      const headLoss = headLosses[variant];
      const gravity = 9.81;
      const outletVelocity = Math.sqrt(2 * gravity * (elevationDrop - headLoss));
      return problem(
        `Water flows from a large open reservoir to a free outlet ${elevationDrop} m below the surface. Both points are at atmospheric pressure, surface velocity is negligible, and total head loss is ${headLoss} m. What outlet velocity follows from the extended Bernoulli equation?`,
        `${rounded(outletVelocity, 1)} m/s`,
        `The pressure terms cancel and zA-zB = vB^2/(2g) + hL, so vB = sqrt[2(${gravity})(${elevationDrop}-${headLoss})] = ${rounded(outletVelocity, 1)} m/s.`,
        [
          [`${rounded(Math.sqrt(2 * gravity * elevationDrop), 1)} m/s`, "This treats all elevation head as available and ignores the stated head loss."],
          [`${rounded(Math.sqrt(2 * gravity * (elevationDrop + headLoss)), 1)} m/s`, "This adds head loss as though it supplied energy to the flow."],
          [`${rounded(Math.sqrt(gravity * (elevationDrop - headLoss)), 1)} m/s`, "This omits the factor of two in the velocity-head term."],
        ],
        "Identify the pressure and velocity terms that canceled and explain why head loss is positive in the flow direction.",
      );
    }

    case "formula-noise-absorption-change": {
      const originalAbsorption = [120, 160, 250];
      const revisedAbsorption = [360, 640, 1_250];
      const original = originalAbsorption[variant];
      const revised = revisedAbsorption[variant];
      const reduction = 10 * Math.log10(revised / original);
      return problem(
        `A room's total absorption is increased from ${original} to ${revised.toLocaleString("en-US")} sabins. Under the reverberant-field estimate NR = 10log10(A2/A1), what sound-level reduction magnitude is predicted?`,
        `${rounded(reduction, 2)} dB`,
        `The revised-to-original absorption ratio is ${rounded(revised / original, 2)}; applying 10log10 to that ratio gives a predicted reduction of ${rounded(reduction, 2)} dB.`,
        [
          [`${rounded(10 * Math.log10(original / revised), 2)} dB`, "This reverses the absorption ratio and changes the sign of the reduction magnitude."],
          [`${rounded(20 * Math.log10(revised / original), 2)} dB`, "This uses a 20-log amplitude relationship instead of the specified 10-log absorption relationship."],
          [`${rounded(10 * Math.log10((revised - original) / original), 2)} dB`, "This uses only added absorption as A2 rather than the revised total absorption."],
        ],
        "State why source directivity, room geometry, and nonreverberant exposure positions can limit this estimate.",
      );
    }

    // Official NWS Fahrenheit equation and scope limits:
    // https://www.weather.gov/safety/cold-wind-chill-chart
    case "nws-heat-wind-chill-index": {
      const temperaturesF = [30, 20, 10];
      const windSpeedsMph = [10, 15, 25];
      const temperature = temperaturesF[variant];
      const windSpeed = windSpeedsMph[variant];
      const windChill = (tempF: number, speedMph: number): number =>
        35.74 + 0.6215 * tempF - 35.75 * speedMph ** 0.16 + 0.4275 * tempF * speedMph ** 0.16;
      const result = windChill(temperature, windSpeed);
      return problem(
        `At an outdoor worksite, air temperature is ${temperature} degrees F and wind speed is ${windSpeed} mph. Using the supplied NWS equation WCT = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16, what wind-chill temperature results?`,
        `${rounded(result, 1)} degrees F`,
        `Substituting T = ${temperature} degrees F and V = ${windSpeed} mph gives WCT = ${rounded(result, 1)} degrees F.`,
        [
          [`${temperature} degrees F`, "This reports air temperature without applying the wind-speed adjustment."],
          [`${rounded(windChill(temperature, windSpeed * 1.609344), 1)} degrees F`, "This feeds a kilometres-per-hour value into coefficients that require miles per hour."],
          [`${rounded(35.74 + 0.6215 * temperature - 35.75 * windSpeed ** 0.16, 1)} degrees F`, "This omits the temperature-wind interaction term from the supplied equation."],
        ],
        "State the equation's temperature and wind-speed limits and explain why wind chill is an exposed-skin index rather than a new air temperature.",
      );
    }

    case "formula-ih-ideal-gas": {
      const moles = [1.2, 1.5, 2];
      const temperatures = [295, 300, 310];
      const pressures = [1.1, 1.2, 1.5];
      const molesValue = moles[variant];
      const temperature = temperatures[variant];
      const pressure = pressures[variant];
      const volume = molesValue * 0.082057 * temperature / pressure;
      return problem(
        `A movable-piston calibration vessel contains ${molesValue} mol of an idealized gas at ${temperature} K and ${pressure} atm absolute. Using R = 0.082057 L-atm/(mol-K), what volume does PV = nRT predict?`,
        `${rounded(volume, 1)} L`,
        `Solving for volume gives V = nRT/P = (${molesValue})(0.082057)(${temperature})/${pressure} = ${rounded(volume, 1)} L.`,
        [
          [`${rounded(molesValue * 0.082057 * temperature * pressure, 1)} L`, "This multiplies by pressure even though pressure divides volume in the rearranged equation."],
          [`${rounded(pressure / (molesValue * 0.082057 * temperature), 4)} L`, "This inverts the rearranged ideal-gas relationship."],
          [`${rounded(molesValue * 0.082057 / temperature / pressure, 4)} L`, "This places absolute temperature in the denominator instead of the numerator."],
        ],
        "State why temperature must be absolute and identify one reason a real gas may depart from this model.",
      );
    }

    case "formula-ih-mixture-tlv": {
      const fractionSets = [[0.6, 0.4], [0.25, 0.75], [0.4, 0.35, 0.25]] as const;
      const limitSets = [[100, 50], [40, 120], [50, 100, 200]] as const;
      const totalConcentrations = [80, 72, 90];
      const fractions = fractionSets[variant];
      const limits = limitSets[variant];
      const totalConcentration = totalConcentrations[variant];
      const denominator = fractions.reduce((sum, fraction, index) => sum + fraction / limits[index], 0);
      const mixtureLimit = 1 / denominator;
      const additiveIndex = totalConcentration / mixtureLimit;
      const arithmeticLimit = fractions.reduce((sum, fraction, index) => sum + fraction * limits[index], 0);
      const unweightedLimit = 1 / limits.reduce((sum, limit) => sum + 1 / limit, 0);
      const minimumLimit = Math.min(...limits);
      return problem(
        `A vapor mixture has component fractions ${fractions.join(", ")} with compatible limits ${limits.join(", ")} ppm, and total measured concentration ${totalConcentration} ppm. Using TLVm = 1/sum(fi/TLVi), what equivalent mixture limit and additive index total/TLVm result?`,
        `${rounded(mixtureLimit, 2)} ppm and index ${rounded(additiveIndex, 2)}`,
        `Sum(fi/TLVi) = ${rounded(denominator, 5)}, so TLVm = ${rounded(mixtureLimit, 2)} ppm and ${totalConcentration}/${rounded(mixtureLimit, 2)} = ${rounded(additiveIndex, 2)}.`,
        [
          [`${rounded(arithmeticLimit, 2)} ppm and index ${rounded(totalConcentration / arithmeticLimit, 2)}`, "This uses a weighted arithmetic mean instead of the reciprocal mixture-limit relationship."],
          [`${rounded(unweightedLimit, 2)} ppm and index ${rounded(totalConcentration / unweightedLimit, 2)}`, "This ignores the component fractions when combining the limits."],
          [`${rounded(minimumLimit, 2)} ppm and index ${rounded(totalConcentration / minimumLimit, 2)}`, "This substitutes the lowest component limit for the calculated mixture limit."],
        ],
        "Explain why the additive model must be scientifically justified and why component fractions and limits need a consistent concentration basis.",
      );
    }

    case "formula-hyd-velocity-pressure": {
      const flows = [120, 180, 240];
      const diameters = [2, 2.5, 3];
      const flow = flows[variant];
      const diameter = diameters[variant];
      const pressure = flow ** 2 / (891 * diameter ** 4);
      return problem(
        `A smooth-bore fire stream carries ${flow} gpm through a ${diameter}-in. opening. Using pv = Q^2/(891d^4), what velocity pressure does the stated relationship predict?`,
        `${rounded(pressure, 3)} psi`,
        `Substitution gives pv = ${flow}^2/[891(${diameter}^4)] = ${rounded(pressure, 3)} psi.`,
        [
          [`${rounded(flow / (891 * diameter ** 2), 3)} psi`, "This fails to square flow and uses the wrong power on diameter."],
          [`${rounded(flow ** 2 / (891 * diameter ** 2), 3)} psi`, "This squares diameter rather than applying the required fourth power."],
          [`${rounded(891 * diameter ** 4 / flow ** 2, 3)} psi`, "This inverts the velocity-pressure relationship."],
        ],
        "Explain why a modest diameter error can materially change the result when diameter is raised to the fourth power.",
      );
    }

    case "formula-hyd-static-residual-flow": {
      const staticPressures = [80, 90, 100];
      const firstResiduals = [50, 60, 65];
      const secondResiduals = [20, 30, 35];
      const firstFlows = [1_000, 1_200, 1_500];
      const staticPressure = staticPressures[variant];
      const firstResidual = firstResiduals[variant];
      const secondResidual = secondResiduals[variant];
      const firstFlow = firstFlows[variant];
      const secondFlow = firstFlow * ((staticPressure - secondResidual) / (staticPressure - firstResidual)) ** 0.54;
      return problem(
        `A hydrant test records static pressure ${staticPressure} psi and ${firstFlow.toLocaleString("en-US")} gpm at ${firstResidual} psi residual. Using Q2 = Q1[(S-R2)/(S-R1)]^0.54, what flow is projected at ${secondResidual} psi residual?`,
        `${rounded(secondFlow, 0)} gpm`,
        `The pressure-drop ratio is (${staticPressure}-${secondResidual})/(${staticPressure}-${firstResidual}); raising it to 0.54 and multiplying by ${firstFlow} gives ${rounded(secondFlow, 0)} gpm.`,
        [
          [`${rounded(firstFlow * (staticPressure - secondResidual) / (staticPressure - firstResidual), 0)} gpm`, "This omits the specified 0.54 exponent."],
          [`${rounded(firstFlow * ((staticPressure - firstResidual) / (staticPressure - secondResidual)) ** 0.54, 0)} gpm`, "This reverses the pressure-drop ratio."],
          [`${firstFlow.toLocaleString("en-US")} gpm`, "This assumes flow is unchanged despite the different residual-pressure condition."],
        ],
        "State why water-supply design should also consider test quality, seasonal demand, and system deterioration.",
      );
    }

    case "formula-hyd-flow-pressure": {
      const initialFlows = [100, 150, 240];
      const initialPressures = [25, 36, 64];
      const finalPressures = [64, 81, 100];
      const initialFlow = initialFlows[variant];
      const initialPressure = initialPressures[variant];
      const finalPressure = finalPressures[variant];
      const finalFlow = initialFlow * Math.sqrt(finalPressure / initialPressure);
      return problem(
        `A sprinkler discharges ${initialFlow} gpm at ${initialPressure} psi. Assuming the same orifice and coefficient, what flow is expected at ${finalPressure} psi using Q2 = Q1 sqrt(P2/P1)?`,
        `${rounded(finalFlow, 1)} gpm`,
        `Flow scales with the square root of pressure: Q2 = ${initialFlow}sqrt(${finalPressure}/${initialPressure}) = ${rounded(finalFlow, 1)} gpm.`,
        [
          [`${rounded(initialFlow * finalPressure / initialPressure, 1)} gpm`, "This scales flow linearly with pressure and ignores the square-root relationship."],
          [`${rounded(initialFlow * Math.sqrt(initialPressure / finalPressure), 1)} gpm`, "This reverses the pressure ratio and predicts lower flow at higher pressure."],
          [`${rounded(initialFlow + finalPressure - initialPressure, 1)} gpm`, "Adding a pressure difference to flow mixes unlike units and has no hydraulic basis."],
        ],
        "Explain why changes in orifice geometry or discharge coefficient would invalidate this simple scaling.",
      );
    }

    case "formula-hyd-hazen-williams": {
      const flows = [350, 500, 650];
      const coefficients = [120, 130, 140];
      const diameters = [5, 6, 7];
      const flow = flows[variant];
      const coefficient = coefficients[variant];
      const diameter = diameters[variant];
      const pressureDrop = 4.52 * flow ** 1.85 / (coefficient ** 1.85 * diameter ** 4.87);
      return problem(
        `For a screening comparison, water flow is ${flow} gpm in a ${diameter}-in. pipe with Hazen-Williams coefficient C = ${coefficient}. Using Pdrop = 4.52Q^1.85/(C^1.85d^4.87), what friction pressure loss per foot results?`,
        `${rounded(pressureDrop, 4)} psi/ft`,
        `Substituting Q = ${flow}, C = ${coefficient}, and d = ${diameter} gives 4.52(${flow}^1.85)/[${coefficient}^1.85(${diameter}^4.87)] = ${rounded(pressureDrop, 4)} psi/ft.`,
        [
          [`${rounded(4.52 * flow / (coefficient * diameter), 4)} psi/ft`, "This ignores every required exponent and materially changes pipe-flow scaling."],
          [`${rounded(4.52 * flow ** 1.85 / (coefficient ** 1.85 * diameter ** 2), 4)} psi/ft`, "This squares diameter instead of raising it to the specified 4.87 power."],
          [`${rounded(4.52 * coefficient ** 1.85 * diameter ** 4.87 / flow ** 1.85, 4)} psi/ft`, "This inverts the controlling flow, roughness, and diameter relationship."],
        ],
        "Describe how pipe length, fittings, aging, and unit convention must be incorporated before using the result in design.",
      );
    }

    case "formula-vent-transient-clearance": {
      const roomVolumes = [6_000, 8_000, 12_000];
      const effectiveFlows = [600, 1_000, 1_500];
      const initialConcentrations = [400, 300, 500];
      const targetConcentrations = [100, 50, 25];
      const volume = roomVolumes[variant];
      const flow = effectiveFlows[variant];
      const initial = initialConcentrations[variant];
      const target = targetConcentrations[variant];
      const clearanceTime = volume / flow * Math.log(initial / target);
      return problem(
        `After a release stops, a perfectly mixed ${volume.toLocaleString("en-US")}-ft3 room is purged at constant effective airflow ${flow.toLocaleString("en-US")} cfm. How long does concentration take to fall from ${initial} ppm to ${target} ppm using delta-t = (V/Q)ln(C1/C2)?`,
        `${rounded(clearanceTime, 2)} min`,
        `Delta-t = (${volume}/${flow})ln(${initial}/${target}) = ${rounded(clearanceTime, 2)} min.`,
        [
          [`${rounded(volume / flow * Math.log10(initial / target), 2)} min`, "This uses common logarithm even though the clearance relationship requires the natural logarithm."],
          [`${rounded(volume / flow, 2)} min`, "This reports one nominal air-change time and ignores the required concentration ratio."],
          [`${rounded(volume / flow * (1 - target / initial), 2)} min`, "This assumes linear concentration decay instead of exponential well-mixed clearance."],
        ],
        "Explain how short-circuiting, dead zones, continuing generation, and imperfect mixing would change a field purge plan.",
      );
    }

    case "formula-vent-velocity-pressure": {
      const pressures = [0.25, 0.5, 0.75];
      const velocityPressure = pressures[variant];
      const velocity = 4005 * Math.sqrt(velocityPressure);
      return problem(
        `A pitot traverse in standard-density air yields average velocity pressure ${velocityPressure} in. water gauge. Using V = 4005sqrt(VP), what average duct velocity is indicated?`,
        `${rounded(velocity, 0)} ft/min`,
        `V = 4005sqrt(${velocityPressure}) = ${rounded(velocity, 0)} ft/min under the standard-density assumption.`,
        [
          [`${rounded(4005 * velocityPressure, 0)} ft/min`, "This omits the square root and overstates the pressure effect."],
          [`${rounded(4005 / Math.sqrt(velocityPressure), 0)} ft/min`, "This divides by the square root and reverses the velocity-pressure relationship."],
          [`${rounded(Math.sqrt(4005 * velocityPressure), 0)} ft/min`, "This incorrectly places the constant inside the square root."],
        ],
        "Explain when air-density correction is needed and how it changes interpretation of velocity pressure.",
      );
    }

    case "formula-vent-hood-entry": {
      const coefficients = [0.72, 0.82, 0.9];
      const staticPressures = [0.8, 1, 1.2];
      const coefficient = coefficients[variant];
      const staticPressure = staticPressures[variant];
      const velocity = 4005 * coefficient * Math.sqrt(staticPressure);
      return problem(
        `A flanged hood has measured entry coefficient Ce = ${coefficient} and hood static-pressure magnitude ${staticPressure} in. water gauge. Using V = 4005Ce sqrt(SPh), what entry velocity is estimated?`,
        `${rounded(velocity, 0)} ft/min`,
        `The hood relationship gives V = 4005(${coefficient})sqrt(${staticPressure}) = ${rounded(velocity, 0)} ft/min.`,
        [
          [`${rounded(4005 * Math.sqrt(staticPressure), 0)} ft/min`, "This assumes an ideal coefficient of one and omits the measured entry loss."],
          [`${rounded(4005 * staticPressure / coefficient, 0)} ft/min`, "This divides by the entry coefficient and uses static pressure directly rather than its square root."],
          [`${rounded(4005 * Math.sqrt(coefficient * staticPressure), 0)} ft/min`, "This incorrectly places the entry coefficient inside the square root."],
        ],
        "Describe how a changed flange, obstruction, or cross-draft can make the measured entry coefficient nontransferable.",
      );
    }

    case "formula-vent-total-pressure": {
      const statics = [-1.4, -1.1, 0.8];
      const velocities = [0.6, 0.45, 0.35];
      const staticPressure = statics[variant];
      const velocityPressure = velocities[variant];
      const totalPressure = staticPressure + velocityPressure;
      return problem(
        `At one exhaust-duct station, static pressure is ${staticPressure} in. water gauge and velocity pressure is ${velocityPressure} in. water gauge. What total pressure follows from TP = SP + VP?`,
        `${rounded(totalPressure, 2)} in. water gauge`,
        `Pressure signs must be retained: TP = ${staticPressure} + ${velocityPressure} = ${rounded(totalPressure, 2)} in. water gauge.`,
        [
          [`${rounded(Math.abs(staticPressure) - velocityPressure, 2)} in. water gauge`, "This discards the static-pressure sign and then subtracts velocity pressure."],
          [`${rounded(staticPressure + 2 * velocityPressure, 2)} in. water gauge`, "This counts velocity pressure twice instead of adding it once."],
          [`${rounded(staticPressure * velocityPressure, 2)} in. water gauge`, "Multiplying the two pressure components does not produce total pressure."],
        ],
        "Explain why pressure signs and a consistent reference location matter when diagnosing an exhaust system.",
      );
    }

    case "formula-vent-fan-static-pressure": {
      const outlets = [1.2, 1.5, 1.8];
      const inlets = [-2.2, -2.6, -3];
      const inletVelocityPressures = [0.5, 0.6, 0.7];
      const outlet = outlets[variant];
      const inlet = inlets[variant];
      const inletVp = inletVelocityPressures[variant];
      const fanStatic = outlet - inlet - inletVp;
      return problem(
        `A fan test measures outlet static pressure ${outlet} in. water gauge, inlet static pressure ${inlet} in. water gauge, and inlet velocity pressure ${inletVp} in. water gauge. What fan static pressure follows from SPfan = SPout - SPin - VPin?`,
        `${rounded(fanStatic, 2)} in. water gauge`,
        `SPfan = ${outlet} - (${inlet}) - ${inletVp} = ${rounded(fanStatic, 2)} in. water gauge.`,
        [
          [`${rounded(outlet + inlet - inletVp, 2)} in. water gauge`, "This adds the signed inlet static pressure instead of subtracting it as specified."],
          [`${rounded(outlet - inlet + inletVp, 2)} in. water gauge`, "This adds inlet velocity pressure rather than subtracting it."],
          [`${rounded(outlet - inlet, 2)} in. water gauge`, "This omits the inlet velocity-pressure correction from fan static pressure."],
        ],
        "State what additional outlet velocity data would be needed for a complete fan total-pressure evaluation.",
      );
    }

    case "formula-vent-capture": {
      const distances = [1.2, 1.5, 2];
      const areas = [3, 4, 5];
      const velocities = [120, 100, 90];
      const distance = distances[variant];
      const area = areas[variant];
      const captureVelocity = velocities[variant];
      const flow = captureVelocity * (10 * distance ** 2 + area);
      return problem(
        `A plain-opening hood must provide ${captureVelocity} ft/min at a source ${distance} ft from an opening of area ${area} ft2. Using Q = V(10x^2 + A), what ideal exhaust flow is required?`,
        `${rounded(flow, 0)} cfm`,
        `Q = ${captureVelocity}[10(${distance}^2) + ${area}] = ${rounded(flow, 0)} cfm.`,
        [
          [`${rounded(captureVelocity * (10 * distance + area), 0)} cfm`, "This fails to square the source distance."],
          [`${rounded(captureVelocity * (distance ** 2 + area), 0)} cfm`, "This omits the coefficient of ten on the distance term."],
          [`${rounded((10 * distance ** 2 + area) / captureVelocity, 2)} cfm`, "This divides by capture velocity instead of multiplying by it."],
        ],
        "Explain why cross-drafts and source momentum can require more flow than this idealized plain-opening estimate.",
      );
    }

    case "formula-vent-dilution": {
      const generations = [0.6, 0.8, 1];
      const targets = [40, 50, 60];
      const generation = generations[variant];
      const targetPpm = targets[variant];
      const targetFraction = targetPpm / 1_000_000;
      const flow = generation / targetFraction;
      return problem(
        `A process releases an idealized contaminant-gas volume of ${generation} cfm into a perfectly mixed room. What dilution airflow follows from Q = G/C when the target concentration is ${targetPpm} ppm by volume?`,
        `${rounded(flow, 0)} cfm`,
        `${targetPpm} ppm is ${targetFraction}; Q = ${generation}/${targetFraction} = ${rounded(flow, 0)} cfm.`,
        [
          [`${rounded(generation / targetPpm, 4)} cfm`, "This uses ppm as a whole number instead of converting it to a volume fraction."],
          [`${rounded(generation * targetPpm, 1)} cfm`, "This multiplies generation by concentration instead of dividing by the target fraction."],
          [`${rounded(targetFraction / generation, 6)} cfm`, "This inverts the dilution relationship."],
        ],
        "Identify mixing, toxicity, flammability, and source-control limitations that must be checked before relying on dilution.",
      );
    }

    case "formula-rad-inverse-square": {
      const initialRates = [180, 240, 320];
      const initialDistances = [1, 1.5, 2];
      const finalDistances = [3, 4.5, 6];
      const initialRate = initialRates[variant];
      const initialDistance = initialDistances[variant];
      const finalDistance = finalDistances[variant];
      const finalRate = initialRate * (initialDistance / finalDistance) ** 2;
      return problem(
        `A small source produces ${initialRate} microSv/h at ${initialDistance} m in an unobstructed survey. Under an ideal point-source model, what rate is expected at ${finalDistance} m?`,
        `${rounded(finalRate, 2)} microSv/h`,
        `I2 = I1(d1/d2)^2 = ${initialRate}(${initialDistance}/${finalDistance})^2 = ${rounded(finalRate, 2)} microSv/h.`,
        [
          [`${rounded(initialRate * initialDistance / finalDistance, 2)} microSv/h`, "This applies inverse distance rather than the required inverse square."],
          [`${rounded(initialRate * (finalDistance / initialDistance) ** 2, 2)} microSv/h`, "This reverses the distance ratio and predicts increasing rate with distance."],
          [`${rounded(initialRate * (initialDistance / (finalDistance - initialDistance)) ** 2, 2)} microSv/h`, "This substitutes distance traveled for the final source distance."],
        ],
        "Name source geometry, scatter, and shielding conditions that can limit the ideal point-source estimate.",
      );
    }

    case "formula-rad-point-source": {
      const activities = [1.5, 2, 2.5];
      const energies = [0.8, 1, 1.2];
      const yields = [0.75, 0.85, 0.9];
      const activity = activities[variant];
      const energy = energies[variant];
      const yieldFraction = yields[variant];
      const estimate = 6 * activity * energy * yieldFraction;
      return problem(
        `For a screening estimate, a gamma source has activity ${activity} Ci, photon energy ${energy} MeV, and emission yield ${yieldFraction} per decay. Using S approximately 6CiEf, what unshielded exposure-rate estimate results at 1 ft?`,
        `${rounded(estimate, 2)} R/h at 1 ft`,
        `The shortcut gives S = 6(${activity})(${energy})(${yieldFraction}) = ${rounded(estimate, 2)} R/h at 1 ft.`,
        [
          [`${rounded(activity * energy * yieldFraction, 2)} R/h at 1 ft`, "This omits the shortcut's factor of six."],
          [`${rounded(6 * activity * energy / yieldFraction, 2)} R/h at 1 ft`, "This divides by emission yield even though the relationship multiplies by it."],
          [`${rounded(6 + activity * energy * yieldFraction, 2)} R/h at 1 ft`, "This adds the shortcut constant instead of multiplying all three source terms by it."],
        ],
        "Explain why radionuclide spectrum, distance, shielding, buildup, and calibration must be included in a real dose assessment.",
      );
    }

    case "formula-noise-sound-power-level": {
      const powers = [0.001, 0.01, 0.1];
      const acousticPower = powers[variant];
      const level = 10 * Math.log10(acousticPower / 1e-12);
      return problem(
        `A machine emits ${acousticPower} W of acoustic power in a controlled laboratory determination. Using W0 = 1 x 10^-12 W, what sound power level follows from Lw = 10log10(W/W0)?`,
        `${rounded(level, 1)} dB`,
        `Lw = 10log10(${acousticPower}/10^-12) = ${rounded(level, 1)} dB re 10^-12 W.`,
        [
          [`${rounded(20 * Math.log10(acousticPower / 1e-12), 1)} dB`, "This uses the pressure-amplitude multiplier of 20 for a power ratio."],
          [`${rounded(10 * Math.log10(acousticPower), 1)} dB`, "This omits division by the reference acoustic power."],
          [`${rounded(acousticPower / 1e-12, 0)} dB`, "This reports the raw power ratio without taking its logarithm."],
        ],
        "Distinguish sound power level from the sound pressure level a worker measures at a particular location.",
      );
    }

    case "formula-noise-sound-pressure-level": {
      const pressures = [0.02, 0.0632, 0.2];
      const measuredPressure = pressures[variant];
      const level = 20 * Math.log10(measuredPressure / 0.00002);
      return problem(
        `At a workstation, RMS sound pressure is ${measuredPressure} Pa. Using reference pressure 20 micropascals, what level follows from Lp = 20log10(p/p0)?`,
        `${rounded(level, 1)} dB`,
        `Lp = 20log10(${measuredPressure}/0.00002) = ${rounded(level, 1)} dB re 20 micropascals.`,
        [
          [`${rounded(10 * Math.log10(measuredPressure / 0.00002), 1)} dB`, "This uses the power-ratio multiplier of 10 for a pressure-amplitude ratio."],
          [`${rounded(20 * Math.log10(measuredPressure), 1)} dB`, "This omits the reference pressure from the logarithmic ratio."],
          [`${rounded(measuredPressure / 0.00002, 0)} dB`, "This is the raw pressure ratio, not its logarithmic level."],
        ],
        "Explain why frequency weighting and instrument response still matter when evaluating worker exposure.",
      );
    }

    case "formula-noise-duration": {
      const levels = [95, 100, 105];
      const level = levels[variant];
      const duration = 8 / 2 ** ((level - 90) / 5);
      return problem(
        `A source-era OSHA screening uses a 90-dBA criterion and 5-dB exchange rate. What allowable duration corresponds to ${level} dBA using T = 8/2^((L-90)/5)?`,
        `${rounded(duration, 2)} h`,
        `T = 8/2^((${level}-90)/5) = ${rounded(duration, 2)} hours under the stated 5-dB exchange convention.`,
        [
          [`${rounded(8 * 2 ** ((level - 90) / 5), 2)} h`, "This multiplies by the exchange factor and predicts longer duration at higher level."],
          [`${rounded(8 / 2 ** ((level - 85) / 5), 2)} h`, "This substitutes an 85-dBA criterion for the stated 90-dBA criterion."],
          [`8 h`, "This ignores the stated level above the 90-dBA criterion."],
        ],
        "Explain why a different criterion level or exchange rate requires recalculating the duration table.",
      );
    }

    case "formula-noise-dose-twa": {
      const doses = [150, 200, 300];
      const dose = doses[variant];
      const twa = 16.61 * Math.log10(dose / 100) + 90;
      return problem(
        `A dosimeter reports ${dose}% dose using the stated OSHA 5-dB method. What equivalent 8-hour TWA follows from TWA = 16.61log10(D/100) + 90?`,
        `${rounded(twa, 1)} dBA`,
        `Substituting D = ${dose} gives 16.61log10(${dose}/100) + 90 = ${rounded(twa, 1)} dBA.`,
        [
          [`${rounded(90 * dose / 100, 1)} dBA`, "This scales the criterion arithmetically even though decibels require a logarithm."],
          [`${rounded(16.61 * Math.log10(dose) + 90, 1)} dBA`, "This uses the percentage as a whole number and omits division by 100."],
          [`${rounded(90 + dose / 100, 1)} dBA`, "This adds dose fraction directly to the criterion level."],
        ],
        "Describe why the result cannot be compared directly with a TWA derived under a different exchange convention.",
      );
    }

    case "formula-econ-future": {
      const principals = [20_000, 30_000, 40_000];
      const rates = [0.04, 0.05, 0.06];
      const years = [4, 5, 6];
      const principal = principals[variant];
      const rate = rates[variant];
      const year = years[variant];
      const future = principal * (1 + rate) ** year;
      return problem(
        `A reserve of ${dollars(principal)} is set aside today for a guard replacement and earns ${rounded(rate * 100, 0)}% annually for ${year} years. What future value results from F = P(1+i)^n?`,
        `${dollars(future)}`,
        `Compounding gives ${dollars(principal)}(1 + ${rate})^${year} = ${dollars(future)} after rounding to the nearest dollar.`,
        [
          [`${dollars(principal * (1 + rate * year))}`, "This applies simple interest and omits compounding across periods."],
          [`${dollars(principal / (1 + rate) ** year)}`, "This discounts to present value instead of compounding to future value."],
          [`${dollars(principal * rate * year)}`, "This reports only simple-interest earnings and omits the original reserve."],
        ],
        "Identify inflation, tax, and investment-risk assumptions that should accompany the nominal future value.",
      );
    }

    case "formula-econ-present": {
      const futures = [50_000, 75_000, 100_000];
      const rates = [0.04, 0.05, 0.06];
      const years = [4, 5, 6];
      const future = futures[variant];
      const rate = rates[variant];
      const year = years[variant];
      const present = future / (1 + rate) ** year;
      return problem(
        `A ventilation retrofit is expected to cost ${dollars(future)} in ${year} years. At a ${rounded(rate * 100, 0)}% annual discount rate, what is its present value using P = F(1+i)^(-n)?`,
        `${dollars(present)}`,
        `Discounting gives ${dollars(future)}/(1 + ${rate})^${year} = ${dollars(present)} to the nearest dollar.`,
        [
          [`${dollars(future * (1 + rate) ** year)}`, "This compounds the future cost farther forward instead of discounting it to today."],
          [`${dollars(future / (1 + rate * year))}`, "This uses a simple-interest denominator rather than compound discounting."],
          [`${dollars(future * rate * year)}`, "This reports a simple interest amount, not the present value of the future cost."],
        ],
        "Explain how the selected discount rate can change rankings between near-term and long-term controls.",
      );
    }

    case "formula-econ-annuity-future": {
      const payments = [8_000, 10_000, 12_000];
      const rates = [0.04, 0.05, 0.06];
      const years = [4, 5, 6];
      const payment = payments[variant];
      const rate = rates[variant];
      const year = years[variant];
      const future = payment * (((1 + rate) ** year - 1) / rate);
      return problem(
        `A plant deposits ${dollars(payment)} at each year-end into a safety-capital fund for ${year} years at ${rounded(rate * 100, 0)}%. What future worth follows from F = A[((1+i)^n - 1)/i]?`,
        `${dollars(future)}`,
        `The uniform-series future-worth factor is [((1+${rate})^${year}-1)/${rate}], giving ${dollars(future)}.`,
        [
          [`${dollars(payment * year)}`, "This totals deposits but omits all interest earnings."],
          [`${dollars(payment * (1 + rate) ** year)}`, "This compounds only one payment for the full period rather than the payment series."],
          [`${dollars(payment * rate / ((1 + rate) ** year - 1))}`, "This uses the reciprocal sinking-fund factor."],
        ],
        "Explain how beginning-of-year deposits would change the future worth relative to this end-of-year assumption.",
      );
    }

    case "formula-econ-sinking-fund": {
      const futures = [60_000, 90_000, 120_000];
      const rates = [0.04, 0.05, 0.06];
      const years = [4, 5, 6];
      const future = futures[variant];
      const rate = rates[variant];
      const year = years[variant];
      const payment = future * rate / ((1 + rate) ** year - 1);
      return problem(
        `A site wants ${dollars(future)} available for a planned suppression-system renewal in ${year} years. If end-of-year deposits earn ${rounded(rate * 100, 0)}%, what equal deposit is required from A = Fi/[(1+i)^n - 1]?`,
        `${dollars(payment)} per year`,
        `The sinking-fund factor gives ${dollars(future)}(${rate})/[(1+${rate})^${year}-1] = ${dollars(payment)} per year.`,
        [
          [`${dollars(future / year)} per year`, "This divides the target evenly but ignores interest earned on deposits."],
          [`${dollars(future * (((1 + rate) ** year - 1) / rate))} per year`, "This multiplies by the annuity future-worth factor instead of taking its reciprocal."],
          [`${dollars(future / (1 + rate) ** year)} per year`, "This discounts one lump sum rather than finding a uniform annual deposit."],
        ],
        "State how missed deposits or a lower realized return would affect achievement of the target fund.",
      );
    }

    case "formula-econ-annuity-present": {
      const payments = [12_000, 15_000, 18_000];
      const rates = [0.04, 0.05, 0.06];
      const years = [4, 5, 6];
      const payment = payments[variant];
      const rate = rates[variant];
      const year = years[variant];
      const present = payment * (((1 + rate) ** year - 1) / (rate * (1 + rate) ** year));
      return problem(
        `A control is expected to avoid ${dollars(payment)} in losses at each year-end for ${year} years. At ${rounded(rate * 100, 0)}%, what present worth follows from the uniform-series present-worth factor?`,
        `${dollars(present)}`,
        `P = ${dollars(payment)}[((1+${rate})^${year}-1)/(${rate}(1+${rate})^${year})] = ${dollars(present)}.`,
        [
          [`${dollars(payment * year)}`, "This totals nominal benefits and ignores discounting."],
          [`${dollars(payment * (((1 + rate) ** year - 1) / rate))}`, "This calculates future worth of the series rather than present worth."],
          [`${dollars(payment / (1 + rate) ** year)}`, "This discounts only one payment occurring at the final year."],
        ],
        "Identify uncertainty in avoided losses that should be tested with sensitivity analysis.",
      );
    }

    case "formula-econ-capital-recovery": {
      const principals = [50_000, 75_000, 100_000];
      const rates = [0.04, 0.05, 0.06];
      const years = [4, 5, 6];
      const principal = principals[variant];
      const rate = rates[variant];
      const year = years[variant];
      const payment = principal * (rate * (1 + rate) ** year / ((1 + rate) ** year - 1));
      return problem(
        `A ${dollars(principal)} safeguarding project is annualized over ${year} years at ${rounded(rate * 100, 0)}%. What equivalent end-of-year payment follows from the capital-recovery factor?`,
        `${dollars(payment)} per year`,
        `A = ${dollars(principal)}[${rate}(1+${rate})^${year}/((1+${rate})^${year}-1)] = ${dollars(payment)} per year.`,
        [
          [`${dollars(principal / year)} per year`, "This straight-line division omits the time value of money."],
          [`${dollars(principal * (((1 + rate) ** year - 1) / (rate * (1 + rate) ** year)))} per year`, "This multiplies by the present-worth factor instead of its reciprocal."],
          [`${dollars(principal * rate)} per year`, "This includes annual interest but no recovery of principal."],
        ],
        "Explain why service life and salvage value should be aligned when comparing annualized control alternatives.",
      );
    }

    case "formula-heat-indoor-wbgt": {
      const wetBulbs = [76, 78, 80];
      const globes = [90, 94, 98];
      const wetBulb = wetBulbs[variant];
      const globe = globes[variant];
      const wbgt = 0.7 * wetBulb + 0.3 * globe;
      return problem(
        `Inside a hot production area without solar load, natural wet-bulb temperature is ${wetBulb} degrees F and globe temperature is ${globe} degrees F. What WBGT follows from 0.7WB + 0.3GT?`,
        `${rounded(wbgt, 1)} degrees F`,
        `WBGT = 0.7(${wetBulb}) + 0.3(${globe}) = ${rounded(wbgt, 1)} degrees F.`,
        [
          [`${rounded((wetBulb + globe) / 2, 1)} degrees F`, "This takes an unweighted average and ignores the specified coefficients."],
          [`${rounded(0.3 * wetBulb + 0.7 * globe, 1)} degrees F`, "This reverses the wet-bulb and globe weighting factors."],
          [`${rounded(wetBulb + 0.3 * globe, 1)} degrees F`, "This uses the full wet-bulb value instead of its 0.7-weighted contribution."],
        ],
        "Identify metabolic rate, clothing, acclimatization, and work-rest information needed after calculating WBGT.",
      );
    }

    case "formula-heat-outdoor-wbgt": {
      const wetBulbs = [78, 80, 82];
      const globes = [98, 102, 106];
      const dryBulbs = [88, 92, 96];
      const wetBulb = wetBulbs[variant];
      const globe = globes[variant];
      const dryBulb = dryBulbs[variant];
      const wbgt = 0.7 * wetBulb + 0.2 * globe + 0.1 * dryBulb;
      return problem(
        `An outdoor crew in direct sun has natural wet-bulb ${wetBulb} degrees F, globe ${globe} degrees F, and dry-bulb ${dryBulb} degrees F. What WBGT follows from 0.7WB + 0.2GT + 0.1DB?`,
        `${rounded(wbgt, 1)} degrees F`,
        `WBGT = 0.7(${wetBulb}) + 0.2(${globe}) + 0.1(${dryBulb}) = ${rounded(wbgt, 1)} degrees F.`,
        [
          [`${rounded((wetBulb + globe + dryBulb) / 3, 1)} degrees F`, "This uses an unweighted average rather than the outdoor WBGT weights."],
          [`${rounded(0.7 * wetBulb + 0.3 * globe, 1)} degrees F`, "This applies the indoor expression and omits outdoor dry-bulb contribution."],
          [`${rounded(0.1 * wetBulb + 0.2 * globe + 0.7 * dryBulb, 1)} degrees F`, "This assigns the dominant weight to dry bulb instead of natural wet bulb."],
        ],
        "Explain how cloud cover or moving the job into shade changes the appropriate environmental assessment.",
      );
    }

    case "formula-ih-ppm": {
      const concentrations = [8, 12, 16];
      const molecularWeights = [58.1, 78.1, 92.1];
      const concentration = concentrations[variant];
      const molecularWeight = molecularWeights[variant];
      const ppm = concentration * 24.45 / molecularWeight;
      return problem(
        `A vapor sample at 25 degrees C and 1 atm is reported as ${concentration} mg/m3. The vapor molecular weight is ${molecularWeight}. Using ppm = (mg/m3 x 24.45)/MW, what concentration in ppm results?`,
        `${rounded(ppm, 2)} ppm`,
        `ppm = (${concentration} x 24.45)/${molecularWeight} = ${rounded(ppm, 2)} ppm at the stated reference conditions.`,
        [
          [`${rounded(concentration * molecularWeight / 24.45, 2)} ppm`, "This reverses the molecular-weight and molar-volume factors."],
          [`${rounded(concentration / (24.45 * molecularWeight), 4)} ppm`, "This divides by both conversion factors rather than multiplying by molar volume."],
          [`${rounded(concentration * 24.45 * molecularWeight, 1)} ppm`, "This multiplies by molecular weight and grossly overstates the conversion."],
        ],
        "State why the molar-volume factor changes when temperature or pressure differs from the reference conditions.",
      );
    }

    case "yates-math-pemdas": {
      const lengths = [10, 12, 14];
      const widths = [6, 7, 8];
      const depths = [4, 5, 6];
      const displacements = [2, 3, 4];
      const length = lengths[variant];
      const width = widths[variant];
      const depth = depths[variant];
      const displacement = displacements[variant];
      const usable = (length * width * depth - 2 * (displacement + 1) ** 3) * 0.8;
      return problem(
        `A ${length}-ft by ${width}-ft by ${depth}-ft tank contains two cubic obstructions, each with edge length (${displacement} + 1) ft. Usable volume is [(${length} x ${width} x ${depth}) - 2(${displacement} + 1)^3] x 0.80. Evaluating with standard order of operations, what volume results?`,
        `${rounded(usable, 1)} ft3`,
        `Parentheses and exponent give (${displacement}+1)^3 for each cubic obstruction; after multiplication and subtraction, the final 0.80 factor gives ${rounded(usable, 1)} ft3.`,
        [
          [`${rounded(length * width * depth * 0.8, 1)} ft3`, "This omits the stated internal-displacement term."],
          [`${rounded((length * width * depth - 2 * (displacement + 1) ** 2) * 0.8, 1)} ft3`, "This squares the obstruction edge and subtracts an area rather than cubing it to obtain volume."],
          [`${rounded(length * width * depth - 2 * (displacement + 1) ** 3 * 0.8, 1)} ft3`, "This applies the 0.80 factor only to obstruction volume instead of the full bracket."],
        ],
        "Convert the usable volume to gallons and state how freeboard differs from equipment displacement.",
      );
    }

    case "yates-math-signed-absolute-values": {
      const previousRates = [3.8, 4.2, 5.1];
      const currentRates = [3, 5, 3.7];
      const previous = previousRates[variant];
      const current = currentRates[variant];
      const signed = current - previous;
      const absolute = Math.abs(signed);
      return problem(
        `A site's lagging incident rate changed from ${previous} last year to ${current} this year. Taking current minus previous, what are the signed change and its absolute magnitude?`,
        `${rounded(signed, 1)} rate points; absolute change ${rounded(absolute, 1)}`,
        `The signed change is ${current} - ${previous} = ${rounded(signed, 1)}; its absolute value is ${rounded(absolute, 1)} regardless of direction.`,
        [
          [`${rounded(previous - current, 1)} rate points; absolute change ${rounded(absolute, 1)}`, "This reverses the requested current-minus-previous direction."],
          [`${rounded(previous + current, 1)} rate points; absolute change ${rounded(previous + current, 1)}`, "This adds the two rates rather than finding their change."],
          [`${rounded(signed, 1)} rate points; absolute change ${rounded(-absolute, 1)}`, "An absolute magnitude cannot be negative, regardless of the signed direction."],
        ],
        "Calculate the percentage change using the prior year's rate as the denominator and interpret its sign.",
      );
    }

    case "yates-math-exponents-scientific-notation": {
      const coefficientsA = [3.2, 4.5, 6.4];
      const coefficientsB = [2.5, 2, 1.25];
      const exponentsA = [4, 5, 6];
      const exponentsB = [-3, -4, -5];
      const a = coefficientsA[variant];
      const b = coefficientsB[variant];
      const expA = exponentsA[variant];
      const expB = exponentsB[variant];
      const result = a * 10 ** expA * b * 10 ** expB;
      const exponent = expA + expB;
      return problem(
        `A unit-conversion chain reduces to (${a} x 10^${expA})(${b} x 10^${expB}). What is the product in normalized scientific notation?`,
        `${result.toExponential(2).replace("e+", " x 10^").replace("e", " x 10^")}`,
        `Multiply coefficients and add powers: ${a} x ${b} = ${rounded(a * b, 3)} and ${expA} + (${expB}) = ${exponent}; normalization gives ${result.toExponential(2)}.`,
        [
          [`${rounded(a * b, 3)} x 10^${expA - expB}`, "This subtracts exponents when multiplication requires adding them."],
          [`${rounded(a + b, 3)} x 10^${exponent}`, "This adds coefficients instead of multiplying them."],
          [`${rounded(a * b, 3)} x 10^${expA * expB}`, "This multiplies exponents rather than adding powers of ten."],
        ],
        "Rewrite the same quantity in engineering notation and attach an appropriate SI prefix.",
      );
    }

    case "yates-math-engineering-notation": {
      const amperes = [0.000047, 0.000082, 0.000125];
      const current = amperes[variant];
      const microamps = current * 1_000_000;
      return problem(
        `A leakage-current check reads ${current} A. Express the value in engineering notation using microamperes, where micro means 10^-6.`,
        `${rounded(microamps, 1)} microA (${rounded(microamps, 1)} x 10^-6 A)`,
        `${current} A multiplied by 10^6 microA/A is ${rounded(microamps, 1)} microA, whose exponent -6 is divisible by three.`,
        [
          [`${rounded(current * 1_000, 4)} microA`, "This uses the milli conversion factor of 10^3 instead of the micro factor of 10^6."],
          [`${rounded(current / 1_000_000, 12)} microA`, "This divides when converting a small ampere value to a larger microampere count."],
          [`${rounded(microamps * 1_000, 1)} microA`, "This applies an extra factor of 1,000 after the ampere-to-microampere conversion."],
        ],
        "Express the same current in milliamperes and compare the numerical magnitudes of the two prefixed forms.",
      );
    }

    case "yates-math-common-logarithms": {
      const ratios = [100, 1_000, 10_000];
      const ratio = ratios[variant];
      const increase = 10 * Math.log10(ratio);
      return problem(
        `A noise-control comparison uses an acoustic power ratio of ${ratio.toLocaleString("en-US")}:1. What level difference follows from 10log10(${ratio.toLocaleString("en-US")})?`,
        `${rounded(increase, 1)} dB`,
        `log10(${ratio.toLocaleString("en-US")}) = ${rounded(Math.log10(ratio), 1)}, so multiplying by 10 gives ${rounded(increase, 1)} dB.`,
        [
          [`${rounded(Math.log10(ratio), 1)} dB`, "This evaluates the logarithm but omits the leading factor of ten."],
          [`${rounded(20 * Math.log10(ratio), 1)} dB`, "This uses the pressure-amplitude multiplier for a stated power ratio."],
          [`${ratio.toLocaleString("en-US")} dB`, "This reports the raw ratio without applying the logarithm."],
        ],
        "Explain why the multiplier changes from 10 to 20 when the logarithm is applied to a pressure amplitude ratio.",
      );
    }

    case "yates-math-equation-transposition": {
      const cases = [4, 6, 9];
      const hours = [320_000, 450_000, 600_000];
      const caseCount = cases[variant];
      const workedHours = hours[variant];
      const rate = caseCount * 200_000 / workedHours;
      return problem(
        `A site records ${caseCount} qualifying cases during ${workedHours.toLocaleString("en-US")} employee-hours. After transposing and applying rate = cases x 200,000 / hours, what lagging incidence rate results?`,
        `${rounded(rate, 2)} cases per 200,000 hours`,
        `Substitution gives (${caseCount} x 200,000)/${workedHours.toLocaleString("en-US")} = ${rounded(rate, 2)} cases per 200,000 hours.`,
        [
          [`${caseCount} cases per 200,000 hours`, "This repeats the raw case count and ignores the hours-worked denominator."],
          [`${rounded(workedHours / (caseCount * 200_000), 2)} cases per 200,000 hours`, "This reverses the numerator and denominator."],
          [`${rounded(caseCount * 100_000 / workedHours, 2)} cases per 200,000 hours`, "This uses a 100,000-hour basis while labeling the result with 200,000 hours."],
        ],
        "Rearrange the equation to solve for cases and explain why a rate cannot replace the underlying case review.",
      );
    }

    case "yates-math-factorials": {
      const counts = [5, 6, 7];
      const count = counts[variant];
      const arrangements = factorial(count);
      return problem(
        `An analyst is checking a small probability model in which ${count} distinct inspection tasks may be performed in any order. How many complete ordered sequences are possible if every task is used once?`,
        `${arrangements.toLocaleString("en-US")}`,
        `The number of orders is ${count}! = ${Array.from({ length: count }, (_, index) => count - index).join(" x ")} = ${arrangements.toLocaleString("en-US")}.`,
        [
          [`${count ** 2}`, "This squares the task count rather than multiplying all positive integers down to one."],
          [`${2 ** count}`, "This counts binary include-or-exclude patterns, not complete task orderings."],
          [`${count * (count - 1)}`, "This counts only the first two ordered positions and omits the rest."],
        ],
        "Explain why factorial growth makes exhaustive sequencing impractical as the number of tasks increases.",
      );
    }

    case "yates-math-common-geometry": {
      const radii = [3, 4, 5];
      const heights = [8, 10, 12];
      const fillFractions = [0.8, 0.85, 0.9];
      const radius = radii[variant];
      const height = heights[variant];
      const fill = fillFractions[variant];
      const capacity = Math.PI * radius ** 2 * height * fill;
      return problem(
        `A vertical cylindrical water tank has inside radius ${radius} ft and straight-side height ${height} ft. Operations limits liquid to ${rounded(fill * 100, 0)}% of geometric volume. What planned capacity results before displacement, using V = pi r^2h?`,
        `${rounded(capacity, 1)} ft3`,
        `Geometric volume is pi(${radius}^2)(${height}); multiplying by ${fill} gives ${rounded(capacity, 1)} ft3.`,
        [
          [`${rounded(Math.PI * radius * height * fill, 1)} ft3`, "This fails to square the cylinder radius."],
          [`${rounded(Math.PI * (2 * radius) ** 2 * height * fill, 1)} ft3`, "This substitutes diameter for radius and then squares it."],
          [`${rounded(Math.PI * radius ** 2 * height, 1)} ft3`, "This reports full geometric volume and omits the operating fill limit."],
        ],
        "Convert the planned capacity to gallons and identify required freeboard and internal-displacement allowances.",
      );
    }

    case "yates-math-trig-inverse-trig": {
      const depths = [4, 5, 6];
      const horizontalRuns = [6, 8, 10];
      const depth = depths[variant];
      const run = horizontalRuns[variant];
      const angle = Math.atan(depth / run) * 180 / Math.PI;
      return problem(
        `A preliminary trench cross-section shows a vertical depth of ${depth} ft and horizontal side run of ${run} ft. What slope angle above horizontal is tan^-1(depth/run)?`,
        `${rounded(angle, 1)} degrees`,
        `The angle is arctan(${depth}/${run}) = ${rounded(angle, 1)} degrees when the calculator is in degree mode.`,
        [
          [`${rounded(Math.atan(run / depth) * 180 / Math.PI, 1)} degrees`, "This reverses rise and run and returns the complementary angle."],
          [`${rounded(depth / run, 2)} degrees`, "This reports the tangent ratio as though it were already an angle."],
          [`${rounded(Math.sin(depth / run) * 180 / Math.PI, 1)} degrees`, "This applies sine to a ratio instead of using inverse tangent."],
        ],
        "Express the same side geometry as a horizontal-to-vertical slope ratio and explain why soil rules still control design.",
      );
    }

    case "yates-math-quadratic-equation": {
      const times = [0.4, 0.5, 0.6];
      const targetTime = times[variant];
      const initialVelocity = 0.8;
      const distance = initialVelocity * targetTime + 4.9 * targetTime ** 2;
      const discriminant = initialVelocity ** 2 + 4 * 4.9 * distance;
      const positiveRoot = (-initialVelocity + Math.sqrt(discriminant)) / (2 * 4.9);
      const negativeRoot = (-initialVelocity - Math.sqrt(discriminant)) / (2 * 4.9);
      return problem(
        `A simplified fall-clearance model uses d = 0.8t + 4.9t^2. If the available distance is ${rounded(distance, 3)} m, what positive time solves 4.9t^2 + 0.8t - ${rounded(distance, 3)} = 0?`,
        `${rounded(positiveRoot, 2)} s`,
        `The quadratic formula gives roots ${rounded(positiveRoot, 2)} and ${rounded(negativeRoot, 2)} s; elapsed time uses the positive root.`,
        [
          [`${rounded(Math.sqrt(distance / 4.9), 2)} s`, "This omits the stated initial-velocity term."],
          [`${rounded(distance / initialVelocity, 2)} s`, "This assumes constant initial velocity and omits acceleration."],
          [`${rounded(negativeRoot, 2)} s`, "This is the algebraic negative root and is not the physical elapsed time after release."],
        ],
        "Explain why a real fall-arrest clearance check must include system elongation, deceleration distance, worker geometry, and margin.",
      );
    }

    case "formula-ergo-rwl": {
      const loadConstants = [51, 51, 51];
      const hm = [0.83, 0.9, 0.77][variant];
      const vm = [0.95, 0.92, 0.88][variant];
      const dm = [0.9, 0.85, 0.8][variant];
      const am = [0.95, 0.9, 0.85][variant];
      const fm = [0.85, 0.8, 0.75][variant];
      const cm = [1, 0.95, 0.9][variant];
      const rwl = loadConstants[variant] * hm * vm * dm * am * fm * cm;
      return problem(
        `A manual-lift assessment uses LC = 51 lb and multipliers HM ${hm}, VM ${vm}, DM ${dm}, AM ${am}, FM ${fm}, and CM ${cm}. What recommended weight limit follows from RWL = LC x HM x VM x DM x AM x FM x CM?`,
        `${rounded(rwl, 1)} lb`,
        `Multiplying 51 by all six task multipliers gives an RWL of ${rounded(rwl, 1)} lb for the assessed lift conditions.`,
        [
          [`${rounded(51 * (hm + vm + dm + am + fm + cm) / 6, 1)} lb`, "This averages multipliers even though the lifting equation multiplies them."],
          [`${rounded(51 * hm * vm * dm, 1)} lb`, "This omits asymmetry, frequency, and coupling multipliers."],
          [`${rounded(51 / (hm * vm * dm * am * fm * cm), 1)} lb`, "This divides by task multipliers and incorrectly increases the limit as conditions worsen."],
        ],
        "Identify task features or worker conditions that fall outside the lifting equation's intended application.",
      );
    }

    case "formula-ergo-li": {
      const loads = [32, 40, 48];
      const rwls = [28, 32, 36];
      const load = loads[variant];
      const rwl = rwls[variant];
      const index = load / rwl;
      return problem(
        `A lift has actual load ${load} lb and a calculated recommended weight limit of ${rwl} lb. What lifting index follows from LI = load/RWL?`,
        `${rounded(index, 2)}`,
        `LI = ${load}/${rwl} = ${rounded(index, 2)}; the result is dimensionless because both terms use pounds.`,
        [
          [`${rounded(rwl / load, 2)}`, "This reverses the load and RWL relationship."],
          [`${rounded(load - rwl, 1)}`, "This gives a pound difference rather than the dimensionless lifting index."],
          [`${rounded(load + rwl, 1)}`, "This adds two weights and does not evaluate relative demand."],
        ],
        "Explain why an index above one prompts redesign analysis rather than predicting injury for a particular worker.",
      );
    }

    case "yates-math-eulers-number": {
      const initialSignals = [100, 150, 200];
      const constants = [0.12, 0.18, 0.25];
      const times = [5, 4, 3];
      const initial = initialSignals[variant];
      const constant = constants[variant];
      const time = times[variant];
      const finalSignal = initial * Math.exp(-constant * time);
      return problem(
        `A calculator-fluency check models a decaying signal as y = y0e^(-kt), where e is Euler's number (approximately 2.71828). If y0 = ${initial}, k = ${constant}, and t = ${time}, what value results?`,
        `${rounded(finalSignal, 2)}`,
        `The exponent is -(${constant})(${time}); ${initial}e^${rounded(-constant * time, 2)} = ${rounded(finalSignal, 2)}.`,
        [
          [`${rounded(initial * (1 - constant * time), 2)}`, "This substitutes a linear decrease for the stated exponential relationship."],
          [`${rounded(initial * 10 ** (-constant * time), 2)}`, "This uses base 10 even though the expression specifies Euler's number as the base."],
          [`${rounded(initial * Math.exp(-constant / time), 2)}`, "This divides the decay constant by time instead of multiplying them in the exponent."],
        ],
        "Use the natural logarithm to solve the same equation for time at one-half of the initial signal.",
      );
    }

    case "yates-rad-radioactive-decay-half-life": {
      const initialActivities = [960, 1_280, 2_400];
      const halfLives = [6, 8, 12];
      const elapsedTimes = [18, 32, 60];
      const initial = initialActivities[variant];
      const halfLife = halfLives[variant];
      const elapsed = elapsedTimes[variant];
      const elapsedHalfLives = elapsed / halfLife;
      const remaining = initial * 0.5 ** elapsedHalfLives;
      return problem(
        `A sealed check source initially has activity ${initial.toLocaleString("en-US")} MBq and physical half-life ${halfLife} h. Assuming only radioactive decay, what activity remains after ${elapsed} h?`,
        `${rounded(remaining, 1)} MBq`,
        `${elapsed}/${halfLife} = ${elapsedHalfLives} half-lives, so A = ${initial}(1/2)^${elapsedHalfLives} = ${rounded(remaining, 1)} MBq.`,
        [
          [`${rounded(initial / 2, 1)} MBq`, "This applies only one halving regardless of the elapsed number of half-lives."],
          [`${rounded(initial / elapsedHalfLives, 1)} MBq`, "This divides by the number of half-lives instead of by two raised to that number."],
          [`${rounded(initial / 2 ** (elapsedHalfLives - 1), 1)} MBq`, "This performs one fewer halving than the elapsed time requires."],
        ],
        "Determine how long the source takes to fall below a stated activity threshold and distinguish physical from biological half-life.",
      );
    }

    case "formula-rad-nonionizing-far-field": {
      const gains = [6, 12, 18];
      const powers = [150, 80, 120];
      const distances = [12, 20, 15];
      const gain = gains[variant];
      const power = powers[variant];
      const distance = distances[variant];
      const density = gain * power / (4 * Math.PI * distance ** 2);
      return problem(
        `A transmitting antenna has numeric gain ${gain} and average transmitted power ${power} W. At a far-field point ${distance} m away, what free-space power density follows from W = GP/(4pi r^2)?`,
        `${rounded(density, 4)} W/m2`,
        `W = (${gain})(${power})/[4pi(${distance}^2)] = ${rounded(density, 4)} W/m2.`,
        [
          [`${rounded(gain * power / (4 * Math.PI * distance), 4)} W/m2`, "This fails to square distance in the far-field relationship."],
          [`${rounded(power / (4 * Math.PI * distance ** 2), 4)} W/m2`, "This omits the stated numeric antenna gain."],
          [`${rounded(gain * power / (Math.PI * distance ** 2), 4)} W/m2`, "This omits the factor of four in the spherical spreading area."],
        ],
        "Recalculate at twice the distance and explain why this relation should not be used in the antenna near field.",
      );
    }

    case "formula-mech-friction": {
      const weights = [240, 320, 400];
      const coefficients = [0.25, 0.35, 0.45];
      const weight = weights[variant];
      const coefficient = coefficients[variant];
      const force = weight * coefficient;
      return problem(
        `A ${weight}-lbf crate rests on a level floor with stated coefficient of friction ${coefficient}. Under the ideal model, what horizontal force reaches the friction limit?`,
        `${rounded(force, 1)} lbf`,
        `On a level surface N = ${weight} lbf, so Ff = mu N = ${coefficient} x ${weight} = ${rounded(force, 1)} lbf.`,
        [
          [`${rounded(weight / coefficient, 1)} lbf`, "This divides by the coefficient and predicts more friction for a lower coefficient."],
          [`${rounded(weight + coefficient, 2)} lbf`, "This adds a dimensionless coefficient to force and has no physical meaning."],
          [`${coefficient} lbf`, "This reports the coefficient itself and omits the normal force."],
        ],
        "State how incline, surface condition, and static-versus-kinetic behavior can change the field force.",
      );
    }

    default:
      throw new Error(`No ASP A1 calculation scenario is registered for ${formulaId}.`);
  }
}

const COVERAGE_BY_ID = new Map(A1_PRACTICE_COVERAGE.map((entry) => [entry.formulaId, entry]));

const coverageForIds = (formulaIds: readonly string[]): readonly FormulaCoverage[] =>
  formulaIds.map((formulaId) => {
    const coverage = COVERAGE_BY_ID.get(formulaId);
    if (!coverage) throw new Error(`Unknown ASP A1 formula ID ${formulaId}.`);
    return coverage;
  });

export const A1_MOCK_A_COVERAGE = coverageForIds(A1_MOCK_A_FORMULA_IDS);
export const A1_MOCK_B_COVERAGE = coverageForIds(A1_MOCK_B_FORMULA_IDS);

export const A1_CALCULATION_COVERAGE = Object.freeze({
  blueprintCoreFormulaIds: A1_BLUEPRINT_CORE_FORMULA_IDS,
  yatesSupplementalFormulaIds: A1_YATES_SUPPLEMENTAL_FORMULA_IDS,
  practice: A1_PRACTICE_COVERAGE,
  mockA: A1_MOCK_A_COVERAGE,
  mockB: A1_MOCK_B_COVERAGE,
});

/** Alias retained for callers that prefer an explicit metadata name. */
export const A1_CALCULATION_COVERAGE_METADATA = A1_CALCULATION_COVERAGE;

export function buildA1CalculationDraft(
  pool: A1CalculationPool,
  index: number,
): A1CalculationDraft {
  if (!Number.isInteger(index)) {
    throw new RangeError(`ASP A1 calculation index must be an integer; received ${index}.`);
  }

  const coverage = pool === "practice"
    ? A1_PRACTICE_COVERAGE
    : pool === "mock-a"
      ? A1_MOCK_A_COVERAGE
      : A1_MOCK_B_COVERAGE;
  const maximum = pool === "practice" ? 60 : 20;
  if (index < 1 || index > maximum) {
    throw new RangeError(`ASP A1 ${pool} index must be between 1 and ${maximum}; received ${index}.`);
  }

  const selected = coverage[index - 1];
  const formulaOrdinal = A1_PRACTICE_COVERAGE.findIndex(
    (entry) => entry.formulaId === selected.formulaId,
  );
  const seed = formulaOrdinal + (pool === "practice" ? 0 : pool === "mock-a" ? 1 : 2);
  const generated = buildA1CalculationProblem(selected.formulaId, seed);
  const stemLead = pool === "practice"
    ? "During a guided calculation"
    : pool === "mock-a"
      ? "During an unannounced field assessment"
      : "During a pre-startup assurance review";
  const contextualStem = `${stemLead}, ${generated.stem.charAt(0).toLowerCase()}${generated.stem.slice(1)}`;
  return {
    competency: selected.competency,
    objective: selected.objective,
    difficulty: selected.difficulty,
    stem: contextualStem,
    correct: generated.correct,
    distractors: generated.distractors,
    referenceFramework: selected.referenceFramework,
    referenceTopic: selected.referenceTopic,
    challengePrompt: generated.challengePrompt,
    formulaId: selected.formulaId,
    formulaCategory: selected.formulaCategory,
    formulaFamily: selected.formulaFamily,
    blueprintObjective: selected.blueprintObjective,
  };
}
