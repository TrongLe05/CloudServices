"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar } from "lucide-react";

export interface MonthlyOrderData {
  month: string;
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
}

const chartConfig = {
  totalOrders: {
    label: "Tổng đơn đặt",
    color: "var(--chart-1, #3b82f6)",
  },
  completedOrders: {
    label: "Hoàn tất",
    color: "var(--chart-2, #10b981)",
  },
  processingOrders: {
    label: "Đang xử lý",
    color: "var(--chart-3, #f59e0b)",
  },
  rejectedOrders: {
    label: "Từ chối / Hủy",
    color: "var(--chart-4, #ef4444)",
  },
} satisfies ChartConfig;

interface MonthlyOrdersChartProps {
  initialData: MonthlyOrderData[];
}

export function MonthlyOrdersChart({ initialData }: MonthlyOrdersChartProps) {
  const [timeRange, setTimeRange] = React.useState<"6m" | "12m">("6m");
  const [chartData, setChartData] = React.useState<MonthlyOrderData[]>(initialData);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchFilteredData() {
      setLoading(true);
      try {
        const now = new Date();
        const monthsBack = timeRange === "6m" ? 5 : 11;
        const fromDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
        const toDate = new Date(now.getFullYear(), now.getMonth(), 1);

        const fromStr = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, "0")}`;
        const toStr = `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, "0")}`;

        const res = await fetch(`/api/statistics/orders?from=${fromStr}&to=${toStr}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setChartData(data);
          }
        }
      } catch (err) {
        console.error("Error fetching order statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredData();
  }, [timeRange]);

  const totalPeriodOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalOrders, 0);
  }, [chartData]);

  const totalCompletedOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.completedOrders, 0);
  }, [chartData]);

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" /> Xu Hướng Đơn Đặt Dịch Vụ Theo Tháng
          </CardTitle>
          <CardDescription>
            Thống kê số lượng yêu cầu đặt dịch vụ điện toán đám mây qua các tháng
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
            <Button
              variant={timeRange === "6m" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setTimeRange("6m")}
            >
              6 tháng
            </Button>
            <Button
              variant={timeRange === "12m" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setTimeRange("12m")}
            >
              12 tháng
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-xl border border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block">Tổng đơn trong kỳ:</span>
            <span className="text-lg font-bold text-foreground">{totalPeriodOrders}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Đơn hoàn tất:</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {totalCompletedOrders}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Tỷ lệ hoàn thành:</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {totalPeriodOrders > 0
                ? `${Math.round((totalCompletedOrders / totalPeriodOrders) * 100)}%`
                : "0%"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Khoảng thời gian:</span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="size-3.5 text-muted-foreground" />
              {chartData[0]?.month || "N/A"} → {chartData[chartData.length - 1]?.month || "N/A"}
            </span>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1, #3b82f6)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-1, #3b82f6)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2, #10b981)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-2, #10b981)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillProcessing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-3, #f59e0b)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-3, #f59e0b)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const parts = value.split("-");
                return parts.length === 2 ? `T${parts[1]}/${parts[0].slice(2)}` : value;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => `Tháng ${value}`}
                />
              }
            />
            <Area
              dataKey="totalOrders"
              type="monotone"
              fill="url(#fillTotal)"
              fillOpacity={0.4}
              stroke="var(--chart-1, #3b82f6)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="completedOrders"
              type="monotone"
              fill="url(#fillCompleted)"
              fillOpacity={0.4}
              stroke="var(--chart-2, #10b981)"
              strokeWidth={2}
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
