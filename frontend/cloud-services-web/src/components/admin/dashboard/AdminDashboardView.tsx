"use client";

import * as React from "react";
import Link from "next/link";
import {
  DashboardSummaryCards,
} from "./DashboardSummaryCards";
import {
  MonthlyOrdersChart,
  MonthlyOrderData,
} from "./MonthlyOrdersChart";
import {
  OrderStatusDonutChart,
} from "./OrderStatusDonutChart";
import {
  PopularPlansBarChart,
  PopularPlanItem,
} from "./PopularPlansBarChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  ArrowRight,
  RefreshCw,
  Cpu,
  ShoppingCart,
  Newspaper,
  FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface DashboardData {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  popularPlans: PopularPlanItem[];
  monthlyOrders: MonthlyOrderData[];
  totalPlans: number;
  totalCategories: number;
  totalPromotions: number;
  totalAffiliates: number;
  totalNews: number;
}

interface AdminDashboardViewProps {
  initialData: DashboardData;
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  const router = useRouter();
  const [data, setData] = React.useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Home className="size-6 text-primary" /> Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tổng quan hệ thống dịch vụ điện toán đám mây và phân tích tương tác khách hàng.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-8"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Link href="/admin/service-orders">
            <Button size="sm" className="gap-1.5 text-xs h-8">
              <ShoppingCart className="size-3.5" /> Xem đơn hàng
            </Button>
          </Link>
        </div>
      </div>

      {/* Top KPI Cards */}
      <DashboardSummaryCards
        totalOrders={data.totalOrders}
        newOrders={data.newOrders}
        processingOrders={data.processingOrders}
        completedOrders={data.completedOrders}
        rejectedOrders={data.rejectedOrders}
        totalPlans={data.totalPlans}
        totalCategories={data.totalCategories}
        totalPromotions={data.totalPromotions}
        totalAffiliates={data.totalAffiliates}
      />

      {/* Charts Row 1: Monthly Trends (2/3) & Status Donut (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyOrdersChart initialData={data.monthlyOrders} />
        </div>
        <div>
          <OrderStatusDonutChart
            newOrders={data.newOrders}
            processingOrders={data.processingOrders}
            completedOrders={data.completedOrders}
            rejectedOrders={data.rejectedOrders}
          />
        </div>
      </div>

      {/* Charts Row 2: Popular Plans (2/3) & Quick Navigation (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PopularPlansBarChart popularPlans={data.popularPlans} />
        </div>

        {/* Quick Access Card */}
        <Card className="shadow-xs border border-border flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Truy Cập Nhanh Quản Trị</CardTitle>
            <CardDescription className="text-xs">
              Các lối tắt tiện ích đến các mô-đun quản lý hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/service-plans" className="block">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                <span className="flex items-center gap-2">
                  <Cpu className="size-4 text-purple-600" /> Quản lý Gói & Bảng giá
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/admin/service-orders" className="block">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="size-4 text-blue-600" /> Quản lý Yêu cầu Đặt dịch vụ
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/admin/affiliates" className="block">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-emerald-600" /> Xét duyệt Đối tác Affiliate
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/admin/news" className="block">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                <span className="flex items-center gap-2">
                  <Newspaper className="size-4 text-amber-600" /> Quản lý Tin tức & Blog
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
