import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { revalidatePublicPages } from "@/lib/revalidate";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "100";

    const query = new URLSearchParams({ categoryId, search, sort, page, pageSize }).toString();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-plans?${query}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch service plans" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAuthAccessToken();
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-plans`, {
      method: "POST",
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
        errorJson = { message: errText || "Failed to create service plan" };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    revalidatePublicPages();
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
