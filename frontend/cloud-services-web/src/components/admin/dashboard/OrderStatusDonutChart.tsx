"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
import { PieChart as PieChartIcon } from "lucide-react";

interface OrderStatusDonutChartProps {
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
}

const chartConfig = {
  new: {
    label: "Mới tạo",
    color: "#3b82f6", // blue
  },
  processing: {
    label: "Đang xử lý",
    color: "#f59e0b", // amber
  },
  completed: {
    label: "Hoàn tất",
    color: "#10b981", // emerald
  },
  rejected: {
    label: "Từ chối",
    color: "#ef4444", // rose
  },
} satisfies ChartConfig;

export function OrderStatusDonutChart({
  newOrders,
  processingOrders,
  completedOrders,
  rejectedOrders,
}: OrderStatusDonutChartProps) {
  const chartData = React.useMemo(() => {
    return [
      { name: "new", label: "Mới tạo", value: newOrders, fill: "#3b82f6" },
      { name: "processing", label: "Đang xử lý", value: processingOrders, fill: "#f59e0b" },
      { name: "completed", label: "Hoàn tất", value: completedOrders, fill: "#10b981" },
      { name: "rejected", label: "Từ chối", value: rejectedOrders, fill: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [newOrders, processingOrders, completedOrders, rejectedOrders]);

  const total = newOrders + processingOrders + completedOrders + rejectedOrders;

  return (
    <Card className="shadow-xs border border-border flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <PieChartIcon className="size-5 text-primary" /> Phân Bố Trạng Thái Đơn Hàng
        </CardTitle>
        <CardDescription>
          Tỷ lệ đơn hàng theo trạng thái xử lý hiện tại
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {total === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-xs">
            Chưa có dữ liệu đơn đặt hàng.
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[220px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={85}
                  strokeWidth={3}
                  stroke="var(--background)"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-muted-foreground truncate">Mới:</span>
                <span className="font-semibold ml-auto">{newOrders}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-muted-foreground truncate">Đang xử lý:</span>
                <span className="font-semibold ml-auto">{processingOrders}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-muted-foreground truncate">Hoàn tất:</span>
                <span className="font-semibold ml-auto">{completedOrders}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-muted-foreground truncate">Từ chối:</span>
                <span className="font-semibold ml-auto">{rejectedOrders}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
