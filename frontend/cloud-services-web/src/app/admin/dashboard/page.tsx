export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { getPromotions } from "@/components/admin/promotions/PromotionsSection";
import { getCategories, getServicePlans } from "@/components/admin/service-plans/ServicePlansSection";
import { getNews } from "@/app/admin/news/page";
import { AdminDashboardView, DashboardData } from "@/components/admin/dashboard/AdminDashboardView";
import { MonthlyOrderData } from "@/components/admin/dashboard/MonthlyOrdersChart";
import { PopularPlanItem } from "@/components/admin/dashboard/PopularPlansBarChart";
import { getAuthAccessToken } from "@/lib/auth-token";
import { getBackendApiUrl } from "@/lib/api-url";
import { AdminDashboardSkeleton } from "@/components/admin/AdminSkeletons";

async function getDashboardStatistics(): Promise<{
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  popularPlans: PopularPlanItem[];
} | null> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/statistics/dashboard`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const token = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/statistics/orders?months=6`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching monthly order statistics:", error);
    return [];
  }
}

async function getOrderRequests(): Promise<any[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/order-requests?pageSize=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching order requests:", error);
    return [];
  }
}

async function getAffiliates(): Promise<any[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/affiliates?pageSize=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return [];
  }
}

async function AdminDashboardContent() {
  const [
    stats,
    monthlyOrders,
    orderRequests,
    affiliates,
    servicePlans,
    categories,
    promotions,
    news,
  ] = await Promise.all([
    getDashboardStatistics(),
    getMonthlyOrderStatistics(),
    getOrderRequests(),
    getAffiliates(),
    getServicePlans(),
    getCategories(),
    getPromotions(),
    getNews(),
  ]);

  const dashboardData: DashboardData = {
    totalOrders: stats?.totalOrders || orderRequests.length || 0,
    newOrders: stats?.newOrders || orderRequests.filter((o: any) => o.status === 0 || o.status === "New").length || 0,
    processingOrders: stats?.processingOrders || orderRequests.filter((o: any) => o.status === 1 || o.status === "Processing").length || 0,
    completedOrders: stats?.completedOrders || orderRequests.filter((o: any) => o.status === 2 || o.status === "Completed").length || 0,
    rejectedOrders: stats?.rejectedOrders || orderRequests.filter((o: any) => o.status === 3 || o.status === "Rejected").length || 0,
    popularPlans: stats?.popularPlans || [],
    monthlyOrders,
    totalPlans: servicePlans.length,
    totalCategories: categories.length,
    totalPromotions: promotions.length,
    totalAffiliates: affiliates.length,
    totalNews: news.length,
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminDashboardView
        initialData={dashboardData}
        orderRequests={orderRequests}
        affiliates={affiliates}
        news={news}
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
