"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | "DOTS_LEFT" | "DOTS_RIGHT")[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "DOTS_RIGHT", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [1, "DOTS_LEFT", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, "DOTS_LEFT", ...middleRange, "DOTS_RIGHT", totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
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
  const paginationRange = getPaginationRange(currentPage, totalPages, 1);

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
        <PaginationContent className="flex-wrap justify-center">
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

          {paginationRange.map((item, index) => {
            if (item === "DOTS_LEFT" || item === "DOTS_RIGHT") {
              return (
                <PaginationItem key={`${item}-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const page = item as number;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`cursor-pointer rounded-xl font-medium transition-colors ${
                    page === currentPage
                      ? "bg-slate-900 text-white hover:bg-slate-800 font-bold"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

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
