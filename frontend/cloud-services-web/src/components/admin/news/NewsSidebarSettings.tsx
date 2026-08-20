"use client";

import * as React from "react";
import { UploadCloud, Image as ImageIcon, Trash2, Link as LinkIcon, HardDrive } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface NewsSidebarSettingsProps {
  category: string;
  setCategory: (val: string) => void;
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (val: string) => void;
  loading: boolean;
  categoriesList: string[];
}

export function NewsSidebarSettings({
  category,
  setCategory,
  isPublished,
  setIsPublished,
  thumbnailUrl,
  setThumbnailUrl,
  loading,
  categoriesList,
}: NewsSidebarSettingsProps) {
  const [uploadMode, setUploadMode] = React.useState<"file" | "url">("file");
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Tệp không hợp lệ",
        description: "Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP, GIF).",
        type: "error",
      });
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: "Dung lượng quá lớn",
        description: "Kích thước hình ảnh tối đa cho phép là 5MB.",
        type: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setThumbnailUrl(result);
        toast.add({
          title: "Tải ảnh thành công",
          description: `Đã chọn ảnh: ${file.name}`,
          type: "success",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeImage = () => {
    setThumbnailUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Publishing Settings */}
      <Card className="shadow-xs border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Cài Đặt Xuất Bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="news-category">Chuyên mục bài viết</Label>
            <select
              id="news-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              disabled={loading}
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
            <div>
              <span className="text-sm font-medium text-foreground block">Công khai</span>
              <span className="text-xs text-muted-foreground block">
                {isPublished ? "Hiển thị cho người dùng" : "Lưu ở dạng bản nháp"}
              </span>
            </div>
            <input
              type="checkbox"
              id="news-publish-toggle"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="size-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
              disabled={loading}
            >
            </input>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Settings */}
      <Card className="shadow-xs border border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Ảnh Đại Diện</CardTitle>
            <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
              <Button
                type="button"
                variant={uploadMode === "file" ? "secondary" : "ghost"}
                size="sm"
                className="h-6 text-[11px] px-2 gap-1"
                onClick={() => setUploadMode("file")}
              >
                <HardDrive className="size-3" /> Từ thiết bị
              </Button>
              <Button
                type="button"
                variant={uploadMode === "url" ? "secondary" : "ghost"}
                size="sm"
                className="h-6 text-[11px] px-2 gap-1"
                onClick={() => setUploadMode("url")}
              >
                <LinkIcon className="size-3" /> Nhập URL
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            {uploadMode === "file"
              ? "Tải ảnh từ máy tính hoặc kéo thả tệp vào khung"
              : "Nhập liên kết trực tiếp của hình ảnh bài viết"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {uploadMode === "file" ? (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                className="hidden"
                onChange={onFileInputChange}
                disabled={loading}
              />

              {!thumbnailUrl ? (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      Nhấn để chọn ảnh hoặc kéo thả vào đây
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Hỗ trợ PNG, JPG, WEBP, GIF (Tối đa 5MB)
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="news-thumbnail">URL hình ảnh</Label>
              <Input
                id="news-thumbnail"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                disabled={loading}
              />
            </div>
          )}

          {/* Thumbnail Preview with Controls */}
          <div className="relative w-full aspect-video rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center group">
            {thumbnailUrl ? (
              <>
                <img
                  src={thumbnailUrl}
                  alt="Preview Thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs gap-1.5 shadow-md"
                    onClick={() => {
                      if (uploadMode === "file") {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <UploadCloud className="size-3.5" /> Đổi ảnh khác
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs gap-1.5 shadow-md"
                    onClick={removeImage}
                  >
                    <Trash2 className="size-3.5" /> Xóa ảnh
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground p-4">
                <ImageIcon className="size-8 opacity-40" />
                <span className="text-xs">Chưa có ảnh đại diện</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
