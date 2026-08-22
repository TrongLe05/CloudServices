"use client";

import * as React from "react";
import {
  Clock,
  User,
  Globe,
  Timer,
  Terminal,
  AlertTriangle,
  Monitor,
  Database,
  FileCode2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AuditLogItem } from "./types";
import { HttpMethodBadge, StatusCodeBadge } from "./AuditLogActionBadge";

interface AuditLogDetailSheetProps {
  log: AuditLogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailSheet({
  log,
  open,
  onOpenChange,
}: AuditLogDetailSheetProps) {
  if (!log) return null;

  const dateValue = log.createdAt || log.timestamp;
  const formattedDate = new Date(dateValue).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedPayload = React.useMemo(() => {
    if (!log.payload) return null;
    try {
      const parsed = JSON.parse(log.payload);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return log.payload;
    }
  }, [log.payload]);

  const formattedOldValues = React.useMemo(() => {
    if (!log.oldValues) return null;
    try {
      const parsed = JSON.parse(log.oldValues);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return log.oldValues;
    }
  }, [log.oldValues]);

  const formattedNewValues = React.useMemo(() => {
    if (!log.newValues) return null;
    try {
      const parsed = JSON.parse(log.newValues);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return log.newValues;
    }
  }, [log.newValues]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto p-6">
        <SheetHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <section className="flex flex-wrap items-center gap-2">
            <HttpMethodBadge method={log.httpMethod} />
            <StatusCodeBadge statusCode={log.statusCode} isSuccess={log.isSuccess} />
            <Badge variant="outline" className="font-mono text-[11px] text-slate-500">
              {log.executionDurationMs} ms
            </Badge>
            {log.category && (
              <Badge variant="secondary" className="text-[11px]">
                {log.category}
              </Badge>
            )}
          </section>

          <SheetTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
            {log.action || `${log.httpMethod} ${log.path}`}
          </SheetTitle>

          <SheetDescription className="text-xs text-slate-500 font-mono break-all">
            {log.path}
          </SheetDescription>
        </SheetHeader>

        {/* Error Callout if any */}
        {log.errorMessage && (
          <aside className="my-4 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            <header className="flex items-center gap-2 font-semibold text-xs mb-1">
              <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
              <span>Thông báo lỗi hệ thống:</span>
            </header>
            <p className="text-xs font-mono whitespace-pre-wrap break-all">
              {log.errorMessage}
            </p>
          </aside>
        )}

        {/* System & Entity Metadata List */}
        <section className="my-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                <User className="size-3.5" /> Người thực hiện
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="font-mono">{log.username || "Khách vãng lai"}</span>
                {log.userRole && (
                  <Badge variant="secondary" className="text-[10px]">
                    {log.userRole}
                  </Badge>
                )}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="size-3.5" /> Thời gian ghi nhận
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">
                {formattedDate}
              </dd>
            </div>

            {log.entityName && (
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Database className="size-3.5" /> Thực thể (Entity)
                </dt>
                <dd className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {log.entityName} {log.entityId ? `(#${log.entityId})` : ""}
                </dd>
              </div>
            )}

            <div className="space-y-1">
              <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                <Globe className="size-3.5" /> Địa chỉ IP
              </dt>
              <dd className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {log.ipAddress || "Không xác định"}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                <Timer className="size-3.5" /> Thời gian xử lý API
              </dt>
              <dd className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {log.executionDurationMs} ms
              </dd>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                <Monitor className="size-3.5" /> Thiết bị &amp; Trình duyệt (User-Agent)
              </dt>
              <dd className="text-[11px] text-slate-600 dark:text-slate-400 font-mono break-all leading-relaxed">
                {log.userAgent || "Không có thông tin"}
              </dd>
            </div>
          </dl>
        </section>

        {/* Entity Changes (OldValues / NewValues) */}
        {(formattedOldValues || formattedNewValues) && (
          <section className="space-y-3 mb-6">
            <header className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileCode2 className="size-3.5" /> Chi tiết thay đổi dữ liệu (Audit Diff)
              </h4>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formattedOldValues && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-rose-500">Dữ liệu trước thay đổi (OldValues)</span>
                  <article className="rounded-xl border border-rose-200 bg-slate-950 p-3 text-slate-50 overflow-x-auto dark:border-rose-950">
                    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-rose-300">
                      {formattedOldValues}
                    </pre>
                  </article>
                </div>
              )}

              {formattedNewValues && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-500">Dữ liệu sau thay đổi (NewValues)</span>
                  <article className="rounded-xl border border-emerald-200 bg-slate-950 p-3 text-slate-50 overflow-x-auto dark:border-emerald-950">
                    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-emerald-300">
                      {formattedNewValues}
                    </pre>
                  </article>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Request Payload */}
        {formattedPayload && (
          <section className="space-y-2">
            <header className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Terminal className="size-3.5" /> Dữ liệu gửi lên (Payload)
              </h4>
              <span className="text-[10px] text-slate-400">application/json</span>
            </header>

            <article className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-slate-50 overflow-x-auto dark:border-slate-800">
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-emerald-400">
                {formattedPayload}
              </pre>
            </article>
          </section>
        )}
      </SheetContent>
    </Sheet>
  );
}
