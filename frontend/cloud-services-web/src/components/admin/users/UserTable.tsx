"use client";

import * as React from "react";
import {
  Edit2,
  KeyRound,
  Trash2,
  Shield,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "./types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
  togglingUserId?: string | null;
}

export function UserTable({
  users,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
  togglingUserId,
}: UserTableProps) {
  const getRoleBadge = (roleName: string) => {
    const r = roleName.toLowerCase();
    if (r === "admin") {
      return (
        <Badge variant="destructive" className="font-semibold gap-1 text-xs">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    }
    if (r === "staff" || r === "manager") {
      return (
        <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1 text-xs">
          Nhân viên
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="font-medium gap-1 text-xs">
        <UserIcon className="h-3 w-3" />
        {roleName}
      </Badge>
    );
  };

  const getInitials = (name: string, username: string) => {
    const target = name || username || "U";
    return target.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-lg border border-border">
        <UserIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-semibold text-foreground">
          Không tìm thấy tài khoản người dùng
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Không có người dùng nào khớp với bộ lọc tìm kiếm hiện tại. Vui lòng thử từ khóa khác.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[280px]">Người dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[130px]">Vai trò</TableHead>
            <TableHead className="w-[130px]">Trạng thái</TableHead>
            <TableHead className="w-[170px]">Ngày tạo</TableHead>
            <TableHead className="w-[160px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isToggling = togglingUserId === user.id;
            const isDefaultAdmin = user.username.toLowerCase() === "admin";

            return (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                {/* Cột thông tin người dùng */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getInitials(user.fullName, user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-foreground text-sm truncate">
                        {user.fullName || user.username}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Cột Email */}
                <TableCell className="text-sm text-muted-foreground">
                  {user.email || "—"}
                </TableCell>

                {/* Cột Vai trò */}
                <TableCell>
                  {getRoleBadge(user.roleName)}
                </TableCell>

                {/* Cột Trạng thái */}
                <TableCell>
                  {user.isActive ? (
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 gap-1 text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 gap-1 text-xs font-medium">
                      <XCircle className="h-3 w-3" />
                      Đã khóa
                    </Badge>
                  )}
                </TableCell>

                {/* Cột Ngày tạo */}
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>

                {/* Cột Nút Thao tác trực tiếp */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Nút Khóa / Mở khóa nhanh */}
                    {!isDefaultAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleStatus(user)}
                        disabled={isToggling}
                        title={user.isActive ? "Khóa nhanh tài khoản" : "Mở khóa tài khoản"}
                        className={`h-8 w-8 transition-colors ${
                          user.isActive
                            ? "hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                            : "hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : user.isActive ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {user.isActive ? "Khóa" : "Mở khóa"}
                        </span>
                      </Button>
                    )}

                    {/* Nút sửa */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      title="Chỉnh sửa thông tin"
                      className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Sửa</span>
                    </Button>

                    {/* Nút đặt lại mật khẩu */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onResetPassword(user)}
                      title="Đặt lại mật khẩu"
                      className="h-8 w-8 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span className="sr-only">Đổi mật khẩu</span>
                    </Button>

                    {/* Nút xóa (ẩn cho admin chính) */}
                    {!isDefaultAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user)}
                        title="Xóa tài khoản"
                        className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
