import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const action = searchParams.get("action") || "";
    const httpMethod = searchParams.get("httpMethod") || "";
    const statusCode = searchParams.get("statusCode") || "";
    const isSuccess = searchParams.get("isSuccess") || "";
    const username = searchParams.get("username") || "";
    const fromDate = searchParams.get("fromDate") || "";
    const toDate = searchParams.get("toDate") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";

    const token = await getAuthAccessToken();

    const query = new URLSearchParams({
      page,
      pageSize,
      ...(search ? { search } : {}),
      ...(action ? { action } : {}),
      ...(httpMethod ? { httpMethod } : {}),
      ...(statusCode ? { statusCode } : {}),
      ...(isSuccess ? { isSuccess } : {}),
      ...(username ? { username } : {}),
      ...(fromDate ? { fromDate } : {}),
      ...(toDate ? { toDate } : {}),
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/audit-logs?${query.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Failed to fetch audit logs" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in BFF GET audit-logs:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
