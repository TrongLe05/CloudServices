import * as React from "react";
import { ShieldCheck, Sparkles, Tag, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ServicePlanItem } from "@/types/plans.types";
import { formatVND } from "@/lib/formatUtils";
import { PlanSpecsList } from "@/components/common/PlanSpecsList";

export interface CheckoutOrderSummaryProps {
  selectedPlan: ServicePlanItem | null;
  selectedCycle: string;
  couponCode: string;
  couponApplied: boolean;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  currentStep: number;
}

export function CheckoutOrderSummary({
  selectedPlan,
  selectedCycle,
  couponCode,
  couponApplied,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
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
  
  // Chiết khấu coupon bổ sung (nếu có)
  const couponDiscountAmount = couponApplied ? Math.round(rawPrice * 0.1) : 0;
  
  const finalPrice = Math.max(0, rawPrice - promoDiscountAmount - couponDiscountAmount);

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

      {/* Mã giảm giá Coupon */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
          <Tag className="size-3 text-slate-400" />
          Mã khuyến mãi / Voucher:
        </label>

        {couponApplied ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
              <Check className="size-3.5 text-emerald-600" />
              <span>Voucher {couponCode} (-10%)</span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-[11px] text-rose-600 font-semibold hover:underline"
            >
              Gỡ bỏ
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={couponCode}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              placeholder="Nhập mã (VD: CLOUD2026)"
              className="h-10 text-xs rounded-xl bg-slate-50 uppercase"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onApplyCoupon}
              disabled={!couponCode.trim()}
              className="h-10 text-xs font-bold rounded-xl px-4 shrink-0"
            >
              Áp dụng
            </Button>
          </div>
        )}
      </div>

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

        {couponApplied && (
          <div className="flex items-center justify-between text-emerald-600">
            <dt>Giảm giá Voucher (10%):</dt>
            <dd className="font-bold">-{formatVND(couponDiscountAmount)}</dd>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-500">
          <dt>Chu kỳ thanh toán:</dt>
          <dd className="font-semibold text-slate-800">{selectedCycle}</dd>
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
