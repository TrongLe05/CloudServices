import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logout } from "@/services/auth.services";

// Bỏ qua lỗi SSL tự ký ở môi trường local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    // Gọi backend logout (nếu có accessToken) để giải phóng token hoặc lưu log
    if (accessToken && process.env.NEXT_PUBLIC_API_URL) {
      try {
        await logout(accessToken);
      } catch (error) {
        console.error("Backend logout error:", error);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    });

    // Xóa cookies accessToken và refreshToken bằng cách set maxAge = 0
    response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
    response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Đăng xuất thất bại" },
      { status: 500 },
    );
  }
}
