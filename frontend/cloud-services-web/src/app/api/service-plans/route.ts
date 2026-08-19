import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "100";

    const query = new URLSearchParams({ categoryId, search, sort, page, pageSize }).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service-plans?${query}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch service plans" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const body = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errData.message || "Failed to create service plan" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
