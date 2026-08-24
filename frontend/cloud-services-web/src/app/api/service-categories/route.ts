import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { revalidatePublicPages } from "@/lib/revalidate";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/service-categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch service categories" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = await getAuthAccessToken();
    const payload = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.message || "Không thể tạo danh mục dịch vụ" },
        { status: res.status }
      );
    }

    revalidatePublicPages();
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
