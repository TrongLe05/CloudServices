"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ServicePlan, ServiceCategory } from "./ServicePlansCRUD";

interface ServicePlanFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPlan: ServicePlan | null;
  categories: ServiceCategory[];
  onSubmit: (payload: {
    categoryId: string;
    name: string;
    description: string;
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
  }) => Promise<void>;
  loading: boolean;
}

export function ServicePlanForm({
  isOpen,
  onOpenChange,
  editingPlan,
  categories,
  onSubmit,
  loading,
}: ServicePlanFormProps) {
  const [categoryId, setCategoryId] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [cpu, setCpu] = React.useState("");
  const [ram, setRam] = React.useState("");
  const [storage, setStorage] = React.useState("");
  const [bandwidth, setBandwidth] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      if (editingPlan) {
        setCategoryId(editingPlan.categoryId);
        setName(editingPlan.name);
        setDescription(editingPlan.description || "");
        setCpu(editingPlan.cpu || "");
        setRam(editingPlan.ram || "");
        setStorage(editingPlan.storage || "");
        setBandwidth(editingPlan.bandwidth || "");
      } else {
        setCategoryId(categories[0]?.id || "");
        setName("");
        setDescription("");
        setCpu("");
        setRam("");
        setStorage("");
        setBandwidth("");
      }
      setError("");
    }
  }, [isOpen, editingPlan, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên gói dịch vụ là bắt buộc");
      return;
    }
    if (!categoryId) {
      setError("Vui lòng chọn loại danh mục dịch vụ");
      return;
    }

    try {
      await onSubmit({
        categoryId,
        name,
        description,
        cpu,
        ram,
        storage,
        bandwidth,
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
            {editingPlan ? "Cập Nhật Gói Dịch Vụ" : "Thêm Gói Dịch Vụ Mới"}
          </SheetTitle>
          <SheetDescription>Thiết lập thông số tài nguyên cho gói dịch vụ</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="plan-category">Danh mục dịch vụ</Label>
            <select
              id="plan-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Tên gói dịch vụ</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cloud VPS Basic"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-desc">Mô tả gói</Label>
            <Input
              id="plan-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về gói dịch vụ..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-cpu">CPU Cores</Label>
              <Input
                id="plan-cpu"
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                placeholder="VD: 2"
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan-ram">Dung lượng RAM</Label>
              <Input
                id="plan-ram"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="VD: 4GB"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-storage">Dung lượng lưu trữ SSD</Label>
              <Input
                id="plan-storage"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="VD: 50GB"
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan-bandwidth">Băng thông</Label>
              <Input
                id="plan-bandwidth"
                value={bandwidth}
                onChange={(e) => setBandwidth(e.target.value)}
                placeholder="VD: Unlimited"
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
              {editingPlan ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
