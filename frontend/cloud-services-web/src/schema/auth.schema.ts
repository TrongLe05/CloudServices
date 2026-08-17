import { z } from "zod";

export const loginSchema = z.object({
  //   email: z
  //     .string()
  //     .min(1, { message: "Email không được để trống" })
  //     .email({ message: "Email không hợp lệ" }),
  username: z.string().min(1, { message: "Tên đăng nhập không được để trống" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullname: z.string().min(1, { message: "Tên đầy đủ không được để trống" }),
    username: z
      .string()
      .min(1, { message: "Tên đăng nhập không được để trống" }),
    email: z
      .string()
      .min(1, { message: "Email không được để trống" })
      .email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
<<<<<<< Updated upstream
=======

// Forgot Password Step 1 Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không hợp lệ" }),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Forgot Password Step 2 Schema (OTP)
export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Mã OTP phải gồm đúng 6 chữ số" }),
});
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// Forgot Password Step 3 Schema (New Password)
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string().min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;



>>>>>>> Stashed changes
