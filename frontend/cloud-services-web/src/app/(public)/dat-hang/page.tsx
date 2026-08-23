export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import {
  CheckoutPageView,
  ServiceCategory,
  ServicePlan,
} from "@/components/checkout/CheckoutPageView";
import { Skeleton } from "@/components/ui/skeleton";

async function getServicesData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, {
        cache: "no-store",
      }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, {
        cache: "no-store",
      }),
    ]);

    const categories: ServiceCategory[] = categoriesRes.ok ? await categoriesRes.json() : [];
    const plansData = plansRes.ok ? await plansRes.json() : { items: [] };
    const rawPlans = Array.isArray(plansData) ? plansData : (plansData.items || []);

    const plansWithPrices: ServicePlan[] = await Promise.all(
      rawPlans.map(async (plan: any) => {
        const cat = categories.find((c) => c.id === plan.categoryId);
        let prices = [];
        try {
          const priceRes = await fetch(`${apiUrl}/api/service-plans/${plan.id}/prices`, {
            cache: "no-store",
          });
          if (priceRes.ok) {
            prices = await priceRes.json();
          }
        } catch {
          prices = [];
        }

        return {
          ...plan,
          categoryName: cat?.name || "Dịch vụ Đám mây",
          categorySlug: cat?.slug || "",
          prices,
        };
      })
    );

    return {
      categories,
      plans: plansWithPrices,
    };
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu dịch vụ cho trang đặt hàng:", error);
    return {
      categories: [],
      plans: [],
    };
  }
}

export default async function OrderCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string; cycle?: string }>;
}) {
  const resolvedParams = await searchParams;
  const { planId, cycle } = resolvedParams;
  const { categories, plans } = await getServicesData();

  return (
    <Suspense fallback={<OrderCheckoutSkeleton />}>
      <CheckoutPageView
        categories={categories}
        plans={plans}
        initialPlanId={planId}
        initialCycle={cycle}
      />
    </Suspense>
  );
}

function OrderCheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-10 w-72 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
