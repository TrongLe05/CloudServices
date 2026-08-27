"use client";

import * as React from "react";

interface IdentifiableOrder {
  id: string;
  orderCode?: number | string;
  servicePlanName?: string;
  amount?: number;
  status: string;
  servicePlan?: {
    name?: string;
  };
}

interface UseOrderPaginationOptions<T extends IdentifiableOrder> {
  orders: T[];
  searchTerm?: string;
  statusFilter?: string;
  initialPageSize?: number;
  scrollTargetId?: string;
}

export function useOrderPagination<T extends IdentifiableOrder>({
  orders,
  searchTerm = "",
  statusFilter = "ALL",
  initialPageSize = 5,
  scrollTargetId,
}: UseOrderPaginationOptions<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  // Filter orders by search term and status
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // 1. Status filter
      if (statusFilter !== "ALL" && order.status?.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }

      // 2. Search query filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const code = String(order.orderCode || "").toLowerCase();
        const planName = (order.servicePlanName || order.servicePlan?.name || "").toLowerCase();
        const amountStr = String(order.amount || "");
        const idStr = String(order.id || "").toLowerCase();

        return (
          code.includes(query) ||
          planName.includes(query) ||
          amountStr.includes(query) ||
          idStr.includes(query)
        );
      }

      return true;
    });
  }, [orders, searchTerm, statusFilter]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  // Calculate pagination boundaries
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedOrders = React.useMemo(() => {
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, startIndex, endIndex]);

  const handlePageChange = React.useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
      if (scrollTargetId && typeof window !== "undefined") {
        const target = document.getElementById(scrollTargetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [totalPages, scrollTargetId]
  );

  return {
    currentPage,
    setCurrentPage: handlePageChange,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    filteredOrders,
    paginatedOrders,
  };
}
