import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export function proxy(request: NextRequest) {
  // Đọc cookie 'accessToken' lưu phiên đăng nhập
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Nếu đã đăng nhập (có token) và cố gắng truy cập trang Đăng nhập / Đăng ký
  if (token && (pathname === "/dang-nhap" || pathname === "/dang-ky")) {
    // Chuyển hướng về trang chủ
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin")) {
    // Nếu chưa đăng nhập (không có token) -> Chuyển hướng ngay về trang đăng nhập
    if (!token) {
      return NextResponse.redirect(new URL("/dang-nhap", request.url));
    }

    try {
      const payload = jose.decodeJwt(token);

      // Đọc claim role (truy xuất dạng index key để tránh lỗi TypeScript)
      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || payload["role"];

      // Nếu không phải Admin -> Trở về trang chủ (hoặc trang từ chối quyền truy cập)
      if (role !== "Admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Lỗi khi giải mã JWT:", error);
      const response = NextResponse.redirect(
        new URL("/dang-nhap", request.url),
      );
      // Xóa cookie token lỗi để tránh lặp lỗi tiếp theo
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // Cho phép tiếp tục truy cập nếu không thỏa mãn điều kiện chặn
  return NextResponse.next();
}

// Cấu hình chỉ chạy middleware trên 2 trang này để tối ưu hiệu năng (không ảnh hưởng trang khác)
export const config = {
  matcher: ["/dang-nhap", "/dang-ky", "/admin/:path*"], // Chỉ áp dụng middleware cho các trang này
};
