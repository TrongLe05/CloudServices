"use client";

import * as React from "react";
import { Loader2, QrCode } from "lucide-react";
import { usePlanQr } from "@/hooks/usePlanQr";

interface PlanQrThumbnailProps {
  planId: string;
  planName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlanQrThumbnail({
  planId,
  planName = "Gói dịch vụ",
  size = "md",
  className = "",
}: PlanQrThumbnailProps) {
  const { qrCodeUrl, loading } = usePlanQr(planId);

  const sizeClasses = {
    sm: "size-16 p-1 rounded-xl",
    md: "size-20 p-1.5 rounded-2xl",
    lg: "size-28 p-2 rounded-2xl",
  };

  const imageSrc = qrCodeUrl
    ? qrCodeUrl.startsWith("data:") || qrCodeUrl.startsWith("http")
      ? qrCodeUrl
      : `data:image/png;base64,${qrCodeUrl}`
    : "";

  return (
    <div
      className={`bg-white border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center shrink-0 overflow-hidden group/qr transition-all duration-200 hover:shadow-md hover:border-primary/40 ${sizeClasses[size]} ${className}`}
      title={`Quét mã QR gói ${planName}`}
    >
      {loading ? (
        <div className="flex items-center justify-center size-full">
          <Loader2 className="size-4 animate-spin text-primary" />
        </div>
      ) : imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={`Mã QR ${planName}`}
          className="size-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center size-full text-slate-300">
          <QrCode className="size-6" />
        </div>
      )}
    </div>
  );
}
