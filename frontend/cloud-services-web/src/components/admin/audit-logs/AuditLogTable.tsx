"use client";

import * as React from "react";
import { Eye, Clock, User, Globe, ShieldAlert, Timer } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AuditLogItem } from "./types";
import { HttpMethodBadge, StatusCodeBadge } from "./AuditLogActionBadge";

interface AuditLogTableProps {
  logs: AuditLogItem[];
  loading: boolean;
  onViewDetail: (log: AuditLogItem) => void;
}

export function AuditLogTable({
  logs,
  loading,
  onViewDetail,
}: AuditLogTableProps) {
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[300px] rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500">Đang tải nhật ký hoạt động hệ thống...</p>
      </section>
    );
  }

  if (logs.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[300px] rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <ShieldAlert className="size-10 text-slate-400" />
        <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Chưa có nhật ký hoạt động nào
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Không tìm thấy dữ liệu nhật ký phù hợp với bộ lọc hiện tại. Mọi lượt tương tác và gọi API hệ thống sẽ tự động được ghi nhận tại đây.
        </p>
      </section>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-800/60">
          <TableRow>
            <TableHead className="w-[170px] text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" /> Thời gian
              </span>
            </TableHead>
            <TableHead className="w-[170px] text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" /> Người thực hiện
              </span>
            </TableHead>
            <TableHead className="w-[90px] text-xs font-bold">Method</TableHead>
            <TableHead className="text-xs font-bold">Hành động &amp; Endpoint</TableHead>
            <TableHead className="w-[130px] text-xs font-bold">Trạng thái</TableHead>
            <TableHead className="w-[100px] text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Timer className="size-3.5 text-slate-400" /> Phản hồi
              </span>
            </TableHead>
            <TableHead className="w-[130px] text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Globe className="size-3.5 text-slate-400" /> IP
              </span>
            </TableHead>
            <TableHead className="w-[90px] text-right text-xs font-bold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
          {logs.map((log) => {
            const dateValue = log.createdAt || log.timestamp;
            const formattedDate = new Date(dateValue).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <TableRow
                key={log.id}
                className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40"
              >
                {/* Timestamp */}
                <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {formattedDate}
                </TableCell>

                {/* Username + Role */}
                <TableCell>
                  <section className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono">
                      {log.username || "Khách vãng lai"}
                    </span>
                    {log.userRole && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {log.userRole}
                      </span>
                    )}
                  </section>
                </TableCell>

                {/* HTTP Method */}
                <TableCell>
                  <HttpMethodBadge method={log.httpMethod} />
                </TableCell>

                {/* Action & Path */}
                <TableCell>
                  <section className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {log.action || `${log.httpMethod} ${log.path}`}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono line-clamp-1 break-all">
                      {log.path}
                    </span>
                  </section>
                </TableCell>

                {/* Status Code */}
                <TableCell>
                  <StatusCodeBadge statusCode={log.statusCode} isSuccess={log.isSuccess} />
                </TableCell>

                {/* Execution Duration */}
                <TableCell className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {log.executionDurationMs} ms
                </TableCell>

                {/* IP Address */}
                <TableCell className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {log.ipAddress || "—"}
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(log)}
                    className="h-8 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                    title="Xem chi tiết lượt gọi"
                  >
                    <Eye className="size-3.5" />
                    <span>Chi tiết</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </article>
  );
}
