import { Skeleton } from "@/components/ui/skeleton";

interface PanelSkeletonProps {
  title: string;
}

export function PanelSkeleton({ title }: PanelSkeletonProps) {
  return (
    <div className="p-6 border border-border rounded-3xl bg-card space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
