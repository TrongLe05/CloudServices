<<<<<<< Updated upstream
const page = () => {
  return <div>page</div>;
};

export default page;
=======
export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { ServicesPageView, ServiceCategory, ServicePlan } from "@/components/services/ServicesPageView";
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
    console.error("Lỗi khi tải dữ liệu trang dịch vụ theo slug:", error);
    return {
      categories: [],
      plans: [],
    };
  }
}

export default async function CategoryServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { categories, plans } = await getServicesData();

  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesPageView
        categories={categories}
        plans={plans}
        selectedCategorySlug={slug}
      />
    </Suspense>
  );
}

function ServicesPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
