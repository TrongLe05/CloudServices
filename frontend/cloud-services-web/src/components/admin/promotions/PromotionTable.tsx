"use client";

import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog";
import { Promotion } from "./PromotionsCRUD";

interface PromotionTableProps {
  promotions: Promotion[];
  onOpenEdit: (promo: Promotion) => void;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function PromotionTable({
  promotions,
  onOpenEdit,
  onDelete,
  loading,
}: PromotionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-medium">
            <th className="py-3 px-4">Tên</th>
            <th className="py-3 px-4 text-center">Mức Giảm</th>
            <th className="py-3 px-4">Thời Gian Áp Dụng</th>
            <th className="py-3 px-4 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {promotions.map((promo) => {
            const isActive =
              new Date(promo.startDate) <= new Date() &&
              new Date(promo.endDate) >= new Date();

            return (
              <tr key={promo.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                  {promo.name}
                  {isActive ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    >
                      Đang chạy
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    >
                      Hết hạn/Chờ
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-4 text-center font-bold text-red-600">
                  {promo.discountPercentage}%
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {new Date(promo.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onOpenEdit(promo)}
                    disabled={loading}
                  >
                    <Edit2 className="size-3.5" />
                  </Button>

                  <ConfirmDeleteDialog
                    title="Xác nhận xóa khuyến mãi"
                    description={`Bạn có chắc chắn muốn xóa chương trình khuyến mãi "${promo.name}"? Hành động này không thể hoàn tác.`}
                    onConfirm={() => onDelete(promo.id)}
                    disabled={loading}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
