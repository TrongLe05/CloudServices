export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAuthAccessToken } from "@/lib/auth-token";
import { ProfilePageView } from "@/components/profile/ProfilePageView";
import { UserProfileData } from "@/components/profile/ProfileHeaderCard";

async function getMeData(): Promise<UserProfileData | null> {
  try {
    const token = await getAuthAccessToken();
    if (!token) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi tải thông tin cá nhân trong ProfilePage:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/dang-nhap?callbackUrl=/profile");
  }

  const me = await getMeData();

  const userProfile: UserProfileData = me || {
    id: session.user.id || "",
    username: session.user.name || "User",
    email: session.user.email || "",
    fullName: session.user.name || "",
    avatarUrl: session.user.image || "",
    // @ts-ignore
    role: (session.user.role as string) || "User",
    status: true,
  };

  return <ProfilePageView initialUser={userProfile} />;
}
