"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatedOrderPayOSData } from "@/types/checkout.types";
import { BankTransferInfoCard } from "@/components/common/BankTransferInfoCard";
import { formatVND } from "@/lib/formatUtils";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";
import { toast } from "@/components/ui/toast";

export interface CheckoutPaymentSectionProps {
  orderData: CreatedOrderPayOSData;
  onReset: () => void;
}

export function CheckoutPaymentSection({
  orderData,
  onReset,
}: CheckoutPaymentSectionProps) {
  const [activeTab, setActiveTab] = React.useState<"qr" | "manual">("qr");

  // 1. Hook đếm ngược đồng bộ 5 phút
  const { remaining, formattedTime, isExpired, isUrgent } = useCountdownTimer({
    createdAt: orderData.createdAt,
    totalDurationSeconds: 300,
    onExpire: () => {
      toast.add({
        title: "Đơn hàng đã hết hạn",
        description: "Hạn thanh toán 5 phút đã kết thúc. Vui lòng tạo lại đơn mới.",
        type: "error",
      });
    },
  });

  // 2. Hook polling tự động kiểm tra thanh toán mỗi 2.5 giây
  const { isPaid, isChecking, checkStatus } = usePaymentPolling({
    orderCode: orderData.orderCode,
    enabled: !isExpired,
    intervalMs: 2500,
    onSuccess: () => {
      toast.add({
        title: "Thanh toán thành công!",
        description: "Hệ thống đã nhận được tiền và đang tự động kích hoạt máy chủ.",
        type: "success",
      });
    },
  });

  const qrImageUrl =
    orderData.vietQrUrl ||
    (orderData.bin && orderData.accountNumber
      ? `https://img.vietqr.io/image/${orderData.bin}-${orderData.accountNumber}-compact2.png?amount=${orderData.amount}&addInfo=${encodeURIComponent(
          orderData.description
        )}&accountName=${encodeURIComponent(orderData.accountName || "")}`
      : `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
          orderData.qrCodeString
        )}`);

  // Nếu đã thanh toán thành công
  if (isPaid) {
    return (
      <div className="p-8 md:p-12 rounded-3xl bg-white border border-emerald-200 shadow-md text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="size-10" />
        </div>

        <div className="space-y-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold px-3 py-1 text-xs">
            Giao dịch thành công
          </Badge>
          <h2 className="text-2xl font-black text-slate-900 font-heading">
            Cảm ơn bạn đã đặt dịch vụ!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Hệ thống đã ghi nhận thanh toán{" "}
            <strong className="text-emerald-700">{formatVND(orderData.amount)}</strong>.
            Đơn hàng đang được kỹ thuật viên tiếp nhận và cấu hình hạ tầng cho bạn.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs flex items-center justify-between">
          <span className="text-slate-500">Mã đơn hàng:</span>
          <span className="font-mono font-extrabold text-slate-900">
            #{orderData.orderId.substring(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            render={<Link href="/don-hang" />}
            className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs bg-primary text-white shadow-md gap-1.5"
          >
            <span>Xem lịch sử đơn hàng</span>
            <ArrowRight className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-xs border-slate-200"
          >
            Đặt thêm dịch vụ khác
          </Button>
        </div>
      </div>
    );
  }

  // Nếu đã hết hạn thanh toán
  if (isExpired) {
    return (
      <div className="p-8 md:p-12 rounded-3xl bg-white border border-rose-200 shadow-md text-center max-w-2xl mx-auto space-y-6">
        <div className="size-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Clock className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Đơn hàng đã hết hạn thanh toán
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Mã QR VietQR đã hết hạn hiệu lực 5 phút để bảo đảm giữ giá cấu hình. Bạn có thể tiến hành đặt lại bất kỳ lúc nào.
          </p>
        </div>

        <Button
          type="button"
          onClick={onReset}
          className="h-11 px-8 rounded-xl font-bold text-xs bg-slate-900 text-white"
        >
          Đặt lại đơn hàng mới
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner Countdown & Số tiền */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Số tiền cần thanh toán
          </span>
          <span className="text-2xl font-black text-primary font-heading">
            {formatVND(orderData.amount)}
          </span>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${
            isUrgent
              ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
              : "bg-white border-amber-200 text-amber-900"
          }`}
        >
          <Clock className={`size-4 ${isUrgent ? "text-rose-600" : "text-amber-600"}`} />
          <span>Hết hạn sau:</span>
          <span className="font-mono text-sm font-black">{formattedTime}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("qr")}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "qr"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <QrCode className="size-3.5" />
          <span>Quét mã VietQR (Khuyên dùng)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "manual"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CreditCard className="size-3.5" />
          <span>Chuyển khoản thủ công</span>
        </button>
      </div>

      {activeTab === "qr" ? (
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
            <img
              src={qrImageUrl}
              alt="VietQR Payment"
              className="size-60 sm:size-72 object-contain rounded-xl"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
            <span>Hệ thống tự động xác thực ngay khi nhận tiền</span>
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Smartphone className="size-3.5" />
            Mở App Banking bất kỳ hoặc Ví điện tử (MoMo, ZaloPay) để quét mã
          </p>
        </div>
      ) : (
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <BankTransferInfoCard
            accountNumber={orderData.accountNumber}
            accountName={orderData.accountName}
            bin={orderData.bin}
            amount={orderData.amount}
            description={orderData.description}
          />
        </div>
      )}

      {/* Footer Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => checkStatus()}
          disabled={isChecking}
          className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs border-slate-200 gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${isChecking ? "animate-spin" : ""}`} />
          <span>{isChecking ? "Đang đối soát ngân hàng..." : "Tôi đã chuyển tiền"}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          Hủy và đặt gói khác
        </Button>
      </div>
    </div>
  );
}
