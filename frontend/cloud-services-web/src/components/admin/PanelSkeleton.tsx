import { Skeleton } from "@/components/ui/skeleton";

interface PanelSkeletonProps {
  title?: string;
  description?: string;
}

export function PanelSkeleton({ title, description }: PanelSkeletonProps) {
  return (
    <div className="p-6 border border-border rounded-3xl bg-card shadow-xs space-y-6">
      {/* Title & Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5 flex-1">
          {title ? (
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
          ) : (
            <Skeleton className="h-6 w-48 rounded-md" />
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-48 sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-border/70 rounded-2xl overflow-hidden">
        <div className="bg-muted/40 p-4 border-b border-border/70 flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-12 rounded-xs" />
          <Skeleton className="h-4 w-32 rounded-xs" />
          <Skeleton className="h-4 w-28 rounded-xs hidden sm:block" />
          <Skeleton className="h-4 w-24 rounded-xs hidden md:block" />
          <Skeleton className="h-4 w-20 rounded-xs" />
          <Skeleton className="h-4 w-16 rounded-xs" />
        </div>

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

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
