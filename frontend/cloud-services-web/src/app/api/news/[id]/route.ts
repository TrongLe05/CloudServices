import { getBackendApiUrl } from "@/lib/api-url";
import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${getBackendApiUrl()}/api/news/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch news item" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const payload = await req.json();

    const res = await fetch(`${getBackendApiUrl()}/api/news/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText || "Không thể cập nhật bài viết" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    // Fetch the updated item
    const getRes = await fetch(`${getBackendApiUrl()}/api/news/${id}`, {
      cache: "no-store",
    });

    if (getRes.ok) {
      const updatedData = await getRes.json();
      return NextResponse.json(updatedData);
    }

    return NextResponse.json({ id, ...payload });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();

    const res = await fetch(`${getBackendApiUrl()}/api/news/${id}`, {
      method: "DELETE",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText || "Không thể xóa bài viết" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
