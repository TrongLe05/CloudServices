export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import {
  PricingPageView,
  CategoryData,
  PricingPlan,
  PromotionData,
} from "@/components/pricing/PricingPageView";
import { Skeleton } from "@/components/ui/skeleton";

async function getPricingData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes, promotionsRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/promotions?pageSize=100`, { cache: "no-store" }).catch(() => null),
    ]);

    const categories: CategoryData[] = categoriesRes.ok ? await categoriesRes.json() : [];
    const plansData = plansRes.ok ? await plansRes.json() : { items: [] };
    const rawPlans = Array.isArray(plansData) ? plansData : plansData.items || [];

    let promotions: PromotionData[] = [];
    if (promotionsRes && promotionsRes.ok) {
      const pData = await promotionsRes.json();
      promotions = Array.isArray(pData) ? pData : pData.items || [];
    }

    const plansWithPrices: PricingPlan[] = await Promise.all(
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

        // Find active promotion matching any price or plan
        const promo = promotions.find((p) => p.isActive);

        return {
          ...plan,
          categoryName: cat?.name || "Dịch vụ Đám mây",
          prices,
          promotion: promo || null,
        };
      })
    );

    return {
      categories,
      plans: plansWithPrices,
      promotions,
    };
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bảng giá:", error);
    return {
      categories: [],
      plans: [],
      promotions: [],
    };
  }
}

export default async function PricingPage() {
  const { categories, plans, promotions } = await getPricingData();

  return (
    <Suspense fallback={<PricingPageSkeleton />}>
      <PricingPageView
        categories={categories}
        plans={plans}
        promotions={promotions}
      />
    </Suspense>
  );
}

function PricingPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-10 w-96 mx-auto" />
      <Skeleton className="h-6 w-120 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <Skeleton className="h-[450px] rounded-3xl" />
        <Skeleton className="h-[450px] rounded-3xl" />
        <Skeleton className="h-[450px] rounded-3xl" />
      </div>
    </div>
  );
}
