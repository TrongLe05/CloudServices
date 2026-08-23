"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ServicePlan, PlanPrice } from "./ServicePlansCRUD";
import { Promotion } from "../promotions/PromotionsCRUD";

interface PlanPriceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: ServicePlan | null;
  editingPrice: PlanPrice | null;
  promotions: Promotion[];
  onSubmit: (payload: {
    billingCycle: string;
    price: number;
    promotionId: string | null;
  }) => Promise<void>;
  loading: boolean;
}

export function PlanPriceForm({
  isOpen,
  onOpenChange,
  selectedPlan,
  editingPrice,
  promotions,
  onSubmit,
  loading,
}: PlanPriceFormProps) {
  const [billingCycle, setBillingCycle] = React.useState("Monthly");
  const [price, setPrice] = React.useState(0);
  const [promotionId, setPromotionId] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      if (editingPrice) {
        setBillingCycle(editingPrice.billingCycle);
        setPrice(editingPrice.price);
        setPromotionId(editingPrice.promotionId || "");
      } else {
        setBillingCycle("Monthly");
        setPrice(0);
        setPromotionId("");
      }
      setError("");
    }
  }, [isOpen, editingPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingCycle.trim()) {
      setError("Chu kỳ thanh toán là bắt buộc");
      return;
    }
    if (price <= 0) {
      setError("Giá tiền phải lớn hơn 0");
      return;
    }

    try {
      await onSubmit({
        billingCycle,
        price,
        promotionId: promotionId === "" ? null : promotionId,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-6">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle>
            {editingPrice ? "Cập Nhật Mức Giá" : "Thêm Mức Giá Mới"}
          </SheetTitle>
          <SheetDescription>
            {selectedPlan && `Mức giá áp dụng cho gói: ${selectedPlan.name}`}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="price-cycle">Chu kỳ thanh toán</Label>
            <select
              id="price-cycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={loading}
            >
              <option value="Monthly">Hàng tháng (Monthly)</option>
              <option value="Yearly">Hàng năm (Yearly)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price-amount">Giá tiền (VND)</Label>
            <Input
              id="price-amount"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price-promo">Chương trình khuyến mãi áp dụng (Tùy chọn)</Label>
            <select
              id="price-promo"
              value={promotionId}
              onChange={(e) => setPromotionId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              <option value="">Không có khuyến mãi</option>
              {promotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.name} (-{promo.discountPercentage}%)
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="gap-1.5">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {editingPrice ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
