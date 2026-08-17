"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { certificates } from "../../constants/aboutData";

export const AboutCertificates = () => {
  return (
    <section className="w-full py-20 bg-background text-foreground border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Tiêu Chuẩn & Chứng Chỉ</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Cam kết chất lượng đạt tiêu chuẩn quốc tế
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Dịch vụ của chúng tôi được vận hành và bảo vệ dưới các bộ tiêu chuẩn kiểm định nghiêm ngặt hàng đầu thế giới.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {certificates.map((cert, idx) => (
            <Card 
              key={idx}
              className="border-border bg-card hover:border-primary/30 transition-colors"
            >
              <CardContent className="flex gap-6 pt-6">
                <div className="flex-shrink-0 flex items-center justify-center size-14 rounded-xl bg-muted border border-border shadow-sm">
                  {cert.icon}
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-foreground">{cert.name}</CardTitle>
                  <CardDescription className="text-xs font-semibold text-primary uppercase tracking-wider">{cert.authority}</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2 leading-relaxed">{cert.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
