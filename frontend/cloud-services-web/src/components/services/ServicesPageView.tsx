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
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slugUtils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { OrderServiceModal, OrderModalPlan } from "./OrderServiceModal";
import { PlanQrModal } from "./PlanQrModal";
import { PlanQrThumbnail } from "./PlanQrThumbnail";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
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
  prices?: {
    id: string;
    billingCycle: string;
    price: number;
    promotionDiscountPercentage?: number;
  }[];
}

interface ServicesPageViewProps {
  categories: ServiceCategory[];
  plans: ServicePlan[];
  selectedCategorySlug?: string;
}

export function ServicesPageView({
  categories,
  plans,
  selectedCategorySlug,
}: ServicesPageViewProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>(
    selectedCategorySlug || "all"
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");
  const [orderModalPlan, setOrderModalPlan] = React.useState<OrderModalPlan | null>(null);
  const [qrModalPlan, setQrModalPlan] = React.useState<{ id: string; name: string; categoryName?: string } | null>(null);

  // Sync if slug changes via navigation
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Filter plans based on activeCategory and searchTerm
  const filteredPlans = React.useMemo(() => {
    return plans.filter((plan) => {
      const matchCategory =
        activeCategory === "all" ||
        plan.categoryId === activeCategory ||
        plan.categorySlug === activeCategory;

      const matchSearch =
        !searchTerm.trim() ||
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.cpu && plan.cpu.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.ram && plan.ram.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.storage && plan.storage.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [plans, activeCategory, searchTerm]);

  // Find active category details
  const activeCategoryObj = categories.find(
    (c) => c.slug === activeCategory || c.id === activeCategory
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. Hero Header Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 md:py-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 -z-10" />
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px] -z-10" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center space-y-6">
          <Badge
            variant="outline"
            className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 mr-1.5 text-indigo-400" />
            Hệ sinh thái Đám mây Doanh nghiệp
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Giải Pháp Điện Toán Đám Mây & Máy Chủ Hiệu Năng Cao
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Hạ tầng thế hệ mới sử dụng 100% ổ cứng NVMe Enterprise, băng thông tốc độ cao và cam kết Uptime 99.99% đáp ứng mọi quy mô hệ thống.
          </p>

          {/* Quick Features Row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl text-left border-t border-slate-800/80 w-full">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="size-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white block">Khởi tạo tức thì</span>
                <span className="text-slate-400">Sẵn sàng dưới 60s</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white block">Anti-DDoS Pro</span>
                <span className="text-slate-400">Bảo vệ Layer 3, 4 & 7</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Activity className="size-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white block">SLA 99.99%</span>
                <span className="text-slate-400">Cam kết ổn định</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Headphones className="size-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white block">Hỗ trợ 24/7/365</span>
                <span className="text-slate-400">Kỹ sư trực tiếp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Catalog & Filter Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Controls: Category Pills & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("all")}
              className="rounded-full text-xs font-semibold px-4 shrink-0"
            >
              Tất cả dịch vụ ({plans.length})
            </Button>
            {categories.map((cat) => {
              const count = plans.filter((p) => p.categoryId === cat.id).length;
              const isSelected = activeCategory === cat.slug || activeCategory === cat.id;

              return (
                <Button
                  key={cat.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.slug)}
                  className="rounded-full text-xs font-semibold px-4 shrink-0"
                >
                  {cat.name} {count > 0 && `(${count})`}
                </Button>
              );
            })}
          </div>

          {/* Search box & Billing Cycle Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Tìm gói hoặc cấu hình..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-full bg-white"
              />
            </div>

            <div className="inline-flex rounded-full p-1 bg-slate-200/70 border border-slate-200 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
                  billingCycle === "yearly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Năm <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">-20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Category Header (If filtered) */}
        {activeCategoryObj && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Server className="size-4" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">{activeCategoryObj.name}</h2>
              </div>
              {activeCategoryObj.description && (
                <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
                  {activeCategoryObj.description}
                </p>
              )}
            </div>
            <div className="text-xs text-slate-400 font-medium shrink-0">
              Hiển thị {filteredPlans.length} gói dịch vụ phù hợp
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="size-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Server className="size-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-lg font-bold text-slate-800">Không tìm thấy gói dịch vụ</h3>
              <p className="text-xs text-slate-500">
                Hiện tại chưa có gói dịch vụ nào khớp với bộ lọc hoặc từ khóa &quot;{searchTerm}&quot;. Vui lòng thử tìm kiếm khác hoặc xem toàn bộ danh mục.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory("all");
                setSearchTerm("");
              }}
              className="mt-2"
            >
              Xem tất cả dịch vụ
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => {
              // Find matching price based on cycle
              const priceObj = plan.prices?.find((p) => p.billingCycle.toLowerCase() === billingCycle.toLowerCase()) || plan.prices?.[0];
              const basePrice = priceObj?.price ?? 0;
              const discount = priceObj?.promotionDiscountPercentage ?? 0;
              const displayPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

              return (
                <Card
                  key={plan.id}
                  className="relative flex flex-col justify-between transition-all duration-300 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 group"
                >
                  {/* Category Pill Tag */}
                  <div className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[11px] font-semibold text-slate-600 bg-slate-100">
                          {plan.categoryName || "Dịch vụ Đám mây"}
                        </Badge>
                        {discount > 0 && (
                          <Badge className="bg-red-500 hover:bg-red-600 text-[10px] font-bold text-white">
                            Ưu đãi -{discount}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Plan Title & Direct Embedded QR Code */}
                    <div className="flex items-start justify-between gap-3 mt-3">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                          <Link href={`/dich-vu/${plan.categorySlug || slugify(plan.categoryName || "cloud")}/${slugify(plan.name)}`}>
                            {plan.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                          {plan.description}
                        </CardDescription>
                      </div>

                      {/* Direct QR Code Thumbnail */}
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQrModalPlan({ id: plan.id, name: plan.name, categoryName: plan.categoryName });
                        }}
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
                  </div>

                  {/* Pricing Box */}
                  <div className="px-6 py-4 bg-slate-50/70 border-y border-slate-100 flex items-baseline justify-between">
                    <div>
                      {basePrice > 0 ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {formatVND(displayPrice)}
                          </span>
                          <span className="text-xs text-slate-400">
                            /{billingCycle === "monthly" ? "tháng" : "năm"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-slate-900">Liên hệ báo giá</span>
                      )}
                      {discount > 0 && (
                        <span className="text-xs text-slate-400 line-through block mt-0.5">
                          {formatVND(basePrice)}
                        </span>
                      )}
                    </div>

                    <div className="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-2xs">
                      <Cpu className="size-4" />
                    </div>
                  </div>

                  {/* Specs List */}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 text-xs">
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                        Thông số kỹ thuật:
                      </span>
                      <ul className="space-y-2.5">
                        {plan.cpu && (
                          <li className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-slate-100/80">
                            <span className="flex items-center gap-2 text-slate-500">
                              <Cpu className="size-3.5 text-indigo-500" />
                              CPU
                            </span>
                            <span className="font-semibold text-slate-800">{plan.cpu}</span>
                          </li>
                        )}
                        {plan.ram && (
                          <li className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-slate-100/80">
                            <span className="flex items-center gap-2 text-slate-500">
                              <Activity className="size-3.5 text-emerald-500" />
                              Bộ nhớ RAM
                            </span>
                            <span className="font-semibold text-slate-800">{plan.ram}</span>
                          </li>
                        )}
                        {plan.storage && (
                          <li className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-slate-100/80">
                            <span className="flex items-center gap-2 text-slate-500">
                              <HardDrive className="size-3.5 text-blue-500" />
                              Lưu trữ NVMe
                            </span>
                            <span className="font-semibold text-slate-800">{plan.storage}</span>
                          </li>
                        )}
                        {plan.bandwidth && (
                          <li className="flex items-center justify-between text-slate-600 pb-1.5">
                            <span className="flex items-center gap-2 text-slate-500">
                              <Zap className="size-3.5 text-amber-500" />
                              Băng thông
                            </span>
                            <span className="font-semibold text-slate-800">{plan.bandwidth}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>

                  {/* Actions */}
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      render={
                        <Link href={`/dich-vu/${plan.categorySlug || slugify(plan.categoryName || "cloud")}/${slugify(plan.name)}`} />
                      }
                      className="flex-1 text-xs font-semibold rounded-xl"
                    >
                      Chi tiết
                    </Button>
                    {displayPrice > 0 ? (
                      <Button
                        render={
                          <Link href={`/dat-hang?planId=${plan.id}&cycle=${billingCycle}`} />
                        }
                        className="flex-1 bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-5 rounded-xl shadow-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="size-4" />
                        Đăng ký
                      </Button>
                    ) : (
                      <Button
                        render={
                          <Link href={`/lien-he?service=${encodeURIComponent(plan.name)}`} />
                        }
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-5 rounded-xl shadow-sm flex items-center justify-center gap-2"
                      >
                        <Headphones className="size-4" />
                        Báo giá
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
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
    </div>
  );
}
