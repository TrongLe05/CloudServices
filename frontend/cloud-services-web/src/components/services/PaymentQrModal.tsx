"use client";

import * as React from "react";
import {
  Copy,
  Check,
  Loader2,
  QrCode,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Smartphone,
  CreditCard,
  Building,
  CheckCircle2,
  RefreshCw,
  X,
  Info,
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
  createdAt?: string;
  onPaymentSuccess?: () => void;
  onPaymentExpired?: () => void;
}

const BANK_NAMES: Record<string, string> = {
  "970422": "MBBank (Quân Đội)",
  "970415": "VietinBank (Công Thương)",
  "970436": "Vietcombank (Ngoại Thương)",
  "970407": "Techcombank",
  "970418": "BIDV (Đầu Tư & Phát Triển)",
  "970423": "TPBank (Tiên Phong)",
  "970432": "VPBank (Việt Nam Thịnh Vượng)",
  "970454": "VietCapitalBank (Bản Việt)",
  "970416": "ACB (Á Châu)",
  "970441": "VIB (Quốc Tế)",
  "970403": "Sacombank (Sài Gòn Thương Tín)",
  "970405": "Agribank (Nông Nghiệp)",
  "970448": "OCB (Phương Đông)",
  "970443": "SHB (Sài Gòn - Hà Nội)",
  "970437": "HDBank (Phát Triển TP.HCM)",
  "970428": "Nam A Bank (Nam Á)",
  "970452": "Kienlongbank (Kiên Long)",
  "970449": "LPBank (Bưu Điện Liên Việt)",
  "970438": "BaoVietBank (Bảo Việt)",
  "970431": "Eximbank (Xuất Nhập Khẩu)",
  "970429": "SCB (Sài Gòn)",
  "970426": "MSB (Hàng Hải)",
  "970406": "DongABank (Đông Á)",
  "970440": "SeABank (Đông Nam Á)",
  "970425": "ABBANK (An Bình)",
  "970427": "VietABank (Việt Á)",
  "970433": "VietBank (Việt Nam Thương Tín)",
  "970430": "PGBank (Xăng Dầu Petrolimex)",
};

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
  createdAt,
  onPaymentSuccess,
  onPaymentExpired,
}: PaymentQrModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isExpired, setIsExpired] = React.useState(false);
  const [isCheckingManual, setIsCheckingManual] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"qr" | "manual">("qr");

  // Chuẩn hóa chuỗi thời gian từ server về UTC timestamp (tránh lệch múi giờ local GMT+7)
  const parseDateToMs = (dateStr: string) => {
    if (!dateStr) return Date.now();
    const trimmed = dateStr.trim();
    const hasTimezone = trimmed.endsWith("Z") || /[+-]\d{2}(:\d{2})?$/.test(trimmed);
    const normalizedStr = hasTimezone ? trimmed : `${trimmed}Z`;
    const parsedTime = new Date(normalizedStr).getTime();
    return isNaN(parsedTime) ? new Date(trimmed).getTime() : parsedTime;
  };

  // Tính số giây còn lại đồng bộ theo thời điểm tạo đơn gốc
  const calculateRemaining = React.useCallback(() => {
    if (!createdAt) return 300;
    const createdTime = parseDateToMs(createdAt);
    const expiryTime = createdTime + 5 * 60 * 1000;
    const diff = Math.floor((expiryTime - Date.now()) / 1000);
    return Math.max(0, diff);
  }, [createdAt]);

  const [timeLeft, setTimeLeft] = React.useState<number>(300);

  // Ảnh VietQR chất lượng cao kèm logo ngân hàng
  const qrImageDisplayUrl =
    vietQrUrl ||
    (bin && accountNumber
      ? `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
          description
        )}&accountName=${encodeURIComponent(accountName || "")}`
      : `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
          qrCodeString
        )}`);

  const bankDisplayName = (bin && BANK_NAMES[bin]) || "Ngân hàng liên kết Napas 24/7";

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

  // ⏱️ Bộ đếm ngược đồng bộ: Lấy số giây còn lại thực tế của đơn hàng
  React.useEffect(() => {
    if (!isOpen || isSuccess || isExpired) return;

    const initialRemaining = calculateRemaining();
    if (initialRemaining <= 0) {
      handleExpireOrder();
      return;
    }
    setTimeLeft(initialRemaining);

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        handleExpireOrder();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSuccess, isExpired, calculateRemaining]);

  const handleExpireOrder = async () => {
    setIsExpired(true);
    try {
      await fetch(`/api/order-requests/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 3 }),
      });
      onPaymentExpired?.();
    } catch (error) {
      console.error("Lỗi cập nhật hết hạn đơn hàng:", error);
    }
  };

  // 🔄 Dual-Polling: Kiểm tra trạng thái thanh toán tự động mỗi 2.5s
  React.useEffect(() => {
    if (!isOpen || !orderCode || isSuccess || isExpired) return;

    let isMounted = true;

    const checkStatus = async () => {
      try {
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

        const orderRes = await fetch(`/api/order-requests`, {
          cache: "no-store",
        });
        if (orderRes.ok && isMounted) {
          const data = await orderRes.json();
          const orders = data.items || data || [];
          const currentOrder = orders.find((o: any) => (o.id || o.Id) === orderId);

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

  // Kiểm tra thủ công ngay lập tức khi người dùng bấm nút
  const handleManualCheck = async () => {
    setIsCheckingManual(true);
    try {
      const payRes = await fetch(`/api/payments/status/${orderCode}`, {
        cache: "no-store",
      });
      if (payRes.ok) {
        const payData = await payRes.json();
        if (payData.isPaid || payData.status === "PAID") {
          setIsSuccess(true);
          onPaymentSuccess?.();
          return;
        }
      }
    } catch {
      // Ignore
    } finally {
      setTimeout(() => setIsCheckingManual(false), 800);
    }
  };

  if (!isOpen) return null;

  // Tính phần trăm thời gian còn lại cho thanh tiến trình (0 - 100%)
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 300) * 100));
  const isUrgent = timeLeft < 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white text-slate-900 border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Progress Bar đếm ngược trên cùng */}
        {!isSuccess && !isExpired && (
          <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                isUrgent ? "bg-rose-500" : "bg-primary"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Header hiện đại */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-inner">
              <QrCode className="size-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  Thanh Toán VietQR
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Napas 24/7
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate max-w-[260px] sm:max-w-xs">
                {planName} • <span className="font-mono text-indigo-200">#{orderCode % 1000000}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Đóng cửa sổ"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            /* 1. Màn hình thanh toán thành công */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-20 rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-500/10 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="size-11 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  Thanh toán thành công!
                </h4>
                <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="size-4" />
                  Giao dịch đã được ghi nhận vào hệ thống
                </p>
              </div>

              <div className="w-full max-w-sm p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gói dịch vụ:</span>
                  <span className="font-bold text-slate-900">{planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-slate-900">#{orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    {formatVND(amount)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Trạng thái:</span>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] font-bold">
                    Đang kích hoạt hạ tầng
                  </Badge>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full max-w-sm h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/25"
              >
                Xem tiến độ trong Lịch sử đơn hàng
              </Button>
            </div>
          ) : isExpired ? (
            /* 2. Màn hình hết hạn 5 phút */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-20 rounded-full bg-rose-50 text-rose-600 border-4 border-rose-100 flex items-center justify-center shadow-xl shadow-rose-500/10 animate-in zoom-in-50 duration-300">
                <XCircle className="size-11 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  Mã thanh toán đã hết hạn
                </h4>
                <p className="text-xs text-rose-600 font-semibold">
                  Thời hạn 5 phút cho giao dịch #{orderCode} đã kết thúc
                </p>
              </div>

              <div className="w-full max-w-sm p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-slate-600 space-y-2 text-left">
                <p className="leading-relaxed">
                  Để đảm bảo an toàn tỷ giá và giữ chỗ hạ tầng đám mây, mã VietQR này đã tự động đóng. Đơn hàng đã chuyển sang trạng thái <strong>Từ chối</strong>.
                </p>
                <p className="font-medium text-slate-700">
                  Quý khách có thể truy cập danh mục dịch vụ để tạo lại đơn mới bất kỳ lúc nào.
                </p>
              </div>

              <Button
                onClick={onClose}
                className="w-full max-w-sm h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md"
              >
                Đóng và Đặt lại gói dịch vụ
              </Button>
            </div>
          ) : (
            /* 3. Màn hình hiển thị QR Code & Thông tin chuyển khoản */
            <>
              {/* Banner đếm ngược & Giá tiền */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Số tiền cần thanh toán
                  </span>
                  <span className="text-2xl font-black text-primary tracking-tight">
                    {formatVND(amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${
                      isUrgent
                        ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                        : "bg-white border-amber-200 text-amber-900"
                    }`}
                  >
                    <Clock className={`size-4 ${isUrgent ? "text-rose-600" : "text-amber-600"}`} />
                    <span>Hết hạn sau:</span>
                    <span className="font-mono text-sm font-black tracking-wider">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab chuyển đổi: Quét QR vs Chuyển khoản thủ công */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("qr")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "qr"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <QrCode className="size-3.5" />
                  <span>Quét mã VietQR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "manual"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <CreditCard className="size-3.5" />
                  <span>Thông tin chuyển khoản</span>
                </button>
              </div>

              {activeTab === "qr" ? (
                /* Tab 1: Mã QR VietQR nổi bật */
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-50/80 to-white rounded-3xl border border-slate-200 shadow-xs relative">
                    {/* Frame QR */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-md relative group hover:border-primary transition-all">
                      <img
                        src={qrImageDisplayUrl}
                        alt="VietQR PayOS"
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                      />
                    </div>

                    {/* Live listener indicator */}
                    <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold shadow-2xs">
                      <span className="relative flex size-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                      </span>
                      <span>Hệ thống tự động kích hoạt ngay khi nhận tiền</span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 text-center flex items-center gap-1">
                      <Smartphone className="size-3 text-slate-400" />
                      Mở App Banking bất kỳ hoặc MoMo, ZaloPay để quét mã
                    </p>
                  </div>
                </div>
              ) : (
                /* Tab 2: Thông tin chuyển khoản thủ công chi tiết */
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3 text-xs">
                    {/* Ngân hàng */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Building className="size-3.5 text-slate-400" />
                        Ngân hàng:
                      </span>
                      <span className="font-bold text-slate-900 text-right">{bankDisplayName}</span>
                    </div>

                    {/* Số tài khoản */}
                    {accountNumber && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <CreditCard className="size-3.5 text-slate-400" />
                          Số tài khoản:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-slate-900">
                            {accountNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(accountNumber, "acc")}
                            className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-2xs transition-colors"
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

                    {/* Chủ tài khoản */}
                    {accountName && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                        <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
                        <span className="font-bold text-slate-900 uppercase text-[11px]">
                          {accountName}
                        </span>
                      </div>
                    )}

                    {/* Số tiền */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                      <span className="text-slate-500 font-medium">Số tiền chính xác:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-primary text-sm">
                          {formatVND(amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(amount.toString(), "amount")}
                          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-2xs transition-colors"
                          title="Sao chép số tiền"
                        >
                          {copiedField === "amount" ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Nội dung chuyển khoản (QUAN TRỌNG NHẤT) */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-amber-800 font-bold flex items-center gap-1 text-[11px]">
                          <AlertCircle className="size-3.5 text-amber-600" />
                          Nội dung chuyển khoản (Bắt buộc):
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="font-mono font-black text-amber-950 text-sm tracking-wider">
                          {description}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(description, "desc")}
                          className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                        >
                          {copiedField === "desc" ? (
                            <>
                              <Check className="size-3 text-emerald-600" />
                              <span className="text-emerald-600">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3 text-amber-700" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
                    <Info className="size-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Quý khách vui lòng nhập <strong>chính xác nội dung chuyển khoản</strong> để hệ thống tự động ghi nhận đơn hàng sau 1-3 giây.
                    </p>
                  </div>
                </div>
              )}

              {/* Nút hành động ở Footer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleManualCheck}
                    disabled={isCheckingManual}
                    className="h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`size-3.5 ${isCheckingManual ? "animate-spin" : ""}`} />
                    {isCheckingManual ? "Đang kiểm tra..." : "Tôi đã chuyển tiền"}
                  </Button>

                  {checkoutUrl ? (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 inline-flex items-center justify-center gap-1.5 text-xs bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <span>Cổng PayOS</span>
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="h-10 text-xs font-semibold rounded-xl text-slate-600"
                    >
                      Đóng
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>Bảo mật chuẩn PCI-DSS bởi Napas & Cổng PayOS</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
