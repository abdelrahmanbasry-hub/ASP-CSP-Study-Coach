import { HAZARD_RECORDS } from "./hazardData.ts";
import type { BodySystemId } from "./bodySystems";
export { BODY_SYSTEMS, type BodySystemId, type BodySystem } from "./bodySystems.ts";

// Compatibility exports derive from the migrated records: one source of truth.
export const HAZARD_BODY_SYSTEMS: Readonly<Record<string, readonly BodySystemId[]>> = Object.fromEntries(
  HAZARD_RECORDS.map((record) => [record.id, record.targets.map((target) => target.systemId)]),
);
export function getHazardBodySystems(hazardId: string): readonly BodySystemId[] {
  return HAZARD_BODY_SYSTEMS[hazardId] ?? [];
}
