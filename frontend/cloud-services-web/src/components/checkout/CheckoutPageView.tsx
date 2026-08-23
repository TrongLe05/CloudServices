"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  Check,
  CheckCircle2,
  Copy,
  Clock,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  XCircle,
  CreditCard,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/toast";
import { slugify } from "@/lib/slugUtils";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ServicePlanPrice {
  id: string;
  billingCycle: string;
  price: number;
  promotionDiscountPercentage?: number;
}

export interface ServicePlan {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  categoryName?: string;
  categorySlug?: string;
  prices?: ServicePlanPrice[];
}

interface CheckoutPageViewProps {
  categories: ServiceCategory[];
  plans: ServicePlan[];
  initialPlanId?: string;
  initialCycle?: string;
}

export function CheckoutPageView({
  categories,
  plans,
  initialPlanId,
  initialCycle,
}: CheckoutPageViewProps) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected plan state
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>(
    initialPlanId || searchParams.get("planId") || plans[0]?.id || ""
  );

  // Billing cycle state
  const [billingCycle, setBillingCycle] = React.useState<string>(
    initialCycle || searchParams.get("cycle") || "monthly"
  );

  // Form states
  const [customerName, setCustomerName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isChangingPlan, setIsChangingPlan] = React.useState(false);

  // Submission & Inline Payment states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderCreatedData, setOrderCreatedData] = React.useState<{
    orderId: string;
    orderCode: number;
    amount: number;
    qrCodeString: string;
    vietQrUrl?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
    bin?: string | null;
    checkoutUrl?: string;
    description: string;
  } | null>(null);

  // Payment live states
  const [isPaymentSuccess, setIsPaymentSuccess] = React.useState(false);
  const [isPaymentExpired, setIsPaymentExpired] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutes
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // Auto-fill customer info when session is available
  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name && !customerName) setCustomerName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
  }, [session]);

  // Current selected plan object
  const currentPlan = React.useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  // Calculate pricing
  const currentPriceObj = React.useMemo(() => {
    return currentPlan?.prices?.find((p) => p.billingCycle.toLowerCase() === billingCycle.toLowerCase()) || currentPlan?.prices?.[0];
  }, [currentPlan, billingCycle]);

  const rawPrice = currentPriceObj?.price ?? 0;
  const discount = currentPriceObj?.promotionDiscountPercentage ?? 0;
  const finalPrice = discount > 0 ? Math.round(rawPrice * (1 - discount / 100)) : rawPrice;

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

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ⏱️ Countdown Timer for Inline VietQR
  React.useEffect(() => {
    if (!orderCreatedData || isPaymentSuccess || isPaymentExpired) return;

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
  }, [orderCreatedData, isPaymentSuccess, isPaymentExpired]);

  const handleExpireOrder = async () => {
    if (!orderCreatedData) return;
    setIsPaymentExpired(true);
    try {
      await fetch(`/api/order-requests/${orderCreatedData.orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 3 }), // 3 = Rejected
      });
    } catch (err) {
      console.error("Lỗi cập nhật hết hạn đơn:", err);
    }
  };

  // 🔄 Dual-Polling: Check payment status every 2.5s
  React.useEffect(() => {
    if (!orderCreatedData || isPaymentSuccess || isPaymentExpired) return;

    let isMounted = true;

    const checkStatus = async () => {
      try {
        // Check PayOS status
        const payRes = await fetch(`/api/payments/status/${orderCreatedData.orderCode}`, {
          cache: "no-store",
        });

        if (payRes.ok && isMounted) {
          const payData = await payRes.json();
          if (payData.isPaid || payData.status === "PAID") {
            setIsPaymentSuccess(true);
            toast.add({
              title: "Thanh toán thành công!",
              description: "Hệ thống đã nhận thanh toán và đang tiến hành kích hoạt dịch vụ.",
              type: "success",
            });
            return;
          }
        }

        // Check database status
        const orderRes = await fetch(`/api/order-requests`, {
          cache: "no-store",
        });
        if (orderRes.ok && isMounted) {
          const data = await orderRes.json();
          const orders = data.items || data || [];
          const cur = orders.find((o: any) => (o.id || o.Id) === orderCreatedData.orderId);

          if (
            cur &&
            (cur.status === 1 || cur.status === "Processing" || cur.status === 2 || cur.status === "Completed")
          ) {
            setIsPaymentSuccess(true);
            toast.add({
              title: "Thanh toán thành công!",
              description: "Hệ thống đã nhận thanh toán và đang tiến hành kích hoạt dịch vụ.",
              type: "success",
            });
          } else if (cur && (cur.status === 3 || cur.status === "Rejected")) {
            setIsPaymentExpired(true);
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
  }, [orderCreatedData, isPaymentSuccess, isPaymentExpired]);

  // Handle Order Submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !email.trim() || !phone.trim()) {
      toast.add({
        title: "Thiếu thông tin bắt buộc",
        description: "Vui lòng nhập họ tên, email và số điện thoại liên hệ.",
        type: "error",
      });
      return;
    }

    if (!currentPlan) {
      toast.add({
        title: "Chưa chọn gói dịch vụ",
        description: "Vui lòng chọn một gói dịch vụ để tiếp tục.",
        type: "error",
      });
      return;
    }

    if (finalPrice <= 0 || rawPrice <= 0) {
      toast.add({
        title: "Dịch vụ yêu cầu báo giá riêng",
        description: "Gói dịch vụ này yêu cầu báo giá tùy biến. Đang chuyển hướng bạn đến trang liên hệ...",
        type: "info",
      });
      router.push(`/lien-he?service=${encodeURIComponent(currentPlan.name)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Tạo yêu cầu đặt dịch vụ
      const res = await fetch("/api/order-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicePlanId: currentPlan.id,
          billingCycle,
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          companyName: companyName.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gửi yêu cầu đặt hàng thất bại");
      }

      const resData = await res.json().catch(() => ({}));
      const orderId = resData?.id || resData?.Id || `order-${Date.now()}`;

      // 2. Tạo link thanh toán PayOS & mã VietQR
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
        setOrderCreatedData({
          orderId: orderId,
          orderCode: payData.orderCode,
          amount: finalPrice,
          qrCodeString: payData.qrCode,
          vietQrUrl: payData.vietQrUrl,
          accountNumber: payData.accountNumber,
          accountName: payData.accountName,
          bin: payData.bin,
          checkoutUrl: payData.checkoutUrl,
          description: `DH${payData.orderCode % 1000000}`,
        });

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.add({
          title: "Đặt dịch vụ thành công",
          description: "Yêu cầu của bạn đã được tiếp nhận. Nhân viên sẽ liên hệ trong ít phút.",
          type: "success",
        });
        router.push("/don-hang");
      }
    } catch (error: any) {
      toast.add({
        title: "Lỗi thực hiện",
        description: error.message || "Không thể kết nối đến máy chủ.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const qrImageDisplayUrl =
    orderCreatedData?.vietQrUrl ||
    (orderCreatedData?.bin && orderCreatedData?.accountNumber
      ? `https://img.vietqr.io/image/${orderCreatedData.bin}-${orderCreatedData.accountNumber}-compact2.png?amount=${orderCreatedData.amount}&addInfo=${encodeURIComponent(
          orderCreatedData.description
        )}&accountName=${encodeURIComponent(orderCreatedData.accountName || "")}`
      : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          orderCreatedData?.qrCodeString || ""
        )}`);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white pt-10 pb-12 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-4">
          <Breadcrumb className="text-slate-400 text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/dich-vu" />}>Dịch vụ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Đặt hàng & Thanh toán</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {orderCreatedData ? "Thanh Toán Đơn Hàng" : "Hoàn Tất Đặt Dịch Vụ"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {orderCreatedData
                  ? `Mã giao dịch: #${orderCreatedData.orderCode} • Quét mã VietQR để kích hoạt máy chủ tức thì`
                  : "Điền thông tin và xác nhận cấu hình dịch vụ đám mây của bạn"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 py-1.5 px-3">
                <ShieldCheck className="size-3.5 mr-1.5 text-indigo-400" />
                Bảo mật SSL 256-bit
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 py-1.5 px-3">
                <Zap className="size-3.5 mr-1.5 text-emerald-400" />
                Kích hoạt tự động
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-6">
        {orderCreatedData ? (
          /* ========================================================================= */
          /* 💳 MÀN HÌNH THANH TOÁN VIETQR INLINE (KHÔNG POP-UP)                       */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            {/* Left: VietQR Code Box */}
            <Card className="lg:col-span-7 bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <CreditCard className="size-5 text-indigo-400" />
                      Cổng Thanh Toán VietQR Tự Động
                    </CardTitle>
                    <CardDescription className="text-indigo-200/80 text-xs">
                      Mở app ngân hàng bất kỳ để quét mã và chuyển khoản đúng số tiền
                    </CardDescription>
                  </div>

                  {!isPaymentSuccess && !isPaymentExpired && (
                    <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-400/40 text-rose-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                      <Clock className="size-3.5 animate-pulse text-rose-400" />
                      {formatTimer(timeLeft)}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                {isPaymentSuccess ? (
                  /* Thanh toán thành công */
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
                    <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                      <Check className="size-10 stroke-[3]" />
                    </div>
                    <div className="space-y-1 max-w-md">
                      <h3 className="text-2xl font-extrabold text-slate-900">Thanh toán thành công!</h3>
                      <p className="text-xs text-slate-600">
                        Hệ thống đã ghi nhận khoản thanh toán <strong className="text-emerald-700">{formatVND(orderCreatedData.amount)}</strong>. Đơn hàng đang được kỹ thuật viên tiếp nhận và cấu hình hạ tầng cho bạn.
                      </p>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                      <Button
                        onClick={() => router.push("/don-hang")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl"
                      >
                        Xem lịch sử đơn hàng
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOrderCreatedData(null);
                          setIsPaymentSuccess(false);
                        }}
                        className="flex-1 h-11 rounded-xl"
                      >
                        Đặt thêm gói khác
                      </Button>
                    </div>
                  </div>
                ) : isPaymentExpired ? (
                  /* Giao dịch hết hạn */
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
                    <div className="size-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <XCircle className="size-10 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1 max-w-md">
                      <h3 className="text-2xl font-extrabold text-slate-900">Mã thanh toán đã hết hạn</h3>
                      <p className="text-xs text-slate-600">
                        Thời gian 5 phút cho mã đơn #{orderCreatedData.orderCode} đã kết thúc. Đơn hàng đã được tự động hủy để đảm bảo an toàn.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setOrderCreatedData(null);
                        setIsPaymentExpired(false);
                      }}
                      className="mt-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl"
                    >
                      Tạo lại đơn hàng mới
                    </Button>
                  </div>
                ) : (
                  /* Đang chờ quét mã QR */
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
                      {/* QR Frame */}
                      <div className="p-3 bg-white rounded-3xl border-2 border-dashed border-indigo-300 shadow-lg relative group">
                        <img
                          src={qrImageDisplayUrl}
                          alt="VietQR PayOS"
                          className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-2xl"
                        />
                      </div>

                      {/* Instructions */}
                      <div className="space-y-4 text-xs text-slate-600 max-w-xs">
                        <div className="flex items-start gap-3">
                          <span className="size-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
                          <p>Mở ứng dụng <strong>Ngân hàng</strong> hoặc <strong>Ví điện tử</strong> trên điện thoại.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="size-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
                          <p>Chọn chức năng <strong>Quét mã QR</strong> và căn chỉnh vào mã bên cạnh.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="size-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">3</span>
                          <p>Kiểm tra số tiền và nội dung chuyển khoản, sau đó <strong>Xác nhận thanh toán</strong>.</p>
                        </div>

                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-indigo-600 shrink-0" />
                          <span>Hệ thống tự động nhận diện và kích hoạt sau khi chuyển tiền thành công.</span>
                        </div>
                      </div>
                    </div>

                    {/* Bank Account Info Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                      {orderCreatedData.accountNumber && (
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
                          <span className="text-slate-500 font-medium">Số tài khoản:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900">{orderCreatedData.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(orderCreatedData.accountNumber!, "acc")}
                              className="p-1 text-slate-400 hover:text-slate-900 rounded"
                            >
                              {copiedField === "acc" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {orderCreatedData.accountName && (
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
                          <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
                          <span className="font-semibold text-slate-900 uppercase text-[11px]">{orderCreatedData.accountName}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-slate-500 font-medium">Số tiền:</span>
                        <span className="font-extrabold text-sm text-indigo-600">{formatVND(orderCreatedData.amount)}</span>
                      </div>

                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-slate-500 font-medium">Nội dung CK:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {orderCreatedData.description}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(orderCreatedData.description, "desc")}
                            className="p-1 text-slate-400 hover:text-slate-900 rounded"
                          >
                            {copiedField === "desc" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOrderCreatedData(null)}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="size-3.5 mr-1.5" />
                  Quay lại chỉnh sửa đơn hàng
                </Button>

                {orderCreatedData.checkoutUrl && (
                  <a
                    href={orderCreatedData.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                  >
                    <span>Mở trang thanh toán PayOS trực tiếp</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </CardFooter>
            </Card>

            {/* Right: Order Details Summary */}
            <Card className="lg:col-span-5 bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden sticky top-24">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">Chi Tiết Đơn Hàng #{orderCreatedData.orderCode}</CardTitle>
                <CardDescription className="text-xs text-slate-500">Dịch vụ đám mây doanh nghiệp</CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Gói dịch vụ:</span>
                  <span className="font-bold text-slate-900 text-sm">{currentPlan?.name}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Danh mục:</span>
                  <span className="font-semibold text-slate-700">{currentPlan?.categoryName}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Chu kỳ:</span>
                  <span className="font-semibold text-slate-700">
                    {billingCycle === "yearly" ? "Hàng năm (1 Năm)" : "Hàng tháng (1 Tháng)"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Người đặt:</span>
                  <span className="font-semibold text-slate-700">{customerName}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-slate-700">{email}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-900 font-bold text-sm">Tổng cộng:</span>
                  <span className="text-xl font-extrabold text-indigo-600">{formatVND(orderCreatedData.amount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ========================================================================= */
          /* 📝 FORM ĐẶT HÀNG TRỰC TIẾP (FULL PAGE CHECKOUT)                          */
          /* ========================================================================= */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Bước 1: Chọn gói dịch vụ */}
              <Card className="bg-white shadow-md rounded-3xl border border-slate-200 overflow-hidden">
                <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">Gói Dịch Vụ Đã Chọn</CardTitle>
                      <CardDescription className="text-xs text-slate-500">Cấu hình máy chủ đám mây</CardDescription>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPlan(!isChangingPlan)}
                    className="text-xs rounded-xl h-8"
                  >
                    {isChangingPlan ? "Đóng danh sách" : "Đổi gói khác"}
                  </Button>
                </CardHeader>

                <CardContent className="p-6">
                  {isChangingPlan ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                        {plans.map((p) => {
                          const isSelected = p.id === currentPlan?.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedPlanId(p.id);
                                setIsChangingPlan(false);
                              }}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-xs"
                                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                                <Badge variant="secondary" className="text-[10px]">
                                  {p.categoryName}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{p.description}</p>
                              <div className="mt-2 text-[10px] text-slate-600 font-medium">
                                {[p.cpu, p.ram, p.storage].filter(Boolean).join(" • ")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-900">{currentPlan?.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {currentPlan?.categoryName || "Dịch vụ"}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{currentPlan?.description}</p>
                        <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                          {currentPlan?.cpu && (
                            <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                              CPU: <strong>{currentPlan.cpu}</strong>
                            </span>
                          )}
                          {currentPlan?.ram && (
                            <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                              RAM: <strong>{currentPlan.ram}</strong>
                            </span>
                          )}
                          {currentPlan?.storage && (
                            <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                              NVMe: <strong>{currentPlan.storage}</strong>
                            </span>
                          )}
                          {currentPlan?.bandwidth && (
                            <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                              Mạng: <strong>{currentPlan.bandwidth}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bước 2: Chọn chu kỳ thanh toán */}
              <Card className="bg-white shadow-md rounded-3xl border border-slate-200 overflow-hidden">
                <CardHeader className="p-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">Chọn Chu Kỳ Thanh Toán</CardTitle>
                      <CardDescription className="text-xs text-slate-500">Tiết kiệm nhiều hơn với chu kỳ dài hạn</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "monthly", label: "Hàng tháng (1 Tháng)", desc: "Linh hoạt, gia hạn định kỳ từng tháng", badge: null },
                      { id: "yearly", label: "Hàng năm (1 Năm)", desc: "Tiết kiệm chi phí, ưu đãi thanh toán dài hạn", badge: "Tiết kiệm 20%" },
                    ].map((cycle) => {
                      const isSelected = billingCycle === cycle.id;
                      return (
                        <div
                          key={cycle.id}
                          onClick={() => setBillingCycle(cycle.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {cycle.badge && (
                            <span className="absolute -top-2.5 right-4 bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                              {cycle.badge}
                            </span>
                          )}
                          <div className="space-y-1">
                            <span className="font-bold text-slate-900 text-sm block">{cycle.label}</span>
                            <span className="text-xs text-slate-500 block">
                              {cycle.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Bước 3: Thông tin khách hàng */}
              <Card className="bg-white shadow-md rounded-3xl border border-slate-200 overflow-hidden">
                <CardHeader className="p-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">Thông Tin Liên Hệ & Kích Hoạt</CardTitle>
                      <CardDescription className="text-xs text-slate-500">Thông tin nhận bàn giao máy chủ và hóa đơn</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="customerName" className="text-xs font-semibold text-slate-700">
                        Họ và tên khách hàng <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id="customerName"
                          placeholder="Nguyễn Văn A"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="pl-9 text-xs h-10 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id="phone"
                          placeholder="0912 345 678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-9 text-xs h-10 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                        Email nhận tài khoản & hóa đơn <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="nguyenvana@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 text-xs h-10 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="companyName" className="text-xs font-semibold text-slate-700">
                        Tên công ty / Tổ chức (tùy chọn)
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id="companyName"
                          placeholder="Công ty TNHH Công nghệ..."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="pl-9 text-xs h-10 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-semibold text-slate-700">
                      Ghi chú cấu hình hoặc yêu cầu đặc biệt (tùy chọn)
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 size-4 text-slate-400" />
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Ví dụ: Cài đặt hệ điều hành Ubuntu 22.04 LTS, mở cổng 80/443..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  {authStatus !== "authenticated" && (
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                      <Info className="size-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-indigo-900">
                        <p className="font-semibold">Bạn đã có tài khoản CloudServices?</p>
                        <p className="text-indigo-700 mt-0.5">
                          <Link href="/dang-nhap" className="font-bold underline hover:text-indigo-900">Đăng nhập</Link> để tự động đồng bộ đơn hàng vào bảng điều khiển quản lý máy chủ của bạn.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary & Checkout Card */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <Card className="bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Tóm Tắt Đơn Hàng</span>
                    <Badge variant="outline" className="border-indigo-400/40 text-indigo-300 text-[10px]">
                      {billingCycle === "yearly" ? "Theo năm" : "Theo tháng"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-1">
                    Gói: <strong className="text-white">{currentPlan?.name}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="space-y-2.5 pb-4 border-b border-slate-100">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Đơn giá niêm yết:</span>
                      <span className="font-semibold text-slate-800">{rawPrice > 0 ? formatVND(rawPrice) : "Liên hệ"}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-600 font-medium">
                        <span>Ưu đãi áp dụng (-{discount}%):</span>
                        <span>-{formatVND(rawPrice - finalPrice)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-600">
                      <span>Phí khởi tạo:</span>
                      <span className="text-emerald-600 font-bold">Miễn phí (0 đ)</span>
                    </div>
                  </div>

                  {/* Total amount */}
                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Tổng thanh toán:</span>
                      <span className="text-[11px] text-slate-400">Đã bao gồm thuế GTGT</span>
                    </div>
                    <span className="text-2xl font-extrabold text-primary tracking-tight">
                      {finalPrice > 0 ? formatVND(finalPrice) : "Báo giá riêng"}
                    </span>
                  </div>

                  {/* Guarantees */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Cam kết Uptime 99.99% bằng SLA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Hỗ trợ kỹ thuật 24/7/365</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Kích hoạt tự động sau khi thanh toán VietQR</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  {finalPrice > 0 ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20 text-sm gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Đang tạo đơn hàng...
                        </>
                      ) : (
                        <>
                          Tiến hành thanh toán VietQR
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-3 w-full">
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium">
                        Gói dịch vụ này yêu cầu cấu hình tùy biến hoặc thỏa thuận hợp đồng riêng. Vui lòng gửi yêu cầu để nhận báo giá chi tiết từ chuyên viên.
                      </div>
                      <Button
                        type="button"
                        render={
                          <Link href={`/lien-he?service=${encodeURIComponent(currentPlan?.name || "")}`} />
                        }
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-2xl shadow-lg text-sm gap-2"
                      >
                        <Headphones className="size-4" />
                        Liên hệ nhận báo giá riêng
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
