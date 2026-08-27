import * as React from "react";
import { Server, User, CreditCard, Check } from "lucide-react";

export interface CheckoutStepperProps {
  currentStep: number;
  onSelectStep?: (step: number) => void;
  maxAccessibleStep: number;
}

export function CheckoutStepper({
  currentStep,
  onSelectStep,
  maxAccessibleStep,
}: CheckoutStepperProps) {
  const steps = [
    { number: 1, title: "Cấu hình gói", icon: Server },
    { number: 2, title: "Thông tin liên hệ", icon: User },
    { number: 3, title: "Thanh toán VietQR", icon: CreditCard },
  ];

  return (
    <nav aria-label="Tiến trình đặt hàng" className="mb-10">
      <ol className="flex items-center justify-center max-w-2xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = currentStep > s.number;
          const isCurrent = currentStep === s.number;
          const isClickable = onSelectStep && s.number <= maxAccessibleStep;

          return (
            <li
              key={s.number}
              className={`flex items-center ${
                idx < steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelectStep?.(s.number)}
                className={`flex items-center gap-3 text-left transition-all ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`size-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-xs transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="size-5" /> : <Icon className="size-4" />}
                </div>

                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Bước 0{s.number}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? "text-primary"
                        : isDone
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all ${
                    currentStep > s.number ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
