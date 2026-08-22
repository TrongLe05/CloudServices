export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ServicePlansSection } from "@/components/admin/service-plans/ServicePlansSection";
import { getPromotions } from "@/components/admin/promotions/PromotionsSection";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";

export default async function AdminServicePlansPage() {
  const promotionsPromise = getPromotions();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Quản Lý Gói Dịch Vụ & Bảng Giá
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý cấu hình tài nguyên phần cứng, định mức bảng giá và mã QR Code cho từng dịch vụ.
        </p>
      </div>

      <Suspense fallback={<PanelSkeleton title="Đang tải danh sách gói dịch vụ..." />}>
        <ServicePlansSectionWrapper promotionsPromise={promotionsPromise} />
      </Suspense>
    </div>
  );
}

async function ServicePlansSectionWrapper({
  promotionsPromise,
}: {
  promotionsPromise: Promise<any[]>;
}) {
  const promotions = await promotionsPromise;
  return <ServicePlansSection promotions={promotions} />;
}
