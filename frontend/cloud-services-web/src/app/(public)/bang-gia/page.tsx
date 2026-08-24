export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { Metadata } from "next";
import {
  PricingPageView,
  CategoryData,
  PricingPlan,
  PromotionData,
} from "@/components/pricing/PricingPageView";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Bảng giá Dịch vụ Máy chủ Đám mây & Cloud VPS NVMe",
  description:
    "Bảng giá chi tiết các gói Cloud Server, Cloud VPS, Web Hosting NVMe và Dedicated Server. Tiết kiệm tới 20% khi thanh toán theo năm, miễn phí thiết lập ban đầu.",
  alternates: {
    canonical: `${siteConfig.url}/bang-gia`,
  },
  openGraph: {
    title: "Bảng giá Dịch vụ Máy chủ Đám mây | CloudServices",
    description:
      "Bảng giá dịch vụ Cloud Server & VPS NVMe giá rẻ, cấu hình cao, băng thông không giới hạn với SLA 99.99% Uptime.",
    url: `${siteConfig.url}/bang-gia`,
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Bảng giá CloudServices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bảng giá Dịch vụ Máy chủ Đám mây | CloudServices",
    description: "Khám phá bảng giá Cloud Server & VPS NVMe tốt nhất thị trường.",
    images: [siteConfig.ogImage],
  },
};

const pricingFaqs = [
  {
    question: "Tôi có thể nâng cấp cấu hình CPU/RAM sau khi đăng ký không?",
    answer:
      "Có. Bạn có thể chủ động nâng cấp thêm tài nguyên CPU, RAM hoặc dung lượng ổ cứng bất kỳ lúc nào mà không làm gián đoạn hệ thống.",
  },
  {
    question: "Thời gian bàn giao máy chủ sau khi thanh toán là bao lâu?",
    answer:
      "Hệ thống tự động cài đặt hệ điều hành và gửi thông tin quản trị qua email trong vòng dưới 60 giây sau khi thanh toán VietQR thành công.",
  },
  {
    question: "CloudServices có hỗ trợ chuyển dữ liệu từ nhà cung cấp khác không?",
    answer:
      "Có. Đội ngũ kỹ thuật viên của CloudServices hỗ trợ di chuyển toàn bộ dữ liệu, website và cơ sở dữ liệu của bạn sang máy chủ mới hoàn toàn miễn phí 24/7.",
  },
];

async function PricingContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes, promotionsRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }).catch(() => null),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { cache: "no-store" }).catch(() => null),
      fetch(`${apiUrl}/api/promotions?pageSize=100`, { cache: "no-store" }).catch(() => null),
    ]);

    const categories: CategoryData[] = (categoriesRes && categoriesRes.ok) ? await categoriesRes.json() : [];
    const plansData = (plansRes && plansRes.ok) ? await plansRes.json() : { items: [] };
    const rawPlans = Array.isArray(plansData) ? plansData : plansData.items || [];

    let promotions: PromotionData[] = [];
    if (promotionsRes && promotionsRes.ok) {
      const pData = await promotionsRes.json();
      promotions = Array.isArray(pData) ? pData : pData.items || [];
    }

    const promo = promotions.find((p) => p.isActive);

    const plansWithPrices: PricingPlan[] = rawPlans.map((plan: any) => {
      const cat = categories.find((c) => c.id === plan.categoryId);
      return {
        ...plan,
        categoryName: plan.categoryName || cat?.name || "Dịch vụ Đám mây",
        prices: plan.prices || [],
        promotion: promo || null,
      };
    });

    return (
      <PricingPageView
        categories={categories}
        plans={plansWithPrices}
        promotions={promotions}
      />
    );
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bảng giá:", error);
    return <PricingPageView categories={[]} plans={[]} promotions={[]} />;
  }
}

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "/" },
          { name: "Bảng giá dịch vụ", url: "/bang-gia" },
        ]}
      />
      <FaqJsonLd items={pricingFaqs} />

      <Suspense fallback={<PricingSkeleton />}>
        <PricingContent />
      </Suspense>
    </>
  );
}

function PricingSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Header Banner Skeleton (Tối màu giống hệt giao diện thật) */}
      <header className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-64 rounded-full bg-slate-800" />
          <Skeleton className="h-12 w-80 md:w-[480px] rounded-xl bg-slate-800" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md bg-slate-800" />

          {/* Billing Switcher Skeleton */}
          <div className="pt-6">
            <Skeleton className="h-12 w-72 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </header>

      {/* 2. Main Content & Pricing Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* Category Filter Tabs Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-md flex items-center gap-2 overflow-hidden">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>

        {/* Category Section Skeleton */}
        <div className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 rounded-lg" />
              <Skeleton className="h-4 w-80 rounded-md" />
            </div>
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>

          {/* Grid Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm flex flex-col justify-between h-[540px]"
              >
                {/* Header */}
                <div className="space-y-2.5">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-7 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>

                {/* Price */}
                <div className="py-4 border-y border-slate-100 my-4 space-y-2">
                  <Skeleton className="h-10 w-40 rounded-lg" />
                  <Skeleton className="h-3.5 w-28 rounded-xs" />
                </div>

                {/* Specs */}
                <div className="space-y-3.5 flex-1">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="size-4 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-full max-w-[180px] rounded-md" />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
                  <Skeleton className="h-11 flex-1 rounded-xl" />
                  <Skeleton className="size-11 rounded-xl shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
