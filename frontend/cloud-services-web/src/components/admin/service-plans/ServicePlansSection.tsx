if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { ServicePlansCRUD, ServicePlan, ServiceCategory } from "./ServicePlansCRUD";
import { Promotion } from "../promotions/PromotionsCRUD";
import { getBackendApiUrl } from "@/lib/api-url";

export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/service-categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.error("Error fetching categories, using fallback:", error);
    return [
      { id: "cat-1", name: "VPS Đám Mây", slug: "vps-dam-may" },
      { id: "cat-2", name: "Cloud Server", slug: "cloud-server" },
    ];
  }
}

export async function getServicePlans(categoryId?: string): Promise<ServicePlan[]> {
  try {
    const apiUrl = getBackendApiUrl();
    const params = new URLSearchParams();
    if (categoryId) {
      params.append("categoryId", categoryId);
    }
    params.append("pageSize", "100");
    
    const query = `?${params.toString()}`;
    const res = await fetch(`${apiUrl}/api/service-plans${query}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch service plans");
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching service plans, using fallback:", error);
    return [
      {
        id: "plan-1",
        categoryId: categoryId || "cat-1",
        name: "Cloud VPS Basic (Fallback)",
        description: "Gói cơ bản phù hợp cho cá nhân",
        cpu: "2 Cores",
        ram: "4GB",
        storage: "50GB",
        bandwidth: "Unlimited",
        categoryName: "VPS Đám Mây",
      },
      {
        id: "plan-2",
        categoryId: categoryId || "cat-2",
        name: "Cloud Server Pro (Fallback)",
        description: "Gói cao cấp cho doanh nghiệp",
        cpu: "8 Cores",
        ram: "16GB",
        storage: "200GB",
        bandwidth: "Unlimited",
        categoryName: "Cloud Server",
      },
    ];
  }
}

interface ServicePlansSectionProps {
  promotions: Promotion[];
}

export async function ServicePlansSection({ promotions }: ServicePlansSectionProps) {
  const categories = await getCategories();
  const initialServicePlans = categories.length > 0 ? await getServicePlans() : [];

  const mappedPlans = initialServicePlans.map((plan) => {
    const cat = categories.find((c) => c.id === plan.categoryId);
    return {
      ...plan,
      categoryName: cat?.name || plan.categoryName,
    };
  });

  return (
    <ServicePlansCRUD
      initialServicePlans={mappedPlans}
      categories={categories}
      promotions={promotions}
    />
  );
}
