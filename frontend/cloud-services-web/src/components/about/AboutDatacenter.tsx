"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { datacenterSpecs } from "../../constants/aboutData";

export const AboutDatacenter = () => {
  return (
    <section className="w-full py-20 bg-muted/10 text-foreground border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">HẠ TẦNG VẬT LÝ</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Hệ thống Datacenter tiêu chuẩn quốc tế
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Chúng tôi sở hữu hạ tầng máy chủ mạnh mẽ đặt tại các trung tâm dữ liệu đạt tiêu chuẩn khắt khe nhất thế giới tại Việt Nam và Singapore, mang lại tốc độ truy cập nhanh chóng và độ trễ thấp tối đa.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">VN</span>
                <div>
                  <h4 className="font-semibold text-foreground">Việt Nam Datacenters</h4>
                  <p className="text-sm text-muted-foreground">Đặt tại Hà Nội, Đà Nẵng và TP. Hồ Chí Minh (Các trung tâm dữ liệu Viettel IDC, FPT, VNPT).</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">SG</span>
                <div>
                  <h4 className="font-semibold text-foreground">Singapore Datacenter</h4>
                  <p className="text-sm text-muted-foreground">Kết nối trực tiếp tới trung tâm dữ liệu quốc tế Equinix SG, mở rộng băng thông ra thế giới.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {datacenterSpecs.map((item, idx) => (
              <Card 
                key={idx} 
                className="bg-card border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="p-3 bg-muted rounded-xl w-fit mb-2">
                    {item.icon}
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
