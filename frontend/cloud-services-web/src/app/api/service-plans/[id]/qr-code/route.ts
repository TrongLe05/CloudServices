import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-plans/${id}/qr-code`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch QR Code" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
