import { requireSupabaseUser } from "../../supabase-auth";
import { verifySupabaseAccessToken } from "../../supabase-server";
import {
  MAX_CLOUD_PROGRESS_REQUEST_BYTES,
  parseCloudProgressWrite,
  type LearnerStateDocument,
} from "../../cloudProgressProtocol";
import { readProgress, writeProgress } from "./progress-store";

export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "Cache-Control": "no-store",
};

async function authenticatedUser(request: Request) {
  try {
    return await requireSupabaseUser(request, verifySupabaseAccessToken);
  } catch {
    return authenticationRequired();
  }
}

export async function GET(request: Request) {
  const user = await authenticatedUser(request);
  if (user instanceof Response) return user;

  try {
    const progress = await readProgress(user.id);
    return Response.json(
      { authenticated: true, progress },
      { headers: JSON_HEADERS },
    );
  } catch {
    return storageUnavailable();
  }
}

export async function PUT(request: Request) {
  const user = await authenticatedUser(request);
  if (user instanceof Response) return user;

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_CLOUD_PROGRESS_REQUEST_BYTES
  ) {
    return validationError("The cloud progress request is too large.", 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return validationError("The request body could not be read.");
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_CLOUD_PROGRESS_REQUEST_BYTES) {
    return validationError("The cloud progress request is too large.", 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return validationError("The request body must contain valid JSON.");
  }

  const parsed = parseCloudProgressWrite(payload);
  if (!parsed.ok) return validationError(parsed.error);

  try {
    const progress = await writeProgress<LearnerStateDocument>(user.id, {
      stateJson: parsed.value.stateJson,
      schemaVersion: parsed.value.schemaVersion,
      expectedRevision: parsed.value.expectedRevision,
    });

    if (progress) {
      return Response.json({ progress }, { headers: JSON_HEADERS });
    }

    const current = await readProgress(user.id);
    return Response.json(
      {
        error: "revision_conflict",
        message:
          "Cloud progress changed on another session. Reload it before saving again.",
        current,
      },
      { status: 409, headers: JSON_HEADERS },
    );
  } catch {
    return storageUnavailable();
  }
}

function authenticationRequired(): Response {
  return Response.json(
    {
      authenticated: false,
      error: "authentication_required",
      message: "Sign in with Google to sync your progress.",
    },
    { status: 401, headers: JSON_HEADERS },
  );
}

function validationError(message: string, status = 400): Response {
  return Response.json(
    { error: "invalid_progress", message },
    { status, headers: JSON_HEADERS },
  );
}

function storageUnavailable(): Response {
  return Response.json(
    {
      error: "cloud_progress_unavailable",
      message: "Cloud progress is temporarily unavailable.",
    },
    { status: 503, headers: JSON_HEADERS },
  );
}
