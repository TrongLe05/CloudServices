"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsEditorHeaderProps {
  isEdit: boolean;
  id?: string;
  loading: boolean;
}

export function NewsEditorHeader({ isEdit, id, loading }: NewsEditorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Link href="/admin/news">
          <Button type="button" variant="outline" size="icon-sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEdit ? "Chỉnh Sửa Bài Viết" : "Soạn Thảo Bài Viết Mới"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEdit ? `ID: ${id}` : "Trình soạn thảo trực quan TipTap WYSIWYG"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Link href="/admin/news">
          <Button type="button" variant="ghost" disabled={loading}>
            Hủy
          </Button>
        </Link>
        <Button type="submit" disabled={loading} className="gap-1.5">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isEdit ? "Lưu thay đổi" : "Xuất bản bài viết"}
        </Button>
      </div>
    </div>
  );
}
