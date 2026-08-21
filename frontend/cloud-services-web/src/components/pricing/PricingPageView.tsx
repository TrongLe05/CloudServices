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
  X,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  ShoppingCart,
  Clock,
  Tag,
  ChevronDown,
  Info,
  HelpCircle,
  Award,
  Layers,
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
import { OrderServiceModal, OrderModalPlan } from "@/components/services/OrderServiceModal";

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
  promotionId?: string | null;
  promotionDiscountPercentage?: number;
}

export interface PricingPlan {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description?: string | null;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  prices: PlanPriceData[];
  promotion?: PromotionData | null;
  isPopular?: boolean;
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
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    categories[0]?.id || "all"
  );
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");
  const [orderModalPlan, setOrderModalPlan] = React.useState<OrderModalPlan | null>(null);

  // Active promotion countdown calculations (Khuyến mãi có thời hạn)
  const activePromotions = React.useMemo(() => {
    const now = new Date();
    return promotions.filter((p) => {
      const end = new Date(p.endDate);
      return p.isActive && end > now;
    });
  }, [promotions]);

  const nearestPromo = activePromotions[0] || null;

  // Filter plans based on category selection
  const filteredPlans = React.useMemo(() => {
    if (selectedCategory === "all") return plans;
    return plans.filter((p) => p.categoryId === selectedCategory);
  }, [plans, selectedCategory]);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Helper to calculate price and promo details for each plan based on billingCycle
  const getPlanPriceInfo = (plan: PricingPlan) => {
    const cyclePriceObj =
      plan.prices.find(
        (p) => p.billingCycle.toLowerCase() === (billingCycle === "yearly" ? "yearly" : "monthly")
      ) ||
      plan.prices[0] || { price: 0, promotionDiscountPercentage: 0 };

    let basePrice = cyclePriceObj.price;
    // If selecting yearly and no explicit yearly price object is set, compute standard 12-month * discount
    if (billingCycle === "yearly" && !plan.prices.some((p) => p.billingCycle.toLowerCase() === "yearly")) {
      const monthlyPrice = plan.prices.find((p) => p.billingCycle.toLowerCase() === "monthly")?.price || basePrice;
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
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:32px_32px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl text-center space-y-4">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary-foreground text-xs py-1 px-3.5 rounded-full inline-flex items-center gap-1.5 font-semibold backdrop-blur-xs"
          >
            <Sparkles className="size-3.5 text-amber-400" />
            Bảng giá dịch vụ Cloud & Hạ tầng máy chủ
          </Badge>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-heading">
            Bảng giá minh bạch, hiệu năng vượt trội
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dễ dàng so sánh chi tiết cấu hình CPU, RAM, NVMe SSD, Băng thông và lựa chọn gói dịch vụ tối ưu ngân sách cho doanh nghiệp của bạn.
          </p>

          {/* Time-Limited Promotion Alert Banner */}
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

          {/* 2. Billing Cycle Switcher */}
          <div className="pt-6 flex justify-center">
            <div className="flex items-center p-1.5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Thanh toán theo tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Thanh toán 1 năm</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  Tiết kiệm 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-10 space-y-12">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 shadow-xs ${
              selectedCategory === "all"
                ? "bg-white text-primary border-2 border-primary ring-2 ring-primary/20 shadow-md"
                : "bg-white/90 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Tất cả danh mục ({plans.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 shadow-xs ${
                selectedCategory === cat.id
                  ? "bg-white text-primary border-2 border-primary ring-2 ring-primary/20 shadow-md"
                  : "bg-white/90 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 4. Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan, idx) => {
            const { basePrice, finalPrice, promoDiscount, hasPromo } = getPlanPriceInfo(plan);
            const isFeatured = idx === 1 || plan.name.toLowerCase().includes("pro") || plan.name.toLowerCase().includes("enterprise");

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 bg-white ${
                  isFeatured
                    ? "border-2 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5 scale-[1.02]"
                    : "border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
                }`}
              >
                {/* Popular / Promo Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Award className="size-3" /> Được chọn nhiều nhất
                    </Badge>
                  </div>
                )}

                <div>
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] text-slate-500 bg-slate-100">
                        {plan.categoryName || "Cloud VPS"}
                      </Badge>
                      {hasPromo && (
                        <Badge className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                          Giảm {promoDiscount}%
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 pt-2 font-heading">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 line-clamp-2 min-h-8">
                      {plan.description || "Máy chủ ảo đám mây hiệu năng cao tối ưu cho doanh nghiệp"}
                    </CardDescription>

                    {/* Price Block */}
                    <div className="pt-4 border-b border-slate-100 pb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {formatVND(finalPrice)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          /{billingCycle === "yearly" ? "năm" : "tháng"}
                        </span>
                      </div>
                      {hasPromo && (
                        <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-400">
                          <span className="line-through">{formatVND(basePrice)}</span>
                          <span className="text-rose-600 font-semibold">Tiết kiệm {formatVND(basePrice - finalPrice)}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {/* Core Hardware Specifications */}
                  <CardContent className="p-6 pt-0 space-y-3 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Thông số tài nguyên:
                    </span>

                    <div className="space-y-2.5 text-slate-700">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="flex items-center gap-2 text-slate-600">
                          <Cpu className="size-4 text-primary" /> CPU Cores
                        </span>
                        <span className="font-bold text-slate-900">{plan.cpu || "2 vCPU Intel Xeon"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="flex items-center gap-2 text-slate-600">
                          <Server className="size-4 text-indigo-500" /> Bộ nhớ RAM
                        </span>
                        <span className="font-bold text-slate-900">{plan.ram || "4 GB ECC DDR4"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="flex items-center gap-2 text-slate-600">
                          <HardDrive className="size-4 text-amber-500" /> Dung lượng NVMe
                        </span>
                        <span className="font-bold text-slate-900">{plan.storage || "80 GB Enterprise"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="flex items-center gap-2 text-slate-600">
                          <Activity className="size-4 text-emerald-500" /> Băng thông
                        </span>
                        <span className="font-bold text-slate-900">{plan.bandwidth || "Không giới hạn"}</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="pt-2 space-y-1.5 text-[11px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>1 Dedicated IPv4 tĩnh riêng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Toàn quyền quản trị Root / Admin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Chống tấn công Anti-DDoS tự động</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Order and Details Buttons */}
                <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                  <Button
                    onClick={() =>
                      setOrderModalPlan({
                        ...plan,
                        prices: plan.prices.map((p) => ({
                          ...p,
                          price: p.price,
                          promotionDiscountPercentage: promoDiscount,
                        })),
                      })
                    }
                    className={`w-full rounded-2xl font-bold text-xs py-5 gap-2 shadow-sm ${
                      isFeatured
                        ? "bg-primary hover:bg-primary/95 text-white shadow-primary/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <ShoppingCart className="size-3.5" /> Đặt mua gói này
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-slate-500 hover:text-slate-900"
                    render={<Link href={`/dich-vu/${plan.categoryName ? plan.categoryName.toLowerCase() : "cloud-vps"}/${plan.id}`} />}
                  >
                    Xem chi tiết thông số <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* 5. Comprehensive Comparison Table (Bảng so sánh chi tiết tất cả các gói) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="size-5 text-primary" /> Bảng so sánh chi tiết cấu hình các gói
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Xem tổng hợp tất cả thông số phần cứng, băng thông, giá cả và tính năng chuyên sâu
              </p>
            </div>
            <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-slate-300 w-fit">
              {filteredPlans.length} gói dịch vụ đang khả dụng
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-4 px-4 min-w-[200px]">Gói dịch vụ</th>
                  <th className="py-4 px-4 min-w-[120px]">Vi xử lý (CPU)</th>
                  <th className="py-4 px-4 min-w-[120px]">Bộ nhớ (RAM)</th>
                  <th className="py-4 px-4 min-w-[140px]">Lưu trữ (SSD NVMe)</th>
                  <th className="py-4 px-4 min-w-[130px]">Băng thông</th>
                  <th className="py-4 px-4 min-w-[120px]">Địa chỉ IPv4</th>
                  <th className="py-4 px-4 min-w-[150px]">Giá ({billingCycle === "yearly" ? "1 năm" : "1 tháng"})</th>
                  <th className="py-4 px-4 min-w-[120px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPlans.map((plan) => {
                  const { basePrice, finalPrice, promoDiscount, hasPromo } = getPlanPriceInfo(plan);
                  return (
                    <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div>
                          <span>{plan.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{plan.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">{plan.cpu || "2 Cores"}</td>
                      <td className="py-4 px-4 font-medium">{plan.ram || "4 GB"}</td>
                      <td className="py-4 px-4 font-medium">{plan.storage || "80 GB NVMe"}</td>
                      <td className="py-4 px-4 font-medium">{plan.bandwidth || "Không giới hạn"}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <Check className="size-3.5" /> 1 IP Dedicated
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {formatVND(finalPrice)}
                          </span>
                          {hasPromo && (
                            <span className="text-[10px] text-rose-600 font-semibold">
                              Giảm {promoDiscount}% (gốc {formatVND(basePrice)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          onClick={() =>
                            setOrderModalPlan({
                              ...plan,
                              prices: plan.prices.map((p) => ({
                                ...p,
                                price: p.price,
                                promotionDiscountPercentage: promoDiscount,
                              })),
                            })
                          }
                          size="sm"
                          className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-xl px-4"
                        >
                          Đặt hàng
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. FAQ & Assurance Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
            <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Cam kết SLA 99.9%</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống trung tâm dữ liệu tiêu chuẩn quốc tế đảm bảo máy chủ luôn online ổn định và liên tục 24/7.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="size-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Khởi tạo tức thì trong 60s</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ngay sau khi xác nhận đơn hàng, toàn bộ thông tin quản trị IP và password sẽ được gửi tự động qua email.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
            <div className="size-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Hỗ trợ kỹ thuật 24/7/365</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đội ngũ chuyên gia kỹ sư hạ tầng luôn sẵn sàng hỗ trợ trực tuyến qua ticket, live chat và hotline.
            </p>
          </div>
        </div>
      </div>

      {/* Order Service Modal */}
      <OrderServiceModal
        plan={orderModalPlan}
        isOpen={!!orderModalPlan}
        onClose={() => setOrderModalPlan(null)}
      />
    </div>
  );
}
