import * as React from "react";
import {
  Building2,
  ShieldCheck,
  Server,
  Zap,
  Lock,
  Headphones,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientBrand {
  name: string;
  category: string;
  tagline: string;
  badge: string;
}

const CLIENT_BRANDS: ClientBrand[] = [
  {
    name: "VNG Cloud & Entertainment",
    category: "Game & Nội dung số",
    tagline: "Vận hành cụm máy chủ game và media streaming chịu tải hàng triệu CCU.",
    badge: "Enterprise",
  },
  {
    name: "FPT Telecom Group",
    category: "Viễn thông & Dịch vụ số",
    tagline: "Hạ tầng kết nối băng thông cao đa trung tâm dữ liệu toàn quốc.",
    badge: "Strategic Partner",
  },
  {
    name: "MoMo Financial Services",
    category: "Fintech & Thanh toán điện tử",
    tagline: "Hệ thống máy chủ bảo mật chuẩn PCI-DSS Level 1 xử lý giao dịch tức thì.",
    badge: "Fintech",
  },
  {
    name: "Techcombank Digital Banking",
    category: "Ngân hàng số",
    tagline: "Giải pháp đám mây riêng biệt và lưu trữ dữ liệu tài chính dự phòng.",
    badge: "Banking",
  },
  {
    name: "VinAI Research & Solutions",
    category: "Trí tuệ nhân tạo (AI/ML)",
    tagline: "Cụm GPU Dedicated Server phục vụ huấn luyện mô hình ngôn ngữ lớn (LLM).",
    badge: "AI Infrastructure",
  },
  {
    name: "Sapo E-Commerce Ecosystem",
    category: "Thương mại điện tử & Bán lẻ",
    tagline: "Lưu trữ và duy trì hoạt động cho hơn 200,000 gian hàng trực tuyến.",
    badge: "E-Commerce",
  },
  {
    name: "VPBank Digital Core",
    category: "Tài chính & Ngân hàng",
    tagline: "Hạ tầng máy chủ ảo mở rộng linh hoạt theo mùa cao điểm thanh toán.",
    badge: "Financial",
  },
  {
    name: "Bamboo Airways Aviation",
    category: "Vận tải Hàng không",
    tagline: "Hệ thống đặt vé và quản lý lịch bay thời gian thực độ sẵn sàng cao.",
    badge: "Aviation",
  },
];

const CERTIFICATIONS = [
  {
    title: "Tiêu chuẩn Tier III Data Center",
    desc: "Hạ tầng đặt tại VNPT & Viettel IDC đạt chuẩn quốc tế Uptime Institute.",
    icon: Server,
  },
  {
    title: "Chứng chỉ ISO/IEC 27001:2022",
    desc: "Quy trình bảo mật an toàn thông tin và bảo vệ quyền riêng tư dữ liệu khách hàng.",
    icon: ShieldCheck,
  },
  {
    title: "Hệ thống Anti-DDoS 1Tbps+",
    desc: "Tường lửa AI ngăn chặn tấn công mạng tự động 24/7 không gián đoạn dịch vụ.",
    icon: Zap,
  },
  {
    title: "Hỗ trợ Kỹ thuật SLA 15 phút",
    desc: "Đội ngũ chuyên gia hệ thống túc trực 24/7 phản hồi tức thì qua Hotline & Ticket.",
    icon: Headphones,
  },
];

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
