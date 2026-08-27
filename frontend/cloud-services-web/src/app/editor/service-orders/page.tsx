export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { OrderRequestsCRUD } from "@/components/admin/service-orders/OrderRequestsCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";
import { getAuthAccessToken } from "@/lib/auth-token";

async function getOrderRequests(): Promise<any[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/order-requests?pageSize=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch order requests (status: ${res.status})`);
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching order requests:", error);
    return [];
  }
}

export default async function EditorServiceOrdersPage() {
  const ordersPromise = getOrderRequests();

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<PanelSkeleton title="Đang tải danh sách yêu cầu đặt dịch vụ..." />}>
        <OrdersWrapper ordersPromise={ordersPromise} />
      </Suspense>
    </div>
  );
}

async function OrdersWrapper({
  ordersPromise,
}: {
  ordersPromise: Promise<any[]>;
}) {
  const orders = await ordersPromise;
  return <OrderRequestsCRUD initialOrders={orders} />;
}
