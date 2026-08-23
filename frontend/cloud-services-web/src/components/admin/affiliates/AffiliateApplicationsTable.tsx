"use client";

import {
  Eye,
  Calendar,
  Building2,
  Mail,
  Phone,
  Link2,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import * as React from "react";

export interface AffiliateApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  websiteUrl?: string | null;
  promotionPlan?: string | null;
  status: number | string;
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
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  const getStatusBadge = (status: number | string) => {
    const s = String(status);
    if (s === "0" || s === "New") {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
        >
          <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
          Mới nhận
        </Badge>
      );
    }
    if (s === "1" || s === "Processing") {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
        >
          <Clock className="size-3 text-amber-600" />
          Chờ duyệt
        </Badge>
      );
    }
    if (s === "2" || s === "Approved" || s === "Completed") {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          <CheckCircle2 className="size-3 text-emerald-600" />
          Chấp nhận
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="gap-1 border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
      >
        <XCircle className="size-3 text-rose-600" />
        Từ chối
      </Badge>
    );
  };

  const mapStatusToInt = (status: number | string): number => {
    const s = String(status);
    if (s === "New" || s === "0") return 0;
    if (s === "Processing" || s === "1") return 1;
    if (s === "Approved" || s === "Completed" || s === "2") return 2;
    return 3; // Rejected
  };

  const handleAction = async (id: string, nextStatus: number) => {
    setActionLoadingId(id);
    try {
      await onStatusChange(id, nextStatus);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-medium">
            <th className="py-3 px-4">Đối tác</th>
            <th className="py-3 px-4">Kênh quảng bá</th>
            <th className="py-3 px-4">Trạng thái</th>
            <th className="py-3 px-4">Thời gian</th>
            <th className="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((app) => {
            const statusInt = mapStatusToInt(app.status);
            const isRowLoading = loading || actionLoadingId === app.id;

            return (
              <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-foreground">{app.fullName}</h4>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {app.phone}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {app.websiteUrl ? (
                    <a
                      href={app.websiteUrl.startsWith("http") ? app.websiteUrl : `https://${app.websiteUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate"
                    >
                      <Link2 className="size-3 shrink-0" /> {app.websiteUrl}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Chưa cung cấp</span>
                  )}
                </td>
                <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    {/* Action buttons */}
                    {statusInt === 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(app.id, 1)}
                          className="h-7 text-xs px-2 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 gap-1"
                        >
                          <Play className="size-3" /> Duyệt đơn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(app.id, 3)}
                          className="h-7 text-xs px-2 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 gap-1"
                        >
                          <XCircle className="size-3" /> Từ chối
                        </Button>
                      </>
                    )}

                    {statusInt === 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(app.id, 2)}
                          className="h-7 text-xs px-2 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 gap-1"
                        >
                          <CheckCircle2 className="size-3" /> Chấp nhận
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(app.id, 3)}
                          className="h-7 text-xs px-2 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 gap-1"
                        >
                          <XCircle className="size-3" /> Từ chối
                        </Button>
                      </>
                    )}

                    {statusInt === 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isRowLoading}
                        onClick={() => handleAction(app.id, 1)}
                        className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground gap-1"
                      >
                        <RotateCcw className="size-3" /> Xem xét lại
                      </Button>
                    )}

                    {statusInt === 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isRowLoading}
                        onClick={() => handleAction(app.id, 1)}
                        className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground gap-1"
                      >
                        <RotateCcw className="size-3" /> Duyệt lại
                      </Button>
                    )}

                    {/* View Details Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setSelectedApp(app)}
                      title="Xem chi tiết"
                    >
                      <Eye className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
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
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Thông tin đối tác
                </span>
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
                    <span className="text-xs text-muted-foreground block">Website / Mạng xã hội</span>
                    {selectedApp.websiteUrl ? (
                      <a
                        href={selectedApp.websiteUrl.startsWith("http") ? selectedApp.websiteUrl : `https://${selectedApp.websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Link2 className="size-3 shrink-0" /> {selectedApp.websiteUrl}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Chưa cung cấp</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedApp.promotionPlan && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Kế hoạch tiếp thị
                  </span>
                  <div className="p-3.5 bg-muted/20 border border-border rounded-xl">
                    <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedApp.promotionPlan}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Chuyển trạng thái xét duyệt
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedApp.status) === 0 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedApp.id}
                    onClick={() => handleAction(selectedApp.id, 0)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                    Mới nhận
                  </Button>

                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedApp.status) === 1 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedApp.id}
                    onClick={() => handleAction(selectedApp.id, 1)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    Chờ duyệt
                  </Button>

                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedApp.status) === 2 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedApp.id}
                    onClick={() => handleAction(selectedApp.id, 2)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    Chấp nhận
                  </Button>

                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedApp.status) === 3 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedApp.id}
                    onClick={() => handleAction(selectedApp.id, 3)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                    Từ chối
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
