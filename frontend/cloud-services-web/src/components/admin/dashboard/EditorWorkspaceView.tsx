"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit,
  Building2,
  Phone,
  Mail,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { formatVND, formatDateVN } from "@/lib/formatUtils";

export interface EditorOrderRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  servicePlanName: string;
  billingCycle: string;
  estimatedPrice?: number;
  status: string | number;
  createdAt: string;
}

export interface EditorAffiliate {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  websiteOrSocialUrl?: string | null;
  status: string | number;
  createdAt: string;
}

export interface EditorNewsItem {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  content?: string;
  thumbnailUrl?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
}

interface EditorWorkspaceViewProps {
  initialOrders: EditorOrderRequest[];
  initialAffiliates: EditorAffiliate[];
  initialNews: EditorNewsItem[];
  onRefresh?: () => void;
}

export function EditorWorkspaceView({
  initialOrders = [],
  initialAffiliates = [],
  initialNews = [],
  onRefresh,
}: EditorWorkspaceViewProps) {
  const [orders, setOrders] = React.useState<EditorOrderRequest[]>(initialOrders);
  const [affiliates, setAffiliates] = React.useState<EditorAffiliate[]>(initialAffiliates);
  const [news, setNews] = React.useState<EditorNewsItem[]>(initialNews);
  const [activeSection, setActiveSection] = React.useState<"orders" | "affiliates" | "news">("orders");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  // Sync props if parent updates
  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);
  React.useEffect(() => {
    setAffiliates(initialAffiliates);
  }, [initialAffiliates]);
  React.useEffect(() => {
    setNews(initialNews);
  }, [initialNews]);

  // Status Change Handler for Order Requests: Mới (0) -> Đang xử lý (1) -> Hoàn tất (2) / Từ chối (3)
  const handleOrderStatusChange = async (id: string, nextStatus: number | string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/order-requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: String(nextStatus) }),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật trạng thái đơn hàng.");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
      );

      toast.add({
        title: "Cập nhật thành công",
        description: `Đã đổi trạng thái đơn sang: ${getOrderStatusLabel(nextStatus)}`,
        type: "success",
      });
    } catch (err: unknown) {
      toast.add({
        title: "Lỗi cập nhật",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Status Change Handler for Affiliates: Mới (0) -> Đang xử lý (1) -> Hoàn tất (2) / Từ chối (3)
  const handleAffiliateStatusChange = async (id: string, nextStatus: number | string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/affiliates/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: String(nextStatus) }),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật trạng thái CTV.");
      }

      setAffiliates((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
      );

      toast.add({
        title: "Cập nhật thành công",
        description: `Đã đổi trạng thái đối tác sang: ${getAffiliateStatusLabel(nextStatus)}`,
        type: "success",
      });
    } catch (err: unknown) {
      toast.add({
        title: "Lỗi cập nhật",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getOrderStatusLabel = (s: number | string) => {
    const str = String(s);
    if (str === "0" || str === "New") return "Mới";
    if (str === "1" || str === "Processing") return "Đang xử lý";
    if (str === "2" || str === "Completed") return "Hoàn tất";
    if (str === "3" || str === "Rejected") return "Từ chối";
    return str;
  };

  const getAffiliateStatusLabel = (s: number | string) => {
    const str = String(s);
    if (str === "0" || str === "Pending") return "Mới / Chờ duyệt";
    if (str === "1" || str === "Contacted") return "Đang liên hệ";
    if (str === "2" || str === "Approved") return "Đã kích hoạt";
    if (str === "3" || str === "Rejected") return "Từ chối";
    return str;
  };

  // KPI calculations
  const pendingOrdersCount = orders.filter((o) => String(o.status) === "0" || String(o.status) === "New").length;
  const processingOrdersCount = orders.filter((o) => String(o.status) === "1" || String(o.status) === "Processing").length;
  const pendingAffiliatesCount = affiliates.filter((a) => String(a.status) === "0" || String(a.status) === "Pending").length;
  const publishedNewsCount = news.filter((n) => n.isPublished || Boolean(n.publishedAt)).length;

  return (
    <div className="space-y-6">
      {/* 1. KPI Workspace Cards for Editor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Đơn hàng mới */}
        <Card
          onClick={() => setActiveSection("orders")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            activeSection === "orders" ? "ring-2 ring-primary border-primary bg-primary/5" : "border-slate-200 bg-white"
          }`}
        >
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-xs font-semibold text-slate-500">
                Đơn dịch vụ chờ xử lý
              </CardDescription>
              <CardTitle className="text-2xl font-black text-amber-700 mt-1 font-heading">
                {pendingOrdersCount + processingOrdersCount}
              </CardTitle>
            </div>
            <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShoppingCart className="size-5" />
            </div>
          </CardHeader>
        </Card>

        {/* Affiliate chờ duyệt */}
        <Card
          onClick={() => setActiveSection("affiliates")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            activeSection === "affiliates" ? "ring-2 ring-primary border-primary bg-primary/5" : "border-slate-200 bg-white"
          }`}
        >
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-xs font-semibold text-slate-500">
                Đăng ký CTV chờ duyệt
              </CardDescription>
              <CardTitle className="text-2xl font-black text-indigo-700 mt-1 font-heading">
                {pendingAffiliatesCount}
              </CardTitle>
            </div>
            <div className="size-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="size-5" />
            </div>
          </CardHeader>
        </Card>

        {/* Tin tức / Blog đã đăng */}
        <Card
          onClick={() => setActiveSection("news")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            activeSection === "news" ? "ring-2 ring-primary border-primary bg-primary/5" : "border-slate-200 bg-white"
          }`}
        >
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-xs font-semibold text-slate-500">
                Bài viết đã xuất bản
              </CardDescription>
              <CardTitle className="text-2xl font-black text-emerald-700 mt-1 font-heading">
                {publishedNewsCount}
              </CardTitle>
            </div>
            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="size-5" />
            </div>
          </CardHeader>
        </Card>

        {/* Quick Action Button */}
        <Card className="rounded-2xl border-dashed border-slate-300 bg-slate-50/60 flex items-center justify-center p-4">
          <Link href="/admin/news/create" className="w-full">
            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs gap-2 shadow-xs">
              <Plus className="size-4" />
              <span>Viết bài mới (Markdown/Rich Text)</span>
            </Button>
          </Link>
        </Card>
      </div>

      {/* 2. Workspace Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === "orders"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShoppingCart className="size-3.5" />
            <span>Yêu cầu Đặt dịch vụ ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("affiliates")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === "affiliates"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Users className="size-3.5" />
            <span>Đăng ký Affiliate ({affiliates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("news")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === "news"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Tin tức &amp; Blog ({news.length})</span>
          </button>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="rounded-xl text-xs h-8 gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            <span>Làm mới</span>
          </Button>
        )}
      </div>

      {/* 3. Section Content */}
      {activeSection === "orders" && (
        <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Xử lý Yêu cầu Đặt dịch vụ
              </CardTitle>
              <CardDescription className="text-xs">
                Xem chi tiết khách hàng và chuyển đổi trạng thái: <strong>Mới → Đang xử lý → Hoàn tất / Từ chối</strong>.
              </CardDescription>
            </div>
            <Link href="/admin/service-orders">
              <Button variant="outline" size="sm" className="text-xs rounded-xl gap-1">
                <span>Xem trang quản lý đầy đủ</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-5">Mã đơn / Khách hàng</th>
                    <th className="p-3.5">Gói dịch vụ</th>
                    <th className="p-3.5">Chu kỳ / Giá</th>
                    <th className="p-3.5">Thời gian</th>
                    <th className="p-3.5">Trạng thái hiện tại</th>
                    <th className="p-3.5 pr-5 text-right">Đổi trạng thái nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Chưa có yêu cầu đặt dịch vụ nào.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 10).map((order) => {
                      const s = String(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 pl-5">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block">
                                {order.customerName}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="font-mono">#{order.id.substring(0, 8).toUpperCase()}</span>
                                <span>•</span>
                                <span>{order.phone}</span>
                              </div>
                              <span className="text-[11px] text-slate-500 block">{order.email}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800">
                            {order.servicePlanName}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-primary block">
                              {order.estimatedPrice ? formatVND(order.estimatedPrice) : "Liên hệ"}
                            </span>
                            <span className="text-[10px] text-slate-400">{order.billingCycle}</span>
                          </td>
                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {formatDateVN(order.createdAt)}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] font-bold ${
                                s === "0" || s === "New"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : s === "1" || s === "Processing"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : s === "2" || s === "Completed"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-rose-100 text-rose-800 border-rose-200"
                              }`}
                            >
                              {getOrderStatusLabel(order.status)}
                            </Badge>
                          </td>
                          <td className="p-3.5 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Nút Đang xử lý */}
                              {s === "0" || s === "New" ? (
                                <Button
                                  size="sm"
                                  disabled={updatingId === order.id}
                                  onClick={() => handleOrderStatusChange(order.id, 1)}
                                  className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Xử lý
                                </Button>
                              ) : null}

                              {/* Nút Hoàn tất */}
                              {s === "1" || s === "Processing" ? (
                                <Button
                                  size="sm"
                                  disabled={updatingId === order.id}
                                  onClick={() => handleOrderStatusChange(order.id, 2)}
                                  className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  Hoàn tất
                                </Button>
                              ) : null}

                              {/* Nút Từ chối */}
                              {s !== "3" && s !== "Rejected" && s !== "2" && s !== "Completed" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={updatingId === order.id}
                                  onClick={() => handleOrderStatusChange(order.id, 3)}
                                  className="h-7 px-2 rounded-lg text-[11px] text-rose-600 border-rose-200 hover:bg-rose-50"
                                >
                                  Từ chối
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === "affiliates" && (
        <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Xét duyệt Đăng ký Cộng tác viên (Affiliate)
              </CardTitle>
              <CardDescription className="text-xs">
                Xem thông tin hồ sơ và chuyển đổi trạng thái: <strong>Chờ duyệt → Đang liên hệ → Kích hoạt / Từ chối</strong>.
              </CardDescription>
            </div>
            <Link href="/admin/affiliates">
              <Button variant="outline" size="sm" className="text-xs rounded-xl gap-1">
                <span>Xem trang quản lý đầy đủ</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-5">Họ tên / Liên hệ</th>
                    <th className="p-3.5">Kênh tiếp thị / Website</th>
                    <th className="p-3.5">Ngày đăng ký</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 pr-5 text-right">Đổi trạng thái nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {affiliates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Chưa có đăng ký affiliate nào.
                      </td>
                    </tr>
                  ) : (
                    affiliates.slice(0, 10).map((aff) => {
                      const s = String(aff.status);
                      return (
                        <tr key={aff.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 pl-5">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block">{aff.fullName}</span>
                              <span className="text-[11px] text-slate-500 block">{aff.email}</span>
                              <span className="text-[11px] text-slate-400 block">{aff.phoneNumber}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            {aff.websiteOrSocialUrl ? (
                              <a
                                href={aff.websiteOrSocialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1 font-medium"
                              >
                                <span>{aff.websiteOrSocialUrl.replace(/^https?:\/\//, "")}</span>
                                <ExternalLink className="size-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Không cung cấp</span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {formatDateVN(aff.createdAt)}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] font-bold ${
                                s === "0" || s === "Pending"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : s === "1" || s === "Contacted"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : s === "2" || s === "Approved"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-rose-100 text-rose-800 border-rose-200"
                              }`}
                            >
                              {getAffiliateStatusLabel(aff.status)}
                            </Badge>
                          </td>
                          <td className="p-3.5 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {s === "0" || s === "Pending" ? (
                                <Button
                                  size="sm"
                                  disabled={updatingId === aff.id}
                                  onClick={() => handleAffiliateStatusChange(aff.id, 1)}
                                  className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Liên hệ
                                </Button>
                              ) : null}

                              {s === "1" || s === "Contacted" ? (
                                <Button
                                  size="sm"
                                  disabled={updatingId === aff.id}
                                  onClick={() => handleAffiliateStatusChange(aff.id, 2)}
                                  className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  Duyệt CTV
                                </Button>
                              ) : null}

                              {s !== "3" && s !== "Rejected" && s !== "2" && s !== "Approved" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={updatingId === aff.id}
                                  onClick={() => handleAffiliateStatusChange(aff.id, 3)}
                                  className="h-7 px-2 rounded-lg text-[11px] text-rose-600 border-rose-200 hover:bg-rose-50"
                                >
                                  Từ chối
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === "news" && (
        <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Quản lý Tin tức &amp; Blog (Content Studio)
              </CardTitle>
              <CardDescription className="text-xs">
                Soạn thảo, cập nhật và xuất bản bài viết với trình soạn thảo Markdown / Rich Text WYSIWYG.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/news/create">
                <Button size="sm" className="rounded-xl text-xs font-bold gap-1 bg-primary text-white">
                  <Plus className="size-3.5" />
                  <span>Viết bài mới</span>
                </Button>
              </Link>
              <Link href="/admin/news">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                  <span>Toàn bộ danh sách</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-5">Tiêu đề bài viết</th>
                    <th className="p-3.5">Chuyên mục</th>
                    <th className="p-3.5">Trạng thái xuất bản</th>
                    <th className="p-3.5">Ngày tạo</th>
                    <th className="p-3.5 pr-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {news.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Chưa có bài viết nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    news.slice(0, 10).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 block max-w-md truncate">
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 block">
                              /blog/{item.slug}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px] font-semibold text-slate-600">
                            {item.category || "Tin tức"}
                          </Badge>
                        </td>
                        <td className="p-3.5">
                          {item.isPublished || Boolean(item.publishedAt) ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                              Đã xuất bản
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] font-semibold text-slate-500">
                              Bản nháp
                            </Badge>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-500 text-[11px]">
                          {formatDateVN(item.createdAt)}
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/news/${item.id}/edit`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 rounded-lg text-xs gap-1"
                              >
                                <Edit className="size-3" />
                                <span>Chỉnh sửa</span>
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
