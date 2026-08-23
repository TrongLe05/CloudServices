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
import { EditorWorkspaceView, EditorOrderRequest, EditorAffiliate, EditorNewsItem } from "./EditorWorkspaceView";
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
  Layers,
  Sparkles,
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
  orderRequests?: EditorOrderRequest[];
  affiliates?: EditorAffiliate[];
  news?: EditorNewsItem[];
}

export function AdminDashboardView({
  initialData,
  orderRequests = [],
  affiliates = [],
  news = [],
}: AdminDashboardViewProps) {
  const router = useRouter();
  const [data, setData] = React.useState<DashboardData>(initialData);
  const [activeTab, setActiveTab] = React.useState<"editor" | "analytics">("editor");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 p-6 font-sans">
      {/* Header with Role & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Cổng quản trị &amp; Biên tập nội dung
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5 flex items-center gap-2.5">
            <Home className="size-7 text-primary" />
            <span>Dashboard Điều Hành</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý yêu cầu đặt dịch vụ, xét duyệt CTV affiliate và biên tập tin tức blog.
          </p>
        </div>

        {/* View Switcher Pill & Actions */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "editor"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>Góc làm việc Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "analytics"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="size-3.5" />
              <span>Thống kê &amp; Doanh thu</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-9 rounded-xl border-slate-200"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Đang tải..." : "Làm mới"}</span>
          </Button>
        </div>
      </div>

      {/* Tab 1: Editor Workspace Hub */}
      {activeTab === "editor" && (
        <EditorWorkspaceView
          initialOrders={orderRequests}
          initialAffiliates={affiliates}
          initialNews={news}
          onRefresh={handleRefresh}
        />
      )}

      {/* Tab 2: Admin Analytics Hub */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
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
            <Card className="rounded-2xl border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900">
                  Truy Cập Nhanh Quản Trị
                </CardTitle>
                <CardDescription className="text-xs">
                  Các lối tắt tiện ích đến các mô-đun quản lý hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/service-plans" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9 rounded-xl">
                    <span className="flex items-center gap-2">
                      <Cpu className="size-4 text-purple-600" /> Quản lý Gói &amp; Bảng giá
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/admin/service-orders" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9 rounded-xl">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="size-4 text-blue-600" /> Quản lý Yêu cầu Đặt dịch vụ
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/admin/affiliates" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9 rounded-xl">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="size-4 text-emerald-600" /> Xét duyệt Đối tác Affiliate
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/admin/news" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9 rounded-xl">
                    <span className="flex items-center gap-2">
                      <Newspaper className="size-4 text-amber-600" /> Quản lý Tin tức &amp; Blog
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
