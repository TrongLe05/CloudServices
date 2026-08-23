export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { AuditLogsCRUD } from "@/components/admin/audit-logs/AuditLogsCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";
import { getAuthAccessToken } from "@/lib/auth-token";
import { AuditLogPageResponse } from "@/components/admin/audit-logs/types";

async function getInitialAuditLogs(): Promise<AuditLogPageResponse> {
  try {
    const token = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

    const res = await fetch(`${apiUrl}/api/audit-logs?page=1&pageSize=20`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch audit logs (status: ${res.status})`);
    }

    const data = await res.json();
    return {
      items: data.items || data.Items || [],
      page: data.page || 1,
      pageSize: data.pageSize || 20,
      totalCount: data.totalCount ?? data.items?.length ?? 0,
    };
  } catch (error) {
    console.error("Error fetching initial audit logs, using fallback:", error);
    return {
      items: [],
      page: 1,
      pageSize: 20,
      totalCount: 0,
    };
  }
}

export default async function AdminAuditLogsPage() {
  const auditLogsPromise = getInitialAuditLogs();

  return (
    <main className="flex flex-col gap-6 p-6">
      <Suspense fallback={<PanelSkeleton title="Đang tải nhật ký hệ thống..." />}>
        <AuditLogsWrapper auditLogsPromise={auditLogsPromise} />
      </Suspense>
    </main>
  );
}

async function AuditLogsWrapper({
  auditLogsPromise,
}: {
  auditLogsPromise: Promise<AuditLogPageResponse>;
}) {
  const initialData = await auditLogsPromise;
  return <AuditLogsCRUD initialData={initialData} />;
}
