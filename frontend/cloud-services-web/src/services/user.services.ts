export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  role?: string;
}

export interface UpdateProfileInput {
  fullName: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const getCurrentUser = async () => {
  const res = await fetch("/api/auth/me", {
    cache: "no-store",
  });
  return res;
};

export const updateCurrentUser = async (data: UpdateProfileInput) => {
  const res = await fetch("/api/auth/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};

export const changeUserPassword = async (data: ChangePasswordInput) => {
  const res = await fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};
