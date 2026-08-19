export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { cookies } from "next/headers";
import { AffiliateApplicationsCRUD } from "@/components/admin/affiliates/AffiliateApplicationsCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";

async function getAffiliates(): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/affiliates?pageSize=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch affiliate requests");
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
