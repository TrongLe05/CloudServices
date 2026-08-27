/**
 * Domain Type Definitions for Checkout & Payments
 */
import { ServicePlanItem, PlanPriceItem } from "./plans.types";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  notes?: string;
}

export interface CreatedOrderPayOSData {
  orderId: string;
  orderCode: number;
  amount: number;
  qrCodeString: string;
  vietQrUrl?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  bin?: string | null;
  checkoutUrl?: string;
  description: string;
  createdAt: string;
  planName: string;
}

export interface CheckoutPageViewProps {
  initialPlans: ServicePlanItem[];
  preselectedPlanId?: string;
  preselectedCycle?: string;
  userEmail?: string | null;
  userName?: string | null;
}
