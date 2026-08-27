/**
 * Domain Type Definitions for Service Orders and Subscriptions
 */

export type OrderStatus =
  | 0 // New / Pending payment
  | 1 // Processing / Paid / Provisioning
  | 2 // Active / Completed
  | 3 // Cancelled / Rejected / Expired
  | 4 // Finished
  | string;

export interface UserOrder {
  id: string;
  servicePlanId: string;
  servicePlanName: string;
  billingCycle: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  status: OrderStatus;
  createdAt: string;
  estimatedPrice?: number;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
}

export interface PaymentModalData {
  orderId: string;
  planName: string;
  amount: number;
  orderCode: number;
  qrCodeString: string;
  vietQrUrl?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  bin?: string | null;
  checkoutUrl?: string;
  description: string;
  createdAt: string;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export interface OrderStatistics {
  total: number;
  active: number;
  pending: number;
}
