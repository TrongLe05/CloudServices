"use client";

import * as React from "react";
import Link from "next/link";
import {
  Server,
  Search,
  Calendar,
  Clock,
  RotateCcw,
  Building2,
  RefreshCw,
  Eye,
  Filter,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/toast";
import { PaymentQrModal } from "./PaymentQrModal";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { OrderHistoryStatsCards } from "./OrderHistoryStatsCards";
import { OrderDetailSheet } from "./OrderDetailSheet";
import { UserOrder, PaymentModalData } from "@/types/orders.types";
import {
  formatVND,
  formatDateVN,
  getRemainingPaymentSeconds,
  formatTimer,
} from "@/lib/formatUtils";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [selectedOrder, setSelectedOrder] = React.useState<UserOrder | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [payingOrderId, setPayingOrderId] = React.useState<string | null>(null);
  const [showPaymentQr, setShowPaymentQr] = React.useState(false);
  const [paymentModalData, setPaymentModalData] = React.useState<PaymentModalData | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleOpenPayOSQr = async (order: UserOrder) => {
    const remaining = getRemainingPaymentSeconds(order.createdAt);
    if (remaining <= 0) {
      toast.add({
        title: "Đơn hàng đã hết hạn",
        description: "Đơn hàng này đã quá hạn 5 phút. Vui lòng tạo đơn hàng mới.",
        type: "error",
      });
      return;
    }

    try {
      setPayingOrderId(order.id);
      const res = await fetch("/api/payments/create-payos-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!res.ok) {
        throw new Error("Không thể lấy mã thanh toán cho đơn hàng này.");
      }

      const data = await res.json();
      setPaymentModalData({
        orderId: order.id,
        planName: order.servicePlanName,
        amount: data.amount,
        orderCode: data.orderCode,
        qrCodeString: data.qrCode,
        vietQrUrl: data.vietQrUrl,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        bin: data.bin,
        checkoutUrl: data.checkoutUrl,
        description: data.description,
        createdAt: order.createdAt,
      });
      setShowPaymentQr(true);
    } catch (err: unknown) {
      toast.add({
        title: "Lỗi thanh toán",
        description:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi tạo mã QR VietQR.",
        type: "error",
      });
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const emailQuery = userEmail
        ? `&email=${encodeURIComponent(userEmail)}`
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

  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.servicePlanName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (o.companyName &&
          o.companyName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      let matchStatus = true;
      const s = String(o.status);
      const remaining = getRemainingPaymentSeconds(o.createdAt);

      if (statusFilter === "NEW") {
        matchStatus = (s === "0" || s === "New") && remaining > 0;
      } else if (statusFilter === "PROCESSING") {
        matchStatus = s === "1" || s === "Processing";
      } else if (statusFilter === "ACTIVE") {
        matchStatus = s === "2" || s === "Completed";
      } else if (statusFilter === "REJECTED") {
        matchStatus = s === "3" || s === "Rejected" || ((s === "0" || s === "New") && remaining <= 0);
      }

      return matchSearch && matchStatus;
    });
  }, [orders, debouncedSearchTerm, statusFilter]);

  // Statistics counts
  const totalCount = orders.length;
  const activeCount = orders.filter(
    (o) => String(o.status) === "2" || String(o.status) === "Completed"
  ).length;
  const pendingCount = orders.filter((o) => {
    const s = String(o.status);
    if (s === "1" || s === "Processing") return true;
    if (s === "0" || s === "New") {
      return getRemainingPaymentSeconds(o.createdAt) > 0;
    }
    return false;
  }).length;

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      {/* 1. Breadcrumb Bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Lịch sử đơn hàng &amp; Dịch vụ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Cổng quản lý dịch vụ khách hàng
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5">
              Lịch sử đơn dịch vụ đám mây
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi tiến độ duyệt, đếm ngược thanh toán VietQR và trạng thái bàn giao máy chủ.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-xl border-slate-200 bg-white shadow-2xs text-xs font-semibold gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Đang tải..." : "Làm mới"}</span>
            </Button>

            <Button
              render={<Link href="/dich-vu" />}
              size="sm"
              className="rounded-xl bg-primary text-white shadow-xs text-xs font-bold gap-1.5"
            >
              <ShoppingBag className="size-3.5" />
              <span>Đăng ký thêm gói</span>
            </Button>
          </div>
        </div>

        {/* Thống kê 3 Card KPI */}
        <OrderHistoryStatsCards
          totalCount={totalCount}
          activeCount={activeCount}
          pendingCount={pendingCount}
        />

        {/* Search & Filter Toolbar */}
        <section aria-label="Bộ lọc đơn hàng" className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên gói, mã đơn #ID, doanh nghiệp..."
              className="pl-10 h-10 rounded-xl bg-slate-50 text-xs border-slate-200"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="size-3.5 text-slate-400 shrink-0 hidden sm:block mr-1" />
            {[
              { label: "Tất cả", value: "ALL" },
              { label: "Chờ thanh toán", value: "NEW" },
              { label: "Đang khởi tạo", value: "PROCESSING" },
              { label: "Đang hoạt động", value: "ACTIVE" },
              { label: "Từ chối / Hết hạn", value: "REJECTED" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === tab.value
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Orders List */}
        <section aria-label="Danh sách đơn hàng">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
              <div className="size-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Server className="size-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Không tìm thấy đơn dịch vụ nào
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Bạn chưa có yêu cầu dịch vụ nào hoặc không có đơn nào khớp với bộ lọc hiện tại.
                </p>
              </div>
              <Button
                render={<Link href="/dich-vu" />}
                className="h-10 px-6 rounded-xl font-bold text-xs bg-primary text-white"
              >
                Xem danh mục dịch vụ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isNew = String(order.status) === "0" || String(order.status) === "New";
                const remaining = isNew ? getRemainingPaymentSeconds(order.createdAt) : 0;
                const isExpired = isNew && remaining <= 0;

                return (
                  <article
                    key={order.id}
                    className={`p-5 md:p-6 rounded-2xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                      isNew && !isExpired
                        ? "border-amber-200 bg-amber-50/20 hover:border-amber-300 hover:shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    {/* Left: Service & Specs info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`size-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isNew && !isExpired
                            ? "bg-amber-100 text-amber-700"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Server className="size-6" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 font-heading">
                            {order.servicePlanName}
                          </h4>
                          <OrderStatusBadge
                            status={order.status}
                            createdAt={order.createdAt}
                          />
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
                              {formatTimer(remaining)}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            Mã: #{order.id.substring(0, 8).toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="size-3.5 text-slate-400" />
                            Chu kỳ: <strong className="text-slate-700">{order.billingCycle}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5 text-slate-400" />
                            Ngày tạo: {formatDateVN(order.createdAt)}
                          </span>
                        </div>

                        {order.companyName && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Building2 className="size-3.5 text-slate-400" />
                            <span>Doanh nghiệp: <strong>{order.companyName}</strong></span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-end md:self-center shrink-0">
                      {isNew && !isExpired && (
                        <Button
                          onClick={() => handleOpenPayOSQr(order)}
                          disabled={payingOrderId === order.id}
                          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-xs gap-1.5"
                        >
                          <CreditCard className="size-3.5" />
                          <span>
                            {payingOrderId === order.id ? "Đang mở VietQR..." : "Thanh toán ngay"}
                          </span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                        className="h-10 px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs gap-1.5 shadow-2xs"
                      >
                        <Eye className="size-3.5 text-slate-400" />
                        <span>Chi tiết</span>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 4. Order Details Sheet (Modal chi tiết) */}
      <OrderDetailSheet
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onPayOrder={(order) => handleOpenPayOSQr(order)}
      />

      {/* 5. Payment QR Modal */}
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
            setShowPaymentQr(false);
            handleRefresh();
          }}
          onPaymentExpired={() => {
            handleRefresh();
          }}
        />
      )}
    </main>
  );
}
