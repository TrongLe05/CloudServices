import { auth } from "@/auth";

export async function getAuthAccessToken(): Promise<string | undefined> {
  const session = await auth();
  return (session as any)?.accessToken;
}
