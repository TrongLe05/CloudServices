export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  PlanDetailView,
  TestimonialItem,
} from "@/components/services/PlanDetailView";
import { ServicePlanItem } from "@/types/plans.types";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/slugUtils";
import { siteConfig } from "@/config/site";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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

    const category = categories.find((c) => c.id === targetPlan.categoryId);
    const planPrices = targetPlan.prices || [];

    const plan: ServicePlanItem = {
      id: targetPlan.id,
      name: targetPlan.name,
      description: targetPlan.description,
      categoryId: targetPlan.categoryId,
      categoryName: targetPlan.categoryName || category?.name || "Dịch vụ Đám mây",
      categorySlug: category?.slug || "",
      cpu: targetPlan.cpu,
      ram: targetPlan.ram,
      storage: targetPlan.storage,
      bandwidth: targetPlan.bandwidth,
      uptimeSla: targetPlan.uptimeSla || "99.99%",
      features: targetPlan.features || [
        "Toàn quyền quản trị Root/Administrator",
        "Backup dữ liệu tự động định kỳ",
        "Hỗ trợ kỹ thuật 24/7/365 qua Ticket/Livechat",
      ],
      qrCodeUrl: targetPlan.qrCodeUrl,
      prices: planPrices,
    };

    // Các gói liên quan cùng danh mục
    const relatedPlans: ServicePlanItem[] = allPlans
      .filter((p) => p.categoryId === targetPlan.categoryId && p.id !== targetPlan.id)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        categoryName: p.categoryName || category?.name || "Dịch vụ Đám mây",
        categorySlug: category?.slug || "",
        cpu: p.cpu,
        ram: p.ram,
        storage: p.storage,
        bandwidth: p.bandwidth,
        uptimeSla: p.uptimeSla || "99.99%",
        prices: p.prices || [],
      }));

    return {
      plan,
      relatedPlans,
      testimonials,
    };
  } catch (error) {
    console.error("Lỗi khi tải chi tiết gói dịch vụ:", error);
    return null;
  }
}

// 🚀 Dynamic SEO Metadata Generation for Service Plans
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];

  if (slugArray.length < 2) {
    return { title: "Chi tiết dịch vụ | CloudServices" };
  }

  const [categorySlug, planSlug] = slugArray;
  const data = await getPlanDetail(categorySlug, planSlug);

  if (!data || !data.plan) {
    return {
      title: "Không tìm thấy dịch vụ | CloudServices",
      description: "Gói dịch vụ máy chủ không tồn tại hoặc đã ngừng cung cấp.",
    };
  }

  const { plan } = data;
  const pageTitle = `${plan.name} - ${plan.categoryName} | CloudServices`;
  const pageDescription =
    plan.description ||
    `Gói dịch vụ ${plan.name} với cấu hình CPU ${plan.cpu || "Tối ưu"}, RAM ${plan.ram || "Tốc độ cao"}, ổ cứng ${plan.storage || "SSD Enterprise"} và cam kết SLA ${plan.uptimeSla || "99.99%"}.`;

  const canonicalUrl = `${siteConfig.url}/dich-vu/${categorySlug}/${planSlug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: plan.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [siteConfig.ogImage],
    },
  };
}

async function PlanDetailContent({ categorySlug, planSlug }: { categorySlug: string; planSlug: string }) {
  const data = await getPlanDetail(categorySlug, planSlug);

  if (!data || !data.plan) {
    notFound();
  }

  const currentPrice = data.plan.prices?.[0]?.price || 0;
  const detailUrl = `${siteConfig.url}/dich-vu/${categorySlug}/${planSlug}`;

  return (
    <>
      <ProductJsonLd
        name={data.plan.name}
        description={data.plan.description}
        price={currentPrice}
        url={detailUrl}
        sku={data.plan.id}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "/" },
          { name: "Dịch vụ đám mây", url: "/dich-vu" },
          { name: data.plan.categoryName || "Danh mục", url: `/dich-vu/${categorySlug}` },
          { name: data.plan.name, url: `/dich-vu/${categorySlug}/${planSlug}` },
        ]}
      />

      <PlanDetailView
        plan={data.plan}
        relatedPlans={data.relatedPlans}
        testimonials={data.testimonials}
      />
    </>
  );
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

  return (
    <Suspense fallback={<PlanDetailSkeleton />}>
      <PlanDetailContent categorySlug={categorySlug} planSlug={planSlug} />
    </Suspense>
  );
}

function PlanDetailSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Breadcrumbs Header */}
      <header className="border-b border-slate-200 bg-white py-4 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. Main E-Commerce Product Box (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Showcase & Specs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white space-y-8">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 rounded-full bg-slate-800" />
                <Skeleton className="h-6 w-28 rounded-md bg-slate-800" />
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center py-4">
                <Skeleton className="size-48 rounded-2xl bg-slate-800" />
                <Skeleton className="h-3.5 w-40 rounded-xs bg-slate-800 mt-3" />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <Skeleton className="h-4 w-28 rounded-md bg-slate-800" />
                <Skeleton className="h-4 w-28 rounded-md bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Actions (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm space-y-6">
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <Skeleton className="h-4 w-32 rounded-xs" />
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>

              {/* Price and Cycle Selector */}
              <div className="space-y-4">
                <Skeleton className="h-10 w-52 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28 rounded-xl" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full max-w-[280px] rounded-md" />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
