"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { NewsItem } from "./NewsCRUD";
import { NewsEditorHeader } from "./news/NewsEditorHeader";
import { NewsMainContentForm } from "./news/NewsMainContentForm";
import { NewsSidebarSettings } from "./news/NewsSidebarSettings";
import { toast } from "@/components/ui/toast";

interface NewsEditorFormProps {
  initialData?: NewsItem | null;
  isEdit?: boolean;
}

export function NewsEditorForm({ initialData, isEdit = false }: NewsEditorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Form states
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [category, setCategory] = React.useState(initialData?.category || "Tin tức");
  const [content, setContent] = React.useState(initialData?.content || "");
  const [thumbnailUrl, setThumbnailUrl] = React.useState(initialData?.thumbnailUrl || "");
  const [isPublished, setIsPublished] = React.useState(!!initialData?.publishedAt || !isEdit);

  const categoriesList = ["Tin tức", "Công nghệ", "Khuyến mãi", "Hướng dẫn", "Thông báo"];

  // Auto-generate slug when creating
  React.useEffect(() => {
    if (!isEdit && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[đĐ]/g, "d")
        .replace(/([^a-z0-9\s-]|_)+/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Tiêu đề bài viết là bắt buộc");
      return;
    }
    if (!slug.trim()) {
      setError("Đường dẫn (slug) là bắt buộc");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Nội dung bài viết không được để trống");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        slug,
        category,
        content,
        thumbnailUrl: thumbnailUrl.trim() || null,
        publishedAt: isPublished
          ? initialData?.publishedAt || new Date().toISOString()
          : null,
      };

      if (isEdit && initialData?.id) {
        const res = await fetch(`/api/news/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể cập nhật bài viết");
        }
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tạo bài viết");
        }
      }

      toast.add({
        title: isEdit ? "Cập nhật thành công" : "Tạo bài viết thành công",
        description: isEdit ? "Đã lưu thay đổi cho bài viết." : "Đã xuất bản bài viết mới.",
        type: "success",
      });

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi lưu bài viết");
      toast.add({
        title: "Lỗi lưu bài viết",
        description: err.message || "Đã xảy ra lỗi khi lưu bài viết",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NewsEditorHeader isEdit={isEdit} id={initialData?.id} loading={loading} />

      {error && (
        <div className="p-3.5 bg-destructive/10 text-destructive text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Grid: Main Editor & Sidebar Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <NewsMainContentForm
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            content={content}
            setContent={setContent}
            loading={loading}
          />
        </div>

        <NewsSidebarSettings
          category={category}
          setCategory={setCategory}
          isPublished={isPublished}
          setIsPublished={setIsPublished}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          loading={loading}
          categoriesList={categoriesList}
        />
      </div>
    </form>
  );
}
