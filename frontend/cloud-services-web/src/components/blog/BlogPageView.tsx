"use client";

import * as React from "react";
import { decodeHtmlEntities, stripHtml } from "@/lib/htmlUtils";
import { BlogPostItem } from "./types";
import { BlogHeader } from "./BlogHeader";
import { BlogFeatured } from "./BlogFeatured";
import { BlogGrid } from "./BlogGrid";
import { BlogPagination } from "./BlogPagination";

export type { BlogPostItem };

interface BlogPageViewProps {
  initialNews?: BlogPostItem[];
}

export function BlogPageView({ initialNews = [] }: BlogPageViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const postsPerPage = 10;

  // Extract unique categories from actual news list
  const categoriesList = React.useMemo(() => {
    const set = new Set<string>();
    initialNews.forEach((a) => {
      if (a.category) set.add(a.category.trim());
    });
    return Array.from(set).sort();
  }, [initialNews]);

  // Filter articles by category and search keyword
  const filteredArticles = React.useMemo(() => {
    return initialNews.filter((article) => {
      const matchCat =
        selectedCategory === "all" ||
        article.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();

      const cleanTitle = decodeHtmlEntities(article.title || "").toLowerCase();
      const cleanContent = stripHtml(article.content || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchQuery =
        !q || cleanTitle.includes(q) || cleanContent.includes(q);

      return matchCat && matchQuery;
    });
  }, [initialNews, selectedCategory, searchQuery]);

  // Notable & Spotlight stories (on first page when no search is active)
  const isDefaultView = selectedCategory === "all" && !searchQuery.trim() && currentPage === 1;
  const leadArticle = filteredArticles[0];
  const sideArticles = filteredArticles.slice(1, 4);

  // Pagination for all news grid (10 items per page)
  const totalPages = Math.ceil(filteredArticles.length / postsPerPage) || 1;
  const paginatedArticles = React.useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredArticles.slice(start, start + postsPerPage);
  }, [filteredArticles, currentPage, postsPerPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Blog Newspaper Header */}
      <BlogHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categoriesList}
        totalArticles={initialNews.length}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-12">
        {/* Tiêu điểm & Tin đáng chú ý */}
        {isDefaultView && leadArticle && (
          <BlogFeatured
            leadArticle={leadArticle}
            sideArticles={sideArticles}
          />
        )}

        {/* Tất cả tin tức (Dạng lưới 10 tin / trang) */}
        <BlogGrid
          articles={paginatedArticles}
          selectedCategory={selectedCategory}
          totalFiltered={filteredArticles.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onResetFilters={handleResetFilters}
        />

        {/* Phân trang 10 tin / trang */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredArticles.length}
          itemsPerPage={postsPerPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
