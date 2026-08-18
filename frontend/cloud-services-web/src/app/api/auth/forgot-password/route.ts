import { forgotPassword } from "@/services/auth.services";
import { NextResponse } from "next/server";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await forgotPassword({ Email: data.email });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Gửi yêu cầu khôi phục thất bại");
    }

    const result = await res.json();
    return NextResponse.json({
      success: true,
      message: result.message || "Mã OTP đã được gửi thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Gửi yêu cầu khôi phục thất bại" },
      { status: 400 },
    );
  }
}
