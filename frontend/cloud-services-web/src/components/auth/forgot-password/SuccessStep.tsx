"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SuccessStep = () => {
  const router = useRouter();

  return (
    <div className="p-6 md:p-8 flex flex-col justify-center h-full items-center text-center space-y-6">
      {/* Dynamic green check icon */}
      <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 shadow-2xs">
        <ShieldCheck className="size-8" />
      </div>

      <div className="space-y-2 font-sans">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Đặt lại thành công!</h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
          Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn đã có thể đăng nhập bằng mật khẩu mới này.
        </p>
      </div>

      <Button
        onClick={() => router.push("/dang-nhap")}
        className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-xl font-bold text-xs shadow-md shadow-primary/10 transition-all duration-300"
      >
        Đăng nhập ngay
      </Button>
    </div>
  );
};
