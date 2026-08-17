"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { commitments } from "../../constants/aboutData";

export const AboutCommitment = () => {
  return (
    <section className="w-full py-20 bg-muted/10 text-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="p-1.5 rounded-full bg-primary/10 w-fit text-primary border border-primary/20 flex items-center gap-1.5 text-xs font-semibold px-3">
              <span className="size-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Độ tin cậy hàng đầu</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              CAM KẾT DỊCH VỤ <br />
              <span className="text-primary">UPTIME 99.9% (SLA)</span>
            </h2>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Chúng tôi hiểu rằng sự ổn định của hệ thống là yếu tố sống còn đối với hoạt động kinh doanh của bạn. Vì vậy, chúng tôi cam kết mang lại một hạ tầng vững chắc với tỉ lệ hoạt động liên tục (Uptime) tối thiểu đạt 99.9% mỗi tháng.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {commitments.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphical representation / Badge */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <Card className="relative w-full max-w-md bg-card border-border shadow-xl shadow-muted/50 dark:shadow-none overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              
              <CardContent className="text-center space-y-6 pt-6">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Chỉ số Uptime cam kết</span>
                
                <div className="relative inline-block">
                  <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-emerald-500 tracking-tight">
                    99.9%
                  </div>
                  <span className="absolute -top-2 -right-6 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                </div>

                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Tương đương với thời gian gián đoạn tối đa không quá 43 phút mỗi tháng. Hệ thống luôn được giám sát tự động 24/7 để phát hiện sự cố ngay lập tức.
                </p>

                <div className="pt-4 border-t border-border flex justify-around text-center">
                  <div>
                    <div className="text-xl font-bold text-foreground">{"< 5 phút"}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Thời gian phản hồi</div>
                  </div>
                  <div className="border-r border-border h-10"></div>
                  <div>
                    <div className="text-xl font-bold text-foreground">24/7/365</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Giám sát hệ thống</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
