"use client";

import * as React from "react";
import {
  Copy,
  Check,
  Loader2,
  QrCode,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PaymentQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  planName: string;
  amount: number;
  orderCode: number;
  qrCodeString: string;
  vietQrUrl?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  bin?: string | null;
  checkoutUrl?: string;
  description: string;
  onPaymentSuccess?: () => void;
  onPaymentExpired?: () => void;
}

export function PaymentQrModal({
  isOpen,
  onClose,
  orderId,
  planName,
  amount,
  orderCode,
  qrCodeString,
  vietQrUrl,
  accountNumber,
  accountName,
  bin,
  checkoutUrl,
  description,
  onPaymentSuccess,
  onPaymentExpired,
}: PaymentQrModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isExpired, setIsExpired] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300); // Đếm ngược 5 phút (300 giây)

  // Ưu tiên hiển thị template VietQR chuẩn có logo ngân hàng (compact2)
  const qrImageDisplayUrl =
    vietQrUrl ||
    (bin && accountNumber
      ? `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
          description
        )}&accountName=${encodeURIComponent(accountName || "")}`
      : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          qrCodeString
        )}`);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ⏱️ Bộ đếm ngược 5 phút: Nếu quá hạn 5p mà chưa thanh toán -> Chuyển đơn sang Từ chối (Rejected = 3)
  React.useEffect(() => {
    if (!isOpen || isSuccess || isExpired) return;

    setTimeLeft(300);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExpireOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSuccess, isExpired]);

  // Xử lý tự động chuyển trạng thái đơn hàng sang Rejected khi hết 5 phút
  const handleExpireOrder = async () => {
    setIsExpired(true);
    try {
      await fetch(`/api/order-requests/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 3 }), // 3 = Rejected (Từ chối)
      });
      onPaymentExpired?.();
    } catch (error) {
      console.error("Lỗi cập nhật hết hạn đơn hàng:", error);
    }
  };

  // 🔄 Dual-Polling: Kiểm tra trạng thái thanh toán từ PayOS và Backend mỗi 2.5s
  React.useEffect(() => {
    if (!isOpen || !orderCode || isSuccess || isExpired) return;

    let isMounted = true;

    const checkStatus = async () => {
      try {
        // 1. Kiểm tra trực tiếp trạng thái cổng PayOS qua Backend API
        const payRes = await fetch(`/api/payments/status/${orderCode}`, {
          cache: "no-store",
        });

        if (payRes.ok && isMounted) {
          const payData = await payRes.json();
          if (payData.isPaid || payData.status === "PAID") {
            setIsSuccess(true);
            onPaymentSuccess?.();
            return;
          }
        }

        // 2. Kiểm tra trạng thái đơn hàng trong Database
        const orderRes = await fetch(`/api/order-requests`, {
          cache: "no-store",
        });
        if (orderRes.ok && isMounted) {
          const data = await orderRes.json();
          const orders = data.items || data || [];
          const currentOrder = orders.find((o: any) => (o.id || o.Id) === orderId);

          // Trạng thái 1 (Processing - Đang xử lý) hoặc 2 (Completed)
          if (
            currentOrder &&
            (currentOrder.status === 1 ||
              currentOrder.status === "Processing" ||
              currentOrder.status === 2 ||
              currentOrder.status === "Completed")
          ) {
            setIsSuccess(true);
            onPaymentSuccess?.();
          } else if (
            currentOrder &&
            (currentOrder.status === 3 || currentOrder.status === "Rejected")
          ) {
            setIsExpired(true);
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
      }
    };

    const interval = setInterval(checkStatus, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, orderId, orderCode, isSuccess, isExpired, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 text-center relative">
          <div className="inline-flex items-center justify-center size-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-primary-foreground mb-2">
            <QrCode className="size-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-extrabold tracking-tight">Quét Mã VietQR Thanh Toán</h3>
          <p className="text-xs text-indigo-200/80 mt-0.5">
            Gói dịch vụ: <span className="font-semibold text-white">{planName}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            /* 1. Màn hình thanh toán thành công -> Đơn chuyển sang Đang xử lý */
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/20">
                <Check className="size-9 stroke-[3]" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Thanh toán thành công!</h4>
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-semibold px-3 py-1 text-xs">
                Trạng thái: Đang xử lý
              </Badge>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                Hệ thống PayOS đã ghi nhận giao dịch <strong>{formatVND(amount)}</strong>. Đơn hàng đang được kỹ thuật viên tiếp nhận và tiến hành khởi tạo máy chủ đám mây cho bạn.
              </p>
              <Button
                onClick={onClose}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl"
              >
                Xem tiến độ tại Lịch sử đơn hàng
              </Button>
            </div>
          ) : isExpired ? (
            /* 2. Màn hình hết hạn 5 phút -> Đơn đã tự động chuyển sang Từ chối */
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <XCircle className="size-9 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Giao dịch đã hết hạn</h4>
              <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-semibold px-3 py-1 text-xs">
                Trạng thái: Từ chối (Hết hạn 5 phút)
              </Badge>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                Thời gian 5 phút thanh toán cho mã giao dịch #{orderCode} đã kết thúc. Đơn hàng đã được tự động hủy bỏ. Bạn có thể tạo đơn hàng mới bất cứ lúc nào.
              </p>
              <Button
                onClick={onClose}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 rounded-xl"
              >
                Đóng và Đặt lại dịch vụ
              </Button>
            </div>
          ) : (
            /* 3. Màn hình đang hiển thị QR Code và đồng hồ đếm ngược */
            <>
              {/* Countdown Timer Badge */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Clock className="size-4 text-amber-600 animate-pulse" />
                  <span>Thời gian giữ mã thanh toán:</span>
                </div>
                <span className="font-mono font-extrabold text-sm text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* VietQR Frame */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-2.5 bg-white rounded-2xl border-2 border-dashed border-indigo-300 shadow-md relative group hover:border-indigo-500 transition-colors">
                  <img
                    src={qrImageDisplayUrl}
                    alt="VietQR PayOS"
                    className="w-64 h-64 object-contain rounded-xl"
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                  <Loader2 className="size-4 animate-spin text-indigo-500" />
                  <span>Tự động chuyển trạng thái ngay khi nhận tiền</span>
                </div>
              </div>

              {/* Bank & Payment Information Card */}
              <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs">
                {accountNumber && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">{accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(accountNumber, "acc")}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-200"
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === "acc" ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {accountName && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
                    <span className="font-semibold text-slate-900 uppercase text-[11px]">
                      {accountName}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-medium">Số tiền thanh toán:</span>
                  <span className="font-extrabold text-base text-indigo-600">
                    {formatVND(amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/80">
                  <span className="text-slate-500 font-medium">Nội dung chuyển khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 bg-indigo-50 border border-indigo-100 text-indigo-900 px-2 py-0.5 rounded-lg">
                      {description}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(description, "desc")}
                      className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-200"
                      title="Sao chép nội dung chuyển khoản"
                    >
                      {copiedField === "desc" ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="space-y-2 pt-1">
                {checkoutUrl && (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:underline font-semibold py-1"
                  >
                    <span>Mở trang cổng thanh toán PayOS trực tiếp</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full text-xs h-9 font-semibold rounded-xl"
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
