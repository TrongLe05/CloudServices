"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, ResetPasswordFormValues } from "@/schema/auth.schema";

interface NewPasswordStepProps {
  resetToken: string;
  onSuccess: () => void;
}

export const NewPasswordStep = ({ resetToken, onSuccess }: NewPasswordStepProps) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          newPassword: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Đã xảy ra lỗi khi đặt lại mật khẩu");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col justify-center h-full">
      <div className="flex flex-col gap-2 text-left mb-6 font-sans">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Đặt lại mật khẩu</h1>
        <p className="text-xs text-slate-500 leading-normal">
          Nhập mật khẩu mới bảo mật cao cho tài khoản của bạn.
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
          <FieldLabel htmlFor="password" className="font-semibold text-xs text-slate-700 mb-1.5">Mật khẩu mới</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={`rounded-xl border-slate-200 py-5 text-sm ${
              errors.password ? "border-rose-500 focus:ring-rose-500" : ""
            }`}
          />
          {errors.password && (
            <span className="text-[10px] text-rose-500 font-semibold mt-1.5 pl-1">
              {errors.password.message}
            </span>
          )}
        </Field>

        <Field className="flex flex-col text-left">
          <FieldLabel htmlFor="confirm-password" className="font-semibold text-xs text-slate-700 mb-1.5">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={`rounded-xl border-slate-200 py-5 text-sm ${
              errors.confirmPassword ? "border-rose-500 focus:ring-rose-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-[10px] text-rose-500 font-semibold mt-1.5 pl-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </Field>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-xl font-semibold text-xs shadow-md shadow-primary/10 transition-all duration-300 mt-2"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </Button>
      </FieldGroup>
    </form>
  );
};
