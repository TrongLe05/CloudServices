"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ServiceCategory } from "../service-plans/ServicePlansCRUD";
import { AdminPagination } from "../AdminPagination";

// Import subcomponents
import { CategoryForm } from "./CategoryForm";
import { CategoryTable } from "./CategoryTable";

interface CategoriesCRUDProps {
  initialCategories: ServiceCategory[];
}

export function CategoriesCRUD({ initialCategories }: CategoriesCRUDProps) {
  const [categories, setCategories] = React.useState<ServiceCategory[]>(initialCategories);
  const [loading, setLoading] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ServiceCategory | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Reset page when categories size changes
  React.useEffect(() => {
    const maxPage = Math.ceil(categories.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [categories, currentPage]);

  const paginatedCategories = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return categories.slice(start, start + itemsPerPage);
  }, [categories, currentPage]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      if (editingCategory) {
        const res = await fetch(`/api/service-categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể cập nhật danh mục");
        }

        const updated: ServiceCategory = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
      } else {
        const res = await fetch("/api/service-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tạo danh mục");
        }

        const created: ServiceCategory = await res.json();
        setCategories((prev) => [...prev, created]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/service-categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể xóa danh mục");
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Không thể xóa danh mục. Vui lòng kiểm tra xem danh mục có đang chứa gói dịch vụ nào không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold">Danh Mục Dịch Vụ</CardTitle>
          <CardDescription>Quản lý phân loại dịch vụ điện toán đám mây</CardDescription>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5">
          <Plus className="size-4" /> Thêm danh mục
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có danh mục nào được tạo.
          </div>
        ) : (
          <>
            <CategoryTable
              categories={paginatedCategories}
              onOpenEdit={handleOpenEdit}
              onDelete={handleDelete}
              loading={loading}
            />

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={categories.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="danh mục"
            />
          </>
        )}
      </CardContent>

      <CategoryForm
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        editingCategory={editingCategory}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Card>
  );
}
