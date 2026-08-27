import { Percent, Coins, ShieldCheck, LucideIcon } from "lucide-react";

export interface AffiliateBenefitItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  colorClass: string;
}

export interface AffiliateStepItem {
  step: number;
  title: string;
  desc: string;
}

export const AFFILIATE_BENEFITS: AffiliateBenefitItem[] = [
  {
    icon: Percent,
    title: "Hoa Hồng Tái Tục Hấp Dẫn",
    desc: "Nhận 15% - 20% trên mỗi hóa đơn thanh toán mới và các chu kỳ gia hạn định kỳ của khách hàng.",
    colorClass: "bg-indigo-50 border-indigo-100 text-primary",
  },
  {
    icon: Coins,
    title: "Thanh Toán Linh Hoạt",
    desc: "Đối soát minh bạch, rút tiền trực tiếp về tài khoản ngân hàng vào ngày 10 hàng tháng không giới hạn.",
    colorClass: "bg-emerald-50 border-emerald-100 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Cookie 60 Ngày & Dashboard",
    desc: "Thời gian lưu Cookie giới thiệu lên tới 60 ngày. Báo cáo lượt click, đơn hàng theo thời gian thực.",
    colorClass: "bg-amber-50 border-amber-100 text-amber-600",
  },
];

export const AFFILIATE_STEPS: AffiliateStepItem[] = [
  {
    step: 1,
    title: "Gửi hồ sơ đăng ký",
    desc: "Điền đầy đủ thông tin cá nhân/doanh nghiệp và định hướng kênh quảng bá qua form đăng ký.",
  },
  {
    step: 2,
    title: "Xét duyệt trong 24h",
    desc: "Đội ngũ Partnership của CloudServices kiểm tra thông tin và kích hoạt tài khoản Partner.",
  },
  {
    step: 3,
    title: "Nhận link & Thu nhập",
    desc: "Chia sẻ liên kết tiếp thị trên Website, Blog, Fanpage hoặc Cộng đồng và nhận hoa hồng.",
  },
];

export const AFFILIATE_AUDIENCES: string[] = [
  "Kỹ sư CNTT, Lập trình viên, DevOps, Quản trị mạng",
  "Agency thiết kế Website, Marketing & Phần mềm",
  "Chủ sở hữu Blog công nghệ, Kênh Youtube, Diễn đàn",
  "Chuyên gia tư vấn giải pháp Chuyển đổi số & Cloud",
];
