/** Exact historical IDs only. Controlled HL IDs never change. */
export const HAZARD_ID_ALIASES: Readonly<Record<string, string | undefined>> = {
  "ref-arc-flash": "HL-ELEC-001",
  "ref-scaffold-fall": "HL-FALL-007",
  "ref-forklift-tip-over": "HL-MAT-004",
  "ref-oxygen-deficient-space": "HL-CONF-001",
  "ref-unexpected-startup": "HL-LOTO-001",
};
export const canonicalHazardId = (id: string) => HAZARD_ID_ALIASES[id] ?? id;
export function hazardCompatibilityIds(id: string) {
  const canonical = canonicalHazardId(id);
  return [canonical, ...Object.entries(HAZARD_ID_ALIASES).filter(([, target]) => target === canonical).map(([legacy]) => legacy)];
}
/** Non-destructive compatibility: old notebook entries, notes and timestamps stay stored.
 * New saves use the canonical key. Only an explicit Unsave removes matching keys. */
export function hazardNotebookKeys(id: string) {
  return hazardCompatibilityIds(id).map(value => `hazard:${value}`);
}
