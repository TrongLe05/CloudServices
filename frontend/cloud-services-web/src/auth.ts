import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as jose from "jose";

// Bỏ qua lỗi chứng chỉ SSL tự ký trên môi trường local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// In-flight refresh promise map to prevent race conditions during concurrent server requests
const inFlightRefreshes = new Map<string, Promise<any>>();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
            },
          );

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error("Backend login failed:", res.status, err);
            return null;
          }

          const data = await res.json();
          const setCookie = res.headers.get("set-cookie") || "";
          const match = setCookie.match(/refreshToken=([^;]+)/);
          const refreshToken = match ? match[1] : data.refreshToken || null;

          // Giải mã accessToken (chứa role, exp, claims)
          const decoded: any = jose.decodeJwt(data.accessToken);

          const roleClaim =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ||
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"
            ] ||
            decoded["role"] ||
            decoded["Role"] ||
            "User";

          // Chuẩn hóa role (VD: "admin" -> "Admin", "editor" -> "Editor")
          const lowerRole = String(roleClaim).toLowerCase();
          const role =
            lowerRole === "admin"
              ? "Admin"
              : lowerRole === "editor"
              ? "Editor"
              : String(roleClaim);

          return {
            id: data.username || (credentials?.username as string),
            name: data.username || (credentials?.username as string),
            email: data.email || `${data.username}@cloudservices.vn`,
            role: role,
            accessToken: data.accessToken,
            refreshToken: refreshToken,
            accessTokenExpires: decoded.exp
              ? decoded.exp * 1000
              : Date.now() + 15 * 60 * 1000,
          };
        } catch (error) {
          console.error("Lỗi kết nối tới Backend trong authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 1. Lần đầu đăng nhập: Lưu thông tin từ authorize vào token
      if (user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: (user as any).accessTokenExpires,
          role: (user as any).role,
          username: user.name,
          error: undefined,
        };
      }

      // 2. Token vẫn còn hạn (trừ hao 2 phút để an toàn) -> Trả về token hiện tại
      const expiresAt = Number(token.accessTokenExpires || 0);
      if (expiresAt > 0 && Date.now() < expiresAt - 2 * 60 * 1000) {
        return token;
      }

      // 3. Token đã hết hạn hoặc sắp hết hạn trong 2 phút -> Tự động gọi backend để lấy AccessToken mới
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Đính kèm thông tin token vào session để React components truy cập
      session.user = {
        ...session.user,
        name: (token.username || session.user?.name) as string,
        // @ts-ignore
        role: token.role as string,
      };
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.refreshToken = token.refreshToken;
      // @ts-ignore
      session.accessTokenExpires = token.accessTokenExpires;
      // @ts-ignore
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/dang-nhap",
  },
});

async function refreshAccessToken(token: any) {
  if (!token.refreshToken) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  const key = token.username || token.refreshToken;
  if (inFlightRefreshes.has(key)) {
    return await inFlightRefreshes.get(key);
  }

  const refreshPromise = (async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refreshToken=${token.refreshToken}`,
          },
          body: JSON.stringify({
            expiredAccessToken: token.accessToken,
            refreshToken: token.refreshToken,
          }),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          console.warn("Phiên làm việc đã hết hạn (Refresh Token expired). Cần đăng nhập lại.");
        } else {
          console.error("Lỗi khi Refresh Token qua Auth.js:", res.status, errData);
        }
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          error: "RefreshAccessTokenError",
        };
      }

      const refreshedTokens = await res.json();
      const newAccessToken =
        refreshedTokens.accessToken || refreshedTokens.AccessToken;
      const newRefreshToken =
        refreshedTokens.refreshToken ||
        refreshedTokens.RefreshToken ||
        (res.headers.get("set-cookie") || "").match(
          /refreshToken=([^;]+)/,
        )?.[1] ||
        token.refreshToken;

      // Đọc thời hạn mới từ token vừa nhận (hoặc mặc định 15 phút)
      const decoded: any = jose.decodeJwt(newAccessToken);
      const exp = decoded?.exp
        ? decoded.exp * 1000
        : Date.now() + 15 * 60 * 1000;

      return {
        ...token,
        accessToken: newAccessToken,
        accessTokenExpires: exp,
        refreshToken: newRefreshToken,
        error: undefined,
      };
    } catch (error) {
      console.error("Lỗi mạng khi Refresh Token qua Auth.js:", error);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    } finally {
      inFlightRefreshes.delete(key);
    }
  })();

  inFlightRefreshes.set(key, refreshPromise);
  return await refreshPromise;
}
