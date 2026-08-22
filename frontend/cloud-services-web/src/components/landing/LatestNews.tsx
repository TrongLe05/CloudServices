"use client";

import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/constants/landing";
import Image from "next/image";

import { decodeHtmlEntities, stripHtml } from "@/lib/htmlUtils";

export const LatestNews = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Chia sẻ tri thức công nghệ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              TIN TỨC & CẨM NANG HẠ TẦNG
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Cập nhật các thông tin hạ tầng mới nhất, tài liệu hướng dẫn và
              kinh nghiệm vận hành hệ thống thực tế từ đội ngũ chuyên gia.
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

        {/* Grid of articles with rounded corners and images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="flex flex-col items-start justify-between bg-white border border-slate-100 hover:border-slate-200/80 p-5 rounded-2xl hover:shadow-xl hover:shadow-slate-100/60 transition-all duration-300 text-left shadow-xs group"
            >
              {/* Blog Post Thumbnail Image */}
              <div className="w-full relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-50 border border-slate-100">
                <Image
                  src={post.image}
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
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="mt-3.5 text-sm font-bold text-slate-900 leading-snug hover:text-primary transition-colors font-sans">
                    <Link href={`/blog/${index}`} className="line-clamp-2">
                      {decodeHtmlEntities(post.title)}
                    </Link>
                  </h3>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                    {stripHtml(post.desc)}
                  </p>
                </div>

                <div className="w-full pt-4 mt-6 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span className="font-semibold text-slate-700">
                    {post.author}
                  </span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
