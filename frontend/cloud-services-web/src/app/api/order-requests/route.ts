import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const query = new URLSearchParams({
      search,
      status,
      page,
      pageSize,
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/order-requests?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
