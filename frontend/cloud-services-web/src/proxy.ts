import { NextResponse } from "next/server";
import { auth } from "@/auth";

const proxyHandler = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role || "";
  const roleLower = String(userRole).toLowerCase();

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isEditorRoute = nextUrl.pathname.startsWith("/editor");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/dang-nhap") ||
    nextUrl.pathname.startsWith("/dang-ky") ||
    nextUrl.pathname.startsWith("/quen-mat-khau");

  // 1. Chưa đăng nhập mà truy cập khu vực Admin hoặc Editor -> Chuyển hướng sang /dang-nhap
  if (!isLoggedIn && (isAdminRoute || isEditorRoute)) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/dang-nhap?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // 2. Đã đăng nhập -> Phân quyền truy cập theo Role
  if (isLoggedIn) {
    // 2.1 Truy cập /admin/* -> Chỉ Admin mới có quyền
    if (isAdminRoute && roleLower !== "admin") {
      if (roleLower === "editor") {
        return NextResponse.redirect(new URL("/editor/dashboard", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    // 2.2 Truy cập /editor/* -> Admin hoặc Editor mới có quyền
    if (isEditorRoute && roleLower !== "admin" && roleLower !== "editor") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    // 2.3 Đã đăng nhập mà vào lại các trang Auth (/dang-nhap, /dang-ky) -> Chuyển về Dashboard tương ứng
    if (isAuthRoute) {
      if (roleLower === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
      }
      if (roleLower === "editor") {
        return NextResponse.redirect(new URL("/editor/dashboard", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const proxy = proxyHandler;
export default proxyHandler;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
