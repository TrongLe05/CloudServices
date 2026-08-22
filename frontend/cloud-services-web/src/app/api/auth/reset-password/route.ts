import { resetPassword } from "@/services/auth.services";
import { NextResponse } from "next/server";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await resetPassword({
      ResetToken: data.resetToken,
      NewPassword: data.newPassword,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Đặt lại mật khẩu thất bại");
    }

    const result = await res.json();
    return NextResponse.json({
      success: true,
      message: result.message || "Đặt lại mật khẩu thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Đặt lại mật khẩu thất bại" },
      { status: 400 },
    );
  }
}
