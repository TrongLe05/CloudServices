export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { NewsEditorForm } from "@/components/admin/NewsEditorForm";
import { NewsItem } from "@/components/admin/NewsCRUD";
import { notFound } from "next/navigation";

async function getNewsById(id: string): Promise<NewsItem | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/news/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return null;
  }
}

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsItem = await getNewsById(id);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <NewsEditorForm initialData={newsItem} isEdit={true} />
    </div>
  );
}
