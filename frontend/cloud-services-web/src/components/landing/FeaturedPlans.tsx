"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { prebuiltPlans } from "@/constants/landing";

export const FeaturedPlans = () => {
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <section
      id="bang-gia"
      className="w-full py-24 md:py-32 border-b border-slate-200/80 bg-slate-50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16 text-center items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Bảng giá cấu hình tối ưu
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            GÓI CẤU HÌNH NỔI BẬT & BÁO GIÁ
          </h2>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed">
            Các gói tài nguyên tiêu chuẩn tối ưu sẵn cho từng nhu cầu quy mô dự
            án và ngân sách vận hành của doanh nghiệp bạn.
          </p>
        </div>

        {/* Pricing Grid - White cards pop sharply against the solid bg-slate-50 section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 w-full max-w-6xl items-stretch">
          {prebuiltPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col justify-between transition-all duration-300 rounded-2xl bg-white shadow-md shadow-slate-200/20 ${
                plan.popular
                  ? "border-2 border-primary shadow-xl shadow-primary/5 scale-105 z-10 overflow-visible"
                  : "border border-slate-200 hover:border-slate-350"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white font-semibold text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full shadow-md shadow-primary/10">
                  Khuyên dùng
                </span>
              )}

              <CardHeader className="text-left pb-4 pt-8 px-6">
                <CardTitle className="text-base font-bold text-slate-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-xs mt-1.5 min-h-[35px] text-slate-500 leading-relaxed font-sans">
                  {plan.desc}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-left pb-6 px-6 flex-1 flex flex-col">
                <div className="flex items-baseline gap-1 py-4 border-b border-slate-100">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    {formatVND(plan.price)}
                  </span>
                  <span className="text-xs text-slate-400">/ tháng</span>
                </div>

                {/* Specs List with custom checks */}
                <ul className="space-y-3.5 text-xs mt-6 flex-1">
                  {plan.specs.map((spec, specIdx) => (
                    <li key={specIdx} className="flex items-start gap-2.5">
                      <div className="p-0.5 bg-emerald-50 rounded-full text-emerald-600 mt-0.5 shrink-0">
                        <Check className="size-3" />
                      </div>
                      <span className="text-slate-650 leading-snug">
                        {spec}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full font-semibold text-xs py-5 rounded-xl ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/95 text-white border-primary"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                  render={<Link href="/dang-ky" />}
                >
                  Bắt đầu cấu hình
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
