"use client";

import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog";
import { ServiceCategory } from "../service-plans/ServicePlansCRUD";

interface CategoryTableProps {
  categories: ServiceCategory[];
  onOpenEdit: (category: ServiceCategory) => void;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function CategoryTable({
  categories,
  onOpenEdit,
  onDelete,
  loading,
}: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-medium">
            <th className="py-3 px-4">Tên danh mục</th>
            <th className="py-3 px-4">Đường dẫn (Slug)</th>
            <th className="py-3 px-4">Mô tả</th>
            <th className="py-3 px-4 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-semibold text-foreground">
                {cat.name}
              </td>
              <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                {cat.slug}
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                {(cat as any).description || "Không có mô tả"}
              </td>
              <td className="py-3 px-4 text-right space-x-1.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onOpenEdit(cat)}
                  disabled={loading}
                >
                  <Edit2 className="size-3.5" />
                </Button>

                <ConfirmDeleteDialog
                  title="Xác nhận xóa danh mục"
                  description={`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"? Hành động này sẽ thất bại nếu có gói dịch vụ nào đang liên kết với danh mục này.`}
                  onConfirm={() => onDelete(cat.id)}
                  disabled={loading}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
