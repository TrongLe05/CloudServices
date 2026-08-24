import { NextRequest, NextResponse } from "next/server";
import { getAuthAccessToken } from "@/lib/auth-token";
import { revalidateCategories } from "@/lib/revalidate";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const payload = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.message || "Không thể cập nhật danh mục dịch vụ" },
        { status: res.status }
      );
    }

    revalidateCategories();

    // Lấy lại dữ liệu danh mục vừa cập nhật để phản hồi
    const getRes = await fetch(`${apiUrl}/api/service-categories/${id}`, {
      cache: "no-store",
    });

    if (getRes.ok) {
      const updatedData = await getRes.json();
      return NextResponse.json(updatedData);
    }

    return NextResponse.json({ id, ...payload });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/service-categories/${id}`, {
      method: "DELETE",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.message || "Không thể xóa danh mục dịch vụ" },
        { status: res.status }
      );
    }

    revalidateCategories();
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
