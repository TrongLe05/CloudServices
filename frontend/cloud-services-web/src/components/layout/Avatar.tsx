"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AvatarDropdown({
  user: initialUser,
}: {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}) {
  const { data: session } = useSession();
  const user = session?.user || initialUser;

  const [avatarUrl, setAvatarUrl] = useState(user?.image || initialUser?.image || "");
  const [displayName, setDisplayName] = useState(user?.name || initialUser?.name || "Tài khoản");

  useEffect(() => {
    let isMounted = true;
    async function loadUserAvatar() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
            if (data.fullName || data.username) setDisplayName(data.fullName || data.username);
          }
        }
      } catch {
        // keep fallback
      }
    }
    if (session?.user || initialUser) {
      loadUserAvatar();
    }
    return () => {
      isMounted = false;
    };
  }, [session?.user, initialUser]);

  // Lấy 2 chữ cái đầu của Username / FullName làm fallback avatar
  const initials = displayName
    ? displayName
        .trim()
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "US";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/dang-nhap" });
  };

  const isAdmin = (user as any)?.role === "Admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full size-9 p-0 hover:opacity-90">
            <Avatar className="size-9 border border-border/80 shadow-2xs">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-primary text-white font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-52" align="end">
        <div className="flex items-center gap-2.5 p-2.5 border-b border-border/50">
          <Avatar className="size-8 border border-border/60">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-primary text-white font-bold text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 leading-none overflow-hidden">
            <p className="font-semibold text-xs text-slate-900 truncate">{displayName}</p>
            {user?.email && (
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuGroup>
          {isAdmin && (
            <DropdownMenuItem render={<Link href="/admin/dashboard" />}>
              Trang Quản trị
            </DropdownMenuItem>
          )}
          <DropdownMenuItem render={<Link href="/don-hang" />}>
            Dịch vụ đã đặt
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/profile" />}>
            Hồ sơ cá nhân
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}