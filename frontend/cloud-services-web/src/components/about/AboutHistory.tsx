"use client";

import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { milestones } from "../../constants/aboutData";

export const AboutHistory = () => {
  return (
    <section className="w-full py-20 bg-background text-foreground border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Lịch Sử Phát Triển
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Chặng đường không ngừng sáng tạo, nỗ lực nâng cao chất lượng dịch vụ
            để mang lại giá trị cao nhất cho khách hàng.
          </p>
        </div>

        <div className="relative border-l border-border max-w-3xl mx-auto pl-6 sm:pl-8 space-y-12">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline dot */}
              <span className="absolute -left-[38px] sm:-left-[46px] top-1 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background group-hover:scale-110 transition-transform">
                <Calendar className="size-3 sm:size-4" />
              </span>

              <Card className="bg-card text-card-foreground border-border transition-all group-hover:shadow-lg group-hover:shadow-muted/50 dark:group-hover:shadow-none">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                      {milestone.year}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {milestone.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
