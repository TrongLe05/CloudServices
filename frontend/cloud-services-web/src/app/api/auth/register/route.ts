import { register } from "@/services/auth.services";
import { NextResponse } from "next/server";

// Bỏ qua lỗi SSL tự ký ở môi trường local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await register(data);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Đăng ký thất bại");
    }

    const result = await res.json();
    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công",
      username: result.username || result.Username || data.username,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Đăng ký thất bại" },
      { status: 400 },
    );
  }
}
