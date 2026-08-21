"use client";

import * as React from "react";
import { Plus, Edit2, Cpu, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Promotion } from "../promotions/PromotionsCRUD";
import { AdminPagination } from "../AdminPagination";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog";

// Import sub-components
import { ServicePlanForm } from "./ServicePlanForm";
import { PlanPriceForm } from "./PlanPriceForm";
import { PlanPricesList } from "./PlanPricesList";
import { ServicePlanQrCard } from "./ServicePlanQrCard";
import { toast } from "@/components/ui/toast";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ServicePlan {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  categoryName?: string;
}

export interface PlanPrice {
  id: string;
  billingCycle: string;
  price: number;
  promotionId?: string | null;
  promotionName?: string;
  promotionDiscountPercentage?: number;
}

export interface QrCodeData {
  servicePlanId: string;
  targetUrl: string;
  qrCodeBase64: string;
}

interface ServicePlansCRUDProps {
  initialServicePlans: ServicePlan[];
  categories: ServiceCategory[];
  promotions: Promotion[];
}

export function ServicePlansCRUD({
  initialServicePlans,
  categories,
  promotions,
}: ServicePlansCRUDProps) {
  const [plans, setPlans] = React.useState<ServicePlan[]>(initialServicePlans);
  const [loading, setLoading] = React.useState(false);
  
  // Sheet states
  const [isPlanSheetOpen, setIsPlanSheetOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<ServicePlan | null>(null);
  const [isPriceSheetOpen, setIsPriceSheetOpen] = React.useState(false);
  const [editingPrice, setEditingPrice] = React.useState<PlanPrice | null>(null);

  // Selected Plan for Prices & QR Codes management (Sequential Data Loading)
  const [selectedPlan, setSelectedPlan] = React.useState<ServicePlan | null>(null);
  const [prices, setPrices] = React.useState<PlanPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = React.useState(false);

  // QR Code State (Parallel client-side fetch with prices)
  const [qrCode, setQrCode] = React.useState<QrCodeData | null>(null);
  const [loadingQr, setLoadingQr] = React.useState(false);

  // Pagination State for Plans List
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  // Reset page when plans list changes size
  React.useEffect(() => {
    const maxPage = Math.ceil(plans.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [plans, currentPage]);

  const paginatedPlans = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return plans.slice(start, start + itemsPerPage);
  }, [plans, currentPage]);

  // SEQUENTIAL FETCHING & PARALLEL DETAIL FETCHING:
  React.useEffect(() => {
    if (!selectedPlan) {
      setPrices([]);
      setQrCode(null);
      return;
    }

    const fetchDetails = async () => {
      setLoadingPrices(true);
      setLoadingQr(true);
      try {
        const [pricesRes, qrRes] = await Promise.all([
          fetch(`/api/service-plans/${selectedPlan.id}/prices`),
          fetch(`/api/service-plans/${selectedPlan.id}/qr-code`),
        ]);

        if (pricesRes.ok) {
          const data = await pricesRes.json();
          const mappedPrices = data.map((priceObj: any) => {
            const promo = promotions.find((p) => p.id === priceObj.promotionId);
            return {
              ...priceObj,
              promotionName: promo?.name || null,
              promotionDiscountPercentage: promo?.discountPercentage || 0,
            };
          });
          setPrices(mappedPrices);
        }

        if (qrRes.ok) {
          const qrData = await qrRes.json();
          setQrCode(qrData);
        } else {
          setQrCode(null);
        }
      } catch (err: any) {
        console.error("Lỗi khi tải thông tin chi tiết gói dịch vụ:", err);
      } finally {
        setLoadingPrices(false);
        setLoadingQr(false);
      }
    };

    fetchDetails();
  }, [selectedPlan, promotions]);

  // Plan API Handlers
  const handlePlanSubmit = async (payload: any) => {
    setLoading(true);
    try {
      if (editingPlan) {
        const res = await fetch(`/api/service-plans/${editingPlan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể cập nhật gói dịch vụ");
        }

        const category = categories.find((c) => c.id === payload.categoryId);
        const updatedPlan: ServicePlan = {
          ...editingPlan,
          ...payload,
          categoryName: category?.name,
        };

        setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? updatedPlan : p)));
        if (selectedPlan?.id === editingPlan.id) {
          setSelectedPlan(updatedPlan);
        }

        toast.add({
          title: "Cập nhật thành công",
          description: "Đã cập nhật cấu hình gói dịch vụ.",
          type: "success",
        });
      } else {
        const res = await fetch("/api/service-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tạo gói dịch vụ");
        }

        const createdData = await res.json();
        const category = categories.find((c) => c.id === payload.categoryId);
        const newPlan: ServicePlan = {
          id: createdData.id,
          ...payload,
          categoryName: category?.name,
        };
        setPlans((prev) => [...prev, newPlan]);
        setSelectedPlan(newPlan);

        toast.add({
          title: "Tạo thành công",
          description: "Đã thêm gói dịch vụ mới.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast.add({
        title: "Lỗi thực hiện",
        description: err.message || "Không thể lưu gói dịch vụ",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePlanDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/service-plans/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể xóa gói dịch vụ");
      }

      setPlans((prev) => prev.filter((p) => p.id !== id));
      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }

      toast.add({
        title: "Xóa thành công",
        description: "Đã xóa gói dịch vụ.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi xóa gói dịch vụ",
        description: err.message || "Không thể xóa gói dịch vụ",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Price API Handlers
  const handlePriceSubmit = async (payload: any) => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      if (editingPrice) {
        const res = await fetch(`/api/service-plans/${selectedPlan.id}/prices/${editingPrice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể cập nhật bảng giá");
        }

        const promo = promotions.find((p) => p.id === payload.promotionId);
        const updatedPrice: PlanPrice = {
          ...editingPrice,
          ...payload,
          promotionName: promo?.name || undefined,
          promotionDiscountPercentage: promo?.discountPercentage || 0,
        };

        setPrices((prev) => prev.map((p) => (p.id === editingPrice.id ? updatedPrice : p)));

        toast.add({
          title: "Cập nhật thành công",
          description: "Đã cập nhật mức giá cho gói dịch vụ.",
          type: "success",
        });
      } else {
        const res = await fetch(`/api/service-plans/${selectedPlan.id}/prices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tạo bảng giá");
        }

        const createdId = await res.json();
        const promo = promotions.find((p) => p.id === payload.promotionId);
        const newPrice: PlanPrice = {
          id: createdId,
          ...payload,
          promotionName: promo?.name || undefined,
          promotionDiscountPercentage: promo?.discountPercentage || 0,
        };
        setPrices((prev) => [...prev, newPrice]);

        toast.add({
          title: "Tạo thành công",
          description: "Đã thêm mức giá mới.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast.add({
        title: "Lỗi thực hiện",
        description: err.message || "Không thể lưu mức giá",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePriceDelete = async (priceId: string) => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/service-plans/${selectedPlan.id}/prices/${priceId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể xóa mức giá");
      }

      setPrices((prev) => prev.filter((p) => p.id !== priceId));

      toast.add({
        title: "Xóa thành công",
        description: "Đã xóa mức giá.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi xóa mức giá",
        description: err.message || "Không thể xóa mức giá",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQr = async () => {
    if (!selectedPlan) return;
    setLoadingQr(true);
    try {
      const res = await fetch(`/api/service-plans/${selectedPlan.id}/qr-code/regenerate`, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể tạo lại mã QR");
      }

      const qrData = await res.json();
      setQrCode(qrData);

      toast.add({
        title: "Tạo mã QR thành công",
        description: "Đã tạo mới mã QR cho gói dịch vụ.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi tạo QR",
        description: err.message || "Đã xảy ra lỗi khi tạo lại mã QR",
        type: "error",
      });
    } finally {
      setLoadingQr(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Service Plans List */}
      <Card className="lg:col-span-2 shadow-xs border border-border flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-semibold">Gói Dịch Vụ Đám Mây</CardTitle>
              <CardDescription>Cấu hình tài nguyên phần cứng cho các gói dịch vụ</CardDescription>
            </div>
            <Button onClick={() => { setEditingPlan(null); setIsPlanSheetOpen(true); }} size="sm" className="gap-1.5">
              <Plus className="size-4" /> Thêm gói
            </Button>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Chưa có gói dịch vụ nào được tạo.
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedPlans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base text-foreground">{plan.name}</h3>
                          {plan.categoryName && (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {plan.categoryName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {plan.description || "Không có mô tả"}
                        </p>
                        
                        {/* Specs */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Cpu className="size-3.5 text-primary/70" /> {plan.cpu || "N/A"} Cores
                          </span>
                          <span className="flex items-center gap-1">
                            <HardDrive className="size-3.5 text-primary/70" /> {plan.ram || "N/A"} RAM / {plan.storage || "N/A"} SSD
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end self-end md:self-center">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPlan(plan);
                            setIsPlanSheetOpen(true);
                          }}
                          disabled={loading}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        
                        <div onClick={(e) => e.stopPropagation()}>
                          <ConfirmDeleteDialog
                            title="Xác nhận xóa gói dịch vụ"
                            description={`Bạn có chắc chắn muốn xóa gói dịch vụ "${plan.name}"? Mọi mức giá liên quan của gói này sẽ bị xóa vĩnh viễn và không thể hoàn tác.`}
                            onConfirm={() => handlePlanDelete(plan.id)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={plans.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemName="gói dịch vụ"
        />
      </Card>

      {/* Plan Details Sidebar (Bảng Giá + Mã QR) */}
      <div className="space-y-6">
        <PlanPricesList
          selectedPlan={selectedPlan}
          prices={prices}
          loadingPrices={loadingPrices}
          onOpenCreatePrice={() => { setEditingPrice(null); setIsPriceSheetOpen(true); }}
          onOpenEditPrice={(priceObj) => { setEditingPrice(priceObj); setIsPriceSheetOpen(true); }}
          onPriceDelete={handlePriceDelete}
          loading={loading}
        />

        <ServicePlanQrCard
          selectedPlan={selectedPlan}
          qrCode={qrCode}
          loadingQr={loadingQr}
          onRegenerateQr={handleRegenerateQr}
          loading={loading}
        />
      </div>

      {/* Sheet Form for Plan */}
      <ServicePlanForm
        isOpen={isPlanSheetOpen}
        onOpenChange={setIsPlanSheetOpen}
        editingPlan={editingPlan}
        categories={categories}
        onSubmit={handlePlanSubmit}
        loading={loading}
      />

      {/* Sheet Form for Price */}
      <PlanPriceForm
        isOpen={isPriceSheetOpen}
        onOpenChange={setIsPriceSheetOpen}
        selectedPlan={selectedPlan}
        editingPrice={editingPrice}
        promotions={promotions}
        onSubmit={handlePriceSubmit}
        loading={loading}
      />
    </div>
  );
}
