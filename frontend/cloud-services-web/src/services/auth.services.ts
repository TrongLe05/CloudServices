import type { LoginFormValues } from "@/schema/auth.schema";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const register = async (data: LoginFormValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res; // Trả về raw Response để API Route tự xử lý header và body
};

export const login = async (data: LoginFormValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res; // Trả về raw Response để API Route tự xử lý header và body
};

export const logout = async (accessToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res;
};

export const forgotPassword = async (data: { Email: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res;
};

export const verifyOtp = async (data: { Email: string; Otp: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res;
};

export const resetPassword = async (data: { ResetToken: string; NewPassword: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res;
};
