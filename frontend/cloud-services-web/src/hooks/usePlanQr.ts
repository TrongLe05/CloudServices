"use client";

import * as React from "react";
import { getPlanQrCode } from "@/services/plan.services";

export function usePlanQr(planId?: string) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchQr = React.useCallback(async () => {
    if (!planId) {
      setQrCodeUrl(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getPlanQrCode(planId);
      if (res.ok) {
        const data = await res.json();
        setQrCodeUrl(data.qrCodeBase64 || data.qrCodeUrl || data.qrCode || null);
      } else {
        setQrCodeUrl(null);
      }
    } catch (err: any) {
      setError(err?.message || "Không thể tải mã QR dịch vụ");
      setQrCodeUrl(null);
    } finally {
      setLoading(false);
    }
  }, [planId]);

  React.useEffect(() => {
    fetchQr();
  }, [fetchQr]);

  return {
    qrCodeUrl,
    loading,
    error,
    refreshQr: fetchQr,
  };
}
