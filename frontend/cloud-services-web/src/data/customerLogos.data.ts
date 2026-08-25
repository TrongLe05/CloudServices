import { Server, ShieldCheck, Zap, Headphones, LucideIcon } from "lucide-react";

export interface ClientBrand {
  name: string;
  category: string;
  tagline: string;
  badge: string;
}

export interface CertificationItem {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const CLIENT_BRANDS: ClientBrand[] = [
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

export const CERTIFICATIONS: CertificationItem[] = [
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
