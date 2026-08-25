import { getBackendApiUrl } from "@/lib/api-url";
import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/promotions/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch promotion" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const body = await request.json();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/promotions/${id}`, {
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
        errorJson = { message: errText || "Không thể cập nhật chương trình khuyến mãi" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/promotions/${id}`, {
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
        errorJson = { message: errText || "Không thể xóa chương trình khuyến mãi" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
