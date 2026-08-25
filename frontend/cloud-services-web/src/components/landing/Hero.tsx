"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechLayeredVisual } from "./TechLayeredVisual";
import { HERO_TRUST_METRICS } from "@/data/landingHero.data";

export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24 md:py-32 border-b border-slate-100">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[100px] opacity-70 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[80px] opacity-60 -z-10"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Core Heading, CTAs, and Statistics */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-150 bg-white px-3.5 py-1.5 text-xs text-slate-600 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-semibold text-[11px] tracking-wide text-slate-700 uppercase">
              Hạ tầng Cloud doanh nghiệp tiêu chuẩn Tier III
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 font-sans">
            Hạ Tầng Cloud Server
            <br />
            <span className="bg-sky-700 from-primary bg-clip-text text-transparent">
              Hiệu Năng Cao
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl font-sans">
            Khởi tạo ngay máy chủ riêng ảo (Cloud VM) tốc độ cao với vi xử lý
            Intel Xeon thế hệ mới nhất, ổ cứng SSD NVMe Enterprise và mạng VPC
            bảo mật. Cam kết chất lượng dịch vụ SLA 99.99% bằng văn bản pháp lý.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto font-semibold bg-primary hover:bg-primary/95 text-white rounded-xl py-6 px-7 shadow-lg shadow-primary/10"
              render={<Link href="#configurator" />}
            >
              Khởi tạo máy chủ ngay
              <ArrowRight className="ml-2 size-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl py-6 px-7 bg-white shadow-xs"
              render={<Link href="#dich-vu" />}
            >
              Nhận tư vấn giải pháp
            </Button>
          </div>

          {/* Trust Metrics Block */}
          <div className="grid grid-cols-3 gap-6 pt-8 mt-4 border-t border-slate-150 font-sans">
            {HERO_TRUST_METRICS.map((metric, idx) => (
              <div key={idx}>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {metric.label}
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Composited Multi-layered Tech Mockup */}
        <div className="lg:col-span-5 relative w-full flex justify-center mt-6 lg:mt-0">
          <TechLayeredVisual />
        </div>
      </div>
    </section>
  );
};
