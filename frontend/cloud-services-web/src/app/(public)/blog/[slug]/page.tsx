export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { decodeHtmlEntities, formatHtmlContent } from "@/lib/htmlUtils";

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
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/blog" />}>Tin tức &amp; Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-xs text-slate-900 font-medium">
                  {decodeHtmlEntities(article.title)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 pt-8 space-y-8">
        {/* Back Link */}
        <nav aria-label="Quay lại">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100/80 -ml-2.5 w-fit"
          >
            <ArrowLeft className="size-3.5" /> Quay lại danh sách bài viết
          </Link>
        </nav>

        {/* Main Article Container - Title & Content inside together */}
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Article Header (inside article container) */}
          <header className="p-8 md:p-12 pb-6 md:pb-8 border-b border-slate-100 space-y-6">
            {/* Category & Date badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 text-xs font-bold px-3 py-1">
                {article.category || "Tin tức"}
              </Badge>
              <span className="text-xs text-slate-300">•</span>
              <time
                dateTime={article.publishedAt || article.createdAt}
                className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"
              >
                <Calendar className="size-3.5 text-slate-400" />
                {formatDate(article.publishedAt || article.createdAt)}
              </time>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight font-heading">
              {decodeHtmlEntities(article.title)}
            </h1>

            {/* Author info & Actions bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-mono text-xs shadow-xs">
                  CS
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Ban Biên tập Kỹ thuật</p>
                  <p className="text-[11px] text-slate-400">CloudServices Media &amp; Engineering</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 h-8.5"
                >
                  <Share2 className="size-3.5" /> Chia sẻ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 h-8.5"
                >
                  <Bookmark className="size-3.5" /> Lưu bài
                </Button>
              </div>
            </div>
          </header>

          {/* Article Body Content */}
          <div className="p-8 md:p-12 pt-8 md:pt-10">
            <div
              className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm md:text-base prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: formatHtmlContent(article.content) }}
            />
          </div>
        </article>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section className="space-y-6 pt-6">
            <header className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-heading">
                Bài viết liên quan
              </h3>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/blog" />}
                className="text-xs text-primary hover:text-primary hover:bg-primary/10 font-semibold"
              >
                Xem tất cả <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug || item.id}`}
                  className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-primary/20 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {item.thumbnailUrl && (
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <Badge variant="secondary" className="text-[10px] font-semibold text-primary bg-primary/10">
                      {item.category || "Tin tức"}
                    </Badge>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug font-sans">
                      {decodeHtmlEntities(item.title)}
                    </h4>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 font-medium flex items-center justify-between border-t border-slate-50">
                    <span>Đọc tiếp</span>
                    <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
