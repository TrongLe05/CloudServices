import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userRole = request.cookies.get("userRole")?.value;

  // Đọc cookie 'accessToken' lưu phiên đăng nhập
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Nếu đã đăng nhập (có token) và cố gắng truy cập trang Đăng nhập / Đăng ký
  if (token && (pathname === "/dang-nhap" || pathname === "/dang-ky")) {
    // Chuyển hướng về trang chủ
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (userRole !== "admin" && pathname.startsWith("/admin")) {
    // Nếu người dùng không phải admin và cố gắng truy cập trang admin, chuyển hướng về trang chủ
    console.log(userRole);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Cho phép tiếp tục truy cập nếu không thỏa mãn điều kiện chặn
  return NextResponse.next();
}

// Cấu hình chỉ chạy middleware trên 2 trang này để tối ưu hiệu năng (không ảnh hưởng trang khác)
export const config = {
  matcher: ["/dang-nhap", "/dang-ky", "/admin/:path*"], // Chỉ áp dụng middleware cho các đường dẫn này
};
