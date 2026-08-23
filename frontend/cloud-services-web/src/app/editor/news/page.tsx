export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { NewsCRUD, NewsItem } from "@/components/admin/NewsCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";

export async function getNews(): Promise<NewsItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const res = await fetch(`${apiUrl}/api/news?pageSize=100`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function EditorNewsPage() {
  const newsList = await getNews();

  return (
    <div className="space-y-6">
      <Suspense fallback={<PanelSkeleton title="Đang tải danh sách tin tức & blog..." />}>
        <NewsCRUD initialNews={newsList} />
      </Suspense>
    </div>
  );
}
