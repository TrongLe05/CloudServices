"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { services } from "@/constants/landing";

export const Services = () => {
  return (
    <section id="dich-vu" className="w-full py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Danh mục giải pháp hạ tầng
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              HỆ SINH THÁI DỊCH VỤ CỐT LÕI
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Các sản phẩm hạ tầng đám mây chuyên nghiệp, hiệu năng cao giúp tối
              ưu hóa công việc vận hành và phát triển hệ thống của doanh nghiệp.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase hidden md:block">
            Hạ tầng ổn định & bảo mật
          </div>
        </div>

        {/* Clean Spaced Grid Layout with rounded cards popping against bg-white */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Card
                key={index}
                className="bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1 flex flex-col justify-between rounded-2xl shadow-xs"
              >
                <CardHeader className="pb-2 pt-6 px-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Icon className="size-5" />
                    </div>
                    {service.badge && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold mt-6 text-slate-900 tracking-tight">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-6 pt-2 px-6">
                  <CardDescription className="text-slate-500 text-xs leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>

                <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-100/80 flex items-center justify-between">
                  <Link
                    href={`/dich-vu#${service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
                  >
                    Tìm hiểu chi tiết
                    <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
