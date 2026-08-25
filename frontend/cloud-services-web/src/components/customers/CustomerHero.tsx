import * as React from "react";
import Link from "next/link";
import { Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_HERO_NAV_LINKS,
  CUSTOMER_HERO_METRICS,
} from "@/data/customerHero.data";

export function CustomerHero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white py-16 sm:py-20 lg:py-24 border-b border-slate-800">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
        {/* Main Header Information */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="size-3.5 text-indigo-400" />
            <span>Khách hàng & Đánh giá trải nghiệm</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Đồng hành cùng hàng nghìn doanh nghiệp bứt phá hạ tầng số
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            Khám phá cảm nhận chân thực từ khách hàng, danh sách đối tác tiêu biểu và quét mã QR để tra cứu thông số kỹ thuật từng gói dịch vụ đám mây ngay trên thiết bị của bạn.
          </p>
        </div>

        {/* Quick Jump Navigation */}
        <nav aria-label="Mục lục chuyển nhanh" className="flex flex-wrap items-center gap-3">
          {CUSTOMER_HERO_NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
                render={<Link href={link.href} />}
              >
                <Icon className="size-3.5 mr-1.5 text-indigo-300" />
                {link.label}
              </Button>
            );
          })}
        </nav>

        {/* Semantic Definition List for Key Trust Metrics */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-800">
          {CUSTOMER_HERO_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1"
            >
              <dt className="text-xs text-slate-400 font-medium">{metric.label}</dt>
              <dd
                className={`text-2xl sm:text-3xl font-extrabold flex items-center gap-1.5 ${
                  metric.colorClass || "text-white"
                }`}
              >
                {metric.value}
                {metric.hasStar && (
                  <Star className="size-5 fill-amber-400 text-amber-400 inline" />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
