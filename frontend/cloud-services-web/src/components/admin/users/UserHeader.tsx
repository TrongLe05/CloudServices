"use client";

import * as React from "react";
import { Plus, Search, UserCheck, Shield, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Role } from "./types";

interface UserHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (roleId: string) => void;
  roles: Role[];
  totalUsers: number;
  onOpenCreate: () => void;
}

export function UserHeader({
  search,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roles,
  totalUsers,
  onOpenCreate,
}: UserHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      {/* Tiêu đề & Nút thêm tài khoản */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" />
            Quản lý tài khoản người dùng
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý danh sách tài khoản, phân quyền quản trị viên, nhân viên và người dùng hệ thống.
          </p>
        </div>

        <Button onClick={onOpenCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Thêm người dùng mới
        </Button>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc vai trò */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-lg border border-border">
        {/* Tìm kiếm */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm theo họ tên, tên đăng nhập hoặc email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Lọc theo Vai trò */}
        <div className="w-full sm:w-56">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => {
              const roleNameLower = (role.name || "").toLowerCase();
              let label = role.name;
              if (roleNameLower === "admin") label = "Quản trị viên (Admin)";
              else if (roleNameLower === "editor") label = "Biên tập viên (Editor)";
              else if (roleNameLower === "user") label = "Khách hàng (User)";
              return (
                <option key={role.id} value={role.id}>
                  Vai trò: {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </header>
  );
}
