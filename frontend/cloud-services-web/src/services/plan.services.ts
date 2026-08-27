export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder?: number;
}

export interface ServicePlan {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  isFeatured?: boolean;
  category?: ServiceCategory;
  prices?: Array<{
    id: string;
    billingCycle: string;
    price: number;
    promotionDiscountPercentage?: number;
  }>;
}

export const getServiceCategories = async () => {
  const res = await fetch("/api/service-categories", {
    next: { revalidate: 60 },
  });
  return res;
};

export const getServicePlans = async (params?: { categoryId?: string; pageSize?: number }) => {
  const query = new URLSearchParams();
  if (params?.categoryId) query.append("categoryId", params.categoryId);
  if (params?.pageSize) query.append("pageSize", String(params.pageSize));

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`/api/service-plans${queryString}`, {
    next: { revalidate: 60 },
  });
  return res;
};

export const getPlanQrCode = async (planId: string) => {
  const res = await fetch(`/api/service-plans/${planId}/qr-code`, {
    next: { revalidate: 30 },
  });
  return res;
};
