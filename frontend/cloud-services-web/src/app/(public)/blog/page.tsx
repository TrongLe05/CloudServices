export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { BlogPageView, BlogPostItem } from "@/components/blog/BlogPageView";
import { Skeleton } from "@/components/ui/skeleton";

async function BlogContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
  try {
    const res = await fetch(`${apiUrl}/api/news?pageSize=100`, { cache: "no-store" });
    if (!res.ok) return <BlogPageView initialNews={[]} />;
    const data = await res.json();
    const articles: BlogPostItem[] = data.items || data.Items || [];
    return <BlogPageView initialNews={articles} />;
  } catch (error) {
    console.error("Lỗi khi tải danh sách tin tức & blog:", error);
    return <BlogPageView initialNews={[]} />;
  }
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogContent />
    </Suspense>
  );
}

function BlogPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 space-y-12">
      {/* 1. Header Banner Skeleton */}
      <header className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-48 rounded-full bg-slate-800" />
          <Skeleton className="h-12 w-80 md:w-[480px] rounded-xl bg-slate-800" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md bg-slate-800" />

          {/* Search bar & Category filters */}
          <div className="pt-6 w-full max-w-xl space-y-4">
            <Skeleton className="h-11 w-full rounded-2xl bg-slate-800" />
            <div className="flex justify-center gap-2 overflow-hidden pt-2">
              <Skeleton className="h-8 w-24 rounded-full bg-slate-800" />
              <Skeleton className="h-8 w-28 rounded-full bg-slate-800" />
              <Skeleton className="h-8 w-24 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Grid Articles Skeleton */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-xs" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
