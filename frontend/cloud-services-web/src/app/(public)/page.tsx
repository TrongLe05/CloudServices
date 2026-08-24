export const revalidate = 60;

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { Separator } from "@/components/ui/separator";
import { Hero } from "@/components/landing/Hero";
import { Promotions, PromotionItem } from "@/components/landing/Promotions";
import { Services } from "@/components/landing/Services";
import { FeaturedPlans, FeaturedPlanItem } from "@/components/landing/FeaturedPlans";
import { Configurator } from "@/components/landing/Configurator";
import { UptimeSla } from "@/components/landing/UptimeSla";
import { LatestNews, BlogPostItem } from "@/components/landing/LatestNews";
import { SupportContact } from "@/components/landing/SupportContact";
import { CACHE_TAGS } from "@/constants/cache-tags";

async function getHomePageData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  try {
    const [promotionsRes, plansRes, categoriesRes, newsRes] = await Promise.all([
      fetch(`${apiUrl}/api/promotions?pageSize=10`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.PROMOTIONS] },
      }).catch(() => null),
      fetch(`${apiUrl}/api/service-plans?pageSize=6`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.SERVICE_PLANS] },
      }).catch(() => null),
      fetch(`${apiUrl}/api/service-categories`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.CATEGORIES] },
      }).catch(() => null),
      fetch(`${apiUrl}/api/news?pageSize=3`, {
        next: { revalidate: 60, tags: [CACHE_TAGS.NEWS] },
      }).catch(() => null),
    ]);

    let promotions: PromotionItem[] = [];
    if (promotionsRes && promotionsRes.ok) {
      const pData = await promotionsRes.json();
      promotions = Array.isArray(pData) ? pData : pData.items || [];
    }

    let categories: any[] = [];
    if (categoriesRes && categoriesRes.ok) {
      categories = await categoriesRes.json();
    }

    let plans: FeaturedPlanItem[] = [];
    if (plansRes && plansRes.ok) {
      const plData = await plansRes.json();
      const rawPlans = Array.isArray(plData) ? plData : plData.items || [];

      // Dữ liệu ServicePlans đã có sẵn Prices và CategoryName từ Backend, không cần waterfall fetch
      plans = rawPlans.slice(0, 3).map((plan: any) => {
        const cat = categories.find((c) => c.id === plan.categoryId);
        return {
          ...plan,
          categoryName: plan.categoryName || cat?.name || "Cloud Service",
          prices: plan.prices || [],
        };
      });
    }

    let news: BlogPostItem[] = [];
    if (newsRes && newsRes.ok) {
      const nData = await newsRes.json();
      news = Array.isArray(nData) ? nData : nData.items || nData.Items || [];
    }

    return {
      promotions,
      plans,
      news,
    };
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu trang chủ:", error);
    return {
      promotions: [],
      plans: [],
      news: [],
    };
  }
}

export default async function Home() {
  const { promotions, plans, news } = await getHomePageData();

  return (
    <main className="flex-1 w-full bg-background font-sans overflow-x-hidden">
      {/* Hero Banner Section */}
      <Hero />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Promotions & Campaigns Section (Dữ liệu thực từ API) */}
      <Promotions initialPromotions={promotions} />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Core Services Grid Section */}
      <Services />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Pre-configured Featured Pricing Plans Section (Dữ liệu thực từ API) */}
      <FeaturedPlans initialPlans={plans} />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Interactive Resource Configurator Calculator Section */}
      <Configurator />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Network Stability & SLA Commitments Section */}
      <UptimeSla />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Latest Technical Articles & News Section (Dữ liệu thực từ API) */}
      <LatestNews initialNews={news} />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Solutions Consultant & Direct Hotline Support Section */}
      <SupportContact />
    </main>
  );
}
