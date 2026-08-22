"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav
      aria-label="Phân trang tin tức"
      className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-4 w-full"
    >
      <span className="text-xs text-slate-500 font-sans">
        Hiển thị <span className="font-semibold text-slate-900">{startItem}</span> -{" "}
        <span className="font-semibold text-slate-900">{endItem}</span> trong tổng số{" "}
        <span className="font-semibold text-slate-900">{totalItems}</span> bài viết
      </span>

      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-40 rounded-xl"
                  : "cursor-pointer rounded-xl hover:bg-slate-100"
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`cursor-pointer rounded-xl font-medium ${
                  page === currentPage
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "hover:bg-slate-100"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-40 rounded-xl"
                  : "cursor-pointer rounded-xl hover:bg-slate-100"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </nav>
  );
}
