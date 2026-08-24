import * as React from "react";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServicePlanItem } from "@/types/plans.types";
import { formatVND } from "@/lib/formatUtils";
import { PlanSpecsList } from "@/components/common/PlanSpecsList";

export interface CheckoutOrderSummaryProps {
  selectedPlan: ServicePlanItem | null;
  selectedCycle: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
  currentStep: number;
}

export function CheckoutOrderSummary({
  selectedPlan,
  selectedCycle,
  onSubmit,
  isSubmitting = false,
  currentStep,
}: CheckoutOrderSummaryProps) {
  const currentPriceObj = selectedPlan?.prices?.find(
    (p) => p.billingCycle.toLowerCase() === selectedCycle.toLowerCase()
  ) || selectedPlan?.prices?.[0];

  const rawPrice = currentPriceObj?.price || 0;
  const promoDiscountPct = currentPriceObj?.promotionDiscountPercentage || selectedPlan?.promotion?.discountPercentage || 0;
  
  // Chiết khấu khuyến mãi gói
  const promoDiscountAmount = (rawPrice * promoDiscountPct) / 100;
  
  const finalPrice = Math.max(0, rawPrice - promoDiscountAmount);

  return (
    <aside className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Tóm tắt đơn hàng
        </span>
        <h3 className="text-lg font-bold text-slate-900 font-heading mt-0.5">
          {selectedPlan ? selectedPlan.name : "Chưa chọn gói dịch vụ"}
        </h3>
        {selectedPlan?.categoryName && (
          <Badge variant="secondary" className="text-[10px] mt-1 font-semibold text-slate-600 bg-slate-100">
            {selectedPlan.categoryName}
          </Badge>
        )}
      </div>

      {/* Thông số kỹ thuật nhanh */}
      {selectedPlan && (
        <PlanSpecsList
          cpu={selectedPlan.cpu}
          ram={selectedPlan.ram}
          storage={selectedPlan.storage}
          bandwidth={selectedPlan.bandwidth}
          variant="compact"
        />
      )}

      {/* Bảng tính chi phí */}
      <dl className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-slate-500">
          <dt>Giá gốc cấu hình:</dt>
          <dd className="font-semibold text-slate-800">
            {rawPrice > 0 ? formatVND(rawPrice) : "Báo giá riêng"}
          </dd>
        </div>

        {promoDiscountPct > 0 && (
          <div className="flex items-center justify-between text-rose-600">
            <dt>Khuyến mãi gói (-{promoDiscountPct}%):</dt>
            <dd className="font-bold">-{formatVND(promoDiscountAmount)}</dd>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-500">
          <dt>Chu kỳ thanh toán:</dt>
          <dd className="font-semibold text-slate-800">
            {selectedCycle.toLowerCase() === "monthly" ? "Hàng tháng" : "Hàng năm (1 Năm)"}
          </dd>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-slate-200/80">
          <dt className="font-bold text-slate-900 text-sm">Tổng cộng thanh toán:</dt>
          <dd className="text-xl font-black text-primary font-heading">
            {finalPrice > 0 ? formatVND(finalPrice) : "Liên hệ báo giá"}
          </dd>
        </div>
      </dl>

      {/* Cam kết tin cậy */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Cam kết từ CloudServices</span>
        </div>
        <p className="leading-relaxed">
          Khởi tạo tự động sau khi thanh toán. Cam kết SLA 99.99% Uptime và hỗ trợ kỹ thuật 24/7/365.
        </p>
      </div>

      {currentStep === 2 && (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !selectedPlan}
          className="w-full h-12 rounded-xl font-bold text-sm bg-primary text-white shadow-md hover:bg-primary/95 gap-2"
        >
          <span>{isSubmitting ? "Đang xử lý tạo đơn..." : "Hoàn tất đặt hàng"}</span>
          <ArrowRight className="size-4" />
        </Button>
      )}
    </aside>
  );
}
