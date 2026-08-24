export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { Metadata } from "next";
import { CustomersPageView } from "@/components/customers/CustomersPageView";
import { TestimonialItem } from "@/components/customers/CustomerTestimonials";
import { ServicePlanItem } from "@/components/customers/CustomerServiceQRs";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Khách hàng & Đánh giá Dịch vụ Máy chủ Đám mây",
  description:
    "Khám phá cảm nhận từ hơn 10.000+ doanh nghiệp tin dùng, đối tác tiêu biểu và mã QR tra cứu chi tiết thông số kỹ thuật từng gói dịch vụ hạ tầng CloudServices.",
  alternates: {
    canonical: `${siteConfig.url}/khach-hang`,
  },
  openGraph: {
    title: "Khách hàng & Đánh giá Dịch vụ | CloudServices",
    description:
      "Hơn 10.000+ khách hàng doanh nghiệp và lập trình viên tin tưởng lựa chọn hạ tầng máy chủ đám mây tốc độ cao CloudServices.",
    url: `${siteConfig.url}/khach-hang`,
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Khách hàng CloudServices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khách hàng & Đánh giá Dịch vụ | CloudServices",
    description: "Cảm nhận từ 10.000+ khách hàng tin dùng máy chủ đám mây CloudServices.",
    images: [siteConfig.ogImage],
  },
};

async function CustomersContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [testimonialsRes, plansRes] = await Promise.all([
      fetch(`${apiUrl}/api/testimonials`, { cache: "no-store" }).catch(() => null),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, { cache: "no-store" }).catch(() => null),
    ]);

    let testimonials: TestimonialItem[] = [];
    if (testimonialsRes && testimonialsRes.ok) {
      const tData = await testimonialsRes.json();
      const tItems = tData.items || tData || [];
      testimonials = tItems.map((t: any) => ({
        id: t.id || t.Id,
        name: t.customerName || t.CustomerName || "Khách hàng",
        role: t.position || t.Position || "Doanh nghiệp",
        company: t.company || t.Company || "Đối tác",
        rating: t.rating || t.Rating || 5,
        content: t.content || t.Content || "",
        avatarUrl: t.avatarUrl || t.AvatarUrl,
        createdAt: t.createdAt || t.CreatedAt,
      }));
    }

    let plans: ServicePlanItem[] = [];
    if (plansRes && plansRes.ok) {
      const pData = await plansRes.json();
      const pItems = pData.items || pData || [];
      plans = pItems.map((p: any) => ({
        id: p.id || p.Id,
        name: p.name || p.Name,
        description: p.description || p.Description,
        categoryId: p.categoryId || p.CategoryId,
        categoryName: p.categoryName || p.CategoryName,
        cpu: p.cpu || p.Cpu,
        ram: p.ram || p.Ram,
        storage: p.storage || p.Storage,
        bandwidth: p.bandwidth || p.Bandwidth,
        qrCodeUrl: p.qrCodeUrl || p.QrCodeUrl,
        prices: p.prices || p.Prices || [],
      }));
    }

    return <CustomersPageView initialTestimonials={testimonials} initialPlans={plans} />;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu trang khách hàng:", error);
    return <CustomersPageView initialTestimonials={[]} initialPlans={[]} />;
  }
}

export default function CustomersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "/" },
          { name: "Khách hàng & Đánh giá", url: "/khach-hang" },
        ]}
      />
      <Suspense fallback={<CustomersSkeleton />}>
        <CustomersContent />
      </Suspense>
    </>
  );
}

function CustomersSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 space-y-20">
      {/* 1. Header Banner Skeleton */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-52 rounded-full bg-slate-800" />
          <Skeleton className="h-12 w-80 md:w-[520px] rounded-xl bg-slate-800" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md bg-slate-800" />

          {/* 3 Metric Stat Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 w-full max-w-3xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <Skeleton className="h-7 w-24 mx-auto rounded-md bg-slate-700" />
                <Skeleton className="h-3.5 w-32 mx-auto rounded-xs bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Testimonials Grid Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8 -mt-8 relative z-10">
        <div className="flex justify-between items-end pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-xs" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-xs" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded-md" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
