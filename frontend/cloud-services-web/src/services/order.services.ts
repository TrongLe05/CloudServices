export interface CreateOrderInput {
  servicePlanId: string;
  billingCycle: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  notes?: string | null;
}

export interface OrderItem {
  id: string;
  orderCode?: number | string;
  servicePlanId: string;
  servicePlanName?: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  billingCycle: string;
  amount: number;
  status: string;
  createdAt: string;
  servicePlan?: {
    id: string;
    name: string;
    description?: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export const createOrderRequest = async (data: CreateOrderInput) => {
  const res = await fetch("/api/order-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};

export const getMyOrders = async (pageNumber: number = 1, pageSize: number = 50) => {
  const res = await fetch(`/api/order-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    cache: "no-store",
  });
  return res;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await fetch(`/api/order-requests/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res;
};
