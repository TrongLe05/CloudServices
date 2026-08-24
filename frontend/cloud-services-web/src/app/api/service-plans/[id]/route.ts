import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { revalidatePlans } from "@/lib/revalidate";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-plans/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errText);
      } catch {
        errorJson = { message: errText || "Failed to update service plan" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    revalidatePlans();
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-plans/${id}`, {
      method: "DELETE",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errText);
      } catch {
        errorJson = { message: errText || "Failed to delete service plan" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    revalidatePlans();
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
