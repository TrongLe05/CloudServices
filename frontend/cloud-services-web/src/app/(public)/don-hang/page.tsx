export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { auth } from "@/auth";
import { OrderHistoryView } from "@/components/services/OrderHistoryView";
import { UserOrder } from "@/types/orders.types";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthAccessToken } from "@/lib/auth-token";

async function getUserOrders(userEmail?: string | null): Promise<UserOrder[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const emailQuery = userEmail ? `&customerEmail=${encodeURIComponent(userEmail)}` : "";
    const res = await fetch(`${apiUrl}/api/order-requests?pageSize=100${emailQuery}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items: UserOrder[] = data.items || data.Items || [];
    return items;
  } catch (error) {
    console.error("Lỗi khi tải lịch sử đơn hàng:", error);
    return [];
  }
}

export default async function OrderHistoryPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const orders = await getUserOrders(userEmail);

  return (
    <Suspense fallback={<OrderHistorySkeleton />}>
      <OrderHistoryView initialOrders={orders} userEmail={userEmail} />
    </Suspense>
  );
}

function OrderHistorySkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-3xl" />
    </div>
  );
}
