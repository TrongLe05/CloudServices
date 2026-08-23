"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ShoppingCart, Award, QrCode, Headphones } from "lucide-react";
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
import { PlanQrModal } from "@/components/services/PlanQrModal";
import { PlanQrThumbnail } from "@/components/services/PlanQrThumbnail";
import { formatVND } from "@/lib/formatUtils";
import { PlanSpecsList } from "@/components/common/PlanSpecsList";

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
  const [qrModalPlan, setQrModalPlan] = React.useState<{ id: string; name: string; categoryName?: string } | null>(null);

  const displayPlans = initialPlans.slice(0, 3);


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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] text-slate-600 bg-slate-100 font-semibold">
                            {plan.categoryName || "Cloud Service"}
                          </Badge>
                          {isPopular && (
                            <Badge className="bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <Award className="size-3" /> Khuyên dùng
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Plan Title & Direct Embedded QR Code */}
                      <div className="flex items-start justify-between gap-3 pt-1">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-xl font-bold text-slate-900 font-heading">
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="text-xs min-h-[35px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                            {plan.description}
                          </CardDescription>
                        </div>

                        {/* Direct QR Code Thumbnail */}
                        <div 
                          onClick={() => setQrModalPlan({ id: plan.id, name: plan.name, categoryName: plan.categoryName })}
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
                      <PlanSpecsList
                        cpu={plan.cpu}
                        ram={plan.ram}
                        storage={plan.storage}
                        bandwidth={plan.bandwidth}
                        variant="list"
                        className="mt-6 flex-1 text-slate-700"
                      />
                    </CardContent>
                  </div>

                  <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 flex flex-col gap-2">
                    {finalPrice > 0 ? (
                      <Button
                        render={
                          <Link href={`/dat-hang?planId=${plan.id}&cycle=Monthly`} />
                        }
                        className={`w-full font-bold text-xs py-5 rounded-xl shadow-xs gap-2 ${
                          isPopular
                            ? "bg-primary hover:bg-primary/95 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        <ShoppingCart className="size-3.5" /> Đặt mua ngay
                      </Button>
                    ) : (
                      <Button
                        render={
                          <Link href={`/lien-he?service=${encodeURIComponent(plan.name)}`} />
                        }
                        className="w-full font-bold text-xs py-5 rounded-xl shadow-xs gap-2 bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        <Headphones className="size-3.5" /> Liên hệ báo giá
                      </Button>
                    )}
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

      {/* Plan QR Modal */}
      {qrModalPlan && (
        <PlanQrModal
          planId={qrModalPlan.id}
          planName={qrModalPlan.name}
          categoryName={qrModalPlan.categoryName}
          isOpen={!!qrModalPlan}
          onClose={() => setQrModalPlan(null)}
        />
      )}
    </section>
  );
};
