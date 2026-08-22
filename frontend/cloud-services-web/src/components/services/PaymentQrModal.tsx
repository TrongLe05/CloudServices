"use client";

import * as React from "react";
import { Copy, Check, Loader2, QrCode, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
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
  checkoutUrl?: string;
  description: string;
  onPaymentSuccess?: () => void;
}

export function PaymentQrModal({
  isOpen,
  onClose,
  orderId,
  planName,
  amount,
  orderCode,
  qrCodeString,
  checkoutUrl,
  description,
  onPaymentSuccess,
}: PaymentQrModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Tạo URL ảnh VietQR hiển thị trực tiếp từ chuỗi PayOS QR String
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    qrCodeString
  )}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Polling trạng thái đơn hàng định kỳ 3.5s để bắt sự kiện Webhook PayOS xác nhận tiền về
  React.useEffect(() => {
    if (!isOpen || !orderId || isSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order-requests`);
        if (res.ok) {
          const data = await res.json();
          const orders = data.items || data || [];
          const currentOrder = orders.find((o: any) => (o.id || o.Id) === orderId);
          
          // Trạng thái 1: Processing, 2: Completed, 3: Approved
          if (
            currentOrder &&
            (currentOrder.status === 1 ||
              currentOrder.status === 2 ||
              currentOrder.status === 3 ||
              currentOrder.status === "Completed" ||
              currentOrder.status === "Processing")
          ) {
            setIsSuccess(true);
            clearInterval(interval);
            onPaymentSuccess?.();
          }
        }
      } catch (err) {
        console.error("Lỗi polling trạng thái thanh toán:", err);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, orderId, isSuccess, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 text-center relative">
          <div className="inline-flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary-foreground mb-2">
            <QrCode className="size-5 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold">Quét Mã VietQR Thanh Toán</h3>
          <p className="text-xs text-slate-300">
            Gói dịch vụ: <span className="font-semibold text-white">{planName}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check className="size-8 stroke-[3]" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Thanh toán thành công!</h4>
              <p className="text-xs text-slate-600 max-w-xs">
                Hệ thống PayOS đã tự động xác nhận giao dịch #{orderCode}. Dịch vụ của bạn đang được khởi tạo.
              </p>
              <Button onClick={onClose} className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Hoàn tất
              </Button>
            </div>
          ) : (
            <>
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-indigo-200 shadow-sm relative group">
                  <img
                    src={qrImageUrl}
                    alt="VietQR PayOS"
                    className="w-52 h-52 object-contain rounded-lg"
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-indigo-600">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Tự động kích hoạt ngay khi nhận tiền</span>
                </div>
              </div>

              {/* Order payment details */}
              <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Số tiền thanh toán:</span>
                  <span className="font-bold text-base text-indigo-600">{formatVND(amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-semibold text-slate-800">#{orderCode}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/70">
                  <span className="text-slate-500">Nội dung chuyển khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded">
                      {description}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(description)}
                      className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                      title="Sao chép nội dung"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer CTA & Direct Checkout fallback */}
              <div className="space-y-2 pt-1">
                {checkoutUrl && (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-indigo-600 hover:underline py-1"
                  >
                    <span>Mở trang cổng thanh toán PayOS</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full text-xs h-9"
                >
                  Đóng / Thanh toán sau
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
