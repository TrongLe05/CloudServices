"use client";

import {
  Eye,
  Calendar,
  Building2,
  Mail,
  Phone,
  Cpu,
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
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { formatDateVN } from "@/lib/formatUtils";

export interface OrderRequest {
  id: string;
  servicePlanId: string;
  servicePlanName: string;
  billingCycle: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  status: number | string; // Can be int enum (0, 1, 2, 3) or string ("New", "Processing", etc.)
  createdAt: string;
}

interface OrderRequestsTableProps {
  orders: OrderRequest[];
  onStatusChange: (id: string, nextStatus: number | string) => Promise<void>;
  loading: boolean;
}

export function OrderRequestsTable({
  orders,
  onStatusChange,
  loading,
}: OrderRequestsTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<OrderRequest | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  const mapStatusToInt = (status: number | string): number => {
    const s = String(status);
    if (s === "New" || s === "0") return 0;
    if (s === "Processing" || s === "1") return 1;
    if (s === "Completed" || s === "2") return 2;
    return 3; // Rejected
  };

  const handleAction = async (id: string, nextStatus: number) => {
    setActionLoadingId(id);
    try {
      await onStatusChange(id, nextStatus);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
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
            <th className="py-3 px-4">Khách hàng</th>
            <th className="py-3 px-4">Gói dịch vụ</th>
            <th className="py-3 px-4">Trạng thái</th>
            <th className="py-3 px-4">Thời gian</th>
            <th className="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const statusInt = mapStatusToInt(order.status);
            const isRowLoading = loading || actionLoadingId === order.id;

            return (
              <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-foreground">{order.customerName}</h4>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> {order.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {order.phone}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground flex items-center gap-1 text-xs sm:text-sm">
                      <Cpu className="size-3.5 text-primary/70" /> {order.servicePlanName}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium block">
                      Chu kỳ: {order.billingCycle === "Monthly" ? "Hàng tháng" : "Hàng năm"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <OrderStatusBadge status={order.status} showCountdown={false} />
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDateVN(order.createdAt, true)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    {/* Status Action Buttons */}
                    {statusInt === 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(order.id, 1)}
                          className="h-7 text-xs px-2 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 gap-1"
                        >
                          <Play className="size-3" /> Tiếp nhận
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(order.id, 3)}
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
                          onClick={() => handleAction(order.id, 2)}
                          className="h-7 text-xs px-2 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 gap-1"
                        >
                          <CheckCircle2 className="size-3" /> Hoàn tất
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRowLoading}
                          onClick={() => handleAction(order.id, 3)}
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
                        onClick={() => handleAction(order.id, 1)}
                        className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground gap-1"
                      >
                        <RotateCcw className="size-3" /> Mở lại
                      </Button>
                    )}

                    {statusInt === 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isRowLoading}
                        onClick={() => handleAction(order.id, 1)}
                        className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground gap-1"
                      >
                        <RotateCcw className="size-3" /> Xử lý lại
                      </Button>
                    )}

                    {/* View Details Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setSelectedOrder(order)}
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
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="p-6">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle>Chi tiết yêu cầu đặt dịch vụ</SheetTitle>
            <SheetDescription>Thông tin đăng ký dịch vụ của khách hàng</SheetDescription>
          </SheetHeader>
          {selectedOrder && (
            <div className="space-y-6 pt-6 text-sm">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Thông tin khách hàng
                </span>
                <div className="p-3.5 bg-muted/20 border border-border rounded-xl space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Họ và tên</span>
                    <span className="font-semibold">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Email</span>
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Số điện thoại</span>
                    <span>{selectedOrder.phone}</span>
                  </div>
                  {selectedOrder.companyName && (
                    <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                      <Building2 className="size-4" /> {selectedOrder.companyName}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Gói đăng ký
                </span>
                <div className="p-3.5 bg-muted/20 border border-border rounded-xl space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Tên gói dịch vụ</span>
                    <span className="font-semibold text-primary">{selectedOrder.servicePlanName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Chu kỳ thanh toán</span>
                    <span>
                      {selectedOrder.billingCycle === "Monthly"
                        ? "Hàng tháng (Monthly)"
                        : "Hàng năm (Yearly)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Thời gian gửi</span>
                    <span>{formatDateVN(selectedOrder.createdAt, true)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Chuyển trạng thái xử lý
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedOrder.status) === 0 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedOrder.id}
                    onClick={() => handleAction(selectedOrder.id, 0)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                    Mới nhận
                  </Button>

                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedOrder.status) === 1 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedOrder.id}
                    onClick={() => handleAction(selectedOrder.id, 1)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    Đang xử lý
                  </Button>

                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedOrder.status) === 2 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedOrder.id}
                    onClick={() => handleAction(selectedOrder.id, 2)}
                    className="justify-start gap-1.5 text-xs h-9"
                  >
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    Hoàn tất
                  </Button>

                  <Button
                    type="button"
                    variant={mapStatusToInt(selectedOrder.status) === 3 ? "default" : "outline"}
                    size="sm"
                    disabled={loading || actionLoadingId === selectedOrder.id}
                    onClick={() => handleAction(selectedOrder.id, 3)}
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
