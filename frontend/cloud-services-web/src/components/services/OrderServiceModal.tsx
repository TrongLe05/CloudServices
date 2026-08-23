"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  Send,
  Loader2,
  X,
} from "lucide-react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaymentQrModal } from "./PaymentQrModal";

export interface OrderModalPlan {
  id: string;
  name: string;
  categoryName?: string;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  description?: string | null;
  prices?: {
    id: string;
    billingCycle: string;
    price: number;
    promotionDiscountPercentage?: number;
  }[];
}

interface OrderServiceModalProps {
  plan: OrderModalPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderServiceModal({ plan, isOpen, onClose }: OrderServiceModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoggedIn = status === "authenticated";

  const [billingCycle, setBillingCycle] = React.useState<string>("monthly");
  const [customerName, setCustomerName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showPaymentQr, setShowPaymentQr] = React.useState(false);
  const [paymentModalData, setPaymentModalData] = React.useState<{
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
  } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setBillingCycle("monthly");
      setCustomerName(session?.user?.name || "");
      setEmail(session?.user?.email || "");
      setPhone("");
      setCompanyName("");
    }
  }, [isOpen, plan, session]);

  if (!isOpen || !plan) return null;

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const selectedPriceObj = plan.prices?.find((p) => p.billingCycle === billingCycle);
  const rawPrice = selectedPriceObj?.price ?? 0;
  const discount = selectedPriceObj?.promotionDiscountPercentage ?? 0;
  const finalPrice = discount > 0 ? Math.round(rawPrice * (1 - discount / 100)) : rawPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !email.trim() || !phone.trim()) {
      toast.add({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập họ tên, email và số điện thoại liên hệ.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicePlanId: plan.id,
          billingCycle,
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          companyName: companyName.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gửi yêu cầu thất bại");
      }

      const resData = await res.json().catch(() => ({}));
      const orderId = resData?.id || resData?.Id || `order-${Date.now()}`;

      // 💳 Gọi API tạo PayOS Payment Link & QR Code
      try {
        const payRes = await fetch("/api/payments/create-payos-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            returnUrl: `${window.location.origin}/don-hang?status=success`,
            cancelUrl: `${window.location.origin}/don-hang?status=cancelled`,
          }),
        });

        if (payRes.ok) {
          const payData = await payRes.json();
          setPaymentModalData({
            orderId: orderId,
            planName: plan.name,
            amount: finalPrice,
            orderCode: payData.orderCode,
            qrCodeString: payData.qrCode,
            vietQrUrl: payData.vietQrUrl,
            accountNumber: payData.accountNumber,
            accountName: payData.accountName,
            bin: payData.bin,
            checkoutUrl: payData.checkoutUrl,
            description: `DH${payData.orderCode % 1000000}`,
            createdAt: new Date().toISOString(),
          });
          setShowPaymentQr(true);
          return;
        }
      } catch (payErr) {
        console.error("Không thể tạo QR PayOS:", payErr);
      }

      setIsSuccess(true);
      toast.add({
        title: "Gửi yêu cầu thành công!",
        description: "Chuyên viên tư vấn của CloudServices sẽ liên hệ với bạn trong thời gian sớm nhất.",
        type: "success",
      });
    } catch (error: any) {
      toast.add({
        title: "Lỗi gửi yêu cầu",
        description: error.message || "Không thể kết nối đến máy chủ.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 rounded-xl text-primary-foreground">
              <Server className="size-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Đăng ký tư vấn & Đặt dịch vụ</h3>
              <p className="text-xs text-slate-300">
                Gói: <span className="font-semibold text-white">{plan.name}</span>
                {plan.categoryName && ` (${plan.categoryName})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Yêu cầu đã được tiếp nhận!</h4>
                <p className="text-sm text-slate-600 max-w-sm">
                  Cảm ơn bạn <strong className="text-slate-900">{customerName}</strong>. Đội ngũ kỹ thuật & kinh doanh của CloudServices sẽ liên hệ lại qua số <strong>{phone}</strong> trong vòng 15 phút.
                </p>
              </div>
              <Button onClick={onClose} className="mt-4 px-8">
                Đóng
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Plan Specs Highlight */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Thông số cấu hình:</span>
                  <Badge variant="secondary" className="font-semibold">
                    {plan.name}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {plan.cpu && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px]">CPU</span>
                      <span className="font-semibold text-slate-800">{plan.cpu}</span>
                    </div>
                  )}
                  {plan.ram && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px]">RAM</span>
                      <span className="font-semibold text-slate-800">{plan.ram}</span>
                    </div>
                  )}
                  {plan.storage && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px]">SSD</span>
                      <span className="font-semibold text-slate-800">{plan.storage}</span>
                    </div>
                  )}
                  {plan.bandwidth && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px]">Băng thông</span>
                      <span className="font-semibold text-slate-800">{plan.bandwidth}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Cycle Picker */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Chu kỳ thanh toán dự kiến</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "monthly", label: "Hàng tháng (1 Tháng)" },
                    { id: "yearly", label: "Hàng năm (1 Năm)" },
                  ].map((cycle) => (
                    <button
                      key={cycle.id}
                      type="button"
                      onClick={() => setBillingCycle(cycle.id)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border transition-all ${
                        billingCycle === cycle.id
                          ? "border-primary bg-primary/5 text-primary shadow-xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cycle.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price estimation */}
              {rawPrice > 0 && (
                <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs">
                  <span className="text-slate-600 font-medium">Chi phí ước tính:</span>
                  <div className="text-right">
                    {discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 line-through">{formatVND(rawPrice)}</span>
                        <span className="text-sm font-bold text-primary">{formatVND(finalPrice)}</span>
                        <Badge variant="default" className="text-[10px] bg-red-500">-{discount}%</Badge>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-slate-900">{formatVND(rawPrice)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Customer details fields */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerName" className="text-xs font-medium text-slate-700">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      placeholder="Nguyễn Văn A"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-slate-700">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                    Email nhận thông tin & hóa đơn <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-medium text-slate-700">
                    Tên công ty / Tổ chức (tùy chọn)
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Công ty TNHH Giải pháp Đám mây..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              {/* Guest Warning / Login CTA if not logged in */}
              {!isLoggedIn && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <p className="text-xs font-semibold">
                    🔒 Yêu cầu tài khoản: Bạn cần đăng nhập để hoàn tất đặt dịch vụ và quản lý gói sau khi kích hoạt.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg"
                    render={<Link href="/dang-nhap" />}
                  >
                    Đăng nhập ngay để tiếp tục
                  </Button>
                </div>
              )}

              {/* Submit buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isLoggedIn}
                  className="flex-1 bg-primary text-white font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      {isLoggedIn ? "Thanh toán VietQR ngay" : "Vui lòng đăng nhập"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* PayOS VietQR Payment Modal */}
      {paymentModalData && (
        <PaymentQrModal
          isOpen={showPaymentQr}
          onClose={() => {
            setShowPaymentQr(false);
            onClose();
          }}
          orderId={paymentModalData.orderId}
          planName={paymentModalData.planName}
          amount={paymentModalData.amount}
          orderCode={paymentModalData.orderCode}
          qrCodeString={paymentModalData.qrCodeString}
          vietQrUrl={paymentModalData.vietQrUrl}
          accountNumber={paymentModalData.accountNumber}
          accountName={paymentModalData.accountName}
          bin={paymentModalData.bin}
          checkoutUrl={paymentModalData.checkoutUrl}
          description={paymentModalData.description}
          createdAt={paymentModalData.createdAt}
          onPaymentSuccess={() => {
            toast.add({
              title: "Thanh toán thành công!",
              description: "Hệ thống đã nhận thanh toán và đang kích hoạt dịch vụ.",
              type: "success",
            });
            setTimeout(() => {
              setShowPaymentQr(false);
              onClose();
              router.push("/don-hang");
            }, 1500);
          }}
        />
      )}
    </div>
  );
}
