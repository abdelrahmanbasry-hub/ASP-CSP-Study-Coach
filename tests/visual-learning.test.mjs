import assert from "node:assert/strict";
import test from "node:test";

import { HAZARD_RECORDS } from "../app/hazardData.ts";
import {
  BODY_SYSTEMS,
  HAZARD_BODY_SYSTEMS,
  getHazardBodySystems,
  getQuestionVisual,
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

test("question visual selector chooses scenario diagrams before the generic decision map", () => {
  const cases = [
    ["A worker positions an extension ladder against a wall.", "ladder"],
    ["A crane begins moving a suspended load through the work area.", "crane"],
    ["Spoil is piled at the edge of an excavation.", "excavation"],
    ["Which control protects a worker from arc flash exposure?", "electrical"],
    ["How should a biological safety cabinet protect its user?", "biological"],
    ["Which route is most important for respirable crystalline silica?", "exposure"],
    ["Which written policy best supports a safety program?", "decision"],
  ];

  for (const [stem, kind] of cases) {
    assert.equal(getQuestionVisual({ stem }).kind, kind, stem);
  }
});

test("curated high-value IDs take precedence over wording", () => {
  assert.equal(getQuestionVisual({ id: "HW-CH11-07", stem: "A generic written question" }).kind, "biological");
  assert.equal(getQuestionVisual({ id: "D1-016", stem: "A generic written question" }).kind, "crane");
});
