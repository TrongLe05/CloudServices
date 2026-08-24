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
