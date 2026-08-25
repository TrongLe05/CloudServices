import { Cpu, Layers, HardDrive, Activity, Zap, ShieldCheck, Headphones, Sparkles, LucideIcon } from "lucide-react";
import { ServicePlanItem } from "@/types/plans.types";

export interface PlanSpecItem {
  title: string;
  valueKey: keyof Pick<ServicePlanItem, "cpu" | "ram" | "storage" | "bandwidth">;
  defaultVal: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export interface PlanHighlightItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const PLAN_SPECS_CONFIG: PlanSpecItem[] = [
  {
    title: "Vi xử lý (CPU)",
    valueKey: "cpu",
    defaultVal: "Tùy biến",
    desc: "Intel Xeon Gold / AMD EPYC thế hệ mới, xung nhịp ổn định 3.0+ GHz.",
    icon: Cpu,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Bộ nhớ (RAM)",
    valueKey: "ram",
    defaultVal: "Tùy biến",
    desc: "RAM ECC Registered DDR4/DDR5 tự động sửa lỗi, tối đa hóa thời gian uptime.",
    icon: Layers,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    title: "Lưu trữ (Storage)",
    valueKey: "storage",
    defaultVal: "Tùy biến",
    desc: "Ổ cứng NVMe PCIe Gen 4 x4 Enterprise thiết lập RAID 10 tốc độ đọc/ghi cực đại.",
    icon: HardDrive,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Băng thông mạng",
    valueKey: "bandwidth",
    defaultVal: "1 Gbps / Không giới hạn",
    desc: "Cổng mạng tốc độ cao trong nước & quốc tế, kết nối trực tiếp VNIX.",
    icon: Activity,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
];

export const PLAN_FEATURE_HIGHLIGHTS: PlanHighlightItem[] = [
  {
    icon: Zap,
    title: "Khởi tạo nhanh chóng",
    desc: "Hệ thống tự động cài đặt hệ điều hành và kích hoạt IP sau khi thanh toán.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-DDoS Đa Lớp",
    desc: "Bảo vệ tài nguyên an toàn trước các cuộc tấn công từ chối dịch vụ.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7 SLA 99.99%",
    desc: "Kỹ thuật viên túc trực giải quyết sự cố 24/7/365 qua Ticket, Hotline.",
  },
  {
    icon: Sparkles,
    title: "Bản sao lưu Backup",
    desc: "Tùy chọn tự động sao lưu dữ liệu định kỳ mỗi tuần hoặc theo nhu cầu.",
  },
];
