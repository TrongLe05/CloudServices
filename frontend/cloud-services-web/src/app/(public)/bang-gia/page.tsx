export const revalidate = 60;

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

async function getPricingData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [categoriesRes, plansRes, promotionsRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { next: { revalidate: 60 } }).catch(() => null),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { next: { revalidate: 60 } }).catch(() => null),
      fetch(`${apiUrl}/api/promotions?pageSize=100`, { next: { revalidate: 60 } }).catch(() => null),
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "/" },
          { name: "Bảng giá dịch vụ", url: "/bang-gia" },
        ]}
      />
      <FaqJsonLd items={pricingFaqs} />

      <Suspense fallback={<PricingSkeleton />}>
        <PricingPageView
          categories={categories}
          plans={plans}
          promotions={promotions}
        />
      </Suspense>
    </>
  );
}

function PricingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-10 w-72 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <Skeleton className="h-[460px] rounded-3xl" />
        <Skeleton className="h-[460px] rounded-3xl" />
        <Skeleton className="h-[460px] rounded-3xl" />
      </div>
    </div>
  );
}
