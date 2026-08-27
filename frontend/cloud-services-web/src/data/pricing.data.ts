import { ShieldCheck, Zap, Sparkles, LucideIcon } from "lucide-react";

export interface PricingAssuranceItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  iconBgClass: string;
  iconColorClass: string;
}

export const PRICING_ASSURANCES: PricingAssuranceItem[] = [
  {
    icon: ShieldCheck,
    title: "Cam kết Uptime SLA 99.9%",
    desc: "Hệ thống trung tâm dữ liệu tiêu chuẩn quốc tế Tier III đảm bảo máy chủ luôn online ổn định và liên tục 24/7.",
    iconBgClass: "bg-emerald-50",
    iconColorClass: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "Khởi tạo tức thì trong 60s",
    desc: "Ngay sau khi xác nhận đơn hàng, toàn bộ thông tin quản trị IP và password sẽ được gửi tự động qua email.",
    iconBgClass: "bg-primary/10",
    iconColorClass: "text-primary",
  },
  {
    icon: Sparkles,
    title: "Hỗ trợ kỹ thuật 24/7/365",
    desc: "Đội ngũ chuyên gia kỹ sư hạ tầng luôn sẵn sàng hỗ trợ trực tuyến qua ticket, live chat và hotline.",
    iconBgClass: "bg-indigo-50",
    iconColorClass: "text-indigo-600",
  },
];
