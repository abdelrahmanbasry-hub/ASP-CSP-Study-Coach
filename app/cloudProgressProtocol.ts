export const CLOUD_PROGRESS_SCHEMA_VERSION = 1;
export const MAX_CLOUD_PROGRESS_BYTES = 256 * 1024;
export const MAX_CLOUD_PROGRESS_REQUEST_BYTES =
  MAX_CLOUD_PROGRESS_BYTES + 16 * 1024;

export type LearnerStateDocument = Record<string, unknown>;

export type CloudProgressSnapshot<T extends object = LearnerStateDocument> = {
  state: T;
  schemaVersion: number;
  revision: number;
  updatedAt: string;
};

export type CloudProgressWrite = {
  state: LearnerStateDocument;
  stateJson: string;
  schemaVersion: number;
  expectedRevision: number;
};

export type CloudProgressValidationResult =
  | { ok: true; value: CloudProgressWrite }
  | { ok: false; error: string };

export function parseCloudProgressWrite(
  input: unknown,
): CloudProgressValidationResult {
  if (!isPlainRecord(input)) {
    return { ok: false, error: "The request body must be a JSON object." };
  }

  if (!isPlainRecord(input.state)) {
    return { ok: false, error: "state must be a JSON object." };
  }

  const expectedRevision = input.expectedRevision;
  if (
    !Number.isSafeInteger(expectedRevision) ||
    (expectedRevision as number) < 0
  ) {
    return {
      ok: false,
      error: "expectedRevision must be a non-negative integer.",
    };
  }

  const schemaVersion = input.schemaVersion;
  if (
    !Number.isSafeInteger(schemaVersion) ||
    (schemaVersion as number) < 1
  ) {
    return {
      ok: false,
      error: "schemaVersion must be a positive integer.",
    };
  }

  const stateJson = JSON.stringify(input.state);
  if (utf8ByteLength(stateJson) > MAX_CLOUD_PROGRESS_BYTES) {
    return {
      ok: false,
      error: `state exceeds the ${MAX_CLOUD_PROGRESS_BYTES}-byte limit.`,
    };
  }

  return {
    ok: true,
    value: {
      state: input.state,
      stateJson,
      schemaVersion: schemaVersion as number,
      expectedRevision: expectedRevision as number,
    },
  };
}

export function isPlainRecord(value: unknown): value is LearnerStateDocument {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function utf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}
