"use client";

import { Card, CardContent } from "@/components/ui/card";

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/30 py-24 sm:py-32 border-b border-border">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[100px] opacity-70 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px] opacity-60 -z-10"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Về Chúng Tôi
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Kiến tạo hạ tầng số tương lai
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Chúng tôi là nhà cung cấp dịch vụ điện toán đám mây tiên phong, đem
            đến giải pháp hạ tầng mạnh mẽ, an toàn và tối ưu nhất giúp doanh
            nghiệp chuyển đổi số thành công.
          </p>
        </div>

        {/* Stats Grid using Cards */}
        <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border text-center">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Năm thành lập
                </p>
                <p className="text-3xl font-extrabold text-foreground mt-2">
                  2018
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border text-center">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Khách hàng tin dùng
                </p>
                <p className="text-3xl font-extrabold text-foreground mt-2">
                  10,000+
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border text-center">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Datacenter đạt chuẩn
                </p>
                <p className="text-3xl font-extrabold text-foreground mt-2">
                  Tier III
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border text-center">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Cam kết Uptime
                </p>
                <p className="text-3xl font-extrabold text-primary mt-2">
                  99.9%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
