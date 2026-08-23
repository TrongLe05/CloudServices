"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Table as TableIcon,
  Eye,
  Columns,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  minHeight?: string;
}

export function MarkdownEditor({
  value = "",
  onChange,
  disabled = false,
  minHeight = "420px",
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = React.useState<"edit" | "split" | "preview">("split");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "", defaultText: string = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const replacement = `${before}${selectedText}${after}`;
    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  };

  // Convert basic markdown to safe HTML for preview
  const renderMarkdownPreview = (md: string) => {
    if (!md) return '<p class="text-slate-400 italic">Chưa có nội dung xem trước...</p>';

    let html = md
      // Escaping
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-900 mt-6 mb-3 border-b border-slate-200 pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-slate-900 mt-6 mb-4 font-heading">$1</h1>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1.5 my-3 bg-slate-50 text-slate-700 italic rounded-r-lg">$1</blockquote>')
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl my-3 overflow-x-auto text-xs font-mono"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 text-primary px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      // Bold & Italic
      .replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em class="italic text-slate-800">$1</em>')
      .replace(/~~([^~]+)~~/gim, '<del class="line-through text-slate-400">$1</del>')
      // Links & Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-xl border border-slate-200 my-3 max-w-full h-auto shadow-xs" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium hover:text-primary/80">$1</a>')
      // Unordered lists
      .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-700 my-1">$1</li>')
      .replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-700 my-1">$1</li>')
      // Ordered lists
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-slate-700 my-1">$1</li>')
      // Paragraphs
      .replace(/\n\n+/g, "</p><p class='text-sm text-slate-700 leading-relaxed my-2'>");

    return `<p class='text-sm text-slate-700 leading-relaxed my-2'>${html}</p>`;
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
      {/* 1. Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-slate-200 bg-slate-50/80">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Style */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("**", "**", "in đậm")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="In đậm (Bold)"
          >
            <Bold className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("*", "*", "in nghiêng")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="In nghiêng (Italic)"
          >
            <Italic className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("~~", "~~", "gạch ngang")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Gạch ngang (Strikethrough)"
          >
            <Strikethrough className="size-4" />
          </Button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Headings */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("# ", "", "Tiêu đề 1")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Tiêu đề H1"
          >
            <Heading1 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("## ", "", "Tiêu đề 2")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Tiêu đề H2"
          >
            <Heading2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("### ", "", "Tiêu đề 3")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Tiêu đề H3"
          >
            <Heading3 className="size-4" />
          </Button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Lists & Quotes */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("- ", "", "Mục danh sách")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Danh sách không thứ tự"
          >
            <List className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("1. ", "", "Mục thứ tự")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Danh sách có thứ tự"
          >
            <ListOrdered className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("> ", "", "Đoạn trích dẫn")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Trích dẫn (Quote)"
          >
            <Quote className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("```\n", "\n```", "Mã nguồn code")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Khối mã code"
          >
            <Code className="size-4" />
          </Button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Links, Images & Tables */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("[", "](https://example.com)", "Văn bản liên kết")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Chèn liên kết (Link)"
          >
            <LinkIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => insertText("![", "](https://images.unsplash.com/...)", "Mô tả ảnh")}
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Chèn ảnh (Image)"
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              insertText(
                "\n| Cột 1 | Cột 2 | Cột 3 |\n| :--- | :---: | ---: |\n| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 |\n"
              )
            }
            disabled={disabled}
            className="size-8 rounded-lg text-slate-700 hover:bg-slate-200/80"
            title="Chèn bảng dữ liệu (Table)"
          >
            <TableIcon className="size-4" />
          </Button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              viewMode === "edit" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="size-3.5" />
            <span className="hidden sm:inline">Soạn thảo</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              viewMode === "split" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns className="size-3.5" />
            <span className="hidden sm:inline">Song song</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              viewMode === "preview" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Xem trước</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Editor Area */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`${viewMode === "edit" ? "col-span-full" : "col-span-1"}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="Nhập nội dung bài viết theo định dạng Markdown..."
              style={{ minHeight }}
              className="w-full p-4 font-mono text-xs leading-relaxed text-slate-800 focus:outline-hidden resize-y bg-transparent"
            />
          </div>
        )}

        {/* Live Preview Area */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`${
              viewMode === "preview" ? "col-span-full" : "col-span-1"
            } p-5 overflow-y-auto bg-slate-50/50`}
            style={{ minHeight, maxHeight: "650px" }}
          >
            <div
              className="prose prose-slate max-w-none prose-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(value) }}
            />
          </div>
        )}
      </div>

      {/* 3. Footer Word Count */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Định dạng: <strong>Markdown GitHub Flavored</strong></span>
        <div className="flex items-center gap-3">
          <span>{wordCount} từ</span>
          <span>{charCount} ký tự</span>
        </div>
      </div>
    </div>
  );
}
