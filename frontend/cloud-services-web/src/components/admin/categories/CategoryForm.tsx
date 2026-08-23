"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ServiceCategory } from "../service-plans/ServicePlansCRUD";

interface CategoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: ServiceCategory | null;
  onSubmit: (payload: {
    name: string;
    slug: string;
    description: string;
  }) => Promise<void>;
  loading: boolean;
}

export function CategoryForm({
  isOpen,
  onOpenChange,
  editingCategory,
  onSubmit,
  loading,
}: CategoryFormProps) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState("");

  // Sync state on open/edit
  React.useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setName(editingCategory.name);
        setSlug(editingCategory.slug);
        setDescription((editingCategory as any).description || "");
      } else {
        setName("");
        setSlug("");
        setDescription("");
      }
      setError("");
    }
  }, [isOpen, editingCategory]);

  // Auto-generate slug from name
  React.useEffect(() => {
    if (!editingCategory && name) {
      const generatedSlug = name
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
  }, [name, editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên danh mục là bắt buộc");
      return;
    }
    if (!slug.trim()) {
      setError("Đường dẫn (slug) là bắt buộc");
      return;
    }

    try {
      await onSubmit({
        name,
        slug,
        description,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-6">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle>
            {editingCategory ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
          </SheetTitle>
          <SheetDescription>
            Nhập thông tin danh mục phân loại dịch vụ của bạn
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Tên danh mục</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: VPS Đám Mây"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-slug">Đường dẫn (Slug)</Label>
            <Input
              id="cat-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="VD: vps-dam-may"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Mô tả danh mục</Label>
            <Input
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về phân loại..."
              disabled={loading}
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="gap-1.5">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {editingCategory ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
