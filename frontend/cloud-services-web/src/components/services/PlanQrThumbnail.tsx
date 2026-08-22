"use client";

import * as React from "react";
import { Loader2, QrCode } from "lucide-react";

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
  const [qrBase64, setQrBase64] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!planId) return;

    let isMounted = true;
    const fetchQr = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/service-plans/${planId}/qr-code`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setQrBase64(data.qrCodeBase64);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải mã QR:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQr();
    return () => {
      isMounted = false;
    };
  }, [planId]);

  const sizeClasses = {
    sm: "size-16 p-1 rounded-xl",
    md: "size-20 p-1.5 rounded-2xl",
    lg: "size-28 p-2 rounded-2xl",
  };

  const imageSrc = qrBase64
    ? qrBase64.startsWith("data:")
      ? qrBase64
      : `data:image/png;base64,${qrBase64}`
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
