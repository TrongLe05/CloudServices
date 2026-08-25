export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { getNews } from "@/app/admin/news/page";
import { EditorWorkspaceView } from "@/components/admin/dashboard/EditorWorkspaceView";
import { getAuthAccessToken } from "@/lib/auth-token";
import { getBackendApiUrl } from "@/lib/api-url";
import { EditorWorkspaceSkeleton } from "@/components/admin/AdminSkeletons";

async function getOrderRequests(): Promise<any[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/order-requests?pageSize=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching order requests:", error);
    return [];
  }
}

async function getAffiliates(): Promise<any[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = getBackendApiUrl();

    const res = await fetch(`${apiUrl}/api/affiliates?pageSize=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return [];
  }
}

async function EditorDashboardContent() {
  const [orderRequests, affiliates, news] = await Promise.all([
    getOrderRequests(),
    getAffiliates(),
    getNews(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
          Không gian làm việc Biên tập viên
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
          Editor Control Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Quản lý xuất bản bài viết blog, duyệt yêu cầu đặt dịch vụ và đăng ký CTV Affiliate.
        </p>
      </div>

      <EditorWorkspaceView
        initialOrders={orderRequests}
        initialAffiliates={affiliates}
        initialNews={news}
      />
    </div>
  );
}

export default function EditorDashboardPage() {
  return (
    <Suspense fallback={<EditorWorkspaceSkeleton />}>
      <EditorDashboardContent />
    </Suspense>
  );
}
