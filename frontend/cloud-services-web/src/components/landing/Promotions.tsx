"use client";

import * as React from "react";
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
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PromotionItem {
  id: string;
  name: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

interface PromotionsProps {
  initialPromotions?: PromotionItem[];
}

export const Promotions = ({ initialPromotions = [] }: PromotionsProps) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Lỗi khi sao chép:", err);
    }
  };

  const icons = [Gift, Percent, RefreshCw, Tag];

  // If no promotions from API, fallback to default promotions or empty state
  const displayPromos = initialPromotions.length > 0
    ? initialPromotions
    : [
        {
          id: "1",
          name: "Ưu Đãi Trải Nghiệm Doanh Nghiệp Mới",
          discountPercentage: 20,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        {
          id: "2",
          name: "Chiết Khấu Thanh Toán Chu Kỳ 1 Năm",
          discountPercentage: 25,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
        },
        {
          id: "3",
          name: "Chuyển Đổi Hạ Tầng Lên Cloud 0Đ",
          discountPercentage: 15,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
        },
      ];

  return (
    <section className="w-full py-24 md:py-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[90px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Symmetric Centered Section Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary">
            <UserCheck className="size-4 animate-pulse" />
            <span>Chương trình đặc quyền & Ưu đãi áp dụng</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading">
            ƯU ĐÃI DÀNH RIÊNG CHO BẠN
          </h2>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl">
            Các chương trình khuyến mãi và mã giảm giá được cập nhật theo thời gian thực để tối ưu ngân sách hạ tầng cho dự án của bạn.
          </p>
        </div>

        {/* Symmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          {displayPromos.map((promo, index) => {
            const Icon = icons[index % icons.length];
            const promoCode = `CLOUD${promo.discountPercentage || 20}`;
            const expiryStr = promo.endDate
              ? new Date(promo.endDate).toLocaleDateString("vi-VN")
              : "Vô thời hạn";

            return (
              <Card
                key={promo.id || index}
                className="border border-slate-200 hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col justify-between rounded-2xl bg-white shadow-sm h-full relative overflow-hidden group"
              >
                {/* Top indicator stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-indigo-500" />

                {/* Background Watermark Icon */}
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] scale-[2.2] pointer-events-none text-slate-900 group-hover:scale-[2.4] group-hover:text-primary transition-all duration-500 z-0">
                  <Icon className="size-24" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <CardHeader className="pb-2 pt-6 px-6 text-left">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-105 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 font-mono bg-slate-50 border-slate-200/80 px-2.5 py-1">
                        <Clock className="size-3 text-slate-400" />
                        Hạn: {expiryStr}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-extrabold mt-5 text-slate-900 tracking-tight leading-snug font-heading">
                      {promo.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-6 px-6 flex-1 flex flex-col justify-between text-left">
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      Giảm ngay <strong className="text-rose-600 font-bold">{promo.discountPercentage}%</strong> cho tất cả các gói dịch vụ điện toán đám mây khi thanh toán.
                    </p>

                    {/* Interactive Promo Code Box */}
                    <div
                      onClick={() => handleCopy(promoCode, promo.id)}
                      className="mt-auto p-3 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors group/code"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Mã kích hoạt
                        </span>
                        <span className="font-mono font-extrabold text-primary tracking-wider text-sm">
                          {promoCode}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover/code:text-primary group-hover/code:border-primary/30 transition-all shadow-xs">
                        {copiedId === promo.id ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5 text-slate-400 group-hover/code:text-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-100 relative z-10">
                  <Button
                    variant="outline"
                    className="w-full font-bold text-xs py-4.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                    render={<Link href="/bang-gia" />}
                  >
                    Áp dụng ngay
                    <ChevronRight className="ml-1 size-3" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
