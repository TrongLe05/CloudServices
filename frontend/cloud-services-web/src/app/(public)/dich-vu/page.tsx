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
    <div className="min-h-[calc(100vh-8rem)] bg-slate-950 flex flex-col justify-between text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 md:py-28 flex-1 flex flex-col justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headlines, Value Prop, CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <Skeleton className="h-7 w-64 rounded-full bg-slate-800" />
            <div className="space-y-3">
              <Skeleton className="h-12 md:h-14 w-full max-w-lg rounded-xl bg-slate-800" />
              <Skeleton className="h-12 md:h-14 w-3/4 rounded-xl bg-slate-800" />
            </div>
            <div className="space-y-2 max-w-xl">
              <Skeleton className="h-4 w-full rounded-md bg-slate-800" />
              <Skeleton className="h-4 w-5/6 rounded-md bg-slate-800" />
              <Skeleton className="h-4 w-2/3 rounded-md bg-slate-800" />
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Skeleton className="h-14 w-48 rounded-xl bg-slate-800" />
              <Skeleton className="h-14 w-36 rounded-xl bg-slate-800" />
            </div>
          </div>

          {/* Right Column: Layered Tech Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <Skeleton className="h-[380px] w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800" />
          </div>
        </div>
      </div>

      {/* Bottom Feature Badges Stripe */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-6 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl bg-slate-900 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32 rounded-md bg-slate-800" />
                <Skeleton className="h-3 w-44 rounded-xs bg-slate-850" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
