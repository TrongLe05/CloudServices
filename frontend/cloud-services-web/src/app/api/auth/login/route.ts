import { login } from "@/services/auth.services";
import { NextResponse } from "next/server";
// Bỏ qua lỗi SSL tự ký ở môi trường local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Gọi trực tiếp đến API backend thực tế
    const apiRes = await login(body);

    if (!apiRes.ok) {
      const error = await apiRes.json();
      throw new Error(error.message || "Đăng nhập thất bại");
    }

    const data = await apiRes.json();
    const accessToken = data.accessToken || data.AccessToken;

    // Backend .NET trả về refreshToken qua Cookie (Set-Cookie header) chứ không phải qua JSON body
    // Ta lấy từ header 'set-cookie' của Backend
    const setCookieHeader = apiRes.headers.get("set-cookie") || "";
    let refreshToken = "";
    const match = setCookieHeader.match(/refreshToken=([^;]+)/);
    if (match) {
      refreshToken = match[1];
    }

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      username: data.username || data.Username || body.username,
      accessToken,
    });

    // Lưu accessToken vào cookie HTTP-only
    if (accessToken) {
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true, // Bảo mật cao, ngăn Javascript truy cập
        secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS khi chạy production
        sameSite: "strict",
        path: "/", // Áp dụng cho toàn bộ domain
        maxAge: 60 * 15, // Hết hạn sau 15 phút (điều chỉnh theo backend)
      });
    }

    // Lưu và đồng bộ refreshToken vào cookie HTTP-only của Frontend
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Đăng nhập thất bại" },
      { status: 400 },
    );
  }
}
