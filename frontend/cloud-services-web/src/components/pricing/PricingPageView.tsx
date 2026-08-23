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
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  ShoppingCart,
  Layers,
  Award,
  Globe,
  Database,
  FolderKanban,
  QrCode,
  Headphones,
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OrderServiceModal, OrderModalPlan } from "@/components/services/OrderServiceModal";
import { PlanQrModal } from "@/components/services/PlanQrModal";
import { PlanQrThumbnail } from "@/components/services/PlanQrThumbnail";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface PromotionData {
  id: string;
  name: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PlanPriceData {
  id: string;
  planId: string;
  billingCycle: string;
  price: number;
  promotionDiscountPercentage?: number;
}

export interface PricingPlan {
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
  prices: PlanPriceData[];
  promotion?: PromotionData | null;
}

interface PricingPageViewProps {
  categories: CategoryData[];
  plans: PricingPlan[];
  promotions: PromotionData[];
}

export function PricingPageView({
  categories,
  plans,
  promotions,
}: PricingPageViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");
  const [orderModalPlan, setOrderModalPlan] = React.useState<OrderModalPlan | null>(null);
  const [qrModalPlan, setQrModalPlan] = React.useState<{ id: string; name: string; categoryName?: string } | null>(null);

  // Active promotion countdown calculations (Khuyến mãi có thời hạn)
  const activePromotions = React.useMemo(() => {
    const now = new Date();
    return promotions.filter((p) => {
      const end = new Date(p.endDate);
      return p.isActive && end > now;
    });
  }, [promotions]);

  const nearestPromo = activePromotions[0] || null;

  // Group plans by category (Phân chia từng dịch vụ riêng biệt)
  const groupedCategories = React.useMemo(() => {
    // If a specific category is selected, only show that category
    const activeCats =
      selectedCategory === "all"
        ? categories
        : categories.filter((c) => c.id === selectedCategory);

    return activeCats
      .map((cat) => {
        const catPlans = plans.filter((p) => p.categoryId === cat.id);
        return {
          category: cat,
          plans: catPlans,
        };
      })
      .filter((group) => group.plans.length > 0);
  }, [categories, plans, selectedCategory]);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Helper to calculate price and promo details for each plan based on billingCycle
  const getPlanPriceInfo = (plan: PricingPlan) => {
    const cyclePriceObj =
      plan.prices?.find(
        (p) => p.billingCycle.toLowerCase() === (billingCycle === "yearly" ? "yearly" : "monthly")
      ) ||
      plan.prices?.[0] || { price: 0, promotionDiscountPercentage: 0 };

    let basePrice = cyclePriceObj.price || 0;
    // If selecting yearly and no explicit yearly price object is set, compute standard 12-month * discount
    if (billingCycle === "yearly" && !plan.prices?.some((p) => p.billingCycle.toLowerCase() === "yearly")) {
      const monthlyPrice = plan.prices?.find((p) => p.billingCycle.toLowerCase() === "monthly")?.price || basePrice;
      basePrice = monthlyPrice * 12 * 0.8; // 20% discount on 12 months
    }

    // Determine promotion discount percentage
    let promoDiscount = cyclePriceObj.promotionDiscountPercentage || 0;
    if (plan.promotion && plan.promotion.discountPercentage > 0) {
      promoDiscount = Math.max(promoDiscount, plan.promotion.discountPercentage);
    } else if (nearestPromo && nearestPromo.discountPercentage > 0) {
      promoDiscount = Math.max(promoDiscount, nearestPromo.discountPercentage);
    }

    const finalPrice = promoDiscount > 0 ? Math.round(basePrice * (1 - promoDiscount / 100)) : basePrice;

    return {
      basePrice,
      finalPrice,
      promoDiscount,
      hasPromo: promoDiscount > 0,
    };
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Header Banner */}
      <header className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:32px_32px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-4xl text-center space-y-4">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary-foreground text-xs py-1 px-3.5 rounded-full inline-flex items-center gap-1.5 font-semibold backdrop-blur-xs"
          >
            <Sparkles className="size-3.5 text-amber-400" />
            Bảng giá dịch vụ Cloud & Hạ tầng máy chủ
          </Badge>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight font-heading">
            Bảng Giá Theo Từng Dịch Vụ
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Phân chia chi tiết từng cụm dịch vụ Điện toán Đám mây. So sánh cấu hình CPU, RAM, SSD NVMe, Băng thông và đặt hàng từng gói nhanh chóng.
          </p>

          {/* Time-Limited Promotion Alert Banner (Khuyến mãi có thời hạn) */}
          {nearestPromo && (
            <div className="mt-6 inline-flex items-center gap-3 p-3.5 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs backdrop-blur-md animate-pulse">
              <Flame className="size-4 text-amber-400 shrink-0" />
              <span>
                <strong>Khuyến mãi có thời hạn:</strong> {nearestPromo.name} - Giảm thêm{" "}
                <span className="font-extrabold text-amber-200">
                  {nearestPromo.discountPercentage}%
                </span>{" "}
                (Hạn chót: {new Date(nearestPromo.endDate).toLocaleDateString("vi-VN")})
              </span>
            </div>
          )}

          {/* 2. Billing Cycle Switcher (Chu kỳ Tháng / Năm) */}
          <section className="pt-6 flex justify-center">
            <div className="flex items-center p-1.5 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl">
              <Button
                type="button"
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-xl text-xs font-bold px-6 py-2 h-auto ${
                  billingCycle === "monthly"
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                Thanh toán theo tháng
              </Button>
              <Button
                type="button"
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-xl text-xs font-bold px-6 py-2 h-auto flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <span>Thanh toán 1 năm</span>
                <Badge className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs border-0 hover:bg-amber-400">
                  Tiết kiệm 20%
                </Badge>
              </Button>
            </div>
          </section>
        </div>
      </header>

      {/* 3. Main Content Container */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-10 space-y-16">
        
        {/* Category Navigation Pills */}
        <nav aria-label="Lọc theo dịch vụ" className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <Button
            type="button"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={`rounded-2xl text-xs font-bold px-5 h-10 shrink-0 shadow-xs ${
              selectedCategory === "all"
                ? "bg-white text-primary border-2 border-primary ring-2 ring-primary/20 shadow-md hover:bg-white hover:text-primary"
                : "bg-white/90 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-white"
            }`}
          >
            Tất cả dịch vụ ({plans.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              type="button"
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-2xl text-xs font-bold px-5 h-10 shrink-0 shadow-xs ${
                selectedCategory === cat.id
                  ? "bg-white text-primary border-2 border-primary ring-2 ring-primary/20 shadow-md hover:bg-white hover:text-primary"
                  : "bg-white/90 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-white"
              }`}
            >
              {cat.name}
            </Button>
          ))}
        </nav>

        {/* 4. Service Categories Sections with Carousel */}
        {groupedCategories.map(({ category, plans: catPlans }) => (
          <section
            key={category.id}
            aria-labelledby={`category-${category.id}`}
            className="space-y-6 pt-4"
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <FolderKanban className="size-4" />
                  </span>
                  <h2
                    id={`category-${category.id}`}
                    className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading"
                  >
                    {category.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl pl-10.5">
                  {category.description ||
                    `Danh sách các gói dịch vụ ${category.name} chuyên biệt với cấu hình tối ưu và khả năng mở rộng linh hoạt.`}
                </p>
              </div>

              <Badge variant="outline" className="text-xs px-3 py-1 font-medium border-slate-300 w-fit shrink-0">
                {catPlans.length} gói dịch vụ
              </Badge>
            </div>

            {/* Carousel Giao diện thẻ dịch vụ */}
            <div className="relative px-2">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 pt-4 pb-4">
                  {catPlans.map((plan, idx) => {
                    const { basePrice, finalPrice, promoDiscount, hasPromo } = getPlanPriceInfo(plan);
                    const isFeatured =
                      idx === 1 ||
                      plan.name.toLowerCase().includes("pro") ||
                      plan.name.toLowerCase().includes("enterprise");

                    return (
                      <CarouselItem
                        key={plan.id}
                        className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <Card
                          className={`h-full relative flex flex-col justify-between rounded-3xl transition-all duration-300 bg-white ${
                            isFeatured
                              ? "border-2 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5"
                              : "border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
                          }`}
                        >
                          <article className="flex flex-col justify-between h-full">
                            <div>
                              <CardHeader className="p-6 pb-4 space-y-3">
                                {/* Badges Row */}
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge variant="secondary" className="text-[10px] text-slate-600 bg-slate-100 font-semibold">
                                      {plan.categoryName || category.name}
                                    </Badge>
                                    {isFeatured && (
                                      <Badge className="bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 whitespace-nowrap">
                                        <Award className="size-3 shrink-0" /> Phổ biến & Khuyên dùng
                                      </Badge>
                                    )}
                                  </div>

                                  {hasPromo && (
                                    <Badge className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold shrink-0">
                                      Giảm {promoDiscount}%
                                    </Badge>
                                  )}
                                </div>

                                {/* Plan Title & Embedded QR Code */}
                                <div className="flex items-start justify-between gap-3 pt-1">
                                  <div className="space-y-1 flex-1">
                                    <CardTitle className="text-lg font-bold text-slate-900 font-heading">
                                      {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-500 line-clamp-2 min-h-8">
                                      {plan.description}
                                    </CardDescription>
                                  </div>

                                  {/* Direct QR Code Thumbnail (Click to enlarge) */}
                                  <div 
                                    onClick={() => setQrModalPlan({ id: plan.id, name: plan.name, categoryName: plan.categoryName || category.name })}
                                    className="cursor-pointer group/zoom relative shrink-0"
                                    title="Nhấp để phóng to mã QR"
                                  >
                                    <PlanQrThumbnail
                                      planId={plan.id}
                                      planName={plan.name}
                                      size="sm"
                                    />
                                    <span className="text-[9px] text-slate-400 font-medium block text-center mt-0.5 group-hover/zoom:text-primary">
                                      Quét mã
                                    </span>
                                  </div>
                                </div>

                                {/* Price Block */}
                                <section aria-label="Giá gói" className="pt-4 border-b border-slate-100 pb-4">
                                  <div className="flex items-baseline gap-1.5">
                                    <strong className="text-2xl font-black text-slate-900 font-sans">
                                      {formatVND(finalPrice)}
                                    </strong>
                                    <span className="text-xs text-slate-500 font-medium">
                                      /{billingCycle === "yearly" ? "năm" : "tháng"}
                                    </span>
                                  </div>
                                  {hasPromo && (
                                    <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-400">
                                      <span className="line-through">{formatVND(basePrice)}</span>
                                      <span className="text-rose-600 font-semibold">
                                        Tiết kiệm {formatVND(basePrice - finalPrice)}
                                      </span>
                                    </div>
                                  )}
                                </section>
                              </CardHeader>

                              {/* Core Hardware Specifications */}
                              {(plan.cpu || plan.ram || plan.storage || plan.bandwidth) && (
                                <CardContent className="p-6 pt-0 space-y-3 text-xs">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Cấu hình phần cứng:
                                  </span>

                                  <div className="space-y-2 text-slate-700">
                                    {plan.cpu && (
                                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="flex items-center gap-2 text-slate-600 font-medium text-[11px]">
                                          <Cpu className="size-3.5 text-primary" /> CPU Cores
                                        </span>
                                        <strong className="font-bold text-slate-900 text-xs">{plan.cpu}</strong>
                                      </div>
                                    )}

                                    {plan.ram && (
                                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="flex items-center gap-2 text-slate-600 font-medium text-[11px]">
                                          <Server className="size-3.5 text-indigo-500" /> Bộ nhớ RAM
                                        </span>
                                        <strong className="font-bold text-slate-900 text-xs">{plan.ram}</strong>
                                      </div>
                                    )}

                                    {plan.storage && (
                                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="flex items-center gap-2 text-slate-600 font-medium text-[11px]">
                                          <HardDrive className="size-3.5 text-amber-500" /> Lưu trữ
                                        </span>
                                        <strong className="font-bold text-slate-900 text-xs">{plan.storage}</strong>
                                      </div>
                                    )}

                                    {plan.bandwidth && (
                                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="flex items-center gap-2 text-slate-600 font-medium text-[11px]">
                                          <Activity className="size-3.5 text-emerald-500" /> Băng thông
                                        </span>
                                        <strong className="font-bold text-slate-900 text-xs">{plan.bandwidth}</strong>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              )}
                            </div>

                            {/* Order Button */}
                            <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                              {finalPrice > 0 ? (
                                <Button
                                  render={
                                    <Link href={`/dat-hang?planId=${plan.id}&cycle=${billingCycle}`} />
                                  }
                                  className={`w-full rounded-2xl font-bold text-xs py-4.5 gap-2 shadow-sm ${
                                    isFeatured
                                      ? "bg-primary hover:bg-primary/95 text-white shadow-primary/20"
                                      : "bg-slate-900 hover:bg-slate-800 text-white"
                                  }`}
                                >
                                  <ShoppingCart className="size-3.5" /> Đặt mua gói này
                                </Button>
                              ) : (
                                <Button
                                  render={
                                    <Link href={`/lien-he?service=${encodeURIComponent(plan.name)}`} />
                                  }
                                  className="w-full rounded-2xl font-bold text-xs py-4.5 gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                                >
                                  <Headphones className="size-3.5" /> Liên hệ báo giá
                                </Button>
                              )}
                            </CardFooter>
                          </article>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Bảng so sánh mini theo từng danh mục */}
            <Card className="rounded-3xl border-slate-200 p-6 shadow-xs bg-white overflow-hidden">
              <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="size-4 text-primary" /> Bảng so sánh thông số: {category.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Đối chiếu nhanh cấu hình CPU, RAM, Lưu trữ và giá của các gói thuộc nhóm {category.name}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 min-w-[180px]">Gói dịch vụ</th>
                      <th className="py-3 px-4 min-w-[110px]">CPU</th>
                      <th className="py-3 px-4 min-w-[110px]">RAM</th>
                      <th className="py-3 px-4 min-w-[120px]">Lưu trữ</th>
                      <th className="py-3 px-4 min-w-[120px]">Băng thông</th>
                      <th className="py-3 px-4 min-w-[140px]">Giá ({billingCycle === "yearly" ? "1 năm" : "1 tháng"})</th>
                      <th className="py-3 px-4 min-w-[110px] text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {catPlans.map((plan) => {
                      const { basePrice, finalPrice, promoDiscount, hasPromo } = getPlanPriceInfo(plan);
                      return (
                        <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{plan.name}</td>
                          <td className="py-3 px-4 font-medium">{plan.cpu || "—"}</td>
                          <td className="py-3 px-4 font-medium">{plan.ram || "—"}</td>
                          <td className="py-3 px-4 font-medium">{plan.storage || "—"}</td>
                          <td className="py-3 px-4 font-medium">{plan.bandwidth || "—"}</td>
                          <td className="py-3 px-4">
                            <strong className="font-bold text-slate-900 text-xs block">
                              {formatVND(finalPrice)}
                            </strong>
                            {hasPromo && (
                              <span className="text-[10px] text-rose-600 font-semibold">
                                Giảm {promoDiscount}%
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {finalPrice > 0 ? (
                              <Button
                                render={
                                  <Link href={`/dat-hang?planId=${plan.id}&cycle=${billingCycle}`} />
                                }
                                size="sm"
                                className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-xl px-3 h-8 gap-1 shadow-xs"
                              >
                                <ShoppingCart className="size-3" /> Đặt mua
                              </Button>
                            ) : (
                              <Button
                                render={
                                  <Link href={`/lien-he?service=${encodeURIComponent(plan.name)}`} />
                                }
                                size="sm"
                                variant="outline"
                                className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl px-3 h-8 gap-1 shadow-2xs"
                              >
                                <Headphones className="size-3" /> Báo giá
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>
        ))}

        {/* 5. Assurance Badges Grid */}
        <section aria-label="Cam kết chất lượng dịch vụ" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Card className="rounded-3xl bg-white border-slate-200 p-6 space-y-2">
            <CardHeader className="p-0 pb-2">
              <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle className="font-bold text-slate-900 text-sm pt-2">Cam kết Uptime SLA 99.9%</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs text-slate-500 leading-relaxed">
                Hệ thống trung tâm dữ liệu tiêu chuẩn quốc tế Tier III đảm bảo máy chủ luôn online ổn định và liên tục 24/7.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border-slate-200 p-6 space-y-2">
            <CardHeader className="p-0 pb-2">
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="size-5" />
              </div>
              <CardTitle className="font-bold text-slate-900 text-sm pt-2">Khởi tạo tức thì trong 60s</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs text-slate-500 leading-relaxed">
                Ngay sau khi xác nhận đơn hàng, toàn bộ thông tin quản trị IP và password sẽ được gửi tự động qua email.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border-slate-200 p-6 space-y-2">
            <CardHeader className="p-0 pb-2">
              <div className="size-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="size-5" />
              </div>
              <CardTitle className="font-bold text-slate-900 text-sm pt-2">Hỗ trợ kỹ thuật 24/7/365</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs text-slate-500 leading-relaxed">
                Đội ngũ chuyên gia kỹ sư hạ tầng luôn sẵn sàng hỗ trợ trực tuyến qua ticket, live chat và hotline.
              </CardDescription>
            </CardContent>
          </Card>
        </section>
      </section>

      {/* Order Service Modal */}
      <OrderServiceModal
        plan={orderModalPlan}
        isOpen={!!orderModalPlan}
        onClose={() => setOrderModalPlan(null)}
      />

      {/* Plan QR Code Modal */}
      {qrModalPlan && (
        <PlanQrModal
          planId={qrModalPlan.id}
          planName={qrModalPlan.name}
          categoryName={qrModalPlan.categoryName}
          isOpen={!!qrModalPlan}
          onClose={() => setQrModalPlan(null)}
        />
      )}
    </main>
  );
}
