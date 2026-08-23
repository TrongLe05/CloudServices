"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role, User } from "./types";
import { Loader2, UserPlus, UserCog, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: Role[];
  onSubmit: (formData: any) => Promise<void>;
  loading: boolean;
}

export function UserSheet({
  isOpen,
  onOpenChange,
  user,
  roles,
  onSubmit,
  loading,
}: UserSheetProps) {
  const { data: session } = useSession();
  const isEdit = !!user;

  // Kiểm tra xem có đang tự sửa tài khoản của mình hay không
  const isSelf = !!(
    user &&
    ((session?.user as any)?.id === user.id ||
      session?.user?.name === user.username)
  );

  // Kiểm tra xem có phải tài khoản admin mặc định hay không
  const isDefaultAdmin = user?.username.toLowerCase() === "admin";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [roleId, setRoleId] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFullName(user.fullName);
      setEmail(user.email);
      setRoleId(user.roleId);
      setIsActive(user.isActive);
      setAvatarUrl(user.avatarUrl || "");
      setPassword("");
    } else {
      setUsername("");
      setPassword("");
      setFullName("");
      setEmail("");
      setRoleId(roles[0]?.id || "");
      setIsActive(true);
      setAvatarUrl("");
    }
    setError(null);
  }, [user, roles, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !username.trim()) {
      setError("Vui lòng nhập tên đăng nhập.");
      return;
    }

    if (!isEdit && (!password || password.length < 6)) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }

    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Vui lòng nhập email hợp lệ.");
      return;
    }

    if (!roleId) {
      setError("Vui lòng chọn vai trò cho người dùng.");
      return;
    }

    const payload = isEdit
      ? {
          fullName: fullName.trim(),
          email: email.trim(),
          roleId: isSelf || isDefaultAdmin ? user?.roleId : roleId,
          isActive: isSelf || isDefaultAdmin ? user?.isActive : isActive,
          avatarUrl: avatarUrl.trim() || null,
        }
      : {
          username: username.trim(),
          password,
          fullName: fullName.trim(),
          email: email.trim(),
          roleId,
          avatarUrl: avatarUrl.trim() || null,
        };

    try {
      await onSubmit(payload);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi lưu thông tin.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full max-h-screen bg-card border-l border-border"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          {/* Header (Cố định ở trên) */}
          <SheetHeader className="px-6 py-5 border-b border-border shrink-0 text-left">
            <SheetTitle className="flex items-center gap-2 text-lg">
              {isEdit ? (
                <>
                  <UserCog className="h-5 w-5 text-primary" />
                  Chỉnh sửa tài khoản
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 text-primary" />
                  Tạo người dùng mới
                </>
              )}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              {isEdit
                ? `Cập nhật thông tin cho tài khoản @${user?.username}.`
                : "Điền thông tin để tạo tài khoản người dùng mới."}
            </SheetDescription>
          </SheetHeader>

          {/* Body có thanh cuộn mượt mà (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs font-medium text-destructive">
                {error}
              </div>
            )}

            {/* Cảnh báo khi tự sửa tài khoản */}
            {isSelf && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Bạn đang chỉnh sửa tài khoản của chính mình. Vai trò và trạng thái tài khoản sẽ được cố định để đảm bảo an toàn hệ thống.
                </span>
              </div>
            )}

            {/* Tên đăng nhập */}
            <div className="space-y-1.5">
              <Label htmlFor="sheet-username" className="text-xs font-medium">
                Tên đăng nhập <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sheet-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ví dụ: nguyenvana"
                disabled={isEdit || loading}
                className={isEdit ? "bg-muted cursor-not-allowed text-xs h-9" : "text-xs h-9"}
              />
            </div>

            {/* Mật khẩu (chỉ khi tạo mới) */}
            {!isEdit && (
              <div className="space-y-1.5">
                <Label htmlFor="sheet-password" className="text-xs font-medium">
                  Mật khẩu khởi tạo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sheet-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  disabled={loading}
                  className="text-xs h-9"
                />
              </div>
            )}

            {/* Họ và tên */}
            <div className="space-y-1.5">
              <Label htmlFor="sheet-fullName" className="text-xs font-medium">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sheet-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ví dụ: Nguyễn Văn A"
                disabled={loading}
                className="text-xs h-9"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="sheet-email" className="text-xs font-medium">
                Địa chỉ Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sheet-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ví dụ: a.nguyen@cloudservices.vn"
                disabled={loading}
                className="text-xs h-9"
              />
            </div>

            {/* Phân quyền vai trò */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="sheet-role" className="text-xs font-medium">
                  Vai trò hệ thống <span className="text-destructive">*</span>
                </Label>
                {(isSelf || isDefaultAdmin) && (
                  <span className="text-[11px] text-muted-foreground italic">
                    (Không thể thay đổi)
                  </span>
                )}
              </div>
              <select
                id="sheet-role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                disabled={loading || isSelf || isDefaultAdmin}
                className={`w-full h-9 rounded-md border border-input px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  isSelf || isDefaultAdmin ? "bg-muted cursor-not-allowed text-muted-foreground" : "bg-background font-medium"
                }`}
              >
                {roles.map((r) => {
                  const roleNameLower = (r.name || "").toLowerCase();
                  let displayDesc = r.description;
                  if (!displayDesc) {
                    if (roleNameLower === "admin") displayDesc = "Toàn quyền quản trị hệ thống";
                    else if (roleNameLower === "editor") displayDesc = "Biên tập tin tức & Quản lý yêu cầu/Affiliate";
                    else if (roleNameLower === "user") displayDesc = "Khách hàng thành viên";
                  }
                  return (
                    <option key={r.id} value={r.id}>
                      {r.name} {displayDesc ? `— (${displayDesc})` : ""}
                    </option>
                  );
                })}
              </select>

              {/* Role Help Text */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1 mt-1.5">
                <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
                  <span>ℹ️ Quyền hạn của các vai trò:</span>
                </div>
                <ul className="space-y-0.5 text-[11px] pl-3 list-disc text-slate-500">
                  <li><strong className="text-rose-600">Admin:</strong> Toàn quyền quản trị, cấu hình giá, gói, tài khoản &amp; logs.</li>
                  <li><strong className="text-indigo-600">Editor:</strong> Quản lý bài viết tin tức/blog, duyệt yêu cầu đặt dịch vụ và CTV affiliate.</li>
                  <li><strong className="text-slate-700">User:</strong> Khách hàng thành viên trên website.</li>
                </ul>
              </div>
            </div>

            {/* Trạng thái hoạt động (chỉ khi sửa) */}
            {isEdit && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sheet-status" className="text-xs font-medium">
                    Trạng thái tài khoản
                  </Label>
                  {(isSelf || isDefaultAdmin) && (
                    <span className="text-[11px] text-muted-foreground italic">
                      (Không thể tự khóa)
                    </span>
                  )}
                </div>
                <select
                  id="sheet-status"
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  disabled={loading || isSelf || isDefaultAdmin}
                  className={`w-full h-9 rounded-md border border-input px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    isSelf || isDefaultAdmin ? "bg-muted cursor-not-allowed text-muted-foreground" : "bg-background"
                  }`}
                >
                  <option value="true">Hoạt động bình thường</option>
                  <option value="false">Khóa tài khoản</option>
                </select>
              </div>
            )}

            {/* Avatar URL */}
            <div className="space-y-1.5">
              <Label htmlFor="sheet-avatarUrl" className="text-xs font-medium">
                Ảnh đại diện (URL)
              </Label>
              <Input
                id="sheet-avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                disabled={loading}
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* Footer (Cố định ở dưới) */}
          <SheetFooter className="px-6 py-4 border-t border-border bg-card/80 backdrop-blur-xs shrink-0 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
