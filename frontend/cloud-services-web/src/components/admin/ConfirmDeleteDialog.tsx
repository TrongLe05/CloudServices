"use client";

import * as React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  disabled?: boolean;
  triggerButtonVariant?: "ghost" | "destructive" | "outline" | "default";
  triggerButtonSize?: "icon-sm" | "sm" | "default";
}

export function ConfirmDeleteDialog({
  title,
  description,
  onConfirm,
  disabled = false,
  triggerButtonVariant = "ghost",
  triggerButtonSize = "icon-sm",
}: ConfirmDeleteDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant={triggerButtonVariant}
            size={triggerButtonSize}
            className={triggerButtonVariant === "ghost" ? "text-destructive hover:bg-destructive/10" : ""}
            disabled={disabled || loading}
          />
        }
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading} className="gap-1.5">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
