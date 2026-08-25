"use client";

import * as React from "react";
import { QrCode, X, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { usePlanQr } from "@/hooks/usePlanQr";

export interface PlanQrModalProps {
  planId: string;
  planName: string;
  categoryName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanQrModal({
  planId,
  planName,
  categoryName,
  isOpen,
  onClose,
}: PlanQrModalProps) {
  const { qrCodeUrl, loading } = usePlanQr(isOpen ? planId : undefined);
  const [copied, setCopied] = React.useState(false);
  const targetUrl = typeof window !== "undefined" ? `${window.location.origin}/dich-vu/${planId}` : "";

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      toast.add({
        title: "Đã sao chép liên kết",
        description: "Đường dẫn quét mã QR đã được lưu vào bộ nhớ tạm.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const imageSrc = qrCodeUrl
    ? qrCodeUrl.startsWith("data:") || qrCodeUrl.startsWith("http")
      ? qrCodeUrl
      : `data:image/png;base64,${qrCodeUrl}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <QrCode className="size-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                Mã QR Gói Dịch Vụ
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {planName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {categoryName && (
            <Badge variant="secondary" className="text-[10px] text-slate-600 bg-slate-100 font-semibold px-2.5 py-0.5">
              {categoryName}
            </Badge>
          )}

          {loading ? (
            <div className="size-48 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-7 animate-spin text-primary" />
              <span className="text-xs text-slate-500 font-medium">
                Đang tạo mã QR...
              </span>
            </div>
          ) : imageSrc ? (
            <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={`Mã QR ${planName}`}
                width={192}
                height={192}
                className="size-48 object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="size-48 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center p-4 text-xs text-slate-400">
              Chưa có mã QR cho gói này
            </div>
          )}

          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Quét mã bằng camera điện thoại để mở nhanh trang chi tiết cấu hình và đặt mua gói <strong>{planName}</strong>.
          </p>

          {/* URL Box */}
          {targetUrl && (
            <div className="w-full space-y-1.5 pt-1">
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="truncate font-mono text-[11px] text-slate-600 text-left">
                  {targetUrl}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="size-7 shrink-0 text-slate-500 hover:text-primary"
                >
                  {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                </Button>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs rounded-xl"
                  render={
                    <a href={targetUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <ExternalLink className="size-3.5 mr-1" /> Truy cập trang
                </Button>
                <Button
                  onClick={onClose}
                  size="sm"
                  className="w-full text-xs rounded-xl"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
