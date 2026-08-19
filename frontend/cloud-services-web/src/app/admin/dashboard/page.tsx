export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import * as React from "react";
import { cookies } from "next/headers";
import { getPromotions } from "@/components/admin/promotions/PromotionsSection";
import { getCategories, getServicePlans } from "@/components/admin/service-plans/ServicePlansSection";
import { getNews } from "@/app/admin/news/page";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Tag, Layers, Newspaper, ArrowRight, Home, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

// Local fetch helpers with authentication
async function getOrderRequestsCount(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/order-requests?pageSize=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalCount || data.TotalCount || 0;
  } catch (error) {
    console.error("Error fetching order requests count:", error);
    return 0;
  }
}

async function getAffiliatesCount(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/affiliates?pageSize=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalCount || data.TotalCount || 0;
  } catch (error) {
    console.error("Error fetching affiliates count:", error);
    return 0;
  }
}

export default async function AdminDashboardPage() {
  // RSC Parallel Loading of Overview Statistics
  const [promotions, categories, plans, newsList, ordersCount, affiliatesCount] = await Promise.all([
    getPromotions(),
    getCategories(),
    getServicePlans(),
    getNews(),
    getOrderRequestsCount(),
    getAffiliatesCount(),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Home className="size-8 text-primary" /> Bảng Điều Khiển
        </h1>
        <p className="text-sm text-muted-foreground">
          Tổng quan tình trạng hệ thống dịch vụ điện toán đám mây và tương tác khách hàng.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <Card className="shadow-xs border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói Dịch Vụ</CardTitle>
            <Cpu className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gói tài nguyên hiện có
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Danh Mục</CardTitle>
            <Layers className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Phân loại dịch vụ đám mây
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khuyến Mãi</CardTitle>
            <Tag className="size-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Chiến dịch giảm giá
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin Tức</CardTitle>
            <Newspaper className="size-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsList.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Bài viết đã đăng tải
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu Cầu Đặt</CardTitle>
            <ShoppingCart className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yêu cầu đặt dịch vụ
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
            <Users className="size-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliatesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đơn đăng ký đối tác
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        <Card className="shadow-xs border border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Danh Mục & Gói Dịch Vụ</CardTitle>
            <CardDescription className="text-xs">
              Cấu hình các gói tài nguyên máy chủ ảo, tính toán định mức và mã QR.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/categories">
              <Button size="sm" variant="outline" className="w-full gap-1.5 justify-between">
                Quản lý danh mục <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/admin/service-plans">
              <Button size="sm" className="w-full gap-1.5 justify-between">
                Quản lý gói & bảng giá <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Đặt Dịch Vụ & Tiếp Thị</CardTitle>
            <CardDescription className="text-xs">
              Quản lý danh sách các yêu cầu đặt mua và xét duyệt đơn ứng tuyển Affiliate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/service-orders">
              <Button size="sm" className="w-full gap-1.5 justify-between">
                Yêu cầu đặt dịch vụ <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/admin/affiliates">
              <Button size="sm" variant="outline" className="w-full gap-1.5 justify-between">
                Yêu cầu Affiliate <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-xs border border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Truyền Thông & Khuyến Mãi</CardTitle>
            <CardDescription className="text-xs">
              Đăng tải bài viết tin tức hướng dẫn và thiết lập các mã ưu đãi giảm giá.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/news">
              <Button size="sm" className="w-full gap-1.5 justify-between">
                Quản lý tin tức & blog <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/admin/promotions">
              <Button size="sm" variant="outline" className="w-full gap-1.5 justify-between">
                Quản lý khuyến mãi <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
