"use client";

import * as React from "react";
import { KeyRound, ShieldAlert, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ProfileSecurityForm() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPass, setShowCurrentPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.add({
        title: "Dữ liệu thiếu",
        description: "Vui lòng nhập mật khẩu hiện tại.",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.add({
        title: "Mật khẩu quá ngắn",
        description: "Mật khẩu mới phải có tối thiểu 6 ký tự.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.add({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu xác nhận không trùng khớp với mật khẩu mới.",
        type: "error",
      });
      return;
    }

    try {
      setIsChanging(true);
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
      }

      toast.add({
        title: "Đổi mật khẩu thành công!",
        description: "Mật khẩu của bạn đã được cập nhật thành công.",
        type: "success",
      });

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.add({
        title: "Lỗi đổi mật khẩu",
        description:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi đổi mật khẩu.",
        type: "error",
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
          <KeyRound className="size-5 text-indigo-600" />
          Bảo mật &amp; Đổi mật khẩu
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Đảm bảo tài khoản an toàn bằng cách sử dụng mật khẩu mạnh kết hợp chữ, số và ký tự đặc biệt.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Mật khẩu hiện tại */}
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-xs font-semibold text-slate-700">
              Mật khẩu hiện tại <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPass ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="text-xs rounded-xl h-11 pr-10 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-700">
              Mật khẩu mới (tối thiểu 6 ký tự) <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPass ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-xs rounded-xl h-11 pr-10 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
              Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type={showNewPass ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-xs rounded-xl h-11 focus:ring-primary"
              required
            />
          </div>

          {/* Security Tip Box */}
          <aside className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2.5">
            <ShieldAlert className="size-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Sau khi đổi mật khẩu thành công, phiên đăng nhập trên các thiết bị khác sẽ được làm mới để đảm bảo tính an toàn cho tài khoản.
            </p>
          </aside>
        </CardContent>

        <CardFooter className="pt-2 flex justify-end border-t border-slate-100">
          <Button
            type="submit"
            disabled={isChanging || !currentPassword || !newPassword || !confirmPassword}
            className="rounded-xl px-6 h-11 font-bold text-xs bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 gap-2"
          >
            {isChanging ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Cập nhật mật khẩu</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
