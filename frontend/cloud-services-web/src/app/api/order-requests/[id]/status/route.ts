import { getBackendApiUrl } from "@/lib/api-url";
import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = await getAuthAccessToken();

    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/order-requests/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Failed to update order request status" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in BFF PATCH order-requests status:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
