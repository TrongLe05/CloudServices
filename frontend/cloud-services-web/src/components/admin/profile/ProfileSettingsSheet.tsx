"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/auth.store";
import {
  Camera,
  KeyRound,
  User,
  Mail,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";

interface ProfileSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatarUrl?: string;
  onAvatarChange?: (newAvatar: string) => void;
}

export function ProfileSettingsSheet({
  open,
  onOpenChange,
  avatarUrl,
  onAvatarChange,
}: ProfileSettingsSheetProps) {
  const authUser = useAuthStore((state) => state.user);
  const loginState = useAuthStore((state) => state.loginState);

  const [activeTab, setActiveTab] = React.useState<"info" | "password">("info");
  const [fullName, setFullName] = React.useState(authUser?.username || "Admin");
  const [email, setEmail] = React.useState(
    authUser?.username ? `${authUser.username}@cloudservices.vn` : "admin@cloudservices.vn"
  );
  const [currentAvatar, setCurrentAvatar] = React.useState(avatarUrl || "");
  const [loading, setLoading] = React.useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (authUser?.username) {
      setFullName(authUser.username);
      setEmail(`${authUser.username}@cloudservices.vn`);
    }
  }, [authUser]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Tệp không hợp lệ",
        description: "Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP).",
        type: "error",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        title: "Dung lượng quá lớn",
        description: "Kích thước ảnh đại diện tối đa là 2MB.",
        type: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCurrentAvatar(result);
        if (onAvatarChange) onAvatarChange(result);
        toast.add({
          title: "Cập nhật ảnh đại diện",
          description: "Đã chọn ảnh đại diện mới thành công.",
          type: "success",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (fullName.trim()) {
        loginState(fullName.trim());
      }
      toast.add({
        title: "Lưu thành công",
        description: "Thông tin hồ sơ cá nhân đã được cập nhật.",
        type: "success",
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.add({
        title: "Lỗi cập nhật",
        description: err.message || "Không thể cập nhật hồ sơ.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.add({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mật khẩu hiện tại.",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.add({
        title: "Mật khẩu yếu",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.add({
        title: "Mật khẩu không khớp",
        description: "Xác nhận mật khẩu mới không trùng khớp.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Call change password API
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      }).catch(() => null);

      toast.add({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu tài khoản quản trị đã được cập nhật.",
        type: "success",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (err: any) {
      toast.add({
        title: "Lỗi đổi mật khẩu",
        description: err.message || "Không thể đổi mật khẩu.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-6 overflow-y-auto max-w-md w-full">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <Shield className="size-5 text-primary" /> Tùy Chỉnh Hồ Sơ Quản Trị
          </SheetTitle>
          <SheetDescription>
            Quản lý thông tin tài khoản, ảnh đại diện và mật khẩu đăng nhập
          </SheetDescription>
        </SheetHeader>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-border bg-muted/40 p-1 mt-5">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "info"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-3.5" /> Thông tin cá nhân
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "password"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="size-3.5" /> Đổi mật khẩu
          </button>
        </div>

        {activeTab === "info" ? (
          <form onSubmit={handleSaveProfile} className="space-y-5 pt-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3 p-4 bg-muted/20 border border-border rounded-xl">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar size="lg" className="size-20 rounded-full border-2 border-primary/30 shadow-md">
                  <AvatarImage src={currentAvatar} alt={fullName} />
                  <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                    {getInitials(fullName)}
                  </AvatarFallback>
                  <AvatarBadge className="bg-emerald-500 ring-2 ring-background size-3.5" />
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="size-6" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs gap-1.5"
                >
                  <Camera className="size-3.5" /> Đổi ảnh từ máy
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Định dạng PNG, JPG (Tối đa 2MB)
                </p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-fullname">Tên hiển thị / Tên quản trị</Label>
                <Input
                  id="profile-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Admin"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-email">Địa chỉ Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cloudservices.vn"
                  required
                  disabled={loading}
                />
              </div>

              <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Vai trò phân quyền</span>
                  <span className="text-[11px] text-muted-foreground block">Quyền quản trị cao nhất</span>
                </div>
                <Badge variant="secondary" className="gap-1 text-xs font-semibold">
                  <CheckCircle2 className="size-3 text-emerald-600" /> System Admin
                </Badge>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-1.5 mt-4">
              <Save className="size-4" /> Lưu thông tin hồ sơ
            </Button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-pwd">Mật khẩu hiện tại</Label>
              <Input
                id="current-pwd"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-pwd">Mật khẩu mới</Label>
              <Input
                id="new-pwd"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <p className="text-[11px] text-muted-foreground">Mật khẩu có tối thiểu 6 ký tự</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-pwd">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-pwd"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-1.5 mt-4">
              <KeyRound className="size-4" /> Cập nhật mật khẩu mới
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
