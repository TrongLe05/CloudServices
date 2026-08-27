import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ServicePlanItem } from "@/types/plans.types";
import {
  PLAN_SPECS_CONFIG,
  PLAN_FEATURE_HIGHLIGHTS,
} from "@/data/planSpecs.data";

export interface PlanDetailSpecificationsProps {
  plan: ServicePlanItem;
}

export function PlanDetailSpecifications({ plan }: PlanDetailSpecificationsProps) {
  const specs = PLAN_SPECS_CONFIG.map((config) => ({
    title: config.title,
    value: plan[config.valueKey] || config.defaultVal,
    desc: config.desc,
    icon: config.icon,
    color: config.color,
  }));

  const highlights = PLAN_FEATURE_HIGHLIGHTS;

  return (
    <section aria-label="Thông số kỹ thuật chi tiết" className="space-y-8">
      {/* 4 Block thông số cốt lõi */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-heading mb-4">
          Thông số hạ tầng phần cứng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{item.title}</span>
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <div className="text-lg font-black text-slate-900 font-heading">
                    {item.value}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4 Cam kết dịch vụ tiêu chuẩn */}
      <Card className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-bold text-slate-900 font-heading">
            Tính năng &amp; Tiêu chuẩn đi kèm
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

