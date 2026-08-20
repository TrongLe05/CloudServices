"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NewsFilterBar } from "./news/NewsFilterBar";
import { NewsTable } from "./news/NewsTable";
import { AdminPagination } from "./AdminPagination";
import { toast } from "@/components/ui/toast";

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
}

interface NewsCRUDProps {
  initialNews: NewsItem[];
}

export function NewsCRUD({ initialNews }: NewsCRUDProps) {
  const [news, setNews] = React.useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = React.useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const categoriesList = React.useMemo(() => {
    const set = new Set<string>(["Tin tức", "Công nghệ", "Khuyến mãi", "Hướng dẫn", "Thông báo"]);
    news.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [news]);

  const filteredNews = React.useMemo(() => {
    return news.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [news, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const paginatedNews = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(start, start + itemsPerPage);
  }, [filteredNews, currentPage]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể xóa bài viết");
      }

      setNews((prev) => prev.filter((n) => n.id !== id));
      toast.add({
        title: "Xóa thành công",
        description: "Đã xóa bài viết thành công.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi xóa bài viết",
        description: err.message || "Không thể xóa bài viết",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Newspaper className="size-5 text-primary" /> Quản Lý Tin Tức & Blog
          </CardTitle>
          <CardDescription>
            Soạn thảo, xuất bản và cập nhật các bài viết tin tức hoặc hướng dẫn kỹ thuật
          </CardDescription>
        </div>
        <Link href="/admin/news/create">
          <Button size="sm" className="gap-1.5 self-start md:self-auto">
            <Plus className="size-4" /> Viết bài mới
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <NewsFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoriesList={categoriesList}
        />

        <NewsTable news={paginatedNews} onDelete={handleDelete} loading={loading} />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredNews.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemName="bài viết"
        />
      </CardContent>
    </Card>
  );
}
