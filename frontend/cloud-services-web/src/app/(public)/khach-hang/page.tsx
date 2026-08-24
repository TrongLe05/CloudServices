export const revalidate = 60;

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Metadata } from "next";
import { CustomersPageView } from "@/components/customers/CustomersPageView";
import { TestimonialItem } from "@/components/customers/CustomerTestimonials";
import { ServicePlanItem } from "@/components/customers/CustomerServiceQRs";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CACHE_TAGS } from "@/constants/cache-tags";

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

async function getInitialTestimonials(): Promise<TestimonialItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/testimonials`, {
      next: { revalidate: 60, tags: [CACHE_TAGS.TESTIMONIALS] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items || data || [];
    return items.map((t: any) => ({
      id: t.id || t.Id,
      name: t.customerName || t.CustomerName || "Khách hàng",
      role: t.position || t.Position || "Doanh nghiệp",
      company: t.company || t.Company || "Đối tác",
      rating: t.rating || t.Rating || 5,
      content: t.content || t.Content || "",
      avatarUrl: t.avatarUrl || t.AvatarUrl,
      createdAt: t.createdAt || t.CreatedAt,
    }));
  } catch (error) {
    console.error("Lỗi khi tải danh sách testimonials:", error);
    return [];
  }
}

async function getInitialServicePlans(): Promise<ServicePlanItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/service-plans?pageSize=100`, {
      next: { revalidate: 60, tags: [CACHE_TAGS.SERVICE_PLANS] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items || data || [];
    return items.map((p: any) => ({
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
  } catch (error) {
    console.error("Lỗi khi tải danh sách service plans:", error);
    return [];
  }
}

export default async function CustomersPage() {
  const [testimonials, plans] = await Promise.all([
    getInitialTestimonials(),
    getInitialServicePlans(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "/" },
          { name: "Khách hàng & Đánh giá", url: "/khach-hang" },
        ]}
      />
      <CustomersPageView
        initialTestimonials={testimonials}
        initialPlans={plans}
      />
    </>
  );
}
