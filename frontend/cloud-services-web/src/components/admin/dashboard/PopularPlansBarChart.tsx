"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Award, Layers } from "lucide-react";

export interface PopularPlanItem {
  planId: string;
  planName: string;
  categoryName?: string | null;
  orderCount: number;
}

const chartConfig = {
  orderCount: {
    label: "Số lượt đặt",
    color: "var(--chart-1, #6366f1)",
  },
} satisfies ChartConfig;

interface PopularPlansBarChartProps {
  popularPlans: PopularPlanItem[];
}

export function PopularPlansBarChart({ popularPlans }: PopularPlansBarChartProps) {
  const formattedData = React.useMemo(() => {
    return popularPlans.map((item) => ({
      name: item.planName,
      category: item.categoryName || "Chung",
      orderCount: item.orderCount,
    }));
  }, [popularPlans]);

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Award className="size-5 text-primary" /> Top Gói Dịch Vụ Được Quan Tâm Nhất
        </CardTitle>
        <CardDescription>
          Xếp hạng các gói dịch vụ máy chủ ảo và lưu trữ có lượng đặt cao nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formattedData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            Chưa có dữ liệu đặt gói dịch vụ nào.
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
              <BarChart
                data={formattedData}
                layout="vertical"
                margin={{
                  left: 10,
                  right: 20,
                  top: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                  tickFormatter={(val) =>
                    val.length > 14 ? `${val.slice(0, 14)}...` : val
                  }
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground">
                            {item.payload.name} ({item.payload.category})
                          </span>
                          <span className="text-muted-foreground">
                            Số lượt đặt: <b className="text-primary">{value}</b>
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="orderCount"
                  fill="var(--chart-1, #6366f1)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ChartContainer>

            {/* List ranking below chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 border-t border-border/50">
              {popularPlans.slice(0, 3).map((plan, index) => (
                <div
                  key={plan.planId || index}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/40"
                >
                  <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {plan.planName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                      <Layers className="size-3" /> {plan.categoryName || "Dịch vụ"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary">{plan.orderCount}</span>
                    <span className="text-[10px] text-muted-foreground block">lượt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
