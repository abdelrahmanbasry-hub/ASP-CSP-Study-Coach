import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_CLOUD_PROGRESS_BYTES,
  parseCloudProgressWrite,
} from "../app/cloudProgressProtocol.ts";

test("cloud progress accepts compact, versioned learner state", () => {
  const result = parseCloudProgressWrite({
    state: { exam: "CSP", attempts: ["q-1", "q-2"] },
    schemaVersion: 1,
    expectedRevision: 4,
    userId: "a client-controlled value that must be ignored",
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.expectedRevision, 4);
  assert.equal(result.value.schemaVersion, 1);
  assert.equal(
    result.value.stateJson,
    '{"exam":"CSP","attempts":["q-1","q-2"]}',
  );
});

test("cloud progress requires an object state and optimistic revision", () => {
  assert.deepEqual(
    parseCloudProgressWrite({
      state: [],
      schemaVersion: 1,
      expectedRevision: 0,
    }),
    { ok: false, error: "state must be a JSON object." },
  );

  assert.deepEqual(
    parseCloudProgressWrite({ state: {}, schemaVersion: 1 }),
    {
      ok: false,
      error: "expectedRevision must be a non-negative integer.",
    },
  );
});

test("cloud progress enforces its compact JSON size limit", () => {
  const result = parseCloudProgressWrite({
    state: { payload: "x".repeat(MAX_CLOUD_PROGRESS_BYTES) },
    schemaVersion: 1,
    expectedRevision: 0,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.match(result.error, /exceeds/);
});
