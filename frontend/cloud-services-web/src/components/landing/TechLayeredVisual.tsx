"use client";

import { useState, useEffect } from "react";
import { Terminal, Cpu, ShieldCheck } from "lucide-react";

export const TechLayeredVisual = () => {
  const [cpuUsage, setCpuUsage] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 15) + 18);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md aspect-[4/3.5] flex items-center justify-center">
      {/* Background decoration glow */}
      <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50 -z-15"></div>

      {/* Layer 1: Dark Slate CLI Terminal (Terraform deployment simulation) */}
      <div className="w-[95%] aspect-[4/3] bg-slate-950 border border-slate-850 rounded-2xl shadow-2xl p-5 text-left font-mono text-[10px] text-slate-350 relative">
        {/* Window controls */}
        <div className="flex gap-1.5 pb-4 border-b border-slate-900 mb-4">
          <span className="size-2 rounded-full bg-rose-500/80"></span>
          <span className="size-2 rounded-full bg-amber-500/80"></span>
          <span className="size-2 rounded-full bg-emerald-500/80"></span>
        </div>

        {/* Real cloud Terraform CLI logs */}
        <div className="space-y-2 text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-550">
            <Terminal className="size-3 text-slate-600" />
            <span>developer@cloudservices:~$</span>
            <span className="text-white">terraform apply</span>
          </div>
          <div className="text-slate-550">
            Terraform v1.6.0 on linux_amd64
          </div>
          <div>
            cloudservices_vm.web: Creating...
          </div>
          <div>
            cloudservices_vm.web: Provisioning (vCPU: 4, RAM: 8GB, SSD: 120GB)
          </div>
          <div>
            cloudservices_vm.web: Creation complete after 12s [ID: inst-298a4b]
          </div>
          <div className="text-emerald-400 font-bold pt-1">
            Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
          </div>
          <div className="text-slate-550 text-[9px] pt-1">
            IP: 103.45.22.18 | OS: Ubuntu 22.04 LTS
          </div>
        </div>
      </div>

      {/* Layer 2: Floating Glassmorphic Metrics Card (Cloud server monitor) */}
      <div className="absolute -bottom-4 -left-2 w-[72%] bg-white/85 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl shadow-2xl text-left space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Cpu className="size-4 text-primary" />
            <span className="text-[9px] font-extrabold text-slate-800 uppercase tracking-wider">MÁY CHỦ: web-server-01</span>
          </div>
          <span className="text-[8px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">ACTIVE</span>
        </div>

        {/* Live metric slider bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold font-mono">
            <span>CPU (Intel Xeon Scalable)</span>
            <span className="text-primary font-bold">{cpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1005" style={{ width: `${cpuUsage}%` }}></div>
          </div>
        </div>

        {/* Security verification */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold justify-between pt-0.5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            VPC Isolated
          </span>
          <span className="text-slate-400 font-mono">Uptime: 145d</span>
        </div>
      </div>
    </div>
  );
};
