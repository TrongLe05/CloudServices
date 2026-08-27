import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CardWrapper({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-slate-200/80 shadow-2xl rounded-3xl bg-card">
        <div className="grid md:grid-cols-2 min-h-[580px]">
          {/* Cột trái: Form */}
          <div className="flex flex-col justify-center bg-white p-2">
            {children}
          </div>

          {/* Cột phải: Panel Branding Tối giản & Sang trọng */}
          <div className="relative hidden md:flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top: Logo & Slogan */}
            <div className="relative z-10 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="size-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 shadow-inner transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/Logo.png"
                    alt="CloudServices Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-heading text-lg font-bold text-white tracking-tight block">
                    CloudServices
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                    Enterprise Cloud Solutions
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Feature highlights */}
            <div className="relative z-10 space-y-4 my-auto py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-300">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Hạ tầng tiêu chuẩn Tier III
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
                Nền tảng Cloud Server <br />
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Hiệu năng vượt trội
                </span>
              </h3>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 mt-0.5 text-sky-300">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Vi xử lý Intel Xeon thế hệ mới</strong> cùng ổ cứng NVMe Enterprise tốc độ cao.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 mt-0.5 text-sky-300">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Cam kết SLA 99.99%</strong> đảm bảo hệ thống luôn sẵn sàng 24/7.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 mt-0.5 text-sky-300">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Bảo mật mạng VPC & Firewall</strong> cô lập hoàn toàn môi trường của bạn.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Trust & Support line */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Hỗ trợ kỹ thuật 24/7/365</span>
              <span className="font-semibold text-slate-300">Hotline: 1900 xxxx</span>
            </div>
          </div>
        </div>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <Link href="#" className="underline hover:text-primary font-medium">Điều khoản dịch vụ</Link> và{" "}
        <Link href="#" className="underline hover:text-primary font-medium">Chính sách bảo mật</Link> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
