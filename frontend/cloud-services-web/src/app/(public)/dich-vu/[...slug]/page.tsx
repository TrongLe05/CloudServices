export const revalidate = 60;

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
import { CACHE_TAGS } from "@/constants/cache-tags";

async function getPlanDetail(categorySlugOrId: string, planSlugOrId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes, testimonialsRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.CATEGORIES] },
      }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.SERVICE_PLANS] },
      }),
      fetch(`${apiUrl}/api/testimonials`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.TESTIMONIALS] },
      }).catch(() => null),
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

    const planData: ServicePlanItem = {
      ...targetPlan,
      categoryName: targetPlan.categoryName || currentCat?.name || "Dịch vụ Đám mây",
      categorySlug: currentCat?.slug || slugify(currentCat?.name || "cloud"),
      prices: targetPlan.prices || [],
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

// 🚀 Dynamic SEO Metadata Generation for Service Plans
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];

  if (slugArray.length < 2) {
    return { title: "Chi tiết dịch vụ" };
  }

  const categorySlug = slugArray[0];
  const planSlug = slugArray[1];
  const data = await getPlanDetail(categorySlug, planSlug);

  if (!data || !data.plan) {
    return {
      title: "Không tìm thấy gói dịch vụ",
      description: "Gói cấu hình máy chủ không tồn tại hoặc đã ngừng cung cấp.",
    };
  }

  const plan = data.plan;
  const pageTitle = `${plan.name} - ${plan.categoryName || "Máy chủ Đám mây"} Tốc độ cao`;
  const specsDesc = [
    plan.cpu ? `CPU: ${plan.cpu}` : null,
    plan.ram ? `RAM: ${plan.ram}` : null,
    plan.storage ? `Ổ cứng: ${plan.storage}` : null,
    plan.bandwidth ? `Băng thông: ${plan.bandwidth}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const pageDescription = plan.description
    ? `${plan.description}. Cấu hình: ${specsDesc}. Cam kết SLA 99.99% Uptime.`
    : `Đăng ký gói ${plan.name} với hạ tầng ${specsDesc}. Bàn giao tự động dưới 60 giây.`;

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
      type: "article",
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

  const currentPrice = data.plan.prices?.[0]?.price || 0;
  const detailUrl = `${siteConfig.url}/dich-vu/${categorySlug}/${planSlug}`;

  return (
    <>
      {/* 🚀 SEO Rich Structured Data */}
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

      <Suspense fallback={<PlanDetailSkeleton />}>
        <PlanDetailView
          plan={data.plan}
          relatedPlans={data.relatedPlans}
          testimonials={data.testimonials}
        />
      </Suspense>
    </>
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
