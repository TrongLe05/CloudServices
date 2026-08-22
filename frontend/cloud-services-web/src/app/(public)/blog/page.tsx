export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { BlogPageView, BlogPostItem } from "@/components/blog/BlogPageView";
import { Skeleton } from "@/components/ui/skeleton";

async function getBlogArticles(): Promise<BlogPostItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/news?pageSize=100`, {
      cache: "no-store",
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
    <div className="min-h-screen bg-slate-50/50 py-12 px-6 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-10 w-96" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-8 h-[450px] rounded-3xl" />
        <Skeleton className="lg:col-span-4 h-[450px] rounded-3xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
