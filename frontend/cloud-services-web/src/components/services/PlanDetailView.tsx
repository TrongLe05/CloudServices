"use client";

import * as React from "react";
import Link from "next/link";
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  Check,
  ShieldCheck,
  Headphones,
  Clock,
  Sparkles,
  ChevronRight,
  ShoppingCart,
  PhoneCall,
  Share2,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowLeft,
  Flame,
  Award,
  RefreshCw,
  Star,
  MessageSquarePlus,
  User,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { OrderServiceModal, OrderModalPlan } from "./OrderServiceModal";
import { toast } from "@/components/ui/toast";

import { useSession } from "next-auth/react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  company?: string | null;
  position?: string | null;
  content: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  rating: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface PlanDetailData {
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
  prices?: {
    id: string;
    billingCycle: string;
    price: number;
    promotionDiscountPercentage?: number;
  }[];
}

interface PlanDetailViewProps {
  plan: PlanDetailData;
  relatedPlans?: PlanDetailData[];
  testimonials?: TestimonialItem[];
}

export function PlanDetailView({
  plan,
  relatedPlans = [],
  testimonials: initialTestimonials = [],
}: PlanDetailViewProps) {
  const { data: session } = useSession();
  const [selectedCycle, setSelectedCycle] = React.useState<string>("monthly");
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"specs" | "features" | "faq" | "reviews">("specs");

  // Dynamic reviews list (combines server testimonials + newly added reviews)
  const [reviewsList, setReviewsList] = React.useState<TestimonialItem[]>(initialTestimonials);

  // Review Form State
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newRole, setNewRole] = React.useState("");
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name) setNewAuthor(session.user.name);
    }
  }, [session]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      toast.add({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập họ tên và nội dung đánh giá của bạn.",
        type: "error",
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload = {
        clientName: newAuthor.trim(),
        position: newRole.trim() || "Khách hàng xác thực",
        company: plan.name ? `Gói ${plan.name}` : "Doanh nghiệp",
        content: newComment.trim(),
        avatarUrl: session?.user?.image || null,
        companyLogoUrl: null,
        rating: newRating,
        isActive: true,
        displayOrder: 0,
      };

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Không thể gửi đánh giá.");
      }

      const createdReview: TestimonialItem = await res.json();

      setReviewsList((prev) => [createdReview, ...prev]);
      setNewComment("");
      setNewRating(5);

      toast.add({
        title: "Đánh giá thành công!",
        description: "Đánh giá của bạn đã được ghi nhận và lưu vào hệ thống.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi gửi đánh giá",
        description: err.message || "Đã xảy ra lỗi khi lưu đánh giá.",
        type: "error",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Find price for selected cycle
  const currentPriceObj = plan.prices?.find((p) => p.billingCycle === selectedCycle) || plan.prices?.[0];
  const basePrice = currentPriceObj?.price ?? 0;
  const discountPercent = currentPriceObj?.promotionDiscountPercentage ?? 0;
  const discountedPrice = discountPercent > 0 ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;

  // Available billing cycles with label
  const billingCycles = [
    { id: "monthly", label: "1 Tháng", badge: null },
    { id: "quarterly", label: "3 Tháng", badge: "Phổ biến" },
    { id: "semi-annual", label: "6 Tháng", badge: "Tiết kiệm 10%" },
    { id: "yearly", label: "1 Năm (Khuyên dùng)", badge: "Ưu đãi 20%" },
  ];

  // Calculate real average rating from active reviews
  const activeTestimonials = reviewsList.filter((t) => t.isActive);
  const totalReviews = activeTestimonials.length;
  const averageRating =
    totalReviews > 0
      ? (
          activeTestimonials.reduce((acc, curr) => acc + curr.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "5.0";

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.add({
        title: "Đã sao chép liên kết",
        description: "Đường dẫn chi tiết gói dịch vụ đã được lưu vào bộ nhớ tạm.",
        type: "success",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/dich-vu" />}>Dịch vụ</BreadcrumbLink>
              </BreadcrumbItem>
              {plan.categorySlug && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={`/dich-vu/${plan.categorySlug}`} />}>
                      {plan.categoryName || "Danh mục"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-900">{plan.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. Main E-Commerce Product Box (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Visual Showcase & Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Visual Product Display Box */}
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 size-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 size-48 bg-indigo-600/15 rounded-full blur-[80px] pointer-events-none" />

              {/* Status & Badges */}
              <div className="flex items-center justify-between relative z-10">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1">
                  <span className="size-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                  Sẵn sàng kích hoạt
                </Badge>

                {discountPercent > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1">
                    <Flame className="size-3.5 mr-1" />
                    Giảm -{discountPercent}%
                  </Badge>
                )}
              </div>

              {/* Graphic Icon Centerpiece */}
              <div className="my-10 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                <div className="size-28 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 p-0.5 shadow-2xl shadow-primary/30">
                  <div className="size-full rounded-[14px] bg-slate-950 flex items-center justify-center text-indigo-400">
                    <Server className="size-14" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    {plan.categoryName || "Dịch vụ Đám mây"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{plan.name}</h2>
                </div>
              </div>

              {/* Core Specs Chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-800 relative z-10 text-xs">
                {plan.cpu && (
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
                    <Cpu className="size-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Vi xử lý</span>
                      <span className="font-semibold text-slate-200">{plan.cpu}</span>
                    </div>
                  </div>
                )}
                {plan.ram && (
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
                    <Activity className="size-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Dung lượng RAM</span>
                      <span className="font-semibold text-slate-200">{plan.ram}</span>
                    </div>
                  </div>
                )}
                {plan.storage && (
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
                    <HardDrive className="size-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Lưu trữ NVMe</span>
                      <span className="font-semibold text-slate-200">{plan.storage}</span>
                    </div>
                  </div>
                )}
                {plan.bandwidth && (
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
                    <Zap className="size-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Băng thông</span>
                      <span className="font-semibold text-slate-200">{plan.bandwidth}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quality Commitments Mini-Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <ShieldCheck className="size-4" />
                  Anti-DDoS Pro
                </div>
                <p className="text-slate-500 text-[11px]">Bảo vệ tầng 3, 4 & 7 tự động</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <Clock className="size-4" />
                  99.99% Uptime
                </div>
                <p className="text-slate-500 text-[11px]">Cam kết SLA bằng hợp đồng</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <Zap className="size-4" />
                  Kích hoạt dưới 60s
                </div>
                <p className="text-slate-500 text-[11px]">Tự động hóa 100% quy trình</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Headphones className="size-4" />
                  Hỗ trợ 24/7/365
                </div>
                <p className="text-slate-500 text-[11px]">Kỹ sư phụ trách trực tiếp</p>
              </div>
            </div>
          </div>

          {/* Right Column: E-Commerce Purchase Config & Specs Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-3xl border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="p-8 pb-6 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <Badge variant="secondary" className="text-primary font-semibold text-xs bg-primary/10">
                      {plan.categoryName || "Dịch vụ Đám mây"}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {plan.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {plan.description || "Gói giải pháp đám mây thế hệ mới được cấu hình tối ưu sẵn sàng cho sản xuất."}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="rounded-full size-9 text-slate-500 hover:text-slate-900 shrink-0"
                    title="Chia sẻ gói dịch vụ"
                  >
                    <Share2 className="size-4" />
                  </Button>
                </div>

                {/* E-Commerce Price Section */}
                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Chi phí đầu tư:
                    </span>
                    {basePrice > 0 ? (
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                          {formatVND(discountedPrice)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          /{selectedCycle === "monthly" ? "tháng" : selectedCycle === "yearly" ? "năm" : selectedCycle}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">Liên hệ báo giá</span>
                    )}

                    {discountPercent > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400 line-through">
                          {formatVND(basePrice)}
                        </span>
                        <Badge className="bg-red-500 text-[10px] font-bold">
                          Tiết kiệm {discountPercent}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
                    <span className="text-xs text-slate-500 block">Thời gian bàn giao</span>
                    <span className="text-sm font-bold text-slate-800 flex items-center justify-end gap-1 mt-0.5">
                      <Zap className="size-3.5 text-amber-500 fill-amber-500" />
                      &lt; 60 giây
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                {/* 1. Choose Billing Cycle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Chọn chu kỳ thanh toán:
                    </label>
                    <span className="text-xs text-slate-400">Thanh toán dài hạn để nhận thêm ưu đãi</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {billingCycles.map((cycle) => {
                      const isSelected = selectedCycle === cycle.id;
                      return (
                        <button
                          key={cycle.id}
                          type="button"
                          onClick={() => setSelectedCycle(cycle.id)}
                          className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[72px] ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-slate-800"}`}>
                            {cycle.label}
                          </span>
                          {cycle.badge ? (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md w-fit mt-1">
                              {cycle.badge}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 mt-1">Chu kỳ chuẩn</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Technical Specifications Summary Table */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Cấu hình kỹ thuật cam kết:
                  </label>

                  <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                    {plan.cpu && (
                      <div className="p-3.5 bg-white flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Cpu className="size-4 text-slate-400" />
                          Vi xử lý vCPU
                        </span>
                        <span className="font-bold text-slate-900">{plan.cpu}</span>
                      </div>
                    )}
                    {plan.ram && (
                      <div className="p-3.5 bg-white flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Activity className="size-4 text-slate-400" />
                          Bộ nhớ RAM
                        </span>
                        <span className="font-bold text-slate-900">{plan.ram}</span>
                      </div>
                    )}
                    {plan.storage && (
                      <div className="p-3.5 bg-white flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <HardDrive className="size-4 text-slate-400" />
                          Ổ cứng lưu trữ
                        </span>
                        <span className="font-bold text-slate-900">{plan.storage}</span>
                      </div>
                    )}
                    {plan.bandwidth && (
                      <div className="p-3.5 bg-white flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Zap className="size-4 text-slate-400" />
                          Lưu lượng băng thông
                        </span>
                        <span className="font-bold text-slate-900">{plan.bandwidth}</span>
                      </div>
                    )}
                    <div className="p-3.5 bg-white flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        <ShieldCheck className="size-4 text-slate-400" />
                        Địa chỉ IP công khai
                      </span>
                      <span className="font-bold text-slate-900">1 Dedicated IPv4 tĩnh</span>
                    </div>
                  </div>
                </div>

                {/* 3. Included Free Services */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    Đặc quyền miễn phí đi kèm gói:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Miễn phí khởi tạo & cài đặt OS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Tự động Backup định kỳ hàng tuần</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Toàn quyền quản trị Root/Admin</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Hỗ trợ chuyển dữ liệu miễn phí</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* 4. Action Buttons */}
              <CardFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setIsOrderModalOpen(true)}
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-6 text-sm rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="size-4" />
                  Đăng ký ngay gói này
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-6 px-6 rounded-2xl flex items-center justify-center gap-2"
                  render={<Link href="/dang-ky" />}
                >
                  <PhoneCall className="size-4 text-slate-400" />
                  Yêu cầu gọi lại
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* 3. Tabbed Details (Thông số kỹ thuật sâu / Tính năng / FAQ / Đánh giá) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("specs")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all shrink-0 ${
                activeTab === "specs"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Thông tin chi tiết hạ tầng
            </button>
            <button
              onClick={() => setActiveTab("features")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all shrink-0 ${
                activeTab === "features"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Tính năng & Tiện ích đi kèm
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all shrink-0 ${
                activeTab === "faq"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Câu hỏi thường gặp (FAQ)
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Đánh giá từ khách hàng ({totalReviews})
              {totalReviews > 0 && (
                <span className="flex items-center text-amber-500 text-xs">
                  <Star className="size-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                  {averageRating}
                </span>
              )}
            </button>
          </div>

          {activeTab === "specs" && (
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">Chi tiết phần cứng & Hạ tầng trung tâm dữ liệu</h3>
              <p>
                Gói dịch vụ <strong>{plan.name}</strong> được triển khai trên nền tảng ảo hóa KVM hiện đại, đặt tại các Data Center tiêu chuẩn quốc tế <strong>Tier III</strong> tại Việt Nam (Viettel IDC, FPT Telecom, VNPT) với đường truyền kết nối trong nước và quốc tế tốc độ cao.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-800">Bộ vi xử lý (CPU)</span>
                  <p className="text-xs text-slate-500">Intel Xeon Gold / AMD EPYC thế hệ mới, xung nhịp cao từ 2.8GHz - 3.5GHz</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-800">Lưu trữ (Storage)</span>
                  <p className="text-xs text-slate-500">100% SSD NVMe Enterprise chạy RAID 10 chống lỗi phần cứng, IOPS lên đến 100.000</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-800">Bảo mật mạng</span>
                  <p className="text-xs text-slate-500">Tường lửa phần cứng FireWall thế hệ mới và hệ thống Anti-DDoS tự động</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="size-4 text-primary" />
                  Nâng cấp tài nguyên không gián đoạn
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Dễ dàng tăng dung lượng CPU, RAM hoặc ổ cứng bất kỳ lúc nào mà không làm gián đoạn các dịch vụ đang chạy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Bảo vệ an toàn dữ liệu
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Cơ chế snapshot và sao lưu định kỳ giúp khôi phục hệ thống về trạng thái mong muốn trong vài phút.
                </p>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">1. Tôi mất bao lâu để nhận được thông tin máy chủ sau khi đặt?</span>
                <p className="text-slate-500">
                  Hệ thống tự động kích hoạt và gửi thông tin quản trị IP, root password qua email của bạn trong vòng dưới 60 giây sau khi xác nhận đơn hàng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">2. Tôi có thể cài đặt hệ điều hành nào?</span>
                <p className="text-slate-500">
                  Hỗ trợ đầy đủ các hệ điều hành phổ biến: Ubuntu 20.04/22.04/24.04, CentOS, Debian, AlmaLinux, RockyLinux và Windows Server (2019/2022).
                </p>
              </div>
            </div>
          )}

          {/* 4. Real API Testimonials Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-8 text-xs text-slate-700">
              {totalReviews > 0 ? (
                <>
                  {/* Overall Rating Score Box */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-4xl font-extrabold text-slate-900 block">
                          {averageRating}
                        </span>
                        <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${
                                i < Math.round(Number(averageRating))
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Dựa trên {totalReviews} đánh giá thực tế
                        </span>
                      </div>

                      <div className="h-12 w-px bg-slate-200 hidden sm:block" />

                      <div className="space-y-1 hidden sm:block">
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <span>5 sao</span>
                          <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-400 h-full"
                              style={{
                                width: `${
                                  (activeTestimonials.filter((t) => t.rating === 5).length /
                                    totalReviews) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold">
                            {Math.round(
                              (activeTestimonials.filter((t) => t.rating === 5).length /
                                totalReviews) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <span>4 sao</span>
                          <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-400 h-full"
                              style={{
                                width: `${
                                  (activeTestimonials.filter((t) => t.rating === 4).length /
                                    totalReviews) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold">
                            {Math.round(
                              (activeTestimonials.filter((t) => t.rating === 4).length /
                                totalReviews) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <Badge
                        variant="outline"
                        className="text-emerald-700 bg-emerald-50 border-emerald-200 text-xs px-3 py-1 font-semibold"
                      >
                        <CheckCircle2 className="size-3.5 mr-1" />
                        Đánh giá được xác thực từ đối tác
                      </Badge>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Phản hồi thực tế từ các doanh nghiệp và chuyên gia IT
                      </p>
                    </div>
                  </div>

                  {/* Reviews List from Backend API */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Tất cả phản hồi từ khách hàng ({totalReviews})
                    </h4>

                    <div className="space-y-3">
                      {activeTestimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 transition-all hover:border-slate-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {testimonial.avatarUrl ? (
                                <img
                                  src={testimonial.avatarUrl}
                                  alt={testimonial.clientName}
                                  className="size-10 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                  {testimonial.clientName.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-slate-900 text-xs">
                                    {testimonial.clientName}
                                  </h5>
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0"
                                  >
                                    <CheckCircle2 className="size-2.5 mr-1" />
                                    Khách hàng doanh nghiệp
                                  </Badge>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {[testimonial.position, testimonial.company]
                                    .filter(Boolean)
                                    .join(" - ") || "Đối tác CloudServices"}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {new Date(testimonial.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed pl-13">
                            {testimonial.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {/* 4.1 Write a review card form (Luôn hiển thị để khách hàng đánh giá bất kỳ lúc nào) */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <MessageSquarePlus className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Gửi đánh giá của bạn về gói dịch vụ
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Chia sẻ cảm nhận và mức độ hài lòng về chất lượng hạ tầng, tốc độ và dịch vụ
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Họ và tên của bạn <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="VD: Nguyễn Văn A..."
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Chức vụ / Đơn vị công tác
                      </label>
                      <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="VD: IT Leader, DevOps Engineer..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Mức độ hài lòng (Số sao)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`size-5 ${
                                star <= newRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {newRating === 5
                          ? "Tuyệt vời (5/5)"
                          : newRating === 4
                          ? "Rất tốt (4/5)"
                          : newRating === 3
                          ? "Bình thường (3/5)"
                          : newRating === 2
                          ? "Chưa hài lòng (2/5)"
                          : "Kém (1/5)"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Nội dung nhận xét & đánh giá <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn khi sử dụng gói dịch vụ này..."
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmittingReview}
                      size="sm"
                      className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-5 rounded-xl gap-1.5 shadow-sm"
                    >
                      <MessageSquarePlus className="size-3.5" />
                      {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá ngay"}
                    </Button>
                  </div>
                </form>
              </div>

              {totalReviews === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-2 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                  <div className="size-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <MessageCircle className="size-5" />
                  </div>
                  <p className="font-semibold text-slate-800 text-xs">Chưa có bài đánh giá nào trước đó</p>
                  <p className="text-slate-500 text-[11px] max-w-sm">
                    Hãy là khách hàng đầu tiên chia sẻ cảm nhận trải nghiệm về gói cấu hình này bằng biểu mẫu phía trên!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Related Plans in Same Category (Gợi ý các gói liên quan) */}
        {relatedPlans.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Các gói cấu hình liên quan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Khám phá các mức tài nguyên khác cùng danh mục</p>
              </div>
              {plan.categorySlug && (
                <Button variant="ghost" size="sm" render={<Link href={`/dich-vu/${plan.categorySlug}`} />}>
                  Xem tất cả
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlans.map((rPlan) => {
                const rPriceObj = rPlan.prices?.[0];
                const rPrice = rPriceObj?.price ?? 0;

                return (
                  <Card
                    key={rPlan.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] text-slate-500">
                          {rPlan.categoryName || "Gói dịch vụ"}
                        </Badge>
                        {rPrice > 0 && (
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatVND(rPrice)}/tháng
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{rPlan.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{rPlan.description || "Gói hạ tầng tối ưu."}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {[rPlan.cpu, rPlan.ram, rPlan.storage].filter(Boolean).join(" • ")}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href={`/dich-vu/${rPlan.categorySlug || "cloud"}/${rPlan.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} />}
                        className="text-xs font-semibold"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Service Modal */}
      <OrderServiceModal
        plan={plan}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
