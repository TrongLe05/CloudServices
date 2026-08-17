"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OtpStepProps {
  email: string;
  onSuccess: (resetToken: string) => void;
  onBack: () => void;
}

export const OtpStep = ({ email, onSuccess, onBack }: OtpStepProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Vui lòng nhập đủ mã OTP 6 chữ số.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Mã OTP không chính xác hoặc đã hết hạn");
      }

      onSuccess(result.resetToken);
    } catch (err: any) {
      setError(err.message || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Không thể gửi lại mã OTP");
      }
    } catch (err: any) {
      setError(err.message || "Không thể gửi lại mã OTP. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6 md:p-8 flex flex-col justify-center h-full">
      <div className="flex flex-col gap-2 text-left mb-6 font-sans">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Xác minh OTP</h1>
        <p className="text-xs text-slate-500 leading-normal">
          Nhập mã OTP gồm 6 chữ số đã được gửi tới email:
          <span className="block font-bold text-slate-800 mt-0.5">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <FieldGroup className="space-y-6">
        <Field className="flex flex-col items-center">
          <FieldLabel className="font-semibold text-xs text-slate-700 mb-3 self-start">Mã xác nhận</FieldLabel>
          
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="rounded-xl border-slate-200 size-11 text-sm font-bold font-mono" />
              <InputOTPSlot index={1} className="rounded-xl border-slate-200 size-11 text-sm font-bold font-mono" />
              <InputOTPSlot index={2} className="rounded-xl border-slate-200 size-11 text-sm font-bold font-mono" />
              <InputOTPSlot index={3} className="rounded-xl border-slate-200 size-11 text-sm font-bold font-mono" />
              <InputOTPSlot index={4} className="rounded-xl border-slate-200 size-11 text-sm font-bold font-mono" />
              <InputOTPSlot index={5} className="rounded-xl border-slate-200 size-11 text-sm font-bold font-mono" />
            </InputOTPGroup>
          </InputOTP>
        </Field>

        <div className="flex justify-between items-center text-xs pt-1 font-sans">
          <span className="text-slate-400">Không nhận được mã?</span>
          {countdown > 0 ? (
            <span className="text-slate-550 font-semibold font-mono bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="size-3 text-slate-400" />
              Gửi lại sau ({countdown}s)
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-primary hover:underline font-bold transition-all"
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || otp.length < 6}
          className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-xl font-semibold text-xs shadow-md shadow-primary/10 transition-all duration-300"
        >
          {isLoading ? "Đang xác thực..." : "Xác nhận mã OTP"}
        </Button>
      </FieldGroup>

      <div className="text-center mt-6 pt-6 border-t border-slate-100 font-sans">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors font-semibold"
        >
          <ArrowLeft className="size-3.5" />
          Quay lại bước trước
        </button>
      </div>
    </form>
  );
};
