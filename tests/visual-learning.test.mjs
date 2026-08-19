import assert from "node:assert/strict";
import test from "node:test";

import { HAZARD_RECORDS } from "../app/hazardData.ts";
import {
  BODY_SYSTEMS,
  HAZARD_BODY_SYSTEMS,
  getHazardBodySystems,
  getQuestionScene,
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

test("visual scenes are explicitly authored for real question IDs, never guessed from keywords", () => {
  assert.equal(getQuestionScene("D1-030")?.kind, "ladder-rule");
  assert.equal(getQuestionScene("D1-036")?.kind, "crane-side-pull");
  assert.equal(getQuestionScene("HW-CH11-07")?.kind, "biosafety-cabinet");
  assert.equal(getQuestionScene("HW-CH11-09")?.kind, "bio-routes");
  assert.equal(getQuestionScene("unrelated-question"), undefined);
});

test("each authored scene carries inspectable evidence and a post-answer connection", () => {
  for (const questionId of ["D1-012", "D1-016", "D1-030", "D1-036", "HW-CH07-06", "HW-CH11-10"]) {
    const scene = getQuestionScene(questionId);
    assert.ok(scene, `${questionId} scene missing`);
    assert.ok(scene.hotspots.length >= 3, `${questionId} needs evidence markers`);
    assert.ok(scene.answerConnection.length > 60, `${questionId} needs an answer connection`);
  }
});
