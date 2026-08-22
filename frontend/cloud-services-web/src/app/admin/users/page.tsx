export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { UsersCRUD } from "@/components/admin/users/UsersCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";
import { getAuthAccessToken } from "@/lib/auth-token";
import { Role, UserPageResponse } from "@/components/admin/users/types";

async function getUsers(): Promise<UserPageResponse> {
  try {
    const accessToken = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/users?page=1&pageSize=10`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { items: [], totalItems: 0, page: 1, pageSize: 10, totalPages: 1 };
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return { items: [], totalItems: 0, page: 1, pageSize: 10, totalPages: 1 };
  }
}

async function getRoles(): Promise<Role[]> {
  try {
    const accessToken = await getAuthAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/users/roles`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const usersPromise = getUsers();
  const rolesPromise = getRoles();

  return (
    <Suspense fallback={<PanelSkeleton title="Đang tải danh sách người dùng..." />}>
      <UsersSectionWrapper usersPromise={usersPromise} rolesPromise={rolesPromise} />
    </Suspense>
  );
}

async function UsersSectionWrapper({
  usersPromise,
  rolesPromise,
}: {
  usersPromise: Promise<UserPageResponse>;
  rolesPromise: Promise<Role[]>;
}) {
  const [usersData, rolesData] = await Promise.all([usersPromise, rolesPromise]);
  return <UsersCRUD initialData={usersData} initialRoles={rolesData} />;
}
