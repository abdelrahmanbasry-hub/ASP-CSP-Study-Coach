import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
  getChatGPTUser,
} from "../../../chatgpt-auth";

export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  Vary: "oai-authenticated-user-id",
};

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json(
      {
        authenticated: false,
        signInPath: chatGPTSignInPath("/"),
      },
      { headers: JSON_HEADERS },
    );
  }

  return Response.json(
    {
      authenticated: true,
      displayName: user.displayName,
      email: user.email,
      signOutPath: chatGPTSignOutPath("/"),
    },
    { headers: JSON_HEADERS },
  );
}
