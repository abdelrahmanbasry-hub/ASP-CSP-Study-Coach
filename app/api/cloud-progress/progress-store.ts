import { env } from "cloudflare:workers";

import type {
  CloudProgressSnapshot,
  LearnerStateDocument,
} from "../../cloudProgressProtocol";
import {
  resetProgressForAuthenticatedUser,
  type ResetProgressSnapshot,
} from "../../cloudProgressReset";

type ProgressRow = {
  state_json: string;
  schema_version: number;
  revision: number;
  updated_at: string;
};

export type ProgressWriteInput = {
  stateJson: string;
  schemaVersion: number;
  expectedRevision: number;
};

export function getProgressDatabase(): D1Database {
  const database = env.DB as D1Database | undefined;
  if (!database) {
    throw new Error("Cloud progress storage is temporarily unavailable.");
  }
  return database;
}

export async function readProgress<T extends object = LearnerStateDocument>(
  authenticatedUserId: string,
): Promise<CloudProgressSnapshot<T> | null> {
  const row = await getProgressDatabase()
    .prepare(
      `SELECT state_json, schema_version, revision, updated_at
       FROM learner_progress
       WHERE user_id = ?`,
    )
    .bind(authenticatedUserId)
    .first<ProgressRow>();

  return row ? rowToSnapshot<T>(row) : null;
}

export async function writeProgress<T extends object = LearnerStateDocument>(
  authenticatedUserId: string,
  input: ProgressWriteInput,
): Promise<CloudProgressSnapshot<T> | null> {
  const statement =
    input.expectedRevision === 0
      ? getProgressDatabase()
          .prepare(
            `INSERT INTO learner_progress
               (user_id, state_json, schema_version, revision, created_at, updated_at)
             VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT(user_id) DO NOTHING
             RETURNING state_json, schema_version, revision, updated_at`,
          )
          .bind(authenticatedUserId, input.stateJson, input.schemaVersion)
      : getProgressDatabase()
          .prepare(
            `UPDATE learner_progress
             SET state_json = ?,
                 schema_version = ?,
                 revision = revision + 1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ? AND revision = ?
             RETURNING state_json, schema_version, revision, updated_at`,
          )
          .bind(
            input.stateJson,
            input.schemaVersion,
            authenticatedUserId,
            input.expectedRevision,
          );

  const row = await statement.first<ProgressRow>();
  return row ? rowToSnapshot<T>(row) : null;
}

/**
 * Reset is intentionally scoped by the verified Supabase subject. It is not a
 * global delete: the empty row also advances the revision to reject stale PUTs.
 */
export function resetProgress(
  authenticatedUserId: string,
): Promise<ResetProgressSnapshot> {
  return resetProgressForAuthenticatedUser(getProgressDatabase(), authenticatedUserId);
}

function rowToSnapshot<T extends object>(
  row: ProgressRow,
): CloudProgressSnapshot<T> {
  const state = JSON.parse(row.state_json) as unknown;
  if (state === null || typeof state !== "object" || Array.isArray(state)) {
    throw new Error("Stored cloud progress is not a valid learner state.");
  }

  return {
    state: state as T,
    schemaVersion: row.schema_version,
    revision: row.revision,
    updatedAt: row.updated_at,
  };
}
