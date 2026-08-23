import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole =
    (req.auth?.user as any)?.role || (req.auth as any)?.role || "";
  const normalizedRole = String(userRole).toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const isEditor = normalizedRole === "editor";
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/dang-nhap") || pathname.startsWith("/dang-ky");
  const isAdminPage = pathname.startsWith("/admin");
  const isEditorPage = pathname.startsWith("/editor");
  const isOrderHistoryPage = pathname.startsWith("/don-hang");

  // 1. Auth routes (/dang-nhap, /dang-ky): Redirect already authenticated users to their respective portal
  if (isAuthPage && isLoggedIn) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (isEditor) {
      return NextResponse.redirect(new URL("/editor/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Admin routes (/admin/*): Strictly Admin role only
  if (isAdminPage) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/dang-nhap", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If an Editor accesses /admin, redirect them to the dedicated Editor portal
    if (isEditor) {
      return NextResponse.redirect(new URL("/editor/dashboard", req.url));
    }

    // Regular users cannot access Admin portal
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 3. Editor routes (/editor/*): Editor and Admin roles permitted
  if (isEditorPage) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/dang-nhap", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Regular users cannot access Editor portal
    if (!isEditor && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 4. Customer order history (/don-hang)
  if (isOrderHistoryPage) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/dang-nhap", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

// Configure matcher for protected routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/editor/:path*",
    "/don-hang/:path*",
    "/dang-nhap",
    "/dang-ky",
  ],
};