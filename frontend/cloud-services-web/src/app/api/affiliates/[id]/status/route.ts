import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/affiliates/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
