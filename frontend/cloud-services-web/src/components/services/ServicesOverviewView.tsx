"use client";

import * as React from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Activity,
  Headphones,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Server,
  Layers,
  Cpu,
  Globe,
  Database,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TechLayeredVisual } from "@/components/landing/TechLayeredVisual";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ServicePlan {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  categoryName?: string;
  categorySlug?: string;
}

interface ServicesOverviewViewProps {
  categories: ServiceCategory[];
  plans: ServicePlan[];
}

export function ServicesOverviewView({
  categories,
  plans,
}: ServicesOverviewViewProps) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-950 flex flex-col justify-between text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] bg-primary/20 rounded-full blur-[170px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 size-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:36px_36px] -z-10" />

      {/* Main Centered / Split Grand Hero Container */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 md:py-28 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headlines, Value Prop, CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300 backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-wide uppercase text-[11px]">
                Hạ tầng Đám mây Tiêu chuẩn Tier III
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Hạ Tầng Điện Toán <br />
              <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-primary bg-clip-text text-transparent">
                Tốc Độ & Độ Tin Cậy Vượt Trội
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Cung cấp hệ sinh thái dịch vụ máy chủ đám mây thế hệ mới sử dụng 100% ổ cứng NVMe Enterprise, mạng 10Gbps và bảo vệ Anti-DDoS chủ động. Chọn danh mục trên thanh điều hướng phía trên để khám phá chi tiết các gói cấu hình.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {categories.length > 0 && (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl py-6 px-8 shadow-lg shadow-primary/25 text-sm flex items-center gap-2"
                  render={<Link href={`/dich-vu/${categories[0].slug}`} />}
                >
                  Khám phá {categories[0].name}
                  <ChevronRight className="size-4" />
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className="border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl py-6 px-7 text-sm backdrop-blur-xs"
                render={<Link href="/dang-ky" />}
              >
                Nhận tư vấn giải pháp
              </Button>
            </div>

            {/* SLA Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-2 border-t border-slate-800/80">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Cam kết Uptime
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                  99.99%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Băng thông
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                  10 Gbps
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Kỹ thuật hỗ trợ
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                  24/7/365
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Tech Server Mockup */}
          <div className="lg:col-span-5 relative w-full flex justify-center mt-6 lg:mt-0">
            <TechLayeredVisual />
          </div>
        </div>
      </div>

      {/* Bottom Service Badges Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Khởi tạo nhanh</span>
              <span className="text-slate-400">Sẵn sàng dưới 60s</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Bảo mật đa tầng</span>
              <span className="text-slate-400">Anti-DDoS Enterprise</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Activity className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">100% NVMe SSD</span>
              <span className="text-slate-400">Tốc độ đọc ghi cực đại</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Hỗ trợ 24/7/365</span>
              <span className="text-slate-400">Kỹ sư hệ thống trực tiếp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
