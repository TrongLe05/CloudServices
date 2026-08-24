export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import {
  ServicesOverviewView,
  ServiceCategory,
  ServicePlan,
} from "@/components/services/ServicesOverviewView";
import { Skeleton } from "@/components/ui/skeleton";

async function ServicesOverviewContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { cache: "no-store" }),
    ]);

    const categories: ServiceCategory[] = categoriesRes.ok
      ? await categoriesRes.json()
      : [];
    const plansData = plansRes.ok ? await plansRes.json() : { items: [] };
    const rawPlans = Array.isArray(plansData)
      ? plansData
      : plansData.items || [];

    const plansWithPrices: ServicePlan[] = rawPlans.map((plan: any) => {
      const cat = categories.find((c) => c.id === plan.categoryId);
      return {
        ...plan,
        categoryName: plan.categoryName || cat?.name || "Dịch vụ Đám mây",
        categorySlug: cat?.slug || "",
        prices: plan.prices || [],
      };
    });

    return <ServicesOverviewView categories={categories} plans={plansWithPrices} />;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
    return <ServicesOverviewView categories={[]} plans={[]} />;
  }
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesOverviewSkeleton />}>
      <ServicesOverviewContent />
    </Suspense>
  );
}

function ServicesOverviewSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}
