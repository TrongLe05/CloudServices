"use client";

import * as React from "react";
import { Search, Calendar, Newspaper, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalArticles: number;
}

export function BlogHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalArticles,
}: BlogHeaderProps) {
  const currentDateFormatted = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white border-b border-slate-200 pt-8 pb-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-6">
        {/* Top meta bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-3 font-sans">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              {currentDateFormatted}
            </span>
            <span>•</span>
            <span>Cập nhật liên tục 24/7</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs font-mono">
              <Newspaper className="size-3 text-primary" />
              <span>{totalArticles} bài viết</span>
            </Badge>
          </div>
        </div>

        {/* Title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
          <section className="space-y-1.5 max-w-2xl">
            <Badge className="bg-primary text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 tracking-wider">
              Tạp chí Công nghệ &amp; Hạ tầng
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading uppercase">
              TIN TỨC &amp; BLOG CÔNG NGHỆ
            </h1>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Cổng thông tin chuyên sâu về Điện toán Đám mây, Hạ tầng Máy chủ, DevOps, Bảo mật và Giải pháp số hóa.
            </p>
          </section>

          {/* Search Box */}
          <section className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết, tài liệu..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-slate-50/80 border-slate-200 text-xs rounded-xl focus-visible:ring-primary/20 h-10 w-full"
            />
          </section>
        </div>

        {/* Category Navigation Pills */}
        <nav aria-label="Chuyên mục tin tức" className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          <Button
            type="button"
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange("all")}
            className={`rounded-xl text-xs font-bold shrink-0 h-9 px-4 ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Tất cả tin tức
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={selectedCategory === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(cat)}
              className={`rounded-xl text-xs font-bold shrink-0 h-9 px-4 ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat}
            </Button>
          ))}

          {(selectedCategory !== "all" || searchQuery) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onCategoryChange("all");
                onSearchChange("");
              }}
              className="rounded-xl text-xs gap-1.5 text-slate-500 hover:text-slate-900 shrink-0 h-9 px-3 ml-auto border-dashed"
            >
              <RotateCcw className="size-3" />
              <span>Xóa lọc</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
