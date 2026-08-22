"use client";

import * as React from "react";
import { ShieldCheck, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import {
  AuditLogItem,
  AuditLogFilterState,
  AuditLogPageResponse,
} from "./types";
import { AuditLogFilterBar } from "./AuditLogFilterBar";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogDetailSheet } from "./AuditLogDetailSheet";

interface AuditLogsCRUDProps {
  initialData?: AuditLogPageResponse;
}

const DEFAULT_FILTERS: AuditLogFilterState = {
  search: "",
  action: "",
  httpMethod: "",
  statusCode: "",
  isSuccess: "",
  username: "",
  fromDate: "",
  toDate: "",
};

export function AuditLogsCRUD({ initialData }: AuditLogsCRUDProps) {
  const [logs, setLogs] = React.useState<AuditLogItem[]>(
    initialData?.items || []
  );
  const [page, setPage] = React.useState<number>(initialData?.page || 1);
  const [pageSize, setPageSize] = React.useState<number>(
    initialData?.pageSize || 20
  );
  const [totalCount, setTotalCount] = React.useState<number>(
    initialData?.totalCount || 0
  );
  const [filters, setFilters] =
    React.useState<AuditLogFilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Detail Modal State
  const [selectedLog, setSelectedLog] = React.useState<AuditLogItem | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState<boolean>(false);

  // Fetch data from BFF endpoint
  const fetchLogs = React.useCallback(
    async (currentPage: number, currentFilters: AuditLogFilterState) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(currentPage),
          pageSize: String(pageSize),
          ...(currentFilters.search ? { search: currentFilters.search } : {}),
          ...(currentFilters.action ? { action: currentFilters.action } : {}),
          ...(currentFilters.httpMethod
            ? { httpMethod: currentFilters.httpMethod }
            : {}),
          ...(currentFilters.statusCode
            ? { statusCode: currentFilters.statusCode }
            : {}),
          ...(currentFilters.isSuccess
            ? { isSuccess: currentFilters.isSuccess }
            : {}),
          ...(currentFilters.username
            ? { username: currentFilters.username }
            : {}),
          ...(currentFilters.fromDate
            ? { fromDate: currentFilters.fromDate }
            : {}),
          ...(currentFilters.toDate ? { toDate: currentFilters.toDate } : {}),
        });

        const res = await fetch(`/api/audit-logs?${query.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch audit logs: ${res.status}`);
        }

        const data: AuditLogPageResponse = await res.json();
        setLogs(data.items || []);
        setPage(data.page || 1);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Handle filter changes
  const handleFilterChange = (newFilters: AuditLogFilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  // Re-fetch when page or filters change
  React.useEffect(() => {
    fetchLogs(page, filters);
  }, [page, filters, fetchLogs]);

  // Open detail modal
  const handleViewDetail = (log: AuditLogItem) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="flex flex-col gap-6 w-full">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <section className="space-y-1">
          <section className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              Nhật ký hoạt động hệ thống
            </h1>
            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <Activity className="size-3 text-primary" />
              <span>{totalCount} sự kiện</span>
            </Badge>
          </section>
          <p className="text-xs text-slate-500 max-w-2xl">
            Theo dõi, giám sát toàn bộ hoạt động của người dùng và các lượt gọi API trên hệ thống theo thời gian thực.
          </p>
        </section>

        <section className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLogs(page, filters)}
            disabled={loading}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw
              className={`size-3.5 ${loading ? "animate-spin text-primary" : ""}`}
            />
            <span>Làm mới</span>
          </Button>
        </section>
      </header>

      {/* Filter Bar */}
      <section>
        <AuditLogFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </section>

      {/* Audit Log Table Section */}
      <section className="space-y-4">
        <AuditLogTable
          logs={logs}
          loading={loading}
          onViewDetail={handleViewDetail}
        />

        {/* Pagination */}
        {totalCount > 0 && (
          <nav aria-label="Phân trang nhật ký hệ thống">
            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              itemName="sự kiện"
            />
          </nav>
        )}
      </section>

      {/* Detail Slide-over Sheet */}
      <AuditLogDetailSheet
        log={selectedLog}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </main>
  );
}
