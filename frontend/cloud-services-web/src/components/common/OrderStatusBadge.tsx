"use client";

import * as React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getRemainingPaymentSeconds,
  formatTimer,
} from "@/lib/formatUtils";

export interface OrderStatusBadgeProps {
  status: number | string;
  createdAt?: string;
  showCountdown?: boolean;
  className?: string;
}

export function OrderStatusBadge({
  status,
  createdAt,
  showCountdown = true,
  className = "",
}: OrderStatusBadgeProps) {
  const [remaining, setRemaining] = React.useState<number>(() =>
    createdAt ? getRemainingPaymentSeconds(createdAt) : 300
  );

  React.useEffect(() => {
    if (!createdAt || !showCountdown) return;

    // Cập nhật đếm ngược mỗi giây
    const timer = setInterval(() => {
      setRemaining(getRemainingPaymentSeconds(createdAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, showCountdown]);

  // Chuẩn hóa status
  const normalizedStatus =
    typeof status === "string" ? status.toLowerCase() : status;

  // 1. Chờ thanh toán / Mới tạo (Status = 0 hoặc "new" / "pending")
  if (normalizedStatus === 0 || normalizedStatus === "new" || normalizedStatus === "pending") {
    const isExpired = createdAt ? remaining <= 0 : false;

    if (isExpired) {
      return (
        <Badge
          variant="outline"
          className={`bg-rose-50 text-rose-700 border-rose-200 gap-1 text-[11px] font-semibold ${className}`}
        >
          <XCircle className="size-3 text-rose-600" />
          <span>Hết hạn thanh toán</span>
        </Badge>
      );
    }

    const isUrgent = remaining < 60;

    return (
      <Badge
        variant="outline"
        className={`bg-amber-50 text-amber-700 border-amber-300 gap-1 text-[11px] font-semibold ${
          isUrgent ? "animate-pulse border-red-400 text-red-700 bg-red-50" : ""
        } ${className}`}
      >
        <Clock className={`size-3 ${isUrgent ? "text-red-600" : "text-amber-600"}`} />
        <span>
          Chờ thanh toán
          {showCountdown && createdAt ? ` (${formatTimer(remaining)})` : ""}
        </span>
      </Badge>
    );
  }

  // 2. Đã duyệt / Thanh toán thành công (Status = 1 hoặc "approved")
  if (normalizedStatus === 1 || normalizedStatus === "approved") {
    return (
      <Badge
        variant="outline"
        className={`bg-emerald-50 text-emerald-700 border-emerald-300 gap-1 text-[11px] font-semibold ${className}`}
      >
        <CheckCircle2 className="size-3 text-emerald-600" />
        <span>Đã duyệt (Đã thanh toán)</span>
      </Badge>
    );
  }

  // 3. Từ chối / Đã hủy (Status = 2 hoặc "rejected" / "cancelled")
  if (normalizedStatus === 2 || normalizedStatus === "rejected" || normalizedStatus === "cancelled") {
    return (
      <Badge
        variant="outline"
        className={`bg-rose-50 text-rose-700 border-rose-200 gap-1 text-[11px] font-semibold ${className}`}
      >
        <XCircle className="size-3 text-rose-600" />
        <span>Đã từ chối / Hủy</span>
      </Badge>
    );
  }

  // 4. Đang hoạt động / Đang cung cấp (Status = 3 hoặc "active" / "provisioning")
  if (normalizedStatus === 3 || normalizedStatus === "active" || normalizedStatus === "provisioning") {
    return (
      <Badge
        variant="outline"
        className={`bg-blue-50 text-blue-700 border-blue-200 gap-1 text-[11px] font-semibold ${className}`}
      >
        <Activity className="size-3 text-blue-600 animate-pulse" />
        <span>Đang hoạt động</span>
      </Badge>
    );
  }

  // 5. Hoàn thành (Status = 4 hoặc "completed")
  if (normalizedStatus === 4 || normalizedStatus === "completed") {
    return (
      <Badge
        variant="outline"
        className={`bg-slate-100 text-slate-700 border-slate-300 gap-1 text-[11px] font-semibold ${className}`}
      >
        <Sparkles className="size-3 text-slate-500" />
        <span>Đã hoàn thành</span>
      </Badge>
    );
  }

  // Fallback mặc định
  return (
    <Badge
      variant="outline"
      className={`bg-slate-100 text-slate-600 border-slate-200 gap-1 text-[11px] ${className}`}
    >
      <AlertCircle className="size-3 text-slate-400" />
      <span>{String(status)}</span>
    </Badge>
  );
}
