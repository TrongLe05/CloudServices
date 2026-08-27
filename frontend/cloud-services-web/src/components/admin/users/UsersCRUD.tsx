"use client";

import * as React from "react";
import { User, Role, UserPageResponse } from "./types";
import { UserHeader } from "./UserHeader";
import { UserTable } from "./UserTable";
import { UserSheet } from "./UserSheet";
import { ResetPasswordSheet } from "./ResetPasswordSheet";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { AdminPagination } from "../AdminPagination";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

interface UsersCRUDProps {
  initialData: UserPageResponse;
  initialRoles: Role[];
}

export function UsersCRUD({ initialData, initialRoles }: UsersCRUDProps) {
  const [users, setUsers] = React.useState<User[]>(initialData?.items || []);
  const [roles, setRoles] = React.useState<Role[]>(initialRoles || []);
  const [totalItems, setTotalItems] = React.useState(initialData?.totalItems || 0);
  const [totalPages, setTotalPages] = React.useState(initialData?.totalPages || 1);
  const [currentPage, setCurrentPage] = React.useState(initialData?.page || 1);
  const [pageSize] = React.useState(10);

  const [search, setSearch] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [togglingUserId, setTogglingUserId] = React.useState<string | null>(null);

  // Dialog States
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false);
  const [resettingUser, setResettingUser] = React.useState<User | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

  const isInitialMount = React.useRef(true);

  // Fetch Users data with debounce
  const fetchUsers = React.useCallback(
    async (page: number, searchVal: string, roleVal: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        if (searchVal.trim()) params.append("search", searchVal.trim());
        if (roleVal.trim()) params.append("roleId", roleVal.trim());

        const res = await fetch(`/api/users?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Không thể tải danh sách người dùng");
        }

        const data: UserPageResponse = await res.json();
        setUsers(data.items || []);
        setTotalItems(data.totalItems || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
      } catch (err: any) {
        toast.add({
          title: "Lỗi tải dữ liệu",
          description: err.message || "Không thể kết nối đến máy chủ",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Trigger search/filter effect
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, search, selectedRole);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedRole, fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, search, selectedRole);
  };

  // Open Actions
  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const handleOpenResetPassword = (user: User) => {
    setResettingUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Quick Toggle Status (Lock / Unlock)
  const handleToggleStatus = async (user: User) => {
    setTogglingUserId(user.id);
    const nextStatus = !user.isActive;

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u))
    );

    try {
      const res = await fetch(`/api/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể thay đổi trạng thái tài khoản");
      }

      toast.add({
        title: nextStatus ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản",
        description: nextStatus
          ? `Tài khoản @${user.username} đã được kích hoạt hoạt động trở lại.`
          : `Tài khoản @${user.username} đã bị khóa và chấm dứt các phiên đăng nhập.`,
        type: "success",
      });
    } catch (err: any) {
      // Revert on error
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: user.isActive } : u))
      );

      toast.add({
        title: "Lỗi thay đổi trạng thái",
        description: err.message || "Không thể cập nhật trạng thái tài khoản",
        type: "error",
      });
    } finally {
      setTogglingUserId(null);
    }
  };

  // Submit Create / Edit
  const handleSubmitUser = async (formData: any) => {
    setActionLoading(true);
    try {
      if (editingUser) {
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể cập nhật người dùng");
        }

        const updated: User = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? updated : u))
        );

        toast.add({
          title: "Cập nhật thành công",
          description: `Đã cập nhật thông tin cho @${updated.username}.`,
          type: "success",
        });
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tạo người dùng mới");
        }

        toast.add({
          title: "Tạo tài khoản thành công",
          description: `Đã tạo tài khoản mới cho @${formData.username}.`,
          type: "success",
        });

        // Tải lại trang 1
        fetchUsers(1, search, selectedRole);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Password Submit
  const handleResetPassword = async (userId: string, newPassword: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể đặt lại mật khẩu");
      }

      toast.add({
        title: "Đặt lại mật khẩu thành công",
        description: `Mật khẩu mới đã được cập nhật thành công cho người dùng.`,
        type: "success",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Submit
  const handleDeleteUser = async (user: User) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể xóa người dùng");
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotalItems((prev) => Math.max(0, prev - 1));

      toast.add({
        title: "Xóa tài khoản thành công",
        description: `Đã xóa tài khoản @${user.username} khỏi hệ thống.`,
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi xóa tài khoản",
        description: err.message || "Không thể xóa người dùng",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header & Controls */}
      <UserHeader
        search={search}
        onSearchChange={setSearch}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        roles={roles}
        totalUsers={totalItems}
        onOpenCreate={handleOpenCreate}
      />

      {/* Table & Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-xs z-10 flex items-center justify-center rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <UserTable
          users={users}
          onEdit={handleOpenEdit}
          onResetPassword={handleOpenResetPassword}
          onToggleStatus={handleToggleStatus}
          onDelete={handleOpenDelete}
          togglingUserId={togglingUserId}
        />
      </div>

      {/* Pagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        itemName="tài khoản"
      />

      {/* Create / Edit Sheet */}
      <UserSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        user={editingUser}
        roles={roles}
        onSubmit={handleSubmitUser}
        loading={actionLoading}
      />

      {/* Reset Password Sheet */}
      <ResetPasswordSheet
        isOpen={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        user={resettingUser}
        onSubmit={handleResetPassword}
        loading={actionLoading}
      />

      {/* Delete User Confirmation */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={deletingUser}
        onConfirm={handleDeleteUser}
        loading={actionLoading}
      />
    </div>
  );
}
