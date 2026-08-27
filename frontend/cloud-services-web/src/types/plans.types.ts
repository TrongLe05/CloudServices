/**
 * Domain Type Definitions for Service Categories, Plans and Pricing
 */

export interface PlanPriceItem {
  id?: string;
  billingCycle: "Monthly" | "Quarterly" | "SemiAnnually" | "Yearly" | "Biennially" | "Triennially" | string;
  price: number;
  promotionDiscountPercentage?: number;
}

export interface ServicePlanItem {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  uptimeSla?: string | null;
  features?: string[] | null;
  qrCodeUrl?: string | null;
  prices?: PlanPriceItem[];
  promotion?: {
    discountPercentage: number;
  } | null;
}

export interface ServiceCategoryItem {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  plansCount?: number;
}
