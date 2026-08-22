"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ShoppingCart, Award } from "lucide-react";
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

export interface FeaturedPlanItem {
  id: string;
  name: string;
  description?: string | null;
  categoryName?: string;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  prices?: {
    id: string;
    billingCycle: string;
    price: number;
    promotionDiscountPercentage?: number;
  }[];
  promotion?: {
    discountPercentage: number;
  } | null;
}

interface FeaturedPlansProps {
  initialPlans?: FeaturedPlanItem[];
}

export const FeaturedPlans = ({ initialPlans = [] }: FeaturedPlansProps) => {
  const [orderModalPlan, setOrderModalPlan] = React.useState<OrderModalPlan | null>(null);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // If no plans from API, fallback to default plans
  const displayPlans = initialPlans.length > 0
    ? initialPlans.slice(0, 3)
    : [
        {
          id: "1",
          name: "Cloud Server Basic",
          description: "Phù hợp cho cá nhân, website nhỏ và môi trường kiểm thử.",
          categoryName: "Cloud VPS",
          cpu: "2",
          ram: "4GB",
          storage: "50GB",
          bandwidth: "Unlimited",
          prices: [{ id: "p1", billingCycle: "Monthly", price: 150000 }],
        },
        {
          id: "2",
          name: "Cloud VPS Pro",
          description: "Cấu hình tiêu chuẩn cho doanh nghiệp vừa và nhỏ, ứng dụng web.",
          categoryName: "Cloud VPS",
          cpu: "4",
          ram: "8GB",
          storage: "100GB",
          bandwidth: "Unlimited",
          prices: [{ id: "p2", billingCycle: "Monthly", price: 350000, promotionDiscountPercentage: 15 }],
        },
        {
          id: "3",
          name: "Enterprise Dedicated",
          description: "Hạ tầng hiệu năng cực cao dành riêng cho hệ thống tải lớn.",
          categoryName: "Dedicated Server",
          cpu: "8",
          ram: "16GB",
          storage: "200GB",
          bandwidth: "Unlimited",
          prices: [{ id: "p3", billingCycle: "Monthly", price: 850000 }],
        },
      ];

  return (
    <section
      id="bang-gia"
      className="w-full py-24 md:py-32 border-b border-slate-200/80 bg-slate-50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16 text-center items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Bảng giá cấu hình tối ưu
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading">
            GÓI CẤU HÌNH NỔI BẬT & BÁO GIÁ
          </h2>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed">
            Các gói tài nguyên tiêu chuẩn tối ưu sẵn cho từng nhu cầu quy mô dự án và ngân sách vận hành của doanh nghiệp bạn.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 w-full max-w-6xl items-stretch">
          {displayPlans.map((plan, index) => {
            const isPopular = index === 1 || plan.name.toLowerCase().includes("pro");
            const priceObj = plan.prices?.[0] || { id: "default", billingCycle: "Monthly", price: 200000, promotionDiscountPercentage: 0 };
            const basePrice = priceObj.price;
            const discountPct = (priceObj as any).promotionDiscountPercentage || plan.promotion?.discountPercentage || 0;
            const finalPrice = discountPct > 0 ? Math.round(basePrice * (1 - discountPct / 100)) : basePrice;

            return (
              <Card
                key={plan.id || index}
                className={`relative flex flex-col justify-between transition-all duration-300 rounded-3xl bg-white shadow-md shadow-slate-200/20 ${
                  isPopular
                    ? "border-2 border-primary shadow-xl shadow-primary/5 scale-105 z-10"
                    : "border border-slate-200 hover:border-slate-350"
                }`}
              >
                <article className="flex flex-col justify-between h-full">
                  <div>
                    <CardHeader className="text-left pb-4 pt-8 px-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-[10px] text-slate-600 bg-slate-100 font-semibold">
                          {plan.categoryName || "Cloud Service"}
                        </Badge>
                        {isPopular && (
                          <Badge className="bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Award className="size-3" /> Khuyên dùng
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-xl font-bold text-slate-900 font-heading">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-xs min-h-[35px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                        {plan.description || "Máy chủ đám mây hiệu năng cao tối ưu doanh nghiệp"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="text-left pb-6 px-6 flex-1 flex flex-col">
                      <div className="flex items-baseline gap-1.5 py-4 border-b border-slate-100">
                        <strong className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                          {formatVND(finalPrice)}
                        </strong>
                        <span className="text-xs text-slate-400 font-medium">/ tháng</span>
                      </div>

                      {discountPct > 0 && (
                        <div className="pt-1 text-xs text-rose-600 font-semibold">
                          Giảm {discountPct}% (Gốc: {formatVND(basePrice)})
                        </div>
                      )}

                      {/* Specs List */}
                      <ul className="space-y-3 text-xs mt-6 flex-1 text-slate-700">
                        <li className="flex items-center gap-2.5">
                          <div className="p-0.5 bg-emerald-50 rounded-full text-emerald-600 shrink-0">
                            <Check className="size-3" />
                          </div>
                          <span>Vi xử lý: <strong>{plan.cpu || "2"} Cores CPU</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <div className="p-0.5 bg-emerald-50 rounded-full text-emerald-600 shrink-0">
                            <Check className="size-3" />
                          </div>
                          <span>Bộ nhớ: <strong>{plan.ram || "4GB"} RAM ECC</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <div className="p-0.5 bg-emerald-50 rounded-full text-emerald-600 shrink-0">
                            <Check className="size-3" />
                          </div>
                          <span>Lưu trữ: <strong>{plan.storage || "80GB"} NVMe SSD</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <div className="p-0.5 bg-emerald-50 rounded-full text-emerald-600 shrink-0">
                            <Check className="size-3" />
                          </div>
                          <span>Băng thông: <strong>{plan.bandwidth || "Không giới hạn"}</strong></span>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 flex flex-col gap-2">
                    <Button
                      onClick={() =>
                        setOrderModalPlan({
                          id: plan.id,
                          name: plan.name,
                          description: plan.description || "",
                          cpu: plan.cpu || "",
                          ram: plan.ram || "",
                          storage: plan.storage || "",
                          bandwidth: plan.bandwidth || "",
                          prices: plan.prices || [{ id: "p", billingCycle: "Monthly", price: finalPrice }],
                        })
                      }
                      className={`w-full font-bold text-xs py-5 rounded-xl shadow-xs gap-2 ${
                        isPopular
                          ? "bg-primary hover:bg-primary/95 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <ShoppingCart className="size-3.5" /> Đặt mua ngay
                    </Button>
                  </CardFooter>
                </article>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Order Service Modal */}
      <OrderServiceModal
        plan={orderModalPlan}
        isOpen={!!orderModalPlan}
        onClose={() => setOrderModalPlan(null)}
      />
    </section>
  );
};
