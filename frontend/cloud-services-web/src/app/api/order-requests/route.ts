import { NextRequest, NextResponse } from "next/server";
<<<<<<< Updated upstream
import { cookies } from "next/headers";
=======
import { getAuthAccessToken } from "@/lib/auth-token";
>>>>>>> Stashed changes

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
<<<<<<< Updated upstream

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
=======
    const customerEmail = searchParams.get("customerEmail") || "";

    const token = await getAuthAccessToken();
>>>>>>> Stashed changes

    const query = new URLSearchParams({
      search,
      status,
      page,
      pageSize,
<<<<<<< Updated upstream
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/order-requests?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
=======
      ...(customerEmail ? { customerEmail } : {}),
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/order-requests?${query.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
>>>>>>> Stashed changes
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Failed to fetch order requests" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in BFF GET order-requests:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
<<<<<<< Updated upstream
=======

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthAccessToken();
    if (!token) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập tài khoản trước khi đặt dịch vụ." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/order-requests`, {
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
        { message: errText || "Đặt dịch vụ thất bại" },
        { status: res.status }
      );
    }

    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error in BFF POST order-requests:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

>>>>>>> Stashed changes
