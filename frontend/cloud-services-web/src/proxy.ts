import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Đọc cookie 'accessToken' lưu phiên đăng nhập
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Nếu đã đăng nhập (có token) và cố gắng truy cập trang Đăng nhập / Đăng ký
  if (token && (pathname === "/dang-nhap" || pathname === "/dang-ky")) {
    // Chuyển hướng về trang chủ
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Cho phép tiếp tục truy cập nếu không thỏa mãn điều kiện chặn
  return NextResponse.next();
}

// Cấu hình chỉ chạy middleware trên 2 trang này để tối ưu hiệu năng (không ảnh hưởng trang khác)
export const config = {
  matcher: ["/dang-nhap", "/dang-ky"],
};
