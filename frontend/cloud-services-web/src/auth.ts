import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as jose from "jose";

// Bỏ qua lỗi chứng chỉ SSL tự ký trên môi trường local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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

          // Chuẩn hóa role (VD: "admin", "ADMIN" -> "Admin")
          const role =
            String(roleClaim).toLowerCase() === "admin"
              ? "Admin"
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
        };
      }

      // 2. Token vẫn còn hạn (trừ hao 1 phút để an toàn) -> Trả về token hiện tại
      if (Date.now() < (token.accessTokenExpires as number) - 60 * 1000) {
        return token;
      }

      // 3. Token đã hết hạn -> Tự động gọi backend để lấy AccessToken mới
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Đính kèm thông tin token vào session để React components truy cập
      session.user = {
        ...session.user,
        name: token.username as string,
        // @ts-ignore
        role: token.role as string,
      };
      // @ts-ignore
      session.accessToken = token.accessToken;
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

    const refreshedTokens = await res.json();

    if (!res.ok) {
      throw refreshedTokens;
    }

    // Đọc thời hạn mới từ token vừa nhận (hoặc mặc định 15 phút)
    const decoded: any = jose.decodeJwt(refreshedTokens.accessToken);
    const exp = decoded.exp ? decoded.exp * 1000 : Date.now() + 15 * 60 * 1000;

    // Lấy refresh token mới từ Set-Cookie (nếu có sliding window)
    const setCookie = res.headers.get("set-cookie") || "";
    const match = setCookie.match(/refreshToken=([^;]+)/);
    const newRefreshToken = match ? match[1] : token.refreshToken;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: exp,
      refreshToken: newRefreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Lỗi khi Refresh Token qua Auth.js:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError", // Đánh dấu lỗi để client/middleware nhận biết và logout
    };
  }
}
