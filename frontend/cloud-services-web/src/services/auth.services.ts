import type { LoginFormValues } from "@/schema/auth.schema";
import { getBackendApiUrl } from "@/lib/api-url";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const register = async (data: LoginFormValues) => {
  const apiUrl = getBackendApiUrl();
  const res = await fetch(
    `${apiUrl}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res; // Trả về raw Response để API Route tự xử lý header và body
};

export const login = async (data: LoginFormValues) => {
  const apiUrl = getBackendApiUrl();
  const res = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res; // Trả về raw Response để API Route tự xử lý header và body
};

export const logout = async (accessToken: string) => {
  const apiUrl = getBackendApiUrl();
  const res = await fetch(
    `${apiUrl}/api/auth/logout`,
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
  const apiUrl = getBackendApiUrl();
  const res = await fetch(
    `${apiUrl}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res;
};

export const verifyOtp = async (data: { Email: string; Otp: string }) => {
  const apiUrl = getBackendApiUrl();
  const res = await fetch(
    `${apiUrl}/api/auth/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res;
};

export const resetPassword = async (data: { ResetToken: string; NewPassword: string }) => {
  const apiUrl = getBackendApiUrl();
  const res = await fetch(
    `${apiUrl}/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res;
};
