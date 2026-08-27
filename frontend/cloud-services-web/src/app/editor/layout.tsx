import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "../globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudServices - Biên tập viên (Editor Portal)",
  description: "Cổng quản trị tin tức, yêu cầu đặt dịch vụ và đăng ký Affiliate dành cho Biên tập viên.",
};

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/dang-nhap?callbackUrl=/editor/dashboard");
  }

  const role = String((session.user as any)?.role || "").toLowerCase();
  if (role !== "admin" && role !== "editor") {
    redirect("/");
  }

  return (
    <html
      lang="vi"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-slate-50/50">
        <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus={true}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {/* Header Bar */}
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/editor/dashboard" className="text-xs font-medium text-slate-500">
                          Không gian làm việc Editor
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs font-bold text-slate-900">
                          Bảng điều khiển
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>

              {/* Main Workspace Body */}
              <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
