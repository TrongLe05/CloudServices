"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const SupportContact = () => {
  return (
    <section className="w-full py-24 bg-slate-50 border-t border-slate-100">
      <div className="mx-auto max-w-4xl px-6 text-center space-y-6 flex flex-col items-center">
        <span className="text-xs font-bold text-primary uppercase tracking-wider block">
          Tư vấn thiết lập hệ thống
        </span>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          CẦN GIẢI PHÁP ĐO NI ĐÓNG GIÀY CHO DOANH NGHIỆP?
        </h2>
        
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Bạn cần thiết kế cụm máy chủ chịu lỗi cao (High Availability), đáp ứng các yêu cầu bảo mật khắt khe hay thiết lập hạ tầng GPU hiệu năng lớn? Đội ngũ kỹ sư giải pháp của chúng tôi luôn sẵn sàng hỗ trợ trực tiếp.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto font-semibold bg-primary hover:bg-primary/95 text-white py-6 px-8 rounded-xl shadow-md shadow-primary/10"
            render={<Link href="/lien-he" />}
          >
            Liên hệ kỹ sư giải pháp
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto font-semibold py-6 px-8 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl bg-white"
            render={<a href="tel:1900xxxx" />}
          >
            Gọi ngay: 1900 xxxx (24/7)
          </Button>
        </div>
      </div>
    </section>
  );
};
