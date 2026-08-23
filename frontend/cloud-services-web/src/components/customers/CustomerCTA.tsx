import * as React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomerCTA() {
  return (
    <aside
      aria-label="Kêu gọi hành động tư vấn dịch vụ"
      className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-8 max-w-3xl">
        <header className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            Sẵn sàng nâng cấp hạ tầng đám mây?
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Khởi tạo máy chủ đám mây tốc độ cao chỉ trong vài phút
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Đội ngũ chuyên gia hệ thống của CloudServices luôn sẵn sàng tư vấn cấu hình, hỗ trợ di chuyển dữ liệu miễn phí và bảo đảm cam kết 99.99% Uptime cho doanh nghiệp của bạn.
          </p>
        </header>

        <nav aria-label="Liên kết đặt dịch vụ và tư vấn" className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="rounded-2xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/25 h-11 px-6"
            render={<Link href="/dich-vu" />}
          >
            <span>Khám phá các gói dịch vụ</span>
            <ArrowRight className="size-4 ml-1.5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md h-11 px-6"
            render={<Link href="/lien-he" />}
          >
            <PhoneCall className="size-4 mr-1.5 text-indigo-300" />
            <span>Liên hệ tư vấn riêng</span>
          </Button>
        </nav>

        <footer className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-amber-400" />
            Kích hoạt tự động tức thì
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            Cam kết hoàn tiền trong 30 ngày
          </span>
        </footer>
      </div>
    </aside>
  );
}
