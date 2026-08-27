"use client";

import * as React from "react";
import {
  Clock,
  CreditCard,
  Building2,
  Mail,
  Phone,
  Server,
  ShieldCheck,
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
import { UserOrder } from "@/types/orders.types";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { formatVND, formatDateVN, getRemainingPaymentSeconds, formatTimer } from "@/lib/formatUtils";

export interface OrderDetailSheetProps {
  order: UserOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPayOrder?: (order: UserOrder) => void;
}

export function OrderDetailSheet({
  order,
  isOpen,
  onClose,
  onPayOrder,
}: OrderDetailSheetProps) {
  if (!order) return null;

  const isPendingPayment = String(order.status) === "0" || String(order.status) === "New";
  const remainingSeconds = getRemainingPaymentSeconds(order.createdAt);
  const isExpired = isPendingPayment && remainingSeconds <= 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md p-6 overflow-y-auto">
        <div className="space-y-6">
          <SheetHeader className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="font-mono text-xs">
                #{order.id.substring(0, 8).toUpperCase()}
              </Badge>
              <OrderStatusBadge
                status={order.status}
                createdAt={order.createdAt}
              />
            </div>
            <SheetTitle className="text-xl font-bold text-slate-900 font-heading">
              {order.servicePlanName}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Thông tin đăng ký dịch vụ lưu trữ &amp; hạ tầng đám mây.
            </SheetDescription>
          </SheetHeader>

          {/* Order Information Details */}
          <div className="space-y-4 text-xs">
            {/* Remaining Payment Countdown Alert */}
            {isPendingPayment && (
              <div
                className={`p-4 rounded-2xl border ${
                  !isExpired
                    ? "bg-amber-50/90 border-amber-200 text-amber-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    <Clock className="size-4 text-amber-600 animate-pulse" />
                    Thời hạn thanh toán:
                  </span>
                  <span className="font-mono font-extrabold text-sm text-amber-950">
                    {!isExpired ? formatTimer(remainingSeconds) : "00:00 (Hết hạn)"}
                  </span>
                </div>
                <p className="text-[11px] opacity-85 leading-relaxed">
                  {!isExpired
                    ? "Vui lòng quét mã VietQR và hoàn tất chuyển khoản trong thời gian này để hệ thống kích hoạt tự động."
                    : "Đơn hàng đã quá hạn 5 phút và chuyển sang trạng thái Hết hạn. Quý khách vui lòng tạo lại đơn hàng mới."}
                </p>
              </div>
            )}

            {/* Thông tin liên hệ */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Thông tin người đặt:
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Người đặt:</span>
                  <span className="font-semibold text-slate-900">{order.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-900">{order.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-semibold text-slate-900">{order.phone}</span>
                </div>
                {order.companyName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Công ty:</span>
                    <span className="font-semibold text-slate-900">{order.companyName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin hạ tầng & Dịch vụ */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Chi tiết dịch vụ:
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Gói dịch vụ:</span>
                  <span className="font-bold text-primary">{order.servicePlanName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Chu kỳ thanh toán:</span>
                  <span className="font-semibold text-slate-900">{order.billingCycle}</span>
                </div>
                {order.estimatedPrice && order.estimatedPrice > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tổng thanh toán:</span>
                    <span className="font-bold text-slate-900">
                      {formatVND(order.estimatedPrice)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ngày gửi yêu cầu:</span>
                  <span className="font-semibold text-slate-900">
                    {formatDateVN(order.createdAt, true)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cam kết SLA:</span>
                  <span className="font-semibold text-emerald-600">99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Hỗ trợ kỹ thuật */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-700 space-y-1.5">
              <span className="font-bold text-indigo-950 block">Hỗ trợ kỹ thuật 24/7:</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Nếu bạn cần hỗ trợ cài đặt OS hay nâng cấp tài nguyên, vui lòng liên hệ hotline{" "}
                <strong>1900 xxxx</strong> hoặc gửi email về{" "}
                <strong>support@cloudservices.vn</strong>.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            {isPendingPayment && !isExpired && onPayOrder && (
              <Button
                onClick={() => {
                  onClose();
                  onPayOrder(order);
                }}
                className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-semibold py-5 rounded-xl shadow-md gap-2"
              >
                <CreditCard className="size-4" />
                Thanh toán ngay bằng VietQR
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full text-xs font-semibold rounded-xl"
            >
              Đóng cửa sổ
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
