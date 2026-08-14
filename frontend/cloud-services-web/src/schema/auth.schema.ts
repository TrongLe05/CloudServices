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
