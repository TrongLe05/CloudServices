"use client";

import { Eye, Calendar, Building2, Mail, Phone, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import * as React from "react";

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

export function OrderRequestsTable({ orders, onStatusChange, loading }: OrderRequestsTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<OrderRequest | null>(null);

  const getStatusBadge = (status: number | string) => {
    const s = String(status);
    if (s === "0" || s === "New") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Mới nhận
        </span>
      );
    }
    if (s === "1" || s === "Processing") {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          Đang xử lý
        </span>
      );
    }
    if (s === "2" || s === "Completed") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
          Hoàn tất
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
    if (s === "Processing" || s === "1") return 1;
    if (s === "Completed" || s === "2") return 2;
    return 3; // Rejected
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
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-foreground">{order.customerName}</h4>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="size-3" /> {order.email}</span>
                    <span className="flex items-center gap-1"><Phone className="size-3" /> {order.phone}</span>
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
                {getStatusBadge(order.status)}
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </div>
              </td>
              <td className="py-3 px-4 text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="size-3.5" />
                </Button>
                
                {/* Change Status Controls */}
                <select
                  value={mapStatusToInt(order.status)}
                  onChange={(e) => onStatusChange(order.id, Number(e.target.value))}
                  disabled={loading}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value={0}>Mới</option>
                  <option value={1}>Đang xử lý</option>
                  <option value={2}>Hoàn tất</option>
                  <option value={3}>Từ chối</option>
                </select>
              </td>
            </tr>
          ))}
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
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Thông tin khách hàng</span>
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
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Gói đăng ký</span>
                <div className="p-3.5 bg-muted/20 border border-border rounded-xl space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Tên gói dịch vụ</span>
                    <span className="font-semibold text-primary">{selectedOrder.servicePlanName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Chu kỳ thanh toán</span>
                    <span>{selectedOrder.billingCycle === "Monthly" ? "Hàng tháng (Monthly)" : "Hàng năm (Yearly)"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Thời gian gửi</span>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Trạng thái xử lý</span>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedOrder.status)}
                  <select
                    value={mapStatusToInt(selectedOrder.status)}
                    onChange={(e) => {
                      onStatusChange(selectedOrder.id, Number(e.target.value));
                      setSelectedOrder((prev) => prev ? { ...prev, status: Number(e.target.value) } : null);
                    }}
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value={0}>Mới</option>
                    <option value={1}>Đang xử lý</option>
                    <option value={2}>Hoàn tất (Completed)</option>
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
