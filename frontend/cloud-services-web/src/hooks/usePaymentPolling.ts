"use client";

import * as React from "react";

export interface UsePaymentPollingOptions {
  orderCode?: number | null;
  enabled: boolean;
  intervalMs?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePaymentPolling({
  orderCode,
  enabled,
  intervalMs = 2500,
  onSuccess,
  onError,
}: UsePaymentPollingOptions) {
  const [isPaid, setIsPaid] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkStatus = React.useCallback(async () => {
    if (!orderCode) return false;

    try {
      setIsChecking(true);
      const res = await fetch(`/api/payments/status/${orderCode}`);
      if (res.ok) {
        const data = await res.json();
        const status = data.status || data.Status;
        if (status === "PAID" || status === "COMPLETED" || status === "SUCCESS") {
          setIsPaid(true);
          onSuccess?.();
          return true;
        }
      }
    } catch (err) {
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsChecking(false);
    }
    return false;
  }, [orderCode, onSuccess, onError]);

  React.useEffect(() => {
    if (!enabled || !orderCode || isPaid) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      if (!isMounted) return;
      const success = await checkStatus();
      if (success) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [enabled, orderCode, isPaid, intervalMs, checkStatus]);

  return { isPaid, isChecking, checkStatus };
}
