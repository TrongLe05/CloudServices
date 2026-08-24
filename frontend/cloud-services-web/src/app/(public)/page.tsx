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

// --- Skeleton UI Components (Thiết kế pixel-perfect khớp 100% với component thật) ---
function PromotionsSkeleton() {
  return (
    <section className="w-full py-24 md:py-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center gap-4 text-center max-w-3xl mx-auto w-full">
          <Skeleton className="h-6 w-64 rounded-full" />
          <Skeleton className="h-10 w-80 md:w-[420px] rounded-xl" />
          <Skeleton className="h-4 w-full max-w-md rounded-md" />
        </div>

        {/* 3 Promotions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-2xl bg-white shadow-sm h-[360px] relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top indicator stripe */}
              <div className="h-1.5 w-full bg-slate-200" />

              <div className="p-6 flex-1 flex flex-col justify-between">
                {/* Icon and Expiry Badge */}
                <div className="flex justify-between items-start">
                  <Skeleton className="size-11 rounded-xl" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>

                {/* Title and Description */}
                <div className="space-y-2.5 my-4">
                  <Skeleton className="h-6 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>

                {/* Promo Code Box */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 rounded-xs" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="size-8 rounded-lg" />
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-6 pt-0 border-t border-slate-100">
                <Skeleton className="h-10 w-full rounded-xl mt-4" />
              </div>
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16 items-center">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl w-full">
          <Skeleton className="h-6 w-60 rounded-full" />
          <Skeleton className="h-10 w-80 md:w-[460px] rounded-xl" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md" />
        </div>

        {/* 3 Featured Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-slate-200/80 rounded-3xl bg-white shadow-sm p-8 flex flex-col justify-between h-[520px]"
            >
              {/* Header: Category Badge & Title & Description */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-7 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>

              {/* Price Tag */}
              <div className="py-4 border-y border-slate-100 my-4 space-y-2">
                <Skeleton className="h-9 w-44 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-xs" />
              </div>

              {/* Specs List (CPU, RAM, SSD, Bandwidth) */}
              <div className="space-y-3.5 flex-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="size-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full max-w-[200px] rounded-md" />
                  </div>
                ))}
              </div>

              {/* Buttons: Order CTA + QR */}
              <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="size-11 rounded-xl shrink-0" />
              </div>
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-16">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-9 w-80 md:w-96 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>

        {/* 3 News Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col justify-between space-y-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <div className="flex items-center gap-4 pt-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
              <Skeleton className="h-5 w-28 rounded-md pt-2" />
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
