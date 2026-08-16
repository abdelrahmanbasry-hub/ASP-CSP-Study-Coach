export type CloudProgressRequestInit = RequestInit & {
  accessToken?: string;
};

/** Builds same-origin API options without ever placing an access token in the URL or body. */
export function cloudProgressRequestInit(init: CloudProgressRequestInit): RequestInit {
  const { accessToken, ...requestInit } = init;
  return {
    ...requestInit,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...requestInit.headers,
    },
  };
}
