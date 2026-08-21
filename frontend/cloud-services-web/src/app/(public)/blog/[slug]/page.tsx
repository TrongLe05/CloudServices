export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  ChevronRight,
  Eye,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getArticleDetail(slugOrId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/news?pageSize=100`, { cache: "no-store" });
    if (!res.ok) return null;

    const data = await res.json();
    const items: any[] = data.items || data.Items || [];

    const currentArticle = items.find((a) => a.slug === slugOrId || a.id === slugOrId);
    const related = items.filter((a) => a.id !== currentArticle?.id).slice(0, 3);

    return {
      article: currentArticle || null,
      related,
    };
  } catch (error) {
    console.error("Lỗi khi tải chi tiết bài viết:", error);
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data = await getArticleDetail(slug);
  if (!data || !data.article) {
    notFound();
  }

  const { article, related } = data;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Mới cập nhật";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/blog" />}>Tin tức & Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-xs">{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 pt-10 space-y-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Quay lại danh sách tin tức
        </Link>

        {/* Article Masthead */}
        <header className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-white text-xs font-bold px-3 py-1">
              {article.category || "Công nghệ"}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-sans">
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight font-heading">
            {article.title}
          </h1>

          {/* Author info & Actions bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                CS
              </div>
              <div>
                <p className="font-bold text-slate-900">Ban Biên tập Kỹ thuật</p>
                <p className="text-[11px] text-slate-400">CloudServices Media & Engineering</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-slate-200">
                <Share2 className="size-3.5" /> Chia sẻ
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-slate-200">
                <Bookmark className="size-3.5" /> Lưu bài
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.thumbnailUrl && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <Image
              src={article.thumbnailUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body Content (Typography phong cách báo chí chuẩn HTML) */}
        <article
          className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-xs text-slate-800 leading-relaxed text-sm md:text-base prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Bài viết liên quan
              </h3>
              <Button variant="ghost" size="sm" render={<Link href="/blog" />} className="text-xs">
                Xem tất cả <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug || item.id}`}
                  className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  {item.thumbnailUrl && (
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <Badge variant="secondary" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
