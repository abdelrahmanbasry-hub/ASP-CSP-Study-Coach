"use client";

import {
  CLOUD_PROGRESS_SCHEMA_VERSION,
  type CloudProgressSnapshot,
  type LearnerStateDocument,
} from "./cloudProgressProtocol";

export type CloudIdentity =
  | {
      authenticated: false;
      signInPath: string;
    }
  | {
      authenticated: true;
      displayName: string;
      email: string;
      signOutPath: string;
    };

type LoadCloudProgressResponse<T extends object> = {
  authenticated: true;
  progress: CloudProgressSnapshot<T> | null;
};

type SaveCloudProgressResponse<T extends object> = {
  progress: CloudProgressSnapshot<T>;
};

type CloudProgressErrorPayload<T extends object> = {
  error?: string;
  message?: string;
  current?: CloudProgressSnapshot<T> | null;
};

export class CloudProgressRequestError<
  T extends object = LearnerStateDocument,
> extends Error {
  readonly status: number;
  readonly code: string;
  readonly current: CloudProgressSnapshot<T> | null;

  constructor(
    status: number,
    code: string,
    message: string,
    current: CloudProgressSnapshot<T> | null = null,
  ) {
    super(message);
    this.name = "CloudProgressRequestError";
    this.status = status;
    this.code = code;
    this.current = current;
  }
}

export async function loadCloudIdentity(
  signal?: AbortSignal,
): Promise<CloudIdentity> {
  return fetchJson<CloudIdentity>("/api/auth/identity", {
    method: "GET",
    signal,
  });
}

export async function loadCloudProgress<
  T extends object,
>(signal?: AbortSignal): Promise<CloudProgressSnapshot<T> | null> {
  const response = await fetchJson<LoadCloudProgressResponse<T>>(
    "/api/cloud-progress",
    { method: "GET", signal },
  );
  return response.progress;
}

/**
 * Save only after loading. Pass 0 when no cloud document exists; otherwise
 * pass the revision returned by loadCloudProgress or the previous save.
 */
export async function saveCloudProgress<T extends object>(
  state: T,
  expectedRevision: number,
  options: {
    schemaVersion?: number;
    signal?: AbortSignal;
  } = {},
): Promise<CloudProgressSnapshot<T>> {
  const response = await fetchJson<SaveCloudProgressResponse<T>>(
    "/api/cloud-progress",
    {
      method: "PUT",
      body: JSON.stringify({
        state,
        expectedRevision,
        schemaVersion:
          options.schemaVersion ?? CLOUD_PROGRESS_SCHEMA_VERSION,
      }),
      signal: options.signal,
    },
  );
  return response.progress;
}

export function chatGPTSignInHref(returnTo = "/"): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `/signin-with-chatgpt?return_to=${encodeURIComponent(safeReturnTo)}`;
}

async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as
    | T
    | CloudProgressErrorPayload<LearnerStateDocument>;

  if (!response.ok) {
    const errorPayload = payload as CloudProgressErrorPayload<LearnerStateDocument>;
    throw new CloudProgressRequestError(
      response.status,
      errorPayload.error ?? "cloud_progress_request_failed",
      errorPayload.message ?? `Cloud progress request failed (${response.status}).`,
      errorPayload.current ?? null,
    );
  }

  return payload as T;
}

function safeRelativeReturnPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";

  try {
    const url = new URL(value, "https://app.local");
    return url.origin === "https://app.local"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  } catch {
    return "/";
  }
}
