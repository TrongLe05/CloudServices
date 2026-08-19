"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TipTapToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function TipTapToolbar({ editor, disabled = false }: TipTapToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập đường dẫn URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Nhập đường dẫn hình ảnh (Image URL):");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b border-border sticky top-0 z-10">
      {/* Undo / Redo */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo() || disabled}
        title="Hoàn tác (Undo)"
      >
        <Undo className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo() || disabled}
        title="Làm lại (Redo)"
      >
        <Redo className="size-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Text Styles */}
      <Button
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={disabled}
        title="In đậm (Bold)"
      >
        <Bold className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={disabled}
        title="In nghiêng (Italic)"
      >
        <Italic className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={disabled}
        title="Gạch ngang (Strikethrough)"
      >
        <Strikethrough className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={disabled}
        title="Mã nội dòng (Inline Code)"
      >
        <Code className="size-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Headings */}
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={disabled}
        title="Tiêu đề 1"
      >
        <Heading1 className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={disabled}
        title="Tiêu đề 2"
      >
        <Heading2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={disabled}
        title="Tiêu đề 3"
      >
        <Heading3 className="size-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Lists & Blockquote */}
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={disabled}
        title="Danh sách không thứ tự"
      >
        <List className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={disabled}
        title="Danh sách có thứ tự"
      >
        <ListOrdered className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={disabled}
        title="Trích dẫn (Quote)"
      >
        <Quote className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={disabled}
        title="Đường phân cách ngang"
      >
        <Minus className="size-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Links & Media */}
      <Button
        type="button"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={setLink}
        disabled={disabled}
        title="Chèn liên kết (Link)"
      >
        <LinkIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={addImage}
        disabled={disabled}
        title="Chèn hình ảnh (Image URL)"
      >
        <ImageIcon className="size-4" />
      </Button>
    </div>
  );
}
