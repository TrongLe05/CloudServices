"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Configurator = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [config, setConfig] = useState({
    cpu: 2,
    ram: 4,
    storage: 80,
    hasIp: false,
  });

  // Memoize the cost calculation to optimize performance
  const estimatedCost = useMemo(() => {
    const baseCost =
      config.cpu * 75000 + // 75,000 VND per vCPU
      config.ram * 40000 + // 40,000 VND per GB RAM
      config.storage * 1500 + // 1,500 VND per GB Storage
      (config.hasIp ? 50000 : 0); // 50,000 VND for Public Dedicated IP

    if (billingCycle === "yearly") {
      return Math.round(baseCost * 12 * 0.8);
    }
    return baseCost;
  }, [config.cpu, config.ram, config.storage, config.hasIp, billingCycle]);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <section id="configurator" className="w-full py-24 md:py-32 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Dự toán chi phí linh hoạt
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            BỘ TÍNH TOÁN TÀI NGUYÊN TÙY CHỈNH
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed">
            Tự thiết lập CPU, RAM và ổ cứng SSD phù hợp với nhu cầu sử dụng thực tế của dự án doanh nghiệp để nhận báo giá chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Panel - Corporate Card with contrast bg */}
          <div className="lg:col-span-7 bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-8 shadow-sm">
            {/* CPU Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
                <label htmlFor="cpu-slider" className="font-sans">Số lượng vCPU</label>
                <span className="text-primary bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                  {config.cpu} vCPU
                </span>
              </div>
              <input
                id="cpu-slider"
                type="range"
                min="1"
                max="16"
                value={config.cpu}
                onChange={(e) => setConfig({ ...config, cpu: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>1 Core</span>
                <span>4 Cores</span>
                <span>8 Cores</span>
                <span>12 Cores</span>
                <span>16 Cores</span>
              </div>
            </div>

            {/* RAM Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
                <label htmlFor="ram-slider" className="font-sans">Dung lượng RAM</label>
                <span className="text-primary bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                  {config.ram} GB RAM
                </span>
              </div>
              <input
                id="ram-slider"
                type="range"
                min="2"
                max="64"
                step="2"
                value={config.ram}
                onChange={(e) => setConfig({ ...config, ram: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>2 GB</span>
                <span>16 GB</span>
                <span>32 GB</span>
                <span>48 GB</span>
                <span>64 GB</span>
              </div>
            </div>

            {/* Storage Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
                <label htmlFor="storage-slider" className="font-sans">Ổ cứng SSD NVMe</label>
                <span className="text-primary bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                  {config.storage} GB SSD
                </span>
              </div>
              <input
                id="storage-slider"
                type="range"
                min="20"
                max="500"
                step="10"
                value={config.storage}
                onChange={(e) => setConfig({ ...config, storage: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>20 GB</span>
                <span>120 GB</span>
                <span>240 GB</span>
                <span>360 GB</span>
                <span>500 GB</span>
              </div>
            </div>

            {/* Public Dedicated IP Switch */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="ip-checkbox" className="text-sm font-bold text-slate-800 cursor-pointer">
                  IP tĩnh chuyên dụng (IPv4)
                </label>
                <p className="text-xs text-slate-500 max-w-sm">
                  Cấp phát riêng biệt 1 địa chỉ IPv4 công cộng cố định cho máy chủ ảo.
                </p>
              </div>
              <input
                id="ip-checkbox"
                type="checkbox"
                checked={config.hasIp}
                onChange={(e) => setConfig({ ...config, hasIp: e.target.checked })}
                className="size-4.5 rounded border-slate-300 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Price Output Panel - Premium Corporate Slate Card */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-350 p-6 md:p-8 flex flex-col justify-between h-full min-h-[420px] rounded-2xl border border-slate-800 shadow-xl shadow-slate-900/10">
            <div className="text-left space-y-6">
              {/* Summary Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Tài nguyên đã chọn</span>
                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-bold">
                  Sẵn sàng
                </span>
              </div>

              {/* Specs detail list */}
              <div className="space-y-4 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số lượng vi xử lý:</span>
                  <span className="text-white font-semibold">{config.cpu} vCPU Cores</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dung lượng bộ nhớ:</span>
                  <span className="text-white font-semibold">{config.ram} GB RAM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Không gian lưu trữ:</span>
                  <span className="text-white font-semibold">{config.storage} GB SSD NVMe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ IPv4 tĩnh:</span>
                  <span className="text-white font-semibold">{config.hasIp ? "Có (1 IPv4)" : "Không yêu cầu"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cổng băng thông:</span>
                  <span className="text-white font-semibold">100 Mbps (Miễn phí)</span>
                </div>
              </div>

              {/* Cycle Switcher - Rounded Premium Style */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-850 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`py-2 text-center transition-all cursor-pointer rounded-lg uppercase tracking-wider ${
                    billingCycle === "monthly"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`py-2 text-center transition-all cursor-pointer rounded-lg uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                    billingCycle === "yearly"
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Năm
                  <span className="bg-emerald-500 text-white font-extrabold px-1 rounded text-[8px]">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Total Cost Presentation */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-left space-y-6">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Tổng chi phí dự tính:</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
                    {formatVND(estimatedCost)}
                  </span>
                  <span className="text-xs text-slate-500">
                    / {billingCycle === "yearly" ? "năm" : "tháng"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    * Tiết kiệm {formatVND(estimatedCost * 0.2)} so với thanh toán theo tháng
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full font-bold bg-white text-slate-900 hover:bg-slate-100 py-6 rounded-xl border border-white"
                  render={<Link href="/dang-ky" />}
                >
                  Khởi tạo máy chủ ảo ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
