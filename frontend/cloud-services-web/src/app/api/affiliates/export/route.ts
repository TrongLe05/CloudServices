import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const token = await getAuthAccessToken();

    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (status && status !== "ALL") query.append("status", status);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/Affiliates/export?${query.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Không thể xuất file Excel đối tác affiliate" },
        { status: res.status },
      );
    }

    const blob = await res.arrayBuffer();
    const contentDisposition =
      res.headers.get("content-disposition") ||
      `attachment; filename="Affiliates_${new Date().toISOString().slice(0, 10)}.xlsx"`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/affiliates/export:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi xuất Excel" },
      { status: 500 },
    );
  }
}
