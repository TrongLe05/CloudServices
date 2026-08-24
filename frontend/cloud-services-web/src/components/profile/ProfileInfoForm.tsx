"use client";

import * as React from "react";
import { User, Mail, AtSign, Save, Loader2 } from "lucide-react";
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
import { UserProfileData } from "./ProfileHeaderCard";

interface ProfileInfoFormProps {
  user: UserProfileData;
  onProfileUpdated: (updatedUser: UserProfileData) => void;
}

export function ProfileInfoForm({
  user,
  onProfileUpdated,
}: ProfileInfoFormProps) {
  const [fullName, setFullName] = React.useState(user.fullName || "");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setFullName(user.fullName || "");
  }, [user.fullName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.add({
        title: "Dữ liệu không hợp lệ",
        description: "Họ và tên không được để trống.",
        type: "error",
      });
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          avatarUrl: user.avatarUrl || null,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Không thể cập nhật thông tin cá nhân.");
      }

      const updated = await res.json();
      onProfileUpdated(updated);

      toast.add({
        title: "Cập nhật thành công",
        description: "Thông tin tài khoản của bạn đã được cập nhật.",
        type: "success",
      });
    } catch (err: unknown) {
      toast.add({
        title: "Lỗi cập nhật",
        description:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi lưu thông tin.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
          <User className="size-5 text-primary" />
          Thông tin cá nhân
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Quản lý thông tin hiển thị và danh tính tài khoản của bạn trên hệ thống.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Tên đăng nhập (Readonly) */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <AtSign className="size-3.5 text-slate-400" />
              Tên tài khoản (Username)
            </Label>
            <Input
              id="username"
              value={user.username}
              disabled
              className="bg-slate-100/80 text-slate-500 cursor-not-allowed text-xs font-mono rounded-xl h-11"
            />
            <p className="text-[11px] text-slate-400">
              Tên tài khoản định danh không thể thay đổi sau khi đăng ký.
            </p>
          </div>

          {/* Địa chỉ Email (Readonly) */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="size-3.5 text-slate-400" />
              Địa chỉ Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-slate-100/80 text-slate-500 cursor-not-allowed text-xs rounded-xl h-11"
            />
            <p className="text-[11px] text-slate-400">
              Email dùng để nhận thông báo đơn hàng và khôi phục mật khẩu.
            </p>
          </div>

          {/* Họ và tên hiển thị (Editable) */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
              Họ và tên hiển thị <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Nhập họ và tên đầy đủ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-xs rounded-xl h-11 focus:ring-primary"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2 flex justify-end border-t border-slate-100">
          <Button
            type="submit"
            disabled={isSaving || fullName.trim() === user.fullName}
            className="rounded-xl px-6 h-11 font-bold text-xs bg-primary text-white shadow-sm hover:bg-primary/95 gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
