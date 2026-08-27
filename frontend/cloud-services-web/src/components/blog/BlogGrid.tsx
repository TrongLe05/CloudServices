"use client";

import * as React from "react";
import { BookOpen, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "./BlogCard";
import { BlogPostItem } from "./types";

interface BlogGridProps {
  articles: BlogPostItem[];
  selectedCategory: string;
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  onResetFilters: () => void;
}

export function BlogGrid({
  articles,
  selectedCategory,
  totalFiltered,
  currentPage,
  totalPages,
  onResetFilters,
}: BlogGridProps) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            {selectedCategory === "all"
              ? "Tất cả tin tức & bài viết"
              : `Chuyên mục: ${selectedCategory}`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hiển thị {totalFiltered} bài viết công nghệ và tài liệu kỹ thuật
          </p>
        </div>

        {totalPages > 0 && (
          <Badge variant="outline" className="text-xs px-3 py-1 border-slate-300 font-medium self-start sm:self-auto">
            Trang {currentPage} / {totalPages}
          </Badge>
        )}
      </header>

      {/* Grid Content */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <article className="py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div className="size-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Không có bài viết nào phù hợp với từ khóa hoặc chuyên mục bạn đã chọn.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="rounded-xl text-xs"
          >
            Xem tất cả tin tức
          </Button>
        </article>
      )}
    </section>
  );
}
