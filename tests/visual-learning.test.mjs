import assert from "node:assert/strict";
import test from "node:test";

import { HAZARD_RECORDS } from "../app/hazardData.ts";
import {
  BODY_SYSTEMS,
  HAZARD_BODY_SYSTEMS,
  getHazardBodySystems,
} from "../app/visualLearning.ts";

test("every supplied hazard row has an explicit body-system mapping", () => {
  const allowed = new Set(BODY_SYSTEMS.map((system) => system.id));
  assert.equal(Object.keys(HAZARD_BODY_SYSTEMS).length, HAZARD_RECORDS.length);

  for (const record of HAZARD_RECORDS) {
    const systems = getHazardBodySystems(record.id);
    assert.ok(systems.length > 0, `${record.id} needs at least one body system`);
    assert.ok(systems.every((system) => allowed.has(system)), `${record.id} contains an unknown system`);
  }
});
