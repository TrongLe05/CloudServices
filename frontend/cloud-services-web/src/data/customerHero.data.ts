import { MessageSquareQuote, Building2, QrCode, LucideIcon } from "lucide-react";

export interface CustomerHeroNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface CustomerHeroMetric {
  label: string;
  value: string;
  hasStar?: boolean;
  colorClass?: string;
}

export const CUSTOMER_HERO_NAV_LINKS: CustomerHeroNavLink[] = [
  {
    href: "#testimonials",
    label: "Đánh giá khách hàng",
    icon: MessageSquareQuote,
  },
  {
    href: "#partners",
    label: "Đối tác tiêu biểu",
    icon: Building2,
  },
  {
    href: "#service-qrs",
    label: "Mã QR gói dịch vụ",
    icon: QrCode,
  },
];

export const CUSTOMER_HERO_METRICS: CustomerHeroMetric[] = [
  {
    label: "Khách hàng tin chọn",
    value: "10,000+",
  },
  {
    label: "Đánh giá hài lòng",
    value: "4.9/5",
    hasStar: true,
    colorClass: "text-amber-400",
  },
  {
    label: "Cam kết Uptime SLA",
    value: "99.99%",
    colorClass: "text-emerald-400",
  },
  {
    label: "Hỗ trợ kỹ thuật SLA",
    value: "24/7/365",
    colorClass: "text-indigo-300",
  },
];
