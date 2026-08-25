"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { getCurrentUser, UserProfile } from "@/services/user.services";

export function useCurrentUser() {
  const { data: session } = useSession();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCurrentUser();
      if (res.ok) {
        const data = await res.json();
        const rawRole =
          data.role ||
          data.Role ||
          (Array.isArray(data.roles) ? data.roles[0] : undefined) ||
          (session?.user as any)?.role ||
          "User";

        const lowerRole = String(rawRole).toLowerCase();
        const normalizedRole =
          lowerRole === "admin"
            ? "Admin"
            : lowerRole === "editor"
            ? "Editor"
            : String(rawRole);

        setUser({
          ...data,
          role: normalizedRole,
        });
      } else {
        const sessionRole = (session?.user as any)?.role;
        if (session?.user) {
          const lowerRole = String(sessionRole || "").toLowerCase();
          const normalizedRole =
            lowerRole === "admin"
              ? "Admin"
              : lowerRole === "editor"
              ? "Editor"
              : sessionRole || "User";

          setUser({
            id: session.user.email || "user",
            fullName: session.user.name || "Tài khoản",
            email: session.user.email || "",
            avatarUrl: session.user.image,
            role: normalizedRole,
          });
        } else {
          setUser(null);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Không thể tải thông tin tài khoản");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [session]);

  React.useEffect(() => {
    if ((session as any)?.error === "RefreshAccessTokenError") {
      setUser(null);
      setLoading(false);
      return;
    }
    fetchUser();
  }, [fetchUser, session]);

  const roleLower = String(user?.role || (session?.user as any)?.role || "").toLowerCase();
  const isAdmin = roleLower === "admin";
  const isEditor = roleLower === "editor";

  return {
    user,
    loading,
    error,
    isAdmin,
    isEditor,
    role: user?.role || (session?.user as any)?.role || "User",
    refreshUser: fetchUser,
  };
}

