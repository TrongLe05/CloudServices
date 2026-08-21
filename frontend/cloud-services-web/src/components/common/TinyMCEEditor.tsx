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
          height: 450,
          menubar: false,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
          image_advtab: true,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          paste_data_images: true,
          file_picker_callback: (callback: any, _value: any, meta: any) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = function () {
                const file = (this as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function () {
                    const id = "blobid" + new Date().getTime();
                    const activeEditor = editorRef.current as any;
                    if (activeEditor?.editorUpload?.blobCache) {
                      const blobCache = activeEditor.editorUpload.blobCache;
                      const base64 = (reader.result as string).split(",")[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      callback(blobInfo.blobUri(), { title: file.name, alt: file.name });
                    } else {
                      callback(reader.result as string, { title: file.name, alt: file.name });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }
          },
          images_upload_handler: (blobInfo: any) =>
            new Promise((resolve) => {
              const base64Uri = "data:" + blobInfo.blob().type + ";base64," + blobInfo.base64();
              resolve(base64Uri);
            }),
        }}
      />
    </div>
  );
}
