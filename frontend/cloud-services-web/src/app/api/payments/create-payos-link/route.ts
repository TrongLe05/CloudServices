import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { getBackendApiUrl } from "@/lib/api-url";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthAccessToken();
    if (!token) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập tài khoản trước khi thực hiện thanh toán." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/payments/create-payos-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Không thể tạo liên kết thanh toán PayOS" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in BFF POST create-payos-link:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
