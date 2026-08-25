export interface CreatePaymentLinkInput {
  orderId: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentLinkResponse {
  paymentUrl?: string;
  checkoutUrl?: string;
  qrCode?: string;
  accountNumber?: string;
  accountName?: string;
  bin?: string;
  amount?: number;
  description?: string;
  orderCode?: number;
  expiredAt?: number;
}

export const createPayosPaymentLink = async (data: CreatePaymentLinkInput) => {
  const res = await fetch("/api/payments/create-payos-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};

export const getPaymentStatus = async (orderCode: number | string) => {
  const res = await fetch(`/api/payments/status/${orderCode}`, {
    cache: "no-store",
  });
  return res;
};
