"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AdminPagination } from "../AdminPagination";

// Import sub-components
import { PromotionForm } from "./PromotionForm";
import { PromotionTable } from "./PromotionTable";

export interface Promotion {
  id: string;
  name: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

interface PromotionsCRUDProps {
  initialPromotions: Promotion[];
}

export function PromotionsCRUD({ initialPromotions }: PromotionsCRUDProps) {
  const [promotions, setPromotions] = React.useState<Promotion[]>(initialPromotions);
  const [loading, setLoading] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingPromotion, setEditingPromotion] = React.useState<Promotion | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(promotions.length / itemsPerPage);

  // Reset page when promotions list changes size
  React.useEffect(() => {
    const maxPage = Math.ceil(promotions.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [promotions, currentPage]);

  const paginatedPromotions = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return promotions.slice(start, start + itemsPerPage);
  }, [promotions, currentPage]);

  const handleOpenCreate = () => {
    setEditingPromotion(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      if (editingPromotion) {
        const res = await fetch(`/api/promotions/${editingPromotion.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể cập nhật chương trình khuyến mãi");
        }

        const updated: Promotion = await res.json();
        setPromotions((prev) =>
          prev.map((p) => (p.id === editingPromotion.id ? updated : p))
        );
      } else {
        const res = await fetch("/api/promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tạo chương trình khuyến mãi");
        }

        const created: Promotion = await res.json();
        setPromotions((prev) => [...prev, created]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể xóa chương trình khuyến mãi");
      }

      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Không thể xóa chương trình khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold">Chương Trình Khuyến Mãi</CardTitle>
          <CardDescription>Quản lý các chương trình ưu đãi giảm giá</CardDescription>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5">
          <Plus className="size-4" /> Thêm mới
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {promotions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có chương trình khuyến mãi nào được tạo.
          </div>
        ) : (
          <>
            <PromotionTable
              promotions={paginatedPromotions}
              onOpenEdit={handleOpenEdit}
              onDelete={handleDelete}
              loading={loading}
            />

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={promotions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="khuyến mãi"
            />
          </>
        )}
      </CardContent>

      <PromotionForm
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        editingPromotion={editingPromotion}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Card>
  );
}
