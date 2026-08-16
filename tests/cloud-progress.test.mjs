import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_CLOUD_PROGRESS_BYTES,
  parseCloudProgressWrite,
} from "../app/cloudProgressProtocol.ts";
import {
  authenticateSupabaseRequest,
  bearerAccessToken,
  requireSupabaseUser,
} from "../app/supabase-auth.ts";
import { cloudProgressRequestInit } from "../app/cloudProgressRequest.ts";

test("cloud progress rejects missing and invalid Supabase bearer tokens", async () => {
  let calls = 0;
  const verifier = async () => {
    calls += 1;
    return null;
  };
  assert.equal(await authenticateSupabaseRequest(new Request("https://app.test/api/cloud-progress"), verifier), null);
  assert.equal(calls, 0);
  const unauthenticated = await requireSupabaseUser(new Request("https://app.test/api/cloud-progress"), verifier);
  assert.ok(unauthenticated instanceof Response);
  assert.equal(unauthenticated.status, 401);
  assert.equal(bearerAccessToken(new Request("https://app.test", { headers: { authorization: "Token invalid" } })), null);
  assert.equal(await authenticateSupabaseRequest(new Request("https://app.test", { headers: { authorization: "Bearer invalid" } }), verifier), null);
  assert.equal(calls, 1);
  const invalid = await requireSupabaseUser(new Request("https://app.test", { headers: { authorization: "Bearer invalid" } }), verifier);
  assert.ok(invalid instanceof Response);
  assert.equal(invalid.status, 401);
});

test("cloud progress derives ownership from the verified Supabase token, never request JSON", async () => {
  const request = new Request("https://app.test/api/cloud-progress", {
    method: "PUT",
    headers: { authorization: "Bearer verified-session-token", "content-type": "application/json" },
    body: JSON.stringify({ userId: "another-users-id", state: { progress: true }, schemaVersion: 1, expectedRevision: 0 }),
  });
  const user = await authenticateSupabaseRequest(request, async (token) => token === "verified-session-token"
    ? { id: "verified-supabase-uuid", email: "learner@example.com", displayName: "Learner" }
    : null);
  assert.equal(user?.id, "verified-supabase-uuid");
  assert.notEqual(user?.id, "another-users-id");
});

test("cloud progress saves send the Supabase session token as a bearer token", () => {
  const request = cloudProgressRequestInit({
    method: "PUT",
    body: "{}",
    accessToken: "supabase-access-token",
  });

  assert.equal(request.method, "PUT");
  const headers = new Headers(request.headers);
  assert.equal(headers.get("Authorization"), "Bearer supabase-access-token");
  assert.equal(headers.get("Content-Type"), "application/json");
});

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
