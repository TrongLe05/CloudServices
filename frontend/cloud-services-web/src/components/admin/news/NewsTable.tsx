"use client";

import Link from "next/link";
import { Edit2, Newspaper, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog";
import { NewsItem } from "../NewsCRUD";

interface NewsTableProps {
  news: NewsItem[];
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function NewsTable({ news, onDelete, loading }: NewsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-medium">
            <th className="py-3 px-4">Bài Viết</th>
            <th className="py-3 px-4">Chuyên Mục</th>
            <th className="py-3 px-4">Trạng Thái</th>
            <th className="py-3 px-4">Ngày Đăng</th>
            <th className="py-3 px-4 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {news.map((item) => {
            const isPublished = !!item.publishedAt;
            return (
              <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="size-12 rounded-lg object-cover border border-border shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        <Newspaper className="size-5 opacity-40" />
                      </div>
                    )}
                    <div className="space-y-0.5 max-w-sm">
                      <h4 className="font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        /{item.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {item.category || "Tin tức"}
                  </span>
                </td>

                <td className="py-3 px-4">
                  {isPublished ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                      <Globe className="size-3" /> Công khai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      Bản nháp
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-xs text-muted-foreground">
                  {item.publishedAt ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="py-3 px-4 text-right space-x-1.5">
                  <Link href={`/admin/news/${item.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={loading}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                  </Link>

                  <ConfirmDeleteDialog
                    title="Xác nhận xóa bài viết"
                    description={`Bạn có chắc chắn muốn xóa bài viết "${item.title}"? Hành động này không thể hoàn tác.`}
                    onConfirm={() => onDelete(item.id)}
                    disabled={loading}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
