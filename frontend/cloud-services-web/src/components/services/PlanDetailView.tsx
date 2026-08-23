"use client";

import * as React from "react";
import Link from "next/link";
import {
  Server,
  Zap,
  Check,
  ShieldCheck,
  Headphones,
  ShoppingCart,
  PhoneCall,
  Share2,
  CheckCircle2,
  HelpCircle,
  Award,
  Star,
  User,
  ThumbsUp,
  MessageCircle,
  Info,
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
import { PlanQrModal } from "./PlanQrModal";
import { PlanQrThumbnail } from "./PlanQrThumbnail";
import { PlanDetailSpecifications } from "./PlanDetailSpecifications";
import { PlanDetailRelatedPlans } from "./PlanDetailRelatedPlans";
import { ServicePlanItem } from "@/types/plans.types";
import { formatVND } from "@/lib/formatUtils";
import { toast } from "@/components/ui/toast";

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

interface PlanDetailViewProps {
  plan: ServicePlanItem;
  relatedPlans?: ServicePlanItem[];
  testimonials?: TestimonialItem[];
}

export function PlanDetailView({
  plan,
  relatedPlans = [],
  testimonials = [],
}: PlanDetailViewProps) {
  const [selectedCycle, setSelectedCycle] = React.useState<string>("monthly");
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const [qrModalPlan, setQrModalPlan] = React.useState<{ id: string; name: string; categoryName?: string } | null>(null);
  const [activeTab, setActiveTab] = React.useState<"specs" | "features" | "faq" | "reviews">("specs");

  // Price calculations
  const currentPriceObj = plan.prices?.find((p) => p.billingCycle.toLowerCase() === selectedCycle.toLowerCase()) || plan.prices?.[0];
  const rawPriceNum = Number(currentPriceObj?.price ?? 0);
  const isContactPrice = !currentPriceObj || isNaN(rawPriceNum) || rawPriceNum <= 0;
  const basePrice = isContactPrice ? 0 : rawPriceNum;
  const discountPercent = isContactPrice ? 0 : (currentPriceObj?.promotionDiscountPercentage ?? 0);
  const discountedPrice = discountPercent > 0 ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;

  const billingCycles = [
    { id: "monthly", label: "Hàng tháng (1 Tháng)", badge: null },
    { id: "yearly", label: "Hàng năm (1 Năm)", badge: "Ưu đãi 20%" },
  ];

  const activeTestimonials = testimonials.filter((t) => t.isActive);
  const totalReviews = activeTestimonials.length;
  const averageRating =
    totalReviews > 0
      ? (activeTestimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
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
    <main className="min-h-screen bg-slate-50/50 pb-20 font-sans">
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
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. Main E-Commerce Product Box (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Showcase & Specs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 size-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 size-48 bg-indigo-600/15 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <Badge className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1">
                  <span className="size-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                  Sẵn sàng kích hoạt
                </Badge>
                <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/80 text-xs">
                  {plan.categoryName || "Enterprise Cloud"}
                </Badge>
              </div>

              {/* Server Illustration / QR Code */}
              <div className="my-8 flex flex-col items-center justify-center relative z-10">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center">
                  <div
                    onClick={() => setQrModalPlan({ id: plan.id, name: plan.name, categoryName: plan.categoryName })}
                    className="cursor-pointer group/zoom relative"
                    title="Nhấp để xem mã QR chuẩn"
                  >
                    <PlanQrThumbnail planId={plan.id} planName={plan.name} size="lg" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-medium">
                    Quét mã QR để mở trực tiếp
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 relative z-10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>SLA 99.99% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="size-4 text-primary" />
                  <span>Hỗ trợ kỹ thuật 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Checkout Actions (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border-slate-200/90 shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {plan.categoryName || "Dịch vụ đám mây"}
                    </span>
                    <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                      {plan.description || "Hạ tầng lưu trữ và máy chủ đám mây tốc độ cao."}
                    </CardDescription>
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
                    {!isContactPrice ? (
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight font-heading">
                          {formatVND(discountedPrice)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          /{selectedCycle === "monthly" ? "tháng" : "năm"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                        Liên hệ báo giá
                      </span>
                    )}

                    {!isContactPrice && discountPercent > 0 && (
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
                {!isContactPrice ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Chọn chu kỳ thanh toán:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {billingCycles.map((cycle) => {
                        const isSelected = selectedCycle === cycle.id;
                        return (
                          <button
                            key={cycle.id}
                            type="button"
                            onClick={() => setSelectedCycle(cycle.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[72px] ${
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
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                    <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Gói dịch vụ cấu hình linh hoạt theo yêu cầu. Quý khách vui lòng gửi thông tin để đội ngũ kỹ sư tư vấn và báo mức giá tốt nhất.
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-8 pt-0 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                {!isContactPrice ? (
                  <Button
                    render={
                      <Link
                        href={`/dat-hang?planId=${plan.id}&cycle=${
                          selectedCycle === "yearly" ? "Yearly" : "Monthly"
                        }`}
                      />
                    }
                    className="w-full sm:flex-1 h-12 rounded-2xl font-bold text-sm bg-primary text-white shadow-md hover:bg-primary/95 gap-2"
                  >
                    <ShoppingCart className="size-4" />
                    <span>Đăng ký ngay</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full sm:flex-1 h-12 rounded-2xl font-bold text-sm bg-slate-900 text-white shadow-md hover:bg-slate-800 gap-2"
                  >
                    <PhoneCall className="size-4" />
                    <span>Gửi yêu cầu báo giá</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl font-semibold text-xs border-slate-200 hover:bg-slate-50 gap-2"
                >
                  <HelpCircle className="size-4 text-slate-400" />
                  <span>Tư vấn thêm</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* 3. Detailed Specifications & Architecture Highlights */}
        <PlanDetailSpecifications plan={plan} />

        {/* 4. Related Plans Catalog */}
        <PlanDetailRelatedPlans
          plans={relatedPlans}
          onOpenQr={(p) => setQrModalPlan(p)}
        />
      </div>

      {/* Direct Request Consultation Modal */}
      <OrderServiceModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        plan={{
          id: plan.id,
          name: plan.name,
          categoryName: plan.categoryName,
          prices: plan.prices,
        }}
      />

      {/* Plan QR Code Viewer Modal */}
      {qrModalPlan && (
        <PlanQrModal
          isOpen={Boolean(qrModalPlan)}
          onClose={() => setQrModalPlan(null)}
          planId={qrModalPlan.id}
          planName={qrModalPlan.name}
          categoryName={qrModalPlan.categoryName}
        />
      )}
    </main>
  );
}
