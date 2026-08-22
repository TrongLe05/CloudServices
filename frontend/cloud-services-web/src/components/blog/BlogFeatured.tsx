"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Calendar,
  Clock,
  ArrowRight,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { decodeHtmlEntities, stripHtml } from "@/lib/htmlUtils";
import { BlogPostItem } from "./types";

interface BlogFeaturedProps {
  leadArticle: BlogPostItem;
  sideArticles: BlogPostItem[];
}

export function BlogFeatured({ leadArticle, sideArticles }: BlogFeaturedProps) {
  if (!leadArticle) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Mới cập nhật";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const text = stripHtml(content);
    const words = text ? text.split(/\s+/).length : 200;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  };

  const leadUrl = `/blog/${leadArticle.slug || leadArticle.id}`;

  return (
    <section aria-labelledby="featured-news-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
      {/* 1. Main Spotlight Article (Cột Tin Tiêu Điểm Chính - 8 Cột) */}
      <article className="lg:col-span-8 group flex flex-col justify-between space-y-4">
        <header className="space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <Image
              src={
                leadArticle.thumbnailUrl ||
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200"
              }
              alt={leadArticle.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary hover:bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                <Flame className="size-3 mr-1 text-amber-400" /> TIÊU ĐIỂM HÔM NAY
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/60 backdrop-blur-md text-white text-[10px] border-white/20"
              >
                {leadArticle.category || "Công nghệ"}
              </Badge>
            </div>

            {/* Time & Read time on image */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <div className="flex items-center gap-3 text-xs text-slate-300 font-sans">
                <time
                  dateTime={leadArticle.publishedAt || leadArticle.createdAt}
                  className="flex items-center gap-1"
                >
                  <Calendar className="size-3.5 text-slate-300" />
                  {formatDate(leadArticle.publishedAt || leadArticle.createdAt)}
                </time>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-slate-300" />
                  {calculateReadTime(leadArticle.content)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <h2
              id="featured-news-heading"
              className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-tight font-heading"
            >
              <Link href={leadUrl}>
                {decodeHtmlEntities(leadArticle.title)}
              </Link>
            </h2>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3 font-sans">
              {stripHtml(leadArticle.content).slice(0, 260)}...
            </p>
          </div>
        </header>

        <footer className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Ban Biên tập Kỹ thuật <span className="text-slate-300 mx-1">•</span> CloudServices
          </span>
          <Link
            href={leadUrl}
            className="text-primary hover:underline text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>Đọc bài viết này</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </footer>
      </article>

      {/* 2. Side Notable Stories (3 Tin Đáng Chú Ý - 4 Cột) */}
      <aside className="lg:col-span-4 flex flex-col justify-between space-y-4">
        <header className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
            <Newspaper className="size-4 text-primary" /> Tin đáng chú ý
          </h3>
          <span className="text-[11px] text-slate-400 font-sans">Mới cập nhật</span>
        </header>

        {/* List of side notable articles */}
        <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
          {sideArticles.map((article) => {
            const articleUrl = `/blog/${article.slug || article.id}`;
            return (
              <article
                key={article.id}
                className="py-3.5 first:pt-0 last:pb-0 group space-y-1.5"
              >
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans">
                  <span className="font-bold text-primary">
                    {article.category || "Tin tức"}
                  </span>
                  <span>•</span>
                  <time dateTime={article.publishedAt || article.createdAt}>
                    {formatDate(article.publishedAt || article.createdAt)}
                  </time>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link href={articleUrl}>
                        {decodeHtmlEntities(article.title)}
                      </Link>
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 font-sans">
                      {stripHtml(article.content).slice(0, 95)}...
                    </p>
                  </div>

                  {article.thumbnailUrl && (
                    <div className="relative size-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <Image
                        src={article.thumbnailUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Newsletter box */}
        <footer className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-2 shadow-sm mt-2">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="size-3" /> Bản tin công nghệ
          </span>
          <h4 className="text-xs font-bold leading-snug">
            Cập nhật tin tức hạ tầng &amp; hướng dẫn kỹ thuật mới nhất
          </h4>
        </footer>
      </aside>
    </section>
  );
}
