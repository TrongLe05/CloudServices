import * as React from "react";
import { Server, CheckCircle2, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface OrderHistoryStatsCardsProps {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
}

export function OrderHistoryStatsCards({
  totalCount,
  activeCount,
  pendingCount,
}: OrderHistoryStatsCardsProps) {
  return (
    <section aria-label="Thống kê đơn hàng" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* 1. Tổng đơn hàng */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between pb-2">
          <div>
            <CardDescription className="text-xs font-semibold text-slate-500">
              Tổng đơn đăng ký
            </CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 mt-1 font-heading">
              {totalCount}
            </CardTitle>
          </div>
          <div className="size-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Server className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* 2. Đang hoạt động */}
      <Card className="rounded-2xl border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between pb-2">
          <div>
            <CardDescription className="text-xs font-semibold text-emerald-700">
              Dịch vụ đang hoạt động
            </CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-800 mt-1 font-heading">
              {activeCount}
            </CardTitle>
          </div>
          <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* 3. Chờ thanh toán / Khởi tạo */}
      <Card className="rounded-2xl border-amber-200/80 bg-amber-50/20 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between pb-2">
          <div>
            <CardDescription className="text-xs font-semibold text-amber-700">
              Chờ thanh toán / Xử lý
            </CardDescription>
            <CardTitle className="text-2xl font-black text-amber-900 mt-1 font-heading">
              {pendingCount}
            </CardTitle>
          </div>
          <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="size-5" />
          </div>
        </CardHeader>
      </Card>
    </section>
  );
}
