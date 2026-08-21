"use client";

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

  // Lấy 2 chữ cái đầu của Username làm fallback avatar
  const initials = user?.name
    ? user.name.substring(0, 2).toUpperCase()
    : "US";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/dang-nhap" });
  };

  const isAdmin = (user as any)?.role === "Admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt="User Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-48" align="end">
        <div className="flex items-center gap-2 p-2 border-b border-border/50">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-semibold text-sm">{user?.name || "Tài khoản"}</p>
            {user?.email && (
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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