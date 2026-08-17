"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/schema/auth.schema";

interface EmailStepProps {
  onSuccess: (email: string) => void;
}

export const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Không thể gửi mã OTP");
      }

      onSuccess(data.email);
    } catch (err: any) {
      setError(err.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 md:p-8 flex flex-col justify-center h-full"
    >
      <div className="flex flex-col gap-2 text-left mb-6 font-sans">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Quên mật khẩu
        </h1>
        <p className="text-xs text-slate-500 leading-normal">
          Nhập email của bạn để nhận mã xác minh OTP đặt lại mật khẩu tài khoản.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <FieldGroup className="space-y-4">
        <Field className="flex flex-col text-left">
          <FieldLabel
            htmlFor="email"
            className="font-semibold text-xs text-slate-700 mb-1.5"
          >
            Địa chỉ Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            className={`rounded-xl border-slate-200 py-5 text-sm ${
              errors.email ? "border-rose-500 focus:ring-rose-500" : ""
            }`}
          />
          {errors.email && (
            <span className="text-[10px] text-rose-500 font-semibold mt-1.5 pl-1">
              {errors.email.message}
            </span>
          )}
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-xl font-semibold text-xs shadow-md shadow-primary/10 transition-all duration-300 mt-2"
        >
          {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi mã xác thực OTP"}
        </Button>
      </FieldGroup>

      <div className="text-center mt-6 pt-6 border-t border-slate-100 font-sans">
        <Link
          href="/dang-nhap"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors font-semibold"
        >
          <ArrowLeft className="size-3.5" />
          Quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
};
