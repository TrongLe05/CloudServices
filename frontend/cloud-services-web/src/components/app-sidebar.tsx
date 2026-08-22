"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  Cpu,
  Tag,
  Settings2,
  ShieldCheck,
} from "lucide-react";

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

const data = {
  user: {
    name: "Admin",
    email: "admin@cloudservices.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "CloudServices Admin",
      logo: GalleryVerticalEnd,
      plan: "Enterprise Control",
    },
  ],
  navMain: [
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
          title: "Nhật ký hệ thống",
          url: "/admin/audit-logs",
        },
      ],
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
