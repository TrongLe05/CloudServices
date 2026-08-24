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
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-80 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}
