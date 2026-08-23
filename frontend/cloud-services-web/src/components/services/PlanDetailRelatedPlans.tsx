import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ServicePlanItem } from "@/types/plans.types";
import { PlanQrThumbnail } from "./PlanQrThumbnail";
import { PlanSpecsList } from "@/components/common/PlanSpecsList";
import { formatVND } from "@/lib/formatUtils";
import { slugify } from "@/lib/slugUtils";

export interface PlanDetailRelatedPlansProps {
  plans: ServicePlanItem[];
  onOpenQr: (plan: { id: string; name: string; categoryName?: string }) => void;
}

export function PlanDetailRelatedPlans({
  plans,
  onOpenQr,
}: PlanDetailRelatedPlansProps) {
  if (plans.length === 0) return null;

  return (
    <section aria-label="Gói dịch vụ liên quan" className="space-y-6 pt-8 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
            Cấu hình tương đương
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Có thể bạn cũng quan tâm
          </h2>
        </div>
        <Button
          render={<Link href="/dich-vu" />}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-bold self-start sm:self-auto gap-1"
        >
          <span>Xem tất cả gói</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.slice(0, 3).map((rPlan) => {
          const rMonthlyPrice = rPlan.prices?.[0]?.price || 0;
          const rCategorySlug = rPlan.categorySlug || slugify(rPlan.categoryName || "cloud");
          const rPlanSlug = rPlan.slug || slugify(rPlan.name);
          const rDetailUrl = `/dich-vu/${rCategorySlug}/${rPlanSlug}`;

          return (
            <Card
              key={rPlan.id}
              className="rounded-3xl border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold text-slate-600 bg-slate-100">
                      {rPlan.categoryName || "Cloud Service"}
                    </Badge>

                    <div
                      onClick={() => onOpenQr({ id: rPlan.id, name: rPlan.name, categoryName: rPlan.categoryName })}
                      className="cursor-pointer group/zoom relative shrink-0"
                      title="Xem mã QR"
                    >
                      <PlanQrThumbnail planId={rPlan.id} planName={rPlan.name} size="sm" />
                    </div>
                  </div>

                  <CardTitle className="text-base font-bold text-slate-900 font-heading mt-2">
                    <Link href={rDetailUrl} className="hover:text-primary transition-colors">
                      {rPlan.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                    {rPlan.description || "Máy chủ đám mây thế hệ mới."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-lg font-black text-primary font-heading">
                      {rMonthlyPrice > 0 ? formatVND(rMonthlyPrice) : "Liên hệ"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">/tháng</span>
                  </div>

                  <PlanSpecsList
                    cpu={rPlan.cpu}
                    ram={rPlan.ram}
                    storage={rPlan.storage}
                    bandwidth={rPlan.bandwidth}
                    variant="compact"
                  />
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-0 border-t border-slate-100 flex gap-2">
                <Button
                  render={<Link href={`/dat-hang?planId=${rPlan.id}&cycle=Monthly`} />}
                  size="sm"
                  className="w-full h-9 rounded-xl font-bold text-xs bg-primary text-white shadow-xs"
                >
                  Đăng ký ngay
                </Button>
                <Button
                  render={<Link href={rDetailUrl} />}
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl text-xs font-semibold"
                >
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
