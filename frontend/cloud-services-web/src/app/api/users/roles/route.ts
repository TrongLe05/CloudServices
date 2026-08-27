import { getBackendApiUrl } from "@/lib/api-url";
import { NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET() {
  try {
    const accessToken = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/users/roles`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.message || "Failed to fetch roles" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
