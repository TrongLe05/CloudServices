"use client";

import * as React from "react";
import { Plus, Edit2, Loader2, DollarSign, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ServicePlan, PlanPrice } from "./ServicePlansCRUD";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog";

interface PlanPricesListProps {
  selectedPlan: ServicePlan | null;
  prices: PlanPrice[];
  loadingPrices: boolean;
  onOpenCreatePrice: () => void;
  onOpenEditPrice: (price: PlanPrice) => void;
  onPriceDelete: (priceId: string) => Promise<void>;
  loading: boolean;
}

export function PlanPricesList({
  selectedPlan,
  prices,
  loadingPrices,
  onOpenCreatePrice,
  onOpenEditPrice,
  onPriceDelete,
  loading,
}: PlanPricesListProps) {
  return (
    <Card className="shadow-xs border border-border h-fit">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="text-lg font-semibold flex items-center gap-1.5">
          <DollarSign className="size-5 text-emerald-600" /> Bảng Giá & Khuyến Mãi
        </CardTitle>
        <CardDescription>
          {selectedPlan
            ? `Thiết lập giá cho gói: ${selectedPlan.name}`
            : "Chọn một gói dịch vụ bên trái để quản lý bảng giá"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {!selectedPlan ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Chưa chọn gói dịch vụ. Hãy chọn một gói ở danh sách bên cạnh.
          </div>
        ) : loadingPrices ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Đang tải bảng giá...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Mức giá hiện tại ({prices.length})
              </span>
              <Button onClick={onOpenCreatePrice} size="icon-sm" className="h-7 w-7">
                <Plus className="size-4" />
              </Button>
            </div>

            {prices.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-xl text-muted-foreground text-xs">
                Gói này chưa có mức giá nào. Nhấp dấu cộng để thêm.
              </div>
            ) : (
              <div className="space-y-2.5">
                {prices.map((pr) => {
                  const discountAmt = pr.promotionDiscountPercentage
                    ? (pr.price * pr.promotionDiscountPercentage) / 100
                    : 0;
                  const finalPrice = pr.price - discountAmt;

                  return (
                    <div
                      key={pr.id}
                      className="p-3 border border-border rounded-xl bg-muted/20 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm">
                            {pr.billingCycle === "Monthly" ? "Hàng tháng" : "Hàng năm"}
                          </span>
                          {pr.promotionName && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                              <Tag className="size-2.5" /> -{pr.promotionDiscountPercentage}%
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs">
                          {pr.promotionDiscountPercentage ? (
                            <div className="space-x-1.5 flex items-baseline">
                              <span className="line-through text-muted-foreground">
                                {pr.price.toLocaleString("vi-VN")}đ
                              </span>
                              <span className="font-bold text-emerald-600">
                                {finalPrice.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-foreground">
                              {pr.price.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onOpenEditPrice(pr)}
                          disabled={loading}
                        >
                          <Edit2 className="size-3" />
                        </Button>
                        
                        <ConfirmDeleteDialog
                          title="Xác nhận xóa mức giá"
                          description={`Bạn có chắc chắn muốn xóa mức giá này (${pr.price.toLocaleString("vi-VN")}đ / ${pr.billingCycle === "Monthly" ? "Tháng" : "Năm"})? Hành động này không thể hoàn tác.`}
                          onConfirm={() => onPriceDelete(pr.id)}
                          disabled={loading}
                          triggerButtonSize="icon-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
