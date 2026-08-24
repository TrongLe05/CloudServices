"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  LogOut,
  UserCog,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { ProfileSettingsSheet } from "@/components/admin/profile/ProfileSettingsSheet";
import { useSession, signOut } from "next-auth/react";

export function NavUser({
  user: initialUser,
}: {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session } = useSession();

  const [avatarUrl, setAvatarUrl] = React.useState(initialUser?.avatar || "");
  const [profileSheetOpen, setProfileSheetOpen] = React.useState(false);

  const displayName = session?.user?.name || initialUser?.name || "Admin";
  const displayEmail = session?.user?.email || initialUser?.email || "";

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/dang-nhap" });
      toast.add({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi phiên làm việc quản trị.",
        type: "success",
      });
    } catch (error: any) {
      toast.add({
        title: "Lỗi đăng xuất",
        description: error.message || "Không thể hoàn tất đăng xuất",
        type: "error",
      });
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="size-8 rounded-full border border-primary/30 bg-primary/10">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {getInitials(displayName)}
                      </AvatarFallback>
                      <AvatarBadge className="bg-emerald-500 ring-2 ring-background size-2.5" />
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                    <span className="truncate font-semibold text-foreground flex items-center gap-1.5">
                      {displayName}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      Quản trị viên
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-xl p-1.5 shadow-xl border border-border"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={8}
            >
              {/* User summary header with interactive avatar */}
              <div className="p-2 font-normal">
                <div className="flex items-center gap-3 text-left text-sm">
                  <Avatar className="size-10 rounded-full border border-primary/30 bg-primary/10">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {getInitials(displayName)}
                    </AvatarFallback>
                    <AvatarBadge className="bg-emerald-500 ring-2 ring-background size-3" />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-foreground text-sm">
                        {displayName}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4 shrink-0 font-semibold text-primary"
                      >
                        Admin
                      </Badge>
                    </div>
                    <span className="truncate text-xs text-muted-foreground mt-0.5">
                      {displayEmail}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuGroup className="space-y-0.5">
                {/* Profile Customization Item */}
                <DropdownMenuItem
                  onClick={() => setProfileSheetOpen(true)}
                  className="cursor-pointer gap-2.5 text-xs py-2 font-medium"
                >
                  <UserCog className="size-4 text-primary" />
                  Tùy chỉnh hồ sơ & Đổi mật khẩu
                </DropdownMenuItem>

                {/* Dashboard Shortcut */}
                <Link href="/admin/dashboard" className="block">
                  <DropdownMenuItem className="cursor-pointer gap-2.5 text-xs py-2 font-medium">
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    Bảng điều khiển
                  </DropdownMenuItem>
                </Link>

                {/* Main Website Link */}
                <Link href="/" target="_blank" className="block">
                  <DropdownMenuItem className="cursor-pointer gap-2.5 text-xs py-2 font-medium justify-between">
                    <span className="flex items-center gap-2.5">
                      <ExternalLink className="size-4 text-muted-foreground" />
                      Xem trang chủ website
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Mở tab
                    </span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1" />

              {/* Logout Action */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2.5 text-xs py-2 font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Đăng xuất tài khoản
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Profile Settings Sheet Modal */}
      <ProfileSettingsSheet
        open={profileSheetOpen}
        onOpenChange={setProfileSheetOpen}
        avatarUrl={avatarUrl}
        onAvatarChange={setAvatarUrl}
      />
    </>
  );
}
