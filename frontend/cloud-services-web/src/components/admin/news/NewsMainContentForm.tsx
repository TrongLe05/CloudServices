"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TipTapEditor } from "./TipTapEditor";

interface NewsMainContentFormProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  loading: boolean;
}

export function NewsMainContentForm({
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
  loading,
}: NewsMainContentFormProps) {
  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Nội Dung Bài Viết</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="news-title">Tiêu đề bài viết</Label>
          <Input
            id="news-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            className="text-base font-medium"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="news-slug">Đường dẫn tĩnh (Slug)</Label>
          <Input
            id="news-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="duong-dan-bai-viet"
            className="font-mono text-xs text-muted-foreground"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between pb-1">
            <Label>Nội dung chi tiết (TipTap Rich Text)</Label>
            <span className="text-xs text-muted-foreground">Soạn thảo trực quan WYSIWYG</span>
          </div>
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Bắt đầu viết nội dung bài viết, chèn ảnh hoặc định dạng văn bản tại đây..."
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
