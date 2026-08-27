"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Server, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProfileActivityCard() {
  return (
    <section aria-label="Hoạt động tài khoản & Tiện ích" className="space-y-4">
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
            <Zap className="size-4 text-amber-500" />
            Lối tắt quản trị dịch vụ
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Truy cập nhanh danh sách đơn hàng đã đăng ký hoặc khám phá các gói hạ tầng mới.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Link to Don Hang */}
          <Link
            href="/don-hang"
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-blue-100 text-primary flex items-center justify-center font-bold">
                <ShoppingBag className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">
                  Lịch sử đơn hàng &amp; Dịch vụ
                </h3>
                <p className="text-[11px] text-slate-500">
                  Xem tiến độ kích hoạt, thanh toán VietQR PayOS
                </p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>

          {/* Link to Dich Vu */}
          <Link
            href="/dich-vu"
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-indigo-50/60 hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Server className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Bảng giá &amp; Gói dịch vụ mới
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cloud Server NVMe, VPS, Web Hosting 10Gbps
                </p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </CardContent>
      </Card>

      {/* SLA & Security Trust Box */}
      <article className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Bảo mật dữ liệu đám mây</span>
        </div>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          Tài khoản của bạn được bảo vệ bởi tiêu chuẩn xác thực JWT và mã hóa mật khẩu nhiều lớp. Mọi thắc mắc kỹ thuật vui lòng liên hệ hotline 24/7.
        </p>
      </article>
    </section>
  );
}
