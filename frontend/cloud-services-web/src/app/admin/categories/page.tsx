export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getCategories } from "@/components/admin/service-plans/ServicePlansSection";
import { CategoriesCRUD } from "@/components/admin/categories/CategoriesCRUD";
import { PanelSkeleton } from "@/components/admin/PanelSkeleton";

export default async function AdminCategoriesPage() {
  const categoriesPromise = getCategories();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Quản Lý Danh Mục Dịch Vụ
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý các danh mục phân loại dịch vụ điện toán đám mây (VPS, Cloud Server, Cloud Hosting...).
        </p>
      </div>

      <Suspense fallback={<PanelSkeleton title="Đang tải danh mục dịch vụ..." />}>
        <CategoriesSectionWrapper categoriesPromise={categoriesPromise} />
      </Suspense>
    </div>
  );
}

async function CategoriesSectionWrapper({
  categoriesPromise,
}: {
  categoriesPromise: Promise<any[]>;
}) {
  const categories = await categoriesPromise;
  return <CategoriesCRUD initialCategories={categories} />;
}
