"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditorType } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  disabled?: boolean;
}

export default function TinyMCEEditor({
  value = "",
  onChange,
  disabled = false,
}: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEEditorType | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border">
      <Editor
        apiKey={apiKey}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value={value}
        disabled={disabled}
        onEditorChange={(content) => {
          if (onChange) {
            onChange(content);
          }
        }}
        init={{
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        }}
      />
    </div>
  );
}
