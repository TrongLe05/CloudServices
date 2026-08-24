export const revalidate = 60;

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { BlogPageView, BlogPostItem } from "@/components/blog/BlogPageView";
import { Skeleton } from "@/components/ui/skeleton";
import { CACHE_TAGS } from "@/constants/cache-tags";

async function getBlogArticles(): Promise<BlogPostItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/news?pageSize=100`, {
      next: { revalidate: 60, tags: [CACHE_TAGS.NEWS] },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách tin tức & blog:", error);
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getBlogArticles();

  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageView initialNews={articles} />
    </Suspense>
  );
}

function BlogPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-6 max-w-7xl mx-auto space-y-8">
      <header className="space-y-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-10 w-96 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
        ))}
      </section>
    </main>
  );
}
