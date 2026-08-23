import * as React from "react";
import { Check, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServicePlanItem } from "@/types/plans.types";
import { formatVND } from "@/lib/formatUtils";
import { PlanSpecsList } from "@/components/common/PlanSpecsList";

export interface CheckoutPlanSelectorProps {
  plans: ServicePlanItem[];
  selectedPlan: ServicePlanItem | null;
  selectedCycle: string;
  onSelectPlan: (plan: ServicePlanItem) => void;
  onSelectCycle: (cycle: string) => void;
  onNext: () => void;
}

export function CheckoutPlanSelector({
  plans,
  selectedPlan,
  selectedCycle,
  onSelectPlan,
  onSelectCycle,
  onNext,
}: CheckoutPlanSelectorProps) {
  const currentPriceObj = selectedPlan?.prices?.find(
    (p) => p.billingCycle.toLowerCase() === selectedCycle.toLowerCase()
  ) || selectedPlan?.prices?.[0];

  const rawPrice = currentPriceObj?.price || 0;
  const isCustomQuote = rawPrice <= 0;

  const billingCycles = [
    { value: "Monthly", label: "Hàng tháng", badge: null },
    { value: "Quarterly", label: "3 Tháng", badge: "Tiết kiệm 5%" },
    { value: "SemiAnnually", label: "6 Tháng", badge: "Tiết kiệm 10%" },
    { value: "Yearly", label: "1 Năm (Ưu đãi)", badge: "Giảm 20%" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Danh sách chọn gói */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            1. Chọn cấu hình gói dịch vụ đám mây
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            ({plans.length} gói khả dụng)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const startingPrice = plan.prices?.[0]?.price || 0;

            return (
              <div
                key={plan.id}
                onClick={() => onSelectPlan(plan)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-900 text-base">
                      {plan.name}
                    </span>
                    {isSelected && (
                      <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                        <Check className="size-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {plan.description || "Hạ tầng máy chủ đám mây hiệu năng cao."}
                  </p>

                  <PlanSpecsList
                    cpu={plan.cpu}
                    ram={plan.ram}
                    storage={plan.storage}
                    bandwidth={plan.bandwidth}
                    variant="compact"
                    className="mb-4"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Giá khởi điểm:
                  </span>
                  <span className="text-sm font-black text-primary">
                    {startingPrice > 0 ? formatVND(startingPrice) : "Liên hệ báo giá"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Chọn chu kỳ thanh toán */}
      {selectedPlan && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            2. Chọn chu kỳ thanh toán
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {billingCycles.map((cycle) => {
              const isSelected =
                selectedCycle.toLowerCase() === cycle.value.toLowerCase();
              return (
                <button
                  key={cycle.value}
                  type="button"
                  onClick={() => onSelectCycle(cycle.value)}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "border-primary bg-primary text-white font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs">{cycle.label}</span>
                  {cycle.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {cycle.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isCustomQuote && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Gói này có cấu hình theo yêu cầu doanh nghiệp (0đ). Kỹ thuật viên sẽ liên hệ gửi bảng báo giá chi tiết sau khi nhận yêu cầu.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Nút tiếp tục sang Bước 2 */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedPlan}
          className="h-12 px-8 rounded-xl font-bold text-sm bg-primary text-white shadow-md hover:bg-primary/95"
        >
          Tiếp tục: Nhập thông tin &gt;
        </Button>
      </div>
    </div>
  );
}
