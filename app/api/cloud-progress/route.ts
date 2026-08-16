import { requireSupabaseUser } from "../../supabase-auth";
import { verifySupabaseAccessToken } from "../../supabase-server";
import {
  MAX_CLOUD_PROGRESS_REQUEST_BYTES,
  parseCloudProgressWrite,
  type LearnerStateDocument,
} from "../../cloudProgressProtocol";
import { readProgress, resetProgress, writeProgress } from "./progress-store";

export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "Cache-Control": "no-store",
};

async function authenticatedUser(request: Request) {
  try {
    return await requireSupabaseUser(request, verifySupabaseAccessToken);
  } catch (error) {
    // An invalid token returns a normal 401 from requireSupabaseUser. Reaching
    // here means the Worker could not contact/configure Supabase, which must
    // not be misreported as a signed-out learner.
    console.error("Cloud progress authentication verification failed.", {
      path: new URL(request.url).pathname,
      error: errorMessage(error),
    });
    return cloudConfigurationUnavailable();
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
  } catch (error) {
    console.error("Cloud progress read failed.", {
      userId: user.id,
      error: errorMessage(error),
    });
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
  } catch (error) {
    console.error("Cloud progress write failed.", {
      userId: user.id,
      expectedRevision: parsed.value.expectedRevision,
      stateBytes: new TextEncoder().encode(parsed.value.stateJson).byteLength,
      error: errorMessage(error),
    });
    return storageUnavailable();
  }
}

/**
 * Replaces the authenticated user's persisted document with an empty state.
 * No browser-controlled user ID is accepted or consulted.
 */
export async function DELETE(request: Request) {
  const user = await authenticatedUser(request);
  if (user instanceof Response) return user;

  try {
    const progress = await resetProgress(user.id);
    return Response.json({ progress, reset: true }, { headers: JSON_HEADERS });
  } catch (error) {
    console.error("Cloud progress reset failed.", {
      userId: user.id,
      error: errorMessage(error),
    });
    return storageUnavailable();
  }
}

function cloudConfigurationUnavailable(): Response {
  return Response.json(
    {
      error: "cloud_progress_configuration_error",
      message:
        "Cloud progress authentication is unavailable. Check the Worker Supabase configuration.",
    },
    { status: 503, headers: JSON_HEADERS },
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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
