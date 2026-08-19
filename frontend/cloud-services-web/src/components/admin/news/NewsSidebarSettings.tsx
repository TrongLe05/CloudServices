"use client";

import { Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
              className="size-4 rounded border-input text-primary focus:ring-primary"
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Settings */}
      <Card className="shadow-xs border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Ảnh Đại Diện (Thumbnail)</CardTitle>
          <CardDescription className="text-xs">
            Đường dẫn liên kết hình ảnh bài viết
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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

          <div className="w-full aspect-video rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="Preview Thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
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
