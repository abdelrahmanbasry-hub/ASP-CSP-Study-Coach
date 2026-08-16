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
import { resetProgressForAuthenticatedUser } from "../app/cloudProgressReset.ts";
import { clearLocalProgress } from "../app/localProgressReset.ts";

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

  const unauthenticatedReset = await requireSupabaseUser(
    new Request("https://app.test/api/cloud-progress", { method: "DELETE" }),
    verifier,
  );
  assert.ok(unauthenticatedReset instanceof Response);
  assert.equal(unauthenticatedReset.status, 401);
  const invalidReset = await requireSupabaseUser(
    new Request("https://app.test/api/cloud-progress", { method: "DELETE", headers: { authorization: "Bearer invalid" } }),
    verifier,
  );
  assert.ok(invalidReset instanceof Response);
  assert.equal(invalidReset.status, 401);
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

test("cloud progress resets send the Supabase session token as a bearer token", () => {
  const request = cloudProgressRequestInit({ method: "DELETE", accessToken: "supabase-access-token" });
  assert.equal(request.method, "DELETE");
  assert.equal(new Headers(request.headers).get("Authorization"), "Bearer supabase-access-token");
});

test("authenticated reset affects only the verified Supabase user, not a forged browser userId", async () => {
  const documents = new Map([
    ["verified-user", { state_json: '{"old":true}', schema_version: 1, revision: 7, updated_at: "before" }],
    ["another-user", { state_json: '{"keep":true}', schema_version: 1, revision: 3, updated_at: "before" }],
  ]);
  const database = {
    prepare(sql) {
      assert.match(sql, /ON CONFLICT\(user_id\)/);
      assert.doesNotMatch(sql, /DELETE\s+FROM\s+learner_progress\s*;?\s*$/i);
      return {
        bind(userId) {
          return {
            async first() {
              const current = documents.get(userId);
              const row = { state_json: "{}", schema_version: 1, revision: (current?.revision ?? 0) + 1, updated_at: "after" };
              documents.set(userId, row);
              return row;
            },
          };
        },
      };
    },
  };
  const request = new Request("https://app.test/api/cloud-progress", {
    method: "DELETE",
    headers: { authorization: "Bearer verified-token", "content-type": "application/json" },
    body: JSON.stringify({ userId: "another-user" }),
  });
  const user = await authenticateSupabaseRequest(request, async (token) => token === "verified-token"
    ? { id: "verified-user", email: null, displayName: "Verified" }
    : null);
  assert.equal(user?.id, "verified-user");
  const reset = await resetProgressForAuthenticatedUser(database, user.id);
  assert.deepEqual(reset.state, {});
  assert.equal(reset.revision, 8);
  assert.equal(documents.get("verified-user").state_json, "{}");
  assert.equal(documents.get("another-user").state_json, '{"keep":true}');
});

test("local progress reset clears persisted progress and active-session keys", () => {
  const values = new Map([["progress", "old progress"], ["active", "old session"], ["other", "keep"]]);
  clearLocalProgress({ removeItem: (key) => values.delete(key) }, "progress", "active");
  assert.equal(values.has("progress"), false);
  assert.equal(values.has("active"), false);
  assert.equal(values.get("other"), "keep");
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
