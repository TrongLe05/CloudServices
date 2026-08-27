"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  Tag,
  Users,
} from "lucide-react";

interface DashboardSummaryCardsProps {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  totalPlans: number;
  totalCategories: number;
  totalPromotions: number;
  totalAffiliates: number;
}

export function DashboardSummaryCards({
  totalOrders,
  newOrders,
  processingOrders,
  completedOrders,
  rejectedOrders,
  totalPlans,
  totalCategories,
  totalPromotions,
  totalAffiliates,
}: DashboardSummaryCardsProps) {
  const cards = [
    {
      title: "Tổng Đơn Đặt Dịch Vụ",
      value: totalOrders,
      description: `${newOrders} đơn mới chờ tiếp nhận`,
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200/60 dark:border-blue-900/40",
    },
    {
      title: "Đơn Đang Xử Lý",
      value: processingOrders,
      description: "Đang cấp phát & cấu hình tài nguyên",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-200/60 dark:border-amber-900/40",
    },
    {
      title: "Đơn Hoàn Tất",
      value: completedOrders,
      description: "Dịch vụ đã bàn giao thành công",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200/60 dark:border-emerald-900/40",
    },
    {
      title: "Đơn Đã Từ Chối",
      value: rejectedOrders,
      description: "Hủy hoặc không đạt yêu cầu",
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-200/60 dark:border-rose-900/40",
    },
    {
      title: "Gói Dịch Vụ & Danh Mục",
      value: `${totalPlans} / ${totalCategories}`,
      description: "Gói cấu hình / Phân loại đám mây",
      icon: Cpu,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-200/60 dark:border-purple-900/40",
    },
    {
      title: "Đối Tác & Khuyến Mãi",
      value: `${totalAffiliates} / ${totalPromotions}`,
      description: "Đối tác Affiliate / Chương trình ưu đãi",
      icon: Users,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-200/60 dark:border-sky-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className={`shadow-xs border transition-all duration-200 hover:shadow-sm ${card.borderColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground line-clamp-1">
                {card.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
                <Icon className={`size-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{card.value}</div>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
