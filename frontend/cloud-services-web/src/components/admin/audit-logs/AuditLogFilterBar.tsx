"use client";

import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuditLogFilterState } from "./types";

interface AuditLogFilterBarProps {
  filters: AuditLogFilterState;
  onFilterChange: (filters: AuditLogFilterState) => void;
  onReset: () => void;
}

export function AuditLogFilterBar({
  filters,
  onFilterChange,
  onReset,
}: AuditLogFilterBarProps) {
  const handleChange = (field: keyof AuditLogFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.action ||
    filters.httpMethod ||
    filters.statusCode ||
    filters.isSuccess ||
    filters.username ||
    filters.fromDate ||
    filters.toDate
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Primary search & quick filters */}
      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 border-none p-0 m-0">
        {/* Search keyword */}
        <label className="relative flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Tìm kiếm</span>
          <span className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Hành động, Path, IP, Người dùng..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="pl-9 text-xs"
            />
          </span>
        </label>

        {/* HTTP Method Filter */}
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Phương thức (Method)</span>
          <select
            value={filters.httpMethod}
            onChange={(e) => handleChange("httpMethod", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-slate-900 font-mono"
          >
            <option value="">Tất cả phương thức</option>
            <option value="GET">GET (Truy vấn / Xem)</option>
            <option value="POST">POST (Tạo mới / Thực hiện)</option>
            <option value="PUT">PUT (Cập nhật toàn bộ)</option>
            <option value="PATCH">PATCH (Cập nhật trạng thái)</option>
            <option value="DELETE">DELETE (Xóa dữ liệu)</option>
          </select>
        </label>

        {/* Status Filter */}
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Trạng thái phản hồi</span>
          <select
            value={filters.isSuccess}
            onChange={(e) => handleChange("isSuccess", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-slate-900"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Thành công (2xx)</option>
            <option value="false">Có lỗi (4xx / 5xx)</option>
          </select>
        </label>

        {/* Username Filter */}
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Người thực hiện</span>
          <Input
            type="text"
            placeholder="Tên tài khoản (username)..."
            value={filters.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="text-xs"
          />
        </label>
      </fieldset>

      {/* Date range & Reset toolbar */}
      <footer className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <fieldset className="flex flex-wrap items-center gap-3 border-none p-0 m-0">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">Từ ngày:</span>
            <Input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleChange("fromDate", e.target.value)}
              className="h-8 text-xs w-36"
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">Đến ngày:</span>
            <Input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleChange("toDate", e.target.value)}
              className="h-8 text-xs w-36"
            />
          </label>
        </fieldset>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <RotateCcw className="size-3.5" />
            <span>Đặt lại bộ lọc</span>
          </Button>
        )}
      </footer>
    </form>
  );
}
