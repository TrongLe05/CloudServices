export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import * as React from "react";
import { cookies } from "next/headers";
import { getPromotions } from "@/components/admin/promotions/PromotionsSection";
import { getCategories, getServicePlans } from "@/components/admin/service-plans/ServicePlansSection";
import { getNews } from "@/app/admin/news/page";
import { AdminDashboardView, DashboardData } from "@/components/admin/dashboard/AdminDashboardView";
import { MonthlyOrderData } from "@/components/admin/dashboard/MonthlyOrdersChart";
import { PopularPlanItem } from "@/components/admin/dashboard/PopularPlansBarChart";

async function getDashboardStatistics(): Promise<{
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  popularPlans: PopularPlanItem[];
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/statistics/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return null;
  }
}

async function getMonthlyOrderStatistics(): Promise<MonthlyOrderData[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 1);

    const fromStr = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, "0")}`;
    const toStr = `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, "0")}`;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/statistics/orders?from=${fromStr}&to=${toStr}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching monthly order statistics:", error);
    return [];
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
  // Parallel loading of all overview datasets
  const [
    statsData,
    monthlyOrders,
    promotions,
    categories,
    plans,
    newsList,
    affiliatesCount,
  ] = await Promise.all([
    getDashboardStatistics(),
    getMonthlyOrderStatistics(),
    getPromotions(),
    getCategories(),
    getServicePlans(),
    getNews(),
    getAffiliatesCount(),
  ]);

  // Fallback mock months if no orders recorded yet
  const now = new Date();
  const defaultMonthlyData: MonthlyOrderData[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    defaultMonthlyData.push({
      month: mStr,
      totalOrders: 0,
      newOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      rejectedOrders: 0,
    });
  }

  const popularPlansFallback: PopularPlanItem[] = (plans || []).slice(0, 5).map((p) => ({
    planId: p.id,
    planName: p.name,
    categoryName: p.categoryName || "Cloud Service",
    orderCount: 0,
  }));

  const initialData: DashboardData = {
    totalOrders: statsData?.totalOrders ?? 0,
    newOrders: statsData?.newOrders ?? 0,
    processingOrders: statsData?.processingOrders ?? 0,
    completedOrders: statsData?.completedOrders ?? 0,
    rejectedOrders: statsData?.rejectedOrders ?? 0,
    popularPlans: statsData?.popularPlans && statsData.popularPlans.length > 0
      ? statsData.popularPlans
      : popularPlansFallback,
    monthlyOrders: monthlyOrders && monthlyOrders.length > 0
      ? monthlyOrders
      : defaultMonthlyData,
    totalPlans: plans.length,
    totalCategories: categories.length,
    totalPromotions: promotions.length,
    totalAffiliates: affiliatesCount,
    totalNews: newsList.length,
  };

  return <AdminDashboardView initialData={initialData} />;
}
