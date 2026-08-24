import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { revalidatePublicPages } from "@/lib/revalidate";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "100";

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);
    params.append("page", page);
    params.append("pageSize", pageSize);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch news" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = await getAuthAccessToken();
    const payload = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
      method: "POST",
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
        errorJson = { message: errorText || "Không thể tạo bài viết" };
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
