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
import { User } from "./types";
import { KeyRound, Loader2 } from "lucide-react";

interface ResetPasswordSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (userId: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

export function ResetPasswordSheet({
  isOpen,
  onOpenChange,
  user,
  onSubmit,
  loading,
}: ResetPasswordSheetProps) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return;

    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    try {
      await onSubmit(user.id, newPassword);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Không thể đặt lại mật khẩu.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full max-h-screen bg-card border-l border-border"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <SheetHeader className="px-6 py-5 border-b border-border shrink-0 text-left">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5 text-amber-500" />
              Đặt lại mật khẩu
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              Thiết lập mật khẩu mới cho người dùng{" "}
              <span className="font-semibold text-foreground">
                {user?.fullName} (@{user?.username})
              </span>
              .
            </SheetDescription>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs font-medium text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reset-newPassword" className="text-xs font-medium">
                Mật khẩu mới <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reset-newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                disabled={loading}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reset-confirmPassword" className="text-xs font-medium">
                Xác nhận mật khẩu mới <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reset-confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* Footer */}
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
              Cập nhật mật khẩu
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
