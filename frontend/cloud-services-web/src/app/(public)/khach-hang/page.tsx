export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Metadata } from "next";
import { CustomersPageView } from "@/components/customers/CustomersPageView";
import { TestimonialItem } from "@/components/customers/CustomerTestimonials";
import { ServicePlanItem } from "@/components/customers/CustomerServiceQRs";

export const metadata: Metadata = {
  title: "Khách hàng & Đánh giá dịch vụ - CloudServices",
  description:
    "Cảm nhận khách hàng thực tế, danh sách đối tác tiêu biểu và mã QR tra cứu thông số kỹ thuật từng gói dịch vụ máy chủ đám mây CloudServices.",
};

async function getInitialTestimonials(): Promise<TestimonialItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/testimonials`, { cache: "no-store" });
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
      cache: "no-store",
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
  const [testimonials, servicePlans] = await Promise.all([
    getInitialTestimonials(),
    getInitialServicePlans(),
  ]);

  return (
    <CustomersPageView
      initialTestimonials={testimonials}
      initialPlans={servicePlans}
    />
  );
}
