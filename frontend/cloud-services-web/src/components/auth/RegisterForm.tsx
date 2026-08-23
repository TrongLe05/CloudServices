"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RegisterFormValues, registerSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Đăng ký thất bại");
      }

      toast.add({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập.",
        type: "success",
      });

      router.push("/dang-nhap");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Không thể tạo tài khoản, vui lòng thử lại.";
      setServerError(msg);
      toast.add({
        title: "Đăng ký thất bại",
        description: msg,
        type: "error",
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold font-heading">Tạo tài khoản mới</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Nhập thông tin bên dưới để đăng ký tài khoản CloudServices
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Full Name Field */}
        <Field>
          <FieldLabel htmlFor="fullname">Họ và tên</FieldLabel>
          <Input
            id="fullname"
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            autoComplete="name"
            {...register("fullname")}
            className={errors.fullname ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
          />
          {errors.fullname && (
            <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.fullname.message}</span>
            </p>
          )}
        </Field>

        {/* Username Field */}
        <Field>
          <FieldLabel htmlFor="username">Tên tài khoản (Username)</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="Ví dụ: nguyenvana"
            autoComplete="username"
            {...register("username")}
            className={errors.username ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
          />
          {errors.username && (
            <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.username.message}</span>
            </p>
          )}
        </Field>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Địa chỉ Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="a.nguyen@example.com"
            autoComplete="email"
            {...register("email")}
            className={errors.email ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </Field>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{errors.password.message}</span>
              </p>
            )}
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel htmlFor="confirm-password">Xác nhận Mật khẩu</FieldLabel>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={`pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{errors.confirmPassword.message}</span>
              </p>
            )}
          </Field>
        </div>

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-full font-bold">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Đang tạo tài khoản...
              </span>
            ) : (
              "Tạo Tài Khoản"
            )}
          </Button>
        </Field>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Hoặc tiếp tục với
        </FieldSeparator>

        <Field className="grid grid-cols-3 gap-3">
          <Button variant="outline" type="button" className="h-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Sign up with Apple</span>
          </Button>
          <Button variant="outline" type="button" className="h-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Sign up with Google</span>
          </Button>
          <Button variant="outline" type="button" className="h-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
              <path
                d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Sign up with Meta</span>
          </Button>
        </Field>

        <FieldDescription className="text-center text-xs">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-bold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
