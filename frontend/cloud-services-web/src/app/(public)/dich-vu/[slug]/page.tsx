export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { ServicesPageView, ServiceCategory, ServicePlan } from "@/components/services/ServicesPageView";
import { Skeleton } from "@/components/ui/skeleton";

async function ServicesCategoryContent({ slug }: { slug: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { cache: "no-store" }),
    ]);

    const categories: ServiceCategory[] = categoriesRes.ok ? await categoriesRes.json() : [];
    const plansData = plansRes.ok ? await plansRes.json() : { items: [] };
    const rawPlans = Array.isArray(plansData) ? plansData : (plansData.items || []);

    const plansWithPrices: ServicePlan[] = rawPlans.map((plan: any) => {
      const cat = categories.find((c) => c.id === plan.categoryId);
      return {
        ...plan,
        categoryName: plan.categoryName || cat?.name || "Dịch vụ Đám mây",
        categorySlug: cat?.slug || "",
        prices: plan.prices || [],
      };
    });

    return (
      <ServicesPageView
        categories={categories}
        plans={plansWithPrices}
        selectedCategorySlug={slug}
      />
    );
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
    return <ServicesPageView categories={[]} plans={[]} selectedCategorySlug={slug} />;
  }
}

export default async function ServicesCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesCategoryContent slug={slug} />
    </Suspense>
  );
}

function ServicesPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Header Banner Skeleton */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-col items-center text-center space-y-6">
          <Skeleton className="h-6 w-56 rounded-full bg-slate-800" />
          <Skeleton className="h-10 md:h-12 w-80 md:w-[500px] rounded-xl bg-slate-800" />
          <Skeleton className="h-4 w-full max-w-2xl rounded-md bg-slate-800" />

          {/* Quick Features Row (4 cols) */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl w-full border-t border-slate-800/80">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-lg bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-24 rounded-xs bg-slate-800" />
                  <Skeleton className="h-3 w-28 rounded-xs bg-slate-850" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Catalog & Filter Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full md:w-72 rounded-xl" />
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm flex flex-col justify-between h-[520px]"
            >
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-7 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>

              <div className="py-4 border-y border-slate-100 my-4 space-y-2">
                <Skeleton className="h-9 w-40 rounded-lg" />
                <Skeleton className="h-3 w-28 rounded-xs" />
              </div>

              <div className="space-y-3.5 flex-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="size-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full max-w-[180px] rounded-md" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="size-11 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
