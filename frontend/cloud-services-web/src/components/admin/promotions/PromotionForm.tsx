"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Promotion } from "./PromotionsCRUD";

interface PromotionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPromotion: Promotion | null;
  onSubmit: (payload: {
    name: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
  loading: boolean;
}

export function PromotionForm({
  isOpen,
  onOpenChange,
  editingPromotion,
  onSubmit,
  loading,
}: PromotionFormProps) {
  const [name, setName] = React.useState("");
  const [discountPercentage, setDiscountPercentage] = React.useState(10);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [error, setError] = React.useState("");

  // Sync state on open/edit
  React.useEffect(() => {
    if (isOpen) {
      if (editingPromotion) {
        setName(editingPromotion.name);
        setDiscountPercentage(editingPromotion.discountPercentage);
        setStartDate(editingPromotion.startDate.split("T")[0]);
        setEndDate(editingPromotion.endDate.split("T")[0]);
      } else {
        setName("");
        setDiscountPercentage(10);
        setStartDate("");
        setEndDate("");
      }
      setError("");
    }
  }, [isOpen, editingPromotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên chương trình khuyến mãi là bắt buộc");
      return;
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      setError("Phần trăm giảm giá phải từ 0 đến 100");
      return;
    }
    if (!startDate || !endDate) {
      setError("Ngày bắt đầu và ngày kết thúc là bắt buộc");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    try {
      await onSubmit({
        name,
        discountPercentage,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
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
            {editingPromotion ? "Cập Nhật Khuyến Mãi" : "Thêm Khuyến Mãi Mới"}
          </SheetTitle>
          <SheetDescription>
            Nhập các thông tin chi tiết chương trình giảm giá của bạn
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="promo-name">Tên chương trình</Label>
            <Input
              id="promo-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Ưu Đãi Mùa Hè"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="promo-discount">Phần trăm giảm giá (%)</Label>
            <Input
              id="promo-discount"
              type="number"
              min={0}
              max={100}
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="promo-start">Ngày bắt đầu</Label>
              <Input
                id="promo-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-end">Ngày kết thúc</Label>
              <Input
                id="promo-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
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
              {editingPromotion ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
