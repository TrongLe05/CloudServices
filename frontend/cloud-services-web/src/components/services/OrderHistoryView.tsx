"use client";

import * as React from "react";
import Link from "next/link";
import {
  Server,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Building2,
  Mail,
  Phone,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  FileText,
  Filter,
  CreditCard,
  ShoppingBag,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { PaymentQrModal } from "./PaymentQrModal";

export interface UserOrder {
  id: string;
  servicePlanId: string;
  servicePlanName: string;
  billingCycle: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  status: number | string;
  createdAt: string;
  estimatedPrice?: number;
}

interface OrderHistoryViewProps {
  initialOrders: UserOrder[];
  userEmail?: string | null;
}

export function OrderHistoryView({
  initialOrders,
  userEmail,
}: OrderHistoryViewProps) {
  const [orders, setOrders] = React.useState<UserOrder[]>(initialOrders);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = React.useState<UserOrder | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [payingOrderId, setPayingOrderId] = React.useState<string | null>(null);
  const [showPaymentQr, setShowPaymentQr] = React.useState(false);
  const [now, setNow] = React.useState<number>(Date.now());
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
    createdAt: string;
  } | null>(null);

  // ⏱️ Live Ticking Clock (Cập nhật thời gian mỗi giây cho đồng hồ đếm ngược)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatVND = (value?: number | null) => {
    if (!value || value <= 0) return "Liên hệ báo giá";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Chuẩn hóa chuỗi thời gian từ server về UTC timestamp (tránh lệch múi giờ local GMT+7)
  const parseDateToMs = (dateStr: string) => {
    if (!dateStr) return Date.now();
    const trimmed = dateStr.trim();
    // Nếu chuỗi ISO chưa có 'Z' và không có offset (+/-), thêm 'Z' để browser hiểu đúng là UTC
    const hasTimezone = trimmed.endsWith("Z") || /[+-]\d{2}(:\d{2})?$/.test(trimmed);
    const normalizedStr = hasTimezone ? trimmed : `${trimmed}Z`;
    const parsedTime = new Date(normalizedStr).getTime();
    return isNaN(parsedTime) ? new Date(trimmed).getTime() : parsedTime;
  };

  // Tính số giây còn lại cho đơn hàng chờ thanh toán (Hạn 5 phút = 300 giây)
  const getRemainingSeconds = (createdAtStr: string) => {
    const createdTime = parseDateToMs(createdAtStr);
    const expiryTime = createdTime + 5 * 60 * 1000;
    const diff = Math.floor((expiryTime - now) / 1000);
    return Math.max(0, diff);
  };

  const formatRemainingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOpenPayOSQr = async (order: UserOrder) => {
    const remaining = getRemainingSeconds(order.createdAt);
    if (remaining <= 0) {
      toast.add({
        title: "Đơn hàng đã hết hạn",
        description: "Đơn hàng này đã quá hạn 5 phút. Vui lòng tạo đơn hàng mới.",
        type: "error",
      });
      return;
    }

    setPayingOrderId(order.id);
    try {
      const res = await fetch("/api/payments/create-payos-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          returnUrl: `${window.location.origin}/don-hang?status=success`,
          cancelUrl: `${window.location.origin}/don-hang?status=cancelled`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Không thể tạo mã thanh toán");
      }

      const payData = await res.json();
      setPaymentModalData({
        orderId: order.id,
        planName: order.servicePlanName,
        amount: order.estimatedPrice || 200000,
        orderCode: payData.orderCode,
        qrCodeString: payData.qrCode,
        vietQrUrl: payData.vietQrUrl,
        accountNumber: payData.accountNumber,
        accountName: payData.accountName,
        bin: payData.bin,
        checkoutUrl: payData.checkoutUrl,
        description: `DH${payData.orderCode % 1000000}`,
        createdAt: order.createdAt,
      });
      setShowPaymentQr(true);
    } catch (err: any) {
      toast.add({
        title: "Lỗi thanh toán",
        description: err.message || "Không thể tạo liên kết PayOS.",
        type: "error",
      });
    } finally {
      setPayingOrderId(null);
    }
  };

  // Dọn dẹp key my_cloud_orders cũ trong localStorage (nếu có) để tránh hiện đơn ảo
  React.useEffect(() => {
    try {
      localStorage.removeItem("my_cloud_orders");
    } catch {
      // Ignore
    }
  }, []);

  const refreshOrders = async () => {
    setIsRefreshing(true);
    try {
      const emailQuery = userEmail
        ? `&customerEmail=${encodeURIComponent(userEmail)}`
        : "";
      const res = await fetch(`/api/order-requests?pageSize=100${emailQuery}`);
      if (res.ok) {
        const data = await res.json();
        const items: UserOrder[] = data.items || data.Items || [];
        setOrders(items);
        toast.add({
          title: "Đã làm mới danh sách",
          description: "Thông tin các đơn dịch vụ đã được cập nhật mới nhất.",
          type: "success",
        });
      }
    } catch {
      toast.add({
        title: "Lỗi kết nối",
        description: "Không thể làm mới danh sách đơn hàng.",
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: number | string, createdAt?: string) => {
    const s = String(status);
    if (s === "0" || s === "New" || s === "Mới") {
      const remaining = createdAt ? getRemainingSeconds(createdAt) : 300;
      if (remaining > 0) {
        return (
          <Badge className="bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 text-xs font-semibold gap-1.5 py-1 px-2.5 shadow-2xs">
            <Timer className="size-3.5 text-amber-600 animate-pulse" />
            Chờ thanh toán ({formatRemainingTime(remaining)})
          </Badge>
        );
      }
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 text-xs font-semibold gap-1.5 py-1 px-2.5">
          <XCircle className="size-3.5 text-rose-500" />
          Hết hạn thanh toán
        </Badge>
      );
    }
    if (s === "1" || s === "Processing" || s === "Đang xử lý") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 text-xs font-semibold gap-1.5 py-1 px-2.5">
          <RotateCcw className="size-3.5 text-blue-500 animate-spin" />
          Đã thanh toán • Đang khởi tạo
        </Badge>
      );
    }
    if (s === "2" || s === "Completed" || s === "Hoàn thành") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs font-semibold gap-1.5 py-1 px-2.5">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          Đang hoạt động (Active)
        </Badge>
      );
    }
    if (s === "3" || s === "Rejected" || s === "Từ chối") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 text-xs font-semibold gap-1.5 py-1 px-2.5">
          <XCircle className="size-3.5 text-rose-500" />
          Đã hủy / Từ chối
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs">
        {s}
      </Badge>
    );
  };

  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.servicePlanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.companyName &&
          o.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

      const s = String(o.status);
      let matchStatus = true;
      if (statusFilter === "NEW") matchStatus = s === "0" || s === "New";
      else if (statusFilter === "PROCESSING")
        matchStatus = s === "1" || s === "Processing";
      else if (statusFilter === "COMPLETED")
        matchStatus = s === "2" || s === "Completed";
      else if (statusFilter === "REJECTED")
        matchStatus = s === "3" || s === "Rejected";

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Statistics counts
  const totalCount = orders.length;
  const activeCount = orders.filter(
    (o) => String(o.status) === "2" || String(o.status) === "Completed",
  ).length;
  const pendingCount = orders.filter(
    (o) => {
      const s = String(o.status);
      if (s === "1" || s === "Processing") return true;
      if (s === "0" || s === "New") {
        return getRemainingSeconds(o.createdAt) > 0;
      }
      return false;
    },
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-900">
                  Lịch sử dịch vụ & Đơn hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 space-y-8">
        {/* 2. Header & Metrics Summary Cards */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="size-8 text-primary" />
              Quản Lý Dịch Vụ Đã Đặt
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Theo dõi tiến độ kích hoạt, thời gian hoàn thành thanh toán và thông tin các dịch
              vụ máy chủ đám mây của bạn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshOrders}
              disabled={isRefreshing}
              className="rounded-xl text-xs font-semibold"
            >
              <RefreshCw
                className={`size-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold shadow-xs"
              render={<Link href="/dich-vu" />}
            >
              + Đăng ký thêm dịch vụ
            </Button>
          </div>
        </div>

        {/* Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Tổng số yêu cầu
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">
                {totalCount}
              </span>
              <Badge variant="secondary" className="text-xs">
                Tất cả
              </Badge>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Dịch vụ đang hoạt động
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600">
                {activeCount}
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Active SLA
              </Badge>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Đang chờ thanh toán / Kích hoạt
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-600">
                {pendingCount}
              </span>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                Hạn 5 phút
              </Badge>
            </div>
          </div>
        </div>

        {/* 3. Filter & Orders List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            {/* Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {[
                { id: "ALL", label: "Tất cả" },
                { id: "NEW", label: "Chờ thanh toán" },
                { id: "PROCESSING", label: "Đang triển khai" },
                { id: "COMPLETED", label: "Đang chạy" },
                { id: "REJECTED", label: "Đã hủy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    statusFilter === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Tìm theo tên gói, mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          {/* Orders Table / Cards List */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="size-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="size-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">
                  Không tìm thấy đơn hàng nào
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bạn chưa có đơn đặt dịch vụ nào khớp với bộ lọc. Hãy tham khảo
                  bảng giá và đăng ký máy chủ đám mây mới ngay hôm nay.
                </p>
              </div>
              <Button
                size="sm"
                className="mt-2"
                render={<Link href="/dich-vu" />}
              >
                Xem danh mục dịch vụ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isNew = String(order.status) === "0" || String(order.status) === "New";
                const remaining = isNew ? getRemainingSeconds(order.createdAt) : 0;
                const isExpired = isNew && remaining <= 0;

                return (
                  <div
                    key={order.id}
                    className={`p-5 md:p-6 rounded-2xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                      isNew && !isExpired
                        ? "border-amber-200 bg-amber-50/20 hover:border-amber-300 hover:shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    {/* Left: Service & Specs info */}
                    <div className="flex items-start gap-4">
                      <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isNew && !isExpired
                          ? "bg-amber-100 text-amber-700"
                          : "bg-primary/10 text-primary"
                      }`}>
                        <Server className="size-6" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {order.servicePlanName}
                          </h4>
                          {getStatusBadge(order.status, order.createdAt)}
                          {order.estimatedPrice && order.estimatedPrice > 0 && (
                            <span className="text-xs font-extrabold text-primary ml-1">
                              {formatVND(order.estimatedPrice)}
                            </span>
                          )}
                        </div>

                        {/* Remaining payment countdown ticker for pending orders */}
                        {isNew && !isExpired && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
                            <Clock className="size-3.5 text-amber-700 animate-spin" style={{ animationDuration: "6s" }} />
                            <span>Thời gian thanh toán còn lại:</span>
                            <span className="font-mono text-sm font-extrabold text-amber-950 tracking-wider">
                              {formatRemainingTime(remaining)}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            Mã: #{order.id.substring(0, 8).toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="size-3.5 text-slate-400" />
                            Chu kỳ:{" "}
                            <strong className="text-slate-700">
                              {order.billingCycle}
                            </strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5 text-slate-400" />
                            Ngày tạo:{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>

                        {order.companyName && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Building2 className="size-3.5 text-slate-400" />
                            Đơn vị: {order.companyName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                      {/* Nếu đơn hàng đang ở trạng thái Chờ xử lý (0/New) và chưa hết hạn 5 phút */}
                      {isNew && !isExpired && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenPayOSQr(order)}
                          disabled={payingOrderId === order.id}
                          className="bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-primary/20"
                        >
                          {payingOrderId === order.id ? (
                            <RefreshCw className="size-3.5 animate-spin" />
                          ) : (
                            <CreditCard className="size-3.5" />
                          )}
                          Thanh toán VietQR
                        </Button>
                      )}

                      {isNew && isExpired && (
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href="/dich-vu" />}
                          className="border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          Đặt lại gói mới
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Eye className="size-3.5" />
                        Chi tiết đơn
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Order Details Sheet (Modal chi tiết) */}
      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <SheetContent className="sm:max-w-md p-6 overflow-y-auto">
          {selectedOrder && (
            <div className="space-y-6">
              <SheetHeader className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    #{selectedOrder.id.substring(0, 8).toUpperCase()}
                  </Badge>
                  {getStatusBadge(selectedOrder.status, selectedOrder.createdAt)}
                </div>
                <SheetTitle className="text-xl font-bold text-slate-900">
                  {selectedOrder.servicePlanName}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500">
                  Thông tin đăng ký dịch vụ lưu trữ & hạ tầng đám mây.
                </SheetDescription>
              </SheetHeader>

              {/* Order Information Details */}
              <div className="space-y-4 text-xs">
                {/* Remaining Payment Countdown Alert inside Detail Sheet */}
                {(String(selectedOrder.status) === "0" || String(selectedOrder.status) === "New") && (
                  (() => {
                    const remaining = getRemainingSeconds(selectedOrder.createdAt);
                    const isExpired = remaining <= 0;
                    return (
                      <div className={`p-4 rounded-2xl border ${
                        !isExpired
                          ? "bg-amber-50/90 border-amber-200 text-amber-900"
                          : "bg-rose-50 border-rose-200 text-rose-900"
                      } space-y-2`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5 text-xs">
                            <Clock className="size-4 text-amber-600 animate-pulse" />
                            Thời hạn thanh toán:
                          </span>
                          <span className="font-mono font-extrabold text-sm text-amber-950">
                            {!isExpired ? formatRemainingTime(remaining) : "00:00 (Hết hạn)"}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-85 leading-relaxed">
                          {!isExpired
                            ? "Vui lòng quét mã VietQR và hoàn tất chuyển khoản trong thời gian này để hệ thống kích hoạt tự động."
                            : "Đơn hàng đã quá hạn 5 phút và chuyển sang trạng thái Từ chối. Quý khách vui lòng tạo lại đơn hàng mới."}
                        </p>
                      </div>
                    );
                  })()
                )}

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                    Thông tin liên hệ:
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Người đặt:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedOrder.customerName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedOrder.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedOrder.phone}
                      </span>
                    </div>
                    {selectedOrder.companyName && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Công ty:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedOrder.companyName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                    Thông tin hạ tầng & Dịch vụ:
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Gói dịch vụ:</span>
                      <span className="font-bold text-primary">
                        {selectedOrder.servicePlanName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Chu kỳ thanh toán:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedOrder.billingCycle}
                      </span>
                    </div>
                    {selectedOrder.estimatedPrice && selectedOrder.estimatedPrice > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Tổng thanh toán:</span>
                        <span className="font-bold text-slate-900">
                          {formatVND(selectedOrder.estimatedPrice)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Ngày gửi yêu cầu:</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Cam kết SLA:</span>
                      <span className="font-semibold text-emerald-600">
                        99.99% Uptime
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-700 space-y-1.5">
                  <span className="font-bold text-indigo-950 block">
                    Hỗ trợ kỹ thuật 24/7:
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Nếu bạn cần hỗ trợ cài đặt hệ điều hành, cấu hình IP hay
                    nâng cấp tài nguyên, vui lòng liên hệ tổng đài hỗ trợ{" "}
                    <strong>1900 xxxx</strong> hoặc gửi email về{" "}
                    <strong>support@cloudservices.vn</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                {(String(selectedOrder.status) === "0" || String(selectedOrder.status) === "New") &&
                  getRemainingSeconds(selectedOrder.createdAt) > 0 && (
                    <Button
                      onClick={() => {
                        const orderToPay = selectedOrder;
                        setSelectedOrder(null);
                        handleOpenPayOSQr(orderToPay);
                      }}
                      className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-semibold py-5 rounded-xl shadow-md gap-2"
                    >
                      <CreditCard className="size-4" />
                      Thanh toán ngay bằng VietQR
                    </Button>
                  )}

                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full text-xs font-semibold rounded-xl"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* PayOS VietQR Payment Modal */}
      {paymentModalData && (
        <PaymentQrModal
          isOpen={showPaymentQr}
          onClose={() => setShowPaymentQr(false)}
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
              description: "Hệ thống đã nhận thanh toán cho đơn hàng của bạn.",
              type: "success",
            });
            setShowPaymentQr(false);
            refreshOrders();
          }}
          onPaymentExpired={() => {
            refreshOrders();
          }}
        />
      )}
    </div>
  );
}
