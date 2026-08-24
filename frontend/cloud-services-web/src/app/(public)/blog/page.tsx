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
