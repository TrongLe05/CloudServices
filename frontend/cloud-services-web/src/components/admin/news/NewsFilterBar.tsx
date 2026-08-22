"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NewsFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categoriesList: string[];
}

export function NewsFilterBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categoriesList,
}: NewsFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative w-full sm:w-72">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo tiêu đề..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Chuyên mục:</span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex h-9 w-full sm:w-44 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="ALL">Tất cả chuyên mục</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
