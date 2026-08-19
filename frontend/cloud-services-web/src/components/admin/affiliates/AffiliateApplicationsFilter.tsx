"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AffiliateApplicationsFilterProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
}

export function AffiliateApplicationsFilter({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
}: AffiliateApplicationsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative w-full sm:w-72">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm tên đối tác, email..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Trạng thái:</span>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="flex h-9 w-full sm:w-44 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="ALL">Tất cả đơn đăng ký</option>
          <option value="0">Mới đăng ký (New)</option>
          <option value="1">Đang duyệt (Pending)</option>
          <option value="2">Chấp nhận (Approved)</option>
          <option value="3">Từ chối (Rejected)</option>
        </select>
      </div>
    </div>
  );
}
