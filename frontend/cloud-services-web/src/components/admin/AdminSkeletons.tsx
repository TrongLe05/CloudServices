import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton cho Admin Dashboard (4 KPI Cards + 2 Biểu đồ lớn + 2 Bảng đơn hàng gần đây)
 */
export function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between space-y-0"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-3.5 w-32 rounded-xs" />
            </div>
            <Skeleton className="size-12 rounded-xl" />
          </div>
        ))}
      </div>

      {/* 2 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Orders Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-xs" />
            </div>
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        </div>

        {/* Popular Plans Chart (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-xs" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        </div>
      </div>

      {/* 2 Recent Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Order Requests (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3.5 w-48 rounded-xs" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/60">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-xs" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Affiliate Applications (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div className="space-y-1">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-40 rounded-xs" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-xs" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton cho các trang Quản lý dữ liệu Admin/Editor dạng Bảng (Table + Filter + Search + Pagination)
 */
export function DataTableSkeleton({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Title & Description */}
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title ? (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          ) : (
            <Skeleton className="h-8 w-64 rounded-md" />
          )}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : (
            <Skeleton className="h-4 w-96 rounded-xs" />
          )}
        </div>
      )}

      {/* Main Container Card */}
      <div className="p-6 border border-border rounded-3xl bg-card shadow-xs space-y-6">
        {/* Action Bar (Search + Filter + Add Button) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl shrink-0" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
        </div>

        {/* Data Table Skeleton */}
        <div className="border border-border/70 rounded-2xl overflow-hidden">
          {/* Table Header Row */}
          <div className="bg-muted/40 p-4 border-b border-border/70 flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-12 rounded-xs" />
            <Skeleton className="h-4 w-32 rounded-xs" />
            <Skeleton className="h-4 w-28 rounded-xs hidden sm:block" />
            <Skeleton className="h-4 w-24 rounded-xs hidden md:block" />
            <Skeleton className="h-4 w-20 rounded-xs" />
            <Skeleton className="h-4 w-16 rounded-xs" />
          </div>

          {/* Table Body Rows (6 rows) */}
          <div className="divide-y divide-border/50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <Skeleton className="size-4 rounded-xs shrink-0" />
                <div className="space-y-1.5 flex-1 max-w-[200px]">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-3 w-2/3 rounded-xs" />
                </div>
                <Skeleton className="h-4 w-28 rounded-md hidden sm:block" />
                <Skeleton className="h-4 w-20 rounded-md hidden md:block" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="size-8 rounded-lg" />
                  <Skeleton className="size-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton cho Editor Workspace
 */
export function EditorWorkspaceSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-3.5 w-36 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Main Workspace Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <Skeleton className="h-6 w-44 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <Skeleton className="h-6 w-44 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
