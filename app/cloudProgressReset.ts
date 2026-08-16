/**
 * Minimal D1 surface used by the reset operation. Keeping this separate from
 * the Worker binding makes the ownership rule directly testable.
 */
export type CloudProgressResetDatabase = {
  prepare(query: string): {
    bind(...values: unknown[]): {
      first<T>(): Promise<T | null>;
    };
  };
};

type ResetRow = {
  state_json: string;
  schema_version: number;
  revision: number;
  updated_at: string;
};

export type ResetProgressSnapshot = {
  state: Record<string, never>;
  schemaVersion: number;
  revision: number;
  updatedAt: string;
};

/**
 * Replaces only the verified user's document with an empty state. A revision
 * is retained so a stale autosave cannot recreate an earlier state after a
 * reset. The caller supplies identity only after verifying the bearer token.
 */
export async function resetProgressForAuthenticatedUser(
  database: CloudProgressResetDatabase,
  authenticatedUserId: string,
): Promise<ResetProgressSnapshot> {
  const row = await database
    .prepare(
      `INSERT INTO learner_progress
         (user_id, state_json, schema_version, revision, created_at, updated_at)
       VALUES (?, '{}', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         state_json = '{}',
         schema_version = 1,
         revision = learner_progress.revision + 1,
         updated_at = CURRENT_TIMESTAMP
       RETURNING state_json, schema_version, revision, updated_at`,
    )
    .bind(authenticatedUserId)
    .first<ResetRow>();

  if (!row) throw new Error("Cloud progress reset did not return a snapshot.");
  return {
    state: {},
    schemaVersion: row.schema_version,
    revision: row.revision,
    updatedAt: row.updated_at,
  };
}
