"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { decodeHtmlEntities, stripHtml } from "@/lib/htmlUtils";
import { BlogPostItem } from "./types";

interface BlogCardProps {
  post: BlogPostItem;
}

export function BlogCard({ post }: BlogCardProps) {
  const dateStr = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Hôm nay";

  const readTime = (() => {
    const text = stripHtml(post.content);
    const words = text ? text.split(/\s+/).length : 200;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  })();

  const postUrl = `/blog/${post.slug || post.id}`;

  return (
    <Card className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 group overflow-hidden h-full">
      <header className="flex flex-col">
        {/* Card Thumbnail */}
        {post.thumbnailUrl ? (
          <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3">
              <Badge className="bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200/80 text-[10px] font-bold shadow-xs hover:bg-white">
                {post.category || "Tin tức"}
              </Badge>
            </span>
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {post.category || "CloudServices Blog"}
            </span>
          </div>
        )}

        <CardHeader className="p-5 pb-2 space-y-2.5">
          {/* Metadata Bar */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans">
            <time
              dateTime={post.publishedAt || post.createdAt}
              className="flex items-center gap-1 text-slate-500 font-medium"
            >
              <Calendar className="size-3 text-slate-400" />
              {dateStr}
            </time>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-slate-400" />
              {readTime}
            </span>
          </div>

          {/* Title */}
          <CardTitle className="text-sm md:text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug font-heading">
            <Link href={postUrl}>
              {decodeHtmlEntities(post.title)}
            </Link>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <CardDescription className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
            {stripHtml(post.content).slice(0, 150)}...
          </CardDescription>
        </CardContent>
      </header>

      {/* Footer */}
      <CardFooter className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
          <User className="size-3 text-slate-400" /> Ban Biên Tập
        </span>

        <Link
          href={postUrl}
          className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Đọc tiếp</span>
          <ArrowRight className="size-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
