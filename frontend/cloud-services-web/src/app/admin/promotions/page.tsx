export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { PromotionsSection } from "@/components/admin/promotions/PromotionsSection";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";

export default function AdminPromotionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Quản Lý Khuyến Mãi
        </h1>
        <p className="text-sm text-muted-foreground">
          Tạo và cấu hình các chương trình ưu đãi giảm giá áp dụng cho các mức giá dịch vụ.
        </p>
      </div>

      <Suspense fallback={<PanelSkeleton title="Đang tải danh sách khuyến mãi..." />}>
        <PromotionsSection />
      </Suspense>
    </div>
  );
}
