import { createClient } from "@supabase/supabase-js";
import { env } from "cloudflare:workers";

import type {
  SupabaseAccessTokenVerifier,
  VerifiedSupabaseUser,
} from "./supabase-auth";

function requiredWorkerVariable(name: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY"): string {
  const value = env[name];
  if (typeof value !== "string" || !value) {
    throw new Error(`Missing required Worker variable: ${name}`);
  }
  return value;
}

/**
 * Supabase Auth verifies the browser bearer token before this returns a user.
 * The public/publishable key is sufficient here; a service-role key is neither
 * required nor used for learner progress authorization.
 */
export const verifySupabaseAccessToken: SupabaseAccessTokenVerifier = async (
  accessToken,
): Promise<VerifiedSupabaseUser | null> => {
  const client = createClient(
    requiredWorkerVariable("SUPABASE_URL"),
    requiredWorkerVariable("SUPABASE_PUBLISHABLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } },
  );
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) return null;

  const metadataName = data.user.user_metadata?.full_name;
  const displayName = typeof metadataName === "string" && metadataName.trim()
    ? metadataName.trim()
    : data.user.email ?? "Google user";
  return { id: data.user.id, email: data.user.email ?? null, displayName };
};
