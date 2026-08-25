import * as React from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CLIENT_BRANDS, CERTIFICATIONS } from "@/data/customerLogos.data";

export function CustomerLogos() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="py-16 sm:py-20 border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <header className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-slate-50 border-slate-300">
            <Building2 className="size-3.5 mr-1 text-primary" />
            Khách Hàng & Đối Tác Tiêu Biểu
          </Badge>
          <h2 id="partners-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Được tin tưởng bởi các doanh nghiệp công nghệ hàng đầu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Chúng tôi tự hào cung cấp giải pháp máy chủ đám mây vững chắc, bảo mật và ổn định cho hàng nghìn tập đoàn, doanh nghiệp vừa và nhỏ trên toàn quốc.
          </p>
        </header>

        {/* Enterprise Brand Cards Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0">
          {CLIENT_BRANDS.map((brand, idx) => (
            <li key={idx} className="h-full">
              <article className="h-full p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-primary/40 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <header className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {brand.category}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200">
                      {brand.badge}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {brand.name}
                  </h3>
                </header>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {brand.tagline}
                </p>

                <footer className="pt-2 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="size-3.5" />
                  <span>Đang hoạt động ổn định</span>
                </footer>
              </article>
            </li>
          ))}
        </ul>

        {/* Key Trust Standards & Certifications */}
        <section aria-label="Tiêu chuẩn chất lượng & Cam kết" className="pt-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
            {CERTIFICATIONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i}>
                  <article className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </section>
  );
}
