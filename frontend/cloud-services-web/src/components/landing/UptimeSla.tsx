"use client";

import Link from "next/link";
import { Activity, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  SLA_FEATURES,
  SLA_DATACENTER_STATUSES,
} from "@/data/landingSla.data";

export const UptimeSla = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-slate-50/50 text-slate-800 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Uptime details */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="p-1.5 rounded-full bg-emerald-50 w-fit text-emerald-700 border border-emerald-500/10 flex items-center gap-1.5 text-xs font-semibold px-3">
            <Activity className="size-4 animate-pulse" />
            <span>Độ ổn định mạng đạt chuẩn quốc tế</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            CAM KẾT CHẤT LƯỢNG UPTIME 99.99% (SLA)
          </h2>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Hạ tầng đám mây tin cậy cao được thiết kế dự phòng ở mọi cấp độ. Chúng tôi cam kết chất lượng dịch vụ SLA bằng văn bản pháp lý, bảo đảm hoàn trả chi phí nếu thời gian hoạt động thực tế không đáp ứng tiêu chuẩn cam kết.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {SLA_FEATURES.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{item.title}</h4>
                  <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold text-xs py-5 px-5 rounded-xl bg-white"
              render={<Link href="/sla" />}
            >
              Xem điều khoản cam kết SLA
              <ArrowUpRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>

        {/* SLA statistics visual - Premium Card */}
        <Card className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6 text-left relative overflow-hidden shadow-xl shadow-slate-100/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

          <CardHeader className="p-0 space-y-2">
            <span className="text-slate-400 text-[10px] font-bold block tracking-wider uppercase">
              Chỉ số ổn định thực tế
            </span>

            <div>
              <CardTitle className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                99.998%
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 block mt-1">
                Trung bình đo đạc kiểm thử liên tục trong 365 ngày
              </CardDescription>
            </div>
          </CardHeader>

          {/* Simulated Live System Status */}
          <CardContent className="p-0 space-y-3 pt-4 border-t border-slate-100">
            {SLA_DATACENTER_STATUSES.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{status.location}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`size-2 bg-emerald-500 rounded-full ${status.isPingActive ? "animate-ping" : ""}`}></span>
                  <span className="text-emerald-600 font-bold">{status.uptime}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
