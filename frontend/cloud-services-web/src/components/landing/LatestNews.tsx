"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { decodeHtmlEntities, stripHtml } from "@/lib/htmlUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const displayNews = initialNews;

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (displayNews.length === 0) return null;

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
              TIN TỨC &amp; CẨM NANG HẠ TẦNG
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

        {/* Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: displayNews.length > 3,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {displayNews.map((post, index) => {
                const dateStr = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                  : "Hôm nay";

                return (
                  <CarouselItem key={post.id || index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                    <article className="flex flex-col items-start justify-between bg-white border border-slate-100 hover:border-slate-200/80 p-5 rounded-2xl hover:shadow-xl hover:shadow-slate-100/60 transition-all duration-300 text-left shadow-xs group h-full">
                      {/* Thumbnail */}
                      <div className="w-full relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-50 border border-slate-100 shrink-0">
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
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Prev / Next buttons */}
            <CarouselPrevious className="hidden md:flex -left-5 size-10 border-slate-200 bg-white hover:bg-slate-50 shadow-md" />
            <CarouselNext className="hidden md:flex -right-5 size-10 border-slate-200 bg-white hover:bg-slate-50 shadow-md" />
          </Carousel>

          {/* Dots indicator */}
          {count > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-slate-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
