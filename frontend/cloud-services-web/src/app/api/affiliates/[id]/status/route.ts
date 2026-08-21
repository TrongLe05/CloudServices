import { NextRequest, NextResponse } from "next/server";
<<<<<<< Updated upstream
import { cookies } from "next/headers";
=======
import { getAuthAccessToken } from "@/lib/auth-token";
>>>>>>> Stashed changes

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

<<<<<<< Updated upstream
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
=======
    const token = await getAuthAccessToken();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
>>>>>>> Stashed changes
    const res = await fetch(`${apiUrl}/api/affiliates/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
<<<<<<< Updated upstream
        Authorization: `Bearer ${token}`,
=======
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
>>>>>>> Stashed changes
      },
      body: JSON.stringify({ status, Status: status }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Failed to update affiliate status" },
        { status: res.status },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error in BFF PATCH affiliates status:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
