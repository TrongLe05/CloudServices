import * as React from "react";
import { Cpu, HardDrive, Layers, Activity, Check } from "lucide-react";

export interface PlanSpecsListProps {
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  variant?: "list" | "dl" | "compact";
  className?: string;
}

export function PlanSpecsList({
  cpu,
  ram,
  storage,
  bandwidth,
  variant = "list",
  className = "",
}: PlanSpecsListProps) {
  const specs = [
    { label: "Vi xử lý (CPU)", shortLabel: "CPU", value: cpu, icon: Cpu },
    { label: "Bộ nhớ RAM", shortLabel: "RAM", value: ram, icon: Layers },
    { label: "Ổ cứng Lưu trữ", shortLabel: "Ổ cứng", value: storage, icon: HardDrive },
    { label: "Băng thông", shortLabel: "Băng thông", value: bandwidth, icon: Activity },
  ].filter((item) => Boolean(item.value));

  if (specs.length === 0) return null;

  // 1. Dạng Definition List (<dl>) cho Card chi tiết / QR Code Card
  if (variant === "dl") {
    return (
      <dl className={`space-y-2 text-xs ${className}`}>
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between">
              <dt className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Icon className="size-3.5 text-slate-400 shrink-0" />
                <span>{item.shortLabel}:</span>
              </dt>
              <dd className="font-semibold text-slate-800 text-right truncate max-w-[170px]">
                {item.value}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }

  // 2. Dạng Compact (Badges hàng ngang cho Table / Quick List)
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 text-[11px] ${className}`}>
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
            >
              <Icon className="size-3 text-slate-500" />
              <span>{item.value}</span>
            </span>
          );
        })}
      </div>
    );
  }

  // 3. Dạng List chuẩn cho Pricing / Featured Cards
  return (
    <ul className={`space-y-2.5 text-xs text-slate-600 ${className}`}>
      {specs.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2.5">
          <div className="p-0.5 bg-emerald-50 rounded-full text-emerald-600 shrink-0">
            <Check className="size-3" />
          </div>
          <span>
            {item.label}: <strong className="text-slate-900">{item.value}</strong>
          </span>
        </li>
      ))}
    </ul>
  );
}
