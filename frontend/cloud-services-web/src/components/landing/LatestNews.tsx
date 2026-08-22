"use client";

import * as React from "react";
import Link from "next/link";
import { Newspaper, ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { decodeHtmlEntities, stripHtml } from "@/lib/htmlUtils";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
}

interface LatestNewsProps {
  initialNews?: BlogPostItem[];
}

export const LatestNews = ({ initialNews = [] }: LatestNewsProps) => {
  // If no news from API, fallback to default news
  const displayNews = initialNews.length > 0
    ? initialNews.slice(0, 3)
    : [
        {
          id: "1",
          title: "Tối Ưu Hiệu Năng Cơ Sở Dữ Liệu Trên Môi Trường Cloud VPS",
          slug: "toi-uu-hieu-nang-co-so-du-lieu-tren-cloud-vps",
          category: "Kiến trúc hệ thống",
          content: "Khám phá các kỹ thuật tinh chỉnh bộ nhớ đệm, cấu hình storage NVMe và tối ưu hóa truy vấn chuyên sâu...",
          thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
          publishedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Giải Pháp Chống Tấn Công DDoS Tự Động Cho Hệ Thống Doanh Nghiệp",
          slug: "giai-phap-chong-tan-cong-ddos-tu-dong",
          category: "Bảo mật",
          content: "Tìm hiểu kiến trúc bảo vệ đa tầng giúp lọc lưu lượng độc hại ở tầng mạng và ứng dụng một cách tức thì...",
          thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
          publishedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Chiến Lược Sao Lưu Dữ Liệu Tự Động & Phục Hồi Thảm Họa (DR)",
          slug: "chien-luoc-sao-luu-du-lieu-va-phuc-hoi-tham-hoa",
          category: "Cẩm nang",
          content: "Phương pháp thiết lập sao lưu định kỳ đa vùng (Multi-Region) đảm bảo RPO và RTO tối ưu cho doanh nghiệp...",
          thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
          publishedAt: new Date().toISOString(),
        },
      ];

  return (
    <section className="w-full py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Chia sẻ tri thức công nghệ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading">
              TIN TỨC & CẨM NANG HẠ TẦNG
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Cập nhật các thông tin hạ tầng mới nhất, tài liệu hướng dẫn và kinh nghiệm vận hành hệ thống thực tế từ đội ngũ chuyên gia.
            </p>
          </div>

          <Button
            variant="outline"
            className="font-semibold text-xs py-5 shrink-0 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
            render={<Link href="/blog" />}
          >
            Xem tất cả bài viết
            <ArrowRight className="ml-2 size-3.5" />
          </Button>
        </div>

        {/* Grid of articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((post, index) => {
            const dateStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
              : "Hôm nay";

            return (
              <article
                key={post.id || index}
                className="flex flex-col items-start justify-between bg-white border border-slate-100 hover:border-slate-200/80 p-5 rounded-2xl hover:shadow-xl hover:shadow-slate-100/60 transition-all duration-300 text-left shadow-xs group"
              >
                {/* Blog Post Thumbnail Image */}
                <div className="w-full relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-50 border border-slate-100">
                  <Image
                    src={
                      post.thumbnailUrl ||
                      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={500}
                    height={300}
                  />
                </div>

                <div className="w-full flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-sans">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                        {post.category || "Tin tức"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-slate-400" />
                        {dateStr}
                      </span>
                    </div>

                    <h3 className="mt-3.5 text-sm font-bold text-slate-900 leading-snug hover:text-primary transition-colors font-sans">
                      <Link href={`/blog/${post.slug || post.id}`} className="line-clamp-2">
                        {decodeHtmlEntities(post.title)}
                      </Link>
                    </h3>

                    <p className="mt-3 text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                      {stripHtml(post.content)}
                    </p>
                  </div>

                  <div className="w-full pt-4 mt-6 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <User className="size-3 text-slate-400" /> Ban Biên Tập
                    </span>
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 text-xs"
                    >
                      Đọc tiếp <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
