export type VerifiedSupabaseUser = {
  id: string;
  email: string | null;
  displayName: string;
};

export type SupabaseAccessTokenVerifier = (
  accessToken: string,
) => Promise<VerifiedSupabaseUser | null>;

/** Extracts a token only; it never treats a browser-provided user ID as identity. */
export function bearerAccessToken(request: Request): string | null {
  const value = request.headers.get("authorization");
  if (!value) return null;
  const match = /^Bearer\s+(.+)$/i.exec(value.trim());
  return match?.[1]?.trim() || null;
}

/** Validates the bearer token through the supplied server-side verifier. */
export async function authenticateSupabaseRequest(
  request: Request,
  verifyAccessToken: SupabaseAccessTokenVerifier,
): Promise<VerifiedSupabaseUser | null> {
  const accessToken = bearerAccessToken(request);
  return accessToken ? verifyAccessToken(accessToken) : null;
}

export async function requireSupabaseUser(
  request: Request,
  verifyAccessToken: SupabaseAccessTokenVerifier,
): Promise<VerifiedSupabaseUser | Response> {
  const user = await authenticateSupabaseRequest(request, verifyAccessToken);
  if (user) return user;
  return Response.json(
    {
      authenticated: false,
      error: "authentication_required",
      message: "Sign in with Google to sync your progress.",
    },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}
