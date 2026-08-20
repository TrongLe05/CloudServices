export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { NewsCRUD, NewsItem } from "@/components/admin/NewsCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";

export async function getNews(): Promise<NewsItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/news?pageSize=100`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.error("Error fetching news, using fallback:", error);
    return [
      {
        id: "news-1",
        title: "CloudServices ra mắt gói dịch vụ Cloud VPS thế hệ mới",
        slug: "cloudservices-ra-mat-cloud-vps-the-he-moi",
        category: "Tin tức",
        content:
          "### Giới thiệu dịch vụ Cloud VPS thế hệ mới\n\nChúng tôi hân hạnh giới thiệu giải pháp máy chủ ảo sử dụng 100% ổ cứng **NVMe Enterprise** tốc độ cao, CPU thế hệ mới giúp tăng hiệu suất ứng dụng lên đến 300%.\n\n- Tốc độ đọc ghi cực nhanh\n- Uptime cam kết 99.9%\n- Hỗ trợ kỹ thuật 24/7",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export default async function AdminNewsPage() {
  const newsPromise = getNews();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Quản Lý Tin Tức & Blog
        </h1>
        <p className="text-sm text-muted-foreground">
          Đăng tải và quản lý các bài viết tin tức, thông báo nâng cấp và cẩm
          nang kỹ thuật cho người dùng.
        </p>
      </div>

      <Suspense
        fallback={<PanelSkeleton title="Đang tải danh sách bài viết..." />}
      >
        <NewsSectionWrapper newsPromise={newsPromise} />
      </Suspense>
    </div>
  );
}

async function NewsSectionWrapper({
  newsPromise,
}: {
  newsPromise: Promise<NewsItem[]>;
}) {
  const news = await newsPromise;
  return <NewsCRUD initialNews={news} />;
}
