import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role || (req.auth as any)?.role || "";
  const isAdmin = String(userRole).toLowerCase() === "admin";
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/dang-nhap") || pathname.startsWith("/dang-ky");
  const isAdminPage = pathname.startsWith("/admin");

  // 1. Nếu ĐÃ đăng nhập mà cố vào trang Đăng nhập / Đăng ký
  if (isAuthPage && isLoggedIn) {
    const redirectUrl = isAdmin ? "/admin/dashboard" : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2. Bảo vệ các trang Quản trị (/admin/*)
  if (isAdminPage) {
    // Chưa đăng nhập -> Chuyển hướng đến trang Đăng nhập (kèm callbackUrl để sau khi login quay lại đúng trang)
    if (!isLoggedIn) {
      const loginUrl = new URL("/dang-nhap", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng KHÔNG phải Admin -> Từ chối truy cập (về trang chủ)
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

// Cấu hình chỉ chạy middleware trên các trang này
export const config = {
  matcher: ["/admin/:path*", "/dang-nhap", "/dang-ky"],
};