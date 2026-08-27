"use client";

import * as React from "react";
import { getRemainingPaymentSeconds, formatTimer } from "@/lib/formatUtils";

export interface UseCountdownTimerOptions {
  createdAt?: string | null;
  totalDurationSeconds?: number;
  onExpire?: () => void;
}

export function useCountdownTimer({
  createdAt,
  totalDurationSeconds = 300,
  onExpire,
}: UseCountdownTimerOptions) {
  const [remaining, setRemaining] = React.useState<number>(() =>
    createdAt ? getRemainingPaymentSeconds(createdAt, totalDurationSeconds) : totalDurationSeconds
  );

  const hasExpiredRef = React.useRef(false);

  React.useEffect(() => {
    if (!createdAt) return;

    const tick = () => {
      const currentRemaining = getRemainingPaymentSeconds(createdAt, totalDurationSeconds);
      setRemaining(currentRemaining);

      if (currentRemaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [createdAt, totalDurationSeconds, onExpire]);

  return {
    remaining,
    formattedTime: formatTimer(remaining),
    isExpired: remaining <= 0,
    isUrgent: remaining > 0 && remaining < 60,
  };
}
