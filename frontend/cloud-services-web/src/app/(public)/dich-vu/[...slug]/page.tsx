export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  PlanDetailView,
  TestimonialItem,
} from "@/components/services/PlanDetailView";
import { ServicePlanItem } from "@/types/plans.types";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/slugUtils";

async function getPlanDetail(categorySlugOrId: string, planSlugOrId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes, testimonialsRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/testimonials`, { cache: "no-store" }).catch(() => null),
    ]);

    if (!categoriesRes.ok || !plansRes.ok) return null;

    const categories: any[] = await categoriesRes.json();
    const plansData = await plansRes.json();
    const allPlans: any[] = Array.isArray(plansData) ? plansData : (plansData.items || []);

    let testimonials: TestimonialItem[] = [];
    if (testimonialsRes && testimonialsRes.ok) {
      testimonials = await testimonialsRes.json();
    }

    const decodedSlug = decodeURIComponent(planSlugOrId).trim();
    const normalizedTargetSlug = slugify(decodedSlug);

    // Tìm gói dịch vụ khớp theo GUID ID hoặc slug đã chuẩn hóa
    const targetPlan = allPlans.find(
      (p) =>
        p.id.toLowerCase() === decodedSlug.toLowerCase() ||
        slugify(p.name) === normalizedTargetSlug ||
        slugify(p.name) === decodedSlug.toLowerCase() ||
        p.name.toLowerCase() === decodedSlug.toLowerCase() ||
        (p.slug && (p.slug.toLowerCase() === decodedSlug.toLowerCase() || slugify(p.slug) === normalizedTargetSlug))
    );

    if (!targetPlan) return null;

    const currentCat = categories.find((c) => c.id === targetPlan.categoryId);

    // Lấy thông tin giá của gói dịch vụ
    let prices = [];
    try {
      const priceRes = await fetch(`${apiUrl}/api/service-plans/${targetPlan.id}/prices`, {
        cache: "no-store",
      });
      if (priceRes.ok) {
        prices = await priceRes.json();
      }
    } catch {
      prices = [];
    }

    const planData: ServicePlanItem = {
      ...targetPlan,
      categoryName: currentCat?.name || "Dịch vụ Đám mây",
      categorySlug: currentCat?.slug || slugify(currentCat?.name || "cloud"),
      prices,
    };

    // Lấy các gói liên quan trong cùng danh mục
    const related = allPlans
      .filter((p) => p.categoryId === targetPlan.categoryId && p.id !== targetPlan.id)
      .slice(0, 3)
      .map((p) => ({
        ...p,
        categoryName: currentCat?.name || "Dịch vụ Đám mây",
        categorySlug: currentCat?.slug || slugify(currentCat?.name || "cloud"),
      }));

    return {
      plan: planData,
      relatedPlans: related,
      testimonials,
    };
  } catch (error) {
    console.error("Lỗi khi tải chi tiết gói dịch vụ:", error);
    return null;
  }
}

export default async function ServicePlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];

  if (slugArray.length < 2) {
    notFound();
  }

  const categorySlug = slugArray[0];
  const planSlug = slugArray[1];

  const data = await getPlanDetail(categorySlug, planSlug);

  if (!data || !data.plan) {
    notFound();
  }

  return (
    <Suspense fallback={<PlanDetailSkeleton />}>
      <PlanDetailView
        plan={data.plan}
        relatedPlans={data.relatedPlans}
        testimonials={data.testimonials}
      />
    </Suspense>
  );
}

function PlanDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-6 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-5 h-[480px] rounded-3xl" />
        <Skeleton className="lg:col-span-7 h-[480px] rounded-3xl" />
      </div>
    </div>
  );
}
