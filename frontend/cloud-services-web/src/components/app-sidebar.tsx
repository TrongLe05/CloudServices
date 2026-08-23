"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  Cpu,
  Tag,
  Settings2,
  ShieldCheck,
  FileText,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = (session?.user as any)?.role || "Admin";
  const isEditor = pathname?.startsWith("/editor") || String(userRole).toLowerCase() === "editor";

  // Dynamic teams title based on role
  const teams = [
    {
      name: isEditor ? "CloudServices Editor" : "CloudServices Admin",
      logo: GalleryVerticalEnd,
      plan: isEditor ? "Biên tập viên & Quản lý yêu cầu" : "Enterprise Control",
    },
  ];

  // Full Admin Navigation Items
  const adminNav = [
    {
      title: "Hệ thống tổng quan",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Bảng điều khiển",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "Quản lý dịch vụ",
      url: "#",
      icon: Cpu,
      isActive: true,
      items: [
        {
          title: "Danh mục dịch vụ",
          url: "/admin/categories",
        },
        {
          title: "Gói dịch vụ & Giá",
          url: "/admin/service-plans",
        },
      ],
    },
    {
      title: "Yêu cầu & Đối tác",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "Yêu cầu đặt dịch vụ",
          url: "/admin/service-orders",
        },
        {
          title: "Đăng ký Affiliate",
          url: "/admin/affiliates",
        },
      ],
    },
    {
      title: "Truyền thông & Ưu đãi",
      url: "#",
      icon: Tag,
      isActive: true,
      items: [
        {
          title: "Chương trình khuyến mãi",
          url: "/admin/promotions",
        },
        {
          title: "Tin tức & Blog",
          url: "/admin/news",
        },
      ],
    },
    {
      title: "Bảo mật & Giám sát",
      url: "#",
      icon: ShieldCheck,
      isActive: true,
      items: [
        {
          title: "Quản lý tài khoản",
          url: "/admin/users",
        },
        {
          title: "Nhật ký hệ thống",
          url: "/admin/audit-logs",
        },
      ],
    },
  ];

  // Dedicated Editor Navigation Items (Only Blog CRUD & Service Orders / Affiliates)
  const basePath = pathname?.startsWith("/editor") ? "/editor" : "/admin";

  const editorNav = [
    {
      title: "Hệ thống tổng quan",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Bảng điều khiển",
          url: `${basePath}/dashboard`,
        },
      ],
    },
    {
      title: "Truyền thông & Blog",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "Tin tức & Blog",
          url: `${basePath}/news`,
        },
      ],
    },
    {
      title: "Yêu cầu & Đối tác",
      url: "#",
      icon: ShoppingCart,
      isActive: true,
      items: [
        {
          title: "Yêu cầu đặt dịch vụ",
          url: `${basePath}/service-orders`,
        },
        {
          title: "Đăng ký Affiliate",
          url: `${basePath}/affiliates`,
        },
      ],
    },
  ];

  const visibleNav = isEditor ? editorNav : adminNav;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNav} />
        <NavProjects projects={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
