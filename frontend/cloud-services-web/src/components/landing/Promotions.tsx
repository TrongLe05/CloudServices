"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ChevronRight,
  Copy,
  Check,
  Gift,
  Percent,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { promotions } from "@/constants/landing";

const PromoCard = ({
  promo,
  index,
}: {
  promo: (typeof promotions)[0];
  index: number;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Lỗi khi sao chép:", err);
    }
  };

  // Map indexes to professional icons representing each promotion
  const icons = [Gift, Percent, RefreshCw];
  const Icon = icons[index] || Gift;

  // Mock progress availability metrics for visual complexity
  const progressValues = [78, 45, 92];
  const progressVal = progressValues[index] || 80;
  const leftSlots = [22, 11, 45];
  const slotsLeft = leftSlots[index] || 15;

  return (
    <Card className="border border-slate-200 hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col justify-between rounded-2xl bg-white shadow-sm h-full relative overflow-hidden group">
      {/* Top indicator stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-indigo-500"></div>

      {/* Faint Background Watermark Icon for depth and texture */}
      <div className="absolute -right-8 -bottom-8 opacity-[0.03] scale-[2.2] pointer-events-none text-slate-900 group-hover:scale-[2.4] group-hover:text-primary transition-all duration-500 z-0">
        <Icon className="size-24" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <CardHeader className="pb-2 pt-6 px-6 text-left">
          <div className="flex justify-between items-start">
            {/* Icon wrapper */}
            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-105 transition-transform">
              <Icon className="size-5" />
            </div>
            {/* Active expiry pill */}
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 font-mono bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-full shadow-2xs">
              <Clock className="size-3 text-slate-400" />
              Hạn: {promo.expiry}
            </span>
          </div>
          <CardTitle className="text-base font-extrabold mt-5 text-slate-900 tracking-tight leading-snug">
            {promo.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-6 px-6 flex-1 flex flex-col justify-between text-left">
          <p className="text-slate-500 text-xs leading-relaxed mb-6">
            {promo.desc}
          </p>

          {/* Availability progress bar to add visual details and urgency */}
          <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-medium">
                Độ khả dụng ưu đãi
              </span>
              <span className="font-bold text-slate-700">
                Còn {slotsLeft} lượt
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressVal}%` }}
              ></div>
            </div>
          </div>

          {/* Interactive Promo Code Box */}
          {promo.code && (
            <div
              onClick={() => handleCopy(promo.code || "")}
              className="mt-auto p-3 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors group/code"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Mã kích hoạt
                </span>
                <span className="font-mono font-extrabold text-primary tracking-wider text-sm">
                  {promo.code}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover/code:text-primary group-hover/code:border-primary/30 transition-all shadow-xs">
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5 text-slate-400 group-hover/code:text-primary" />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-100 relative z-10">
        <Button
          variant="outline"
          className="w-full font-bold text-xs py-4.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
          render={<Link href="/dang-ky" />}
        >
          Áp dụng ngay
          <ChevronRight className="ml-1 size-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export const Promotions = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[90px] -z-10"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Symmetric Centered Section Header for Personal Offers */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary">
            <UserCheck className="size-4 animate-pulse" />
            <span>Chương trình đặc quyền cá nhân hóa</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            ƯU ĐÃI DÀNH RIÊNG CHO BẠN
          </h2>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl">
            Các chương trình khuyến mãi và mã ưu đãi tài chính được hệ thống đề
            xuất riêng biệt để tối ưu ngân sách hạ tầng cho dự án của bạn.
          </p>
        </div>

        {/* Symmetric 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
          {promotions.map((promo, index) => (
            <PromoCard key={index} promo={promo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
