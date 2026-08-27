import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { getBackendApiUrl } from "@/lib/api-url";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET() {
  try {
    const token = await getAuthAccessToken();
    if (!token) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập để xem thông tin cá nhân." },
        { status: 401 }
      );
    }

    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Không thể lấy thông tin người dùng" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in BFF GET /api/auth/me:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthAccessToken();
    if (!token) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập để cập nhật thông tin." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Cập nhật thông tin thất bại" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in BFF PUT /api/auth/me:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
