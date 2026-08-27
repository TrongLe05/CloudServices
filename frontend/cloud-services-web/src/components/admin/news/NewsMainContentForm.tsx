"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TinyMCEEditor from "@/components/common/TinyMCEEditor";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import { FileText, Code2 } from "lucide-react";

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
  const [editorMode, setEditorMode] = React.useState<"wysiwyg" | "markdown">("wysiwyg");

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Nội Dung Bài Viết
        </CardTitle>

        {/* Editor Engine Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setEditorMode("wysiwyg")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              editorMode === "wysiwyg"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Rich Text (WYSIWYG)</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode("markdown")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              editorMode === "markdown"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="size-3.5" />
            <span>Markdown</span>
          </button>
        </div>
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
            <Label>Nội dung chi tiết</Label>
            <span className="text-xs text-muted-foreground">
              {editorMode === "wysiwyg"
                ? "Chế độ soạn thảo trực quan TinyMCE"
                : "Chế độ soạn thảo Markdown đa năng"}
            </span>
          </div>

          {editorMode === "wysiwyg" ? (
            <TinyMCEEditor
              value={content}
              onChange={setContent}
              disabled={loading}
            />
          ) : (
            <MarkdownEditor
              value={content}
              onChange={setContent}
              disabled={loading}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
