export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Hero } from "@/components/landing/Hero";
import { Promotions, PromotionItem } from "@/components/landing/Promotions";
import { Services } from "@/components/landing/Services";
import { FeaturedPlans, FeaturedPlanItem } from "@/components/landing/FeaturedPlans";
import { Configurator } from "@/components/landing/Configurator";
import { UptimeSla } from "@/components/landing/UptimeSla";
import { LatestNews, BlogPostItem } from "@/components/landing/LatestNews";
import { SupportContact } from "@/components/landing/SupportContact";

// 1. Promotions Section (Parallel Async Streaming)
async function PromotionsSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
  try {
    const res = await fetch(`${apiUrl}/api/promotions?pageSize=10`, { cache: "no-store" }).catch(() => null);
    let promotions: PromotionItem[] = [];
    if (res && res.ok) {
      const data = await res.json();
      promotions = Array.isArray(data) ? data : data.items || [];
    }
    return <Promotions initialPromotions={promotions} />;
  } catch (error) {
    console.error("Lỗi khi tải promotions:", error);
    return <Promotions initialPromotions={[]} />;
  }
}

// 2. Featured Plans Section (Parallel Async Streaming)
async function FeaturedPlansSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
  try {
    const [plansRes, categoriesRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-plans?pageSize=6`, { cache: "no-store" }).catch(() => null),
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }).catch(() => null),
    ]);

    let categories: any[] = [];
    if (categoriesRes && categoriesRes.ok) {
      categories = await categoriesRes.json();
    }

    let plans: FeaturedPlanItem[] = [];
    if (plansRes && plansRes.ok) {
      const plData = await plansRes.json();
      const rawPlans = Array.isArray(plData) ? plData : plData.items || [];
      plans = rawPlans.slice(0, 3).map((plan: any) => {
        const cat = categories.find((c) => c.id === plan.categoryId);
        return {
          ...plan,
          categoryName: plan.categoryName || cat?.name || "Cloud Service",
          prices: plan.prices || [],
        };
      });
    }
    return <FeaturedPlans initialPlans={plans} />;
  } catch (error) {
    console.error("Lỗi khi tải plans:", error);
    return <FeaturedPlans initialPlans={[]} />;
  }
}

// 3. Latest News Section (Parallel Async Streaming)
async function LatestNewsSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
  try {
    const res = await fetch(`${apiUrl}/api/news?pageSize=3`, { cache: "no-store" }).catch(() => null);
    let news: BlogPostItem[] = [];
    if (res && res.ok) {
      const data = await res.json();
      news = Array.isArray(data) ? data : data.items || data.Items || [];
    }
    return <LatestNews initialNews={news} />;
  } catch (error) {
    console.error("Lỗi khi tải news:", error);
    return <LatestNews initialNews={[]} />;
  }
}

// --- Skeleton UI Components ---
function PromotionsSkeleton() {
  return (
    <section className="w-full py-24 md:py-32 bg-slate-50 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-12 text-center items-center">
        <div className="flex flex-col items-center gap-3 max-w-md w-full">
          <Skeleton className="h-6 w-56 rounded-full" />
          <Skeleton className="h-9 w-72 md:w-96 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPlansSkeleton() {
  return (
    <section className="w-full py-24 md:py-32 border-b border-slate-200/80 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-12 text-center items-center">
        <div className="flex flex-col items-center gap-3 max-w-md w-full">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-9 w-80 md:w-96 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-200 space-y-6 shadow-sm">
              <Skeleton className="h-7 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestNewsSkeleton() {
  return (
    <section className="w-full py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-12">
        <div className="flex justify-between items-end pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-8 w-72 rounded-xl" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl hidden md:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex-1 w-full bg-background font-sans overflow-x-hidden">
      {/* Hero Banner Section (Render tức thì 0s) */}
      <Hero />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Promotions Section (Suspense Streaming) */}
      <Suspense fallback={<PromotionsSkeleton />}>
        <PromotionsSection />
      </Suspense>
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Core Services Grid Section (Render tức thì 0s) */}
      <Services />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Pre-configured Featured Plans (Suspense Streaming) */}
      <Suspense fallback={<FeaturedPlansSkeleton />}>
        <FeaturedPlansSection />
      </Suspense>
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Interactive Resource Configurator (Render tức thì 0s) */}
      <Configurator />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Network Stability & SLA (Render tức thì 0s) */}
      <UptimeSla />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Latest News Section (Suspense Streaming) */}
      <Suspense fallback={<LatestNewsSkeleton />}>
        <LatestNewsSection />
      </Suspense>
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Support Contact Section (Render tức thì 0s) */}
      <SupportContact />
    </main>
  );
}
