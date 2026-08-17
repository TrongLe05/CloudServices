import { verifyOtp } from "@/services/auth.services";
import { NextResponse } from "next/server";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await verifyOtp({
      Email: data.email,
      Otp: data.otp,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Xác thực mã OTP thất bại");
    }

    const result = await res.json();
    return NextResponse.json({
      success: true,
      resetToken: result.resetToken,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Xác thực mã OTP thất bại" },
      { status: 400 },
    );
  }
}
