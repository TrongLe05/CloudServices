"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TipTapToolbar } from "./TipTapToolbar";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung bài viết...",
  disabled = false,
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl border border-border max-h-96 object-cover my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[320px] p-4 focus:outline-hidden focus:ring-0 leading-relaxed",
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
        Đang khởi tạo trình soạn thảo TipTap...
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      <TipTapToolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} className="bg-background" />
    </div>
  );
}
