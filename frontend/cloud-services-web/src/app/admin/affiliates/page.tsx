export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { AffiliateApplicationsCRUD } from "@/components/admin/affiliates/AffiliateApplicationsCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";
import { getAuthAccessToken } from "@/lib/auth-token";

async function getAffiliates(): Promise<any[]> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/affiliates?pageSize=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch affiliate requests (status: ${res.status})`);
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching affiliates, using fallback:", error);
    return [];
  }
}

export default async function AdminAffiliatesPage() {
  const affiliatesPromise = getAffiliates();

  return (
    <div className="flex flex-col gap-6 p-6">
      <Suspense fallback={<PanelSkeleton title="Đang tải danh sách đăng ký affiliate..." />}>
        <AffiliatesWrapper affiliatesPromise={affiliatesPromise} />
      </Suspense>
    </div>
  );
}

async function AffiliatesWrapper({
  affiliatesPromise,
}: {
  affiliatesPromise: Promise<any[]>;
}) {
  const affiliates = await affiliatesPromise;
  return <AffiliateApplicationsCRUD initialApplications={affiliates} />;
}
