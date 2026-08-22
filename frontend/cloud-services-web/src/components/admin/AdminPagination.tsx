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

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
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

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "mục",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const paginationRange = getPaginationRange(currentPage, totalPages, 1);

  return (
    <nav
      aria-label={`Phân trang ${itemName}`}
      className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 gap-4 w-full"
    >
      <span className="text-xs text-muted-foreground">
        Hiển thị <span className="font-semibold text-foreground">{startItem}</span> -{" "}
        <span className="font-semibold text-foreground">{endItem}</span> trong tổng số{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> {itemName}
      </span>

      <Pagination className="w-auto mx-0">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-muted"
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
                  }}
                  className={`cursor-pointer transition-colors ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                      : "hover:bg-muted font-medium"
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
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-muted"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </nav>
  );
}
