"use client";

import { Eye, Calendar, Mail, Phone, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import * as React from "react";

export interface AffiliateApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  motivation: string;
  status: number | string; // Can be int enum (0, 1, 2, 3) or string ("New", "Pending", etc.)
  createdAt: string;
}

interface AffiliateApplicationsTableProps {
  applications: AffiliateApplication[];
  onStatusChange: (id: string, nextStatus: number | string) => Promise<void>;
  loading: boolean;
}

export function AffiliateApplicationsTable({
  applications,
  onStatusChange,
  loading,
}: AffiliateApplicationsTableProps) {
  const [selectedApp, setSelectedApp] = React.useState<AffiliateApplication | null>(null);

  const getStatusBadge = (status: number | string) => {
    const s = String(status);
    if (s === "0" || s === "New") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Đăng ký mới
        </span>
      );
    }
    if (s === "1" || s === "Pending") {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          Đang xét duyệt
        </span>
      );
    }
    if (s === "2" || s === "Approved") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
          Đã chấp nhận
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
        Từ chối
      </span>
    );
  };

  const mapStatusToInt = (status: number | string): number => {
    const s = String(status);
    if (s === "New" || s === "0") return 0;
    if (s === "Pending" || s === "1") return 1;
    if (s === "Approved" || s === "2") return 2;
    return 3; // Rejected
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-medium">
            <th className="py-3 px-4">Đối tác</th>
            <th className="py-3 px-4">Kênh liên kết</th>
            <th className="py-3 px-4">Trạng thái</th>
            <th className="py-3 px-4">Ngày đăng ký</th>
            <th className="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-foreground">{app.fullName}</h4>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="size-3" /> {app.email}</span>
                    <span className="flex items-center gap-1"><Phone className="size-3" /> {app.phone}</span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <a
                  href={app.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-mono truncate max-w-xs"
                >
                  <Link2 className="size-3 shrink-0" /> {app.websiteUrl}
                </a>
              </td>
              <td className="py-3 px-4">
                {getStatusBadge(app.status)}
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </td>
              <td className="py-3 px-4 text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedApp(app)}
                >
                  <Eye className="size-3.5" />
                </Button>
                
                <select
                  value={mapStatusToInt(app.status)}
                  onChange={(e) => onStatusChange(app.id, Number(e.target.value))}
                  disabled={loading}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value={0}>Mới</option>
                  <option value={1}>Chờ duyệt</option>
                  <option value={2}>Chấp nhận</option>
                  <option value={3}>Từ chối</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details Sheet */}
      <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <SheetContent side="right" className="p-6">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle>Chi tiết đăng ký đối tác Affiliate</SheetTitle>
            <SheetDescription>Thông tin ứng tuyển chương trình tiếp thị liên kết</SheetDescription>
          </SheetHeader>
          {selectedApp && (
            <div className="space-y-6 pt-6 text-sm">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Thông tin đối tác</span>
                <div className="p-3.5 bg-muted/20 border border-border rounded-xl space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Họ và tên</span>
                    <span className="font-semibold">{selectedApp.fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Email</span>
                    <span>{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Số điện thoại</span>
                    <span>{selectedApp.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Kênh liên kết (Website/Social)</span>
                    <a href={selectedApp.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono">
                      {selectedApp.websiteUrl}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Mục tiêu & Động lực</span>
                <div className="p-3.5 bg-muted/20 border border-border rounded-xl">
                  <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">{selectedApp.motivation || "Không có nội dung mô tả"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Trạng thái xử lý</span>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedApp.status)}
                  <select
                    value={mapStatusToInt(selectedApp.status)}
                    onChange={(e) => {
                      onStatusChange(selectedApp.id, Number(e.target.value));
                      setSelectedApp((prev) => prev ? { ...prev, status: Number(e.target.value) } : null);
                    }}
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value={0}>Mới đăng ký</option>
                    <option value={1}>Chờ duyệt (Pending)</option>
                    <option value={2}>Chấp nhận (Approved)</option>
                    <option value={3}>Từ chối (Rejected)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
