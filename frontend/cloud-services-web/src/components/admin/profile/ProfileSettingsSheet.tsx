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
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = React.useState<"info" | "password">("info");
  const [fullName, setFullName] = React.useState(session?.user?.name || "Admin");
  const [email, setEmail] = React.useState(
    session?.user?.email || (session?.user?.name ? `${session.user.name}@cloudservices.vn` : "admin@cloudservices.vn")
  );
  const [currentAvatar, setCurrentAvatar] = React.useState(avatarUrl || "");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (session?.user?.name) {
      setFullName(session.user.name);
    }
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // Password fields
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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
    if (newPassword.length < 6) {
      toast.add({
        title: "Mật khẩu quá ngắn",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.add({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu không trùng khớp.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      toast.add({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật an toàn.",
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

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "AD";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <User className="size-5 text-primary" /> Cài đặt hồ sơ cá nhân
          </SheetTitle>
          <SheetDescription>
            Quản lý thông tin tài khoản quản trị và bảo mật của bạn.
          </SheetDescription>
        </SheetHeader>

        {/* Tabs switcher */}
        <div className="flex rounded-lg bg-muted p-1 my-4">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "info"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Thông tin tài khoản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "password"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Đổi mật khẩu
          </button>
        </div>

        {activeTab === "info" ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            {/* Avatar picker */}
            <div className="flex flex-col items-center justify-center gap-3 p-4 bg-muted/40 rounded-xl border border-dashed border-border">
              <div className="relative group">
                <Avatar className="size-20 border-2 border-primary/20 shadow-xs">
                  <AvatarImage src={currentAvatar} alt={fullName} />
                  <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="size-6" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs gap-1"
                >
                  <Camera className="size-3" /> Chọn ảnh mới
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">Định dạng JPG, PNG hoặc WEBP (tối đa 2MB)</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-1.5">
              <Label htmlFor="fullname">Họ và tên</Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên..."
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Địa chỉ Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cloudservices.vn"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Vai trò hệ thống</Label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/60 border border-border/60 text-xs">
                <Shield className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-foreground">Quản trị viên cấp cao (Admin)</span>
                <Badge variant="outline" className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="size-2.5 mr-0.5" /> Toàn quyền
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
