import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { slugify } from "@/lib/slugUtils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";

  // 1. Static Public Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dich-vu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bang-gia`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/khach-hang`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 2. Dynamic Categories and Service Plans
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let planRoutes: MetadataRoute.Sitemap = [];

  try {
    const [categoriesRes, plansRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, { cache: "no-store" }).catch(() => null),
      fetch(`${apiUrl}/api/service-plans?pageSize=200`, { cache: "no-store" }).catch(() => null),
    ]);

    let categories: any[] = [];
    if (categoriesRes && categoriesRes.ok) {
      categories = await categoriesRes.json();
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/dich-vu/${cat.slug || slugify(cat.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }

    if (plansRes && plansRes.ok) {
      const plData = await plansRes.json();
      const rawPlans: any[] = Array.isArray(plData) ? plData : plData.items || [];

      planRoutes = rawPlans.map((plan) => {
        const cat = categories.find((c) => c.id === plan.categoryId);
        const catSlug = cat?.slug || slugify(cat?.name || "cloud");
        const planSlug = plan.slug || slugify(plan.name);

        return {
          url: `${baseUrl}/dich-vu/${catSlug}/${planSlug}`,
          lastModified: new Date(plan.updatedAt || plan.createdAt || new Date()),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        };
      });
    }
  } catch (err) {
    console.error("Error generating dynamic plan sitemap:", err);
  }

  // 3. Dynamic Blog Articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const newsRes = await fetch(`${apiUrl}/api/news?pageSize=100`, { cache: "no-store" }).catch(() => null);
    if (newsRes && newsRes.ok) {
      const newsData = await newsRes.json();
      const articles: any[] = Array.isArray(newsData) ? newsData : newsData.items || [];

      blogRoutes = articles.map((post) => ({
        url: `${baseUrl}/blog/${post.slug || slugify(post.title)}`,
        lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      }));
    }
  } catch (err) {
    console.error("Error generating blog sitemap:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...planRoutes, ...blogRoutes];
}
