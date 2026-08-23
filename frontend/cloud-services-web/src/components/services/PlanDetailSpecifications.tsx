import * as React from "react";
import {
  Cpu,
  Layers,
  HardDrive,
  Activity,
  Zap,
  ShieldCheck,
  Headphones,
  Sparkles,
} from "lucide-react";
import { ServicePlanItem } from "@/types/plans.types";

export interface PlanDetailSpecificationsProps {
  plan: ServicePlanItem;
}

export function PlanDetailSpecifications({ plan }: PlanDetailSpecificationsProps) {
  const specs = [
    {
      title: "Vi xử lý (CPU)",
      value: plan.cpu || "Tùy biến",
      desc: "Intel Xeon Gold / AMD EPYC thế hệ mới, xung nhịp ổn định 3.0+ GHz.",
      icon: Cpu,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Bộ nhớ (RAM)",
      value: plan.ram || "Tùy biến",
      desc: "RAM ECC Registered DDR4/DDR5 tự động sửa lỗi, tối đa hóa thời gian uptime.",
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Lưu trữ (Storage)",
      value: plan.storage || "Tùy biến",
      desc: "Ổ cứng NVMe PCIe Gen 4 x4 Enterprise thiết lập RAID 10 tốc độ đọc/ghi cực đại.",
      icon: HardDrive,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Băng thông mạng",
      value: plan.bandwidth || "1 Gbps / Không giới hạn",
      desc: "Cổng mạng tốc độ cao trong nước & quốc tế, kết nối trực tiếp VNIX.",
      icon: Activity,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  const highlights = [
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

  return (
    <section aria-label="Thông số kỹ thuật chi tiết" className="space-y-8">
      {/* 4 Block thông số cốt lõi */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-heading mb-4">
          Thông số hạ tầng phần cứng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{item.title}</span>
                  <div className={`p-2 rounded-xl border ${item.color}`}>
                    <Icon className="size-4" />
                  </div>
                </div>
                <div className="text-lg font-black text-slate-900 font-heading">
                  {item.value}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Cam kết dịch vụ tiêu chuẩn */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 font-heading">
          Tính năng &amp; Tiêu chuẩn đi kèm
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
